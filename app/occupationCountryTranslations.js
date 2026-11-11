// Copy and grammar helpers for /profile/occupation/[id]/country/[countryId].
//
// The country translations in the DB store demonyms for most languages as
// prepositional phrases ("aus Deutschland", "de los Estados Unidos"), and
// occupation translations only have the singular. So outside English every
// template uses "{occupation plural} {from country}", and templates for
// languages with grammatical case (ru, pl, ar, hu) keep the occupation in
// the nominative — colon/label constructions instead of inflected ones.

import {plural as pluralizeEn} from "pluralize";
import {DEFAULT_LOCALE} from "@/app/locales";
import {formatExploreYear} from "@/app/exploreTranslations";
import {
  OCCUPATION_PLURALS,
  ENGLISH_SINGULAR_OVERRIDES,
} from "@/app/occupationPlurals";

// English country names that take a definite article in running text.
// (The DB's en.from_country is "from United States".)
const ENGLISH_ARTICLE_COUNTRIES = new Set([
  "United States", "United Kingdom", "Netherlands", "Philippines", "Bahamas",
  "Gambia", "Maldives", "Comoros", "Seychelles", "Central African Republic",
  "Dominican Republic", "United Arab Emirates", "Cayman Islands",
  "Cook Islands", "Faroe Islands", "Falkland Islands", "Marshall Islands",
  "Solomon Islands", "Northern Mariana Islands", "British Virgin Islands",
  "U.S. Virgin Islands", "Palestinian Territories", "Åland Islands",
  "Pitcairn Islands", "U.S. Outlying Islands",
  "South Georgia & South Sandwich Islands",
]);

// Languages whose common nouns are lower-case mid-sentence.
const LOWERCASE_NOUN_LOCALES = new Set(["es", "fr", "it", "pt", "nl", "ru", "pl", "hu"]);

export const cap = s => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);

// "Futbolista" -> "futbolista", but leave "YouTuber"/"MrBeast" alone.
function lowerFirst(s) {
  if (!s || s.length < 2) return s;
  return /\p{Lu}/u.test(s[1]) ? s : s.charAt(0).toLocaleLowerCase() + s.slice(1);
}

// "Soccer Players" -> "soccer players"; keeps "YouTubers", "American".
function englishLower(s) {
  return s
    .split(" ")
    .map(w => (w === "American" || /\p{Lu}/u.test(w.slice(1)) ? w : w.toLowerCase()))
    .join(" ");
}

function englishTitle(s) {
  return s
    .split(" ")
    .map(w => (/\p{Lu}/u.test(w.slice(1)) ? w : cap(w.toLowerCase())))
    .join(" ");
}

// French "de" with elision: "d'acteurs", "de youtubeurs".
const deFr = s => (/^[aeiouyàâäéèêëîïôöûùüœh]/i.test(s) ? `d'${s}` : `de ${s}`);
const frOrd = n => (n === 1 ? "1er" : `${n}e`);

export function formatList(items, lang) {
  if (!items.length) return "";
  try {
    return new Intl.ListFormat(lang, {style: "long", type: "conjunction"}).format(items);
  } catch {
    return items.join(", ");
  }
}

export const formatNumber = (n, lang) => new Intl.NumberFormat(lang).format(n);

export const formatDecimal = (n, lang, digits = 1) =>
  new Intl.NumberFormat(lang, {minimumFractionDigits: digits, maximumFractionDigits: digits}).format(n || 0);

// person.translations->>{lang} holds the Wikipedia article title, which can
// carry a qualifier or even point at a disambiguation page ("Zico
// (desambiguación)", "Prince (musician)"). Drop a trailing parenthetical.
// Russian Wikipedia titles are "Surname, Given names" ("Марадона, Диего");
// flip them to reading order.
export function cleanPersonName(name, lang) {
  if (!name) return name;
  let cleaned = name.replace(/\s*[(（][^()（）]*[)）]\s*$/u, "").trim();
  if (lang === "ru") {
    const parts = cleaned.split(", ");
    if (parts.length === 2 && parts.every(part => part && !part.includes(","))) {
      cleaned = `${parts[1]} ${parts[0]}`;
    }
  }
  return cleaned || name;
}

export function formatShare(share, lang) {
  return new Intl.NumberFormat(lang, {
    style: "percent",
    maximumFractionDigits: share < 0.1 ? 1 : 0,
  }).format(share);
}

export const formatYear = (y, lang) => formatExploreYear(y, lang);

// "1950–2017", "b. 1998" (localized), or "" when unknown.
export function formatLifespan(person, lang) {
  const s = getOcStrings(lang);
  const {birthyear, deathyear} = person;
  if (!Number.isFinite(birthyear)) return "";
  const born = formatYear(birthyear, lang);
  if (Number.isFinite(deathyear)) return `${born}–${formatYear(deathyear, lang)}`;
  return s.born(born);
}

/**
 * Every name form the templates need for one occupation + country pair.
 * `occupation` and `country` are the raw DB rows (with `translations`).
 */
export function buildNames({occupation, country, lang, count}) {
  const s = getOcStrings(lang);
  const slug = occupation.occupation_slug;
  const occT = occupation.translations?.[lang] || {};
  const occEn = occupation.translations?.en?.occupation || occupation.occupation;
  const pluralRow = OCCUPATION_PLURALS[slug] || {};

  let occSingular;
  let occPlural;
  let occSingularTitle;
  let occPluralTitle;
  if (lang === "en") {
    occSingularTitle = ENGLISH_SINGULAR_OVERRIDES[slug] || englishTitle(occEn);
    occPluralTitle = pluralRow.en || englishTitle(pluralizeEn(occSingularTitle));
    occSingular = englishLower(occSingularTitle);
    occPlural = englishLower(occPluralTitle);
  } else {
    const rawSingular = occT.occupation || occEn;
    const rawPlural = pluralRow[lang] || rawSingular;
    occSingular = LOWERCASE_NOUN_LOCALES.has(lang) ? lowerFirst(rawSingular) : rawSingular;
    occPlural = LOWERCASE_NOUN_LOCALES.has(lang) ? lowerFirst(rawPlural) : rawPlural;
    occSingularTitle = occSingular;
    occPluralTitle = occPlural;
  }

  const ct = country.translations?.[lang] || {};
  const countryName = ct.country || country.country;
  let countryThe = countryName;
  let fromCountry = ct.from_country;
  let inCountry = ct.in_country;
  let adj = null;
  if (lang === "en") {
    countryThe = englishCountry(countryName);
    fromCountry = `from ${countryThe}`;
    inCountry = `in ${countryThe}`;
    adj = ct.nationality_adj_m || country.demonym || null;
    // A few rows carry the country name or a phrase instead of an adjective.
    if (adj && (adj === countryName || adj.includes(" from "))) adj = null;
  }
  fromCountry = fixFromCountry(fromCountry, lang) || `${s.from} ${countryName}`;
  inCountry = inCountry || countryName;

  const base = {
    lang, count, occSingular, occPlural, occSingularTitle, occPluralTitle,
    country: countryName, countryThe, fromCountry, inCountry, adj,
  };
  // Title-case variants exist only in English; other languages must not
  // inherit the English templates through the getOcStrings() merge.
  const own = STRINGS[lang] || {};
  return {
    ...base,
    group: s.group(base),
    groupTitle: (own.groupTitle || s.group)(base),
    groupSingular: s.groupSingular(base),
    groupSingularTitle: (own.groupSingularTitle || s.groupSingular)(base),
    heading: s.heading(base),
  };
}

// Repairs systematic errors in DB from_country phrases. Hungarian rows skip
// the vowel lengthening before -ból/-ből ("Brazíliaból" -> "Brazíliából").
export function fixFromCountry(phrase, lang) {
  if (!phrase) return phrase;
  if (lang === "hu") {
    return phrase.replace(/a(ból)$/u, "á$1").replace(/e(ből)$/u, "é$1");
  }
  return phrase;
}

export function englishCountry(name) {
  return ENGLISH_ARTICLE_COUNTRIES.has(name) ? `the ${name}` : name;
}

// Localized display name for a country row embedded from the API
// (fields: country, `${lang}_country`), with the English article.
export function localizedCountryName(row, lang) {
  const name = row?.[`${lang}_country`] || row?.country || "";
  return lang === "en" ? englishCountry(name) : name;
}

// Plural display name for an occupation row from `occupation_country`
// joined with `occupation_data` (or a bare occupation row).
export function occupationPluralFor(slug, fallbackSingular, lang) {
  const row = OCCUPATION_PLURALS[slug];
  if (lang === "en") {
    if (row?.en) return row.en;
    return englishTitle(pluralizeEn(fallbackSingular || slug));
  }
  const p = row?.[lang] || fallbackSingular || slug;
  return cap(p);
}

/* -------------------------------------------------------------------------- */
/* Strings                                                                    */
/* -------------------------------------------------------------------------- */

const shown = n => (n.count > 100 ? 100 : n.count);

