import Link from "next/link";
import {REVALIDATE_PERIODS, BASE_API} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import {safeFetchJson} from "/app/utils/safeFetch";
import {buildLanguageAlternates} from "/app/utils/hreflang";
import OccupationList from "/components/occupation/OccupationList";
import "/components/occupation/SelectOccupation.css";

async function getOccupations() {
  const url = `${BASE_API}/occupation?select=id,occupation,occupation_slug,domain,domain_slug,num_born,translations&order=num_born.desc.nullslast`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

export async function generateMetadata(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const so = t.selectOccupation;

  const title = `${so.heading} | Pantheon`;
  const description = so.metaDescription;

  return {
    title,
    description,
    keywords: "occupations, professions, notable people by occupation, historical professions, famous people occupations, pantheon",
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
      canonical: `https://pantheon.world/${locale}/profile/occupation`,
      languages: buildLanguageAlternates("/profile/occupation"),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const so = t.selectOccupation;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  const occupations = await getOccupations();

  // Add localized name from translations
  const occupationsWithNames = occupations.map(occ => ({
    ...occ,
    localName: occ.translations?.[locale]?.occupation || occ.translations?.en?.occupation || occ.occupation,
  }));

  const totalPeople = occupations.reduce((sum, o) => sum + (o.num_born || 0), 0);

  return (
    <div className="select-occupation-page">
      {/* Hero Section */}
      <section className="so-hero">
        <div className="so-hero-content">
          <div className="so-stats">
            <span className="so-stat">
              <strong>{occupations.length}</strong> {so.totalOccupations}
            </span>
            <span className="so-stat-divider" aria-hidden="true" />
            <span className="so-stat">
              <strong>{totalPeople.toLocaleString(locale)}</strong> {so.totalPeople}
            </span>
          </div>

          <h1 className="so-title">{so.heading}</h1>
          <p className="so-subtitle">{so.subtitle}</p>
        </div>
      </section>

      {/* Occupation Grid */}
      <section className="so-section">
        <div className="so-container">
          <OccupationList
            occupations={occupationsWithNames}
            localePrefix={localePrefix}
            locale={locale}
            labels={{
              occupationList: so.occupationList,
              sortAlpha: so.sortAlpha,
              sortPeople: so.sortPeople,
              people: so.people,
            }}
          />
        </div>
      </section>

      {/* Explore More Links */}
      <section className="so-section so-section-explore">
        <div className="so-container">
          <h2 className="so-section-title">{so.exploreMore}</h2>
          <div className="so-explore-links">
            <Link href={`${localePrefix}/profile/person`} className="so-explore-card">
              <span className="so-explore-label">{so.byPerson}</span>
            </Link>
            <Link href={`${localePrefix}/profile/country`} className="so-explore-card">
              <span className="so-explore-label">{so.byCountry}</span>
            </Link>
            <Link href={`${localePrefix}/rankings`} className="so-explore-card">
              <span className="so-explore-label">{so.rankings}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
