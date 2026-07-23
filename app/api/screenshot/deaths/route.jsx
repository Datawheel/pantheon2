import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import {OG_CACHE_CONTROL} from "../helpers/cache";
import {fetchPersonImageWithFallback} from "../helpers/personImage";
import {safeFetchArray} from "@/app/utils/safeFetch";
import {getSupportedLocale} from "@/app/api/screenshot/helpers/locale";
import {loadLocalizedGoogleFonts} from "@/app/api/screenshot/helpers/localizedFont";
import {getDeathsTranslations} from "@/app/deathsTranslations";

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

export async function GET(request) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
  const {searchParams} = new URL(request.url);
  const year = searchParams.get("year");
  const locale = getSupportedLocale(searchParams.get("lang"));
  const t = getDeathsTranslations(locale);
  const label = t("ogLabel");

  if (!year) {
    return new NextResponse("Year parameter required", {status: 400});
  }

  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    return new NextResponse("Invalid year", {status: 400});
  }

  // Load fonts and images
  const [MarcellusfontData, wreathImageBuffer, localizedFonts] = await Promise.all([
    fetchPublicAsset(request, "/fonts/Marcellus-Regular.ttf"),
    fetchPublicAsset(request, "/images/misc/wreath.png"),
    loadLocalizedGoogleFonts(locale, label, "DeathsText"),
  ]);

  // Convert wreath image to base64 data URL
  const wreathBase64 = Buffer.from(wreathImageBuffer).toString("base64");
  const wreathDataUrl = `data:image/png;base64,${wreathBase64}`;

  // Fetch people who died this year. safeFetchArray guards res.ok / HTML
  // responses so an API error during saturation windows degrades to an empty
  // grid instead of a thrown 500 (a bare .json() also broke the .map below
  // when PostgREST returned an error object).
  const [peopleDiedThisYearAttrs, peopleDiedThisYearHpi] = await Promise.all([
    safeFetchArray(
      `${BASE_API}/person?alive=is.false&deathdate=gte.01-01-${yearNum}&deathdate=lte.12-31-${yearNum}&select=name,localized_name:translations->>${locale},slug,id,gender,occupation(occupation,occupation_slug)&order=deathdate.asc`
    ),
    safeFetchArray(
      `${BASE_API}/person_ranks?deathyear=eq.${yearNum}&select=id,hpi`
    ),
  ]);

  // Merge and sort by HPI
  const peopleDiedThisYear = peopleDiedThisYearAttrs
    .map(person => {
      const hpiData = peopleDiedThisYearHpi.find(hpi => hpi.id === person.id);
      return {
        ...person,
        name: person.localized_name || person.name,
        ...(hpiData || {}),
      };
    })
    .filter(person => person.hpi)
    .sort((a, b) => b.hpi - a.hpi)
    .slice(0, 16); // Top 16 people

  // Fetch images for top people
  const peopleWithImages = await Promise.all(
    peopleDiedThisYear.map(async person => {
      const imageData = await fetchPersonImageWithFallback(request.url, person);
      return {
        ...person,
        imageData,
      };
    })
  );

  const backgroundColor = "#f4f4f1";

  try {
    const imageResponse = new ImageResponse(
      (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        style={{
          background: backgroundColor,
          display: "flex",
          fontFamily: "Marcellus,Times,serif",
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            left: "30px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
          }}
        >
          <img
            src={wreathDataUrl}
            alt="Decorative wreath"
            width={300}
            height={300}
            style={{
              opacity: 0.55,
            }}
          />
        </div>

        {/* Left column - Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            height: "100%",
            padding: "0 60px",
            position: "relative",
          }}
        >
          <h1
            style={{
              color: "#363636",
              fontFamily: localizedFonts.length
                ? "DeathsText"
                : "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".4rem",
              fontSize: label.length > 22 ? "3rem" : "4.5rem",
              margin: "0",
              textAlign: "center",
            }}
          >
            {label}
          </h1>
          <h2
            style={{
              color: "#9e978d",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".25rem",
              fontSize: "2rem",
              margin: "20px 0",
              textAlign: "center",
            }}
          >
            PANTHEON
          </h2>
          <h2
            style={{
              color: "#363636",
              fontFamily: "Marcellus,Times,serif",
              fontWeight: "400",
              letterSpacing: ".3rem",
              fontSize: "3.5rem",
              margin: "0",
              textAlign: "center",
            }}
          >
            {year}
          </h2>
        </div>

        {/* Right column - Grid of portraits */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            height: "100%",
            padding: "80px 60px 80px 0",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              width: "630px",
            }}
          >
            {peopleWithImages.slice(0, 16).map((person, index) => (
              <div
                key={person.id}
                style={{
                  width: "150px",
                  height: "150px",
                  display: "flex",
                  overflow: "hidden",
                  border: "3px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {person.imageData ? (
                  <img
                    src={person.imageData}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{fontSize: "12px", color: "#666"}}>
                      {person.name?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
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
        ...localizedFonts,
      ],
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
        route: "deaths",
        url: request.url,
        year,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
