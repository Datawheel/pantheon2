"use client";

import {useEffect, useMemo, useRef} from "react";
import {
  prepareWithSegments,
  measureLineStats,
  measureNaturalWidth,
  layoutWithLines,
} from "@chenglou/pretext";
import VizWrapper from "../../../common/VizWrapper";
import {COLORS_DOMAIN} from "../../../utils/consts";
import {initEChart} from "@/components/utils/echarts";
import {DEFAULT_LOCALE} from "@/app/locales";
import {
  formatExploreNumber,
  formatExploreYear,
} from "@/app/exploreTranslations";
import {getLocationTranslations} from "@/app/locationTranslations";

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

function trackTopPeople(topPeople, person) {
  const score = person?.hpi || 0;

  if (!topPeople.length) {
    topPeople.push(person);
    return;
  }

  let inserted = false;
  for (let index = 0; index < topPeople.length; index += 1) {
    if (score > (topPeople[index]?.hpi || 0)) {
      topPeople.splice(index, 0, person);
      inserted = true;
      break;
    }
  }

  if (!inserted && topPeople.length < 3) {
    topPeople.push(person);
  }

  if (topPeople.length > 3) {
    topPeople.length = 3;
  }
}

function buildTreeData(data) {
  const domainMap = new Map();

  data.forEach(person => {
    if (!person.occupation) return;
    const {
      occupation: occupationName,
      industry,
      domain,
      domain_slug: domainSlug,
      occupation_slug: occupationSlug,
    } = person.occupation;
    if (!domain || !industry || !occupationName) return;
    const color = COLORS_DOMAIN[domainSlug] || "#ccc";

    let domainNode = domainMap.get(domain);
    if (!domainNode) {
      domainNode = {
        name: domain,
        color,
        domainSlug,
        industries: new Map(),
        count: 0,
        topPeople: [],
      };
      domainMap.set(domain, domainNode);
    }
    domainNode.count += 1;
    trackTopPeople(domainNode.topPeople, person);

    let industryNode = domainNode.industries.get(industry);
    if (!industryNode) {
      industryNode = {
        name: industry,
        color,
        occupations: new Map(),
        count: 0,
        topPeople: [],
      };
      domainNode.industries.set(industry, industryNode);
    }
    industryNode.count += 1;
    trackTopPeople(industryNode.topPeople, person);

    let occupationNode = industryNode.occupations.get(occupationName);
    if (!occupationNode) {
      occupationNode = {
        name: occupationName,
        color,
        occupationSlug,
        count: 0,
        topPeople: [],
      };
      industryNode.occupations.set(occupationName, occupationNode);
    }
    occupationNode.count += 1;
    trackTopPeople(occupationNode.topPeople, person);
  });

  return Array.from(domainMap.values()).map(domain => {
    const industries = Array.from(domain.industries.values()).map(industry => {
      const occupations = Array.from(industry.occupations.values()).map(
        occ => ({
          name: occ.name,
          value: occ.count,
          itemStyle: {color: occ.color},
          occupationSlug: occ.occupationSlug,
          domainName: domain.name,
          industryName: industry.name,
          topPeople: occ.topPeople,
        })
      );
      return {
        name: industry.name,
        itemStyle: {color: industry.color},
        domainName: domain.name,
        topPeople: industry.topPeople,
        children: occupations,
      };
    });
    return {
      name: domain.name,
      itemStyle: {color: domain.color},
      domainSlug: domain.domainSlug,
      topPeople: domain.topPeople,
      children: industries,
    };
  });
}

function totalFromTree(tree) {
  return tree.reduce(
    (sum, domain) =>
      sum +
      domain.children.reduce(
        (iSum, industry) =>
          iSum +
          industry.children.reduce((oSum, occ) => oSum + occ.value, 0),
        0
      ),
    0
  );
}

