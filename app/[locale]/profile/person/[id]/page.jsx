import {cloneElement} from "react";
import {notFound} from "next/navigation";
import {plural} from "pluralize";
import ProfileNav from "/components/common/Nav";
import Intro from "/components/person/Intro";
import Header from "/components/person/Header";
import MemMetrics from "/components/person/MemMetrics";
import PageViewsByLang from "/components/person/PageViewsByLang";
import OccupationRanking from "/components/person/OccupationRanking";
import YearRanking from "/components/person/YearRanking";
import CountryRanking from "/components/person/CountryRanking";
import CountryOccupationRanking from "/components/person/CountryOccupationRanking";
import Books from "/components/person/Books";
import News from "/components/person/News";
//  Twitter from "/components/person/tter";
import Movies from "/components/person/Movies";
import WhyTrending from "/components/person/WhyTrending";
import Footer from "/components/person/Footer";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import GoogleAdSense from "/components/common/GoogleAdSense";
import GoogleAdSenseScript from "/components/common/GoogleAdSenseScript";
import rankless from "/data/rankless.json";

async function getPerson(id, lang = "en") {
  const res = await fetch(
    `${BASE_API}/person?slug=eq.${id}&select=occupation(*,${lang}_occupation:translations->${lang}->>occupation),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),translations,*`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );

  // Clone the response to check the body for the no rows message
  const clonedRes = res.clone();

  // Attempt to parse the cloned response as JSON to inspect the message
  const data = await clonedRes.json().catch(() => null);

  // Check if the specific message exists in the response
  if (data && data.details && data.details.includes("Results contain 0 rows")) {
    return null;
  }

  const jsonData = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(jsonData) && jsonData.length > 0 ? jsonData[0] : null;
}

async function getPersonRanks(id) {
  const res = await fetch(`${BASE_API}/person_ranks?slug=eq.${id}`, {
    method: "GET",
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getWikiExtract(personSlug, localizedName, lang = "en") {
  const headers = {
    "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
  };
  const revalidate = {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}};

  // For English, use the slug directly
  if (lang === "en") {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url&exsentences=4&explaintext&exsectionformat=wiki&exintro&titles=${encodeURIComponent(
        personSlug
      )}&format=json&exlimit=1&origin=*`,
      {headers, ...revalidate}
    );
    return res.json();
  }

  // Step 1: Get langlink from English Wikipedia to target language
  const langLinkRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      personSlug
    )}&prop=langlinks&lllimit=500&llprop=url&lllang=${lang}&format=json&origin=*`,
    {headers, ...revalidate}
  );
  const langLinkData = await langLinkRes.json();

  // Extract the langlink URL and title
  let targetTitle = null;
  let targetUrl = null;

  if (langLinkData.query && langLinkData.query.pages) {
    const pageId = Object.keys(langLinkData.query.pages)[0];
    const page = langLinkData.query.pages[pageId];

    if (page.langlinks && page.langlinks.length > 0) {
      const langLink = page.langlinks[0];
      targetTitle = langLink["*"];
      targetUrl = langLink.url;
    }
  }

  // If no langlink found, fall back to using the slug or localized name
  if (!targetTitle) {
    targetTitle = localizedName || personSlug.replace(/_/g, " ");
  }

  // Step 2: Get extract from target language Wikipedia
  const extractRes = await fetch(
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url&exsentences=4&explaintext&exsectionformat=wiki&exintro&titles=${encodeURIComponent(
      targetTitle
    )}&format=json&exlimit=1&origin=*`,
    {headers, ...revalidate}
  );
  const extractData = await extractRes.json();

  // If we got a URL from langlinks, inject it into the extract data
  if (targetUrl && extractData.query && extractData.query.pages) {
    const pageId = Object.keys(extractData.query.pages)[0];
    if (extractData.query.pages[pageId]) {
      extractData.query.pages[pageId].fullurl = targetUrl;
    }
  }

  return extractData;
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
  const res = await fetch(`${process.env.URL}/api/books?id=${personId}`, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
  return res.json();
}

async function getMovies(personId) {
  const res = await fetch(`${process.env.URL}/api/movies?id=${personId}`, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
  return res.json();
}

async function getPersonTrending(slug, userLang, date) {
  const baseApi = process.env.BASE_API || "https://api.pantheon.world";

  // Fetch trending records across all languages (top 12 only)
  const trendRecords = await fetch(
    `${baseApi}/trend?slug=eq.${slug}&rank_pantheon=lte.12&date=eq.${date}`,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}}
  )
    .then(r => r.json())
    .catch(() => []);

  // Build ranksByLang map
  const ranksByLang = trendRecords.reduce((acc, record) => {
    acc[record.lang] = record.rank_pantheon;
    return acc;
  }, {});

  // Fetch localized reason
  const reasonRecords = await fetch(
    `${baseApi}/trend_news?slug=eq.${slug}&lang=eq.${userLang}&date=eq.${date}`,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}}
  )
    .then(r => r.json())
    .catch(() => []);

  return {
    isTrending: trendRecords.length > 0,
    languages: trendRecords.map(r => r.lang),
    ranksByLang,
    trendingReason: reasonRecords[0]?.reason || null,
    llmMetadata: reasonRecords[0]?.llm_metadata || null,
    localizedName: reasonRecords[0]?.title || null,
  };
}

async function getPageViews(slug, lang = "en") {
  const baseApi = process.env.BASE_API || "https://api.pantheon.world";

  const pageviews = await fetch(
    `${baseApi}/pageviews?lang=eq.${lang}&slug=eq.${slug}&select=date,views&order=date.asc`,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}
  )
    .then(r => r.json())
    .catch(() => []);

  return Array.isArray(pageviews) ? pageviews : [];
}

export async function generateMetadata({params}, parent) {
  // read route params
  const id = params.id;
  const locale = params.locale || DEFAULT_LOCALE;

  // fetch data
  const person = await getPerson(id, locale);

  if (!person) {
    return {
      title: "Not found",
    };
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  // Get localized name for metadata
  const localizedName = person.translations?.[params.locale] || person.name;

  return {
    title: `${localizedName} Biography | Pantheon`,
    openGraph: {
      images: [
        `https://pantheon.world/api/screenshot/person?id=${person.id}&locale=${params.locale}`,
        ...previousImages,
      ],
    },
  };
}

