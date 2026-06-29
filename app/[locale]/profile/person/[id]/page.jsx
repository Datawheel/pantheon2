import {cloneElement} from "react";
import {notFound} from "next/navigation";
import {plural} from "pluralize";
import ProfileNav from "@/components/common/Nav";
import Intro from "@/components/person/Intro";
import Header from "@/components/person/Header";
import MemMetrics from "@/components/person/MemMetrics";
import PageViewsByLang from "@/components/person/PageViewsByLang";
import OccupationRanking from "@/components/person/OccupationRanking";
import YearRanking from "@/components/person/YearRanking";
import CountryRanking from "@/components/person/CountryRanking";
import CountryOccupationRanking from "@/components/person/CountryOccupationRanking";
import Books from "@/components/person/Books";
import News from "@/components/person/News";
//  Twitter from "@/components/person/tter";
import Movies from "@/components/person/Movies";
import WhyTrending from "@/components/person/WhyTrending";
import Footer from "@/components/person/Footer";
import TrendingHeatmap from "@/components/person/TrendingHeatmap";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {safeFetchArray} from "@/app/utils/safeFetch";
import GoogleAdSense from "@/components/common/GoogleAdSense";
import GoogleAdSenseScript from "@/components/common/GoogleAdSenseScript";
import rankless from "@/data/rankless.json";

// Safe JSON fetch with logging for debugging HTML responses
async function safeFetchJson(url, options = {}, fallback = null) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.error(`[safeFetchJson] HTTP ${res.status} for: ${url}`);
      return fallback;
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[safeFetchJson] Got HTML instead of JSON for: ${url}`);
      console.error(`[safeFetchJson] HTML preview: ${text.slice(0, 200)}`);
      return fallback;
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[safeFetchJson] Error for ${url}: ${e.message}`);
    return fallback;
  }
}

async function getPerson(id, lang = "en") {
  const url = `${BASE_API}/person?slug=eq.${id}&select=*,description,occupation(id,occupation,occupation_slug,domain_slug,num_born,hpi_avg,${lang}_occupation:translations->${lang}->>occupation),bplace_country(slug,country,country_code,demonym,${lang}_country:translations->${lang}->>country,${lang}_demonym:translations->${lang}->>demonym,${lang}_nationality_adj:translations->${lang}->>nationality_adj_plural_m,${lang}_from_country:translations->${lang}->>from_country),bplace_geonameid(slug,place),dplace_geonameid(slug,place)`;
  const data = await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    null,
  );

  if (!data) return null;

  // Check if the specific message exists in the response
  if (data.details && data.details.includes("Results contain 0 rows")) {
    return null;
  }

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function getPersonRanks(id) {
  const url = `${BASE_API}/person_ranks?slug=eq.${id}&select=l,l_prev,hpi,occupation_rank,occupation_rank_prev,bplace_country_rank,bplace_country_rank_prev,bplace_country_occupation_rank,occupation_rank_unique,bplace_country_rank_unique,bplace_country_occupation_rank_unique,birthyear_rank_unique,deathyear_rank_unique,bplace_country`;
  const data = await safeFetchJson(
    url,
    {method: "GET", next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

// async function getNewsArticles(personId) {
//   const res = await fetch(`${process.env.URL}/api/news?pid=${personId}`);
//   return res.json();
// }

// async function getTweets(personId) {
//   const res = await fetch(`${process.env.URL}/api/twit?pid=${personId}`);
//   return res.json();
// }

async function getBooks(personId) {
  const url = `${process.env.URL}/api/books?id=${personId}`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

async function getMovies(personId) {
  const url = `${process.env.URL}/api/movies?id=${personId}`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

async function getPersonTrending(slug, userLang, date) {
  const baseApi = process.env.BASE_API || "https://api.pantheon.world";

  // Fetch trending records across all languages (top 12 only)
  const trendUrl = `${baseApi}/trend?slug=eq.${slug}&rank_pantheon=lte.12&date=eq.${date}&select=lang,rank_pantheon`;
  const trendRecords = await safeFetchArray(
    trendUrl,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}},
  );

  // Build ranksByLang map
  const ranksByLang = trendRecords.reduce((acc, record) => {
    acc[record.lang] = record.rank_pantheon;
    return acc;
  }, {});

  // Fetch localized reasons from all available models
  const reasonUrl = `${baseApi}/trend_news?slug=eq.${slug}&lang=eq.${userLang}&date=eq.${date}&select=reason,llm_metadata,title,llm_provider`;
  const reasonRecords = await safeFetchArray(
    reasonUrl,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}},
  );

  // Build array of model responses
  const modelResponses = reasonRecords
    .filter(r => r.reason) // Only include records that have a reason
    .map(r => ({
      reason: r.reason,
      llmMetadata: r.llm_metadata,
      provider: r.llm_provider || "unknown",
    }));

  return {
    isTrending: trendRecords.length > 0,
    languages: trendRecords.map(r => r.lang),
    ranksByLang,
    modelResponses,
    localizedName: reasonRecords?.[0]?.title || null,
    // Keep backward compatibility
    trendingReason: reasonRecords?.[0]?.reason || null,
    llmMetadata: reasonRecords?.[0]?.llm_metadata || null,
  };
}

async function getPageViews(personId, lang = "en") {
  const baseApi = process.env.BASE_API || "https://api.pantheon.world";
  const url = `${baseApi}/pageviews_ch?lang=eq.${lang}&wp_id=eq.${personId}&select=date,views&order=date.asc`;
  return await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
}

async function getOccupationPageviews(occupationId) {
  if (!occupationId) {
    return null;
  }

  const encodedOccupationId = encodePostgrestValue(occupationId);
  const url = `${BASE_API}/pageviews_occupation?occupation=eq.${encodedOccupationId}`;
  const data = await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );

  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function getRolling12MonthViews(personId) {
  if (!personId) {
    return 0;
  }

  const url = `${BASE_API}/pageviews_rolling_12mo?wp_id=eq.${personId}`;
  const data = await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );

  return Array.isArray(data) && data.length > 0
    ? data[0]?.total_views || 0
    : 0;
}

