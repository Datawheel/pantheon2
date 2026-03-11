/**
 * Safe JSON fetch with logging for debugging HTML responses.
 * Use this for server-side API calls to gracefully handle errors.
 */
const loggedInvalidQueryUrls = new Set();

function logInvalidQueryOnce(url) {
  if (loggedInvalidQueryUrls.has(url)) {
    return;
  }
  loggedInvalidQueryUrls.add(url);
  console.warn(`[safeFetchJson] Skipping invalid query URL: ${url}`);
}

export async function safeFetchJson(url, options = {}, fallback = null) {
  // Guard against accidentally constructed filters like gte.NaN / eq.undefined.
  if (/(?:eq|gte|lte|gt|lt)\.(?:NaN|undefined)\b/.test(url)) {
    logInvalidQueryOnce(url);
    return fallback;
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.error(`[safeFetchJson] HTTP ${res.status} for: ${url}`);
      return fallback;
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[safeFetchJson] Got HTML instead of JSON for: ${url}`);
      console.error(`[safeFetchJson] HTML preview: ${text.slice(0, 200)}`);
      return fallback;
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[safeFetchJson] Error for ${url}: ${e.message}`);
    return fallback;
  }
}

/**
 * Fetch JSON and return first item from array, or fallback object.
 */
export async function safeFetchFirst(url, options = {}, fallback = {}) {
  const data = await safeFetchJson(url, options, []);
  return Array.isArray(data) && data.length > 0 ? data[0] : fallback;
}
