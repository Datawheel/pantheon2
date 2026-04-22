"use client";

import {useEffect, useMemo, useRef} from "react";
import {
  prepareWithSegments,
  measureLineStats,
  measureNaturalWidth,
  layoutWithLines,
} from "@chenglou/pretext";
import {COLORS_CONTINENT, FORMATTERS} from "../../../utils/consts";
import {initEChart} from "@/components/utils/echarts";

const LABEL_FONT_FAMILY = '"Amiko", Arial, sans-serif';
const LINE_HEIGHT_MUL = 1.08;
const NAME_PCT_RATIO = 0.48;
const NAME_MAX = 72;
const NAME_MIN = 9;
const PAD_X = 10;
const PAD_TOP = 8;
const PAD_BOTTOM = 8;
const NAME_PERCENT_GAP = 4;
const MIN_LABEL_WIDTH = 28;
const MIN_LABEL_HEIGHT = 22;
const MAX_LABEL_CACHE_SIZE = 1500;

function assignColorsFromParent(data, continentColors) {
  return data.map(continentNode => {
    const continentColor = continentColors[continentNode.name] || "#ccc";

    function applyColorRecursively(node) {
      const newNode = {
        ...node,
        itemStyle: {color: continentColor},
      };

      if (node.children) {
        newNode.children = node.children.map(applyColorRecursively);
      }

      return newNode;
    }

    return applyColorRecursively(continentNode);
  });
}

