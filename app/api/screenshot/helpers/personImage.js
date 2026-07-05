import {
  getPersonFallbackSources,
  getPersonImageSrc,
} from "@/components/utils/personImages";

function resolveFetchUrl(requestUrl, src) {
  return src.startsWith("/") ? new URL(src, requestUrl) : src;
}

export async function fetchPersonImageWithFallback(requestUrl, person, id) {
  const personId = id || person?.id || person?.person_id || person?.pid;
  // Satori (next/og) can't decode WebP, so request the JPEG copies of the
  // occupation fallbacks instead. Handing it WebP makes ImageResponse throw
  // *after* the expensive raster work — the production heap killer.
  const sources = [
    getPersonImageSrc(personId),
    ...getPersonFallbackSources(person, undefined, {extension: "jpg"}),
  ].filter(Boolean);

  for (const src of sources) {
    try {
      const response = await fetch(resolveFetchUrl(requestUrl, src));
      if (!response.ok) continue;

      // Label the data URI with the response's real type. Sources include the
      // SVG person icon (image/svg+xml) as a last resort, so a hardcoded
      // image/jpeg would make Satori throw "Invalid JPEG" on it. Skip
      // non-image responses (HTML/XML error pages served with 200): Satori
      // throws mid-render on them, after the response has started streaming.
      const contentType = response.headers.get("content-type") || "image/jpeg";
      if (!contentType.trim().toLowerCase().startsWith("image/")) continue;

      const imageData = await response.arrayBuffer();
      if (imageData.byteLength === 0) continue;
      const base64 = Buffer.from(imageData).toString("base64");
      return `data:${contentType.split(";")[0].trim()};base64,${base64}`;
    } catch (error) {
      if (src === sources[sources.length - 1]) {
        console.error("Fetching person fallback image failed:", error);
      }
    }
  }

  return null;
}
