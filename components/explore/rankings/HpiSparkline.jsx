import React from "react";
import {formatExploreNumber, formatExploreYear} from "@/app/exploreTranslations";

const WIDTH = 72;
const HEIGHT = 22;
const PAD_X = 3;
const PAD_Y = 4;
const DOT_RADIUS = 2.5;

// Tiny inline-SVG trend line of a person's yearly HPI values. Renders a dash
// when fewer than two yearly values exist (no historical HPI available).
export default function HpiSparkline({history, locale = "en"}) {
  const points = (history || []).filter(
    d => Number.isFinite(d?.hpi) && Number.isFinite(d?.yr),
  );

  if (points.length < 2) {
    return <span className="hpi-sparkline-empty">–</span>;
  }

  const values = points.map(d => d.hpi);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const innerWidth = WIDTH - PAD_X - PAD_X - DOT_RADIUS;
  const innerHeight = HEIGHT - PAD_Y * 2;

  const coords = points.map((d, i) => {
    const x = PAD_X + (i / (points.length - 1)) * innerWidth;
    // Flat histories draw a midline instead of dividing by zero.
    const y = span
      ? PAD_Y + (1 - (d.hpi - min) / span) * innerHeight
      : HEIGHT / 2;
    return [x, y];
  });
  const last = coords[coords.length - 1];

  const label = points
    .map(d => `${formatExploreYear(d.yr, locale)}: ${formatExploreNumber(d.hpi, locale, {maximumFractionDigits: 2})}`)
    .join(" · ");

  return (
    <svg
      className="hpi-sparkline"
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <polyline
        points={coords.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={DOT_RADIUS} fill="currentColor" />
    </svg>
  );
}
