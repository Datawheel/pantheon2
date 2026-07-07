"use client";
import {max as D3Max, mean as D3Mean, sum as D3Sum} from "d3-array";
import {nest} from "d3-collection";
import dayjs from "dayjs";
import SimpleTooltip from "../common/SimpleTooltip";
import {FORMATTERS} from "../utils/consts";
import AnchorList from "../utils/AnchorList";
import {getTranslations} from "@/app/translations";

export default function PageViewsByLangSummary({timeSeriesData, person, lang = "en"}) {
  const tp = getTranslations(lang).person;
  const tc = tp.pageViewsByLangChart;

  // These links describe Wikipedia editions, so they always point at the
  // Wikipedia article. Never link to /xx/profile/... here: locale-prefixed
  // internal links get prefetched by next/link in production, and each
  // prefetch response sets the next-intl NEXT_LOCALE cookie — after which
  // every unprefixed link on the page redirects to that (random) locale.
  const getLanguageUrl = (langCode, wikiUrl) => wikiUrl;

  // Localize wiki-edition language names ("English" -> "inglês") via the
  // edition code; fall back to the English name from langFamilies data.
  let displayNames = null;
  try {
    displayNames = new Intl.DisplayNames([lang], {type: "language"});
  } catch (e) {
    displayNames = null;
  }
  const languageName = d => {
    let localized = null;
    if (d.lang && displayNames) {
      try {
        localized = displayNames.of(d.lang);
      } catch (e) {
        localized = null; // codes like zh-yue throw
      }
    }
    // ICU hands back a bare (possibly canonicalized) code when it has no
    // name for the locale — e.g. "knc" comes back as "kr". Treat short
    // all-ASCII code-shaped results as misses and prefer the English name.
    if (
      localized &&
      localized !== d.lang &&
      !/^[a-z]{2,3}(-[a-z0-9]+)*$/i.test(localized)
    ) {
      return localized;
    }
    return d.language || localized || d.lang || "";
  };
  const familyName = f => tc.families?.[f] || f;
  const languageTooltip = d =>
    tc.languageFamilyTooltip({
      language: languageName(d),
      languageLocal: d.language_local,
      familyName: familyName(d.family_name),
      primaryFamilyName: familyName(d.primary_family_name),
    });

  // get most recent month
  const latestDate = D3Max(timeSeriesData, d => dayjs(d.date, "YYYY/MM/DD"));

  // get prev year, and 2 years ago for year bounds
  const dataPastYear = timeSeriesData.filter(
    d => dayjs(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(1, "year")
  );
  const dataPrevPastYear = timeSeriesData.filter(
    d =>
      dayjs(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(2, "year") &&
      dayjs(d.date, "YYYY/MM/DD") <= latestDate.clone().subtract(1, "year")
  );

  // group past year (and year previous) by wiki edition
  const dataPastYearAgg = nest()
    .key(d => d.project)
    .rollup(leaves => ({
      views: D3Sum(leaves, d => d.views),
      lang: leaves[0].lang,
      project: leaves[0].project,
      article: leaves[0].article,
      language: leaves[0].language,
      language_local: leaves[0].language_local,
      family_name: leaves[0].family_name,
      primary_family_name: leaves[0].primary_family_name,
      pageUrl: leaves[0].pageUrl,
      year: Math.ceil(D3Mean(leaves, d => dayjs(d.date, "YYYY/MM/DD").year())),
    }))
    .entries(dataPastYear)
    .map(d => d.value)
    .sort((a, b) => b.views - a.views);
  const dataPrevPastYearAgg = nest()
    .key(d => d.project)
    .rollup(leaves => ({
      views: D3Sum(leaves, d => d.views),
      lang: leaves[0].lang,
      project: leaves[0].project,
      article: leaves[0].article,
      language: leaves[0].language,
      language_local: leaves[0].language_local,
      family_name: leaves[0].family_name,
      primary_family_name: leaves[0].primary_family_name,
      pageUrl: leaves[0].pageUrl,
      year: Math.ceil(D3Mean(leaves, d => dayjs(d.date, "YYYY/MM/DD").year())),
    }))
    .entries(dataPrevPastYear)
    .map(d => d.value);

  // merge past 2 years and align for growth calculation
  const dataProjectGrowth = nest()
    .key(d => d.project)
    .rollup(leaves => ({
      growth: leaves.length > 1 ? leaves[0].views - leaves[1].views : null,
      growthPct:
        leaves.length > 1
          ? (leaves[0].views - leaves[1].views) / leaves[1].views
          : null,
      vals: leaves,
      ...leaves[0],
    }))
    .entries(dataPastYearAgg.concat(dataPrevPastYearAgg))
    .map(d => d.value)
    .sort((a, b) => b.growthPct - a.growthPct);
  // console.log("dataPastYear", dataPastYear);
  // console.log("dataPrevPastYear", dataPrevPastYear);
  // console.log("dataPastYearAgg", dataPastYearAgg);
  // console.log("dataPrevPastYearAgg", dataPrevPastYearAgg);
  // console.log("dataProjectGrowth", dataProjectGrowth);

  const topLang = dataPastYearAgg[0];
  const topLangUrl = getLanguageUrl(topLang.lang, topLang.pageUrl);

  return (
    <p>
      {tc.summaryIntro({name: person.name})}
      <SimpleTooltip content={languageTooltip(topLang)}>
        <a href={topLangUrl} target="_blank" rel="noopener">
          {tc.wikipediaEdition({language: languageName(topLang)})}
        </a>
      </SimpleTooltip>
      {tc.withViewsFollowedBy({
        viewsFormatted: FORMATTERS.commas(topLang.views),
      })}
      <AnchorList
        items={dataPastYearAgg.slice(1, 3)}
        name={d => `${languageName(d)} (${FORMATTERS.commas(d.views)})`}
        url={d => getLanguageUrl(d.lang, d.pageUrl)}
        tooltip={languageTooltip}
        newWindow={true}
        andWord={tp.ranking.and}
      />
      {tc.growthIntro}
      <AnchorList
        items={dataProjectGrowth.slice(0, 3)}
        name={d => `${languageName(d)} (${FORMATTERS.share(d.growthPct)})`}
        url={d => getLanguageUrl(d.lang, d.pageUrl)}
        tooltip={languageTooltip}
        newWindow={true}
        andWord={tp.ranking.and}
      />
    </p>
  );
}
