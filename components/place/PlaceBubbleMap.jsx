"use client";

import {useEffect, useRef, useState, useMemo, useCallback} from "react";
import {useRouter} from "next/navigation";
import * as topojson from "topojson-client";
import {geoNaturalEarth1, geoPath} from "d3-geo";

const WIDTH = 960;
const HEIGHT = 500;
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;
const ZOOM_STEP = 1.5;

export default function PlaceBubbleMap({places, locale, hoverLabel}) {
  const tooltipRef = useRef(null);
  const svgRef = useRef(null);
  const isPanning = useRef(false);
  const didPan = useRef(false);
  const panStartClient = useRef({x: 0, y: 0});
  const viewBoxOnPanStart = useRef(null);
  const router = useRouter();
  const [topoData, setTopoData] = useState(null);

  // viewBox state: x, y are the top-left corner; w, h are the visible dimensions
  const [vb, setVb] = useState({x: 0, y: 0, w: WIDTH, h: HEIGHT});

  useEffect(() => {
    fetch("/jsons/world-50m.json")
      .then(r => r.json())
      .then(setTopoData)
      .catch(() => {});
  }, []);

  const {geojson, projection, pathGenerator} = useMemo(() => {
    if (!topoData) return {};
    const geo = topojson.feature(topoData, topoData.objects.countries);
    const proj = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], geo);
    return {
      geojson: geo,
      projection: proj,
      pathGenerator: geoPath(proj),
    };
  }, [topoData]);

  const maxPeople = useMemo(
    () => Math.max(...places.map(p => p.num_born || 0), 1),
    [places],
  );

  const sortedPlaces = useMemo(
    () => [...places].sort((a, b) => (b.num_born || 0) - (a.num_born || 0)),
    [places],
  );

  const currentZoom = WIDTH / vb.w;

  // Clamp viewBox so it doesn't go out of bounds
  const clampVb = useCallback((box) => {
    let {x, y, w, h} = box;
    w = Math.max(WIDTH / MAX_ZOOM, Math.min(WIDTH, w));
    h = w * (HEIGHT / WIDTH);
    x = Math.max(0, Math.min(WIDTH - w, x));
    y = Math.max(0, Math.min(HEIGHT - h, y));
    return {x, y, w, h};
  }, []);

  // Zoom toward center of current view
  const applyZoom = useCallback((factor) => {
    setVb(prev => {
      const cx = prev.x + prev.w / 2;
      const cy = prev.y + prev.h / 2;
      const newW = prev.w / factor;
      const newH = newW * (HEIGHT / WIDTH);
      return clampVb({
        x: cx - newW / 2,
        y: cy - newH / 2,
        w: newW,
        h: newH,
      });
    });
  }, [clampVb]);

  const handleZoomIn = useCallback(() => applyZoom(ZOOM_STEP), [applyZoom]);
  const handleZoomOut = useCallback(() => applyZoom(1 / ZOOM_STEP), [applyZoom]);
  const handleReset = useCallback(() => {
    setVb({x: 0, y: 0, w: WIDTH, h: HEIGHT});
  }, []);

  // Mouse wheel zoom toward cursor
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.25 : 1 / 1.25;

    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();

    setVb(prev => {
      // Cursor position in viewBox coordinates
      const mouseVbX = prev.x + ((e.clientX - rect.left) / rect.width) * prev.w;
      const mouseVbY = prev.y + ((e.clientY - rect.top) / rect.height) * prev.h;

      const newW = prev.w / factor;
      const newH = newW * (HEIGHT / WIDTH);

      // Keep cursor point fixed
      const newX = mouseVbX - (mouseVbX - prev.x) * (newW / prev.w);
      const newY = mouseVbY - (mouseVbY - prev.y) * (newH / prev.h);

      return clampVb({x: newX, y: newY, w: newW, h: newH});
    });
  }, [clampVb]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener("wheel", handleWheel, {passive: false});
    return () => svg.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Convert client pixel delta to viewBox delta
  const clientToVbDelta = useCallback((dxClient, dyClient) => {
    const svg = svgRef.current;
    if (!svg) return {dx: 0, dy: 0};
    const rect = svg.getBoundingClientRect();
    return {
      dx: (dxClient / rect.width) * vb.w,
      dy: (dyClient / rect.height) * vb.h,
    };
  }, [vb.w, vb.h]);

  const handlePointerDown = useCallback((e) => {
    isPanning.current = true;
    didPan.current = false;
    panStartClient.current = {x: e.clientX, y: e.clientY};
    viewBoxOnPanStart.current = {...vb};
  }, [vb]);

  const handlePointerMove = useCallback((e) => {
    if (!isPanning.current || !viewBoxOnPanStart.current) return;
    const dxClient = e.clientX - panStartClient.current.x;
    const dyClient = e.clientY - panStartClient.current.y;
    if (Math.abs(dxClient) > 3 || Math.abs(dyClient) > 3) didPan.current = true;

    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const startVb = viewBoxOnPanStart.current;

    const dxVb = (dxClient / rect.width) * startVb.w;
    const dyVb = (dyClient / rect.height) * startVb.h;

    setVb(clampVb({
      x: startVb.x - dxVb,
      y: startVb.y - dyVb,
      w: startVb.w,
      h: startVb.h,
    }));
  }, [clampVb]);

  const handlePointerUp = useCallback(() => {
    const wasPanning = didPan.current;
    isPanning.current = false;
    if (wasPanning) {
      setTimeout(() => { didPan.current = false; }, 0);
    }
  }, []);

  // Listen on document for pointer move/up so panning works even if pointer leaves SVG
  useEffect(() => {
    const onMove = (e) => handlePointerMove(e);
    const onUp = () => handlePointerUp();
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  if (!geojson) {
    return <div className="sp-map-loading" />;
  }

  const handleClick = (place) => {
    if (didPan.current) return;
    if (place?.slug) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      router.push(`${prefix}/profile/place/${place.slug}`);
    }
  };

  const handleMouseMove = (e, place) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    tooltip.textContent = `${place.place} — ${(place.num_born || 0).toLocaleString(locale)} ${hoverLabel}`;
    tooltip.style.opacity = "1";
    tooltip.style.left = `${e.clientX + 12}px`;
    tooltip.style.top = `${e.clientY - 30}px`;
  };

  const handleMouseLeave = () => {
    const tooltip = tooltipRef.current;
    if (tooltip) tooltip.style.opacity = "0";
  };

  const isZoomed = currentZoom > 1.05;

  return (
    <div className="sp-map-wrapper">
      <div
        ref={tooltipRef}
        className="sp-map-tooltip"
        style={{opacity: 0}}
      />
      <div className="sp-map-controls">
        <button className="sp-map-zoom-btn" onClick={handleZoomIn} aria-label="Zoom in">+</button>
        <button className="sp-map-zoom-btn" onClick={handleZoomOut} aria-label="Zoom out">−</button>
        {isZoomed && (
          <button className="sp-map-zoom-btn" onClick={handleReset} aria-label="Reset zoom">↺</button>
        )}
      </div>
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className={`sp-map-svg ${isZoomed ? "sp-map-svg-zoomable" : ""}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={handlePointerDown}
      >
        {/* Country outlines */}
        {geojson.features
          .filter(f => f.id !== "010")
          .map((feature) => (
            <path
              key={feature.id}
              d={pathGenerator(feature)}
              className="sp-map-land"
            />
          ))}

        {/* Place bubbles — scale radius inversely with zoom */}
        {sortedPlaces.map((place) => {
          if (!place.lat || !place.lon) return null;
          const projected = projection([place.lon, place.lat]);
          if (!projected) return null;
          const [cx, cy] = projected;
          const r = (2 + Math.sqrt(place.num_born / maxPeople) * 14) / Math.sqrt(currentZoom);

          return (
            <circle
              key={place.id}
              cx={cx}
              cy={cy}
              r={r}
              className="sp-map-bubble"
              onClick={() => handleClick(place)}
              onMouseMove={(e) => handleMouseMove(e, place)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>
    </div>
  );
}
