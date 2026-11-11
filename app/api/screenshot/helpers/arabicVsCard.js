import sharp from "sharp";
import {escapeXml, fetchArabicFonts, wrapText} from "./arabicLocationCard";

// Arabic version of the occupation-country-vs share card. Satori can't parse
// Noto Sans Arabic's GSUB table ("lookupType: 5 - substFormat: 3"), so like
// the place card this draws an SVG and rasterizes it with sharp/librsvg,
// which shapes Arabic and handles RTL. Layout mirrors the Satori card with
// the sides swapped: side A (first in reading order) on the right.

const W = 1200;
const H = 630;
const PANEL = 330;

function panel({x, image, person, color, innerEdge}) {
  const lines = wrapText(person, 18, 2);
  const nameY = H - 40 - (lines.length - 1) * 40;
  const cx = x + PANEL / 2;
  return `
    <rect x="${x}" y="0" width="${PANEL}" height="${H}" fill="#d9d6cf" />
    ${image ? `<image href="${image}" x="${x}" y="0" width="${PANEL}" height="${H}" preserveAspectRatio="xMidYMid slice" />` : ""}
    <rect x="${x}" y="${H - 300}" width="${PANEL}" height="300" fill="url(#fade)" />
    <rect x="${innerEdge}" y="0" width="10" height="${H}" fill="${color}" />
    <rect x="${cx - 26}" y="${nameY - 70}" width="52" height="34" rx="17" fill="${color}" />
    <text x="${cx}" y="${nameY - 46}" text-anchor="middle" class="latin" font-size="22" fill="#fff">#1</text>
    ${lines.map((line, i) => `
      <text x="${cx}" y="${nameY + i * 40}" text-anchor="middle" class="rtl" font-size="32" fill="#fff">${escapeXml(line)}</text>
    `).join("")}
  `;
}

function nameSize(name) {
  const length = Array.from(name).length;
  if (length <= 10) return 64;
  if (length <= 16) return 52;
  if (length <= 24) return 42;
  return 34;
}

export async function createArabicVsCard({
  text, // {kicker, countLabel, vs, A, B, nA, nB, topA, topB}
  imageA,
  imageB,
  colorA,
  colorB,
  countA,
  countB,
  marcellusData,
}) {
  const fonts = await fetchArabicFonts(Object.values(text).join(" "));
  const regular = fonts.find(font => font.weight === 400) || fonts[0];
  const bold = fonts.find(font => font.weight === 700) || regular;
  const fontFace = (family, data, weight) => `
    @font-face {
      font-family: ${family};
      src: url(data:font/ttf;base64,${Buffer.from(data).toString("base64")});
      font-weight: ${weight};
    }`;

  const cx = W / 2;
  const sizeA = nameSize(text.A);
  const sizeB = nameSize(text.B);
  // Reading order is right to left: A's count sits on the right of the bar.
  const barX = cx - 170;
  const barW = 340;
  const shareA = Math.max(0.06, Math.min(0.94, countA / (countA + countB)));
  const widthB = Math.round(barW * (1 - shareA));

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#141414" stop-opacity="0" />
          <stop offset="100%" stop-color="#141414" stop-opacity=".82" />
        </linearGradient>
        <clipPath id="bar"><rect x="${barX}" y="483" width="${barW}" height="12" rx="6" /></clipPath>
      </defs>
      <style>
        ${fontFace("VsArabic", regular.data, 400)}
        ${fontFace("VsArabic", bold.data, 700)}
        ${marcellusData ? fontFace("VsLatin", marcellusData, 400) : ""}
        text { font-family: VsArabic, sans-serif; }
        .latin { font-family: VsLatin, VsArabic, sans-serif; }
        .rtl { direction: rtl; unicode-bidi: embed; }
      </style>
      <rect width="${W}" height="${H}" fill="#f4f4f1" />
      ${panel({x: W - PANEL, image: imageA, person: text.topA, color: colorA, innerEdge: W - PANEL})}
      ${panel({x: 0, image: imageB, person: text.topB, color: colorB, innerEdge: PANEL - 10})}

      <text x="${cx}" y="112" text-anchor="middle" class="latin" font-size="20" letter-spacing="6" fill="#8a8379">PANTHEON</text>
      <text x="${cx}" y="160" text-anchor="middle" class="rtl" font-size="26" fill="#363636">${escapeXml(text.kicker)}</text>
      <rect x="${cx - 40}" y="188" width="80" height="2" fill="#cfc9bf" />
      <text x="${cx}" y="${255 + sizeA * 0.3}" text-anchor="middle" class="rtl" font-weight="700" font-size="${sizeA}" fill="${colorA}">${escapeXml(text.A)}</text>
      <circle cx="${cx}" cy="327" r="29" fill="none" stroke="#363636" stroke-width="2" />
      <text x="${cx}" y="336" text-anchor="middle" class="rtl" font-size="22" fill="#363636">${escapeXml(text.vs)}</text>
      <text x="${cx}" y="${400 + sizeB * 0.3}" text-anchor="middle" class="rtl" font-weight="700" font-size="${sizeB}" fill="${colorB}">${escapeXml(text.B)}</text>

      <g clip-path="url(#bar)">
        <rect x="${barX}" y="483" width="${barW}" height="12" fill="${colorA}" />
        <rect x="${barX}" y="483" width="${widthB}" height="12" fill="${colorB}" />
      </g>
      <text x="${barX + barW + 14}" y="499" class="latin" font-size="28" fill="${colorA}">${escapeXml(text.nA)}</text>
      <text x="${barX - 14}" y="499" text-anchor="end" class="latin" font-size="28" fill="${colorB}">${escapeXml(text.nB)}</text>
      <text x="${cx}" y="533" text-anchor="middle" class="rtl" font-size="18" fill="#8a8379">${escapeXml(text.countLabel)}</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
