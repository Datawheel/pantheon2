import { plural } from "pluralize";
import ProfileNav from "../../../../components/common/Nav";
import Section from "../../../../components/common/Section";
import Intro from "../../../../components/person/Intro";
import Header from "../../../../components/person/Header";
import MemMetrics from "../../../../components/person/MemMetrics";
import PageviewsByLang from "../../../../components/person/PageviewsByLang";

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
  return res.json();
}

async function getPersonRanks(id) {
  const res = await fetch(
    `https://api.pantheon.world/person_ranks?slug=eq.${id}`
  );
  return res.json();
}

async function getWikiPageViews(personName) {
  const wikiSlug = personName.replace(/ /g, "_");
  const dateobj = new Date();
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2"
  );
  const res = await fetch(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${wikiSlug}/monthly/20110101/${year}${month}01`
  );
  return res.json();
}

async function getWikiExtract(personId) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&explaintext&exsectionformat=wiki&exintro&pageids=${personId}&format=json&exlimit=1&origin=*`
  );
  return res.json();
}

export default async function Page({ params: { id } }) {
  const personData = getPerson(id);
  const personRanksData = getPersonRanks(id);

  const [person, personRanks] = await Promise.all([
    personData,
    personRanksData,
  ]);

  const wikiPageViewsData = getWikiPageViews(person.name);
  const wikiExtractData = getWikiExtract(person.id);

  const [wikiPageViews, wikiExtract] = await Promise.all([
    wikiPageViewsData,
    wikiExtractData,
  ]);

  const totalPageViews = wikiPageViews?.items
    ? wikiPageViews?.items.reduce((sum, d) => sum + d.views, 0)
    : 0;

  const sections = [
    {
      title: "Memorability Metrics",
      slug: "metrics",
      content: <MemMetrics pageViews={wikiPageViews} person={person} />,
    },
  ];
  sections.push({
    title: `Page views of ${plural(person.name)} by language`,
    slug: "page-views-by-lang",
    content: <PageviewsByLang person={person} />,
  });

  return (
    <div className="person">
      <Header person={person} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro
          person={person}
          personRanks={personRanks}
          totalPageViews={totalPageViews}
          wikiExtract={wikiExtract}
        />
      </div>
      {sections.map((section, key) => (
        <Section
          index={key}
          key={section.slug}
          numSections={sections.length}
          title={section.title}
          slug={section.slug}
        >
          {section.content ? section.content : null}
          {section.viz ? <div className="viz">{section.viz}</div> : null}
        </Section>
      ))}
    </div>
  );
}

// export async function getServerSideProps({ params }) {
//   let person, personRanks;
//   try {
//     const personRes = await axios.get(
//       `https://api.pantheon.world/person?slug=eq.${params.id}&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*`
//     );
//     person = await personRes.data;

//     const personRanksRes = await axios.get(
//       `https://api.pantheon.world/person_ranks?slug=eq.${params.id}`
//     );
//     personRanks = await personRanksRes.data;
//   } catch (error) {
//     console.log("Person API error", error);
//   }

//   // fetch similar in rank
//   let occupationRanks = {};
//   try {
//     const occupationRanksURL = `https://api.pantheon.world/person_ranks?occupation=eq.${person?.occupation?.id}&occupation_rank_unique=gte.${personRanks?.occupationRankLow}&occupation_rank_unique=lte.${personRanks?.occupationRankHigh}&order=occupation_rank_unique&select=occupation,bplace_country,hpi,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear`;
//     console.log("occupationRanksURL!", occupationRanksURL);
//     const occupationRanksRes = await fetch(occupationRanksURL);
//     occupationRanks = await occupationRanksRes.json();
//   } catch (error) {
//     console.log("Person API error", error);
//   }

//   return { props: { person, personRanks, occupationRanks } };
// }
