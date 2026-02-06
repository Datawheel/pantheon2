/**
 * Safe JSON fetch with logging for debugging HTML responses.
 * Use this for server-side API calls to gracefully handle errors.
 */
export async function safeFetchJson(url, options = {}, fallback = null) {
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