export default async function Page({params: {id, locale}}) {
  // Extract locale and calculate yesterday's date
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  // Calculate yesterday's date using same pattern as wikiTrends (New York timezone)
  const now = new Date();
  const easternNow = new Date(
    now.toLocaleString("en-US", {timeZone: "America/New_York"})
  );
  easternNow.setDate(easternNow.getDate() - 1);
  const yesterday = `${easternNow.getFullYear()}-${String(
    easternNow.getMonth() + 1
  ).padStart(2, "0")}-${String(easternNow.getDate()).padStart(2, "0")}`;

  const personData = getPerson(id, lang);
  const personRanksData = getPersonRanks(id);
  const personTrendingData = getPersonTrending(id, lang, yesterday);
  const pageViewsData = getPageViews(id, lang);

  const [person, personRanks, personTrending, pageViews] = await Promise.all([
    personData,
    personRanksData,
    personTrendingData,
    pageViewsData,
  ]);

  console.log(`PageViews data for ${id} (${lang}):`, {
    count: pageViews?.length || 0,
    first: pageViews?.[0],
    last: pageViews?.[pageViews.length - 1]
  });

  if (!person) {
    return notFound();
  }

  // Get localized name from translations column, fallback to English name
  const localizedName = person.translations?.[lang] || person.name;

  // Get localized occupation from translations column, fallback to English occupation
  const localizedOccupation =
    person.occupation?.[`${lang}_occupation`] || person.occupation?.occupation;

  const wikiExtractData = getWikiExtract(person.slug, localizedName, lang);
  // const newsArticlesData = getNewsArticles(person.id);
  // const tweetsData = getTweets(person.id);

  const [wikiExtract] = await Promise.all([wikiExtractData]);

  let movies = [];
  if (["ACTOR", "COMEDIAN", "FILM DIRECTOR"].includes(person.occupation.id)) {
    movies = await getMovies(person.id);
  }

  let books = [];
  if (["WRITER"].includes(person.occupation.id)) {
    books = await getBooks(person.id);
  }

  const sections = [
    {
      title: "Memorability Metrics",
      slug: "metrics",
      content: (
        <MemMetrics
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          personRanks={personRanks}
        />
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
      content: (
        <Books
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          books={books}
        />
      ),
    },
    {
      title: `Page views of ${localizedName} by language`,
      slug: "page-views-by-lang",
      content: (
        <PageViewsByLang
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
        />
      ),
    },
    {
      title: `Among ${plural(localizedOccupation)}`,
      slug: "occupation_peers",
      content: (
        <OccupationRanking
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          personRanks={personRanks}
        />
      ),
    },
    {
      title: "Contemporaries",
      slug: "year_peers",
      content: (
        <YearRanking
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          personRanks={personRanks}
        />
      ),
    },
    {
      title: `In ${person?.bplace_country?.country}`,
      slug: "country_peers",
      content: (
        <CountryRanking
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          personRanks={personRanks}
        />
      ),
    },
    {
      title: `Among ${plural(localizedOccupation)} In ${
        person?.bplace_country?.country
      }`,
      slug: "country_occupation_peers",
      content: (
        <CountryOccupationRanking
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
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
        person.occupation.id === "FILM DIRECTOR"
          ? "Filmography"
          : "Television and Movie Roles",
      slug: "movies",
      content: (
        <Movies
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          movies={movies}
        />
      ),
    },
  ];

  if (personTrending.isTrending) {
    sections.unshift({
      title: "Trending",
      slug: "why_trending",
      content: (
        <WhyTrending
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
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
        person={{
          ...person,
          name: localizedName,
          occupation: {...person.occupation, occupation: localizedOccupation},
        }}
        trendingData={personTrending}
        currentLang={lang}
        pageViews={pageViews}
      />
      <div className="about-section">
        <ProfileNav sections={filteredSection} />
        <Intro
          person={{
            ...person,
            name: localizedName,
            occupation: {...person.occupation, occupation: localizedOccupation},
          }}
          personRanks={personRanks}
          wikiExtract={wikiExtract}
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
        })
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
        })
      )}
      <Footer
        person={{
          ...person,
          name: localizedName,
          occupation: {...person.occupation, occupation: localizedOccupation},
        }}
        personRanks={personRanks}
      />
    </div>
  );
}