function getLegendItems(data) {
  return data
    .map(node => ({
      name: node.name,
      color: node.itemStyle?.color || COLORS_CONTINENT[node.name] || "#ccc",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getTreeTotal(data) {
  return data.reduce((sum, node) => sum + (node.value || 0), 0);
}

function fitLabelWithPretext(name, percentText, availW, availH) {
  if (availW <= 0 || availH <= 0) return null;

  const nameFont = fs => `bold ${fs}px ${LABEL_FONT_FAMILY}`;
  const pctFont = fs => `normal ${fs}px ${LABEL_FONT_FAMILY}`;
  const widestWordCache = new Map();
  const nameStatsCache = new Map();
  const pctStatsCache = new Map();

  const hasSpace = /\s/.test(name);
  const widestWordAt = fs => {
    if (widestWordCache.has(fs)) return widestWordCache.get(fs);

    let width = 0;
    if (!hasSpace) {
      const prepared = prepareWithSegments(name, nameFont(fs));
      width = measureNaturalWidth(prepared);
    } else {
      const prepared = prepareWithSegments(name.replace(/\s+/g, "\n"), nameFont(fs), {
        whiteSpace: "pre-wrap",
      });
      width = measureNaturalWidth(prepared);
    }

    widestWordCache.set(fs, width);
    return width;
  };

  const fits = fs => {
    if (fs < NAME_MIN) return false;

    const percentFs = Math.max(8, Math.round(fs * NAME_PCT_RATIO));
    const nameLineH = fs * LINE_HEIGHT_MUL;
    const percentLineH = percentFs * LINE_HEIGHT_MUL;

    let pctStats = pctStatsCache.get(percentFs);
    if (!pctStats) {
      const pctPrepared = prepareWithSegments(percentText, pctFont(percentFs));
      pctStats = measureLineStats(pctPrepared, availW);
      pctStatsCache.set(percentFs, pctStats);
    }
    if (pctStats.maxLineWidth > availW + 0.5 || pctStats.lineCount !== 1) {
      return false;
    }

    if (widestWordAt(fs) > availW + 0.5) return false;

    let stats = nameStatsCache.get(fs);
    if (!stats) {
      const namePrepared = prepareWithSegments(name, nameFont(fs));
      stats = measureLineStats(namePrepared, availW);
      nameStatsCache.set(fs, stats);
    }
    if (stats.maxLineWidth > availW + 0.5 || stats.lineCount > 3) {
      return false;
    }

    return stats.lineCount * nameLineH + NAME_PERCENT_GAP + percentLineH <= availH;
  };

  const upper = Math.min(NAME_MAX, Math.floor(availH * 0.72));
  if (upper < NAME_MIN || !fits(NAME_MIN)) return null;

  let lo = NAME_MIN;
  let hi = upper;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (fits(mid)) lo = mid;
    else hi = mid - 1;
  }

  const nameFontSize = lo;
  const percentFontSize = Math.max(8, Math.round(nameFontSize * NAME_PCT_RATIO));
  const nameLineHeight = nameFontSize * LINE_HEIGHT_MUL;
  const prepared = prepareWithSegments(name, nameFont(nameFontSize));
  const laid = layoutWithLines(prepared, availW, nameLineHeight);

  return {
    nameFontSize,
    percentFontSize,
    nameLineHeight,
    nameLines: laid.lines.map(line => line.text),
  };
}

function getAbsoluteRect(node, seriesModel) {
  let x = 0;
  let y = 0;
  let cur = node;

  while (cur) {
    const layout = cur.getLayout && cur.getLayout();
    if (layout) {
      x += layout.x || 0;
      y += layout.y || 0;
    }
    cur = cur.parentNode;
  }

  const info = seriesModel.layoutInfo || {x: 0, y: 0};
  x += info.x || 0;
  y += info.y || 0;

  const layout = node.getLayout();
  return {x, y, width: layout.width, height: layout.height};
}

function buildGraphicLabels(chart, total, fitCache) {
  const seriesModel = chart.getModel && chart.getModel().getSeriesByIndex(0);
  if (!seriesModel || !seriesModel.getViewRoot) return [];

  const root = seriesModel.getViewRoot();
  const labels = [];
  let id = 0;

  const visit = node => {
    const hasChildren = node.children && node.children.length > 0;
    const layout = node.getLayout && node.getLayout();

    if (layout && !hasChildren) {
      const rect = getAbsoluteRect(node, seriesModel);
      const name = node.name || "";
      const value = node.getValue();
      const percent = total ? `${((value / total) * 100).toFixed(1)}%` : "";
      const availW = Math.floor(rect.width - PAD_X * 2);
      const availH = Math.floor(rect.height - PAD_TOP - PAD_BOTTOM);

      if (
        name &&
        percent &&
        availW >= MIN_LABEL_WIDTH &&
        availH >= MIN_LABEL_HEIGHT
      ) {
        const cacheKey = `${name}|${percent}|${availW}|${availH}`;
        let fit = fitCache.get(cacheKey);
        if (fit === undefined) {
          fit = fitLabelWithPretext(name, percent, availW, availH);
          if (fitCache.size >= MAX_LABEL_CACHE_SIZE) fitCache.clear();
          fitCache.set(cacheKey, fit);
        }

        if (fit) {
          labels.push({
            id: `name_${id++}`,
            type: "text",
            silent: true,
            z: 50,
            x: rect.x + PAD_X,
            y: rect.y + PAD_TOP,
            style: {
              text: fit.nameLines.join("\n"),
              font: `bold ${fit.nameFontSize}px ${LABEL_FONT_FAMILY}`,
              fill: "#f4f4f1",
              align: "left",
              verticalAlign: "top",
              lineHeight: fit.nameLineHeight,
              textStroke: "rgba(0, 0, 0, 0.32)",
              textStrokeWidth: Math.max(1, fit.nameFontSize * 0.04),
            },
          });

          labels.push({
            id: `pct_${id++}`,
            type: "text",
            silent: true,
            z: 50,
            x: rect.x + PAD_X,
            y: rect.y + rect.height - PAD_BOTTOM,
            style: {
              text: percent,
              font: `normal ${fit.percentFontSize}px ${LABEL_FONT_FAMILY}`,
              fill: "#f4f4f1",
              align: "left",
              verticalAlign: "bottom",
              textStroke: "rgba(0, 0, 0, 0.28)",
              textStrokeWidth: Math.max(0.75, fit.percentFontSize * 0.04),
            },
          });
        }
      }
    }

    if (hasChildren) {
      node.children.forEach(visit);
    }
  };

  visit(root);
  return labels;
}

export default function PlacesTmap({baseOption, style}) {
  const chartRef = useRef(null);
  const fitCacheRef = useRef(new Map());

  const {coloredData, legendItems, total} = useMemo(() => {
    const seriesData = baseOption?.series?.[0]?.data || [];
    const nextData = assignColorsFromParent(seriesData, COLORS_CONTINENT);
    return {
      coloredData: nextData,
      legendItems: getLegendItems(nextData),
      total: getTreeTotal(nextData),
    };
  }, [baseOption]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = initEChart(chartRef.current);
    fitCacheRef.current.clear();

    const option = JSON.parse(JSON.stringify(baseOption));
    option.richInheritPlainLabel = false;
    option.series[0].data = coloredData;
    option.series[0].label = {show: false};
    option.series[0].upperLabel = {show: false};
    option.series[0].leafDepth = 2;
    option.series[0].visibleMin = 1;
    option.series[0].emphasis = {
      label: {show: false},
      upperLabel: {show: false},
      itemStyle: {
        shadowBlur: 12,
        shadowColor: "rgba(0, 0, 0, 0.35)",
      },
    };
    option.series[0].levels = [
      {
        itemStyle: {
          gapWidth: 4,
          borderWidth: 0,
          borderColor: "#f4f4f1",
        },
        upperLabel: {show: false},
      },
      {
        itemStyle: {
          gapWidth: 1,
          borderWidth: 1,
          borderColor: "#f4f4f1",
        },
        label: {show: false},
        emphasis: {disabled: true},
      },
    ];

    option.tooltip = {
      trigger: "item",
      confine: true,
      backgroundColor: "rgba(255, 255, 255, 0.97)",
      borderColor: "#ccc",
      borderWidth: 1,
      padding: [10, 12],
      extraCssText:
        "box-shadow: 0 2px 10px rgba(0,0,0,0.15); max-width: 280px;",
      textStyle: {color: "#333", fontSize: 12, lineHeight: 16},
      formatter: info => {
        const {name, value, data} = info;
        const percent = total ? ((value / total) * 100).toFixed(2) : "0.00";
        const path = (info.treeAncestors || info.treePathInfo || [])
          .slice(1)
          .map(item => item.name)
          .filter(Boolean)
          .join(" › ");

        let html = "";
        if (path) {
          html += `<div style="font-size: 10px; letter-spacing: 0.5px; color: #888; text-transform: uppercase; margin-bottom: 3px;">${path}</div>`;
        }
        html += `<div style="font-weight: 700; font-size: 15px; color: #222;">${name}</div>`;
        html += `<div style="font-size: 12px; color: #666; margin-top: 2px;">${value.toLocaleString()} ${value === 1 ? "person" : "people"} · ${percent}%</div>`;
        if (data?.topPeople?.length && !data?.children?.length) {
          const peopleLabel = data.topPeople.length === 1 ? "Person" : "People";
          html += `<div style="margin-top: 10px; font-size: 10px; letter-spacing: 0.5px; color: #888; text-transform: uppercase;">Top Ranked ${peopleLabel}</div>`;
          data.topPeople.forEach(person => {
            const yearValue =
              person.birthyear != null ? person.birthyear : person.deathyear;
            const yearStr =
              yearValue != null ? `b.${FORMATTERS.year(yearValue)}` : "";
            html += `<div style="margin-top: 2px; font-size: 12px;"><strong style="color: #222;">${person.name}</strong> <span style="color: #888;">${yearStr}</span></div>`;
          });
        }
        return html;
      },
    };

    chart.setOption(option, {notMerge: true, lazyUpdate: true});

    let cancelled = false;
    let firstFrame = null;
    let secondFrame = null;
    let resizeObserver = null;

    const applyLabels = () => {
      if (cancelled) return;
      const labels = buildGraphicLabels(chart, total, fitCacheRef.current);
      chart.setOption(
        {graphic: {elements: labels, $action: "replace"}},
        {lazyUpdate: true}
      );
    };

    const scheduleLabelPass = () => {
      if (firstFrame) cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        firstFrame = null;
        secondFrame = requestAnimationFrame(() => {
          secondFrame = null;
          applyLabels();
        });
      });
    };

    scheduleLabelPass();

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) scheduleLabelPass();
      });
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        chart.resize();
        scheduleLabelPass();
      });
      resizeObserver.observe(chartRef.current);
    } else {
      const handleResize = () => {
        chart.resize();
        scheduleLabelPass();
      };
      window.addEventListener("resize", handleResize);
      resizeObserver = {
        disconnect: () => window.removeEventListener("resize", handleResize),
      };
    }

    return () => {
      cancelled = true;
      if (firstFrame) cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
      if (resizeObserver) resizeObserver.disconnect();
      chart.dispose();
    };
  }, [baseOption, coloredData, total]);

  return (
    <div>
      <div
        ref={chartRef}
        style={{width: "100%", height: "600px", ...(style || {})}}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 18px",
          margin: "14px auto 0",
          padding: "0 12px",
          maxWidth: 960,
        }}
      >
        {legendItems.map(item => (
          <div
            key={item.name}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              lineHeight: "16px",
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 2,
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