const STRINGS = {
  en: {
    from: "from",
    group: n => (n.adj ? `${n.adj} ${n.occPlural}` : `${n.occPlural} ${n.fromCountry}`),
    groupTitle: n => (n.adj ? `${n.adj} ${n.occPluralTitle}` : `${n.occPluralTitle} ${n.fromCountry}`),
    groupSingular: n => (n.adj ? `${n.adj} ${n.occSingular}` : `${n.occSingular} ${n.fromCountry}`),
    groupSingularTitle: n => (n.adj ? `${n.adj} ${n.occSingularTitle}` : `${n.occSingularTitle} ${n.fromCountry}`),
    heading: n => `${n.count === 1 ? n.occSingularTitle : n.occPluralTitle} ${n.fromCountry}`,
    kicker: "The Most Famous",
    kickerSingle: "The Most Famous",
    metaTitle: n => (n.count === 1
      ? `Most Famous ${n.groupSingularTitle}: ${n.top}`
      : n.count > 100
        ? `Top 100 Most Famous ${n.groupTitle}`
        : `${n.count} Most Famous ${n.groupTitle}`),
    metaDescription: n => `${n.names} lead Pantheon's ranking of the ${n.countFormatted} most famous ${n.group}, ordered by Historical Popularity Index. See birth years, birthplaces, and how ${n.countryThe} compares worldwide.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) is the most famous ${n.groupSingular} in Pantheon's Historical Popularity Index. See how ${n.countryThe} compares with other countries.`,
    summarySingle: n => `${n.top} is the only ${n.groupSingular} in Pantheon's dataset.`,
    summary: n => {
      const who = n.count === 1 ? n.groupSingular : n.group;
      let text = `Pantheon ranks ${n.countFormatted} ${who} by Historical Popularity Index (HPI).`;
      if (n.rank === 1) text += ` ${cap(n.countryThe)} is the birthplace of more ${n.occPlural} than any other country: ${n.share} of the ${n.occTotal} in the dataset.`;
      else if (n.rank) text += ` ${cap(n.countryThe)} ranks #${n.rank} of ${n.totalCountries} countries by number of ${n.occPlural}, with ${n.share} of the ${n.occTotal} in the dataset.`;
      return text;
    },
    statCount: n => (n.count === 1 ? "person ranked" : "people ranked"),
    statShare: "of the global total",
    statRank: n => `of ${n.totalCountries} countries`,
    statWomen: "women",
    statLiving: "still living",
    statBorn: "birth years",
    statRca: "vs. world average",
    statRcaHint: "How over- or under-represented this occupation is here, relative to the country's overall share of Pantheon",
    allOccWorldwide: n => `All ${n.occPlural} worldwide`,
    topTitle: n => (n.count === 1 ? `The Most Famous ${n.groupSingularTitle}` : `Top ${n.topCount} ${n.groupTitle}`),
    topIntro: "Ranked by Pantheon's Historical Popularity Index (HPI), which combines how many Wikipedia language editions cover a person, how widely their articles are read, and how long ago they lived.",
    born: y => `b. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100 ${n.groupTitle}` : `All ${n.countFormatted} ${n.groupTitle}, Ranked`),
    rankingIntro: n => (n.count > 100
      ? `The 100 most famous of ${n.countFormatted}, by HPI. The rest are in the rankings explorer.`
      : "The complete list, continued from the top 10."),
    colRank: "#",
    colName: "Name",
    colYears: "Lifespan",
    colBirthplace: "Birthplace",
    colHpi: "HPI",
    seeFullRanking: "Explore the full ranking",
    womenTitle: n => `Most Famous Female ${n.groupTitle}`,
    livingTitle: n => `Most Famous Living ${n.groupTitle}`,
    countriesTitle: n => `Which Countries Have the Most Famous ${n.occPluralTitle}?`,
    countriesIntro: n => (n.rank === 1
      ? `${cap(n.countryThe)} leads the world with ${n.countFormatted} of ${n.occTotal} ${n.occPlural} (${n.share}).`
      : `${cap(n.countryThe)} ranks #${n.rank} of ${n.totalCountries} countries, with ${n.countFormatted} of ${n.occTotal} ${n.occPlural} (${n.share}).`),
    birthplacesTitle: n => `Where ${n.groupTitle} Were Born`,
    birthplacesIntro: n => `The cities and towns ${n.inCountry} that produced the most people on this list.`,
    decadesTitle: "People by Birth Decade",
    centuriesTitle: "People by Birth Century",
    erasIntro: "Grouped by when they were born, most famous first.",
    more: n => `+${n.count} more`,
    seeAll: "See all in rankings",
    lifespansTitle: "Overlapping Lives",
    lifespansIntro: n => `Which of them were alive at the same time? The lifespans of the ${n.lifeCount} most famous, born since 1700.`,
    lifespansChartTitle: n => `Lifespans of the top ${n.lifeCount}`,
    faqTitle: "Frequently Asked Questions",
    faqTopQ: n => `Who is the most famous ${n.groupSingular}?`,
    faqTopA: n => `${n.top} (${n.topYears}) is the most famous ${n.groupSingular} in Pantheon, with a Historical Popularity Index of ${n.topHpi} and Wikipedia biographies in ${n.topLangs} languages.${n.next ? ` Next on the list ${n.nextCount === 1 ? "is" : "are"} ${n.next}.` : ""}`,
    faqCountQ: n => `How many famous ${n.group} are there?`,
    faqCountA: n => `Pantheon includes ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group}, ${n.share} of the ${n.occTotal} ${n.occPlural} in its global dataset.${n.rank === 1 ? " That is more than any other country." : ` That places ${n.countryThe} #${n.rank} among ${n.totalCountries} countries.`}`,
    faqLeaderQ: n => `Which country has the most famous ${n.occPlural}?`,
    faqLeaderA: n => `${cap(n.leader)} leads with ${n.leaderCount} ${n.occPlural} (${n.leaderShare} of the global total)${n.followers ? `, followed by ${n.followers}` : ""}.`,
    faqWomanQ: n => `Who is the most famous female ${n.groupSingular}?`,
    faqWomanA: n => `${n.woman} (${n.womanYears}) is the highest-ranked woman on this list, at #${n.womanRank} overall.`,
    faqLivingQ: n => `Who is the most famous living ${n.groupSingular}?`,
    faqLivingA: n => `${n.living} (born ${n.livingBorn}) is the highest-ranked living person on this list, at #${n.livingRank} overall.`,
    faqMethodQ: "How is this ranking calculated?",
    faqMethodA: "Pantheon ranks people by the Historical Popularity Index (HPI), which combines how many Wikipedia language editions have an article about a person, how many views those articles get outside English Wikipedia, how stable that attention is over time, and how long ago the person lived.",
    faqMethodLink: "Read the methodology",
    relatedSameOcc: n => `${n.occPluralTitle} from Other Countries`,
    relatedSameCountry: n => `More Famous People ${n.fromCountry}`,
  },

  es: {
    from: "de",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "Los más famosos",
    kickerSingle: "El más famoso",
    metaTitle: n => (n.count === 1
      ? `${cap(n.groupSingular)} más famoso: ${n.top}`
      : `Los ${shown(n)} ${n.group} más famosos`),
    metaDescription: n => `${n.names} encabezan el ranking de Pantheon de los ${n.countFormatted} ${n.group} más famosos, ordenado por el Índice de Popularidad Histórica. Consulta años y lugares de nacimiento y cómo se compara ${n.country} con el resto del mundo.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) es el ${n.groupSingular} más famoso según el Índice de Popularidad Histórica de Pantheon. Descubre cómo se compara ${n.country} con otros países.`,
    summarySingle: n => `${n.top} es el único ${n.groupSingular} en la base de datos de Pantheon.`,
    summary: n => {
      let text = `Pantheon clasifica a ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group} según su Índice de Popularidad Histórica (HPI).`;
      if (n.rank === 1) text += ` Ningún otro país tiene más ${n.occPlural}: ${n.share} de los ${n.occTotal} del conjunto de datos.`;
      else if (n.rank) text += ` ${n.country} ocupa el puesto ${n.rank} de ${n.totalCountries} países por número de ${n.occPlural}, con el ${n.share} de los ${n.occTotal} del conjunto de datos.`;
      return text;
    },
    statCount: n => (n.count === 1 ? "persona en el ranking" : "personas en el ranking"),
    statShare: "del total mundial",
    statRank: n => `de ${n.totalCountries} países`,
    statWomen: "mujeres",
    statLiving: "siguen con vida",
    statBorn: "años de nacimiento",
    statRca: "frente a la media mundial",
    statRcaHint: "Cuánto más (o menos) frecuente es esta ocupación aquí en relación con el peso total del país en Pantheon",
    allOccWorldwide: n => `Todos los ${n.occPlural} del mundo`,
    topTitle: n => (n.count === 1 ? `El ${n.groupSingular} más famoso` : `Los ${n.topCount} ${n.group} más famosos`),
    topIntro: "Clasificados según el Índice de Popularidad Histórica (HPI) de Pantheon, que combina en cuántas ediciones de Wikipedia aparece una persona, cuánto se leen sus artículos y hace cuánto tiempo vivió.",
    born: y => `n. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Ranking completo: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `Los 100 más famosos de un total de ${n.countFormatted}, según el HPI. El resto está en el explorador de rankings.`
      : "La lista completa, a continuación del top 10."),
    colRank: "#",
    colName: "Nombre",
    colYears: "Vida",
    colBirthplace: "Lugar de nacimiento",
    colHpi: "HPI",
    seeFullRanking: "Ver el ranking completo",
    womenTitle: () => "Las mujeres más famosas",
    livingTitle: () => "Los más famosos que siguen con vida",
    countriesTitle: n => `¿Qué países tienen más ${n.occPlural} famosos?`,
    countriesIntro: n => (n.rank === 1
      ? `${n.country} lidera el mundo con ${n.countFormatted} de ${n.occTotal} ${n.occPlural} (${n.share}).`
      : `${n.country} ocupa el puesto ${n.rank} de ${n.totalCountries} países, con ${n.countFormatted} de ${n.occTotal} ${n.occPlural} (${n.share}).`),
    birthplacesTitle: () => "Lugares de nacimiento",
    birthplacesIntro: n => `Las ciudades ${n.inCountry} donde nacieron más personas de esta lista.`,
    decadesTitle: "Personas por década de nacimiento",
    centuriesTitle: "Personas por siglo de nacimiento",
    erasIntro: "Agrupados por fecha de nacimiento, de más a menos famosos.",
    more: n => `+${n.count} más`,
    seeAll: "Ver todos en el ranking",
    lifespansTitle: "Vidas superpuestas",
    lifespansIntro: n => `¿Quiénes vivieron al mismo tiempo? Las vidas de los ${n.lifeCount} más famosos nacidos desde 1700.`,
    lifespansChartTitle: n => `Vidas de los ${n.lifeCount} más famosos`,
    faqTitle: "Preguntas frecuentes",
    faqTopQ: n => `¿Quién es el ${n.groupSingular} más famoso?`,
    faqTopA: n => `${n.top} (${n.topYears}) es el ${n.groupSingular} más famoso en Pantheon, con un Índice de Popularidad Histórica de ${n.topHpi} y biografías en ${n.topLangs} idiomas de Wikipedia.${n.next ? ` Le ${n.nextCount === 1 ? "sigue" : "siguen"} ${n.next}.` : ""}`,
    faqCountQ: n => `¿Cuántos ${n.group} famosos hay?`,
    faqCountA: n => `Pantheon incluye ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group}, el ${n.share} de los ${n.occTotal} ${n.occPlural} de su base de datos mundial.${n.rank === 1 ? " Es más que cualquier otro país." : ` Eso sitúa a ${n.country} en el puesto ${n.rank} de ${n.totalCountries} países.`}`,
    faqLeaderQ: n => `¿Qué país tiene más ${n.occPlural} famosos?`,
    faqLeaderA: n => `${n.leader} encabeza la lista con ${n.leaderCount} ${n.occPlural} (${n.leaderShare} del total mundial)${n.followers ? `, seguido de ${n.followers}` : ""}.`,
    faqWomanQ: n => `¿Quién es la mujer más famosa entre los ${n.group}?`,
    faqWomanA: n => `${n.woman} (${n.womanYears}) es la mujer mejor clasificada de esta lista, en el puesto ${n.womanRank}.`,
    faqLivingQ: n => `¿Quién es el ${n.groupSingular} vivo más famoso?`,
    faqLivingA: n => `${n.living} (n. ${n.livingBorn}) es la persona viva mejor clasificada de esta lista, en el puesto ${n.livingRank}.`,
    faqMethodQ: "¿Cómo se calcula este ranking?",
    faqMethodA: "Pantheon clasifica a las personas con el Índice de Popularidad Histórica (HPI), que combina cuántas ediciones de Wikipedia tienen un artículo sobre la persona, cuántas visitas reciben esos artículos fuera de la Wikipedia en inglés, qué tan estable es esa atención con el tiempo y hace cuánto vivió la persona.",
    faqMethodLink: "Leer la metodología",
    relatedSameOcc: n => `${cap(n.occPlural)} de otros países`,
    relatedSameCountry: n => `Más personas famosas ${n.fromCountry}`,
  },

  fr: {
    from: "de",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "Les plus célèbres",
    kickerSingle: "Le plus célèbre",
    metaTitle: n => (n.count === 1
      ? `${cap(n.groupSingular)} le plus célèbre : ${n.top}`
      : `Les ${shown(n)} ${n.group} les plus célèbres`),
    metaDescription: n => `${n.names} dominent le classement Pantheon des ${n.countFormatted} ${n.group} les plus célèbres, établi selon l'indice de popularité historique. Années et lieux de naissance, et comparaison avec le reste du monde.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) arrive en tête des ${n.occPlural} ${n.fromCountry} selon l'indice de popularité historique de Pantheon. Comparez avec les autres pays.`,
    summarySingle: n => `${n.top} est le seul ${n.groupSingular} dans la base de données de Pantheon.`,
    summary: n => {
      let text = `Pantheon classe ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group} selon l'indice de popularité historique (HPI).`;
      if (n.rank === 1) text += ` Aucun autre pays n'en compte autant : ${n.share} des ${n.occTotal} ${n.occPlural} du jeu de données.`;
      else if (n.rank) text += ` Le pays se classe ${frOrd(n.rank)} sur ${n.totalCountries} pour le nombre ${deFr(n.occPlural)}, avec ${n.share} des ${n.occTotal} du jeu de données.`;
      return text;
    },
    statCount: n => (n.count === 1 ? "personne classée" : "personnes classées"),
    statShare: "du total mondial",
    statRank: n => `sur ${n.totalCountries} pays`,
    statWomen: "femmes",
    statLiving: "encore en vie",
    statBorn: "années de naissance",
    statRca: "vs moyenne mondiale",
    statRcaHint: "Sur- ou sous-représentation de cette profession ici, par rapport au poids global du pays dans Pantheon",
    allOccWorldwide: n => `${cap(n.occPlural)} du monde entier`,
    topTitle: n => (n.count === 1 ? `${cap(n.groupSingular)} le plus célèbre` : `Top ${n.topCount} des ${n.group}`),
    topIntro: "Classement établi selon l'indice de popularité historique (HPI) de Pantheon, qui combine le nombre d'éditions de Wikipédia consacrant un article à la personne, l'audience de ces articles et l'époque à laquelle elle a vécu.",
    born: y => `né(e) en ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100 des ${n.group}` : `Classement complet des ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `Les 100 plus célèbres sur ${n.countFormatted}, selon le HPI. Les autres figurent dans l'explorateur de classements.`
      : "La liste complète, à la suite du top 10."),
    colRank: "#",
    colName: "Nom",
    colYears: "Vie",
    colBirthplace: "Lieu de naissance",
    colHpi: "HPI",
    seeFullRanking: "Voir le classement complet",
    womenTitle: () => "Les femmes les plus célèbres",
    livingTitle: () => "Les plus célèbres encore en vie",
    countriesTitle: n => `Quels pays comptent le plus ${deFr(n.occPlural)} célèbres ?`,
    countriesIntro: n => (n.rank === 1
      ? `Premier pays au monde : ${n.countFormatted} des ${n.occTotal} ${n.occPlural} (${n.share}).`
      : `${frOrd(n.rank)} pays sur ${n.totalCountries} : ${n.countFormatted} des ${n.occTotal} ${n.occPlural} (${n.share}).`),
    birthplacesTitle: () => "Lieux de naissance",
    birthplacesIntro: () => "Les villes qui ont vu naître le plus de personnes de cette liste.",
    decadesTitle: "Personnes par décennie de naissance",
    centuriesTitle: "Personnes par siècle de naissance",
    erasIntro: "Regroupés par date de naissance, les plus célèbres en premier.",
    more: n => `+${n.count} de plus`,
    seeAll: "Tout voir dans le classement",
    lifespansTitle: "Vies entrecroisées",
    lifespansIntro: n => `Lesquels ont vécu à la même époque ? Les vies des ${n.lifeCount} plus célèbres, nés après 1700.`,
    lifespansChartTitle: n => `Vies des ${n.lifeCount} plus célèbres`,
    faqTitle: "Questions fréquentes",
    faqTopQ: n => `Qui est le plus célèbre des ${n.group} ?`,
    faqTopA: n => `${n.top} (${n.topYears}) arrive en tête des ${n.group} dans Pantheon, avec un indice de popularité historique de ${n.topHpi} et des biographies dans ${n.topLangs} langues sur Wikipédia.${n.next ? ` ${n.nextCount === 1 ? "Suit" : "Suivent"} ${n.next}.` : ""}`,
    faqCountQ: n => `Combien y a-t-il ${deFr(n.group)} célèbres ?`,
    faqCountA: n => `Pantheon recense ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group}, soit ${n.share} des ${n.occTotal} ${n.occPlural} de sa base mondiale.${n.rank === 1 ? " C'est plus que tout autre pays." : ` Le pays se classe ainsi ${frOrd(n.rank)} sur ${n.totalCountries}.`}`,
    faqLeaderQ: n => `Quel pays compte le plus ${deFr(n.occPlural)} célèbres ?`,
    faqLeaderA: n => `En tête : ${n.leader} (${n.leaderCount}, soit ${n.leaderShare} du total mondial).${n.followers ? ` Suivent : ${n.followers}.` : ""}`,
    faqWomanQ: () => "Qui est la femme la plus célèbre de cette liste ?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) est la femme la mieux classée de cette liste, au ${frOrd(n.womanRank)} rang du classement général.`,
    faqLivingQ: () => "Qui est la personne vivante la plus célèbre de cette liste ?",
    faqLivingA: n => `${n.living} (né(e) en ${n.livingBorn}) est la personne vivante la mieux classée de cette liste, au ${frOrd(n.livingRank)} rang du classement général.`,
    faqMethodQ: "Comment ce classement est-il établi ?",
    faqMethodA: "Pantheon classe les personnes selon l'indice de popularité historique (HPI), qui combine le nombre d'éditions de Wikipédia ayant un article sur la personne, le nombre de consultations de ces articles hors Wikipédia en anglais, la stabilité de cet intérêt dans le temps et l'ancienneté de la personne.",
    faqMethodLink: "Lire la méthodologie",
    relatedSameOcc: n => `${cap(n.occPlural)} d'autres pays`,
    relatedSameCountry: n => `Autres personnalités célèbres ${n.fromCountry}`,
  },

  de: {
    from: "aus",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "Die berühmtesten",
    kickerSingle: "Der berühmteste",
    metaTitle: n => (n.count === 1
      ? `Der berühmteste ${n.groupSingular}: ${n.top}`
      : `Die ${shown(n)} berühmtesten ${n.group}`),
    metaDescription: n => `${n.names} führen Pantheons Rangliste der ${n.countFormatted} berühmtesten ${n.group} an, sortiert nach dem Historical Popularity Index. Mit Geburtsjahren, Geburtsorten und internationalem Vergleich.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) ist laut Pantheons Historical Popularity Index der berühmteste ${n.groupSingular}. Mit Vergleich zu anderen Ländern.`,
    summarySingle: n => `${n.top} ist der einzige ${n.groupSingular} in Pantheons Datensatz.`,
    summary: n => {
      let text = `Pantheons Rangliste nach dem Historical Popularity Index (HPI) umfasst ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group}.`;
      if (n.rank === 1) text += ` Kein anderes Land stellt mehr – ${n.share} der weltweit ${n.occTotal}.`;
      else if (n.rank) text += ` Damit liegt das Land auf Platz ${n.rank} von ${n.totalCountries} – mit ${n.share} der weltweit ${n.occTotal}.`;
      return text;
    },
    statCount: () => "in der Rangliste",
    statShare: "des weltweiten Gesamts",
    statRank: n => `von ${n.totalCountries} Ländern`,
    statWomen: "Frauen",
    statLiving: "noch lebend",
    statBorn: "Geburtsjahre",
    statRca: "ggü. Weltdurchschnitt",
    statRcaHint: "Wie stark dieser Beruf hier über- oder unterrepräsentiert ist, gemessen am Gesamtanteil des Landes in Pantheon",
    allOccWorldwide: n => `Alle ${n.occPlural} weltweit`,
    topTitle: n => (n.count === 1 ? `Der berühmteste ${n.groupSingular}` : `Top ${n.topCount}: ${n.group}`),
    topIntro: "Sortiert nach Pantheons Historical Popularity Index (HPI), der kombiniert, in wie vielen Wikipedia-Sprachversionen eine Person einen Artikel hat, wie oft diese Artikel gelesen werden und wie lange die Person zurückliegt.",
    born: y => `geb. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Vollständige Rangliste: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `Die 100 berühmtesten von insgesamt ${n.countFormatted}, nach HPI. Alle weiteren im Ranglisten-Explorer.`
      : "Die vollständige Liste im Anschluss an die Top 10."),
    colRank: "#",
    colName: "Name",
    colYears: "Lebensdaten",
    colBirthplace: "Geburtsort",
    colHpi: "HPI",
    seeFullRanking: "Vollständige Rangliste ansehen",
    womenTitle: () => "Die berühmtesten Frauen",
    livingTitle: () => "Die berühmtesten Lebenden",
    countriesTitle: n => `Welche Länder haben die meisten berühmten ${n.occPlural}?`,
    countriesIntro: n => (n.rank === 1
      ? `Platz 1 weltweit: ${n.countFormatted} von ${n.occTotal} (${n.share}).`
      : `Platz ${n.rank} von ${n.totalCountries} Ländern: ${n.countFormatted} von ${n.occTotal} (${n.share}).`),
    birthplacesTitle: () => "Geburtsorte",
    birthplacesIntro: () => "Die Städte, aus denen die meisten Personen dieser Liste stammen.",
    decadesTitle: "Personen nach Geburtsjahrzehnt",
    centuriesTitle: "Personen nach Geburtsjahrhundert",
    erasIntro: "Nach Geburtszeit gruppiert, die Berühmtesten zuerst.",
    more: n => `+${n.count} weitere`,
    seeAll: "Alle in der Rangliste ansehen",
    lifespansTitle: "Überlappende Leben",
    lifespansIntro: n => `Wer lebte zur selben Zeit? Die Lebensspannen der ${n.lifeCount} Berühmtesten, geboren nach 1700.`,
    lifespansChartTitle: n => `Lebensspannen der Top ${n.lifeCount}`,
    faqTitle: "Häufig gestellte Fragen",
    faqTopQ: n => `Wer ist der berühmteste ${n.groupSingular}?`,
    faqTopA: n => `${n.top} (${n.topYears}) ist der berühmteste ${n.groupSingular} in Pantheon – mit einem Historical Popularity Index von ${n.topHpi} und Wikipedia-Artikeln in ${n.topLangs} Sprachen.${n.next ? ` Es ${n.nextCount === 1 ? "folgt" : "folgen"} ${n.next}.` : ""}`,
    faqCountQ: n => `Wie viele berühmte ${n.group} gibt es?`,
    faqCountA: n => `Pantheon verzeichnet ${n.countFormatted} – das sind ${n.share} der weltweit ${n.occTotal}.${n.rank === 1 ? " Das ist mehr als in jedem anderen Land." : ` Damit liegt das Land auf Platz ${n.rank} von ${n.totalCountries}.`}`,
    faqLeaderQ: n => `Welches Land hat die meisten berühmten ${n.occPlural}?`,
    faqLeaderA: n => `An der Spitze: ${n.leader} (${n.leaderCount}, ${n.leaderShare} des weltweiten Gesamts).${n.followers ? ` Es folgen ${n.followers}.` : ""}`,
    faqWomanQ: () => "Wer ist die berühmteste Frau auf dieser Liste?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) ist die bestplatzierte Frau auf dieser Liste – Platz ${n.womanRank} insgesamt.`,
    faqLivingQ: () => "Wer ist die berühmteste noch lebende Person auf dieser Liste?",
    faqLivingA: n => `${n.living} (geb. ${n.livingBorn}) ist die bestplatzierte noch lebende Person auf dieser Liste – Platz ${n.livingRank} insgesamt.`,
    faqMethodQ: "Wie wird diese Rangliste berechnet?",
    faqMethodA: "Pantheon ordnet Personen nach dem Historical Popularity Index (HPI). Er kombiniert, in wie vielen Wikipedia-Sprachversionen es einen Artikel über die Person gibt, wie oft diese Artikel außerhalb der englischen Wikipedia aufgerufen werden, wie beständig das Interesse über die Zeit ist und wie lange die Person zurückliegt.",
    faqMethodLink: "Zur Methodik",
    relatedSameOcc: n => `${n.occPlural} aus anderen Ländern`,
    relatedSameCountry: n => `Weitere berühmte Personen ${n.fromCountry}`,
  },

  it: {
    from: "da",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "I più famosi",
    kickerSingle: "Il più famoso",
    metaTitle: n => (n.count === 1
      ? `${cap(n.groupSingular)}: il più famoso è ${n.top}`
      : `${cap(n.group)}: i ${shown(n)} più famosi`),
    metaDescription: n => `${n.names} guidano la classifica Pantheon: ${n.group}, ${n.countFormatted} in tutto, ordinati per indice di popolarità storica. Anni e luoghi di nascita e confronto con il resto del mondo.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) è al primo posto nella classifica Pantheon: ${n.groupSingular}, secondo l'indice di popolarità storica. Confronto con gli altri paesi.`,
    summarySingle: n => `${n.top} è l'unico ${n.groupSingular} nel database di Pantheon.`,
    summary: n => {
      let text = `Pantheon classifica ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group} in base all'indice di popolarità storica (HPI).`;
      if (n.rank === 1) text += ` Nessun altro paese ne conta di più: ${n.share} su un totale di ${n.occTotal}.`;
      else if (n.rank) text += ` Il paese è ${n.rank}° su ${n.totalCountries} per numero di ${n.occPlural}: ${n.share} su un totale di ${n.occTotal}.`;
      return text;
    },
    statCount: n => (n.count === 1 ? "persona in classifica" : "persone in classifica"),
    statShare: "del totale mondiale",
    statRank: n => `su ${n.totalCountries} paesi`,
    statWomen: "donne",
    statLiving: "ancora in vita",
    statBorn: "anni di nascita",
    statRca: "rispetto alla media mondiale",
    statRcaHint: "Quanto questa professione è sovra- o sottorappresentata qui, rispetto al peso complessivo del paese in Pantheon",
    allOccWorldwide: n => `${cap(n.occPlural)} di tutto il mondo`,
    topTitle: n => (n.count === 1 ? `${cap(n.groupSingular)} più famoso` : `Top ${n.topCount}: ${n.group}`),
    topIntro: "Classifica basata sull'indice di popolarità storica (HPI) di Pantheon, che combina il numero di edizioni di Wikipedia con una voce sulla persona, le visualizzazioni di queste voci e l'epoca in cui è vissuta.",
    born: y => `n. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Classifica completa: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `I 100 più famosi su ${n.countFormatted}, secondo l'HPI. Gli altri sono nell'esploratore delle classifiche.`
      : "L'elenco completo, dopo la top 10."),
    colRank: "#",
    colName: "Nome",
    colYears: "Vita",
    colBirthplace: "Luogo di nascita",
    colHpi: "HPI",
    seeFullRanking: "Vedi la classifica completa",
    womenTitle: () => "Le donne più famose",
    livingTitle: () => "I più famosi ancora in vita",
    countriesTitle: n => `Quali paesi hanno più ${n.occPlural} famosi?`,
    countriesIntro: n => (n.rank === 1
      ? `Primo paese al mondo: ${n.countFormatted} su ${n.occTotal} (${n.share}).`
      : `${n.rank}° paese su ${n.totalCountries}: ${n.countFormatted} su ${n.occTotal} (${n.share}).`),
    birthplacesTitle: () => "Luoghi di nascita",
    birthplacesIntro: () => "Le città che hanno dato i natali al maggior numero di persone di questa lista.",
    decadesTitle: "Persone per decennio di nascita",
    centuriesTitle: "Persone per secolo di nascita",
    erasIntro: "Raggruppati per data di nascita, a partire dai più famosi.",
    more: n => `+${n.count} altri`,
    seeAll: "Vedi tutti nella classifica",
    lifespansTitle: "Vite parallele",
    lifespansIntro: n => `Chi è vissuto nello stesso periodo? Le vite dei più famosi (${n.lifeCount}) nati dopo il 1700.`,
    lifespansChartTitle: n => `Vite dei più famosi (${n.lifeCount})`,
    faqTitle: "Domande frequenti",
    faqTopQ: n => `${cap(n.group)}: chi è il più famoso?`,
    faqTopA: n => `${n.top} (${n.topYears}) è al primo posto in Pantheon, con un indice di popolarità storica di ${n.topHpi} e voci su Wikipedia in ${n.topLangs} lingue.${n.next ? ` ${n.nextCount === 1 ? "Segue" : "Seguono"} ${n.next}.` : ""}`,
    faqCountQ: n => `${cap(n.group)}: quanti sono?`,
    faqCountA: n => `Pantheon ne conta ${n.countFormatted}: ${n.share} su un totale mondiale di ${n.occTotal}.${n.rank === 1 ? " Più di qualsiasi altro paese." : ` Il paese è quindi ${n.rank}° su ${n.totalCountries}.`}`,
    faqLeaderQ: n => `Quale paese ha più ${n.occPlural} famosi?`,
    faqLeaderA: n => `In testa: ${n.leader} (${n.leaderCount}, ${n.leaderShare} del totale mondiale).${n.followers ? ` Seguono: ${n.followers}.` : ""}`,
    faqWomanQ: () => "Chi è la donna più famosa di questa lista?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) è la donna più in alto in classifica, al ${n.womanRank}° posto assoluto.`,
    faqLivingQ: () => "Chi è la persona vivente più famosa di questa lista?",
    faqLivingA: n => `${n.living} (n. ${n.livingBorn}) è la persona vivente più in alto in classifica, al ${n.livingRank}° posto assoluto.`,
    faqMethodQ: "Come viene calcolata questa classifica?",
    faqMethodA: "Pantheon classifica le persone con l'indice di popolarità storica (HPI), che combina il numero di edizioni di Wikipedia con una voce sulla persona, le visualizzazioni di queste voci al di fuori di Wikipedia in inglese, la stabilità dell'interesse nel tempo e quanto tempo fa è vissuta la persona.",
    faqMethodLink: "Leggi la metodologia",
    relatedSameOcc: n => `${cap(n.occPlural)} di altri paesi`,
    relatedSameCountry: n => `Altre persone famose ${n.fromCountry}`,
  },

  pt: {
    from: "de",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "Os mais famosos",
    kickerSingle: "O mais famoso",
    metaTitle: n => (n.count === 1
      ? `${cap(n.groupSingular)} mais famoso: ${n.top}`
      : `Os ${shown(n)} ${n.group} mais famosos`),
    metaDescription: n => `${n.names} lideram o ranking do Pantheon dos ${n.countFormatted} ${n.group} mais famosos, ordenado pelo Índice de Popularidade Histórica. Veja anos e locais de nascimento e a comparação com o resto do mundo.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) é o ${n.groupSingular} mais famoso segundo o Índice de Popularidade Histórica do Pantheon. Compare com outros países.`,
    summarySingle: n => `${n.top} é o único ${n.groupSingular} na base de dados do Pantheon.`,
    summary: n => {
      let text = `O Pantheon classifica ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group} pelo Índice de Popularidade Histórica (HPI).`;
      if (n.rank === 1) text += ` Nenhum outro país tem tantos: ${n.share} dos ${n.occTotal} ${n.occPlural} do conjunto de dados.`;
      else if (n.rank) text += ` O país ocupa a ${n.rank}ª posição entre ${n.totalCountries} países em número de ${n.occPlural}, com ${n.share} dos ${n.occTotal} do conjunto de dados.`;
      return text;
    },
    statCount: n => (n.count === 1 ? "pessoa no ranking" : "pessoas no ranking"),
    statShare: "do total mundial",
    statRank: n => `de ${n.totalCountries} países`,
    statWomen: "mulheres",
    statLiving: "ainda vivos",
    statBorn: "anos de nascimento",
    statRca: "vs. média mundial",
    statRcaHint: "Quanto esta profissão está sobre- ou sub-representada aqui, em relação ao peso total do país no Pantheon",
    allOccWorldwide: n => `${cap(n.occPlural)} do mundo todo`,
    topTitle: n => (n.count === 1 ? `O ${n.groupSingular} mais famoso` : `Os ${n.topCount} ${n.group} mais famosos`),
    topIntro: "Classificados pelo Índice de Popularidade Histórica (HPI) do Pantheon, que combina em quantas edições da Wikipédia a pessoa tem artigo, quanto esses artigos são lidos e há quanto tempo ela viveu.",
    born: y => `n. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Ranking completo: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `Os 100 mais famosos de ${n.countFormatted}, segundo o HPI. Os demais estão no explorador de rankings.`
      : "A lista completa, depois do top 10."),
    colRank: "#",
    colName: "Nome",
    colYears: "Vida",
    colBirthplace: "Local de nascimento",
    colHpi: "HPI",
    seeFullRanking: "Ver o ranking completo",
    womenTitle: () => "As mulheres mais famosas",
    livingTitle: () => "Os mais famosos ainda vivos",
    countriesTitle: n => `Quais países têm mais ${n.occPlural} famosos?`,
    countriesIntro: n => (n.rank === 1
      ? `Primeiro país do mundo: ${n.countFormatted} de ${n.occTotal} (${n.share}).`
      : `${n.rank}º país entre ${n.totalCountries}: ${n.countFormatted} de ${n.occTotal} (${n.share}).`),
    birthplacesTitle: () => "Locais de nascimento",
    birthplacesIntro: () => "As cidades onde nasceram mais pessoas desta lista.",
    decadesTitle: "Pessoas por década de nascimento",
    centuriesTitle: "Pessoas por século de nascimento",
    erasIntro: "Agrupados pela data de nascimento, dos mais aos menos famosos.",
    more: n => `+${n.count} mais`,
    seeAll: "Ver todos no ranking",
    lifespansTitle: "Vidas sobrepostas",
    lifespansIntro: n => `Quem viveu na mesma época? A vida dos ${n.lifeCount} mais famosos nascidos depois de 1700.`,
    lifespansChartTitle: n => `Vida dos ${n.lifeCount} mais famosos`,
    faqTitle: "Perguntas frequentes",
    faqTopQ: n => `Quem é o ${n.groupSingular} mais famoso?`,
    faqTopA: n => `${n.top} (${n.topYears}) é o ${n.groupSingular} mais famoso no Pantheon, com Índice de Popularidade Histórica de ${n.topHpi} e biografias em ${n.topLangs} idiomas da Wikipédia.${n.next ? ` Em seguida ${n.nextCount === 1 ? "vem" : "vêm"} ${n.next}.` : ""}`,
    faqCountQ: n => `Quantos ${n.group} famosos existem?`,
    faqCountA: n => `O Pantheon inclui ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group}, ${n.share} dos ${n.occTotal} ${n.occPlural} da sua base mundial.${n.rank === 1 ? " É mais do que qualquer outro país." : ` Isso coloca o país na ${n.rank}ª posição entre ${n.totalCountries}.`}`,
    faqLeaderQ: n => `Qual país tem mais ${n.occPlural} famosos?`,
    faqLeaderA: n => `Na liderança: ${n.leader}, com ${n.leaderCount} (${n.leaderShare} do total mundial).${n.followers ? ` Em seguida: ${n.followers}.` : ""}`,
    faqWomanQ: () => "Quem é a mulher mais famosa desta lista?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) é a mulher mais bem colocada desta lista, na ${n.womanRank}ª posição geral.`,
    faqLivingQ: () => "Quem é a pessoa viva mais famosa desta lista?",
    faqLivingA: n => `${n.living} (n. ${n.livingBorn}) é a pessoa viva mais bem colocada desta lista, na ${n.livingRank}ª posição geral.`,
    faqMethodQ: "Como este ranking é calculado?",
    faqMethodA: "O Pantheon classifica as pessoas pelo Índice de Popularidade Histórica (HPI), que combina o número de edições da Wikipédia com um artigo sobre a pessoa, as visualizações desses artigos fora da Wikipédia em inglês, a estabilidade desse interesse ao longo do tempo e há quanto tempo a pessoa viveu.",
    faqMethodLink: "Leia a metodologia",
    relatedSameOcc: n => `${cap(n.occPlural)} de outros países`,
    relatedSameCountry: n => `Mais pessoas famosas ${n.fromCountry}`,
  },

  nl: {
    from: "uit",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "De beroemdste",
    kickerSingle: "De beroemdste",
    metaTitle: n => (n.count === 1
      ? `De beroemdste ${n.groupSingular}: ${n.top}`
      : `De ${shown(n)} beroemdste ${n.group}`),
    metaDescription: n => `${n.names} voeren Pantheons ranglijst aan van de ${n.countFormatted} beroemdste ${n.group}, gerangschikt op de Historical Popularity Index. Met geboortejaren, geboorteplaatsen en een vergelijking met de rest van de wereld.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) is volgens Pantheons Historical Popularity Index de beroemdste ${n.groupSingular}. Vergelijk met andere landen.`,
    summarySingle: n => `${n.top} is de enige ${n.groupSingular} in de dataset van Pantheon.`,
    summary: n => {
      let text = `Pantheon rangschikt ${n.countFormatted} ${n.count === 1 ? n.groupSingular : n.group} op basis van de Historical Popularity Index (HPI).`;
      if (n.rank === 1) text += ` Geen ander land telt er meer: ${n.share} van de ${n.occTotal} wereldwijd.`;
      else if (n.rank) text += ` Daarmee staat het land op plaats ${n.rank} van ${n.totalCountries}, met ${n.share} van de ${n.occTotal} wereldwijd.`;
      return text;
    },
    statCount: () => "in de ranglijst",
    statShare: "van het wereldtotaal",
    statRank: n => `van ${n.totalCountries} landen`,
    statWomen: "vrouwen",
    statLiving: "nog in leven",
    statBorn: "geboortejaren",
    statRca: "t.o.v. wereldgemiddelde",
    statRcaHint: "Hoe sterk dit beroep hier over- of ondervertegenwoordigd is, gemeten aan het totale aandeel van het land in Pantheon",
    allOccWorldwide: n => `Alle ${n.occPlural} wereldwijd`,
    topTitle: n => (n.count === 1 ? `De beroemdste ${n.groupSingular}` : `Top ${n.topCount}: ${n.group}`),
    topIntro: "Gerangschikt op Pantheons Historical Popularity Index (HPI), die combineert in hoeveel Wikipedia-taalversies iemand een artikel heeft, hoe vaak die artikelen gelezen worden en hoe lang geleden de persoon leefde.",
    born: y => `geb. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Volledige ranglijst: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `De 100 beroemdste van ${n.countFormatted}, op basis van HPI. De rest staat in de rankingverkenner.`
      : "De volledige lijst, na de top 10."),
    colRank: "#",
    colName: "Naam",
    colYears: "Leven",
    colBirthplace: "Geboorteplaats",
    colHpi: "HPI",
    seeFullRanking: "Bekijk de volledige ranglijst",
    womenTitle: () => "De beroemdste vrouwen",
    livingTitle: () => "De beroemdste nog levende personen",
    countriesTitle: n => `Welke landen hebben de meeste beroemde ${n.occPlural}?`,
    countriesIntro: n => (n.rank === 1
      ? `Nummer 1 ter wereld: ${n.countFormatted} van de ${n.occTotal} (${n.share}).`
      : `Plaats ${n.rank} van ${n.totalCountries} landen: ${n.countFormatted} van de ${n.occTotal} (${n.share}).`),
    birthplacesTitle: () => "Geboorteplaatsen",
    birthplacesIntro: () => "De steden waar de meeste mensen van deze lijst geboren zijn.",
    decadesTitle: "Personen per geboortedecennium",
    centuriesTitle: "Personen per geboorte-eeuw",
    erasIntro: "Gegroepeerd naar geboortetijd, de beroemdsten eerst.",
    more: n => `+${n.count} meer`,
    seeAll: "Bekijk alles in de ranglijst",
    lifespansTitle: "Overlappende levens",
    lifespansIntro: n => `Wie leefden er tegelijk? De levens van de ${n.lifeCount} beroemdsten, geboren na 1700.`,
    lifespansChartTitle: n => `Levens van de top ${n.lifeCount}`,
    faqTitle: "Veelgestelde vragen",
    faqTopQ: n => `Wie is de beroemdste ${n.groupSingular}?`,
    faqTopA: n => `${n.top} (${n.topYears}) is de beroemdste ${n.groupSingular} in Pantheon, met een Historical Popularity Index van ${n.topHpi} en Wikipedia-artikelen in ${n.topLangs} talen.${n.next ? ` Daarna ${n.nextCount === 1 ? "volgt" : "volgen"} ${n.next}.` : ""}`,
    faqCountQ: n => `Hoeveel beroemde ${n.group} zijn er?`,
    faqCountA: n => `Pantheon telt er ${n.countFormatted}: ${n.share} van de ${n.occTotal} wereldwijd.${n.rank === 1 ? " Dat is meer dan in elk ander land." : ` Daarmee staat het land op plaats ${n.rank} van ${n.totalCountries}.`}`,
    faqLeaderQ: n => `Welk land heeft de meeste beroemde ${n.occPlural}?`,
    faqLeaderA: n => `Aan kop: ${n.leader} (${n.leaderCount}, ${n.leaderShare} van het wereldtotaal).${n.followers ? ` Daarna volgen ${n.followers}.` : ""}`,
    faqWomanQ: () => "Wie is de beroemdste vrouw op deze lijst?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) is de hoogst geplaatste vrouw op deze lijst, op plaats ${n.womanRank} in totaal.`,
    faqLivingQ: () => "Wie is de beroemdste nog levende persoon op deze lijst?",
    faqLivingA: n => `${n.living} (geb. ${n.livingBorn}) is de hoogst geplaatste nog levende persoon op deze lijst, op plaats ${n.livingRank} in totaal.`,
    faqMethodQ: "Hoe wordt deze ranglijst berekend?",
    faqMethodA: "Pantheon rangschikt mensen met de Historical Popularity Index (HPI). Die combineert het aantal Wikipedia-taalversies met een artikel over de persoon, het aantal weergaven van die artikelen buiten de Engelstalige Wikipedia, hoe stabiel die belangstelling in de tijd is en hoe lang geleden de persoon leefde.",
    faqMethodLink: "Lees de methodologie",
    relatedSameOcc: n => `${cap(n.occPlural)} uit andere landen`,
    relatedSameCountry: n => `Meer beroemde mensen ${n.fromCountry}`,
  },

  ru: {
    from: "из",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "Самые известные",
    kickerSingle: "Самый известный",
    metaTitle: n => (n.count === 1
      ? `Самый известный ${n.groupSingular}: ${n.top}`
      : `Самые известные ${n.group}: топ-${shown(n)}`),
    metaDescription: n => `${n.names} возглавляют рейтинг Pantheon «${cap(n.group)}» (${n.countFormatted}) по индексу исторической популярности. Годы и места рождения, сравнение с другими странами.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) — самый известный ${n.groupSingular} по индексу исторической популярности Pantheon. Сравнение с другими странами.`,
    summarySingle: n => `${n.top} — единственный ${n.groupSingular} в базе данных Pantheon.`,
    summary: n => {
      let text = `${cap(n.count === 1 ? n.groupSingular : n.group)} в рейтинге Pantheon по индексу исторической популярности (HPI): ${n.countFormatted}.`;
      if (n.rank === 1) text += ` ${n.country} — на первом месте в мире: ${n.share} от общего числа (${n.occTotal}).`;
      else if (n.rank) text += ` ${n.country} — на ${n.rank}-м месте среди стран: ${n.share} от общего числа (${n.occTotal}).`;
      return text;
    },
    statCount: () => "в рейтинге",
    statShare: "от мирового числа",
    statRank: n => `из ${n.totalCountries}`,
    statWomen: "женщины",
    statLiving: "ныне живущие",
    statBorn: "годы рождения",
    statRca: "к среднемировому",
    statRcaHint: "Насколько эта профессия здесь пере- или недопредставлена относительно общей доли страны в Pantheon",
    allOccWorldwide: n => `Все ${n.occPlural} мира`,
    topTitle: n => (n.count === 1 ? `Самый известный ${n.groupSingular}` : `Топ-${n.topCount}: ${n.group}`),
    topIntro: "Рейтинг по индексу исторической популярности (HPI) Pantheon: он учитывает, во скольких языковых разделах Википедии есть статья о человеке, насколько активно её читают и как давно жил человек.",
    born: y => `род. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Топ-100: ${n.group}` : `Полный рейтинг: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `Первые 100 из ${n.countFormatted} по HPI. Остальные — в обозревателе рейтингов.`
      : "Полный список после первой десятки."),
    colRank: "#",
    colName: "Имя",
    colYears: "Годы жизни",
    colBirthplace: "Место рождения",
    colHpi: "HPI",
    seeFullRanking: "Открыть полный рейтинг",
    womenTitle: () => "Самые известные женщины",
    livingTitle: () => "Самые известные из ныне живущих",
    countriesTitle: n => `${cap(n.occPlural)}: рейтинг стран`,
    countriesIntro: n => (n.rank === 1
      ? `${n.country} — на первом месте в мире: ${n.countFormatted} из ${n.occTotal} (${n.share}).`
      : `${n.country} — на ${n.rank}-м месте среди стран: ${n.countFormatted} из ${n.occTotal} (${n.share}).`),
    birthplacesTitle: () => "Места рождения",
    birthplacesIntro: () => "Города, где родилось больше всего людей из этого списка.",
    decadesTitle: "Люди по десятилетию рождения",
    centuriesTitle: "Люди по веку рождения",
    erasIntro: "По времени рождения; внутри групп — от самых известных.",
    more: n => `ещё ${n.count}`,
    seeAll: "Все в рейтинге",
    lifespansTitle: "Пересекающиеся жизни",
    lifespansIntro: n => `Кто из них жил в одно время? Годы жизни самых известных (${n.lifeCount}), родившихся после 1700 года.`,
    lifespansChartTitle: n => `Годы жизни: топ-${n.lifeCount}`,
    faqTitle: "Часто задаваемые вопросы",
    faqTopQ: n => `Кто самый известный ${n.groupSingular}?`,
    faqTopA: n => `${n.top} (${n.topYears}) — самый известный ${n.groupSingular} в Pantheon: индекс исторической популярности ${n.topHpi}, статьи в Википедии: ${n.topLangs} яз.${n.next ? ` Далее в списке: ${n.next}.` : ""}`,
    faqCountQ: n => `${cap(n.group)}: сколько их в Pantheon?`,
    faqCountA: n => `В Pantheon — ${n.countFormatted}, это ${n.share} от общемирового числа (${n.occTotal}).${n.rank === 1 ? " Это больше, чем у любой другой страны." : ` По этому показателю ${n.country} — на ${n.rank}-м месте среди стран.`}`,
    faqLeaderQ: n => `${cap(n.occPlural)}: в какой стране их больше всего?`,
    faqLeaderA: n => `Лидирует ${n.leader}: ${n.leaderCount} (${n.leaderShare} от общего числа).${n.followers ? ` Далее следуют ${n.followers}.` : ""}`,
    faqWomanQ: () => "Кто самая известная женщина в этом списке?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) — самая известная женщина в этом списке, ${n.womanRank}-е место в общем рейтинге.`,
    faqLivingQ: () => "Кто самый известный из ныне живущих в этом списке?",
    faqLivingA: n => `${n.living} (род. ${n.livingBorn}) — самый известный из ныне живущих, ${n.livingRank}-е место в общем рейтинге.`,
    faqMethodQ: "Как составляется этот рейтинг?",
    faqMethodA: "Pantheon ранжирует людей по индексу исторической популярности (HPI). Он учитывает, во скольких языковых разделах Википедии есть статья о человеке, сколько просмотров эти статьи получают за пределами английской Википедии, насколько стабилен интерес со временем и как давно жил человек.",
    faqMethodLink: "Подробнее о методологии",
    relatedSameOcc: n => `${cap(n.occPlural)} из других стран`,
    relatedSameCountry: n => `Другие известные люди ${n.fromCountry}`,
  },

  pl: {
    from: "z",
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "Najsławniejsi",
    kickerSingle: "Najsławniejszy",
    metaTitle: n => (n.count === 1
      ? `Najsłynniejszy ${n.groupSingular}: ${n.top}`
      : `Najsłynniejsi ${n.group}: top ${shown(n)}`),
    metaDescription: n => `${n.names} prowadzą w rankingu Pantheon „${cap(n.group)}” (${n.countFormatted}) według Indeksu Popularności Historycznej. Lata i miejsca urodzenia oraz porównanie z innymi krajami.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) to najsłynniejszy ${n.groupSingular} według Indeksu Popularności Historycznej Pantheon. Porównanie z innymi krajami.`,
    summarySingle: n => `${n.top} to jedyny ${n.groupSingular} w bazie danych Pantheon.`,
    summary: n => {
      let text = `${cap(n.count === 1 ? n.groupSingular : n.group)} w rankingu Pantheon według Indeksu Popularności Historycznej (HPI): ${n.countFormatted}.`;
      if (n.rank === 1) text += ` To najwięcej spośród wszystkich krajów: ${n.share} z ${n.occTotal} na świecie.`;
      else if (n.rank) text += ` ${n.country} zajmuje ${n.rank}. miejsce wśród krajów: ${n.share} z ${n.occTotal} na świecie.`;
      return text;
    },
    statCount: () => "w rankingu",
    statShare: "światowej liczby",
    statRank: n => `z ${n.totalCountries}`,
    statWomen: "kobiety",
    statLiving: "żyjący",
    statBorn: "lata urodzenia",
    statRca: "względem średniej światowej",
    statRcaHint: "Na ile ten zawód jest tu nad- lub niedoreprezentowany w stosunku do ogólnego udziału kraju w Pantheonie",
    allOccWorldwide: n => `Wszyscy ${n.occPlural} na świecie`,
    topTitle: n => (n.count === 1 ? `Najsłynniejszy ${n.groupSingular}` : `Top ${n.topCount}: ${n.group}`),
    topIntro: "Ranking według Indeksu Popularności Historycznej (HPI) Pantheon, który łączy liczbę wersji językowych Wikipedii z artykułem o danej osobie, popularność tych artykułów i to, jak dawno żyła dana osoba.",
    born: y => `ur. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Pełny ranking: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `Pierwsza setka z ${n.countFormatted} według HPI. Pozostali są w eksploratorze rankingów.`
      : "Pełna lista po pierwszej dziesiątce."),
    colRank: "#",
    colName: "Imię i nazwisko",
    colYears: "Lata życia",
    colBirthplace: "Miejsce urodzenia",
    colHpi: "HPI",
    seeFullRanking: "Zobacz pełny ranking",
    womenTitle: () => "Najsłynniejsze kobiety",
    livingTitle: () => "Najsłynniejsi żyjący",
    countriesTitle: n => `${cap(n.occPlural)}: ranking krajów`,
    countriesIntro: n => (n.rank === 1
      ? `${n.country}: 1. miejsce na świecie — ${n.countFormatted} z ${n.occTotal} (${n.share}).`
      : `${n.country}: ${n.rank}. miejsce wśród krajów — ${n.countFormatted} z ${n.occTotal} (${n.share}).`),
    birthplacesTitle: () => "Miejsca urodzenia",
    birthplacesIntro: () => "Miasta, z których pochodzi najwięcej osób z tej listy.",
    decadesTitle: "Osoby według dekady urodzenia",
    centuriesTitle: "Osoby według stulecia urodzenia",
    erasIntro: "Pogrupowani według daty urodzenia, od najsłynniejszych.",
    more: n => `+${n.count} więcej`,
    seeAll: "Zobacz wszystkich w rankingu",
    lifespansTitle: "Splecione życiorysy",
    lifespansIntro: n => `Kto z nich żył w tym samym czasie? Lata życia najsłynniejszych osób (${n.lifeCount}) urodzonych po 1700 roku.`,
    lifespansChartTitle: n => `Lata życia: top ${n.lifeCount}`,
    faqTitle: "Najczęściej zadawane pytania",
    faqTopQ: n => `Najsłynniejszy ${n.groupSingular} — kto to jest?`,
    faqTopA: n => `${n.top} (${n.topYears}) to najsłynniejszy ${n.groupSingular} w Pantheonie: Indeks Popularności Historycznej ${n.topHpi}, artykuły w Wikipedii w ${n.topLangs} wersjach językowych.${n.next ? ` Dalej na liście: ${n.next}.` : ""}`,
    faqCountQ: n => `${cap(n.group)}: ilu ich jest w Pantheonie?`,
    faqCountA: n => `Pantheon obejmuje ${n.countFormatted} — to ${n.share} z ${n.occTotal} na świecie.${n.rank === 1 ? " To więcej niż w przypadku jakiegokolwiek innego kraju." : ` ${n.country} zajmuje pod tym względem ${n.rank}. miejsce wśród krajów.`}`,
    faqLeaderQ: n => `${cap(n.occPlural)}: który kraj ma ich najwięcej?`,
    faqLeaderA: n => `Prowadzi ${n.leader}: ${n.leaderCount} (${n.leaderShare} światowej liczby).${n.followers ? ` Dalej plasują się: ${n.followers}.` : ""}`,
    faqWomanQ: () => "Kim jest najsłynniejsza kobieta na tej liście?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) to najwyżej sklasyfikowana kobieta na tej liście — ${n.womanRank}. miejsce w całym rankingu.`,
    faqLivingQ: () => "Kto jest najsłynniejszą żyjącą osobą na tej liście?",
    faqLivingA: n => `${n.living} (ur. ${n.livingBorn}) to najwyżej sklasyfikowana żyjąca osoba na tej liście — ${n.livingRank}. miejsce w całym rankingu.`,
    faqMethodQ: "Jak powstaje ten ranking?",
    faqMethodA: "Pantheon klasyfikuje osoby według Indeksu Popularności Historycznej (HPI), który łączy liczbę wersji językowych Wikipedii z artykułem o danej osobie, liczbę wyświetleń tych artykułów poza angielską Wikipedią, stabilność zainteresowania w czasie oraz to, jak dawno żyła dana osoba.",
    faqMethodLink: "Przeczytaj o metodologii",
    relatedSameOcc: n => `${cap(n.occPlural)} z innych krajów`,
    relatedSameCountry: n => `Więcej znanych osób ${n.fromCountry}`,
  },

  hu: {
    from: "",
    group: n => `${n.fromCountry} származó ${n.occPlural}`,
    groupSingular: n => `${n.fromCountry} származó ${n.occSingular}`,
    heading: n => `${n.fromCountry} származó ${n.count === 1 ? n.occSingular : n.occPlural}`,
    kicker: "A leghíresebb",
    kickerSingle: "A leghíresebb",
    metaTitle: n => (n.count === 1
      ? `A leghíresebb ${n.groupSingular}: ${n.top}`
      : `A leghíresebb ${n.group} (top ${shown(n)})`),
    metaDescription: n => `${n.names} vezetik a Pantheon rangsorát, amely ${n.countFormatted} ${n.groupSingular} történelmi népszerűségét méri. Születési évek, helyek és nemzetközi összehasonlítás.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}) a leghíresebb ${n.groupSingular} a Pantheon Történelmi Népszerűségi Indexe szerint. Összehasonlítás más országokkal.`,
    summarySingle: n => `${n.top} az egyetlen ${n.groupSingular} a Pantheon adatbázisában.`,
    summary: n => {
      let text = `A Pantheon rangsorában ${n.countFormatted} ${n.groupSingular} szerepel, a Történelmi Népszerűségi Index (HPI) szerint sorba rendezve.`;
      if (n.rank === 1) text += ` Ez a legtöbb az országok között: a világ összesen ${n.occTotal} főjének ${n.share}-a.`;
      else if (n.rank) text += ` Az országok rangsorában ez a(z) ${n.rank}. hely: a világ összesen ${n.occTotal} főjének ${n.share}-a.`;
      return text;
    },
    statCount: () => "a rangsorban",
    statShare: "a világ összesből",
    statRank: n => `/ ${n.totalCountries} ország`,
    statWomen: "nő",
    statLiving: "ma is él",
    statBorn: "születési évek",
    statRca: "a világátlaghoz képest",
    statRcaHint: "Mennyire felül- vagy alulreprezentált itt ez a foglalkozás az ország teljes Pantheon-részesedéséhez képest",
    allOccWorldwide: n => `Az összes ${n.occSingular} a világon`,
    topTitle: n => (n.count === 1 ? `A leghíresebb ${n.groupSingular}` : `Top ${n.topCount}: ${n.group}`),
    topIntro: "A Pantheon Történelmi Népszerűségi Indexe (HPI) szerinti sorrend. Az index azt méri, hány nyelvű Wikipédián van szócikk az adott személyről, mennyit olvassák ezeket, és milyen régen élt.",
    born: y => `szül. ${y}`,
    rankingTitle: n => (n.count > 100 ? `Top 100: ${n.group}` : `Teljes rangsor: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `A ${n.countFormatted} fő közül a HPI szerinti első 100. A többiek a rangsorböngészőben találhatók.`
      : "A teljes lista a top 10 után."),
    colRank: "#",
    colName: "Név",
    colYears: "Élt",
    colBirthplace: "Születési hely",
    colHpi: "HPI",
    seeFullRanking: "A teljes rangsor megtekintése",
    womenTitle: () => "A leghíresebb nők",
    livingTitle: () => "A leghíresebb ma is élők",
    countriesTitle: n => `${cap(n.occPlural)}: az országok rangsora`,
    countriesIntro: n => `${n.country}: ${n.rank}. hely ${n.totalCountries} ország közül — ${n.countFormatted} fő a világ ${n.occTotal} fős összesítéséből (${n.share}).`,
    birthplacesTitle: () => "Születési helyek",
    birthplacesIntro: () => "A városok, ahonnan a lista legtöbb szereplője származik.",
    decadesTitle: "Személyek születési évtized szerint",
    centuriesTitle: "Személyek születési évszázad szerint",
    erasIntro: "Születési idő szerint csoportosítva, a leghíresebbekkel kezdve.",
    more: n => `+${n.count} további`,
    seeAll: "Mind a rangsorban",
    lifespansTitle: "Egymást átfedő életek",
    lifespansIntro: n => `Kik éltek közülük egy időben? Az 1700 után született ${n.lifeCount} leghíresebb személy élettartama.`,
    lifespansChartTitle: n => `A top ${n.lifeCount} élettartama`,
    faqTitle: "Gyakran ismételt kérdések",
    faqTopQ: n => `Ki a leghíresebb ${n.groupSingular}?`,
    faqTopA: n => `${n.top} (${n.topYears}) a leghíresebb ${n.groupSingular} a Pantheonban: Történelmi Népszerűségi Indexe ${n.topHpi}, életrajza ${n.topLangs} nyelvű Wikipédián olvasható.${n.next ? ` Utána következik: ${n.next}.` : ""}`,
    faqCountQ: n => `Hány híres ${n.groupSingular} van?`,
    faqCountA: n => `A Pantheon adatbázisában ${n.countFormatted} ${n.groupSingular} szerepel, ami a világ összesen ${n.occTotal} főjének ${n.share}-a.${n.rank === 1 ? " Ez a legtöbb az országok között." : ` Az országok rangsorában ez a(z) ${n.rank}. hely.`}`,
    faqLeaderQ: n => `Melyik országból származik a legtöbb híres ${n.occSingular}?`,
    faqLeaderA: n => `${n.leader} vezet ${n.leaderCount} fővel (${n.leaderShare}).${n.followers ? ` Utána következik: ${n.followers}.` : ""}`,
    faqWomanQ: () => "Ki a leghíresebb nő ezen a listán?",
    faqWomanA: n => `${n.woman} (${n.womanYears}) a legmagasabban rangsorolt nő ezen a listán, összesítésben a(z) ${n.womanRank}. helyen.`,
    faqLivingQ: () => "Ki a leghíresebb ma is élő személy ezen a listán?",
    faqLivingA: n => `${n.living} (szül. ${n.livingBorn}) a legmagasabban rangsorolt ma is élő személy ezen a listán, összesítésben a(z) ${n.livingRank}. helyen.`,
    faqMethodQ: "Hogyan készül ez a rangsor?",
    faqMethodA: "A Pantheon a Történelmi Népszerűségi Index (HPI) alapján rangsorolja a személyeket. Az index figyelembe veszi, hány nyelvű Wikipédián van szócikk az adott személyről, hány megtekintést kapnak ezek a szócikkek az angol Wikipédián kívül, mennyire stabil az érdeklődés az idő során, és milyen régen élt az illető.",
    faqMethodLink: "A módszertan elolvasása",
    relatedSameOcc: n => `${cap(n.occPlural)} más országokból`,
    relatedSameCountry: n => `További híres emberek: ${n.country}`,
    keepExploring: "Fedezz fel többet",
  },

  ar: {
    from: "من",
    kickerAfter: true,
    group: n => `${n.occPlural} ${n.fromCountry}`,
    groupSingular: n => `${n.occSingular} ${n.fromCountry}`,
    heading: n => `${n.count === 1 ? n.occSingular : n.occPlural} ${n.fromCountry}`,
    kicker: "الأكثر شهرة",
    kickerSingle: "الأكثر شهرة",
    metaTitle: n => (n.count === 1
      ? `أشهر ${n.groupSingular}: ${n.top}`
      : `${n.group} الأكثر شهرة: أفضل ${shown(n)}`),
    metaDescription: n => `${n.group} الأكثر شهرة (${n.countFormatted}) وفق مؤشر الشعبية التاريخية من Pantheon، وفي المقدمة ${n.names}. سنوات الميلاد وأماكنها ومقارنة مع الدول الأخرى.`,
    metaDescriptionSingle: n => `${n.top} (${n.topYears}): أشهر ${n.groupSingular} وفق مؤشر الشعبية التاريخية من Pantheon. اكتشف ترتيب ${n.country} مقارنة بالدول الأخرى.`,
    summarySingle: n => `الشخص الوحيد في فئة «${n.groupSingular}» في قاعدة بيانات Pantheon: ${n.top}.`,
    summary: n => {
      let text = `${n.count === 1 ? n.groupSingular : n.group} في تصنيف Pantheon وفق مؤشر الشعبية التاريخية (HPI): ${n.countFormatted}.`;
      if (n.rank) text += ` الترتيب عالميًا: ${n.rank} من أصل ${n.totalCountries}، بنسبة ${n.share} من الإجمالي (${n.occTotal}).`;
      return text;
    },
    statCount: () => "في التصنيف",
    statShare: "من الإجمالي العالمي",
    statRank: n => `من أصل ${n.totalCountries}`,
    statWomen: "نساء",
    statLiving: "على قيد الحياة",
    statBorn: "سنوات الميلاد",
    statRca: "مقارنة بالمتوسط العالمي",
    statRcaHint: "مدى تمثيل هذه المهنة هنا أكثر أو أقل من المتوقع، قياسًا بحصة الدولة الإجمالية في Pantheon",
    allOccWorldwide: n => `${n.occPlural} حول العالم`,
    topTitle: n => (n.count === 1 ? `أشهر ${n.groupSingular}` : `أفضل ${n.topCount}: ${n.group}`),
    topIntro: "مرتبون وفق مؤشر الشعبية التاريخية (HPI) من Pantheon، الذي يجمع بين عدد إصدارات ويكيبيديا اللغوية التي تضم مقالًا عن الشخص، ومدى قراءة هذه المقالات، والمدة التي مضت منذ عاش.",
    born: y => `مواليد ${y}`,
    rankingTitle: n => (n.count > 100 ? `أفضل 100: ${n.group}` : `التصنيف الكامل: ${n.group}`),
    rankingIntro: n => (n.count > 100
      ? `أشهر 100 من أصل ${n.countFormatted} وفق مؤشر HPI. البقية في مستكشف التصنيفات.`
      : "القائمة الكاملة بعد أفضل 10."),
    colRank: "#",
    colName: "الاسم",
    colYears: "سنوات الحياة",
    colBirthplace: "مكان الميلاد",
    colHpi: "HPI",
    seeFullRanking: "عرض التصنيف الكامل",
    womenTitle: () => "أشهر النساء",
    livingTitle: () => "أشهر الأحياء",
    countriesTitle: n => `${n.occPlural}: ترتيب الدول`,
    countriesIntro: n => `${n.country}: المرتبة ${n.rank} عالميًا، بعدد ${n.countFormatted} من أصل ${n.occTotal} (${n.share}).`,
    birthplacesTitle: () => "أماكن الميلاد",
    birthplacesIntro: () => "المدن التي ينحدر منها أكبر عدد من أشخاص هذه القائمة.",
    decadesTitle: "الأشخاص حسب عقد الميلاد",
    centuriesTitle: "الأشخاص حسب قرن الميلاد",
    erasIntro: "مجمّعون حسب تاريخ الميلاد، والأشهر أولًا.",
    more: n => `+${n.count} آخرين`,
    seeAll: "عرض الكل في التصنيف",
    lifespansTitle: "حيوات متداخلة",
    lifespansIntro: n => `من منهم عاش في الفترة نفسها؟ أعمار الأشهر (${n.lifeCount}) ممن وُلدوا بعد عام 1700.`,
    lifespansChartTitle: n => `أعمار أفضل ${n.lifeCount}`,
    faqTitle: "الأسئلة الشائعة",
    faqTopQ: n => `من هو أشهر ${n.groupSingular}؟`,
    faqTopA: n => `${n.top} (${n.topYears}): أشهر ${n.groupSingular} في Pantheon — مؤشر الشعبية التاريخية ${n.topHpi}، وعدد لغات ويكيبيديا ${n.topLangs}.${n.next ? ` ثم في القائمة: ${n.next}.` : ""}`,
    faqCountQ: n => `${n.group}: كم عددهم؟`,
    faqCountA: n => `يضم Pantheon ‏${n.countFormatted}، أي ${n.share} من الإجمالي العالمي البالغ ${n.occTotal}.${n.rank === 1 ? " وهذا أعلى رقم بين جميع الدول." : ` وبذلك يكون ترتيب ${n.country}: ${n.rank} بين الدول.`}`,
    faqLeaderQ: n => `${n.occPlural}: أي دولة لديها العدد الأكبر؟`,
    faqLeaderA: n => `في الصدارة: ${n.leader} بعدد ${n.leaderCount} (${n.leaderShare} من الإجمالي)${n.followers ? `، ثم ${n.followers}` : ""}.`,
    faqWomanQ: () => "من هي أشهر امرأة في هذه القائمة؟",
    faqWomanA: n => `${n.woman} (${n.womanYears}) هي أعلى امرأة ترتيبًا في هذه القائمة، في المرتبة ${n.womanRank} إجمالًا.`,
    faqLivingQ: () => "من هو أشهر شخص على قيد الحياة في هذه القائمة؟",
    faqLivingA: n => `${n.living} (مواليد ${n.livingBorn}): أعلى شخص على قيد الحياة ترتيبًا في هذه القائمة، في المرتبة ${n.livingRank} إجمالًا.`,
    faqMethodQ: "كيف يُحسب هذا التصنيف؟",
    faqMethodA: "يصنّف Pantheon الأشخاص وفق مؤشر الشعبية التاريخية (HPI)، الذي يجمع بين عدد إصدارات ويكيبيديا اللغوية التي تضم مقالًا عن الشخص، وعدد مشاهدات تلك المقالات خارج ويكيبيديا الإنجليزية، ومدى ثبات الاهتمام بمرور الوقت، والمدة التي مضت منذ عاش الشخص.",
    faqMethodLink: "اقرأ عن المنهجية",
    relatedSameOcc: n => `${n.occPlural} من دول أخرى`,
    relatedSameCountry: n => `مزيد من المشاهير ${n.fromCountry}`,
  },

  ja: {
    from: "出身の",
    group: n => `${n.country}出身の${n.occPlural}`,
    groupSingular: n => `${n.country}出身の${n.occSingular}`,
    heading: n => `${n.country}出身の${n.occPlural}`,
    kicker: "最も有名な",
    kickerSingle: "最も有名な",
    metaTitle: n => (n.count === 1
      ? `${n.country}出身で最も有名な${n.occSingular}：${n.top}`
      : n.count > 100
        ? `${n.country}出身の有名な${n.occPlural}ランキングTOP100`
        : `${n.country}出身の有名な${n.occPlural}ランキング（${n.countFormatted}人）`),
    metaDescription: n => `${n.names}など、${n.country}出身の有名な${n.occPlural}${n.countFormatted}人を歴史的人気指数（HPI）でランキング。生年や出身地、世界各国との比較も紹介します。`,
    metaDescriptionSingle: n => `${n.top}（${n.topYears}）は、Pantheonの歴史的人気指数で${n.country}出身の最も有名な${n.occSingular}です。他の国との比較も紹介します。`,
    summarySingle: n => `${n.top}は、Pantheonのデータセットで唯一の${n.country}出身の${n.occSingular}です。`,
    summary: n => {
      let text = `Pantheonは${n.country}出身の${n.occPlural}${n.countFormatted}人を歴史的人気指数（HPI）でランキングしています。`;
      if (n.rank === 1) text += `${n.country}は${n.occPlural}の出身者数で世界1位で、全${n.occTotal}人の${n.share}を占めます。`;
      else if (n.rank) text += `${n.country}は${n.occPlural}の出身者数で${n.totalCountries}か国中${n.rank}位で、全${n.occTotal}人の${n.share}を占めます。`;
      return text;
    },
    statCount: () => "人をランキング",
    statShare: "世界全体に占める割合",
    statRank: n => `${n.totalCountries}か国中`,
    statWomen: "女性",
    statLiving: "存命",
    statBorn: "生年",
    statRca: "世界平均比",
    statRcaHint: "Pantheon全体に占めるこの国の割合と比べて、この職業がどれだけ多い（少ない）か",
    allOccWorldwide: n => `世界の${n.occPlural}一覧`,
    topTitle: n => (n.count === 1 ? `${n.country}出身で最も有名な${n.occSingular}` : `${n.country}出身の${n.occPlural} トップ${n.topCount}`),
    topIntro: "Pantheonの歴史的人気指数（HPI）による順位です。HPIは、その人物の記事があるウィキペディアの言語版の数、記事の閲覧数、そしてどれほど昔の人物かを組み合わせた指標です。",
    born: y => `${y}年生まれ`,
    rankingTitle: n => (n.count > 100 ? `${n.group} トップ100` : `${n.group} 全${n.countFormatted}人ランキング`),
    rankingIntro: n => (n.count > 100
      ? `全${n.countFormatted}人のうちHPI上位100人を表示しています。残りはランキングページでご覧いただけます。`
      : "トップ10に続く全リストです。"),
    colRank: "順位",
    colName: "名前",
    colYears: "生没年",
    colBirthplace: "出生地",
    colHpi: "HPI",
    seeFullRanking: "ランキング全体を見る",
    womenTitle: () => "最も有名な女性",
    livingTitle: () => "存命中の最も有名な人物",
    countriesTitle: n => `${n.occPlural}が多い国ランキング`,
    countriesIntro: n => (n.rank === 1
      ? `${n.country}は全${n.occTotal}人中${n.countFormatted}人（${n.share}）で世界1位です。`
      : `${n.country}は全${n.occTotal}人中${n.countFormatted}人（${n.share}）で、${n.totalCountries}か国中${n.rank}位です。`),
    birthplacesTitle: () => "出生地",
    birthplacesIntro: () => "このリストの人物を最も多く輩出した都市。",
    decadesTitle: "出生年代別の人物",
    centuriesTitle: "生まれた世紀別の人物",
    erasIntro: "生まれた時期ごとに、有名な順に並べています。",
    more: n => `他${n.count}人`,
    seeAll: "ランキングですべて見る",
    lifespansTitle: "重なり合う生涯",
    lifespansIntro: n => `同じ時代を生きたのは誰？1700年以降に生まれた上位${n.lifeCount}人の生涯です。`,
    lifespansChartTitle: n => `上位${n.lifeCount}人の生涯`,
    faqTitle: "よくある質問",
    faqTopQ: n => `${n.country}出身で最も有名な${n.occSingular}は誰ですか？`,
    faqTopA: n => `${n.top}（${n.topYears}）は、Pantheonで${n.country}出身の最も有名な${n.occSingular}です。歴史的人気指数は${n.topHpi}、ウィキペディアの記事は${n.topLangs}言語にあります。${n.next ? `次いで${n.next}が続きます。` : ""}`,
    faqCountQ: n => `${n.country}出身の有名な${n.occPlural}は何人いますか？`,
    faqCountA: n => `Pantheonには${n.country}出身の${n.occPlural}が${n.countFormatted}人収録されており、全世界${n.occTotal}人の${n.share}にあたります。${n.rank === 1 ? "これは世界で最も多い数です。" : `これは${n.totalCountries}か国中${n.rank}位です。`}`,
    faqLeaderQ: n => `有名な${n.occPlural}が最も多い国はどこですか？`,
    faqLeaderA: n => `${n.leader}が${n.leaderCount}人（${n.leaderShare}）で最多です。${n.followers ? `${n.followers}が続きます。` : ""}`,
    faqWomanQ: () => "このリストで最も有名な女性は誰ですか？",
    faqWomanA: n => `${n.woman}（${n.womanYears}）は、このリストで最上位の女性で、総合${n.womanRank}位です。`,
    faqLivingQ: () => "このリストで存命中の最も有名な人物は誰ですか？",
    faqLivingA: n => `${n.living}（${n.livingBorn}年生まれ）は、このリストで最上位の存命人物で、総合${n.livingRank}位です。`,
    faqMethodQ: "このランキングはどのように算出されていますか？",
    faqMethodA: "Pantheonは歴史的人気指数（HPI）で人物をランク付けしています。HPIは、その人物の記事があるウィキペディアの言語版の数、英語版以外での記事の閲覧数、関心の安定性、そしてその人物がどれほど昔に生きていたかを組み合わせた指標です。",
    faqMethodLink: "方法論を読む",
    relatedSameOcc: n => `他の国の${n.occPlural}`,
    relatedSameCountry: n => `${n.country}出身のその他の著名人`,
  },

  zh: {
    from: "来自",
    group: n => `${n.country}${n.occPlural}`,
    groupSingular: n => `${n.country}${n.occSingular}`,
    heading: n => `${n.country}${n.occPlural}`,
    kicker: "最著名的",
    kickerSingle: "最著名的",
    metaTitle: n => (n.count === 1
      ? `最著名的${n.group}：${n.top}`
      : n.count > 100
        ? `最著名的${n.group}前100名`
        : `${n.countFormatted}位最著名的${n.group}`),
    metaDescription: n => `${n.names}位居Pantheon最著名的${n.countFormatted}位${n.group}排行榜前列，按历史知名度指数（HPI）排序。查看出生年份、出生地以及${n.country}与其他国家的比较。`,
    metaDescriptionSingle: n => `根据Pantheon的历史知名度指数，${n.top}（${n.topYears}）是最著名的${n.group}。了解${n.country}与其他国家的比较。`,
    summarySingle: n => `${n.top}是Pantheon数据集中唯一的${n.group}。`,
    summary: n => {
      let text = `Pantheon按历史知名度指数（HPI）对${n.countFormatted}位${n.group}进行排名。`;
      if (n.rank === 1) text += `${n.country}是${n.occPlural}出生人数最多的国家，占全部${n.occTotal}位的${n.share}。`;
      else if (n.rank) text += `按${n.occPlural}出生人数计算，${n.country}在${n.totalCountries}个国家中排名第${n.rank}，占全部${n.occTotal}位的${n.share}。`;
      return text;
    },
    statCount: () => "位入榜",
    statShare: "占全球总数",
    statRank: n => `共${n.totalCountries}个国家`,
    statWomen: "女性",
    statLiving: "在世",
    statBorn: "出生年份",
    statRca: "相对世界平均",
    statRcaHint: "与该国在Pantheon中的总体占比相比，这一职业在此的集中程度",
    allOccWorldwide: n => `全球${n.occPlural}`,
    topTitle: n => (n.count === 1 ? `最著名的${n.group}` : `${n.group}前${n.topCount}名`),
    topIntro: "按Pantheon历史知名度指数（HPI）排名。该指数综合了收录此人条目的维基百科语言版本数量、条目阅读量以及此人生活的年代。",
    born: y => `生于${y}年`,
    rankingTitle: n => (n.count > 100 ? `${n.group}前100名` : `全部${n.countFormatted}位${n.group}排名`),
    rankingIntro: n => (n.count > 100
      ? `显示全部${n.countFormatted}位中HPI最高的100位，其余可在排行榜中查看。`
      : "前10名之后的完整名单。"),
    colRank: "排名",
    colName: "姓名",
    colYears: "生卒年",
    colBirthplace: "出生地",
    colHpi: "HPI",
    seeFullRanking: "查看完整排名",
    womenTitle: () => "最著名的女性",
    livingTitle: () => "在世的最著名人物",
    countriesTitle: n => `哪些国家的著名${n.occPlural}最多？`,
    countriesIntro: n => (n.rank === 1
      ? `${n.country}以${n.countFormatted}位（占全部${n.occTotal}位的${n.share}）位居世界第一。`
      : `${n.country}以${n.countFormatted}位（占全部${n.occTotal}位的${n.share}）在${n.totalCountries}个国家中排名第${n.rank}。`),
    birthplacesTitle: () => "出生地",
    birthplacesIntro: () => "本榜单人物出生最多的城市。",
    decadesTitle: "按出生年代划分",
    centuriesTitle: "按出生世纪划分",
    erasIntro: "按出生时间分组，知名度高者在前。",
    more: n => `另外${n.count}位`,
    seeAll: "在排行榜中查看全部",
    lifespansTitle: "重叠的人生",
    lifespansIntro: n => `哪些人生活在同一时代？1700年以后出生的前${n.lifeCount}位人物的生卒年。`,
    lifespansChartTitle: n => `前${n.lifeCount}位人物的生卒年`,
    faqTitle: "常见问题",
    faqTopQ: n => `最著名的${n.group}是谁？`,
    faqTopA: n => `${n.top}（${n.topYears}）是Pantheon中最著名的${n.group}，历史知名度指数为${n.topHpi}，在${n.topLangs}种语言的维基百科中有条目。${n.next ? `其后依次是${n.next}。` : ""}`,
    faqCountQ: n => `有多少位著名的${n.group}？`,
    faqCountA: n => `Pantheon收录了${n.countFormatted}位${n.group}，占全球${n.occTotal}位${n.occPlural}的${n.share}。${n.rank === 1 ? "这一数量居各国之首。" : `${n.country}在${n.totalCountries}个国家中排名第${n.rank}。`}`,
    faqLeaderQ: n => `哪个国家的著名${n.occPlural}最多？`,
    faqLeaderA: n => `${n.leader}以${n.leaderCount}位（占全球总数的${n.leaderShare}）位居第一${n.followers ? `，其后是${n.followers}` : ""}。`,
    faqWomanQ: () => "榜单中最著名的女性是谁？",
    faqWomanA: n => `${n.woman}（${n.womanYears}）是榜单中排名最高的女性，总排名第${n.womanRank}。`,
    faqLivingQ: () => "榜单中在世的最著名人物是谁？",
    faqLivingA: n => `${n.living}（生于${n.livingBorn}年）是榜单中排名最高的在世人物，总排名第${n.livingRank}。`,
    faqMethodQ: "这个排名是如何计算的？",
    faqMethodA: "Pantheon使用历史知名度指数（HPI）对人物进行排名。该指数综合考虑收录此人条目的维基百科语言版本数量、英语以外版本条目的浏览量、关注度随时间的稳定性，以及此人生活的年代距今多久。",
    faqMethodLink: "阅读方法说明",
    relatedSameOcc: n => `其他国家的${n.occPlural}`,
    relatedSameCountry: n => `更多${n.country}名人`,
  },
};

/* -------------------------------------------------------------------------- */
/* Rank changes, comparisons, translated descriptions                         */
/* -------------------------------------------------------------------------- */

// Slavic plural forms: one (1, 21), few (2–4, 22–24), many (5–20, 25…).
function slavicPlural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
// Polish uses "many" for 21, 31… (only 1 itself takes the singular).
const polishPlural = (n, one, few, many) => (n === 1 ? one : slavicPlural(n, few, few, many));

// m: {delta, d (formatted |delta|), prevYear, year, pool, all (pool is the whole list)}
const EXTRA_STRINGS = {
  en: {
    moversTitle: m => `Biggest Movers Since ${m.prevYear}`,
    moversIntro: m => `Rank changes since Pantheon's ${m.prevYear} edition${m.all ? "" : `, among the top ${m.pool} on this list`}.`,
    moversUp: "Climbing",
    moversDown: "Falling",
    moversNew: m => `New in ${m.year}`,
    moveUp: m => `Up ${m.d} place${m.delta === 1 ? "" : "s"} since ${m.prevYear}`,
    moveDown: m => `Down ${m.d} place${m.delta === 1 ? "" : "s"} since ${m.prevYear}`,
    moveNew: "New",
    moveNewLong: m => `Not in the ${m.prevYear} ranking`,
    langsGained: m => `+${m.d} languages`,
    translatedNote: "",
  },
  es: {
    moversTitle: m => `Los que más se movieron desde ${m.prevYear}`,
    moversIntro: m => `Cambios de posición desde la edición ${m.prevYear} de Pantheon${m.all ? "" : `, entre los ${m.pool} primeros de esta lista`}.`,
    moversUp: "Suben",
    moversDown: "Bajan",
    moversNew: m => `Nuevos en ${m.year}`,
    moveUp: m => `Sube ${m.d} puesto${m.delta === 1 ? "" : "s"} desde ${m.prevYear}`,
    moveDown: m => `Baja ${m.d} puesto${m.delta === 1 ? "" : "s"} desde ${m.prevYear}`,
    moveNew: "Nuevo",
    moveNewLong: m => `No figuraba en el ranking de ${m.prevYear}`,
    langsGained: m => `+${m.d} idiomas`,
    translatedNote: "Descripciones traducidas automáticamente del inglés.",
  },
  fr: {
    moversTitle: m => `Les plus fortes évolutions depuis ${m.prevYear}`,
    moversIntro: m => `Évolution du classement depuis l'édition ${m.prevYear} de Pantheon${m.all ? "" : `, parmi les ${m.pool} premiers de cette liste`}.`,
    moversUp: "En hausse",
    moversDown: "En baisse",
    moversNew: m => `Nouveaux en ${m.year}`,
    moveUp: m => `Gagne ${m.d} place${m.delta === 1 ? "" : "s"} depuis ${m.prevYear}`,
    moveDown: m => `Perd ${m.d} place${m.delta === 1 ? "" : "s"} depuis ${m.prevYear}`,
    moveNew: "Nouveau",
    moveNewLong: m => `Absent du classement ${m.prevYear}`,
    langsGained: m => `+${m.d} langues`,
    translatedNote: "Descriptions traduites automatiquement de l'anglais.",
  },
  de: {
    moversTitle: m => `Die größten Veränderungen seit ${m.prevYear}`,
    moversIntro: m => `Platzierungsänderungen seit der Pantheon-Ausgabe ${m.prevYear}${m.all ? "" : `, unter den ${m.pool} Bestplatzierten dieser Liste`}.`,
    moversUp: "Aufsteiger",
    moversDown: "Absteiger",
    moversNew: m => `Neu im Jahr ${m.year}`,
    moveUp: m => `${m.d} ${m.delta === 1 ? "Platz" : "Plätze"} gestiegen seit ${m.prevYear}`,
    moveDown: m => `${m.d} ${m.delta === 1 ? "Platz" : "Plätze"} gefallen seit ${m.prevYear}`,
    moveNew: "Neu",
    moveNewLong: m => `Nicht in der Rangliste ${m.prevYear}`,
    langsGained: m => `+${m.d} Sprachen`,
    translatedNote: "Beschreibungen maschinell aus dem Englischen übersetzt.",
  },
  it: {
    moversTitle: m => `Chi è salito e chi è sceso dal ${m.prevYear}`,
    moversIntro: m => `Variazioni in classifica rispetto all'edizione ${m.prevYear} di Pantheon${m.all ? "" : `, tra i primi ${m.pool} di questa lista`}.`,
    moversUp: "In salita",
    moversDown: "In discesa",
    moversNew: m => `Nuovi nel ${m.year}`,
    moveUp: m => `Sale di ${m.d} posizion${m.delta === 1 ? "e" : "i"} dal ${m.prevYear}`,
    moveDown: m => `Scende di ${m.d} posizion${m.delta === 1 ? "e" : "i"} dal ${m.prevYear}`,
    moveNew: "Nuovo",
    moveNewLong: m => `Assente dalla classifica ${m.prevYear}`,
    langsGained: m => `+${m.d} lingue`,
    translatedNote: "Descrizioni tradotte automaticamente dall'inglese.",
  },
  pt: {
    moversTitle: m => `Quem mais subiu e caiu desde ${m.prevYear}`,
    moversIntro: m => `Mudanças de posição desde a edição ${m.prevYear} do Pantheon${m.all ? "" : `, entre os ${m.pool} primeiros desta lista`}.`,
    moversUp: "Em alta",
    moversDown: "Em queda",
    moversNew: m => `Novos em ${m.year}`,
    moveUp: m => `Subiu ${m.d} posiç${m.delta === 1 ? "ão" : "ões"} desde ${m.prevYear}`,
    moveDown: m => `Caiu ${m.d} posiç${m.delta === 1 ? "ão" : "ões"} desde ${m.prevYear}`,
    moveNew: "Novo",
    moveNewLong: m => `Fora do ranking de ${m.prevYear}`,
    langsGained: m => `+${m.d} idiomas`,
    translatedNote: "Descrições traduzidas automaticamente do inglês.",
  },
  nl: {
    moversTitle: m => `Grootste stijgers en dalers sinds ${m.prevYear}`,
    moversIntro: m => `Verschuivingen in de ranglijst sinds de Pantheon-editie van ${m.prevYear}${m.all ? "" : `, onder de top ${m.pool} van deze lijst`}.`,
    moversUp: "Stijgers",
    moversDown: "Dalers",
    moversNew: m => `Nieuw in ${m.year}`,
    moveUp: m => `${m.d} ${m.delta === 1 ? "plaats" : "plaatsen"} gestegen sinds ${m.prevYear}`,
    moveDown: m => `${m.d} ${m.delta === 1 ? "plaats" : "plaatsen"} gedaald sinds ${m.prevYear}`,
    moveNew: "Nieuw",
    moveNewLong: m => `Niet in de ranglijst van ${m.prevYear}`,
    langsGained: m => `+${m.d} talen`,
    translatedNote: "Beschrijvingen automatisch vertaald uit het Engels.",
  },
  ru: {
    moversTitle: m => `Главные изменения с ${m.prevYear} года`,
    moversIntro: m => `Изменения позиций по сравнению с выпуском Pantheon ${m.prevYear} года${m.all ? "" : `, среди первых ${m.pool} в этом списке`}.`,
    moversUp: "Поднялись",
    moversDown: "Опустились",
    moversNew: m => `Новые в ${m.year} году`,
    moveUp: m => `Рост на ${m.d} ${slavicPlural(Math.abs(m.delta), "позицию", "позиции", "позиций")} с ${m.prevYear} года`,
    moveDown: m => `Снижение на ${m.d} ${slavicPlural(Math.abs(m.delta), "позицию", "позиции", "позиций")} с ${m.prevYear} года`,
    moveNew: "Впервые",
    moveNewLong: m => `Не было в рейтинге ${m.prevYear} года`,
    langsGained: m => `+${m.d} яз.`,
    translatedNote: "Описания автоматически переведены с английского.",
  },
  pl: {
    moversTitle: m => `Największe zmiany od ${m.prevYear} r.`,
    moversIntro: m => `Zmiany pozycji od edycji Pantheon z ${m.prevYear} r.${m.all ? "" : `, wśród ${m.pool} najwyżej sklasyfikowanych na tej liście.`}`,
    moversUp: "W górę",
    moversDown: "W dół",
    moversNew: m => `Nowi w ${m.year} r.`,
    moveUp: m => `Awans o ${m.d} ${polishPlural(Math.abs(m.delta), "pozycję", "pozycje", "pozycji")} od ${m.prevYear} r.`,
    moveDown: m => `Spadek o ${m.d} ${polishPlural(Math.abs(m.delta), "pozycję", "pozycje", "pozycji")} od ${m.prevYear} r.`,
    moveNew: "Debiut",
    moveNewLong: m => `Brak w rankingu z ${m.prevYear} r.`,
    langsGained: m => `+${m.d} jęz.`,
    translatedNote: "Opisy przetłumaczone maszynowo z angielskiego.",
  },
  hu: {
    moversTitle: m => `A legnagyobb változások ${m.prevYear} óta`,
    moversIntro: m => `Helyezésváltozások a Pantheon ${m.prevYear}. évi kiadásához képest${m.all ? "" : `, a lista első ${m.pool} helyezettje között`}.`,
    moversUp: "Emelkedők",
    moversDown: "Visszaesők",
    moversNew: m => `Újak (${m.year})`,
    moveUp: m => `${m.d} hellyel feljebb ${m.prevYear} óta`,
    moveDown: m => `${m.d} hellyel lejjebb ${m.prevYear} óta`,
    moveNew: "Új",
    moveNewLong: m => `Nem szerepelt a ${m.prevYear}. évi rangsorban`,
    langsGained: m => `+${m.d} nyelv`,
    translatedNote: "A leírások gépi fordítással készültek angolból.",
  },
  ar: {
    moversTitle: m => `أكبر التحولات منذ ${m.prevYear}`,
    moversIntro: m => `تغيّر المراتب منذ إصدار ${m.prevYear} من Pantheon${m.all ? "" : `، بين أول ${m.pool} في هذه القائمة`}.`,
    moversUp: "صعودًا",
    moversDown: "هبوطًا",
    moversNew: m => `جديد في ${m.year}`,
    moveUp: m => `تقدّم بمقدار ${m.d} منذ ${m.prevYear}`,
    moveDown: m => `تراجع بمقدار ${m.d} منذ ${m.prevYear}`,
    moveNew: "جديد",
    moveNewLong: m => `لم يكن في تصنيف ${m.prevYear}`,
    langsGained: m => `+${m.d} لغة`,
    translatedNote: "الأوصاف مترجمة آليًا من الإنجليزية.",
  },
  ja: {
    moversTitle: m => `${m.prevYear}年からの大きな変動`,
    moversIntro: m => `Pantheon ${m.prevYear}年版からの順位の変化${m.all ? "" : `（このリストの上位${m.pool}人）`}。`,
    moversUp: "上昇",
    moversDown: "下降",
    moversNew: m => `${m.year}年に初登場`,
    moveUp: m => `${m.prevYear}年から${m.d}位上昇`,
    moveDown: m => `${m.prevYear}年から${m.d}位下降`,
    moveNew: "初登場",
    moveNewLong: m => `${m.prevYear}年のランキングには未掲載`,
    langsGained: m => `+${m.d}言語`,
    translatedNote: "説明文は英語から機械翻訳されています。",
  },
  zh: {
    moversTitle: m => `自${m.prevYear}年以来排名变化最大的人物`,
    moversIntro: m => `与 Pantheon ${m.prevYear} 年版相比的排名变化${m.all ? "" : `（本榜单前${m.pool}名）`}。`,
    moversUp: "上升",
    moversDown: "下降",
    moversNew: m => `${m.year}年新上榜`,
    moveUp: m => `较${m.prevYear}年上升${m.d}位`,
    moveDown: m => `较${m.prevYear}年下降${m.d}位`,
    moveNew: "新上榜",
    moveNewLong: m => `未进入${m.prevYear}年榜单`,
    langsGained: m => `+${m.d}种语言`,
    translatedNote: "简介由英文机器翻译。",
  },
};

export function getOcStrings(lang = DEFAULT_LOCALE) {
  return {
    ...STRINGS.en,
    ...EXTRA_STRINGS.en,
    ...(STRINGS[lang] || {}),
    ...(EXTRA_STRINGS[lang] || {}),
  };
}
