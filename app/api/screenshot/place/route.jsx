import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import {OG_CACHE_CONTROL} from "../helpers/cache";
import {fetchPersonImageWithFallback} from "../helpers/personImage";
import {safeFetchArray, safeFetchFirst} from "@/app/utils/safeFetch";
import {getSupportedLocale, isArabicLocale} from "../helpers/locale";
import {getLocationTranslations} from "@/app/locationTranslations";
import {
  formatLocationNumber,
  getLocalizedPlaceNameMap,
  localizeCountry,
  localizePlace,
} from "@/app/utils/locationLocalization";
import {createArabicLocationCard} from "../helpers/arabicLocationCard";

// Match the hardened person route: run in the Node runtime, which has higher
// memory limits and more predictable image decoding than the edge sandbox.
export const runtime = "nodejs";

// Best-effort Wikipedia background image limits. We pull the ~320px thumbnail
// (never `originalimage`, which can be 10–50MB and was the main heap killer)
// and still cap type/size so a surprise response can't blow up the heap.
const MAX_BG_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const WIKI_TIMEOUT_MS = 2500;

async function fetchPublicAsset(request, assetPath) {
  const assetUrl = new URL(assetPath, request.url);
  const response = await fetch(assetUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch asset ${assetPath}: ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function GET(request) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
  const {searchParams} = new URL(request.url);
  const id = searchParams.get("id");
  const lang = getSupportedLocale(
    searchParams.get("lang") || searchParams.get("locale") || "en",
  );
  const t = getLocationTranslations(lang);

  if (!id) {
    return new NextResponse("Not Found", {status: 404});
  }

  // Load font
  const MarcellusfontData = await fetchPublicAsset(
    request,
    "/fonts/Marcellus-Regular.ttf"
  );

  // Fetch place data. safeFetchFirst guards res.ok / HTML responses so an API
  // error during saturation windows yields a clean 404 instead of a thrown 500.
  const rawPlace = await safeFetchFirst(
    `${BASE_API}/place?slug=eq.${id}`,
    {},
    {},
  );
  const localizedPlaceNames = await getLocalizedPlaceNameMap([rawPlace], lang);
  const place = localizePlace(rawPlace, localizedPlaceNames);
  const {place: name, country: countryId} = place;
  const wikipediaName = place.englishPlace || name;

  if (!name) {
    return new NextResponse("ID mismatch", {status: 404});
  }

  // Fetch country data
  const country = localizeCountry(await safeFetchFirst(
    `${BASE_API}/country?id=eq.${countryId}`,
    {},
    {}
  ), lang);
  const {country: countryName} = country;

  // Fetch a Wikipedia thumbnail to use as the card background. This is entirely
  // best-effort: on any failure we fall back to the gradient below.
  let bgImageData = null;
  try {
    // Wikipedia article titles are underscore-delimited; normalize the place
    // display name toward that canonical form to improve the match rate.
    const wikiTitle = encodeURIComponent(
      wikipediaName.trim().replace(/\s+/g, "_"),
    );
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`,
      {
        headers: {
          "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        signal: AbortSignal.timeout(WIKI_TIMEOUT_MS),
      }
    );
    // On 429/503 Wikipedia returns an HTML page; only parse confirmed JSON.
    if (wikiRes.ok && wikiRes.headers.get("content-type")?.includes("json")) {
      const wiki = await wikiRes.json();
      // Use the ~320px thumbnail, never originalimage (can be 10–50MB).
      const thumbSource = wiki.thumbnail?.source;
      if (thumbSource) {
        const imgRes = await fetch(thumbSource, {
          signal: AbortSignal.timeout(WIKI_TIMEOUT_MS),
        });
        const contentType = imgRes.headers.get("content-type") || "";
        const contentLength = Number(imgRes.headers.get("content-length") || 0);
        if (
          imgRes.ok &&
          contentType.startsWith("image/") &&
          contentLength <= MAX_BG_IMAGE_BYTES
        ) {
          const buffer = await imgRes.arrayBuffer();
          if (buffer.byteLength <= MAX_BG_IMAGE_BYTES) {
            const base64 = Buffer.from(buffer).toString("base64");
            bgImageData = `data:${contentType};base64,${base64}`;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
  }

  // Fetch top people and count in parallel. topPeople is guarded by
  // safeFetchArray (always an array); the count fetch only reads a header, so a
  // failure just leaves the count at 0 rather than throwing a 500.
  const [topPeople, countRes] = await Promise.all([
    safeFetchArray(
      `${BASE_API}/person_ranks?bplace_geonameid=eq.${place.id}&order=hpi.desc.nullslast&select=id,name,gender,occupation&limit=10`
    ),
    fetch(`${BASE_API}/person_ranks?bplace_geonameid=eq.${place.id}&select=id`, {
      headers: {"Prefer": "count=exact"},
    }).catch(() => null),
  ]);

  // Get total count from headers
  const contentRange = countRes?.headers?.get("content-range");
  let totalCount = 0;
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)/);
    if (match) {
      totalCount = parseInt(match[1], 10);
    }
  }

  // Fetch images for top people
  const peopleWithImages = await Promise.all(
    topPeople.map(async person => {
      const imageData = await fetchPersonImageWithFallback(request.url, person);
      return {
        ...person,
        imageData,
      };
    })
  );

  // Filter to only people with images
  const peopleToShow = peopleWithImages.filter(p => p.imageData).slice(0, 8);

  const backgroundColor = "#f4f4f1";
  const notableLabel = totalCount > 0
    ? t("notablePeople", {count: formatLocationNumber(totalCount, lang)})
    : "";

  if (isArabicLocale(lang)) {
    try {
      const png = await createArabicLocationCard({
        backgroundImage: bgImageData,
        countryName,
        locationName: name,
        notableLabel,
        people: peopleToShow,
      });
      return new NextResponse(png, {
        status: 200,
        headers: {
          "cache-control": OG_CACHE_CONTROL,
          "content-type": "image/png",
        },
      });
    } catch (error) {
      console.error(
        "[screenshot-fail]",
        {route: "place", url: request.url, id, stage: "sharp-rtl"},
        error,
      );
      return new NextResponse("OG render failed", {status: 500});
    }
  }

  const localizedFontFamily = isArabicLocale(lang)
    ? "Arial,sans-serif"
    : "Marcellus,Times,serif";

  try {
    return new ImageResponse(
      (
      <div
        style={{
          background: backgroundColor,
          display: "flex",
          fontFamily: localizedFontFamily,
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Full background place image */}
        {bgImageData ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
            }}
          >
            <img
              src={bgImageData}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Gradient overlay - darker at bottom for text/portraits */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
            }}
          >
            {/* Gradient overlay for no-image fallback */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </div>
        )}

        {/* Content overlay — rendered after the background, so DOM order
            already stacks it on top (satori has no z-index support). */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Top: Pantheon branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "30px",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "Marcellus,Times,serif",
                textTransform: "uppercase",
                fontWeight: "400",
                letterSpacing: ".3rem",
                fontSize: "1.6rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              PANTHEON
            </span>
          </div>

          {/* Center: Place name and country */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              padding: "0 60px",
            }}
          >
            <h1
              style={{
                color: "#ffffff",
                fontFamily: localizedFontFamily,
                textTransform: isArabicLocale(lang) ? "none" : "uppercase",
                fontWeight: "400",
                letterSpacing: isArabicLocale(lang) ? "0" : ".35rem",
                fontSize: "4rem",
                margin: "0",
                textAlign: "center",
                textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                lineHeight: 1.1,
              }}
            >
              {name}
            </h1>
            {countryName && (
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.8rem",
                  marginTop: "15px",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  letterSpacing: ".15rem",
                }}
              >
                {countryName}
              </p>
            )}
            {totalCount > 0 && (
              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "1.4rem",
                  marginTop: "20px",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  letterSpacing: ".1rem",
                }}
              >
                {notableLabel}
              </p>
            )}
          </div>

          {/* Bottom: Portrait strip */}
          {peopleToShow.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                padding: "0 40px 40px 40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {peopleToShow.map((person, index) => (
                  <div
                    key={person.id || index}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "4px solid rgba(255,255,255,0.9)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                      marginLeft: index === 0 ? "0" : "-15px",
                      display: "flex",
                      position: "relative",
                    }}
                  >
                    <img
                      src={person.imageData}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      debug: false,
      fonts: [
        {
          name: "Marcellus",
          data: MarcellusfontData,
          style: "normal",
        },
      ],
      headers: {"cache-control": OG_CACHE_CONTROL},
      }
    );
  } catch (error) {
    console.error(
      "[screenshot-fail]",
      {
        route: "place",
        url: request.url,
        id,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
