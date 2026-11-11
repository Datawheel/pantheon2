import {ImageResponse} from "next/og";
import {NextResponse} from "next/server";
import {OG_CACHE_CONTROL} from "../helpers/cache";
import {fetchPersonImageWithFallback} from "../helpers/personImage";
import {DEFAULT_LOCALE, getSupportedLocale, isArabicLocale} from "../helpers/locale";
import {createArabicVsCard} from "../helpers/arabicVsCard";
import {loadGoogleFontSubset, loadLocalizedGoogleFonts} from "../helpers/localizedFont";
import {cleanParam} from "../helpers/params";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {safeFetchArray, safeFetchFirst} from "@/app/utils/safeFetch";
import {buildNames, cleanPersonName, formatNumber} from "@/app/occupationCountryTranslations";
import {getVsStrings} from "@/app/occupationCountryVsTranslations";
import {COLORS_DOMAIN} from "@/components/utils/consts";
import {VS_MIN_PEOPLE, VS_SIDE_B_COLORS, vsSlugs} from "@/components/occupation-country/vs";

// Share card for /profile/occupation/[id]/country/[a]/vs/[b]: each
// country's #1 facing the other across the matchup title and counts.
//   /api/screenshot/occupation-country-vs?occupation=soccer-player&a=argentina&b=brazil&lang=es

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;
const PANEL = 330;
const PAPER = "#f4f4f1";
const INK = "#363636";
const MUTED = "#8a8379";
const SLUG = /^[a-z0-9-]+$/;
// Marcellus covers Latin through Latin Extended-B plus common punctuation;
// anything else (Vietnamese, Romanian ș/ț…) needs a fallback font.
const OUTSIDE_MARCELLUS = /[^\u0000-ɏ -⁯×]/u;

async function fetchPublicAsset(request, assetPath) {
  const response = await fetch(new URL(assetPath, request.url));
  if (!response.ok) throw new Error(`Failed to fetch asset ${assetPath}: ${response.status}`);
  return response.arrayBuffer();
}

// Shrink long country names so "Democratic Republic of the Congo" still fits.
function nameSize(name) {
  const length = Array.from(name).length;
  if (length <= 10) return 66;
  if (length <= 16) return 54;
  if (length <= 24) return 42;
  return 34;
}

// One country's #1, full height, with the name over a dark fade.
function Panel({image, person, color, align, textFont}) {
  return (
    <div style={{display: "flex", position: "relative", width: PANEL, height: HEIGHT, background: "#d9d6cf"}}>
      {image && (
        <img
          src={image}
          width={PANEL}
          height={HEIGHT}
          style={{width: PANEL, height: HEIGHT, objectFit: "cover", filter: "grayscale(15%)"}}
        />
      )}
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 300,
          background: "linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(20,20,20,0.82) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "left" ? "flex-start" : "flex-end",
          position: "absolute",
          left: 28,
          right: 28,
          bottom: 34,
          color: "#fff",
          textAlign: align === "left" ? "left" : "right",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "4px 12px",
            marginBottom: 12,
            background: color,
            borderRadius: 999,
            fontSize: 22,
            fontFamily: "Marcellus",
          }}
        >
          #1
        </div>
        <div style={{display: "flex", fontSize: 34, lineHeight: 1.15, fontFamily: textFont}}>{person}</div>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 10,
          background: color,
          ...(align === "left" ? {right: 0} : {left: 0}),
        }}
      />
    </div>
  );
}

function notFound() {
  return new NextResponse("Not Found", {status: 404});
}

async function loadSide(base, occupation, country) {
  const occ = encodePostgrestValue(occupation.id);
  const ctry = encodePostgrestValue(country.id);
  const [row, top] = await Promise.all([
    safeFetchFirst(`${base}/occupation_country?occupation=eq.${occ}&country=eq.${ctry}&select=num_people`, {}, {}),
    safeFetchFirst(
      `${base}/person_ranks?occupation=eq.${occ}&bplace_country=eq.${ctry}&order=hpi.desc.nullslast,id.asc&select=id,name,gender&limit=1`,
      {},
      null,
    ),
  ]);
  return {country, count: row?.num_people || 0, top};
}

