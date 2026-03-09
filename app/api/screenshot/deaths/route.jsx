import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";

export const runtime = "edge";

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
  const year = searchParams.get("year");

  if (!year) {
    return new NextResponse("Year parameter required", {status: 400});
  }

  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    return new NextResponse("Invalid year", {status: 400});
  }

  // Load fonts and images
  const MarcellusfontData = await fetch(
    new URL("../../../../public/fonts/Marcellus-Regular.ttf", import.meta.url)
  ).then(res => res.arrayBuffer());

  const wreathImageBuffer = await fetch(
    new URL("../../../../public/images/misc/wreath.png", import.meta.url)
  ).then(res => res.arrayBuffer());

  // Convert wreath image to base64 data URL
  const wreathBase64 = Buffer.from(wreathImageBuffer).toString("base64");
  const wreathDataUrl = `data:image/png;base64,${wreathBase64}`;

  // Fetch people who died this year
  const [peopleDiedThisYearAttrs, peopleDiedThisYearHpi] = await Promise.all([
    fetch(
      `${BASE_API}/person?alive=is.false&deathdate=gte.01-01-${yearNum}&deathdate=lte.12-31-${yearNum}&select=name,slug,id,gender&order=deathdate.asc`
    ).then(res => res.json()),
    fetch(
      `${BASE_API}/person_ranks?deathyear=eq.${yearNum}&select=id,hpi`
    ).then(res => res.json()),
  ]);

  // Merge and sort by HPI
  const peopleDiedThisYear = peopleDiedThisYearAttrs
    .map(person => {
      const hpiData = peopleDiedThisYearHpi.find(hpi => hpi.id === person.id);
      return {
        ...person,
        ...(hpiData || {}),
      };
    })
    .filter(person => person.hpi)
    .sort((a, b) => b.hpi - a.hpi)
    .slice(0, 16); // Top 16 people

  // Fetch images for top people
  const peopleWithImages = await Promise.all(
    peopleDiedThisYear.map(async person => {
      const imageData = await fetchPersonImage(person.id);
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
            zIndex: 10,
          }}
        >
          <h1
            style={{
              color: "#363636",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".4rem",
              fontSize: "4.5rem",
              margin: "0",
              textAlign: "center",
            }}
          >
            PASSINGS
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
            zIndex: 10,
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
      ],
      }
    );
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
