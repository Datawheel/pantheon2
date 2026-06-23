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
  "2026-05": {
    headline: "The Month the World Said Goodbye",
    subhead:
      "A heavy run of farewells—Kyle Busch, Alex Zanardi, Ted Turner, and Brandon Clarke among them—topped May's chart, even as a Champions League climax lifted football's managers and the Michael Jackson revival rolled on",
    editorial: {
      intro:
        'May\'s rankings were shaped, more than anything, by loss. Four of the month\'s ten biggest risers were people the world was mourning &mdash; an unusually heavy concentration of obituary traffic at the very top of the chart. Motorsport lost two of its own within the same weeks: NASCAR champion <a href="/profile/person/Kyle_Busch">Kyle Busch</a> spiked more than a hundredfold after his death on May 21, while Italian racer-turned-Paralympian <a href="/profile/person/Alex_Zanardi">Alex Zanardi</a> surged on May 1. Basketball\'s <a href="/profile/person/Brandon_Clarke">Brandon Clarke</a> posted the single sharpest jump of the month &mdash; a 122x ratio &mdash; after his death on May 11, and media mogul <a href="/profile/person/Ted_Turner">Ted Turner</a>, the founder of CNN, climbed from near-zero to over two million views following his passing on May 6. The single largest mover, though, belonged to the living: Indian superstar <a href="/profile/person/Vijay_(actor)">Vijay</a> added more than four million views to top the month outright.',
      middle:
        'Live sport supplied May\'s other engine. A Champions League climax pulled Europe\'s touchline into the spotlight, lifting managers <a href="/profile/person/Luis_Enrique_(footballer)">Luis Enrique</a>, <a href="/profile/person/Mikel_Arteta">Mikel Arteta</a>, and <a href="/profile/person/Pep_Guardiola">Pep Guardiola</a> in lockstep. Across the Atlantic, an NBA Finals between the Knicks and the Spurs carried two of the league\'s brightest stars upward together &mdash; New York\'s <a href="/profile/person/Jalen_Brunson">Jalen Brunson</a> and San Antonio\'s <a href="/profile/person/Victor_Wembanyama">Victor Wembanyama</a>, the eighth-biggest mover of the month. Culture provided the rest. Pop star <a href="/profile/person/Olivia_Rodrigo">Olivia Rodrigo</a> surged on the release of a new album, while the <em>Michael</em> biopic wave that defined April rolled into May: <a href="/profile/person/Michael_Jackson">Michael Jackson</a> rose again as the third-biggest mover, with the King of Pop\'s former wife <a href="/profile/person/Debbie_Rowe">Debbie Rowe</a> rippling alongside him. British naturalist <a href="/profile/person/David_Attenborough">David Attenborough</a> surged in his ninety-ninth year, and a cluster of screen names &mdash; <a href="/profile/person/Spencer_Pratt">Spencer Pratt</a>, <a href="/profile/person/Sally_Field">Sally Field</a>, and <a href="/profile/person/Gina_Carano">Gina Carano</a> &mdash; rounded out the risers. Jazz lost a giant late in the month as <a href="/profile/person/Sonny_Rollins">Sonny Rollins</a> joined the long roll of May farewells.',
      conclusion:
        'The decline column is, almost line for line, April\'s front page in retreat. Hungary\'s election drama cooled fastest: <a href="/profile/person/Péter_Magyar">Péter Magyar</a>, April\'s giant-killer, was the single biggest faller of May, with the man he unseated, <a href="/profile/person/Viktor_Orbán">Viktor Orbán</a>, close behind. NASA\'s Artemis II crew came back down to earth in the data as well &mdash; <a href="/profile/person/Christina_Koch">Christina Koch</a>, <a href="/profile/person/Reid_Wiseman">Reid Wiseman</a>, and <a href="/profile/person/Jeremy_Hansen">Jeremy Hansen</a> all shed the bulk of their April homecoming traffic. Golf\'s <a href="/profile/person/Rory_McIlroy">Rory McIlroy</a> faded after his back-to-back Masters, and April\'s wave of obituaries &mdash; <a href="/profile/person/Asha_Bhosle">Asha Bhosle</a>, <a href="/profile/person/Nathalie_Baye">Nathalie Baye</a>, <a href="/profile/person/Nadia_Farès">Nadia Farès</a>, and <a href="/profile/person/Mircea_Lucescu">Mircea Lucescu</a> &mdash; eased back toward baseline as their moments passed. It is the monthly dataset\'s clearest signature: this month\'s headlines become next month\'s steepest falls.',
    },
    moverSummaries: {
      "rising:Vijay_(actor)":
        "Vijay was the single biggest mover of May, adding more than four million views as the Indian superstar dominated attention across the month.",
      "rising:Kyle_Busch":
        "Kyle Busch spiked more than a hundredfold following his death on May 21 — the most prominent of a striking cluster of motorsport and athletic losses this month.",
      "rising:Michael_Jackson":
        "Michael Jackson rose again as the Michael biopic wave carried over from April, pulling former wife Debbie Rowe and the wider Jackson story back into view.",
      "falling:Péter_Magyar":
        "Péter Magyar was May's steepest faller, cooling sharply after April's stunning Hungarian election victory moved off the front pages.",
      "falling:Christina_Koch":
        "Christina Koch dropped back toward baseline as the Artemis II crew's April lunar homecoming faded from the news cycle.",
      "falling:Viktor_Orbán":
        "Viktor Orbán fell alongside the broader Hungarian election story, shedding most of the attention his April defeat had generated.",
    },
  },
  "2026-04": {
    headline: "Michael, the Moon, and a Hungarian Upset",
    subhead:
      "A Jackson family revival, a stunning election in Budapest, and the Artemis II crew's return from the Moon defined April's biggest attention swings",
    editorial: {
      intro:
        'April\'s clearest story wasn\'t a single name &mdash; it was a family. The late-April release of <em>Michael</em>, the long-anticipated biopic starring <a href="/profile/person/Jaafar_Jackson">Jaafar Jackson</a> as his late uncle <a href="/profile/person/Michael_Jackson">Michael Jackson</a>, pulled the entire Jackson dynasty back into the spotlight. Attention rippled outward from the King of Pop to <a href="/profile/person/Janet_Jackson">Janet</a>, <a href="/profile/person/Jermaine_Jackson">Jermaine</a>, <a href="/profile/person/Katherine_Jackson">Katherine</a>, <a href="/profile/person/Paris_Jackson">Paris</a>, and <a href="/profile/person/Debbie_Rowe">Debbie Rowe</a> &mdash; a cultural reawakening that turned a single film premiere into a family-wide search wave.',
      middle:
        'The other story of the month came from Budapest. <a href="/profile/person/Péter_Magyar">Péter Magyar</a>\'s Tisza Party unseated <a href="/profile/person/Viktor_Orbán">Viktor Orbán</a>\'s long-ruling Fidesz government in the April 12 election, ending one of Europe\'s most entrenched political dynasties and turning challenger and incumbent alike into global search subjects. Above the planet, NASA\'s Artemis II crew made history of their own: <a href="/profile/person/Christina_Koch">Christina Koch</a>, <a href="/profile/person/Reid_Wiseman">Reid Wiseman</a>, <a href="/profile/person/Jeremy_Hansen">Jeremy Hansen</a>, and <a href="/profile/person/Victor_Glover">Victor Glover</a> all surged in lockstep after returning to Earth on April 10 from the first crewed lunar mission in over fifty years. Sport added its own headlines &mdash; <a href="/profile/person/Rory_McIlroy">Rory McIlroy</a> won back-to-back Masters titles to join a club of just four golfers ever to do so, while Kenyan marathoner <a href="/profile/person/Sabastian_Sawe">Sabastian Sawe</a> went from near-invisible to a household name overnight after running London in 1:59:30, the first sub-two-hour marathon under race conditions.',
      conclusion:
        'April was also a month of farewells. Bollywood great <a href="/profile/person/Asha_Bhosle">Asha Bhosle</a> died at 92, French actresses <a href="/profile/person/Nathalie_Baye">Nathalie Baye</a> and <a href="/profile/person/Nadia_Farès">Nadia Farès</a> passed within days of one another, <a href="/profile/person/Patrick_Muldoon">Patrick Muldoon</a> died unexpectedly, and Romanian football icon <a href="/profile/person/Mircea_Lucescu">Mircea Lucescu</a> was lost at 80 &mdash; each name spiking on Wikipedia as the obituaries hit. Smaller news-cycle bumps included <a href="/profile/person/John_Ternus">John Ternus</a>, named Apple\'s incoming CEO succeeding Tim Cook, and <a href="/profile/person/Meryl_Streep">Meryl Streep</a> amid the press cycle for <em>The Devil Wears Prada 2</em>. The fallers tell the other half of the same story. <a href="/profile/person/Ali_Khamenei">Ali Khamenei</a> dropped from 16.7M views to under a million as the Iran succession story moved off front pages, with <a href="/profile/person/Mojtaba_Khamenei">Mojtaba Khamenei</a> and <a href="/profile/person/Ruhollah_Khomeini">Ruhollah Khomeini</a> fading alongside him. <a href="/profile/person/Chuck_Norris">Chuck Norris</a>, whose attention had spiked after his March 19 death, returned toward baseline as the obituary moment ended.',
    },
    moverSummaries: {
      "rising:Michael_Jackson":
        "Michael Jackson surged after the late-April theatrical release of Michael, the biopic starring his nephew Jaafar — pulling the entire Jackson family back into the cultural conversation.",
      "rising:Péter_Magyar":
        "Péter Magyar climbed as his Tisza Party unseated Viktor Orbán's Fidesz government in Hungary's April 12 election, ending more than a decade of one-party rule.",
      "rising:Jaafar_Jackson":
        "Jaafar Jackson rose into global attention after starring as his uncle Michael in the biopic that premiered in late April.",
      "falling:Ali_Khamenei":
        "Ali Khamenei's March spike around the Iran succession crisis cooled sharply in April as the story moved off front pages.",
      "falling:Chuck_Norris":
        "Chuck Norris fell back toward baseline after his March 19 death drove a one-month obituary surge that didn't carry into April.",
      "falling:Mojtaba_Khamenei":
        "Mojtaba Khamenei dropped alongside his father as speculation around Iran's leadership transition faded from the news cycle.",
    },
  },
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
  const extensions = ["jpg", "jpeg", "png"];

  for (const ext of extensions) {
    const filename = `${key}-hero.${ext}`;
    const filepath = path.join(MONTHLY_IMAGE_DIR, filename);

    try {
      await fs.access(filepath);
      return `/images/monthly/${filename}`;
    } catch {
      // Try next extension
    }
  }

  return null;
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
