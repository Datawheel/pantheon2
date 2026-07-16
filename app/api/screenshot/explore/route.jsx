import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import sharp from "sharp";
import {getExploreTranslations} from "@/app/exploreTranslations";
import {
  getSupportedLocale,
  isArabicLocale,
} from "@/app/api/screenshot/helpers/locale";
import {OG_CACHE_CONTROL} from "@/app/api/screenshot/helpers/cache";

export const runtime = "nodejs";

const GOOGLE_FONT_FAMILIES = {
  ar: "Noto Sans Arabic",
  zh: "Noto Sans SC",
  ja: "Noto Sans JP",
  ru: "Noto Sans",
};

function cleanText(value, fallback, maxLength) {
  const normalized = `${value || fallback || ""}`
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function getTitleFontSize(title) {
  if (title.length > 120) return 38;
  if (title.length > 90) return 44;
  if (title.length > 62) return 50;
  if (title.length > 38) return 58;
  return 68;
}

function getSiteLabel(locale) {
  return locale === "en"
    ? "PANTHEON.WORLD"
    : `PANTHEON.WORLD/${locale.toUpperCase()}`;
}

async function fetchPublicAsset(requestUrl, assetPath) {
  const response = await fetch(new URL(assetPath, requestUrl));
  if (!response.ok) {
    throw new Error(`Failed to fetch ${assetPath}: ${response.status}`);
  }
  return response.arrayBuffer();
}

async function fetchGoogleFonts(locale, text) {
  const family = GOOGLE_FONT_FAMILIES[locale];
  if (!family) return [];

  const uniqueText = Array.from(new Set(Array.from(text))).join("");
  const cssUrl = new URL("https://fonts.googleapis.com/css2");
  cssUrl.searchParams.set("family", `${family}:wght@400;700`);
  cssUrl.searchParams.set("text", uniqueText);
  const cssResponse = await fetch(cssUrl, {
    headers: {
      // Google Fonts serves TrueType for this generic UA. ImageResponse's
      // runtime rejects the WOFF2 files returned to modern Chrome UAs.
      "user-agent": "Mozilla/5.0",
    },
    next: {revalidate: 7 * 24 * 60 * 60},
  });
  if (!cssResponse.ok) {
    throw new Error(`Google Fonts CSS failed: ${cssResponse.status}`);
  }

  const css = await cssResponse.text();
  const faces = Array.from(css.matchAll(
    /font-style:\s*([^;]+);[\s\S]*?font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)/g,
  ));
  if (!faces.length) {
    throw new Error("Google Fonts returned no usable font faces");
  }

  return Promise.all(faces.map(async face => {
    const response = await fetch(face[3], {
      next: {revalidate: 7 * 24 * 60 * 60},
    });
    if (!response.ok) {
      throw new Error(`Google font file failed: ${response.status}`);
    }
    return {
      name: "ExploreText",
      data: await response.arrayBuffer(),
      weight: parseInt(face[2], 10),
      style: face[1].trim(),
    };
  }));
}

async function loadFonts(requestUrl, locale, text) {
  const [marcellus, amiko] = await Promise.all([
    fetchPublicAsset(requestUrl, "/fonts/Marcellus-Regular.ttf"),
    fetchPublicAsset(requestUrl, "/fonts/Amiko-Regular.ttf"),
  ]);
  let localizedFonts = [];

  if (GOOGLE_FONT_FAMILIES[locale]) {
    try {
      localizedFonts = await fetchGoogleFonts(locale, text);
    } catch (error) {
      console.error(
        "[screenshot-font-fallback]",
        {route: "explore", locale},
        error,
      );
    }
  }

  return {
    fonts: [
      {
        name: "Marcellus",
        data: marcellus,
        weight: 400,
        style: "normal",
      },
      {
        name: "ExploreText",
        data: amiko,
        weight: 400,
        style: "normal",
      },
      {
        name: "ExploreText",
        data: amiko,
        weight: 700,
        style: "normal",
      },
      ...localizedFonts,
    ],
    localizedFonts,
  };
}