export async function generateMetadata(props, parent) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const id = params.id;
  const locale = params.locale || DEFAULT_LOCALE;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  // fetch data
  const [person, personRanks] = await Promise.all([
    getPerson(id, lang),
    getPersonRanks(id),
  ]);

  if (!person) {
    return {
      title: "Not found",
    };
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  // Get localized name for metadata
  const localizedName = person.translations?.[lang] || person.name;

  // Build localized meta description
  const demonym = person.bplace_country?.[`${lang}_demonym`]
    || person.bplace_country?.[`${lang}_nationality_adj`]
    || person.bplace_country?.demonym
    || "";
  const occupation = person.occupation?.[`${lang}_occupation`]
    || person.occupation?.occupation
    || "";
  const birthYear = person.birthyear || "";
  const deathYear = person.alive ? t.stillAlive : (person.deathyear || "");
  const rank = personRanks?.l || "";
  const possessiveName = lang === "en"
    ? (localizedName.endsWith("s") ? `${localizedName}'` : `${localizedName}'s`)
    : localizedName;

  const description = t.personMetaDescription
    ? t.personMetaDescription({
        name: localizedName,
        birthYear,
        deathYear,
        demonym,
        occupation: occupation.toLowerCase(),
        rank,
        possessiveName,
      })
    : `${localizedName} Biography | Pantheon`;

  const ogImageUrl = `https://pantheon.world/api/screenshot/person?id=${person.id}&locale=${lang}`;
  // Explicit dimensions/type matter: Slack, Discord and LinkedIn frequently
  // skip the large image preview when og:image has no width/height, and Twitter
  // needs summary_large_image to render the 1200×630 card instead of a thumbnail.
  const ogImage = {
    url: ogImageUrl,
    width: 1200,
    height: 630,
    type: "image/png",
    alt: `${localizedName} | Pantheon`,
  };

  return {
    title: `${localizedName} Biography | Pantheon`,
    description,
    openGraph: {
      type: "profile",
      siteName: "Pantheon",
      url: buildCanonical(locale, `/profile/person/${id}`),
      images: [ogImage, ...previousImages],
      description,
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
      description,
    },
    alternates: {
      canonical: buildCanonical(locale, `/profile/person/${id}`),
      languages: buildLanguageAlternates(`/profile/person/${id}`),
    },
  };
}

