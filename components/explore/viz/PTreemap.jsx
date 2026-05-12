"use client";

import {useEffect, useMemo, useRef} from "react";
import {
  prepareWithSegments,
  measureLineStats,
  measureNaturalWidth,
  layoutWithLines,
} from "@chenglou/pretext";
import {initEChart} from "@/components/utils/echarts";
import {
  TOOLTIP_STYLE,
  buildExploreRows,
  buildTreeData,
  escapeHtml,
  formatTopPeopleHtml,
  legendItemsFromTree,
  treeTotal,
} from "./echartsData";

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

function profilePath(profileType, slug) {
  if (!profileType || !slug) return null;
  return `/profile/${profileType}/${slug}`;
}

const ROOT_LEVEL = {
  itemStyle: {
    gapWidth: 4,
    borderWidth: 0,
    borderColor: "#f4f4f1",
  },
  upperLabel: {show: false},
};

const PARENT_LEVEL = {
  itemStyle: {
    gapWidth: 2,
    borderWidth: 0,
    borderColor: "#f4f4f1",
  },
  label: {show: false},
  upperLabel: {show: false},
  emphasis: {disabled: true},
};

const LEAF_LEVEL = {
  itemStyle: {
    borderWidth: 1,
    borderColor: "#f4f4f1",
  },
  label: {show: false},
};

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

  const fits = (fs, allowBreakWord) => {
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

    if (!allowBreakWord && widestWordAt(fs) > availW + 0.5) return false;

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

  const searchLargest = allowBreakWord => {
    const upper = Math.min(NAME_MAX, Math.floor(availH * 0.7));
    if (upper < NAME_MIN || !fits(NAME_MIN, allowBreakWord)) return 0;

    let lo = NAME_MIN;
    let hi = upper;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      if (fits(mid, allowBreakWord)) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  let nameFontSize = searchLargest(false);
  if (!nameFontSize) nameFontSize = searchLargest(true);
  if (!nameFontSize) return null;

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
  let current = node;

  while (current) {
    const layout = current.getLayout && current.getLayout();
    if (layout) {
      x += layout.x || 0;
      y += layout.y || 0;
    }
    current = current.parentNode;
  }

  const info = seriesModel.layoutInfo || {x: 0, y: 0};
  const layout = node.getLayout();
  return {
    x: x + (info.x || 0),
    y: y + (info.y || 0),
    width: layout.width,
    height: layout.height,
  };
}

function buildGraphicLabels(chart, total, fitCache) {
  const seriesModel = chart.getModel && chart.getModel().getSeriesByIndex(0);
  if (!seriesModel || !seriesModel.getViewRoot) return [];

  const labels = [];
  const root = seriesModel.getViewRoot();
  let id = 0;

  const visit = node => {
    const hasChildren = node.children && node.children.length > 0;
    const layout = node.getLayout && node.getLayout();

    if (layout && !hasChildren) {
      const rect = getAbsoluteRect(node, seriesModel);
      const name = (node.name || "").toUpperCase();
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

    if (hasChildren) node.children.forEach(visit);
  };

  visit(root);
  return labels;
}

export default function PTreemap({data, occupations, show, yearType}) {
  const chartRef = useRef(null);
  const fitCacheRef = useRef(new Map());
  const isPlaces = show?.type === "places";

  const {treeData, total, legendItems} = useMemo(() => {
    const {rows, levels} = buildExploreRows(data, occupations, show, yearType);
    const tree = buildTreeData(rows, levels);
    return {
      treeData: tree,
      total: treeTotal(tree),
      legendItems: legendItemsFromTree(tree),
    };
  }, [data, occupations, show, yearType]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !treeData.length) return;

    const chart = initEChart(element);
    fitCacheRef.current.clear();
    const levelConfig = isPlaces
      ? [ROOT_LEVEL, PARENT_LEVEL, LEAF_LEVEL]
      : [
          ROOT_LEVEL,
          PARENT_LEVEL,
          {
            ...PARENT_LEVEL,
            itemStyle: {
              gapWidth: 1,
              borderWidth: 0,
              borderColor: "#f4f4f1",
            },
          },
          LEAF_LEVEL,
        ];
    const option = {
      tooltip: {
        ...TOOLTIP_STYLE,
        formatter: params => {
          if (!params?.data) return "";
          const {data: datum, name, value} = params;
          const percent = total
            ? ((Number(value) / total) * 100).toFixed(2)
            : "0.00";
          const ancestors = params.treeAncestors || params.treePathInfo || [];
          const path = ancestors
            .slice(1)
            .map(item => item.name)
            .filter(item => item && item !== name)
            .join(" › ");

          let html = "";
          if (path) {
            html += `<div style="font-size: 10px; letter-spacing: 0.5px; color: #888; text-transform: uppercase; margin-bottom: 3px;">${escapeHtml(path)}</div>`;
          }
          html += `<div style="font-weight: 700; font-size: 15px; color: #222;">${escapeHtml(name)}</div>`;
          html += `<div style="font-size: 12px; color: #666; margin-top: 2px;">${Number(value).toLocaleString()} ${value === 1 ? "person" : "people"} · ${percent}%</div>`;
          html += formatTopPeopleHtml(datum.topPeople);
          if (profilePath(datum.profileType, datum.slug)) {
            html += `<div style="margin-top: 8px; font-size: 10px; color: #aaa;">Click to view profile</div>`;
          }
          return html;
        },
      },
      series: [
        {
          type: "treemap",
          top: 4,
          bottom: 4,
          left: 4,
          right: 4,
          width: "auto",
          height: "auto",
          roam: false,
          nodeClick: false,
          breadcrumb: {show: false},
          animationDurationUpdate: 400,
          leafDepth: isPlaces ? 2 : 3,
          visibleMin: 1,
          data: treeData,
          itemStyle: {
            borderColor: "#f4f4f1",
            borderWidth: 1,
            gapWidth: 1,
          },
          label: {show: false},
          upperLabel: {show: false},
          levels: levelConfig,
          emphasis: {
            label: {show: false},
            itemStyle: {
              shadowBlur: 12,
              shadowColor: "rgba(0, 0, 0, 0.35)",
            },
          },
        },
      ],
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

    const handleClick = params => {
      const path = profilePath(params?.data?.profileType, params?.data?.slug);
      if (path) window.location.href = path;
    };
    chart.on("click", handleClick);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        chart.resize();
        scheduleLabelPass();
      });
      resizeObserver.observe(element);
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
      chart.off("click", handleClick);
      chart.dispose();
    };
  }, [treeData, total, isPlaces]);

  if (!treeData.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="pantheon-echart-shell">
      <div
        className="pantheon-echart pantheon-echart-treemap"
        ref={chartRef}
        role="img"
        aria-label="Explore treemap"
      />
      <div className="pantheon-echart-legend">
        {legendItems.map(item => (
          <div className="pantheon-echart-legend-item" key={item.name}>
            <span style={{backgroundColor: item.color}} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
