import sharp from "sharp";
import {
  getPersonFallbackSources,
  getPersonImageSrc,
} from "@/components/utils/personImages";

// Satori (next/og) can only decode JPEG/PNG sources. The occupation fallback
// images — and occasionally upstream photos — are WebP, which makes the
// ImageResponse throw *after* doing the expensive raster work. We normalize
// anything that isn't JPEG/PNG to PNG (and cap its size) before handing it off.
const MAX_IMAGE_DIMENSION = 512;

function resolveFetchUrl(requestUrl, src) {
  return src.startsWith("/") ? new URL(src, requestUrl) : src;
}

function isSatoriSafe(contentType, bytes) {
  const type = (contentType || "").toLowerCase();
  if (type.includes("jpeg") || type.includes("jpg") || type.includes("png")) {
    return true;
  }
  if (type.includes("webp") || type.includes("avif") || type.includes("gif")) {
    return false;
  }

  // Fall back to magic-byte sniffing when the content-type header is missing or
  // generic (e.g. application/octet-stream from the static host).
  const view = new Uint8Array(bytes);
  const isJpeg = view[0] === 0xff && view[1] === 0xd8;
  const isPng =
    view[0] === 0x89 &&
    view[1] === 0x50 &&
    view[2] === 0x4e &&
    view[3] === 0x47;
  return isJpeg || isPng;
}

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

async function toSatoriImage(contentType, bytes) {
  if (isSatoriSafe(contentType, bytes)) return bytes;

  const png = await sharp(Buffer.from(bytes))
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();

  return toArrayBuffer(png);
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
      if (imageData.byteLength === 0) continue;

      return await toSatoriImage(
        response.headers.get("content-type"),
        imageData,
      );
    } catch (error) {
      if (src === sources[sources.length - 1]) {
        console.error("Fetching person fallback image failed:", error);
      }
    }
  }

  return null;
}
