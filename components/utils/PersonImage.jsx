"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {
  DEFAULT_PERSON_FALLBACK_SRC,
  getPersonFallbackSources,
  resolvePersonImageSrc,
} from "./personImages";

const PersonImage = ({
  alt,
  className,
  fallbackSrc = DEFAULT_PERSON_FALLBACK_SRC,
  person,
  src,
  wrap = true,
  ...props
}) => {
  const resolvedSrc = resolvePersonImageSrc(src);
  const fallbackSources = useMemo(
    () => getPersonFallbackSources(person, fallbackSrc),
    [fallbackSrc, person]
  );
  const [failedSources, setFailedSources] = useState([]);
  const imgRef = useRef(null);
  const candidates = useMemo(
    () => Array.from(new Set([resolvedSrc, ...fallbackSources].filter(Boolean))),
    [fallbackSources, resolvedSrc]
  );
  const imageSrc =
    candidates.find(candidate => !failedSources.includes(candidate)) ||
    candidates[candidates.length - 1] ||
    "";
  const isFallback = imageSrc !== resolvedSrc;

  function markFailed(failedSrc) {
    if (!failedSrc) return;
    setFailedSources(prev =>
      prev.includes(failedSrc) ? prev : [...prev, failedSrc]
    );
  }

  function handleError() {
    markFailed(imageSrc);
  }

  // Catch errors that fired before hydration: a browser that already
  // finished loading a broken img has complete=true, naturalWidth=0.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      markFailed(imageSrc);
    }
  }, [imageSrc]);

  const classNames = [
    className,
    isFallback ? "is-fallback" : "",
    imageSrc.includes("/images/fallback/") ? "is-occupation-fallback" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const img = (
    <img
      {...props}
      ref={imgRef}
      src={imageSrc}
      className={classNames}
      alt={alt}
      onError={handleError}
    />
  );

  return wrap ? <div className="image">{img}</div> : img;
};

export default PersonImage;
