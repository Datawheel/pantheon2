"use client";

import {useEffect, useRef, useMemo} from "react";
import {initEChart, echarts} from "@/components/utils/echarts";
import {COLORS_DOMAIN, FORMATTERS} from "@/components/utils/consts";
import VizWrapper from "../../../common/VizWrapper";

function getDomainColor(person) {
  const slug = person.occupation?.domain_slug;
  return slug && COLORS_DOMAIN[slug] ? COLORS_DOMAIN[slug] : "#ccc";
}

export default function PeoplePriestley({data, title}) {
  const chartRef = useRef(null);

  const {categories, seriesData, domains, yearMin, yearMax} = useMemo(() => {
    const sorted = [...data].sort((a, b) => a.birthyear - b.birthyear);
    const currentYear = new Date().getFullYear();

    const categories = sorted.map(p => p.name);

    const seriesData = sorted.map((person, i) => {
      const isLiving = person.alive === true && !Number.isFinite(person.deathyear);
      const endYear = isLiving ? currentYear : person.deathyear;

      return [
        i,
        person.birthyear,
        endYear,
        person.name,
        person.occupation?.domain || "",
        getDomainColor(person),
        person.slug,
        isLiving,
      ];
    });

    const births = sorted.map(p => p.birthyear);
    const endYears = seriesData.map(d => d[2]);
    const rawMin = Math.min(...births);
    const rawMax = Math.max(...endYears);

    const pad = Math.max(5, Math.round((rawMax - rawMin) * 0.03));
    const yearMin = rawMin - pad;
    const yearMax = rawMax + pad;

    const domainMap = new Map();
    sorted.forEach(p => {
      const slug = p.occupation?.domain_slug;
      const name = p.occupation?.domain;
      if (slug && name && !domainMap.has(slug)) {
        domainMap.set(slug, {name, color: COLORS_DOMAIN[slug] || "#ccc"});
      }
    });
    const domains = Array.from(domainMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {categories, seriesData, domains, yearMin, yearMax};
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !seriesData.length) return;

    const chart = initEChart(chartRef.current);

    const option = {
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255,255,255,0.97)",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: [10, 14],
        extraCssText: "box-shadow: 0 2px 10px rgba(0,0,0,0.15);",
        formatter: params => {
          if (!params.value) return "";
          const [, birth, endYear, name, domain, , , isLiving] = params.value;
          const lifespan = endYear - birth;
          const endLabel = isLiving ? "Present" : FORMATTERS.year(endYear);
          const lifespanLabel = isLiving ? "Age" : "Lifespan";
          return (
            `<strong style="font-size:14px;">${name}</strong><br/>` +
            `<span style="color:#888;font-size:12px;">${domain}</span><br/>` +
            `<span style="font-size:12px;">${FORMATTERS.year(birth)} – ${endLabel}</span><br/>` +
            `<span style="color:#888;font-size:12px;">${lifespanLabel}: ${lifespan} years</span><br/>` +
            `<span style="color:#aaa;font-size:11px;display:block;margin-top:4px;">Click to view profile</span>`
          );
        },
      },
      grid: {
        left: 50,
        right: 30,
        top: 80,
        bottom: 30,
      },
      xAxis: {
        type: "value",
        min: yearMin,
        max: yearMax,
        interval: 50,
        axisLine: {lineStyle: {color: "#cfcfcf"}},
        axisTick: {lineStyle: {color: "#cfcfcf"}},
        axisLabel: {
          color: "#888",
          fontSize: 11,
          formatter: value => String(value),
        },
        splitLine: {
          show: true,
          lineStyle: {color: "#e8e8e4", width: 1, type: "solid"},
        },
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: categories,
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {show: false},
      },
      graphic: [
        {
          type: "text",
          left: 48,
          top: 16,
          style: {
            text: "OVERLAPPING LIVES",
            fill: "#333",
            font: "700 17px sans-serif",
          },
        },
        {
          type: "text",
          left: 48,
          top: 46,
          style: {
            text: title,
            fill: "#666",
            font: "13px sans-serif",
          },
        },
      ],
      series: [
        {
          type: "custom",
          renderItem: (params, api) => {
            const categoryIndex = api.value(0);
            const start = api.coord([api.value(1), categoryIndex]);
            const end = api.coord([api.value(2), categoryIndex]);
            const rowH = api.size([0, 1])[1];
            const barH = Math.max(6, Math.min(36, rowH * 0.72));
            const color = String(api.value(5));
            const name = String(api.value(3));

            const rectShape = echarts.graphic.clipRectByRect(
              {
                x: start[0],
                y: start[1] - barH / 2,
                width: end[0] - start[0],
                height: barH,
              },
              {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height,
              }
            );

            if (!rectShape) return null;

            const fs = Math.min(13, Math.max(9, Math.round(barH * 0.48)));
            const showLabel = rectShape.width > 40 && barH >= 13;

            const children = [
              {
                type: "rect",
                shape: rectShape,
                style: {fill: color},
              },
            ];

            if (showLabel) {
              children.push({
                type: "text",
                style: {
                  x: rectShape.x + 6,
                  y: rectShape.y + rectShape.height / 2,
                  text: name,
                  fill: "rgba(255,255,255,0.9)",
                  font: `${fs}px sans-serif`,
                  textVerticalAlign: "middle",
                  overflow: "truncate",
                  width: rectShape.width - 12,
                },
              });
            }

            return {type: "group", children};
          },
          data: seriesData,
          encode: {x: [1, 2], y: 0},
        },
      ],
    };

    chart.setOption(option, {notMerge: true});

    chart.on("click", params => {
      if (params.value) {
        const slug = params.value[6];
        if (slug) window.location.href = `/profile/person/${slug}`;
      }
    });

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => chart.resize());
      ro.observe(chartRef.current);
    } else {
      const onResize = () => chart.resize();
      window.addEventListener("resize", onResize);
      ro = {disconnect: () => window.removeEventListener("resize", onResize)};
    }

    return () => {
      ro.disconnect();
      chart.dispose();
    };
  }, [categories, seriesData, yearMin, yearMax, title]);

  return (
    <VizWrapper>
      <div>
        <div
          ref={chartRef}
          style={{width: "100%", height: "600px"}}
          role="img"
          aria-label={title}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px 18px",
            margin: "12px auto 0",
            padding: "0 12px",
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
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  backgroundColor: d.color,
                  flexShrink: 0,
                }}
              />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </VizWrapper>
  );
}
