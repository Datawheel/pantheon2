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
import Insights, {buildInsights} from "@/components/person/Insights";
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
  const url = `${BASE_API}/person?slug=eq.${id}&select=*,description,occupation(id,occupation,occupation_slug,domain_slug,num_born,num_born_women,hpi_avg,${lang}_occupation:translations->${lang}->>occupation),bplace_country(slug,country,country_code,demonym,num_born,${lang}_country:translations->${lang}->>country,${lang}_demonym:translations->${lang}->>demonym,${lang}_nationality_adj:translations->${lang}->>nationality_adj_plural_m,${lang}_from_country:translations->${lang}->>from_country),bplace_geonameid(id,slug,place,num_born),dplace_geonameid(slug,place)`;
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
  const url = `${BASE_API}/person_ranks?slug=eq.${id}&select=l,l_prev,hpi,occupation_rank,occupation_rank_prev,bplace_country_rank,bplace_country_rank_prev,bplace_country_occupation_rank,occupation_rank_unique,bplace_country_rank_unique,bplace_country_occupation_rank_unique,birthyear_rank_unique,deathyear_rank_unique,bplace_country,rank,rank_unique,bplace_name,bplace_name_rank_unique,non_en_page_views`;
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

// Exact row count via PostgREST's content-range header. Uses GET (not HEAD)
// so the response lands in the Next.js data cache.
async function getPostgrestCount(query) {
  try {
    const res = await fetch(`${BASE_API}${query}`, {
      headers: {Prefer: "count=exact"},
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    });
    if (!res.ok) return null;
    const total = res.headers.get("content-range")?.split("/")[1];
    return total && total !== "*" ? Number(total) : null;
  } catch {
    return null;
  }
}

// How this person's Wikipedia language-edition count compares to occupation
// peers: what percent of them have fewer editions.
async function getLangEditionContext(occupationId, l) {
  if (!occupationId || !l) return null;
  const enc = encodePostgrestValue(occupationId);
  const [totalPeers, atOrAbove] = await Promise.all([
    getPostgrestCount(`/person_ranks?occupation=eq.${enc}&select=id&limit=1`),
    getPostgrestCount(`/person_ranks?occupation=eq.${enc}&l=gte.${l}&select=id&limit=1`),
  ]);
  if (!totalPeers || !atOrAbove || totalPeers < 30) return null;
  return {
    totalPeers,
    percentBelow: Math.floor(((totalPeers - atOrAbove) / totalPeers) * 100),
  };
}

// Highest-ranked *other* people sharing this person's birth month/day, via the
// core.born_on_day() function (already ordered by hpi desc).
async function getBirthdayTwins(person, lang = "en") {
  if (!person?.birthdate) return [];
  const [, m, d] = person.birthdate.split("-");
  if (!Number(m) || !Number(d)) return [];
  const url = `${BASE_API}/rpc/born_on_day?m=${Number(m)}&d=${Number(d)}&lang=${lang}&limit=5`;
  const rows = await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
  return rows
    .filter(r => String(r.person_id) !== String(person.id))
    .slice(0, 3);
}

