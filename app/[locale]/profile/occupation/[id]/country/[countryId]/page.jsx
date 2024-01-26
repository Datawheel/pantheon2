import { plural } from "pluralize";
import Header from "/components/occupation-country/Header";
import Intro from "/components/occupation-country/Intro";
import TopTen from "/components/occupation-country/Sections/TopTen";
import People from "/components/occupation-country/Sections/People";
import Lifespans from "/components/occupation-country/Sections/Lifespans";
import Footer from "/components/occupation-country/Sections/Footer";
import { toTitleCase } from "../../../../../../../components/utils/vizHelpers";

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug"
  );
  return res.json();
}

async function getOccupation(occupationId) {
  const res = await fetch(
    `https://api.pantheon.world/occupation?occupation_slug=eq.${occupationId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );
  return res.json();
}

async function getCountry(countryId) {
  const res = await fetch(
    `https://api.pantheon.world/country?slug=eq.${countryId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );
  return res.json();
}

async function getAllCountriesInOccupation(occupationId) {
  const res = await fetch(
    `https://api.pantheon.world/occupation_country?occupation=eq.${occupationId}&order=num_people.desc.nullslast`
  );
  return res.json();
}

async function getAllOccupationsInCountry(countryId) {
  const res = await fetch(
    `https://api.pantheon.world/occupation_country?country=eq.${countryId}&order=num_people.desc.nullslast`
  );
  return res.json();
}

async function getPeople(occupationId, countryId) {
  const res = await fetch(
    `https://api.pantheon.world/person?occupation=eq.${occupationId}&bplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug),occupation_id:occupation,name,slug,id,hpi,gender,birthyear,deathyear,alive,hpi_prev,l`
  );
  return res.json();
}

export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const { id, countryId } = params;

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

export default async function Page({ params: { id, countryId } }) {
  const [occupations, occupation, country] = await Promise.all([
    getOccupations(),
    getOccupation(id),
    getCountry(countryId),
  ]);

  const [allCountriesInOccupation, allOccupationsInCountry, people] =
    await Promise.all([
      getAllCountriesInOccupation(occupation.occupation),
      getAllOccupationsInCountry(country.id),
      getPeople(occupation.id, country.id),
    ]);

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