function RankingsGraphic() {
  const rows = [
    {rank: "01", width: 270, color: "#cf9c52"},
    {rank: "02", width: 220, color: "#9aa7ae"},
    {rank: "03", width: 175, color: "#ad765c"},
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        width: "390px",
      }}
    >
      {rows.map(row => (
        <div
          key={row.rank}
          style={{
            alignItems: "center",
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(61,57,52,0.12)",
            borderRadius: "18px",
            boxShadow: "0 18px 45px rgba(63,56,45,0.09)",
            display: "flex",
            height: "94px",
            padding: "0 24px",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: row.color,
              borderRadius: "50%",
              color: "#fff",
              display: "flex",
              fontSize: "22px",
              height: "52px",
              justifyContent: "center",
              width: "52px",
            }}
          >
            {row.rank}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginLeft: "20px",
            }}
          >
            <div
              style={{
                background: "#343331",
                borderRadius: "6px",
                display: "flex",
                height: "13px",
                opacity: 0.82,
                width: `${row.width}px`,
              }}
            />
            <div
              style={{
                background: "#b9b4ac",
                borderRadius: "5px",
                display: "flex",
                height: "9px",
                opacity: 0.58,
                width: `${Math.round(row.width * 0.62)}px`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function VisualizationGraphic() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(61,57,52,0.12)",
        borderRadius: "28px",
        boxShadow: "0 24px 60px rgba(63,56,45,0.11)",
        display: "flex",
        height: "360px",
        padding: "24px",
        width: "430px",
      }}
    >
      <svg width="382" height="312" viewBox="0 0 382 312">
        <defs>
          <linearGradient id="areaA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#445f78" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#445f78" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="areaB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#cf9c52" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#cf9c52" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {[42, 96, 150, 204, 258].map(y => (
          <line
            key={y}
            x1="18"
            x2="364"
            y1={y}
            y2={y}
            stroke="#d8d3ca"
            strokeWidth="1"
          />
        ))}
        <path
          d="M18 258 C72 218 92 232 134 184 C176 136 210 168 248 109 C290 44 321 91 364 48 L364 282 L18 282 Z"
          fill="url(#areaA)"
        />
        <path
          d="M18 269 C61 248 89 258 130 226 C168 198 205 221 247 181 C290 140 324 170 364 126 L364 282 L18 282 Z"
          fill="url(#areaB)"
        />
        <path
          d="M18 258 C72 218 92 232 134 184 C176 136 210 168 248 109 C290 44 321 91 364 48"
          fill="none"
          stroke="#334f68"
          strokeLinecap="round"
          strokeWidth="5"
        />
        {[18, 92, 176, 248, 321, 364].map((x, index) => {
          const y = [258, 230, 150, 109, 82, 48][index];
          return (
            <circle
              key={x}
              cx={x}
              cy={y}
              fill="#f5f2eb"
              r="7"
              stroke="#334f68"
              strokeWidth="4"
            />
          );
        })}
      </svg>
    </div>
  );
}

