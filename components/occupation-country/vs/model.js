// Everything a country-vs-country page renders, derived from the two
// loadOccupationCountry() results. Kept separate from the components so
// metadata, JSON-LD and the visible sections all read the same numbers.

import {DEFAULT_LOCALE} from "@/app/locales";
import {
  buildNames,
  formatDecimal,
  formatNumber,
  formatShare,
  formatYear,
  getOcStrings,
  occupationPluralFor,
} from "@/app/occupationCountryTranslations";
import {formatPair, getVsStrings} from "@/app/occupationCountryVsTranslations";
import {birthYearRange, isLiving} from "../data";
import {VS_MIN_PEOPLE, pickRivals, rowSlug, vsPath} from "../vs";

const MATCHUPS = 10;
const COMBINED = 20;
const RELATED_OCCUPATIONS = 12;
const RIVALS = 6;

const mean = values => (values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null);

// Side-by-side birth counts on one shared axis, oldest period first. Gaps
// inside the range are kept so the bars read as a timeline.
function buildEras(peopleA, peopleB) {
  const range = birthYearRange([...peopleA, ...peopleB]);
  if (!range) return {unit: "decade", rows: []};
  const unit = range.max - range.min > 250 ? "century" : "decade";
  const size = unit === "century" ? 100 : 10;
  const first = Math.floor(range.min / size) * size;
  const last = Math.floor(range.max / size) * size;

  const rows = new Map();
  for (let start = first; start <= last; start += size) {
    rows.set(start, {start, end: start + size - 1, a: [], b: []});
  }
  for (const [side, people] of [["a", peopleA], ["b", peopleB]]) {
    for (const person of people) {
      if (!Number.isFinite(person.birthyear)) continue;
      const row = rows.get(Math.floor(person.birthyear / size) * size);
      if (row) row[side].push(person);
    }
  }
  return {unit, rows: [...rows.values()]};
}

/**
 * @returns {object|null} null when either side is too small to compare.
 */
