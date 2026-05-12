"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import * as topojson from "topojson-client";
import {initEChart, echarts} from "@/components/utils/echarts";
import {
  escapeHtml,
  formatTopPeopleHtml,
  setupResize,
} from "./echartsData";

const WORLD_MAP_NAME = "pantheon-explore-world";
const WORLD_LAYOUT_SIZE = "150%";
let worldFeaturesPromise = null;
let worldRegistered = false;

function ringCrossesAntimeridian(ring) {
  for (let index = 1; index < ring.length; index += 1) {
    if (Math.abs(ring[index][0] - ring[index - 1][0]) > 180) return true;
  }
  return false;
}

function sanitizeFeature(feature) {
  if (!feature.geometry) return null;

  if (feature.geometry.type === "Polygon") {
    const coordinates = feature.geometry.coordinates.filter(
      ring => !ringCrossesAntimeridian(ring)
    );
    if (!coordinates.length) return null;
    return {...feature, geometry: {...feature.geometry, coordinates}};
  }

  if (feature.geometry.type === "MultiPolygon") {
    const coordinates = feature.geometry.coordinates
      .map(polygon => polygon.filter(ring => !ringCrossesAntimeridian(ring)))
      .filter(polygon => polygon.length);
    if (!coordinates.length) return null;
    return {...feature, geometry: {...feature.geometry, coordinates}};
  }

  return feature;
}

function loadWorldFeatures() {
  if (!worldFeaturesPromise) {
    worldFeaturesPromise = fetch("/jsons/world-50m.json")
      .then(response => response.json())
      .then(topo => {
        const geo = topojson.feature(topo, topo.objects.countries);
        return {
          type: "FeatureCollection",
          features: geo.features
            .filter(feature => feature.id !== "010")
            .map(feature => ({
              ...feature,
              properties: {
                ...(feature.properties || {}),
                name: feature.id,
              },
            }))
            .map(sanitizeFeature)
            .filter(Boolean),
        };
      });
  }
  return worldFeaturesPromise;
}

function ensureWorldRegistered(geojson) {
  if (!worldRegistered) {
    echarts.registerMap(WORLD_MAP_NAME, {geoJSON: geojson});
    worldRegistered = true;
  }
}

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function trackTopPeople(topPeople, person) {
  if (!person?.name) return;
  const score = person.hpi || 0;
  let inserted = false;
  for (let index = 0; index < topPeople.length; index += 1) {
    if (score > (topPeople[index]?.hpi || 0)) {
      topPeople.splice(index, 0, person);
      inserted = true;
      break;
    }
  }
  if (!inserted && topPeople.length < 3) topPeople.push(person);
  if (topPeople.length > 3) topPeople.length = 3;
}

function buildMapPoints(data) {
  const byPlace = new Map();
  const rows = (data || [])
    .filter(row => row.bplace_geonameid?.lat && row.bplace_geonameid?.lon)
    .sort((a, b) => (b.l || 0) - (a.l || 0))
    .slice(0, 1000);

  rows.forEach(row => {
    const lat = parseCoordinate(row.bplace_geonameid.lat);
    const lon = parseCoordinate(row.bplace_geonameid.lon);
    if (lat === null || lon === null) return;

    const placeName = row.bplace_geonameid.place;
    if (!placeName) return;

    const key = row.bplace_geonameid.id || row.bplace_geonameid.slug || placeName;
    let point = byPlace.get(key);
    if (!point) {
      point = {
        name: placeName,
        slug: row.bplace_geonameid.slug,
        coord: [lon, lat],
        count: 0,
        topPeople: [],
      };
      byPlace.set(key, point);
    }
    point.count += 1;
    trackTopPeople(point.topPeople, row);
  });

  return Array.from(byPlace.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
}

export default function PMap({data}) {
  const chartRef = useRef(null);
  const [features, setFeatures] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadWorldFeatures().then(worldFeatures => {
      if (!cancelled) setFeatures(worldFeatures);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const points = useMemo(() => buildMapPoints(data), [data]);
  const maxCount = useMemo(
    () => points.reduce((max, point) => Math.max(max, point.count), 1),
    [points]
  );

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !features) return;

    ensureWorldRegistered(features);
    const chart = initEChart(element);
    const option = {
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255,255,255,0.97)",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: [10, 14],
        extraCssText:
          "box-shadow: 0 2px 10px rgba(0,0,0,0.15); max-width: 280px;",
        textStyle: {color: "#333", fontSize: 12, lineHeight: 16},
        formatter: params => {
          if (params.seriesType !== "scatter" || !params.data) return "";
          const datum = params.data;
          const count = datum.value[2];
          let html = `<div style="font-weight:700;font-size:15px;color:#222;">${escapeHtml(datum.name)}</div>`;
          html += `<div style="font-size:12px;color:#666;margin-top:2px;">${count.toLocaleString()} ${count === 1 ? "person" : "people"}</div>`;
          html += formatTopPeopleHtml(datum.topPeople);
          if (datum.slug) {
            html += `<div style="margin-top:8px;font-size:10px;color:#aaa;">Click to view profile</div>`;
          }
          return html;
        },
      },
      geo: {
        map: WORLD_MAP_NAME,
        aspectScale: 1,
        roam: false,
        silent: true,
        layoutCenter: ["50%", "50%"],
        layoutSize: WORLD_LAYOUT_SIZE,
        itemStyle: {
          areaColor: "transparent",
          borderColor: "#4A4948",
          borderWidth: 0.75,
        },
        emphasis: {disabled: true},
        select: {disabled: true},
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "circle",
          symbolSize: value => {
            const ratio = Math.sqrt((value[2] || 1) / maxCount);
            return 8 + ratio * 27;
          },
          itemStyle: {
            color: "rgba(76, 94, 215, 0.4)",
            borderColor: "#4A4948",
            borderWidth: 1,
          },
          emphasis: {
            scale: 1.08,
            itemStyle: {
              color: "rgba(76, 94, 215, 0.62)",
              shadowBlur: 10,
              shadowColor: "rgba(0,0,0,0.25)",
            },
          },
          data: points.map(point => ({
            name: point.name,
            value: [point.coord[0], point.coord[1], point.count],
            slug: point.slug,
            topPeople: point.topPeople,
          })),
          z: 10,
        },
      ],
    };

    chart.setOption(option, {notMerge: true, lazyUpdate: true});

    const handleClick = params => {
      if (params.seriesType === "scatter" && params.data?.slug) {
        window.location.href = `/profile/place/${params.data.slug}`;
      }
    };
    chart.on("click", handleClick);
    const cleanupResize = setupResize(chart, element);

    return () => {
      cleanupResize();
      chart.off("click", handleClick);
      chart.dispose();
    };
  }, [features, points, maxCount]);

  if (!points.length) {
    return <div>No data available</div>;
  }

  return (
    <div
      className="pantheon-echart"
      ref={chartRef}
      role="img"
      aria-label="Explore map"
    />
  );
}
