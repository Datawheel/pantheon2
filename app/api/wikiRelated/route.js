// In-memory cache: slug -> { data, expiresAt }
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Track when we're rate-limited: don't attempt Wikipedia again until this time
let rateLimitedUntil = 0;

export async function GET(request) {
  const {searchParams} = new URL(request.url);

  const wikiSlug = searchParams.get("slug");
  if (!wikiSlug) return Response.json([]);

  const mode = searchParams.get("mode") || "morelike"; // "morelike" | "backlinks"
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit")) || 20, 1),
    100,
  );

  // Return cached result if available
  const cacheKey = `${wikiSlug}:${mode}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json(cached.data.slice(0, limit));
  }

  // If we're currently rate-limited, bail out early
  if (Date.now() < rateLimitedUntil) {
    console.log(`[wikiRelated] Rate-limited, skipping Wikipedia call for ${wikiSlug}. Retry after ${Math.ceil((rateLimitedUntil - Date.now()) / 1000)}s`);
    return Response.json([]);
  }

  const WIKI_HEADERS = {
    "User-Agent":
      "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
  };

  let pageIds = [];

  try {
    if (mode === "backlinks") {
      // Pages that link to this article
      const url = `https://en.wikipedia.org/w/api.php?action=query&prop=linkshere&titles=${encodeURIComponent(wikiSlug)}&lhnamespace=0&lhlimit=${limit * 3}&format=json&formatversion=2`;
      const resp = await fetch(url, {headers: WIKI_HEADERS});
      if (resp.status === 429) {
        const retryAfter = parseInt(resp.headers.get("retry-after") || "60");
        rateLimitedUntil = Date.now() + retryAfter * 1000;
        console.log(`[wikiRelated] Wikipedia 429 for ${wikiSlug}, backing off ${retryAfter}s`);
        return Response.json([]);
      }
      if (!resp.ok) throw new Error(`Wikipedia API ${resp.status}`);
      const data = await resp.json();
      const page = data.query?.pages?.[0];
      if (page?.linkshere) {
        pageIds = page.linkshere
          .filter(lh => !lh.redirect)
          .map(lh => lh.pageid);
      }
    } else {
      // Semantic similarity via morelike: search
      const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=morelike:${encodeURIComponent(wikiSlug)}&srnamespace=0&srlimit=${limit * 3}&format=json&formatversion=2`;
      const resp = await fetch(url, {headers: WIKI_HEADERS});
      if (resp.status === 429) {
        const retryAfter = parseInt(resp.headers.get("retry-after") || "60");
        rateLimitedUntil = Date.now() + retryAfter * 1000;
        console.log(`[wikiRelated] Wikipedia 429 for ${wikiSlug}, backing off ${retryAfter}s`);
        return Response.json([]);
      }
      if (!resp.ok) throw new Error(`Wikipedia API ${resp.status}`);
      const data = await resp.json();
      if (data.query?.search) {
        pageIds = data.query.search.map(s => s.pageid);
      }
    }
  } catch (e) {
    console.log(
      `Wiki Related API Error (${mode}): No page for ${wikiSlug} found.`,
      e.message,
    );
    return Response.json([]);
  }
  console.log(`[wikiRelated] ${wikiSlug} (${mode}): got ${pageIds.length} pageIds from Wikipedia. First 5: ${pageIds.slice(0, 5).join(", ")}`);

  if (!pageIds.length) return Response.json([]);

  // Filter through Pantheon to find which pages we actually have (batched in groups of 50)
  const BATCH_SIZE = 50;
  let allPantheonPeople = [];

  try {
    const batches = [];
    for (let i = 0; i < pageIds.length; i += BATCH_SIZE) {
      const batchIds = pageIds.slice(i, i + BATCH_SIZE);
      const query = batchIds.map(id => `id.eq.${id}`).join(",");
      batches.push(
        fetch(
          `https://api.pantheon.world/person?or=(${query})&select=id,birthyear,name,slug,occupation`,
        ).then(resp => {
          if (!resp.ok) throw new Error(`Pantheon API ${resp.status}`);
          return resp.json();
        }),
      );
    }

    const results = await Promise.all(batches);
    allPantheonPeople = results.flat();
    console.log(`[wikiRelated] ${wikiSlug}: Pantheon returned ${allPantheonPeople.length} matches. First id type: ${typeof allPantheonPeople[0]?.id}, first pageId type: ${typeof pageIds[0]}`);

    // Sort by original Wikipedia ordering — coerce both to string for safe comparison
    const idOrder = new Map(pageIds.map((id, i) => [`${id}`, i]));
    allPantheonPeople.sort((a, b) => (idOrder.get(`${a.id}`) ?? 999) - (idOrder.get(`${b.id}`) ?? 999));

    // Apply the requested limit
    allPantheonPeople = allPantheonPeople.slice(0, limit);

    // Add a description from occupation name for consumer compatibility
    const enriched = allPantheonPeople.map(d => ({
      ...d,
      description: d.occupation?.occupation_name || "",
    }));

    // Cache the full result set for 1 hour
    cache.set(cacheKey, {data: enriched, expiresAt: Date.now() + CACHE_TTL_MS});

    return Response.json(enriched.slice(0, limit));
  } catch (e) {
    console.log(
      `Pantheon Related Error: No bios for ${wikiSlug} found.`,
      e.message,
    );
    return Response.json([]);
  }
}
