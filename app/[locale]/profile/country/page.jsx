import Link from "next/link";
import {REVALIDATE_PERIODS, BASE_API} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import {safeFetchJson} from "/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "/app/utils/hreflang";
import CountryMap from "/components/country/CountryMap";
import CountryList from "/components/country/CountryList";
import "/components/country/SelectCountry.css";

async function getCountries(lang) {
  const langField = lang !== "en"
    ? `,${lang}_country:translations->${lang}->>country`
    : "";
  const url = `${BASE_API}/country?select=id,country,slug,country_code,country_num,continent,num_born${langField}&order=country.asc`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

export async function generateMetadata(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const sc = t.selectCountry;

  const title = `${sc.heading} | Pantheon`;
  const description = sc.metaDescription;

  return {
    title,
    description,
    keywords: "countries, notable people by country, biographies by country, historical figures, pantheon",
    openGraph: {
      title,
      description,
      type: "website",
      images: ["https://pantheon.world/images/logos/logo_pantheon.svg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: buildCanonical(locale, "/profile/country"),
      languages: buildLanguageAlternates("/profile/country"),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const sc = t.selectCountry;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  const allCountries = await getCountries(locale);

  // Filter to countries with a continent (real countries, not territories without data)
  const countries = allCountries.filter(c => c.continent);

  // Add localized name
  const langKey = `${locale}_country`;
  const countriesWithNames = countries.map(c => ({
    ...c,
    localName: (locale !== "en" && c[langKey]) || c.country,
  }));

  const totalPeople = countriesWithNames.reduce((sum, c) => sum + (c.num_born || 0), 0);

  // Sort alphabetically by localized name for the list
  return (
    <div className="select-country-page">
      {/* Hero Section */}
      <section className="sc-hero">
        <div className="sc-hero-content">
          <div className="sc-stats">
            <span className="sc-stat">
              <strong>{countries.length}</strong> {sc.totalCountries}
            </span>
            <span className="sc-stat-divider" aria-hidden="true" />
            <span className="sc-stat">
              <strong>{totalPeople.toLocaleString(locale)}</strong> {sc.totalPeople}
            </span>
          </div>

          <h1 className="sc-title">{sc.heading}</h1>
          <p className="sc-subtitle">{sc.subtitle}</p>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="sc-section">
        <div className="sc-container">
          <h2 className="sc-section-title">{sc.mapTitle}</h2>
          <CountryMap
            countries={countriesWithNames}
            locale={locale}
            hoverLabel={sc.people}
          />
        </div>
      </section>

      {/* All Countries List */}
      <section className="sc-section sc-section-alt">
        <div className="sc-container">
          <CountryList
            countries={countriesWithNames}
            localePrefix={localePrefix}
            locale={locale}
            labels={{
              countryList: sc.countryList,
              sortAlpha: sc.sortAlpha,
              sortPeople: sc.sortPeople,
              people: sc.people,
            }}
          />
        </div>
      </section>

      {/* Explore More Links */}
      <section className="sc-section sc-section-explore">
        <div className="sc-container">
          <h2 className="sc-section-title">{sc.exploreMore}</h2>
          <div className="sc-explore-links">
            <Link href={`${localePrefix}/profile/person`} className="sc-explore-card">
              <span className="sc-explore-label">{sc.byPerson}</span>
            </Link>
            <Link href={`${localePrefix}/profile/select-occupation-country`} className="sc-explore-card">
              <span className="sc-explore-label">{sc.byOccupation}</span>
            </Link>
            <Link href={`${localePrefix}/rankings`} className="sc-explore-card">
              <span className="sc-explore-label">{sc.rankings}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
