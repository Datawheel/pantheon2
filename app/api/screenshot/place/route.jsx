import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";

export const runtime = "edge";

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function fetchPersonImage(id) {
  try {
    const response = await fetch(
      `https://static.pantheon.world/profile/people/${id}.jpg`
    );

    if (!response.ok) {
      return null;
    }

    const imageData = await response.arrayBuffer();

    if (imageData.byteLength === 0) {
      return null;
    }

    return imageData;
  } catch (error) {
    console.error("Fetching image failed:", error);
    return null;
  }
}

export async function GET(request) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
  const {searchParams} = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Not Found", {status: 404});
  }

  // Load font
  const MarcellusfontData = await fetch(
    new URL("../../../../public/fonts/Marcellus-Regular.ttf", import.meta.url)
  ).then(res => res.arrayBuffer());

  // Fetch place data
  const placeRes = await fetch(`${BASE_API}/place?slug=eq.${id}`);
  const placeData = await placeRes.json();
  const place = Array.isArray(placeData) && placeData.length > 0 ? placeData[0] : {};
  const {place: name, country: countryId} = place;

  if (!name) {
    return new NextResponse("ID mismatch", {status: 404});
  }

  // Fetch country data
  const countryRes = await fetch(`${BASE_API}/country?id=eq.${countryId}`);
  const countryData = await countryRes.json();
  const country = Array.isArray(countryData) && countryData.length > 0 ? countryData[0] : {};
  const {country: countryName, country_code} = country;

  // Fetch Wikipedia image for the place
  let bgImageData = null;
  try {
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      {
        headers: {
          "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
      }
    );
    const wiki = await wikiRes.json();
    if (wiki.originalimage?.source) {
      const imgRes = await fetch(wiki.originalimage.source);
      if (imgRes.ok) {
        bgImageData = await imgRes.arrayBuffer();
      }
    }
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
  }

  // Fetch top people and count in parallel
  const [topPeopleRes, countRes] = await Promise.all([
    fetch(
      `${BASE_API}/person_ranks?bplace_geonameid=eq.${place.id}&order=hpi.desc.nullslast&select=id,name&limit=10`
    ),
    fetch(
      `${BASE_API}/person_ranks?bplace_geonameid=eq.${place.id}&select=id`,
      {headers: {"Prefer": "count=exact"}}
    ),
  ]);

  const topPeople = await topPeopleRes.json();

  // Get total count from headers
  const contentRange = countRes.headers.get("content-range");
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
      const imageData = await fetchPersonImage(person.id);
      return {
        ...person,
        imageData,
      };
    })
  );

  // Filter to only people with images
  const peopleToShow = peopleWithImages.filter(p => p.imageData).slice(0, 8);

  const backgroundColor = "#f4f4f1";

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

        {/* Content overlay */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            zIndex: 10,
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
                fontFamily: "Marcellus,Times,serif",
                textTransform: "uppercase",
                fontWeight: "400",
                letterSpacing: ".35rem",
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
                {formatNumber(totalCount)} notable people
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
                  gap: "-20px",
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
                      zIndex: peopleToShow.length - index,
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
    }
  );
}
