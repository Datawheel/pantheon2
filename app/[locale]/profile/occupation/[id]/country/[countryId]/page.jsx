import {plural} from "pluralize";
import Header from "/components/occupation-country/Header";
import Intro from "/components/occupation-country/Intro";
import TopTen from "/components/occupation-country/sections/TopTen";
import People from "/components/occupation-country/sections/People";
import Lifespans from "/components/occupation-country/sections/Lifespans";
import Footer from "/components/occupation-country/sections/Footer";
import {toTitleCase} from "/components/utils/vizHelpers";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";

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

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getOccupation(occupationId, lang = "en") {
  const url = `${BASE_API}/occupation?occupation_slug=eq.${occupationId}&select=*,${lang}_occupation:translations->${lang}->>occupation`;
  const data = await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getCountry(countryId, lang = "en") {
  const url = `${BASE_API}/country?slug=eq.${countryId}&select=*,${lang}_country:translations->${lang}->>country,${lang}_demonym:translations->${lang}->>demonym_m_plural,${lang}_from_country:translations->${lang}->>from_country`;
  const data = await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getAllCountriesInOccupation(occupationId, lang = "en") {
  const url = `${BASE_API}/occupation_country?occupation=eq.${occupationId}&order=num_people.desc.nullslast&select=*,country_data:country!country(slug,country,${lang}_country:translations->${lang}->>country)`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getAllOccupationsInCountry(countryId) {
  const url = `${BASE_API}/occupation_country?country=eq.${countryId}&order=num_people.desc.nullslast`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeople(occupationId, countryId) {
  const url = `${BASE_API}/person?occupation=eq.${occupationId}&bplace_country=eq.${countryId}&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleHpi(occupationId, countryId) {
  const url = `${BASE_API}/person_ranks?occupation=eq.${occupationId}&bplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,l,l_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

export async function generateMetadata({params}, parent) {
  // read route params
  const {locale, id, countryId} = params;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  // fetch data
  const occupation = await getOccupation(id, lang);
  const country = await getCountry(countryId, lang);

  // Get localized names, fallback to English
  const localizedOccupation = occupation[`${lang}_occupation`] || occupation.occupation;
  const localizedCountry = country[`${lang}_country`] || country.country;
  const localizedDemonym = country[`${lang}_demonym`] || country.demonym;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  // For English, use plural form; for other languages, use the localized occupation as-is
  const occupationDisplay = lang === "en"
    ? toTitleCase(plural(localizedOccupation))
    : localizedOccupation;

  return {
    title: `${t.occupationCountry.greatest} ${localizedDemonym} ${occupationDisplay} | Pantheon`,
    openGraph: {
      images: [
        `/api/screenshot/occupation-country?occupation=${id}&country=${country.country_code}`,
        ...previousImages,
      ],
    },
  };
}

export default async function Page({params: {locale, id, countryId}}) {
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  const [occupations, occupation, country] = await Promise.all([
    getOccupations(),
    getOccupation(id, lang),
    getCountry(countryId, lang),
  ]);

  const [
    allCountriesInOccupation,
    allOccupationsInCountry,
    peopleAttrs,
    peopleHpi,
  ] = await Promise.all([
    getAllCountriesInOccupation(occupation.occupation, lang),
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

  // Get localized names, fallback to English
  const localizedOccupation = occupation[`${lang}_occupation`] || occupation.occupation;
  const localizedCountry = country[`${lang}_country`] || country.country;
  const localizedDemonym = country[`${lang}_demonym`] || country.demonym;
  const localizedFromCountry = country[`${lang}_from_country`];

  // Create localized versions of occupation and country to pass to components
  const localizedOccupationObj = {
    ...occupation,
    occupation: localizedOccupation,
  };

  const localizedCountryObj = {
    ...country,
    country: localizedCountry,
    demonym: localizedDemonym,
    fromCountry: localizedFromCountry,
  };

  return (
    <div className="person">
      <Header
        country={localizedCountryObj}
        occupation={localizedOccupationObj}
        people={people}
        locale={lang}
      />
      <div className="about-section">
        {/* <ProfileNav sections={this.sections} /> */}
        <Intro
          country={localizedCountryObj}
          occupation={localizedOccupationObj}
          allCountriesInOccupation={allCountriesInOccupation}
          locale={lang}
        />
      </div>
      <TopTen country={localizedCountryObj} occupation={localizedOccupationObj} people={people} locale={lang} />
      <People
        country={localizedCountryObj}
        occupation={localizedOccupationObj}
        people={people}
        title={"People"}
        slug={"people"}
      />
      <Lifespans
        attrs={attrs}
        people={people}
        occupation={localizedOccupationObj}
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