function uniqueDomains(tree) {
  return tree
    .map(d => ({
      name: d.name,
      color: d.itemStyle.color,
      slug: d.domainSlug,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ---------- Pretext-backed label fitting ----------

// Largest font size such that `name` wraps to `availW` at word boundaries (no
// mid-word breaks unless the tile is very narrow), plus a percent line at
// `fs * NAME_PCT_RATIO`, fits in availH.
function fitLabelWithPretext(name, percentText, availW, availH) {
  if (availW <= 0 || availH <= 0) return null;

  const nameFont = fs => `bold ${fs}px ${LABEL_FONT_FAMILY}`;
  const pctFont = fs => `normal ${fs}px ${LABEL_FONT_FAMILY}`;
  const widestWordCache = new Map();
  const nameStatsCache = new Map();
  const pctStatsCache = new Map();

  // Widest individual word at this fs (use pre-wrap + hard breaks on spaces so
  // measureNaturalWidth returns max(wordWidths)).
  const hasSpace = /\s/.test(name);
  const widestWordAt = fs => {
    if (widestWordCache.has(fs)) return widestWordCache.get(fs);

    let width = 0;
    if (!hasSpace) {
      const p = prepareWithSegments(name, nameFont(fs));
      width = measureNaturalWidth(p);
    } else {
      const hardBroken = name.replace(/\s+/g, "\n");
      const p = prepareWithSegments(hardBroken, nameFont(fs), {
        whiteSpace: "pre-wrap",
      });
      width = measureNaturalWidth(p);
    }

    widestWordCache.set(fs, width);
    return width;
  };

  const fits = (fs, allowBreakWord) => {
    if (fs < NAME_MIN) return false;
    const percentFs = Math.max(8, Math.round(fs * NAME_PCT_RATIO));
    const nameLineH = fs * LINE_HEIGHT_MUL;
    const percentLineH = percentFs * LINE_HEIGHT_MUL;

    // Percent must fit one line.
    let pctStats = pctStatsCache.get(percentFs);
    if (!pctStats) {
      const pctPrepared = prepareWithSegments(percentText, pctFont(percentFs));
      pctStats = measureLineStats(pctPrepared, availW);
      pctStatsCache.set(percentFs, pctStats);
    }
    if (pctStats.maxLineWidth > availW + 0.5) return false;
    if (pctStats.lineCount !== 1) return false;

    // When not permitting mid-word breaks, require widest word to fit.
    if (!allowBreakWord && widestWordAt(fs) > availW + 0.5) return false;

    let stats = nameStatsCache.get(fs);
    if (!stats) {
      const namePrepared = prepareWithSegments(name, nameFont(fs));
      stats = measureLineStats(namePrepared, availW);
      nameStatsCache.set(fs, stats);
    }
    if (stats.maxLineWidth > availW + 0.5) return false;

    // Cap wrap depth so single words don't shred into many slivers.
    const maxLines = allowBreakWord ? 3 : 3;
    if (stats.lineCount > maxLines) return false;

    const totalH =
      stats.lineCount * nameLineH + NAME_PERCENT_GAP + percentLineH;
    return totalH <= availH;
  };

  const searchLargest = allowBreakWord => {
    const upper = Math.min(NAME_MAX, Math.floor(availH * 0.7));
    if (upper < NAME_MIN) return 0;
    if (!fits(NAME_MIN, allowBreakWord)) return 0;
    let lo = NAME_MIN;
    let hi = upper;
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      if (fits(mid, allowBreakWord)) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };

  // First try word-boundary wrapping only (no ugly mid-word breaks).
  let nameFs = searchLargest(false);
  // Fall back to allowing mid-word breaks only if word-boundary fit totally fails.
  if (!nameFs) nameFs = searchLargest(true);
  if (!nameFs) return null;

  const percentFs = Math.max(8, Math.round(nameFs * NAME_PCT_RATIO));
  const nameLineH = nameFs * LINE_HEIGHT_MUL;

  const namePrepared = prepareWithSegments(name, nameFont(nameFs));
  const laid = layoutWithLines(namePrepared, availW, nameLineH);
  const lines = laid.lines.map(l => l.text);

  return {
    nameFontSize: nameFs,
    percentFontSize: percentFs,
    nameLines: lines,
    nameLineHeight: nameLineH,
  };
}

// Walk up the tree summing each node's layout offset, then add the series
// containerGroup position (seriesModel.layoutInfo). ECharts treemap stores
// layouts as offsets from each node's parent group, so a leaf's canvas
// position is the accumulated chain plus the series offset.
function getAbsoluteRect(node, seriesModel) {
  let x = 0;
  let y = 0;
  let cur = node;
  while (cur) {
    const l = cur.getLayout && cur.getLayout();
    if (l) {
      x += l.x || 0;
      y += l.y || 0;
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
      const name = (node.name || "").toUpperCase();
      const value = node.getValue();
      const percent = total
        ? ((value / total) * 100).toFixed(1) + "%"
        : "";

      const availW = Math.floor(rect.width - PAD_X * 2);
      const availH = Math.floor(rect.height - PAD_TOP - PAD_BOTTOM);

      if (
        availW >= MIN_LABEL_WIDTH &&
        availH >= MIN_LABEL_HEIGHT &&
        name &&
        percent
      ) {
        const cacheKey = `${name}|${percent}|${availW}|${availH}`;
        let fit = fitCache.get(cacheKey);
        if (fit === undefined) {
          fit = fitLabelWithPretext(name, percent, availW, availH);
          if (fitCache.size >= MAX_LABEL_CACHE_SIZE) fitCache.clear();
          fitCache.set(cacheKey, fit);
        }

        if (fit) {
          // NOTE: graphic type "text" is a ZRText — use `align`/`verticalAlign`
          // (ZRText's layout props), NOT canvas-level `textAlign`/`textBaseline`
          // (unknown verticalAlign values fall back to 'top').
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

export default function OccupationsTmap({data, title, lang = "en"}) {
  const chartRef = useRef(null);
  const fitCacheRef = useRef(new Map());
  const t = useMemo(() => getLocationTranslations(lang), [lang]);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;

  const {treeData, total, domains} = useMemo(() => {
    const tree = buildTreeData(data);
    return {
      treeData: tree,
      total: totalFromTree(tree),
      domains: uniqueDomains(tree),
    };
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = initEChart(chartRef.current);
    fitCacheRef.current.clear();

    const option = {
      title: {
        text: title,
        left: "center",
        top: 6,
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#2a2a2a",
        },
      },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          "box-shadow: 0 2px 10px rgba(0,0,0,0.15); max-width: 300px;",
        textStyle: {color: "#333", fontSize: 12, lineHeight: 16},
        formatter: params => {
          if (!params || !params.data) return "";
          const {name, data: datum, value} = params;
          const percent = total
            ? ((value / total) * 100).toFixed(2)
            : "0.00";
          const peopleLabel =
            datum.topPeople && datum.topPeople.length === 1
              ? t("topRankedPerson")
              : t("topRankedPeople");

          const ancestors = params.treeAncestors || params.treePathInfo || [];
          const path = ancestors
            .slice(1)
            .map(a => a.name)
            .filter(n => n && n !== name)
            .join(" › ");

          let html = "";
          if (path) {
            html += `<div style="font-size: 10px; letter-spacing: 0.5px; color: #888; text-transform: uppercase; margin-bottom: 3px;">${path}</div>`;
          }
          html += `<div style="font-weight: 700; font-size: 15px; color: #222;">${name}</div>`;
          html += `<div style="font-size: 12px; color: #666; margin-top: 2px;">${formatExploreNumber(value, lang)} ${value === 1 ? t("person") : t("peopleCount")} · ${percent}%</div>`;

          if (datum.topPeople && datum.topPeople.length) {
            html += `<div style="margin-top: 10px; font-size: 10px; letter-spacing: 0.5px; color: #888; text-transform: uppercase;">${peopleLabel}</div>`;
            datum.topPeople.forEach(p => {
              const yearStr =
                p.birthyear != null
                  ? t("bornAbbreviation", {
                      year: formatExploreYear(p.birthyear, lang),
                    })
                  : "";
              html += `<div style="margin-top: 2px; font-size: 12px;"><strong style="color: #222;">${p.name}</strong> <span style="color: #888;">${yearStr}</span></div>`;
            });
          }
          if (datum.occupationSlug) {
            html += `<div style="margin-top: 8px; font-size: 10px; color: #aaa;">${t("clickToViewProfile")}</div>`;
          }
          return html;
        },
      },
      series: [
        {
          type: "treemap",
          top: 36,
          bottom: 4,
          left: 4,
          right: 4,
          width: "auto",
          height: "auto",
          roam: false,
          nodeClick: false,
          breadcrumb: {show: false},
          animationDurationUpdate: 400,
          leafDepth: 3,
          visibleMin: 1,
          data: treeData,
          itemStyle: {
            borderColor: "#f4f4f1",
            borderWidth: 1,
            gapWidth: 1,
          },
          label: {show: false},
          upperLabel: {show: false},
          levels: [
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
                gapWidth: 2,
                borderWidth: 0,
                borderColor: "#f4f4f1",
              },
              label: {show: false},
              upperLabel: {show: false},
              emphasis: {disabled: true},
            },
            {
              itemStyle: {
                gapWidth: 1,
                borderWidth: 0,
                borderColor: "#f4f4f1",
              },
              label: {show: false},
              upperLabel: {show: false},
              emphasis: {disabled: true},
            },
            {
              itemStyle: {
                borderWidth: 1,
                borderColor: "#f4f4f1",
              },
              label: {show: false},
            },
          ],
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
      if (params && params.data && params.data.occupationSlug) {
        window.location.href = `${localePrefix}/profile/occupation/${params.data.occupationSlug}`;
      }
    };
    chart.on("click", handleClick);

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
      chart.off("click", handleClick);
      chart.dispose();
    };
  }, [lang, localePrefix, t, title, total, treeData]);

  return (
    <VizWrapper>
      <div>
        <div
          ref={chartRef}
          style={{width: "100%", height: "560px"}}
          role="img"
          aria-label={title}
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
          {domains.map(d => (
            <div
              key={d.name}
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
                  backgroundColor: d.color,
                  flexShrink: 0,
                }}
              />
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </VizWrapper>
  );
}
