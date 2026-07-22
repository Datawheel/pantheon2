import sharp from "sharp";

const FONT_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;

function escapeXml(value) {
  return `${value ?? ""}`
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function uniqueFontText(text) {
  return Array.from(new Set(Array.from(text))).join("");
}

async function fetchArabicFonts(text) {
  const cssUrl = new URL("https://fonts.googleapis.com/css2");
  cssUrl.searchParams.set("family", "Noto Sans Arabic:wght@400;700");
  cssUrl.searchParams.set("text", uniqueFontText(text));
  const cssResponse = await fetch(cssUrl, {
    headers: {"user-agent": "Mozilla/5.0"},
    next: {revalidate: FONT_REVALIDATE_SECONDS},
  });
  if (!cssResponse.ok) {
    throw new Error(`Arabic font CSS failed: ${cssResponse.status}`);
  }

  const css = await cssResponse.text();
  const faces = Array.from(
    css.matchAll(
      /font-style:\s*([^;]+);[\s\S]*?font-weight:\s*(\d+);[\s\S]*?src:\s*url\(([^)]+)\)/g,
    ),
  );
  if (!faces.length) throw new Error("Arabic font faces unavailable");

  return Promise.all(
    faces.map(async face => {
      const response = await fetch(face[3], {
        next: {revalidate: FONT_REVALIDATE_SECONDS},
      });
      if (!response.ok) {
        throw new Error(`Arabic font file failed: ${response.status}`);
      }
      return {
        data: await response.arrayBuffer(),
        style: face[1].trim(),
        weight: parseInt(face[2], 10),
      };
    }),
  );
}

function wrapText(value, maxCharacters = 27, maxLines = 2) {
  const words = `${value || ""}`.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let current = "";
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    if (lines.length === maxLines - 1) {
      current = words.slice(index).join(" ");
      break;
    }
    current = word;
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.slice(0, maxLines);
}

function portraitMarkup(people) {
  const shown = (people || []).filter(person => person.imageData).slice(0, 8);
  if (!shown.length) return "";

  const size = 100;
  const overlap = 15;
  const totalWidth = shown.length * size - (shown.length - 1) * overlap;
  const startX = (1200 - totalWidth) / 2;
  return shown.map((person, index) => {
    const x = startX + index * (size - overlap);
    const centerX = x + size / 2;
    const clipId = `portrait-${index}`;
    return `
      <defs>
        <clipPath id="${clipId}">
          <circle cx="${centerX}" cy="525" r="48" />
        </clipPath>
      </defs>
      <image href="${person.imageData}" x="${x}" y="475"
        width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice"
        clip-path="url(#${clipId})" />
      <circle cx="${centerX}" cy="525" r="48" fill="none"
        stroke="rgba(255,255,255,.92)" stroke-width="4" />
    `;
  }).join("");
}

export async function createArabicLocationCard({
  backgroundImage,
  countryName,
  locationName,
  notableLabel,
  people,
}) {
  const fontText = `PANTHEON ${locationName} ${countryName || ""} ${notableLabel || ""}`;
  const fonts = await fetchArabicFonts(fontText);
  const regular = fonts.find(font => font.weight === 400) || fonts[0];
  const bold = fonts.find(font => font.weight === 700) || regular;
  const regularData = Buffer.from(regular.data).toString("base64");
  const boldData = Buffer.from(bold.data).toString("base64");
  const titleLines = wrapText(locationName);
  const titleSize = locationName.length > 28 ? 52 : 66;
  const titleLineHeight = Math.round(titleSize * 1.12);
  const titleStartY = titleLines.length > 1 ? 215 : 250;
  const titleMarkup = titleLines.map((line, index) => `
    <text x="600" y="${titleStartY + index * titleLineHeight}"
      class="rtl title" font-size="${titleSize}" text-anchor="middle">
      ${escapeXml(line)}
    </text>
  `).join("");
  const countryY = titleStartY + titleLines.length * titleLineHeight + 10;
  const notableY = countryY + (countryName ? 58 : 12);

  const backgroundMarkup = backgroundImage
    ? `<image href="${backgroundImage}" width="1200" height="630"
        preserveAspectRatio="xMidYMid slice" />`
    : `<rect width="1200" height="630" fill="#4d5263" />`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="overlay" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity=".16" />
          <stop offset="52%" stop-color="#000" stop-opacity=".34" />
          <stop offset="100%" stop-color="#000" stop-opacity=".78" />
        </linearGradient>
      </defs>
      <style>
        @font-face {
          font-family: LocationArabic;
          src: url(data:font/ttf;base64,${regularData});
          font-weight: 400;
        }
        @font-face {
          font-family: LocationArabic;
          src: url(data:font/ttf;base64,${boldData});
          font-weight: 700;
        }
        text {
          font-family: LocationArabic, sans-serif;
          fill: #fff;
        }
        .rtl { direction: rtl; unicode-bidi: embed; }
        .title { font-weight: 700; }
      </style>
      ${backgroundMarkup}
      <rect width="1200" height="630" fill="url(#overlay)" />
      <text x="600" y="60" text-anchor="middle" font-size="25"
        letter-spacing="7">PANTHEON</text>
      ${titleMarkup}
      ${countryName ? `
        <text x="600" y="${countryY}" class="rtl" text-anchor="middle"
          font-size="31">${escapeXml(countryName)}</text>
      ` : ""}
      ${notableLabel ? `
        <text x="600" y="${notableY}" class="rtl" text-anchor="middle"
          font-size="25" fill-opacity=".86">${escapeXml(notableLabel)}</text>
      ` : ""}
      ${portraitMarkup(people)}
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
