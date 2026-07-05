import Link from "next/link";
import Image from "next/image";
import {plural} from "pluralize";
import OccupationCountrySelector from "@/components/occupation-country/OccupationCountrySelector";
import TrendingSection from "@/components/occupation-country/TrendingSection";
import {toTitleCase} from "@/components/utils/vizHelpers";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {safeFetchArrayPaged, safeFetchJson} from "@/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {getTranslations} from "@/app/translations";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import "../../../../components/occupation-country/SelectOccupationCountry.css";

async function getOccupations(lang) {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast&select=*,${lang}_occupation:translations->${lang}->>occupation`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getCountries(lang) {
  // Only these columns are consumed here; select=* dragged in translations
  // and pushed the cached entry over Next's 2MB data-cache limit.
  const url = `${BASE_API}/country?order=country.asc&select=id,slug,country,demonym,continent,${lang}_country:translations->${lang}->>country,${lang}_demonym:translations->${lang}->>demonym`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getAllCombinations(lang) {
  // Fetch all occupation-country combinations with at least 1 person.
  // Only num_people plus the embedded names are consumed here; select=* pushed
  // the response to ~3.8MB, past Next's 2MB data-cache limit, so it was
  // re-fetched from PostgREST on every request.
  const url = `${BASE_API}/occupation_country?num_people=gte.1&order=num_people.desc,occupation.asc,country.asc&select=num_people,occupation_data:occupation!occupation(occupation_slug,occupation,${lang}_occupation:translations->${lang}->>occupation),country_data:country!country(slug,country,demonym,${lang}_country:translations->${lang}->>country,${lang}_demonym:translations->${lang}->>demonym)`;
  return await safeFetchArrayPaged(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    4000,
  );
}

async function getTopOccupationsByRca(lang) {
  // Fetch top 5 occupations per country ranked by RCA (revealed comparative advantage)
  const url = `${BASE_API}/rpc/top_occupations_by_rca_per_country?p_limit=5`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getTrendingPages(lang = "en") {
  // Fetch top 16 trending occupation-country pages from trend_gsc table
  // Only include entries from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `${BASE_API}/trend_gsc?lang=eq.${lang}&page_type=eq.occupation_country&run_at=gte.${sevenDaysAgo}&order=trend_score.desc.nullslast&limit=20&select=page_url,trend_score,reason,reason_summary,clicks_curr,impr_curr`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.SHORT}}, []);
}

export async function generateMetadata(props) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const baseUrl = process.env.URL || "https://pantheon.world";

  const title = `${t.selectOccupationCountry.heading} | Pantheon`;
  const description = t.selectOccupationCountry.pleaseSelect;

  return {
    title,
    description,
    keywords: "famous people by occupation and country, occupation country profiles, historical figures by profession, celebrities by nationality",
    openGraph: {
      title,
      description,
      type: "website",
      images: [`${baseUrl}/images/logos/logo_pantheon.svg`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: buildCanonical(locale, "/profile/select-occupation-country"),
      languages: buildLanguageAlternates("/profile/select-occupation-country"),
    },
  };
}

export default async function Page(props) {
  // In Next.js 14.2+, params may be a Promise
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);

  const [occupationsRaw, countriesRaw, allCombinations, trendingPagesRaw, rcaOccupations] = await Promise.all([
    getOccupations(locale),
    getCountries(locale),
    getAllCombinations(locale),
    getTrendingPages(locale),
    getTopOccupationsByRca(locale),
  ]);

  // Localize occupations
  const occupations = occupationsRaw.map(occ => ({
    ...occ,
    occupation: occ[`${locale}_occupation`] || occ.occupation,
  }));

  // Localize countries
  const countries = countriesRaw.map(country => ({
    ...country,
    country: country[`${locale}_country`] || country.country,
    demonym: country[`${locale}_demonym`] || country.demonym,
  })).filter(c => c.continent);

  // Build a lookup for localized country/demonym names from the countries list
  const countryLookup = {};
  countries.forEach(c => {
    countryLookup[c.slug] = {country: c.country, demonym: c.demonym};
  });

  // Build a lookup for localized occupation names from the occupations list
  const occupationLookup = {};
  occupations.forEach(o => {
    occupationLookup[o.occupation_slug] = o.occupation;
  });

  // Group RCA-ranked occupations by country (already limited to top 5 and ordered by RCA)
  const combinationsByCountry = {};
  rcaOccupations.forEach(row => {
    const countrySlug = row.country_slug;
    if (!countrySlug) return;

    if (!combinationsByCountry[countrySlug]) {
      const localized = countryLookup[countrySlug];
      combinationsByCountry[countrySlug] = {
        country: localized?.country || row.country,
        countrySlug,
        demonym: localized?.demonym || "",
        occupations: [],
      };
    }

    combinationsByCountry[countrySlug].occupations.push({
      occupation: occupationLookup[row.occupation_slug] || row.occupation,
      occupationSlug: row.occupation_slug,
      numPeople: row.num_people,
    });
  });

  // Group countries by first letter (alphabetically)
  const countriesByLetter = {};
  Object.values(combinationsByCountry)
    .filter(c => c.occupations.length > 0)
    .sort((a, b) => a.country.localeCompare(b.country))
    .forEach(country => {
      const firstLetter = country.country.charAt(0).toUpperCase();
      if (!countriesByLetter[firstLetter]) {
        countriesByLetter[firstLetter] = [];
      }
      countriesByLetter[firstLetter].push(country);
    });

  // Get sorted letters
  const sortedLetters = Object.keys(countriesByLetter).sort();

  // Process trending pages - filter for occupation-country combos and enrich with data
  const trendingCombos = trendingPagesRaw
    .map(trend => {
      // Parse URL like https://pantheon.world/profile/occupation/cricketer/country/sri-lanka
      const match = trend.page_url?.match(/\/profile\/occupation\/([^/]+)\/country\/([^/?#]+)/);
      if (!match) return null;

      const [, occupationSlug, countrySlug] = match;

      // Find matching combo in allCombinations for enriched data
      const combo = allCombinations.find(
        c => c.occupation_data?.occupation_slug === occupationSlug &&
             c.country_data?.slug === countrySlug
      );

      if (!combo) return null;

      return {
        occupation: combo.occupation_data?.[`${locale}_occupation`] || combo.occupation_data?.occupation,
        occupationSlug,
        country: combo.country_data?.[`${locale}_country`] || combo.country_data?.country,
        countrySlug,
        demonym: combo.country_data?.[`${locale}_demonym`] || combo.country_data?.demonym,
        numPeople: combo.num_people,
        trendScore: trend.trend_score,
        reason: trend.reason,
        reasonSummary: trend.reason_summary,
        clicks: trend.clicks_curr,
        impressions: trend.impr_curr,
      };
    })
    .filter(Boolean)
    .slice(0, 16);

  // Get popular combinations for the featured section (top 24) - fallback if no trending
  const popularCombos = allCombinations
    .slice(0, 24)
    .map(combo => ({
      occupation: combo.occupation_data?.[`${locale}_occupation`] || combo.occupation_data?.occupation,
      occupationSlug: combo.occupation_data?.occupation_slug,
      country: combo.country_data?.[`${locale}_country`] || combo.country_data?.country,
      countrySlug: combo.country_data?.slug,
      demonym: combo.country_data?.[`${locale}_demonym`] || combo.country_data?.demonym,
      numPeople: combo.num_people,
    }));

  return (
    <div className="select-occupation-country-page">
      {/* Hero Section with Selector */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{t.selectOccupationCountry.heading}</h1>
          <p className="hero-subtitle">{t.selectOccupationCountry.pleaseSelect}</p>

          <OccupationCountrySelector
            initialOccupations={occupations}
            initialCountries={countries.slice(0, 50)}
            locale={locale}
            labels={{
              selectOccupation: t.selectOccupationCountry.selectOccupation,
              selectCountry: t.selectOccupationCountry.selectCountry,
              goToProfile: t.selectOccupationCountry.goToProfile,
            }}
          />
        </div>
      </section>

      {/* Trending or Popular Combinations */}
      {trendingCombos.length > 0 ? (
        <TrendingSection
          trendingCombos={trendingCombos}
          locale={locale}
          title={t.selectOccupationCountry.trendingThisWeek || "Trending This Week"}
        />
      ) : (
        <section className="popular-section">
          <div className="section-container">
            <h2 className="section-title">{t.selectOccupationCountry.whoAreTheMostFamous}</h2>
            <div className="popular-grid">
              {popularCombos.map(combo => (
                <Link
                  key={`${combo.occupationSlug}-${combo.countrySlug}`}
                  href={`/${locale}/profile/occupation/${combo.occupationSlug}/country/${combo.countrySlug}`}
                  className="popular-card"
                >
                  <Image
                    src={`/images/icons/country/${combo.countrySlug}.svg`}
                    alt={combo.country}
                    width={24}
                    height={24}
                    className="popular-flag"
                  />
                  <span className="popular-text">
                    {locale === "en"
                      ? `${combo.demonym} ${toTitleCase(plural(combo.occupation))}`
                      : `${combo.occupation} ${combo.demonym}`}
                  </span>
                  <span className="popular-count">{combo.numPeople?.toLocaleString(locale)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Alphabet Navigation */}
      <nav className="alphabet-nav">
        <div className="section-container">
          <div className="alphabet-links">
            {sortedLetters.map(letter => (
              <a key={letter} href={`#letter-${letter}`} className="alphabet-link">
                {letter}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Browse by Country (Alphabetical) */}
      <section className="browse-section browse-alphabetical">
        <div className="section-container">
          <h2 className="section-title">
            {t.selectOccupationCountry.browseByCountry || "Browse by Country"}
          </h2>

          {sortedLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="letter-section">
              <h3 className="letter-heading">{letter}</h3>
              <div className="countries-grid">
                {countriesByLetter[letter].map(country => (
                  <div key={country.countrySlug} className="country-card">
                    <div className="country-header">
                      <Image
                        src={`/images/icons/country/${country.countrySlug}.svg`}
                        alt={country.country}
                        width={24}
                        height={24}
                        className="country-flag"
                      />
                      <span className="country-name">{country.country}</span>
                    </div>
                    <ul className="country-occupations">
                      {country.occupations.map(occ => (
                        <li key={occ.occupationSlug}>
                          <Link
                            href={`/${locale}/profile/occupation/${occ.occupationSlug}/country/${country.countrySlug}`}
                          >
                            {locale === "en"
                              ? `${country.demonym} ${toTitleCase(plural(occ.occupation))}`
                              : `${occ.occupation} ${country.demonym}`}
                            <span className="occ-count"> ({occ.numPeople?.toLocaleString(locale)})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
