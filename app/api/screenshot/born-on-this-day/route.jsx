import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";

export const runtime = "edge";

// Month names for display
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDateForDisplay(month, day) {
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const monthName = MONTH_NAMES[monthNum - 1];

  // Add ordinal suffix
  const suffix = dayNum === 1 || dayNum === 21 || dayNum === 31 ? "st"
    : dayNum === 2 || dayNum === 22 ? "nd"
    : dayNum === 3 || dayNum === 23 ? "rd"
    : "th";

  return `${monthName} ${dayNum}${suffix}`;
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
  const date = searchParams.get("date");

  if (!date) {
    return new NextResponse("Date parameter required (MM-DD format)", {status: 400});
  }

  const [month, day] = date.split("-");

  if (!month || !day || month.length !== 2 || day.length !== 2) {
    return new NextResponse("Invalid date format. Use MM-DD", {status: 400});
  }

  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);

  if (isNaN(monthNum) || isNaN(dayNum) || monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return new NextResponse("Invalid date values", {status: 400});
  }

  // Load font
  const MarcellusfontData = await fetch(
    new URL("../../../../public/fonts/Marcellus-Regular.ttf", import.meta.url)
  ).then(res => res.arrayBuffer());

  // Fetch people born on this day
  const peopleBornOnDay = await fetch(
    `${BASE_API}/rpc/born_on_day?m=${month}&d=${day}&lang=en`
  )
    .then(res => res.json())
    .then(data => Array.isArray(data) ? data : [])
    .catch(error => {
      console.error("Error fetching people:", error);
      return [];
    });

  // Sort by HPI and take top 16
  const topPeople = peopleBornOnDay
    .filter(p => p.hpi)
    .sort((a, b) => b.hpi - a.hpi)
    .slice(0, 16);

  // Fetch images for top people
  const peopleWithImages = await Promise.all(
    topPeople.map(async person => {
      const imageData = await fetchPersonImage(person.person_id);
      return {
        ...person,
        imageData,
      };
    })
  );

  const displayDate = formatDateForDisplay(month, day);
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
          <h1
            style={{
              color: "#363636",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".3rem",
              fontSize: "3rem",
              margin: "0",
              textAlign: "center",
            }}
          >
            BORN ON
          </h1>
          <h1
            style={{
              color: "#363636",
              fontFamily: "Marcellus,Times,serif",
              textTransform: "uppercase",
              fontWeight: "400",
              letterSpacing: ".3rem",
              fontSize: "3rem",
              margin: "0",
              textAlign: "center",
            }}
          >
            THIS DAY
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "30px",
              padding: "20px 40px",
              background: "linear-gradient(135deg, #0088cc 0%, #005588 100%)",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontFamily: "Marcellus,Times,serif",
                fontWeight: "400",
                letterSpacing: ".2rem",
                fontSize: "2.5rem",
                textAlign: "center",
              }}
            >
              {displayDate}
            </span>
          </div>
          <p
            style={{
              color: "#9e978d",
              fontSize: "1.2rem",
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            {peopleBornOnDay.length > 0 ? `${peopleBornOnDay.length} famous people` : "Explore birthdays"}
          </p>
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
            zIndex: 10,
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
                key={person.person_id || index}
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
    }
  );
}
