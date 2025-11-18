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
import GoogleAdSense from "/components/common/GoogleAdSense";
import GoogleAdSenseScript from "/components/common/GoogleAdSenseScript";
import rankless from "/data/rankless.json";

async function getPerson(id) {
  const res = await fetch(
    `${BASE_API}/person?slug=eq.${id}&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*`,
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

async function getWikiExtract(personId) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&explaintext&exsectionformat=wiki&exintro&pageids=${personId}&format=json&exlimit=1&origin=*`,
    {
      headers: {
        'User-Agent': 'Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)'
      },
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
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

async function getIsTrending(slug) {
  const res = await fetch(`${process.env.URL}/api/isTrending?slug=${slug}`);
  return res.json();
}

export async function generateMetadata({params}, parent) {
  // read route params
  const id = params.id;

  // fetch data
  const person = await getPerson(id);

  if (!person) {
    return {
      title: "Not found",
    };
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${person.name} Biography | Pantheon`,
    openGraph: {
      images: [
        `https://pantheon.world/api/screenshot/person?id=${person.id}`,
        ...previousImages,
      ],
    },
  };
}

export default async function Page({params: {id}}) {
  const personData = getPerson(id);
  const personRanksData = getPersonRanks(id);
  const isTrendingData = getIsTrending(id);

  const [person, personRanks, isTrending] = await Promise.all([
    personData,
    personRanksData,
    isTrendingData,
  ]);

  if (!person) {
    return notFound();
  }

  const wikiExtractData = getWikiExtract(person.id);
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
      content: <MemMetrics person={person} personRanks={personRanks} />,
    },
    // {
    //   title: "In the news",
    //   slug: "news_articles",
    //   content: <News newsArticles={newsArticles} />,
    // },
    {
      title: "Notable Works",
      slug: "books",
      content: <Books person={person} books={books} />,
    },
    {
      title: `Page views of ${person.name} by language`,
      slug: "page-views-by-lang",
      content: <PageViewsByLang person={person} />,
    },
    {
      title: `Among ${plural(person.occupation.occupation)}`,
      slug: "occupation_peers",
      content: <OccupationRanking person={person} personRanks={personRanks} />,
    },
    {
      title: "Contemporaries",
      slug: "year_peers",
      content: <YearRanking person={person} personRanks={personRanks} />,
    },
    {
      title: `In ${person?.bplace_country?.country}`,
      slug: "country_peers",
      content: <CountryRanking person={person} personRanks={personRanks} />,
    },
    {
      title: `Among ${plural(person.occupation.occupation)} In ${
        person?.bplace_country?.country
      }`,
      slug: "country_occupation_peers",
      content: (
        <CountryOccupationRanking person={person} personRanks={personRanks} />
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
      content: <Movies person={person} movies={movies} />,
    },
  ];

  if (isTrending.isTrending) {
    sections.unshift({
      title: "Trending",
      slug: "why_trending",
      content: <WhyTrending person={person} isTrending={isTrending} />,
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
      <Header person={person} />
      <div className="about-section">
        <ProfileNav sections={filteredSection} />
        <Intro
          person={person}
          personRanks={personRanks}
          wikiExtract={wikiExtract}
          ranklessUrl={rankless[person.id]}
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
      <Footer person={person} personRanks={personRanks} />
    </div>
  );
}
