import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import {COLORS_DOMAIN} from "../../../../components/utils/consts";

export const runtime = "edge";

const PRESENT_BY_LOCALE = {
  ar: "حتى اليوم",
  zh: "至今",
  nl: "heden",
  en: "Present",
  fr: "aujourd'hui",
  de: "heute",
  hu: "napjainkig",
  it: "presente",
  ja: "現在",
  pl: "obecnie",
  pt: "presente",
  ru: "настоящее время",
  es: "presente",
};

const FOOTER_TEXT_BY_LOCALE = {
  ar: "استكشف الذاكرة الجماعية للبشرية",
  zh: "探索人类集体记忆",
  nl: "Verken het collectieve geheugen van de mensheid",
  en: "Explore human collective memory",
  fr: "Explorez la mémoire collective humaine",
  de: "Erkunden Sie das kollektive Gedächtnis der Menschheit",
  hu: "Fedezze fel az emberiség kollektív emlékezetét",
  it: "Esplora la memoria collettiva umana",
  ja: "人類の集合的記憶を探求しよう",
  pl: "Odkryj zbiorową pamięć ludzkości",
  pt: "Explore a memória coletiva humana",
  ru: "Исследуйте коллективную память человечества",
  es: "Explora la memoria colectiva humana",
};

const DOMAIN_COLOR_ALIASES = {
  "public-figures": "public-figure",
  "public_figure": "public-figure",
  "publicfigure": "public-figure",
  "publicfigures": "public-figure",
  "science_and_technology": "science-technology",
  "science-and-tech": "science-technology",
  "business_and_law": "business-law",
  "business-and-law": "business-law",
};

