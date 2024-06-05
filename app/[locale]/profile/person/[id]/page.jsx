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
// import Twitter from "/components/person/Twitter";
import Movies from "/components/person/Movies";
import Footer from "/components/person/Footer";

async function getPerson(id) {
  const res = await fetch(
    `https://api.pantheon.world/person?slug=eq.${id}&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
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
  return res.json();
}

async function getPersonRanks(id) {
  const res = await fetch(
    `https://api.pantheon.world/person_ranks?slug=eq.${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
      next: {revalidate: 1440},
    }
  );
  return res.json();
}

async function getWikiPageViews(personName) {
  const wikiSlug = personName.replace(/ /g, "_");
  const dateobj = new Date();
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth()}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  const apiUrl = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${wikiSlug}/monthly/20110101/${year}${month}01`;
  try {
    const res = await fetch(apiUrl);
    // Check if the response is ok (status in the range 200-299)
    if (!res.ok)
      throw new Error("Network response for getWikiPageViews failed.");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch wiki page views (person page):", error);
    // Return a default object with items as an empty array
    return {items: []};
  }
}

async function getWikiExtract(personId) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&explaintext&exsectionformat=wiki&exintro&pageids=${personId}&format=json&exlimit=1&origin=*`
  );
  return res.json();
}

async function getNewsArticles(personId) {
  const res = await fetch(`${process.env.URL}/api/news?pid=${personId}`);
  return res.json();
}

// async function getTweets(personId) {
//   const res = await fetch(`${process.env.URL}/api/twit?pid=${personId}`);
//   return res.json();
// }

async function getBooks(personId) {
  const res = await fetch(`${process.env.URL}/api/books?id=${personId}`);
  return res.json();
}

async function getMovies(personId) {
  const res = await fetch(`${process.env.URL}/api/movies?id=${personId}`);
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

  const [person, personRanks] = await Promise.all([
    personData,
    personRanksData,
  ]);

  if (!person) {
    return notFound();
  }

  const wikiPageViewsData = getWikiPageViews(person.name);
  const wikiExtractData = getWikiExtract(person.id);
  const newsArticlesData = getNewsArticles(person.id);
  // const tweetsData = getTweets(person.id);

  const [wikiPageViews, wikiExtract, newsArticles] = await Promise.all([
    wikiPageViewsData,
    wikiExtractData,
    newsArticlesData,
  ]);

  let movies = [];
  if (["ACTOR", "COMEDIAN", "FILM DIRECTOR"].includes(person.occupation.id)) {
    movies = await getMovies(person.id);
  }

  let books = [];
  if (["WRITER"].includes(person.occupation.id)) {
    books = await getBooks(person.id);
  }

  const totalPageViews = wikiPageViews?.items
    ? wikiPageViews?.items.reduce((sum, d) => sum + d.views, 0)
    : 0;

  const sections = [
    {
      title: "Memorability Metrics",
      slug: "metrics",
      content: <MemMetrics pageViews={wikiPageViews} person={person} />,
    },
    {
      title: "In the news",
      slug: "news_articles",
      content: <News newsArticles={newsArticles} />,
    },
    {
      title: "Notable Works",
      slug: "books",
      content: <Books person={person} books={books} />,
    },
    {
      title: `Page views of ${plural(person.name)} by language`,
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

  const filteredSection = sections.filter(section => {
    if (section.slug === "news_articles" && !newsArticles.length) {
      return false;
    }
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
      <Header person={person} />
      <div className="about-section">
        <ProfileNav sections={filteredSection} />
        <Intro
          person={person}
          personRanks={personRanks}
          totalPageViews={totalPageViews}
          wikiExtract={wikiExtract}
        />
      </div>
      {filteredSection.map((section, key) =>
        cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        })
      )}
      <Footer person={person} personRanks={personRanks} />
    </div>
  );
}
