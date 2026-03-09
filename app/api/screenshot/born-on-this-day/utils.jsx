import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";

// Localized date formatters
const DATE_FORMATTERS = {
  en: (month, day) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
    return `${months[month - 1]} ${day}${suffix}`;
  },
  es: (month, day) => {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${day} de ${months[month - 1]}`;
  },
  fr: (month, day) => {
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    return `${day} ${months[month - 1]}`;
  },
  de: (month, day) => {
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    return `${day}. ${months[month - 1]}`;
  },
  pt: (month, day) => {
    const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    return `${day} de ${months[month - 1]}`;
  },
  it: (month, day) => {
    const months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
    return `${day} ${months[month - 1]}`;
  },
  nl: (month, day) => {
    const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    return `${day} ${months[month - 1]}`;
  },
  pl: (month, day) => {
    const months = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    return `${day} ${months[month - 1]}`;
  },
  ru: (month, day) => {
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${day} ${months[month - 1]}`;
  },
  zh: (month, day) => `${month}月${day}日`,
  ja: (month, day) => `${month}月${day}日`,
  ar: (month, day) => {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return `${day} ${months[month - 1]}`;
  },
  hu: (month, day) => {
    const months = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
    return `${months[month - 1]} ${day}.`;
  },
};

// Localized "Born on this day" text
const BORN_ON_THIS_DAY = {
  en: "BORN ON THIS DAY",
  es: "NACIDOS EN ESTE DÍA",
  fr: "NÉS CE JOUR",
  de: "HEUTE GEBOREN",
  pt: "NASCIDOS NESTE DIA",
  it: "NATI OGGI",
  nl: "VANDAAG GEBOREN",
  pl: "URODZENI TEGO DNIA",
  ru: "РОДИЛИСЬ В ЭТОТ ДЕНЬ",
  zh: "今日出生",
  ja: "今日生まれた人",
  ar: "ولدوا في هذا اليوم",
  hu: "MA SZÜLETETTEK",
};

// Localized "famous people" text
const FAMOUS_PEOPLE = {
  en: (count) => `${count} famous people`,
  es: (count) => `${count} personas famosas`,
  fr: (count) => `${count} personnes célèbres`,
  de: (count) => `${count} berühmte Personen`,
  pt: (count) => `${count} pessoas famosas`,
  it: (count) => `${count} persone famose`,
  nl: (count) => `${count} beroemde personen`,
  pl: (count) => `${count} słynnych osób`,
  ru: (count) => `${count} знаменитых людей`,
  zh: (count) => `${count}位名人`,
  ja: (count) => `${count}人の有名人`,
  ar: (count) => `${count} شخص مشهور`,
  hu: (count) => `${count} híres személy`,
};

function formatDateForDisplay(month, day, locale = "en") {
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const formatter = DATE_FORMATTERS[locale] || DATE_FORMATTERS.en;
  return formatter(monthNum, dayNum);
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

export async function getBornOnThisDayImageResponse({date, locale = "en"}) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";

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
    `${BASE_API}/rpc/born_on_day?m=${month}&d=${day}&lang=${locale}`
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

  const displayDate = formatDateForDisplay(month, day, locale);
  const bornOnThisDayText = BORN_ON_THIS_DAY[locale] || BORN_ON_THIS_DAY.en;
  const famousPeopleText = (FAMOUS_PEOPLE[locale] || FAMOUS_PEOPLE.en)(peopleBornOnDay.length);
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
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              letterSpacing: "4px",
              color: "#b5aaa0",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            PANTHEON
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: "#3c2f2f",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "20px",
            }}
          >
            {bornOnThisDayText}
          </div>

          <div
            style={{
              backgroundColor: "#0f5ea8",
              color: "white",
              padding: "15px 25px",
              borderRadius: "8px",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {displayDate}
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#837a72",
            }}
          >
            {famousPeopleText}
          </div>
        </div>

        {/* Right column - Image grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            padding: "40px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "-4px",
              width: 520,
              height: 520,
              alignSelf: "center",
            }}
          >
            {peopleWithImages.map((person, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  width: "25%",
                  height: "25%",
                  padding: "4px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: "#e1dcd5",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {person.imageData ? (
                    <img
                      src={person.imageData}
                      alt={person.name}
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
                        backgroundColor: "#d0c8bf",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
        route: "born-on-this-day-utils",
        date,
        locale,
      },
      error
    );
    return new NextResponse("OG render failed", {status: 500});
  }
}