export async function GET(request) {
  const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
  const {searchParams} = new URL(request.url);
  const occupationSlug = cleanParam(searchParams.get("occupation"));
  const slugA = cleanParam(searchParams.get("a"));
  const slugB = cleanParam(searchParams.get("b"));
  const lang = getSupportedLocale(searchParams.get("lang") || searchParams.get("locale") || DEFAULT_LOCALE);

  if (![occupationSlug, slugA, slugB].every(s => s && SLUG.test(s)) || slugA === slugB) {
    return notFound();
  }
  const [a, b] = vsSlugs(slugA, slugB);

  const [occupation, countries] = await Promise.all([
    safeFetchFirst(
      `${BASE_API}/occupation?occupation_slug=eq.${occupationSlug}&select=id,occupation,occupation_slug,domain_slug,translations`,
      {},
      {},
    ),
    safeFetchArray(`${BASE_API}/country?slug=in.(${a},${b})&select=id,slug,country,demonym,translations`),
  ]);
  const countryA = countries.find(c => c.slug === a);
  const countryB = countries.find(c => c.slug === b);
  if (!occupation?.id || !countryA?.id || !countryB?.id) return notFound();

  const [sideA, sideB] = await Promise.all([
    loadSide(BASE_API, occupation, countryA),
    loadSide(BASE_API, occupation, countryB),
  ]);
  // Same rule as the page: both lists need a few people to compare.
  if (sideA.count < VS_MIN_PEOPLE || sideB.count < VS_MIN_PEOPLE || !sideA.top || !sideB.top) {
    return notFound();
  }

  // Localized names for the two #1s.
  const tops = [sideA.top, sideB.top];
  const localized = lang === DEFAULT_LOCALE
    ? []
    : await safeFetchArray(
      `${BASE_API}/person?id=in.(${tops.map(p => p.id).join(",")})&select=id,localized:translations->>${lang}`,
    );
  const localizedById = new Map(localized.map(row => [row.id, cleanPersonName(row.localized, lang)]));

  const [imageA, imageB, MarcellusfontData] = await Promise.all([
    fetchPersonImageWithFallback(request.url, {...sideA.top, occupation_slug: occupation.occupation_slug}),
    fetchPersonImageWithFallback(request.url, {...sideB.top, occupation_slug: occupation.occupation_slug}),
    fetchPublicAsset(request, "/fonts/Marcellus-Regular.ttf"),
  ]);

  const colorA = COLORS_DOMAIN[occupation.domain_slug] || "#BB3B57";
  const colorB = VS_SIDE_B_COLORS[occupation.domain_slug] || "#2f6690";

  const buildText = renderLang => {
    const vs = getVsStrings(renderLang);
    const namesA = buildNames({occupation, country: countryA, lang: renderLang, count: sideA.count});
    const namesB = buildNames({occupation, country: countryB, lang: renderLang, count: sideB.count});
    const topName = person => (renderLang === lang && localizedById.get(person.id)) || person.name;
    return {
      vs: vs.vs,
      kicker: vs.kicker({occPlural: namesA.occPlural, occPluralTitle: namesA.occPluralTitle}),
      countLabel: vs.rowCount,
      A: namesA.country,
      B: namesB.country,
      nA: formatNumber(sideA.count, renderLang),
      nB: formatNumber(sideB.count, renderLang),
      topA: topName(sideA.top),
      topB: topName(sideB.top),
    };
  };

  const render = async renderLang => {
    const text = buildText(renderLang);
    const allText = Object.values(text).join(" ") + "#1PANTHEON";
    const localizedFonts = ["ja", "zh", "ru"].includes(renderLang)
      ? await loadLocalizedGoogleFonts(renderLang, allText, "VsText")
      : OUTSIDE_MARCELLUS.test(allText)
        ? await loadGoogleFontSubset("Noto Sans", allText, "VsText")
        : [];
    const textFont = localizedFonts.length ? "Marcellus, VsText" : "Marcellus";
    // Scripts Marcellus doesn't have read better entirely in the fallback.
    const headingFont = ["ja", "zh", "ru"].includes(renderLang) && localizedFonts.length
      ? "VsText"
      : textFont;
    const upper = renderLang === "ja" || renderLang === "zh" ? "none" : "uppercase";

    const share = Math.max(0.06, Math.min(0.94, sideA.count / (sideA.count + sideB.count)));
    const left = {image: imageA, person: text.topA, color: colorA};
    const right = {image: imageB, person: text.topB, color: colorB};

    const imageResponse = new ImageResponse(
      (
        <div style={{display: "flex", width: "100%", height: "100%", background: PAPER, fontFamily: textFont}}>
          <Panel {...left} align="left" textFont={textFont} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: WIDTH - PANEL * 2,
              height: HEIGHT,
              padding: "0 36px",
            }}
          >
            <div style={{display: "flex", fontSize: 20, letterSpacing: 6, color: MUTED, fontFamily: "Marcellus"}}>
              PANTHEON
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 18,
                fontSize: 22,
                letterSpacing: upper === "uppercase" ? 3 : 0,
                textTransform: upper,
                color: INK,
                textAlign: "center",
                fontFamily: headingFont,
              }}
            >
              {text.kicker}
            </div>
            <div style={{display: "flex", width: 80, height: 2, background: "#cfc9bf", margin: "26px 0 22px"}} />
            <div
              style={{
                display: "flex",
                fontSize: nameSize(text.A),
                lineHeight: 1.05,
                color: colorA,
                textTransform: upper,
                textAlign: "center",
                fontFamily: headingFont,
              }}
            >
              {text.A}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 58,
                height: 58,
                margin: "14px 0",
                borderRadius: 999,
                border: `2px solid ${INK}`,
                fontSize: 22,
                color: INK,
                fontFamily: headingFont,
              }}
            >
              {text.vs}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: nameSize(text.B),
                lineHeight: 1.05,
                color: colorB,
                textTransform: upper,
                textAlign: "center",
                fontFamily: headingFont,
              }}
            >
              {text.B}
            </div>
            {/* Count split: side A's share of the two lists combined */}
            <div style={{display: "flex", alignItems: "center", width: 440, marginTop: 34}}>
              <div style={{display: "flex", fontSize: 28, color: colorA, fontFamily: "Marcellus", marginRight: 14}}>
                {text.nA}
              </div>
              <div style={{display: "flex", flex: 1, height: 12, borderRadius: 6, overflow: "hidden"}}>
                <div style={{display: "flex", width: `${share * 100}%`, height: 12, background: colorA}} />
                <div style={{display: "flex", flex: 1, height: 12, background: colorB}} />
              </div>
              <div style={{display: "flex", fontSize: 28, color: colorB, fontFamily: "Marcellus", marginLeft: 14}}>
                {text.nB}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 16,
                letterSpacing: upper === "uppercase" ? 2 : 0,
                textTransform: upper,
                color: MUTED,
                fontFamily: headingFont,
              }}
            >
              {text.countLabel}
            </div>
          </div>
          <Panel {...right} align="right" textFont={textFont} />
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          {name: "Marcellus", data: MarcellusfontData, style: "normal"},
          ...localizedFonts,
        ],
      },
    );

    // Render eagerly: ImageResponse streams lazily, so Satori errors thrown
    // while piping would bypass the try/catch below.
    const png = await imageResponse.arrayBuffer();
    return new NextResponse(png, {
      status: 200,
      headers: {"content-type": "image/png", "cache-control": OG_CACHE_CONTROL},
    });
  };

  const png = buffer => new NextResponse(buffer, {
    status: 200,
    headers: {"content-type": "image/png", "cache-control": OG_CACHE_CONTROL},
  });

  try {
    if (isArabicLocale(lang)) {
      return png(await createArabicVsCard({
        text: buildText(lang),
        imageA,
        imageB,
        colorA,
        colorB,
        countA: sideA.count,
        countB: sideB.count,
        marcellusData: MarcellusfontData,
      }));
    }
    return await render(lang);
  } catch (error) {
    console.error("[screenshot-fail]", {route: "occupation-country-vs", stage: "primary-render", url: request.url, lang}, error);
    if (lang !== DEFAULT_LOCALE) {
      try {
        return await render(DEFAULT_LOCALE);
      } catch (fallbackError) {
        console.error("[screenshot-fail]", {route: "occupation-country-vs", stage: "fallback-english-render", url: request.url}, fallbackError);
      }
    }
    return new NextResponse("OG render failed", {status: 500});
  }
}