function escapeXml(value) {
  return `${value}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapSvgText(value, maxCharacters, maxLines) {
  const words = `${value}`.split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length <= maxCharacters || !currentLine) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
    if (lines.length === maxLines - 1) {
      const remaining = [currentLine, ...words.slice(index + 1)].join(" ");
      const clipped = remaining.length > maxCharacters
        ? `${remaining.slice(0, maxCharacters - 1).trimEnd()}…`
        : remaining;
      lines.push(clipped);
      return lines;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.slice(0, maxLines);
}

function getArabicGraphic(kind) {
  if (kind === "rankings") {
    const rows = [
      {rank: "01", y: 168, width: 270, color: "#cf9c52"},
      {rank: "02", y: 280, width: 220, color: "#9aa7ae"},
      {rank: "03", y: 392, width: 175, color: "#ad765c"},
    ];
    return rows.map(row => `
      <g>
        <rect x="54" y="${row.y}" width="430" height="94" rx="18"
          fill="#fff" fill-opacity=".82" stroke="#3d3934" stroke-opacity=".12" />
        <circle cx="92" cy="${row.y + 47}" r="26" fill="${row.color}" />
        <text x="92" y="${row.y + 55}" text-anchor="middle"
          class="latin rank">${row.rank}</text>
        <rect x="132" y="${row.y + 29}" width="${row.width}" height="13" rx="6"
          fill="#343331" fill-opacity=".82" />
        <rect x="132" y="${row.y + 55}" width="${Math.round(row.width * 0.62)}"
          height="9" rx="5" fill="#b9b4ac" fill-opacity=".58" />
      </g>
    `).join("");
  }

  return `
    <rect x="54" y="140" width="430" height="360" rx="28"
      fill="#fff" fill-opacity=".82" stroke="#3d3934" stroke-opacity=".12" />
    <g transform="translate(78 164)">
      <defs>
        <linearGradient id="arabicAreaA" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#445f78" stop-opacity=".8" />
          <stop offset="100%" stop-color="#445f78" stop-opacity=".14" />
        </linearGradient>
        <linearGradient id="arabicAreaB" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#cf9c52" stop-opacity=".82" />
          <stop offset="100%" stop-color="#cf9c52" stop-opacity=".12" />
        </linearGradient>
      </defs>
      <g stroke="#d8d3ca" stroke-width="1">
        <line x1="18" x2="364" y1="42" y2="42" />
        <line x1="18" x2="364" y1="96" y2="96" />
        <line x1="18" x2="364" y1="150" y2="150" />
        <line x1="18" x2="364" y1="204" y2="204" />
        <line x1="18" x2="364" y1="258" y2="258" />
      </g>
      <path d="M18 258 C72 218 92 232 134 184 C176 136 210 168 248 109 C290 44 321 91 364 48 L364 282 L18 282 Z"
        fill="url(#arabicAreaA)" />
      <path d="M18 269 C61 248 89 258 130 226 C168 198 205 221 247 181 C290 140 324 170 364 126 L364 282 L18 282 Z"
        fill="url(#arabicAreaB)" />
      <path d="M18 258 C72 218 92 232 134 184 C176 136 210 168 248 109 C290 44 321 91 364 48"
        fill="none" stroke="#334f68" stroke-linecap="round" stroke-width="5" />
      <g fill="#f5f2eb" stroke="#334f68" stroke-width="4">
        <circle cx="18" cy="258" r="7" />
        <circle cx="92" cy="230" r="7" />
        <circle cx="176" cy="150" r="7" />
        <circle cx="248" cy="109" r="7" />
        <circle cx="321" cy="82" r="7" />
        <circle cx="364" cy="48" r="7" />
      </g>
    </g>
  `;
}

async function createArabicExplorePng({
  fonts,
  kind,
  label,
  requestUrl,
  subtitle,
  title,
}) {
  const regularFont = fonts.find(font => font.weight === 400);
  const boldFont = fonts.find(font => font.weight === 700);
  if (!regularFont || !boldFont) {
    throw new Error("Arabic fonts unavailable");
  }

  const logoData = Buffer.from(
    await fetchPublicAsset(requestUrl, "/images/logos/logo_pantheon.svg"),
  ).toString("base64");
  const regularData = Buffer.from(regularFont.data).toString("base64");
  const boldData = Buffer.from(boldFont.data).toString("base64");
  const titleFontSize = getTitleFontSize(title);
  const titleCharacters = Math.max(
    16,
    Math.floor(590 / (titleFontSize * 0.52)),
  );
  const titleLines = wrapSvgText(title, titleCharacters, 3);
  const subtitleLines = wrapSvgText(subtitle, 48, 3);
  const titleStartY = titleLines.length === 1 ? 248 : 206;
  const titleLineHeight = Math.round(titleFontSize * 1.12);
  const subtitleStartY = titleStartY
    + titleLines.length * titleLineHeight
    + 30;
  const titleMarkup = titleLines.map((line, index) => `
    <text x="1146" y="${titleStartY + index * titleLineHeight}"
      class="rtl title" font-size="${titleFontSize}">${escapeXml(line)}</text>
  `).join("");
  const subtitleMarkup = subtitleLines.map((line, index) => `
    <text x="1146" y="${subtitleStartY + index * 31}"
      class="rtl subtitle">${escapeXml(line)}</text>
  `).join("");
  const accentColor = kind === "rankings" ? "#cf9c52" : "#445f78";
  const pillColor = kind === "rankings" ? "#6f5842" : "#334f68";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="background" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f8f6f1" />
          <stop offset="58%" stop-color="#eee9df" />
          <stop offset="100%" stop-color="#e5ddd1" />
        </linearGradient>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="18"
            flood-color="#3f382d" flood-opacity=".11" />
        </filter>
      </defs>
      <style>
        @font-face {
          font-family: ExploreArabic;
          src: url(data:font/ttf;base64,${regularData});
          font-weight: 400;
        }
        @font-face {
          font-family: ExploreArabic;
          src: url(data:font/ttf;base64,${boldData});
          font-weight: 700;
        }
        text { font-family: ExploreArabic, sans-serif; fill: #343331; }
        .rtl { direction: rtl; unicode-bidi: embed; text-anchor: start; }
        .title { font-weight: 700; }
        .subtitle { fill: #716c65; font-size: 21px; font-weight: 400; }
        .label { fill: #fff; font-size: 17px; font-weight: 700; }
        .latin { direction: ltr; unicode-bidi: embed; text-anchor: middle; }
        .rank { fill: #fff; font-size: 22px; font-weight: 700; }
        .site { fill: #777169; font-size: 14px; letter-spacing: 1.4px; }
      </style>
      <rect width="1200" height="630" fill="url(#background)" />
      <circle cx="1210" cy="20" r="230" fill="#cf9c52" fill-opacity=".18" />
      <circle cx="30" cy="650" r="220" fill="#445f78" fill-opacity=".10" />
      <image href="data:image/svg+xml;base64,${logoData}"
        x="54" y="37" width="273" height="38" />
      <rect x="910" y="34" width="236" height="42" rx="21" fill="${pillColor}" />
      <text x="1028" y="61" text-anchor="middle" class="label"
        direction="rtl" unicode-bidi="embed">${escapeXml(label)}</text>
      <rect x="1062" y="158" width="84" height="7" fill="${accentColor}" />
      <g filter="url(#cardShadow)">${getArabicGraphic(kind)}</g>
      ${titleMarkup}
      ${subtitleMarkup}
      <line x1="0" x2="1200" y1="584" y2="584"
        stroke="#545046" stroke-opacity=".20" />
      <text x="600" y="613" text-anchor="middle" class="site latin">
        ${escapeXml(getSiteLabel("ar"))}
      </text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function createExploreImage({
  fonts,
  kind,
  label,
  locale,
  requestUrl,
  subtitle,
  title,
}) {
  const rtl = isArabicLocale(locale);
  const titleFontSize = getTitleFontSize(title);
  const logoUrl = new URL("/images/logos/logo_pantheon.svg", requestUrl).toString();

  return new ImageResponse(
    <div
      dir={rtl ? "rtl" : "ltr"}
      style={{
        background:
          "linear-gradient(135deg, #f8f6f1 0%, #eee9df 58%, #e5ddd1 100%)",
        color: "#343331",
        display: "flex",
        flexDirection: "column",
        fontFamily: "ExploreText, sans-serif",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(207,156,82,0.18)",
          borderRadius: "50%",
          display: "flex",
          height: "460px",
          position: "absolute",
          right: "-150px",
          top: "-210px",
          width: "460px",
        }}
      />
      <div
        style={{
          background: "rgba(68,95,120,0.10)",
          borderRadius: "50%",
          bottom: "-230px",
          display: "flex",
          height: "440px",
          left: "-170px",
          position: "absolute",
          width: "440px",
        }}
      />

      <div
        style={{
          alignItems: "center",
          display: "flex",
          height: "112px",
          justifyContent: "space-between",
          padding: "34px 54px 20px",
          width: "100%",
        }}
      >
        {/* next/image cannot render inside ImageResponse. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="38"
          src={logoUrl}
          style={{height: "38px", width: "273px"}}
          width="273"
        />
        <div
          style={{
            alignItems: "center",
            background: kind === "rankings" ? "#6f5842" : "#334f68",
            borderRadius: "999px",
            color: "#fff",
            display: "flex",
            fontSize: "17px",
            fontWeight: 700,
            letterSpacing: rtl ? "0" : "0.7px",
            padding: "10px 20px",
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          flexDirection: rtl ? "row-reverse" : "row",
          gap: "50px",
          padding: "8px 54px 34px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: rtl ? "flex-end" : "flex-start",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "650px",
            textAlign: rtl ? "right" : "left",
          }}
        >
          <div
            style={{
              background: kind === "rankings" ? "#cf9c52" : "#445f78",
              display: "flex",
              height: "7px",
              marginBottom: "25px",
              width: "84px",
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: "ExploreText, sans-serif",
              fontSize: `${titleFontSize}px`,
              fontWeight: 700,
              letterSpacing: rtl ? "0" : "-1.4px",
              lineHeight: 1.05,
              maxHeight: "225px",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#716c65",
              display: "flex",
              fontSize: "21px",
              fontWeight: 400,
              lineHeight: 1.38,
              marginTop: "24px",
              maxHeight: "92px",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            width: "430px",
          }}
        >
          {kind === "rankings" ? <RankingsGraphic /> : <VisualizationGraphic />}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: "1px solid rgba(84,80,70,0.20)",
          color: "#777169",
          display: "flex",
          fontFamily: "Marcellus, ExploreText, serif",
          fontSize: "14px",
          height: "46px",
          justifyContent: "center",
          letterSpacing: "1.4px",
          width: "100%",
        }}
      >
        {getSiteLabel(locale)}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const locale = getSupportedLocale(searchParams.get("locale"));
  const kind = searchParams.get("kind") === "rankings" ? "rankings" : "viz";
  const t = getExploreTranslations(locale);
  const label = t(kind === "rankings" ? "rankings" : "visualizations");
  const title = cleanText(
    searchParams.get("title"),
    kind === "rankings" ? t("pantheonRankings") : t("vizMetaTitle"),
    160,
  );
  const subtitle = cleanText(
    searchParams.get("subtitle"),
    kind === "rankings" ? t("metadataCompare") : t("vizMetaDescription"),
    260,
  );
  const fontText = `${label} ${title} ${subtitle} ${getSiteLabel(locale)}`;

  let fontBundle = {fonts: [], localizedFonts: []};
  try {
    fontBundle = await loadFonts(request.url, locale, fontText);
  } catch (error) {
    console.error(
      "[screenshot-font-fallback]",
      {route: "explore", locale, stage: "local-fonts"},
      error,
    );
  }

  const buildResponse = png => new NextResponse(png, {
    status: 200,
    headers: {
      "cache-control": OG_CACHE_CONTROL,
      "content-type": "image/png",
      "x-content-type-options": "nosniff",
      "x-og-kind": kind,
      "x-og-locale": locale,
    },
  });

  if (isArabicLocale(locale)) {
    try {
      const png = await createArabicExplorePng({
        fonts: fontBundle.localizedFonts,
        kind,
        label,
        requestUrl: request.url,
        subtitle,
        title,
      });
      return buildResponse(png);
    } catch (error) {
      console.error(
        "[screenshot-fail]",
        {route: "explore", kind, locale, stage: "sharp-rtl"},
        error,
      );
      return new NextResponse("OG render failed", {status: 500});
    }
  }

  const render = async renderFonts => {
    const image = createExploreImage({
      fonts: renderFonts,
      kind,
      label,
      locale,
      requestUrl: request.url,
      subtitle,
      title,
    });
    const png = await image.arrayBuffer();
    return buildResponse(png);
  };

  try {
    return await render(fontBundle.fonts);
  } catch (error) {
    try {
      return await render([]);
    } catch (fallbackError) {
      console.error(
        "[screenshot-fail]",
        {route: "explore", kind, locale, url: request.url},
        fallbackError,
      );
      console.error("[screenshot-primary-fail]", error);
      return new NextResponse("OG render failed", {status: 500});
    }
  }
}
