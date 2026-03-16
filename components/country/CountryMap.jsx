"use client";

import {useEffect, useRef, useState, useMemo} from "react";
import {useRouter} from "next/navigation";
import * as topojson from "topojson-client";
import {geoNaturalEarth1, geoPath} from "d3-geo";

const WIDTH = 960;
const HEIGHT = 500;

// Color ramp from light to dark (6 steps)
const COLOR_RAMP = [
  "rgb(215, 210, 203)",
  "rgb(189, 178, 165)",
  "rgb(163, 148, 131)",
  "rgb(137, 120, 101)",
  "rgb(111, 95, 76)",
  "rgb(85, 72, 55)",
];

const NO_DATA_COLOR = "#e8e5e0";

/**
 * Jenks natural breaks optimization (Fisher-Jenks)
 * Groups values into classes that minimize within-class variance
 */
function jenksBreaks(values, numClasses) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  if (n <= numClasses) {
    return sorted;
  }

  // Initialize matrices
  const lowerClassLimits = Array.from({length: n + 1}, () => new Float64Array(numClasses + 1));
  const varianceCombinations = Array.from({length: n + 1}, () => {
    const row = new Float64Array(numClasses + 1);
    row.fill(Infinity);
    return row;
  });

  for (let i = 1; i <= numClasses; i++) {
    lowerClassLimits[1][i] = 1;
    varianceCombinations[1][i] = 0;
  }

  for (let l = 2; l <= n; l++) {
    let sum = 0;
    let sumSquares = 0;

    for (let m = 1; m <= l; m++) {
      const lowerClassLimit = l - m + 1;
      const val = sorted[lowerClassLimit - 1];

      sum += val;
      sumSquares += val * val;

      const variance = sumSquares - (sum * sum) / m;
      const i4 = lowerClassLimit - 1;

      if (i4 !== 0) {
        for (let j = 2; j <= numClasses; j++) {
          const newVariance = varianceCombinations[i4][j - 1] + variance;
          if (newVariance < varianceCombinations[l][j]) {
            lowerClassLimits[l][j] = lowerClassLimit;
            varianceCombinations[l][j] = newVariance;
          }
        }
      }
    }

    lowerClassLimits[l][1] = 1;
    varianceCombinations[l][1] = sumSquares - (sum * sum) / l;
  }

  // Read breaks
  const breaks = new Array(numClasses + 1);
  breaks[numClasses] = sorted[n - 1];
  breaks[0] = sorted[0];

  let k = n;
  for (let j = numClasses; j >= 2; j--) {
    const id = lowerClassLimits[k][j] - 2;
    breaks[j - 1] = sorted[id];
    k = lowerClassLimits[k][j] - 1;
  }

  return breaks;
}

function getColorIndex(value, breaks) {
  for (let i = 1; i < breaks.length; i++) {
    if (value <= breaks[i]) return i - 1;
  }
  return breaks.length - 2;
}