export function buildVsModel(dataA, dataB, lang = DEFAULT_LOCALE) {
  if (!dataA || !dataB) return null;
  if (dataA.stats.count < VS_MIN_PEOPLE || dataB.stats.count < VS_MIN_PEOPLE) return null;

  const {occupation, standings} = dataA;
  const s = getOcStrings(lang);
  const vs = getVsStrings(lang);
  const fmt = n => formatNumber(n, lang);
  const namesA = buildNames({occupation, country: dataA.country, lang, count: dataA.stats.count});
  const namesB = buildNames({occupation, country: dataB.country, lang, count: dataB.stats.count});
  const A = namesA.country;
  const B = namesB.country;
  const pair = formatPair(A, B, lang);
  const peopleA = dataA.people;
  const peopleB = dataB.people;
  const topA = peopleA[0];
  const topB = peopleB[0];

  // ---- Head-to-head: #1 vs #1, #2 vs #2 … ----
  const matchupCount = Math.min(MATCHUPS, Math.max(peopleA.length, peopleB.length));
  const matchups = Array.from({length: matchupCount}, (_, i) => {
    const a = peopleA[i] || null;
    const b = peopleB[i] || null;
    let winner = null;
    if (a && b && a.hpi !== b.hpi) winner = (a.hpi || 0) > (b.hpi || 0) ? "a" : "b";
    return {rank: i + 1, a, b, winner};
  });
  const wa = matchups.filter(m => m.winner === "a").length;
  const wb = matchups.filter(m => m.winner === "b").length;
  const contested = matchups.filter(m => m.a && m.b).length;

  // ---- Combined top 20 ----
  const k = Math.min(COMBINED, peopleA.length + peopleB.length);
  const combined = [
    ...peopleA.slice(0, k).map(p => ({person: p, side: "a"})),
    ...peopleB.slice(0, k).map(p => ({person: p, side: "b"})),
  ]
    .sort((x, y) => (y.person.hpi ?? -1) - (x.person.hpi ?? -1))
    .slice(0, k);
  const ka = combined.filter(row => row.side === "a").length;
  const kb = k - ka;

  // ---- By the numbers ----
  const avgTop = people => mean(people.slice(0, 10).map(p => p.hpi).filter(Number.isFinite));
  const women = people => people.filter(p => p.gender === "F").length;
  const living = people => people.filter(isLiving).length;
  const rcaText = v => (v != null ? `${new Intl.NumberFormat(lang, {maximumFractionDigits: 1}).format(v)}×` : "—");
  const withShare = (n, total) => (total ? `${fmt(n)} (${formatShare(n / total, lang)})` : fmt(n));
  const stat = (raw, text) => ({raw, text});

  const rows = [
    {key: "count", label: vs.rowCount, better: "high", bar: true,
      a: stat(dataA.stats.count, fmt(dataA.stats.count)),
      b: stat(dataB.stats.count, fmt(dataB.stats.count))},
    {key: "rank", label: vs.rowRank, better: "low",
      a: stat(dataA.stats.rank, dataA.stats.rank ? `#${fmt(dataA.stats.rank)}` : "—"),
      b: stat(dataB.stats.rank, dataB.stats.rank ? `#${fmt(dataB.stats.rank)}` : "—")},
    {key: "share", label: vs.rowShare, better: "high", bar: true,
      a: stat(dataA.stats.share, dataA.stats.share != null ? formatShare(dataA.stats.share, lang) : "—"),
      b: stat(dataB.stats.share, dataB.stats.share != null ? formatShare(dataB.stats.share, lang) : "—")},
    {key: "rca", label: vs.rowRca, better: "high", hint: s.statRcaHint,
      a: stat(dataA.stats.rca, rcaText(dataA.stats.rca)),
      b: stat(dataB.stats.rca, rcaText(dataB.stats.rca))},
    {key: "avg", label: vs.rowAvg, better: "high", bar: true,
      a: stat(avgTop(peopleA), formatDecimal(avgTop(peopleA), lang)),
      b: stat(avgTop(peopleB), formatDecimal(avgTop(peopleB), lang))},
    {key: "top", label: vs.rowTop, better: "high",
      a: {...stat(topA.hpi, formatDecimal(topA.hpi, lang)), person: topA},
      b: {...stat(topB.hpi, formatDecimal(topB.hpi, lang)), person: topB}},
    {key: "women", label: vs.rowWomen,
      a: stat(women(peopleA), withShare(women(peopleA), peopleA.length)),
      b: stat(women(peopleB), withShare(women(peopleB), peopleB.length))},
    {key: "living", label: vs.rowLiving,
      a: stat(living(peopleA), withShare(living(peopleA), peopleA.length)),
      b: stat(living(peopleB), withShare(living(peopleB), peopleB.length))},
    {key: "earliest", label: vs.rowEarliest,
      a: stat(dataA.stats.minYear, dataA.stats.minYear != null ? formatYear(dataA.stats.minYear, lang) : "—"),
      b: stat(dataB.stats.minYear, dataB.stats.minYear != null ? formatYear(dataB.stats.minYear, lang) : "—")},
  ].map(row => {
    let winner = null;
    if (row.better && Number.isFinite(row.a.raw) && Number.isFinite(row.b.raw) && row.a.raw !== row.b.raw) {
      const aWins = row.better === "high" ? row.a.raw > row.b.raw : row.a.raw < row.b.raw;
      winner = aWins ? "a" : "b";
    }
    const max = Math.max(row.a.raw || 0, row.b.raw || 0) || 1;
    return {
      ...row,
      winner,
      widthA: row.bar ? Math.max(2, ((row.a.raw || 0) / max) * 100) : null,
      widthB: row.bar ? Math.max(2, ((row.b.raw || 0) / max) * 100) : null,
    };
  });

  // ---- Copy params ----
  const aMore = dataA.stats.count >= dataB.stats.count;
  const hiIsA = (topA.hpi || 0) >= (topB.hpi || 0);
  const kWinnerIsA = ka >= kb;
  const matchWinnerIsA = wa >= wb;
  const v = {
    A, B, AThe: namesA.countryThe, BThe: namesB.countryThe, pair,
    occPlural: namesA.occPlural, occPluralTitle: namesA.occPluralTitle, occSingular: namesA.occSingular,
    groupA: namesA.group, groupB: namesB.group,
    nA: fmt(dataA.stats.count), nB: fmt(dataB.stats.count),
    rankA: fmt(dataA.stats.rank || 0), rankB: fmt(dataB.stats.rank || 0),
    totalCountries: fmt(dataA.stats.totalCountries),
    topA: topA.localizedName, topB: topB.localizedName,
    W: aMore ? A : B, L: aMore ? B : A,
    WThe: aMore ? namesA.countryThe : namesB.countryThe,
    LThe: aMore ? namesB.countryThe : namesA.countryThe,
    nW: fmt(aMore ? dataA.stats.count : dataB.stats.count),
    nL: fmt(aMore ? dataB.stats.count : dataA.stats.count),
    hiName: (hiIsA ? topA : topB).localizedName,
    hiHpi: formatDecimal((hiIsA ? topA : topB).hpi, lang),
    loName: (hiIsA ? topB : topA).localizedName,
    loHpi: formatDecimal((hiIsA ? topB : topA).hpi, lang),
    wa: fmt(wa), wb: fmt(wb), total: fmt(contested),
    wW: fmt(Math.max(wa, wb)),
    k: fmt(k), ka: fmt(ka), kb: fmt(kb),
    KW: kWinnerIsA ? A : B,
    KWThe: kWinnerIsA ? namesA.countryThe : namesB.countryThe,
    kW: fmt(Math.max(ka, kb)),
  };
  // matchupsTally reads W/WThe as the matchup winner, not the bigger country.
  const tallyParams = {
    ...v,
    W: matchWinnerIsA ? A : B,
    WThe: matchWinnerIsA ? namesA.countryThe : namesB.countryThe,
  };

  // ---- Links ----
  const occSlug = occupation.occupation_slug;
  const rowName = row => row.country_data?.[`${lang}_country`] || row.country_data?.country || row.country;
  const rivalLinks = (data, names, other) =>
    pickRivals(standings, data.country.id, {exclude: [other.country.id], max: RIVALS}).map(row => ({
      key: row.country,
      href: vsPath(occSlug, data.country.slug, rowSlug(row)),
      label: formatPair(names.country, rowName(row), lang),
    }));

  const occB = new Map(dataB.occupationsInCountry.map(row => [row.occupation, row]));
  const sameRivalry = dataA.occupationsInCountry
    .filter(row => row.num_people >= VS_MIN_PEOPLE && occB.get(row.occupation)?.num_people >= VS_MIN_PEOPLE)
    .map(row => {
      const od = row.occupation_data || {};
      const slug = od.occupation_slug || row.occupation_slug;
      return {
        key: row.occupation,
        href: vsPath(slug, dataA.country.slug, dataB.country.slug),
        label: occupationPluralFor(slug, od[`${lang}_occupation`] || od.occupation, lang),
        min: Math.min(row.num_people, occB.get(row.occupation).num_people),
      };
    })
    .sort((x, y) => y.min - x.min)
    .slice(0, RELATED_OCCUPATIONS);

  return {
    occupation,
    countryA: dataA.country,
    countryB: dataB.country,
    dataA,
    dataB,
    namesA,
    namesB,
    pair,
    v,
    tallyParams,
    rows,
    matchups,
    combined,
    eras: buildEras(peopleA, peopleB),
    rivalsA: rivalLinks(dataA, namesA, dataB),
    rivalsB: rivalLinks(dataB, namesB, dataA),
    sameRivalry,
  };
}

/** FAQ question/answer pairs, shared by the visible FAQ and FAQPage JSON-LD. */
export function buildVsFaq(model, lang, localePrefix) {
  const s = getOcStrings(lang);
  const vs = getVsStrings(lang);
  const {v, dataA, dataB} = model;
  const items = [
    {
      id: "more",
      question: vs.faqMoreQ(v),
      answer: dataA.stats.count === dataB.stats.count ? vs.faqMoreTieA(v) : vs.faqMoreA(v),
    },
    {id: "top", question: vs.faqTopQ(v), answer: vs.faqTopA(v)},
  ];
  if (model.combined.length >= 4) {
    items.push({id: "combined", question: vs.faqCombinedQ(v), answer: vs.faqCombinedA(v)});
  }
  items.push({
    id: "method",
    question: s.faqMethodQ,
    answer: s.faqMethodA,
    link: {href: `${localePrefix}/about/methods`, label: s.faqMethodLink},
  });
  return items;
}
