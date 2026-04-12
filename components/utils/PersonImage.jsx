"use client";

import {useEffect, useRef, useState} from "react";

const STATIC_IMAGE_BASE = "https://static.pantheon.world";

function resolveSrc(src) {
  if (!src) {
    return "";
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return `${STATIC_IMAGE_BASE}${src}`;
}

const PersonImage = ({alt, className, src, fallbackSrc}) => {
  const imageRef = useRef(null);
  const resolvedSrc = resolveSrc(src);
  const resolvedFallbackSrc = resolveSrc(fallbackSrc);
  const [imageSrc, setImageSrc] = useState(resolvedSrc || resolvedFallbackSrc);
  const [isFallback, setIsFallback] = useState(!resolvedSrc && Boolean(resolvedFallbackSrc));

  useEffect(() => {
    setImageSrc(resolvedSrc || resolvedFallbackSrc);
    setIsFallback(!resolvedSrc && Boolean(resolvedFallbackSrc));
  }, [resolvedFallbackSrc, resolvedSrc]);

  useEffect(() => {
    const image = imageRef.current;
    if (!image || !resolvedFallbackSrc || imageSrc !== resolvedSrc) {
      return;
    }

    // If the original image already failed before hydration, swap it on mount.
    if (image.complete && image.naturalWidth === 0) {
      setImageSrc(resolvedFallbackSrc);
      setIsFallback(true);
    }
  }, [imageSrc, resolvedFallbackSrc, resolvedSrc]);

  function handleError() {
    if (!resolvedFallbackSrc || imageSrc === resolvedFallbackSrc) {
      return;
    }

    setImageSrc(resolvedFallbackSrc);
    setIsFallback(true);
  }

  return (
    <div className="image">
      <img
        ref={imageRef}
        src={imageSrc}
        className={`${className || ""}${isFallback ? `${className ? " " : ""}is-fallback` : ""}`}
        alt={alt}
        onError={handleError}
      />
    </div>
  );
};

export default PersonImage;
