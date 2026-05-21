import {
  getPersonFallbackSources,
  getPersonImageSrc,
} from "@/components/utils/personImages";

function resolveFetchUrl(requestUrl, src) {
  return src.startsWith("/") ? new URL(src, requestUrl) : src;
}

export async function fetchPersonImageWithFallback(requestUrl, person, id) {
  const personId = id || person?.id || person?.person_id || person?.pid;
  const sources = [
    getPersonImageSrc(personId),
    ...getPersonFallbackSources(person),
  ].filter(Boolean);

  for (const src of sources) {
    try {
      const response = await fetch(resolveFetchUrl(requestUrl, src));
      if (!response.ok) continue;

      const imageData = await response.arrayBuffer();
      if (imageData.byteLength > 0) return imageData;
    } catch (error) {
      if (src === sources[sources.length - 1]) {
        console.error("Fetching person fallback image failed:", error);
      }
    }
  }

  return null;
}
