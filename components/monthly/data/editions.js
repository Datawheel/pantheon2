import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const MONTHLY_DATA_DIR = path.join(process.cwd(), "public", "data", "monthly");
const MONTHLY_IMAGE_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "monthly",
);

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const EDITION_META = {
  "2026-03": {
    headline: "March's Attention Earthquake",
    subhead:
      "War in the Middle East, award season's close, and the long fade after February's olympics",
    editorial: {
      intro:
        'March 2026 was defined by sharp, event-driven spikes in attention rather than broad, sustained interest. The month\'s biggest risers clustered around Washington politics, Middle East conflict, and a few high-salience cultural moments, with names like <a href="/profile/person/Ali_Khamenei">Ali Khamenei</a>, <a href="/profile/person/Mojtaba_Khamenei">Mojtaba Khamenei</a>, <a href="/profile/person/Benjamin_Netanyahu">Benjamin Netanyahu</a>, <a href="/profile/person/Markwayne_Mullin">Markwayne Mullin</a>, <a href="/profile/person/Chuck_Norris">Chuck Norris</a>, and <a href="/profile/person/Michael_B._Jordan">Michael B. Jordan</a> drawing attention because they became tied to live, unfolding stories.',
      middle:
        'The strongest political surge came from the escalation around Iran and the wider regional conflict, which pushed <a href="/profile/person/Ali_Khamenei">Ali Khamenei</a>, <a href="/profile/person/Mojtaba_Khamenei">Mojtaba Khamenei</a>, <a href="/profile/person/Benjamin_Netanyahu">Benjamin Netanyahu</a>, <a href="/profile/person/Masoud_Pezeshkian">Masoud Pezeshkian</a>, and <a href="/profile/person/Ahmad_Vahidi">Ahmad Vahidi</a> into the center of public attention. In the U.S., <a href="/profile/person/Markwayne_Mullin">Markwayne Mullin</a>, <a href="/profile/person/Pete_Hegseth">Pete Hegseth</a>, <a href="/profile/person/Kristi_Noem">Kristi Noem</a>, <a href="/profile/person/Pam_Bondi">Pam Bondi</a>, and <a href="/profile/person/Robert_Mueller">Robert Mueller</a> also spiked as Washington politics kept generating fresh controversy and confirmation drama. On the cultural side, <a href="/profile/person/Chuck_Norris">Chuck Norris</a> and <a href="/profile/person/Michael_B._Jordan">Michael B. Jordan</a> gained sudden attention, showing how quickly celebrity interest can be pulled upward when names become attached to widely discussed events or appearances.',
      conclusion:
        'The decline side tells the other half of the month\'s story. Several of March\'s biggest fallers were names that had already spiked in February and then eased back, including <a href="/profile/person/Jeffrey_Epstein">Jeffrey Epstein</a>, <a href="/profile/person/Ghislaine_Maxwell">Ghislaine Maxwell</a>, <a href="/profile/person/Virginia_Giuffre">Virginia Giuffre</a>, <a href="/profile/person/Savannah_Guthrie">Savannah Guthrie</a>, <a href="/profile/person/Lindsey_Vonn">Lindsey Vonn</a>, and <a href="/profile/person/James_Van_Der_Beek">James Van Der Beek</a>. The list also shows a clear Winter Olympics-related cooldown, with names such as <a href="/profile/person/Alysa_Liu">Alysa Liu</a>, <a href="/profile/person/Ilia_Malinin">Ilia Malinin</a>, <a href="/profile/person/Eileen_Gu">Eileen Gu</a>, and other winter-sports and awards-cycle figures falling after their earlier February attention. That pattern suggests March was less about one continuous news narrative and more about a series of short, intense bursts followed by rapid normalization.',
    },
    moverSummaries: {
      "rising:Ali_Khamenei":
        "Ali Khamenei surged as the Iran succession crisis and regional escalation pushed him to the center of global attention.",
      "rising:Chuck_Norris":
        "Chuck Norris jumped on a burst of celebrity-driven curiosity, with his name getting pulled into a sharp March visibility spike.",
      "rising:Mojtaba_Khamenei":
        "Mojtaba Khamenei climbed because speculation around Iran's leadership transition made him a central figure in the succession story.",
      "falling:Jeffrey_Epstein":
        "Jeffrey Epstein dropped because February's renewed attention around the files and related scandal had already peaked, then cooled in March.",
      "falling:Alysa_Liu":
        "Alysa Liu fell after the Olympics and awards-cycle attention around figure skating faded, leaving her March visibility much lower.",
      "falling:Bad_Bunny":
        "Bad Bunny declined because his February Super Bowl spike had already passed, and March brought a sharp normalization in attention.",
    },
  },
};