export default async function Page(props) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const {id, locale} = params;
  // Extract locale and calculate yesterday's date
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  // Calculate yesterday's date using same pattern as wikiTrends (New York timezone)
  const now = new Date();
  const easternNow = new Date(
    now.toLocaleString("en-US", {timeZone: "America/New_York"}),
  );
  easternNow.setDate(easternNow.getDate() - 1);
  const yesterday = `${easternNow.getFullYear()}-${String(
    easternNow.getMonth() + 1,
  ).padStart(2, "0")}-${String(easternNow.getDate()).padStart(2, "0")}`;

  const personData = getPerson(id, lang);
  const personRanksData = getPersonRanks(id);
  const personTrendingData = getPersonTrending(id, lang, yesterday);

  const [person, personRanks, personTrending] = await Promise.all([
    personData,
    personRanksData,
    personTrendingData,
  ]);

  if (!person) {
    return notFound();
  }

  const [pageViews, memMetricsData] = await Promise.all([
    getPageViews(person.id, lang),
    Promise.all([
      getOccupationPageviews(person.occupation?.id),
      getRolling12MonthViews(person.id),
    ]).then(([occupationData, totalViews]) => ({
      occupationData,
      totalViews,
    })),
  ]);

  // Get localized name from translations column, fallback to English name
  const localizedName = person.translations?.[lang] || person.name;

  // Get localized occupation from translations column, fallback to English occupation
  const localizedOccupation =
    person.occupation?.[`${lang}_occupation`] || person.occupation?.occupation;

  // Get localized country fields from translations column
  const localizedCountry =
    person.bplace_country?.[`${lang}_country`] ||
    person.bplace_country?.country;
  const localizedDemonym =
    person.bplace_country?.[`${lang}_demonym`] ||
    person.bplace_country?.demonym;
  const localizedNationalityAdj =
    person.bplace_country?.[`${lang}_nationality_adj`] ||
    person.bplace_country?.nationality_adj_plural_m;
  const localizedFromCountry = person.bplace_country?.[`${lang}_from_country`];

  // Create localized person object to avoid repetition
  const localizedPerson = {
    ...person,
    name: localizedName,
    occupation: {...person.occupation, occupation: localizedOccupation},
    bplace_country: person.bplace_country
      ? {
          ...person.bplace_country,
          country: localizedCountry,
          demonym: localizedDemonym,
          nationalityAdj: localizedNationalityAdj,
          fromCountry: localizedFromCountry,
        }
      : null,
  };

  // const newsArticlesData = getNewsArticles(person.id);
  // const tweetsData = getTweets(person.id);

  let movies = [];
  if (person.occupation && ["ACTOR", "COMEDIAN", "FILM DIRECTOR"].includes(person.occupation.id)) {
    movies = await getMovies(person.id);
  }

  let books = [];
  if (person.occupation && ["WRITER"].includes(person.occupation.id)) {
    books = await getBooks(person.id);
  }

  const sections = [
    {
      title: "Memorability Metrics",
      slug: "metrics",
      content: (
        <MemMetrics
          person={localizedPerson}
          personRanks={personRanks}
          occupationData={memMetricsData.occupationData}
          totalViews={memMetricsData.totalViews}
        />
      ),
    },
    {
      title: "Trending Activity",
      slug: "trending_heatmap",
      content: (
        <TrendingHeatmap personSlug={id} lang={lang} />
      ),
    },
    // {
    //   title: "In the news",
    //   slug: "news_articles",
    //   content: <News newsArticles={newsArticles} />,
    // },
    {
      title: "Notable Works",
      slug: "books",
      content: <Books person={localizedPerson} books={books} />,
    },
    {
      title: `Page views of ${localizedName} by language`,
      slug: "page-views-by-lang",
      content: <PageViewsByLang person={localizedPerson} />,
    },
    {
      title: `Among ${plural(localizedOccupation || "People")}`,
      slug: "occupation_peers",
      content: (
        <OccupationRanking person={localizedPerson} personRanks={personRanks} />
      ),
    },
    {
      title: "Contemporaries",
      slug: "year_peers",
      content: (
        <YearRanking person={localizedPerson} personRanks={personRanks} />
      ),
    },
    {
      title: `In ${localizedCountry}`,
      slug: "country_peers",
      content: (
        <CountryRanking person={localizedPerson} personRanks={personRanks} />
      ),
    },
    {
      title: `Among ${plural(localizedOccupation || "People")} In ${localizedCountry}`,
      slug: "country_occupation_peers",
      content: (
        <CountryOccupationRanking
          person={localizedPerson}
          personRanks={personRanks}
        />
      ),
    },
    // {
    //   title: "Twitter Activity",
    //   slug: "twitter",
    //   content: <Twitter person={person} twitterData={twitterData} />,
    // },
    {
      title:
        person.occupation?.id === "FILM DIRECTOR"
          ? "Filmography"
          : "Television and Movie Roles",
      slug: "movies",
      content: <Movies person={localizedPerson} movies={movies} />,
    },
  ];

  if (personTrending.isTrending) {
    sections.unshift({
      title: "Trending",
      slug: "why_trending",
      content: (
        <WhyTrending
          person={localizedPerson}
          trendingData={personTrending}
          currentLang={lang}
        />
      ),
    });
  }

  const filteredSection = sections.filter(section => {
    // if (section.slug === "news_articles" && !newsArticles.length) {
    //   return false;
    // }
    // if (section.slug === "twitter" && !twitterData?.timeline?.length) {
    //   return false;
    // }
    if (section.slug === "movies" && !movies.length) {
      return false;
    }
    if (section.slug === "books" && !books.length) {
      return false;
    }
    return true;
  });

  return (
    <div className="person">
      <GoogleAdSenseScript />
      <Header
        person={localizedPerson}
        trendingData={personTrending}
        currentLang={lang}
        pageViews={pageViews}
      />
      <div className="about-section">
        <ProfileNav sections={filteredSection} />
        <Intro
          person={localizedPerson}
          personRanks={personRanks}
          ranklessUrl={rankless[person.id]}
          lang={lang}
        />
      </div>
      {filteredSection.slice(0, 3).map((section, key) =>
        cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        }),
      )}

      <section className="profile-section" style={{textAlign: "center"}}>
        {/* Adsense Ad after the first section */}
        <GoogleAdSense
          adClient="ca-pub-1706971377772539"
          adSlot="4694641051"
          adFormat="auto"
          fullWidthResponsive={true}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "792px",
            height: "120px",
            margin: "0 0 40px",
          }}
        />
      </section>

      {filteredSection.slice(3).map((section, key) =>
        cloneElement(section.content, {
          key: key + 2, // +2 to keep unique keys
          id: key + 2,
          slug: section.slug,
          title: section.title,
        }),
      )}
      <Footer person={localizedPerson} personRanks={personRanks} />
    </div>
  );
}
