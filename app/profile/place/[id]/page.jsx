import ProfileNav from "../../../../components/common/Nav";
import Intro from "../../../../components/place/Intro";
import Header from "../../../../components/place/Header";
import PeopleRanking from "../../../../components/place/sections/PeopleRanking";
import Occupations from "../../../../components/place/sections/Occupations";
import Places from "../../../../components/place/sections/Places";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../../../../components/utils/consts";
import OccupationTrends from "../../../../components/place/sections/OccupationTrends";
import Lifespans from "../../../../components/place/sections/Lifespans";

async function getPlace(id) {
  const res = await fetch(`https://api.pantheon.world/place?slug=eq.${id}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.pgrst.object+json",
    },
  });
  return res.json();
}

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast"
  );
  return res.json();
}

async function getCountry(countryId) {
  const res = await fetch(
    `https://api.pantheon.world/country?id=eq.${countryId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );
  return res.json();
}

async function getPlaceRanks(placeRankLow, placeRankHigh) {
  const res = await fetch(
    `https://api.pantheon.world/place?born_rank_unique=gte.${placeRankLow}&born_rank_unique=lte.${placeRankHigh}&order=born_rank_unique`
  );
  return res.json();
}

async function getPeopleBornHere(placeId) {
  const res = await fetch(
    `https://api.pantheon.world/person?bplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,name,slug,id,hpi,hpi_prev,gender,birthyear,deathyear,alive`
  );
  return res.json();
}

async function getPeopleDiedHere(placeId) {
  const res = await fetch(
    `https://api.pantheon.world/person?dplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,name,slug,id,hpi,hpi_prev,gender,birthyear,deathyear,alive`
  );
  return res.json();
}

export default async function Page({ params: { id } }) {
  const [place, occupations] = await Promise.all([
    getPlace(id),
    getOccupations(),
  ]);
  const country = await getCountry(place.country);
  const placeRankLow = Math.max(
    1,
    parseInt(place.born_rank_unique, 10) - NUM_RANKINGS_PRE
  );
  const placeRankHigh = Math.max(
    NUM_RANKINGS,
    parseInt(place.born_rank_unique, 10) + NUM_RANKINGS_POST
  );
  const placeRanks = await getPlaceRanks(placeRankLow, placeRankHigh);

  let [peopleBornHere, peopleDiedHere] = await Promise.all([
    getPeopleBornHere(place.id),
    getPeopleDiedHere(place.id),
  ]);
  // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // we calculate and add them...
  peopleBornHere =
    !peopleBornHere ||
    peopleBornHere
      .sort((personA, personB) => personB.hpi - personA.hpi)
      .map((d, i) => ({ ...d, bplace_name_rank: i + 1 }));
  peopleDiedHere =
    !peopleDiedHere ||
    peopleDiedHere
      .sort((personA, personB) => personB.hpi - personA.hpi)
      .map((d, i) => ({ ...d, dplace_name_rank: i + 1 }));

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  const sections = [
    {
      slug: "people",
      title: "People",
      content: (
        <PeopleRanking
          country={country}
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "occupations",
      title: "Occupations",
      content: (
        <Occupations
          attrs={attrs}
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "occupational-trends",
      title: "Occupational Trends",
      content: (
        <OccupationTrends
          attrs={attrs}
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
          occupations={occupations}
        />
      ),
    },
    {
      slug: "places",
      title: "Places",
      content: (
        <Places
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "overlapping-lives",
      title: "Overlapping Lives",
      content: (
        <Lifespans attrs={attrs} place={place} peopleBorn={peopleBornHere} />
      ),
    },
    // {slug: "living-people", title: "Living People"}
  ];

  return (
    <div className="person">
      <Header place={place} country={country} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro place={place} country={country} placeRanks={placeRanks} />
      </div>
      {sections.map((section, key) =>
        React.cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        })
      )}
    </div>
  );
}