export default function CountryMap({countries, locale, hoverLabel}) {
  const tooltipRef = useRef(null);
  const router = useRouter();
  const [topoData, setTopoData] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const countryByNum = useMemo(() => {
    const map = {};
    for (const c of countries) {
      if (c.country_num) map[c.country_num] = c;
    }
    return map;
  }, [countries]);

  // Compute Jenks breaks from the data
  const breaks = useMemo(() => {
    const values = countries
      .filter(c => c.num_born > 0)
      .map(c => c.num_born);
    if (values.length < COLOR_RAMP.length) return null;
    return jenksBreaks(values, COLOR_RAMP.length);
  }, [countries]);

  // Build legend labels
  const legendItems = useMemo(() => {
    if (!breaks) return [];
    return COLOR_RAMP.map((color, i) => {
      const lo = i === 0 ? 1 : breaks[i] + 1;
      const hi = breaks[i + 1];
      return {
        color,
        label: `${Math.round(lo).toLocaleString(locale)}–${Math.round(hi).toLocaleString(locale)}`,
      };
    });
  }, [breaks, locale]);

  useEffect(() => {
    fetch("/jsons/world-50m.json")
      .then(r => r.json())
      .then(setTopoData)
      .catch(() => {});
  }, []);

  const {geojson, pathGenerator} = useMemo(() => {
    if (!topoData) return {};
    const geo = topojson.feature(topoData, topoData.objects.countries);
    const projection = geoNaturalEarth1()
      .fitSize([WIDTH, HEIGHT], geo);
    return {
      geojson: geo,
      pathGenerator: geoPath(projection),
    };
  }, [topoData]);

  if (!geojson) {
    return <div className="sc-map-loading" />;
  }

  const handleClick = (countryData) => {
    if (countryData?.slug) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      router.push(`${prefix}/profile/country/${countryData.slug}`);
    }
  };

  const handleMouseEnter = (e, featureId, countryData) => {
    setHoveredId(featureId);
    const tooltip = tooltipRef.current;
    if (!tooltip || !countryData) return;
    const name = countryData.localName || countryData.country;
    tooltip.textContent = `${name} — ${(countryData.num_born || 0).toLocaleString(locale)} ${hoverLabel}`;
    tooltip.style.opacity = "1";
    tooltip.style.left = `${e.clientX + 12}px`;
    tooltip.style.top = `${e.clientY - 30}px`;
  };

  const handleMouseMove = (e) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    tooltip.style.left = `${e.clientX + 12}px`;
    tooltip.style.top = `${e.clientY - 30}px`;
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    const tooltip = tooltipRef.current;
    if (tooltip) tooltip.style.opacity = "0";
  };

  return (
    <div className="sc-map-wrapper">
      <div
        ref={tooltipRef}
        className="sc-map-tooltip"
        style={{opacity: 0}}
      />
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="sc-map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {geojson.features.filter(f => f.id !== "010").map((feature) => {
          const numId = parseInt(feature.id, 10);
          const countryData = countryByNum[numId];
          const hasPeople = countryData && countryData.num_born > 0;
          let fill = NO_DATA_COLOR;
          if (hasPeople && breaks) {
            const idx = getColorIndex(countryData.num_born, breaks);
            fill = COLOR_RAMP[idx];
          }

          return (
            <path
              key={feature.id}
              d={pathGenerator(feature)}
              className={hasPeople ? "sc-map-country sc-map-clickable" : "sc-map-country"}
              onClick={() => hasPeople && handleClick(countryData)}
              onMouseEnter={(e) => hasPeople && handleMouseEnter(e, feature.id, countryData)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{fill}}
            />
          );
        })}

        {/* Highlight overlay rendered on top of all paths */}
        {hoveredId && (() => {
          const feature = geojson.features.find(f => f.id === hoveredId);
          if (!feature) return null;
          const numId = parseInt(feature.id, 10);
          const countryData = countryByNum[numId];
          let fill = NO_DATA_COLOR;
          if (countryData?.num_born > 0 && breaks) {
            const idx = getColorIndex(countryData.num_born, breaks);
            fill = COLOR_RAMP[idx];
          }
          return (
            <path
              d={pathGenerator(feature)}
              className="sc-map-highlight"
              style={{fill}}
              pointerEvents="none"
            />
          );
        })()}
      </svg>

      {/* Legend */}
      {legendItems.length > 0 && (
        <div className="sc-map-legend">
          <span className="sc-map-legend-item">
            <span className="sc-map-legend-swatch" style={{background: NO_DATA_COLOR}} />
            <span className="sc-map-legend-label">0</span>
          </span>
          {legendItems.map((item, i) => (
            <span key={i} className="sc-map-legend-item">
              <span className="sc-map-legend-swatch" style={{background: item.color}} />
              <span className="sc-map-legend-label">{item.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
