import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import {OG_CACHE_CONTROL} from "../helpers/cache";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {fetchPersonImageWithFallback} from "../helpers/personImage";
import {safeFetchArray, safeFetchFirst} from "@/app/utils/safeFetch";

// Match the hardened person route: the Node runtime has higher memory limits
// and more predictable image decoding than the edge sandbox.
export const runtime = "nodejs";

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

  if (!id) {
    return new NextResponse("Not Found", {status: 404});
  }

  // Load font
  const MarcellusfontData = await fetchPublicAsset(
    request,
    "/fonts/Marcellus-Regular.ttf"
  );

  // Fetch occupation data. safeFetchFirst guards res.ok / HTML responses so an
  // API error during saturation windows yields a clean 404 instead of a 500.
  const occupation = await safeFetchFirst(
    `${BASE_API}/occupation?occupation_slug=eq.${id}`,
    {},
    {}
  );
  const {occupation: occupationName, id: occupationId} = occupation;

  if (!occupationName) {
    return new NextResponse("ID mismatch", {status: 404});
  }

  // Fetch top people and total count in parallel. topPeople is guarded by
  // safeFetchArray; the count fetch only reads a header, so a failure just
  // leaves the count at 0 rather than throwing a 500.
  const [topPeople, countRes] = await Promise.all([
    safeFetchArray(
      `${BASE_API}/person_ranks?occupation=eq.${encodePostgrestValue(occupationId)}&order=hpi.desc.nullslast&select=id,name,gender&limit=16`
    ),
    fetch(
      `${BASE_API}/person_ranks?occupation=eq.${encodePostgrestValue(occupationId)}&select=id`,
      {headers: {"Prefer": "count=exact"}}
    ).catch(() => null),
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
      const imageData = await fetchPersonImageWithFallback(request.url, {
        ...person,
        occupation,
      });
      return {
        ...person,
        imageData,
      };
    })
  );

  const backgroundColor = "#f4f4f1";

  try {
    return new ImageResponse(
      (
      <div
        style={{
          background: backgroundColor,
          display: "flex",
          fontFamily: "Marcellus,Times,serif",
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
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
          <h2
            style={{
              color: "#9e978d",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".25rem",
              fontSize: "1.8rem",
              margin: "0 0 20px 0",
              textAlign: "center",
            }}
          >
            PANTHEON
          </h2>
          <h3
            style={{
              color: "#9e978d",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".2rem",
              fontSize: "1.4rem",
              margin: "0 0 10px 0",
              textAlign: "center",
            }}
          >
            OCCUPATION
          </h3>
          <h1
            style={{
              color: "#363636",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".25rem",
              fontSize: "2.8rem",
              margin: "10px 0",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {occupationName}
          </h1>
          {totalCount > 0 && (
            <p
              style={{
                color: "#9e978d",
                fontSize: "1.4rem",
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              {formatNumber(totalCount)} notable {totalCount === 1 ? "person" : "people"}
            </p>
          )}
        </div>

        {/* Right column - Grid of portraits */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
            height: "100%",
            padding: "40px 60px 40px 0",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              width: "560px",
            }}
          >
            {peopleWithImages.slice(0, 16).map((person, index) => (
              <div
                key={person.id || index}
                style={{
                  width: "130px",
                  height: "130px",
                  display: "flex",
                  overflow: "hidden",
                  border: "3px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: "4px",
                }}
              >
                {person.imageData ? (
                  <img
                    src={person.imageData}
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
                      background: "linear-gradient(135deg, #ddd 0%, #ccc 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{fontSize: "14px", color: "#888", fontWeight: "bold"}}>
                      {person.name?.substring(0, 2).toUpperCase() || "?"}
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
      ],
      headers: {"cache-control": OG_CACHE_CONTROL},
      }
    );
  } catch (error) {
    console.error(
      "[screenshot-fail]",
      {
        route: "occupation",
        url: request.url,
        id,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