async function fetchPersonImage(id) {
  try {
    const response = await fetch(
      `https://static.pantheon.world/profile/people/${id}.jpg`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageData = await response.arrayBuffer();

    if (imageData.byteLength === 0) {
      // The image data is empty
      console.log("The image file is empty.");
      return null; // or handle as appropriate
    } else {
      // The image data is not empty, proceed with your logic
      return imageData;
    }
  } catch (error) {
    console.error("Fetching image failed:", error);
    return null; // or handle the error as appropriate
  }
}

function formatYear(year) {
  if (year === null || year === undefined) {
    return "";
  }

  return year < 0 ? `${Math.abs(year)} BC` : `${year}`;
}

function normalizeLocale(locale) {
  return (locale || "en").toLowerCase().split("-")[0].split("_")[0];
}

function normalizeDomainSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return "";
  }

  return slug.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== "string") {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const clean = hex.replace("#", "");
  const value =
    clean.length === 3
      ? clean
          .split("")
          .map(char => char + char)
          .join("")
      : clean;
  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveDomainColor(occupation) {
  const directSlug = normalizeDomainSlug(occupation?.domain_slug);
  const aliasedSlug = DOMAIN_COLOR_ALIASES[directSlug] || directSlug;
  if (aliasedSlug && COLORS_DOMAIN[aliasedSlug]) {
    return COLORS_DOMAIN[aliasedSlug];
  }

  const domainTextSlug = normalizeDomainSlug(occupation?.domain);
  const aliasedDomainTextSlug = DOMAIN_COLOR_ALIASES[domainTextSlug] || domainTextSlug;
  if (aliasedDomainTextSlug && COLORS_DOMAIN[aliasedDomainTextSlug]) {
    return COLORS_DOMAIN[aliasedDomainTextSlug];
  }

  return "#67AF8C";
}

function getPresentLabel(locale) {
  const normalizedLocale = normalizeLocale(locale);
  return PRESENT_BY_LOCALE[normalizedLocale] || PRESENT_BY_LOCALE.en;
}

function formatLifespan(birthyear, deathyear, locale) {
  const birth = formatYear(birthyear);
  const death =
    deathyear === null || deathyear === undefined
      ? getPresentLabel(locale)
      : formatYear(deathyear);
  return `${birth} - ${death}`;
}

function getSiteLabel(locale) {
  const normalizedLocale = normalizeLocale(locale);
  return normalizedLocale === "en"
    ? "PANTHEON.WORLD"
    : `PANTHEON.WORLD/${normalizedLocale.toUpperCase()}`;
}

function getFooterText(locale) {
  const normalizedLocale = normalizeLocale(locale);
  return FOOTER_TEXT_BY_LOCALE[normalizedLocale] || FOOTER_TEXT_BY_LOCALE.en;
}

function getNameFontSize(name) {
  if (!name) {
    return 72;
  }

  if (name.length > 44) {
    return 46;
  }

  if (name.length > 36) {
    return 52;
  }

  if (name.length > 28) {
    return 58;
  }

  if (name.length > 22) {
    return 64;
  }

  return 72;
}

function getNameLineHeight(name) {
  if (!name) {
    return "1";
  }

  if (name.length > 44) {
    return "0.9";
  }

  if (name.length > 36) {
    return "0.94";
  }

  if (name.length > 28) {
    return "0.97";
  }

  return "1";
}

function getNameLetterSpacing(name) {
  if (!name) {
    return "0.8px";
  }

  if (name.length > 44) {
    return "0px";
  }

  if (name.length > 36) {
    return "0.3px";
  }

  if (name.length > 28) {
    return "0.5px";
  }

  return "0.8px";
}

function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

export async function GET(request) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
  const {searchParams} = new URL(request.url);
  const id = searchParams.get("id");
  const locale = searchParams.get("locale") || searchParams.get("lang") || "en";

  if (!id) {
    return new NextResponse("Not Found", {status: 404});
  }

  const MarcellusfontData = await fetch(
    new URL("../../../../public/fonts/Marcellus-Regular.ttf", import.meta.url),
  ).then(res => res.arrayBuffer());
  const AmikofontData = await fetch(
    new URL("../../../../public/fonts/Amiko-Regular.ttf", import.meta.url),
  ).then(res => res.arrayBuffer());
  const backgroundData = await fetch(
    new URL(
      "../../../../public/images/pantheon-person-share-img-bg.jpg",
      import.meta.url,
    ),
  ).then(res => res.arrayBuffer());
  const pantheonLogoText = await fetch(
    new URL(
      "../../../../public/images/logos/logo_pantheon.svg",
      import.meta.url,
    ),
  ).then(res => res.text());
  const pantheonLogoData = `data:image/svg+xml;utf8,${encodeURIComponent(pantheonLogoText)}`;

  const res = await fetch(
    `${BASE_API}/person?id=eq.${id}&select=name,translations,occupation(occupation,domain,domain_slug,${locale}_occupation:translations->${locale}->>occupation),birthyear,deathyear`,
  );
  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  const person = Array.isArray(data) && data.length > 0 ? data[0] : {};

  // Get localized name, fallback to English name
  const localizedName = person.translations?.[locale] || person.name;
  const {occupation, birthyear, deathyear} = person;
  const domainColor = resolveDomainColor(occupation);
  const backgroundDomainBlend = `linear-gradient(135deg, ${hexToRgba(domainColor, 0.36)} 0%, ${hexToRgba(domainColor, 0.24)} 100%)`;

  // Get localized occupation, fallback to English occupation
  const localizedOccupation =
    occupation?.[`${locale}_occupation`] || occupation?.occupation;

  if (!localizedName) {
    return new NextResponse("ID mismatch", {status: 404});
  }

  let hasImage = false;
  let imageD;
  await fetchPersonImage(id).then(imageData => {
    if (imageData) {
      imageD = imageData;
      hasImage = true;
    } else {
      hasImage = false;
    }
  });

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontFamily: "Amiko,Helvetica,Arial,sans-serif",
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      <img
        src={backgroundData}
        alt=""
        style={{
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: backgroundDomainBlend,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(250, 248, 241, 0.08)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "40px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img src={pantheonLogoData} alt="Pantheon" width={355} height={50} />
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "58px",
          paddingBottom: "58px",
          paddingLeft: "54px",
          paddingRight: "54px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "390px",
            minWidth: "390px",
            height: "390px",
            borderRadius: "50%",
            border: "10px solid #bca56f",
            overflow: "hidden",
            background: "#d4d0c4",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasImage ? (
            <img
              src={imageD}
              alt={localizedName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                color: "#5d5a52",
                fontFamily: "Marcellus,Times,serif",
                fontSize: "4.4rem",
                textTransform: "uppercase",
              }}
            >
              {getInitials(localizedName)}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            marginLeft: "-22px",
            width: "660px",
            minWidth: "660px",
            height: "300px",
            border: "4px solid #bca56f",
            background: "rgba(252, 252, 250, 0.72)",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 42px 28px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              color: "#262625",
            }}
          >
            <h2
              style={{
                margin: "0",
                color: "#222220",
                fontSize: "28px",
                fontWeight: "400",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {localizedOccupation}
            </h2>
            <h1
              style={{
                margin: "14px 0 0",
                color: "#151515",
                fontFamily: "Marcellus,Times,serif",
                fontSize: `${getNameFontSize(localizedName)}px`,
                fontWeight: "400",
                lineHeight: getNameLineHeight(localizedName),
                letterSpacing: getNameLetterSpacing(localizedName),
                textTransform: "uppercase",
                textAlign: "center",
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {localizedName}
            </h1>
            <p
              style={{
                margin: "16px 0 0",
                color: "#2f2f2d",
                fontFamily: "Amiko,Helvetica,Arial,sans-serif",
                fontSize: "36px",
                fontWeight: "400",
                letterSpacing: ".5px",
              }}
            >
              {formatLifespan(birthyear, deathyear, locale)}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "57px",
          borderTop: "1px solid rgba(84, 80, 70, 0.33)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          color: "#545048",
          fontSize: "13px",
          letterSpacing: ".2px",
          textAlign: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {`${getFooterText(locale)} | ${getSiteLabel(locale)}`}
      </div>
    </div>,
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
        {
          name: "Amiko",
          data: AmikofontData,
          style: "normal",
        },
      ],
    },
  );
}