// Next-most-memorable people born in the same city, ordered by the city fame
// rank (bplace_name_rank_unique) so the person themselves is rank #1. Returns
// up to 3 peers with localized names + slugs to enrich the "topCity" insight.
async function getCityPeers(placeId, excludePersonId, lang = "en") {
  if (!placeId) return [];
  const url = `${BASE_API}/person_ranks?bplace_geonameid=eq.${placeId}&order=bplace_name_rank_unique&limit=4&select=id,name,slug`;
  const rows = await safeFetchArray(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
  const peers = rows
    .filter(r => String(r.id) !== String(excludePersonId))
    .slice(0, 3);
  if (!peers.length || lang === DEFAULT_LOCALE) {
    return peers.map(p => ({name: p.name, slug: p.slug}));
  }
  // person_ranks holds only English names, so pull localized names from the
  // base person table for non-English locales.
  const ids = peers.map(p => p.id).join(",");
  const translated = await safeFetchArray(
    `${BASE_API}/person?id=in.(${ids})&select=id,translations`,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
  );
  const nameById = new Map(
    translated.map(t => [String(t.id), t.translations?.[lang]]),
  );
  return peers.map(p => ({
    name: nameById.get(String(p.id)) || p.name,
    slug: p.slug,
  }));
}

// Notable people sharing this person's birth country + occupation, from the
// occupation_country materialized view.
async function getCountryOccupationCount(countrySlug, occupationSlug) {
  const url = `${BASE_API}/occupation_country?country_slug=eq.${countrySlug}&occupation_slug=eq.${occupationSlug}&select=num_people`;
  const data = await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
  return Array.isArray(data) && data.length > 0 ? data[0].num_people : null;
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
    title: t.person.metaTitle
      ? t.person.metaTitle({name: localizedName})
      : `${localizedName} Biography | Pantheon`,
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
  const t = getTranslations(lang);

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

  const [
    pageViews,
    memMetricsData,
    birthdayTwins,
    langContext,
    birthyearCount,
    countryOccupationCount,
    earliestBornCount,
    cityPeers,
  ] = await Promise.all([
    getPageViews(person.id, lang),
    Promise.all([
      getOccupationPageviews(person.occupation?.id),
      getRolling12MonthViews(person.id),
    ]).then(([occupationData, totalViews]) => ({
      occupationData,
      totalViews,
    })),
    getBirthdayTwins(person, lang),
    getLangEditionContext(person.occupation?.id, personRanks.l),
    // Count queries only when the insight they feed can actually fire
    personRanks.birthyear_rank_unique === 1 && person.birthyear
      ? getPostgrestCount(
          `/person_ranks?birthyear=eq.${person.birthyear}&select=id&limit=1`,
        )
      : null,
    personRanks.bplace_country_occupation_rank_unique === 1 &&
    person.bplace_country?.slug &&
    person.occupation?.occupation_slug
      ? getCountryOccupationCount(
          person.bplace_country.slug,
          person.occupation.occupation_slug,
        )
      : null,
    person.birthyear && person.birthyear <= 1600 && person.occupation?.id
      ? getPostgrestCount(
          `/person_ranks?occupation=eq.${encodePostgrestValue(person.occupation.id)}&birthyear=lte.${person.birthyear}&select=id&limit=1`,
        )
      : null,
    // Only fetch hometown peers when the "topCity" insight can actually fire:
    // the person tops their city (rank #1) but not their country, and the city
    // has at least one other notable person to name.
    personRanks.bplace_name_rank_unique === 1 &&
    person.bplace_geonameid?.id &&
    person.bplace_geonameid.num_born >= 2 &&
    personRanks.bplace_country_rank_unique !== 1 &&
    personRanks.bplace_country_rank !== 1
      ? getCityPeers(person.bplace_geonameid.id, person.id, lang)
      : [],
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

  // English pluralizes occupations; other locales use the localized name as-is
  // (same convention as the occupation-country metadata).
  const occupationPlural =
    lang === "en"
      ? plural(localizedOccupation || "People")
      : localizedOccupation || "People";

  const insights = buildInsights({
    person: localizedPerson,
    personRanks,
    birthdayTwins,
    langContext,
    birthyearCount,
    countryOccupationCount,
    earliestBornCount,
    cityPeers,
    occupationPageviews: memMetricsData.occupationData,
    totalViews: memMetricsData.totalViews,
    occupationPlural,
    lang,
  });

  const sections = [
    {
      title: t.person.sections.memorabilityMetrics,
      slug: "metrics",
      content: (
        <MemMetrics
          person={localizedPerson}
          personRanks={personRanks}
          occupationData={memMetricsData.occupationData}
          totalViews={memMetricsData.totalViews}
          lang={lang}
        />
      ),
    },
    {
      title: t.person.sections.insights,
      slug: "insights",
      content: <Insights person={localizedPerson} insights={insights} />,
    },
    {
      title: t.person.sections.trendingActivity,
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
      title: t.person.sections.notableWorks,
      slug: "books",
      content: <Books person={localizedPerson} books={books} />,
    },
    {
      title: t.person.sections.pageViewsByLang({name: localizedName}),
      slug: "page-views-by-lang",
      content: <PageViewsByLang person={localizedPerson} lang={lang} />,
    },
    {
      title: t.person.sections.amongOccupation({occupationPlural}),
      slug: "occupation_peers",
      content: (
        <OccupationRanking
          person={localizedPerson}
          personRanks={personRanks}
          lang={lang}
        />
      ),
    },
    {
      title: t.person.sections.contemporaries,
      slug: "year_peers",
      content: (
        <YearRanking
          person={localizedPerson}
          personRanks={personRanks}
          lang={lang}
        />
      ),
    },
    {
      title: t.person.sections.inCountry({country: localizedCountry}),
      slug: "country_peers",
      content: (
        <CountryRanking
          person={localizedPerson}
          personRanks={personRanks}
          lang={lang}
        />
      ),
    },
    {
      title: t.person.sections.amongOccupationInCountry({
        occupationPlural,
        country: localizedCountry,
      }),
      slug: "country_occupation_peers",
      content: (
        <CountryOccupationRanking
          person={localizedPerson}
          personRanks={personRanks}
          lang={lang}
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
          ? t.person.sections.filmography
          : t.person.sections.tvMovieRoles,
      slug: "movies",
      content: <Movies person={localizedPerson} movies={movies} />,
    },
  ];

  if (personTrending.isTrending) {
    sections.unshift({
      title: t.person.sections.trending,
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
    if (section.slug === "insights" && !insights.length) {
      return false;
    }
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
      <Footer person={localizedPerson} personRanks={personRanks} lang={lang} />
    </div>
  );
}
