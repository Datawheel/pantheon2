import dayjs from "dayjs";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {REVALIDATE_PERIODS} from "@/app/constants";
import {getTranslations} from "@/app/translations";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import TrendingNews from "@/components/news/TrendingNews";

const baseUrl = process.env.URL || "https://pantheon.world";

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params?.locale || DEFAULT_LOCALE;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  // Resolve the target date. ?model is a UI-only toggle (both models render in
  // the same HTML), so we drop it from the canonical to avoid duplicate URLs.
  // ?date= for today's date also collapses to the bare /news URL so the live
  // page has one canonical form.
  const dateParam = searchParams?.date;
  const today = dayjs().format("YYYY-MM-DD");
  const parsedDate = dateParam ? dayjs(dateParam) : null;
  const isValidPastDate =
    parsedDate?.isValid() &&
    parsedDate.format("YYYY-MM-DD") !== today &&
    parsedDate.isBefore(dayjs(), "day");

  const canonicalPath = isValidPastDate
    ? `/news?date=${parsedDate.format("YYYY-MM-DD")}`
    : "/news";

  let title = `${t.news.pageTitle} - Pantheon`;
  let description = t.news.pageSubtitle;
  if (isValidPastDate) {
    const localizedDate = new Intl.DateTimeFormat(lang, {
      dateStyle: "long",
    }).format(parsedDate.toDate());
    title = `${t.news.pageTitle} (${localizedDate}) - Pantheon`;
    description = `${t.news.pageSubtitle} — ${localizedDate}.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: buildCanonical(lang, canonicalPath),
      languages: buildLanguageAlternates(canonicalPath),
    },
  };
}

export default async function NewsPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params?.locale || DEFAULT_LOCALE;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  // Get date from query params or use today (display date)
  const dateParam = searchParams?.date;
  const targetDate = dateParam ? dayjs(dateParam) : dayjs();
  const formattedDate = targetDate.format("YYYY-MM-DD");

  // Get model from query params (grok or gemini)
  const modelParam = searchParams?.model;
  const currentModel = ["grok", "gemini"].includes(modelParam) ? modelParam : "grok";

  // Fetch data from 1 day prior (trending data is for previous day)
  const dataFetchDate = targetDate.subtract(1, "day").format("YYYY-MM-DD");

  // Fetch trending people for ALL languages
  const allLanguagePromises = SUPPORTED_LOCALES.map(locale =>
    fetch(
      `${baseUrl}/api/wikiTrends?lang=${locale}&date=${dataFetchDate}&limit=12`,
      {
        next: {revalidate: REVALIDATE_PERIODS.SHORT * 2},
      }
    )
      .then(res => res.json())
      .then(data => ({
        lang: locale,
        people: Array.isArray(data) ? data : [],
      }))
      .catch(error => {
        console.error(`Error fetching trending data for ${locale}:`, error);
        return {lang: locale, people: []};
      })
  );

  const allLanguageData = await Promise.all(allLanguagePromises);

  // Build a map of slug -> languages they trend in with ranks
  const slugToLanguages = {};
  allLanguageData.forEach(({lang: langCode, people}) => {
    people.forEach(person => {
      if (!slugToLanguages[person.slug]) {
        slugToLanguages[person.slug] = {
          person,
          languages: [],
          ranksByLang: {},
        };
      }
      slugToLanguages[person.slug].languages.push(langCode);
      slugToLanguages[person.slug].ranksByLang[langCode] =
        person.rank_pantheon || 0;
    });
  });

  // Assign each person to ONE language section
  const languageSections = {};
  Object.entries(slugToLanguages).forEach(
    ([slug, {person, languages, ranksByLang}]) => {
      // Prioritize user's selected language
      const assignedLang = languages.includes(lang) ? lang : languages[0];

      if (!languageSections[assignedLang]) {
        languageSections[assignedLang] = [];
      }

      // Add multi-language rank information to person
      const personWithRanks = {
        ...person,
        languageRanks: ranksByLang,
      };

      languageSections[assignedLang].push(personWithRanks);
    }
  );

  // Fetch occupation translations for non-English languages
  let occupationMap = {};
  if (lang !== "en") {
    try {
      const occupationData = await fetch(
        `${
          process.env.BASE_API || "https://api.pantheon.world"
        }/occupation?select=id,occupation,${lang}_occupation:translations->${lang}->>occupation`,
        {
          next: {revalidate: REVALIDATE_PERIODS.LONG},
        }
      )
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []))
        .catch(error => {
          console.error(`Error fetching occupation translations for ${lang}:`, error);
          return [];
        });

      occupationMap = occupationData.reduce((acc, item) => {
        const translatedOccupation = item[`${lang}_occupation`];
        if (translatedOccupation) {
          acc[item.occupation] = translatedOccupation;
        }
        return acc;
      }, {});
    } catch (error) {
      console.error("Error processing occupation translations:", error);
    }
  }

  // Fetch trending news for all unique people in the selected language (all models)
  const allSlugs = Object.keys(slugToLanguages);
  let reasonsMap = {};

  if (allSlugs.length > 0) {
    try {
      const reasonsData = await fetch(
        `${
          process.env.BASE_API || "https://api.pantheon.world"
        }/trend_news?date=eq.${dataFetchDate}&lang=eq.${lang}&select=slug,title,reason,llm_metadata,llm_provider`,
        {
          next: {revalidate: REVALIDATE_PERIODS.SHORT * 2},
        }
      )
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []))
        .catch(error => {
          console.error(`Error fetching trending reasons for ${lang}:`, error);
          return [];
        });
      // Group by slug, with all model responses
      reasonsMap = reasonsData.reduce((acc, item) => {
        if (!acc[item.slug]) {
          acc[item.slug] = {
            localized_name: item.title || "",
            modelResponses: [],
          };
        }
        if (item.reason) {
          acc[item.slug].modelResponses.push({
            provider: item.llm_provider || "unknown",
            reason: item.reason,
            llm_metadata: item.llm_metadata,
          });
        }
        return acc;
      }, {});
    } catch (error) {
      console.error("Error processing trending reasons:", error);
    }
  }

  // Merge trending reasons and translations into each person's data
  Object.values(languageSections).forEach(people => {
    people.forEach(person => {
      if (reasonsMap[person.slug]) {
        person.localized_name = reasonsMap[person.slug].localized_name;
        person.modelResponses = reasonsMap[person.slug].modelResponses;
      }

      // Apply occupation translation if available
      if (person.occupation && occupationMap[person.occupation]) {
        person.localized_occupation = occupationMap[person.occupation];
      }
    });
  });

  return (
    <TrendingNews
      languageSections={languageSections}
      currentLang={lang}
      currentDate={formattedDate}
      currentModel={currentModel}
    />
  );
}
