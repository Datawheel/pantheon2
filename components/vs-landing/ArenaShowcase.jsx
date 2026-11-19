"use client";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";

// A few matchups behind a row of pills. The active pill fills up while its
// matchup is on screen and advances on animationend, so hovering, keyboard
// focus and prefers-reduced-motion pause or disable rotation by pausing or
// removing that animation. Choosing a pill stops rotation for good.
export default function ArenaShowcase({slides, labels}) {
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [held, setHeld] = useState(false);
  const pills = useRef([]);
  const count = slides.length;

  useEffect(() => {
    // Warm the cache so the next matchup's portraits are ready.
    for (const src of slides[(index + 1) % count]?.images || []) {
      if (src) new window.Image().src = src;
    }
  }, [index, count, slides]);

  if (!count) return null;
  const select = (i, focus) => {
    setStopped(true);
    setIndex(i);
    if (focus) pills.current[i]?.focus();
  };
  const onKeyDown = event => {
    const flip = document.dir === "rtl" ? -1 : 1;
    const step = {ArrowRight: flip, ArrowLeft: -flip, Home: -index, End: count - 1 - index}[event.key];
    if (step == null) return;
    event.preventDefault();
    select((index + step + count) % count, true);
  };
  const slide = slides[index];
  return (
    <div
      className={`arena-showcase${stopped ? " is-stopped" : ""}${held ? " is-held" : ""}`}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={event => event.target.matches(":focus-visible") && setHeld(true)}
      onBlur={event => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className="arena-pills" role="tablist" aria-label={labels.featured} onKeyDown={onKeyDown}>
        {slides.map((s, i) => (
          <button key={s.href} id={`arena-pill-${i}`} ref={el => { pills.current[i] = el; }}
            className="arena-pill" type="button" role="tab" style={s.style}
            aria-selected={i === index} aria-controls="arena-showcase-panel" tabIndex={i === index ? 0 : -1}
            onClick={() => select(i)}>
            {i === index && <span className="arena-pill-fill" aria-hidden="true"
              onAnimationEnd={() => setIndex(n => (n + 1) % count)}/>}
            {s.field}
          </button>
        ))}
      </div>
      <div id="arena-showcase-panel" role="tabpanel" aria-labelledby={`arena-pill-${index}`}
        aria-live={stopped || held ? "polite" : "off"}>
        <a key={index} className="arena-slide" href={slide.href} style={slide.style}>
          <span className="arena-slide-stage" aria-hidden="true">
            {slide.images.map((src, side) => <span key={side} className="arena-slide-portrait">
              {src && <Image src={src} alt="" width={240} height={240} unoptimized
                loading="eager" preload={index === 0}/>}
            </span>)}
            <span className="arena-slide-seal">{labels.vs}</span>
            <span className="arena-slide-go">↗</span>
          </span>
          <span className="arena-slide-names">
            <span>{slide.names[0]}</span>
            <span className="arena-slide-vs">{labels.vs}</span>
            <span>{slide.names[1]}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
