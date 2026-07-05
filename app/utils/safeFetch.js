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
 * Fetch JSON and always return an array.
 */
export async function safeFetchArray(url, options = {}) {
  const data = await safeFetchJson(url, options, []);
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch JSON and return first item from array, or fallback object.
 */
export async function safeFetchFirst(url, options = {}, fallback = {}) {
  const data = await safeFetchArray(url, options);
  return data.length > 0 ? data[0] : fallback;
}

/**
 * Fetch a large PostgREST result set in limit/offset pages so each underlying
 * fetch stays under Next's 2MB data-cache limit — bigger responses are
 * silently never cached, so they hit PostgREST on every request.
 *
 * The url MUST include a stable, unambiguous order= (e.g. an id tiebreaker),
 * otherwise pages can overlap or skip rows between requests.
 *
 * Size the pages against the CACHE ENTRY, not the response: Next stores fetch
 * bodies base64-encoded, so the 2MB limit is hit at ~1.5MB of raw JSON.
 */
export async function safeFetchArrayPaged(url, options = {}, pageSize = 2000) {
  const sep = url.includes("?") ? "&" : "?";
  // Hard stop well past the largest result set so a bad URL can't loop forever.
  const MAX_PAGES = 100;
  const rows = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const batch = await safeFetchArray(
      `${url}${sep}limit=${pageSize}&offset=${page * pageSize}`,
      options,
    );
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
}
