export function getTrendingNewsCardId(slug = "") {
  const safeSlug = String(slug || "").trim();
  return safeSlug ? `trend-${encodeURIComponent(safeSlug)}` : "";
}

export function getTrendingNewsCardHash(slug = "") {
  const cardId = getTrendingNewsCardId(slug);
  return cardId ? `#${cardId}` : "";
}

export function getTrendingNewsPermalink({locale, date, slug, model} = {}) {
  const safeLocale = String(locale || "en").trim();
  const params = new URLSearchParams();

  if (date) params.set("date", date);
  if (slug) params.set("slug", slug);
  if (model) params.set("model", model);

  const query = params.toString();
  const hash = getTrendingNewsCardHash(slug);

  return `/${safeLocale}/news${query ? `?${query}` : ""}${hash}`;
}

export function getTrendingNewsSlugFromHash(hash = "") {
  const rawHash = String(hash || "").replace(/^#/, "");
  if (!rawHash) return "";

  const encodedSlug = rawHash.startsWith("trend-")
    ? rawHash.slice("trend-".length)
    : rawHash;

  try {
    return decodeURIComponent(encodedSlug);
  } catch {
    return encodedSlug;
  }
}

export function getTrendingNewsSlugFromSearchParams(searchParams) {
  return searchParams?.get?.("slug") || searchParams?.get?.("person") || "";
}
