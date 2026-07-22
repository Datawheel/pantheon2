import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import {OG_CACHE_CONTROL} from "../helpers/cache";
import {fetchPersonImageWithFallback} from "../helpers/personImage";
import {safeFetchArray, safeFetchFirst} from "@/app/utils/safeFetch";
import {cleanParam} from "../helpers/params";
import {getSupportedLocale, isArabicLocale} from "../helpers/locale";
import {getLocationTranslations} from "@/app/locationTranslations";
import {
  formatLocationNumber,
  localizeCountry,
} from "@/app/utils/locationLocalization";
import {createArabicLocationCard} from "../helpers/arabicLocationCard";

// Match the hardened person route: the Node runtime has higher memory limits
// and more predictable image decoding than the edge sandbox.
export const runtime = "nodejs";

async function fetchPublicAsset(request, assetPath) {
  const assetUrl = new URL(assetPath, request.url);
  const response = await fetch(assetUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch asset ${assetPath}: ${response.status}`);
  }

  return response.arrayBuffer();
}

// Fetch an image and only hand it to satori if it really is one. Error pages
// served with 200 (HTML/XML) make satori throw "not iterable" mid-stream,
// which surfaces as "failed to pipe response". Returned as a data URI labeled
// with the real content-type: satori <img src> must be a string, not an
// ArrayBuffer (another "i is not iterable" trigger).
async function fetchImageDataUri(url) {
  try {
    const res = await fetch(url, {signal: AbortSignal.timeout(5000)});
    if (!res.ok) return null;
    const contentType = (res.headers.get("content-type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    if (!contentType.startsWith("image/")) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0) return null;
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
  const {searchParams} = new URL(request.url);
  const id = cleanParam(searchParams.get("id"));
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

  // Fetch country data. safeFetchFirst guards res.ok / HTML responses so an API
  // error during saturation windows yields a clean 404 instead of a thrown 500.
  const rawCountry = await safeFetchFirst(
    `${BASE_API}/country?slug=eq.${id}`,
    {},
    {}
  );
  const country = localizeCountry(rawCountry, lang);
  const {country: countryName, img_link, slug, id: countryId} = country;

  // Unknown slugs resolve to the {} fallback: no name and no id.
  if (!countryName || !countryId) {
    return new NextResponse("ID mismatch", {status: 404});
  }

  // Fetch country background image
  const countryImgPath = img_link
    ? `https://static.pantheon.world/profile/country/${slug}.jpg`
    : "https://static.pantheon.world/profile/placeholder_place_profile.jpg";

  // Fetch background image, top people, and count in parallel. Every branch
  // degrades instead of throwing: bgImageData falls back to the placeholder
  // (or null), topPeople is guarded by safeFetchArray, and the count fetch
  // only reads a header, so a failure just leaves the count at 0.
  const [bgImageData, topPeople, countRes] = await Promise.all([
    fetchImageDataUri(countryImgPath).then(
      dataUri =>
        dataUri ||
        fetchImageDataUri(
          "https://static.pantheon.world/profile/placeholder_place_profile.jpg",
        ),
    ),
    safeFetchArray(
      `${BASE_API}/person_ranks?bplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=id,name,gender,occupation&limit=10`
    ),
    fetch(`${BASE_API}/person_ranks?bplace_country=eq.${countryId}&select=id`, {
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
        countryName: "",
        locationName: countryName,
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
        {route: "country", url: request.url, id, stage: "sharp-rtl"},
        error,
      );
      return new NextResponse("OG render failed", {status: 500});
    }
  }

  const localizedFontFamily = isArabicLocale(lang)
    ? "Arial,sans-serif"
    : "Marcellus,Times,serif";

  try {
    const imageResponse = new ImageResponse(
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
        {/* Full background country image */}
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
          {bgImageData ? (
            <img
              src={bgImageData}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #44403a 0%, #1f1d1a 100%)",
              }}
            />
          )}
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

          {/* Center: Country name */}
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
                letterSpacing: isArabicLocale(lang) ? "0" : ".4rem",
                fontSize: "4.5rem",
                margin: "0",
                textAlign: "center",
                textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                lineHeight: 1.1,
              }}
            >
              {countryName}
            </h1>
            {totalCount > 0 && (
              <p
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.6rem",
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
              {(peopleToShow || []).map((person, index) => (
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
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      debug: false,
      fonts: MarcellusfontData
        ? [
            {
              name: "Marcellus",
              data: MarcellusfontData,
              style: "normal",
            },
          ]
        : [],
      }
    );

    // Render eagerly: ImageResponse streams lazily, so satori errors thrown
    // during piping would bypass this try/catch and crash the response
    // ("failed to pipe response"). Buffering forces them into the catch.
    const pngBuffer = await imageResponse.arrayBuffer();
    return new NextResponse(pngBuffer, {
      status: 200,
      headers: {"content-type": "image/png", "cache-control": OG_CACHE_CONTROL},
    });
  } catch (error) {
    console.error(
      "[screenshot-fail]",
      {
        route: "country",
        url: request.url,
        id,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
