"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useParams, usePathname, useRouter} from "next/navigation";
import * as topojson from "topojson-client";
import {initEChart, echarts} from "@/components/utils/echarts";
import VizWrapper from "./VizWrapper";
import {FORMATTERS} from "@/components/utils/consts";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";

const WORLD_MAP_NAME = "pantheon-world";
let worldFeaturesPromise = null;
let worldRegistered = false;

async function loadWorldFeatures() {
  if (!worldFeaturesPromise) {
    worldFeaturesPromise = fetch("/jsons/world-50m.json")
      .then(r => r.json())
      .then(topo => {
        const geo = topojson.feature(topo, topo.objects.countries);
        return {
          type: "FeatureCollection",
          features: geo.features
            .filter(f => f.id !== "010") // drop Antarctica
            .map(f => ({
              ...f,
              properties: {...(f.properties || {}), name: f.id},
            })),
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

function featureBounds(feature) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  const visit = ([lon, lat]) => {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  };
  const walk = (arr, depth) => {
    if (depth === 0) visit(arr);
    else arr.forEach(a => walk(a, depth - 1));
  };
  const g = feature.geometry;
  if (g.type === "Polygon") walk(g.coordinates, 2);
  else if (g.type === "MultiPolygon") walk(g.coordinates, 3);
  return {minLon, maxLon, minLat, maxLat};
}

function extractSlug(d) {
  return (
    d.place?.slug ||
    d.bplace?.slug ||
    d.bplace_geonameid?.slug ||
    d.dplace_geonameid?.slug ||
    null
  );
}

function parseCoord(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractCoordPair(d) {
  if (Array.isArray(d.place_coord) && d.place_coord.length === 2) {
    const lon = parseCoord(d.place_coord[0]);
    const lat = parseCoord(d.place_coord[1]);
    if (lon !== null && lat !== null) return [lon, lat];
  }

  const source =
    d.place ||
    d.bplace ||
    d.bplace_geonameid ||
    d.dplace_geonameid ||
    null;
  const lon = parseCoord(d.lon ?? source?.lon);
  const lat = parseCoord(d.lat ?? source?.lat);
  return lon !== null && lat !== null ? [lon, lat] : null;
}

export default function PeopleLocationsMap({
  countryNum,
  data,
  title,
  bubbleFill = "rgba(115, 41, 69, 0.42)",
  bubbleBorder = "rgba(95, 1, 22, 0.85)",
  bubbleHoverFill = "rgba(115, 41, 69, 0.65)",
}) {
  const chartRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [features, setFeatures] = useState(null);

  const locale = useMemo(() => {
    if (params?.locale && SUPPORTED_LOCALES.includes(params.locale)) {
      return params.locale;
    }
    const m = pathname?.match(
      new RegExp(`^/(${SUPPORTED_LOCALES.join("|")})(/|$)`),
    );
    return m ? m[1] : DEFAULT_LOCALE;
  }, [params, pathname]);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  useEffect(() => {
    let cancelled = false;
    loadWorldFeatures().then(f => {
      if (!cancelled) setFeatures(f);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const points = useMemo(() => {
    const byPlace = new Map();
    for (const d of data || []) {
      const coord = extractCoordPair(d);
      if (!coord) continue;
      const sourcePlace =
        d.place?.place ||
        d.bplace?.place ||
        d.bplace_geonameid?.place ||
        d.dplace_geonameid?.place ||
        "";
      const key = d.place_name || sourcePlace;
      if (!key) continue;
      const slug = extractSlug(d);
      let node = byPlace.get(key);
      if (!node) {
        node = {
          name: key,
          slug,
          coord,
          count: 0,
          people: [],
        };
        byPlace.set(key, node);
      } else if (!node.slug && slug) {
        node.slug = slug;
      }
      node.count += 1;
      node.people.push({
        name: d.name,
        hpi: d.hpi || 0,
        birthyear: d.birthyear,
      });
    }
    return Array.from(byPlace.values()).sort((a, b) => b.count - a.count);
  }, [data]);

  const maxCount = useMemo(
    () => points.reduce((m, p) => Math.max(m, p.count), 1),
    [points],
  );

  const targetFeature = useMemo(() => {
    if (!features || countryNum == null) return null;
    const want = parseInt(countryNum, 10);
    return features.features.find(f => parseInt(f.id, 10) === want) || null;
  }, [features, countryNum]);

  useEffect(() => {
    if (!chartRef.current || !features) return;
    ensureWorldRegistered(features);

    const chart = initEChart(chartRef.current);

    let boundingCoords = null;
    if (targetFeature) {
      const {minLon, maxLon, minLat, maxLat} = featureBounds(targetFeature);
      const padLon = Math.max((maxLon - minLon) * 0.1, 1);
      const padLat = Math.max((maxLat - minLat) * 0.1, 1);
      boundingCoords = [
        [minLon - padLon, maxLat + padLat],
        [maxLon + padLon, minLat - padLat],
      ];
    }

    const targetName = targetFeature ? targetFeature.properties.name : null;

    const option = {
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "rgba(255,255,255,0.97)",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: [10, 14],
        extraCssText:
          "box-shadow: 0 2px 10px rgba(0,0,0,0.15); max-width: 260px;",
        formatter: params => {
          if (params.seriesType !== "scatter" || !params.data) return "";
          const d = params.data;
          const count = d.value[2];
          const label = count === 1 ? "person" : "people";
          const top = [...d.people]
            .sort((a, b) => (b.hpi || 0) - (a.hpi || 0))
            .slice(0, 3);
          let html = `<div style="font-weight:700;font-size:14px;color:#222;">${d.name}</div>`;
          html += `<div style="color:#777;font-size:12px;margin-top:2px;">${count.toLocaleString()} ${label}</div>`;
          if (top.length) {
            html += `<div style="margin-top:8px;font-size:10px;letter-spacing:0.5px;color:#888;text-transform:uppercase;">Top Ranked ${top.length === 1 ? "Person" : "People"}</div>`;
            for (const p of top) {
              const yr =
                p.birthyear != null
                  ? ` <span style="color:#999;">b.${FORMATTERS.year(p.birthyear)}</span>`
                  : "";
              html += `<div style="margin-top:2px;font-size:12px;color:#222;">${p.name}${yr}</div>`;
            }
          }
          if (d.slug) {
            html += `<div style="margin-top:8px;font-size:10px;color:#aaa;">Click to view location</div>`;
          }
          return html;
        },
      },
      geo: {
        map: WORLD_MAP_NAME,
        roam: false,
        silent: true,
        boundingCoords,
        layoutCenter: ["50%", "50%"],
        layoutSize: "96%",
        itemStyle: {
          areaColor: "transparent",
          borderColor: "#8a8984",
          borderWidth: 0.6,
        },
        regions: targetName
          ? [
              {
                name: targetName,
                itemStyle: {
                  areaColor: "#d4cfc5",
                  borderColor: "#3a3a3a",
                  borderWidth: 0.8,
                },
              },
            ]
          : [],
        emphasis: {disabled: true},
        select: {disabled: true},
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "circle",
          symbolSize: v => {
            const ratio = Math.sqrt((v[2] || 1) / maxCount);
            return 5 + ratio * 38;
          },
          itemStyle: {
            color: bubbleFill,
            borderColor: bubbleBorder,
            borderWidth: 1,
          },
          emphasis: {
            scale: 1.08,
            itemStyle: {
              color: bubbleHoverFill,
              shadowBlur: 10,
              shadowColor: "rgba(0,0,0,0.25)",
            },
          },
          data: points.map(p => ({
            name: p.name,
            value: [p.coord[0], p.coord[1], p.count],
            slug: p.slug,
            people: p.people,
          })),
          z: 10,
        },
      ],
    };

    chart.setOption(option, {notMerge: true});

    const handleClick = params => {
      if (params.seriesType === "scatter" && params.data?.slug) {
        router.push(`${localePrefix}/profile/place/${params.data.slug}`);
      }
    };
    chart.on("click", handleClick);

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
      chart.off("click", handleClick);
      chart.dispose();
    };
  }, [
    features,
    targetFeature,
    points,
    maxCount,
    title,
    localePrefix,
    router,
    bubbleFill,
    bubbleBorder,
    bubbleHoverFill,
  ]);

  return (
    <VizWrapper>
      <div>
        {title ? (
          <div
            style={{
              textAlign: "center",
              fontSize: 15,
              fontWeight: 500,
              color: "#2a2a2a",
              fontFamily: "Amiko, Arial, sans-serif",
              padding: "6px 0 2px",
            }}
          >
            {title}
          </div>
        ) : null}
        <div
          ref={chartRef}
          style={{width: "100%", height: "500px"}}
          role="img"
          aria-label={title}
        />
      </div>
    </VizWrapper>
  );
}
