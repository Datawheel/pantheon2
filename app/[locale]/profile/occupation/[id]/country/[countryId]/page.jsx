import {plural} from "pluralize";
import Header from "/components/occupation-country/Header";
import Intro from "/components/occupation-country/Intro";
import TopTen from "/components/occupation-country/sections/TopTen";
import People from "/components/occupation-country/sections/People";
import Lifespans from "/components/occupation-country/sections/Lifespans";
import Footer from "/components/occupation-country/sections/Footer";
import {toTitleCase} from "/components/utils/vizHelpers";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";

async function getOccupations() {
  const res = await fetch(
    `${BASE_API}/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getOccupation(occupationId) {
  const res = await fetch(
    `${BASE_API}/occupation?occupation_slug=eq.${occupationId}`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch occupation: ${res.status}`);
  }

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getCountry(countryId) {
  const res = await fetch(`${BASE_API}/country?slug=eq.${countryId}`, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch country: ${res.status}`);
  }

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getAllCountriesInOccupation(occupationId) {
  const res = await fetch(
    `${BASE_API}/occupation_country?occupation=eq.${occupationId}&order=num_people.desc.nullslast`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getAllOccupationsInCountry(countryId) {
  const res = await fetch(
    `${BASE_API}/occupation_country?country=eq.${countryId}&order=num_people.desc.nullslast`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeople(occupationId, countryId) {
  const res = await fetch(
    `${BASE_API}/person?occupation=eq.${occupationId}&bplace_country=eq.${countryId}&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleHpi(occupationId, countryId) {
  const res = await fetch(
    `${BASE_API}/person_ranks?occupation=eq.${occupationId}&bplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=id,hpi,l,l_prev,non_en_page_views`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

export async function generateMetadata({params}, parent) {
  // read route params
  const {id, countryId} = params;

  // fetch data
  const occupation = await getOccupation(id);
  const country = await getCountry(countryId);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Greatest ${country.demonym} ${toTitleCase(
      plural(occupation.occupation)
    )} | Pantheon`,
    openGraph: {
      images: [
        `/api/screenshot/occupation-country?occupation=${id}&country=${country.country_code}`,
        ...previousImages,
      ],
    },
  };
}

export default async function Page({params: {id, countryId}}) {
  const [occupations, occupation, country] = await Promise.all([
    getOccupations(),
    getOccupation(id),
    getCountry(countryId),
  ]);

  const [
    allCountriesInOccupation,
    allOccupationsInCountry,
    peopleAttrs,
    peopleHpi,
  ] = await Promise.all([
    getAllCountriesInOccupation(occupation.occupation),
    getAllOccupationsInCountry(country.id),
    getPeople(occupation.id, country.id),
    getPeopleHpi(occupation.id, country.id),
  ]);

  // Merge peopleHpi data into people array
  const people = peopleAttrs
    .map(person => {
      const hpiData = peopleHpi.find(hpi => hpi.id === person.id);
      return {
        ...person,
        ...(hpiData || {}), // Spread hpiData if found, otherwise spread empty object
      };
    })
    .sort((a, b) => b.hpi - a.hpi);

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  return (
    <div className="person">
      <Header country={country} occupation={occupation} people={people} />
      <div className="about-section">
        {/* <ProfileNav sections={this.sections} /> */}
        <Intro
          country={country}
          occupation={occupation}
          allCountriesInOccupation={allCountriesInOccupation}
        />
      </div>
      <TopTen country={country} occupation={occupation} people={people} />
      <People
        country={country}
        occupation={occupation}
        people={people}
        title={"People"}
        slug={"people"}
      />
      <Lifespans
        attrs={attrs}
        people={people}
        occupation={occupation}
        slug={"overlapping-lives"}
        title={"Overlapping Lives"}
      />
      <Footer
        allCountriesInOccupation={allCountriesInOccupation}
        allOccupationsInCountry={allOccupationsInCountry}
      />
    </div>
  );
}