const editionCache = new Map();
let editionKeysPromise;

export async function getEdition(year, month) {
  const monthNum = monthToNum(month);
  if (!monthNum) return null;

  const key = `${year}-${String(monthNum).padStart(2, "0")}`;
  if (!editionCache.has(key)) {
    editionCache.set(key, loadEdition(key));
  }

  return editionCache.get(key);
}

export async function getAllEditionKeys() {
  if (!editionKeysPromise) {
    editionKeysPromise = loadEditionKeys();
  }

  return editionKeysPromise;
}

async function loadEdition(key) {
  const csvPath = path.join(MONTHLY_DATA_DIR, `${key}.csv`);
  const [yearPart, monthPart] = key.split("-");
  const year = Number(yearPart);
  const monthNum = Number(monthPart);

  try {
    const [csvText, archive, heroImage] = await Promise.all([
      fs.readFile(csvPath, "utf8"),
      buildArchive(),
      resolveHeroImage(key),
    ]);

    const rows = parseMonthlyCsv(csvText);
    if (!rows.length) return null;

    const risers = rows
      .filter(row => row.diff > 0)
      .sort((a, b) => b.diff - a.diff || b.anomalyScore - a.anomalyScore);

    const fallers = rows
      .filter(row => row.diff < 0)
      .sort((a, b) => a.diff - b.diff || b.anomalyScore - a.anomalyScore);

    const meta = buildEditionMeta(key, year, monthNum);
    const topRiser = risers[0] || null;

    return {
      year,
      month: MONTH_NAMES[monthNum - 1],
      monthNum,
      headline: meta.headline,
      subhead: meta.subhead,
      heroImage,
      editorial: meta.editorial,
      stats: buildStats(topRiser),
      movers: [
        ...buildMovers(risers.slice(0, 3), "rising", monthNum, meta),
        ...buildMovers(fallers.slice(0, 3), "falling", monthNum, meta),
      ],
      trends: risers,
      fallers,
      deceasedSlugs: rows
        .filter(row => row.deathdate && row.deathdate.startsWith(key))
        .map(row => row.slug),
      archive,
    };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function loadEditionKeys() {
  try {
    const files = await fs.readdir(MONTHLY_DATA_DIR);
    return files
      .filter(file => /^\d{4}-\d{2}\.csv$/.test(file))
      .map(file => file.replace(/\.csv$/, ""))
      .sort();
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function buildArchive() {
  const keys = await getAllEditionKeys();

  return keys.map(key => {
    const [yearPart, monthPart] = key.split("-");
    const year = Number(yearPart);
    const monthNum = Number(monthPart);

    return {
      year,
      month: MONTH_NAMES[monthNum - 1],
      label: `${formatMonthName(year, monthNum, "short").toUpperCase()} ${year}`,
    };
  });
}

async function resolveHeroImage(key) {
  const filename = `${key}-hero.png`;
  const filepath = path.join(MONTHLY_IMAGE_DIR, filename);

  try {
    await fs.access(filepath);
    return `/images/monthly/${filename}`;
  } catch {
    return null;
  }
}

function buildEditionMeta(key, year, monthNum) {
  const monthLabel = formatMonthName(year, monthNum, "long");
  const defaultMeta = {
    headline: `${monthLabel}'s Biggest Attention Swings`,
    subhead: `The Pantheon monthly dataset for ${monthLabel} ${year}, ranked by who rose fastest and who cooled off most.`,
    editorial: {
      intro: `${monthLabel} ${year} captures the sharpest changes in attention across Pantheon's monthly anomaly dataset. The risers below highlight the people who gained the most views versus the prior month, while the fallers show which previously hot names returned toward baseline.`,
      middle:
        "Because the page is built directly from the monthly CSV, the rankings, movers, and death markers now come from the same source of truth instead of a hand-maintained JavaScript payload.",
      conclusion:
        "To publish a future edition, add the next CSV to public/data/monthly using the YYYY-MM.csv format. The page can reuse the same loader and derive the monthly tables automatically.",
    },
    moverSummaries: {},
  };

  return {
    ...defaultMeta,
    ...EDITION_META[key],
    editorial: {
      ...defaultMeta.editorial,
      ...(EDITION_META[key]?.editorial || {}),
    },
    moverSummaries: {
      ...defaultMeta.moverSummaries,
      ...(EDITION_META[key]?.moverSummaries || {}),
    },
  };
}

function buildStats(topRiser) {
  if (!topRiser) {
    return {
      anomalyScore: "0.00x",
      anomalyLabel: "Anomaly Score",
      globalVisibility: "0",
      globalVisibilityLabel: "Global Visibility",
    };
  }

  return {
    anomalyScore: `${topRiser.ratio.toFixed(2)}x`,
    anomalyLabel: "Anomaly Score",
    globalVisibility: formatCompactViews(topRiser.diff),
    globalVisibilityLabel: "Global Visibility",
  };
}

function buildMovers(rows, direction, monthNum, meta) {
  const monthLabel = formatMonthName(2000, monthNum, "long");

  return rows.map((row, index) => ({
    ...row,
    name: row.title,
    direction,
    diffLabel: formatDiffLabel(row.diff, direction),
    score: row.anomalyScore,
    rank: index + 1,
    summary:
      meta?.moverSummaries?.[`${direction}:${row.slug}`] ||
      buildMoverSummary(row, direction, monthLabel),
  }));
}

function buildMoverSummary(row, direction, monthLabel) {
  if (direction === "rising") {
    return `${row.title} climbed from ${formatCompactViews(row.prevViews)} to ${formatCompactViews(row.latestViews)} in ${monthLabel}, adding ${formatCompactViews(row.diff)} in monthly visibility.`;
  }

  return `${row.title} fell from ${formatCompactViews(row.prevViews)} to ${formatCompactViews(row.latestViews)} in ${monthLabel}, shedding ${formatCompactViews(Math.abs(row.diff))} after the prior month's spike.`;
}

function formatDiffLabel(diff, direction) {
  const value = formatCompactViews(Math.abs(diff));
  return direction === "rising" ? `${value} Diff` : `${value} Loss`;
}

function formatCompactViews(value) {
  const absValue = Math.abs(value);

  if (absValue >= 1e6) return `${(absValue / 1e6).toFixed(1)}M`;
  if (absValue >= 1e3) return `${(absValue / 1e3).toFixed(0)}K`;
  return String(absValue);
}

function formatMonthName(year, monthNum, format) {
  return new Intl.DateTimeFormat("en-US", {
    month: format,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNum - 1, 1)));
}

function monthToNum(month) {
  if (typeof month === "number") return month;
  if (/^\d+$/.test(String(month))) return Number(month);

  return MONTH_NAMES.indexOf(String(month).toLowerCase()) + 1;
}

function parseMonthlyCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = headers.reduce((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});

    return {
      wpId: toNumber(row.wp_id),
      slug: row.slug,
      title: row.title,
      deathdate: row.deathdate || null,
      description: row.description || "",
      prevViews: toNumber(row.prev_views),
      latestViews: toNumber(row.latest_views),
      diff: toNumber(row.diff),
      ratio: toNumber(row.ratio),
      pctChange: toNumber(row.pct_change),
      anomalyScore: toNumber(row.anomaly_score),
    };
  });
}

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default EDITION_META;
