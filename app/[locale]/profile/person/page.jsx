import Link from "next/link";
import {REVALIDATE_PERIODS, BASE_API} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {safeFetchJson} from "@/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import PersonImage from "@/components/utils/PersonImage";
import HomeSearch from "@/components/home/HomeSearch";
import RandomPersonButton from "@/components/person/RandomPersonButton";
import "../../../../components/person/SelectPerson.css";

const PUBLIC_API =
  process.env.NEXT_PUBLIC_BASE_API || "https://api.pantheon.world";
const PERSON_FALLBACK = "https://static.pantheon.world/icons/icon-person.svg";

async function getFeaturedPeople() {
  // Top 24 people by HPI for the hero grid
  const url = `${BASE_API}/person_ranks?select=id,name,slug,birthyear,deathyear,occupation,gender&order=hpi.desc.nullslast&limit=24`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getPeopleByDomain() {
  // Get a sample from each major occupation domain for the browse section
  const domains = [
    {
      domain: "SPORTS",
      occupations:
        "SOCCER PLAYER,BASKETBALL PLAYER,TENNIS PLAYER,CRICKET PLAYER",
    },
    {domain: "ARTS", occupations: "ACTOR,SINGER,FILM DIRECTOR,PAINTER"},
    {
      domain: "SCIENCE",
      occupations: "PHYSICIST,CHEMIST,BIOLOGIST,MATHEMATICIAN",
    },
    {
      domain: "POLITICS",
      occupations: "POLITICIAN,MILITARY PERSONNEL,NOBLEMAN,RELIGIOUS FIGURE",
    },
  ];
  const results = {};
  for (const {domain, occupations} of domains) {
    const occList = occupations
      .split(",")
      .map(o => `occupation.eq.${encodePostgrestValue(o.trim())}`)
      .join(",");
    const url = `${BASE_API}/person_ranks?or=(${occList})&select=id,name,slug,birthyear,occupation&order=hpi.desc.nullslast&limit=8`;
    results[domain] = await safeFetchJson(
      url,
      {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
      [],
    );
  }
  return results;
}

async function getRecentlyTrending(lang) {
  const baseUrl = process.env.URL || "https://pantheon.world";
  const url = `${baseUrl}/api/wikiTrends?lang=${lang}&limit=8`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT}},
    [],
  );
}

async function getTotalCount() {
  const url = `${BASE_API}/person?select=id&limit=1`;
  const res = await fetch(url, {
    headers: {Prefer: "count=estimated", Range: "0-0"},
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
  const count = res.headers.get("content-range");
  return count ? parseInt(count.split("/")[1]) : 85000;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale)
    ? params.locale
    : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const sp = t.selectPerson;

  const title = `${sp.heading} | Pantheon`;
  const description = sp.metaDescription;

  return {
    title,
    description,
    keywords:
      "famous people, historical figures, biographies, notable people, wikipedia biographies, pantheon",
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
      canonical: buildCanonical(locale, "/profile/person"),
      languages: buildLanguageAlternates("/profile/person"),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale)
    ? params.locale
    : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const sp = t.selectPerson;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  const [featuredPeople, domainPeople, trendingPeople, totalCount] =
    await Promise.all([
      getFeaturedPeople(),
      getPeopleByDomain(),
      getRecentlyTrending(locale),
      getTotalCount(),
    ]);

  const domainLabels = {
    SPORTS: sp.domainSports,
    ARTS: sp.domainArts,
    SCIENCE: sp.domainScience,
    POLITICS: sp.domainPolitics,
  };

  const domainIcons = {
    SPORTS: "/images/icons/icon-sports.svg",
    ARTS: "/images/icons/icon-arts.svg",
    SCIENCE: "/images/icons/icon-scitech.svg",
    POLITICS: "/images/icons/icon-pubfig.svg",
  };

  return (
    <div className="select-person-page">
      {/* Hero Section */}
      <section className="sp-hero">
        <div className="sp-hero-content">
          <div className="sp-stats">
            <span className="sp-stat">
              <strong>{totalCount.toLocaleString(locale)}</strong>{" "}
              {sp.statPeople}
            </span>
            <span className="sp-stat-divider" aria-hidden="true" />
            <span className="sp-stat">
              <strong>15+</strong> {sp.statLanguages}
            </span>
          </div>

          <h1 className="sp-title">{sp.heading}</h1>
          <p className="sp-subtitle">{sp.subtitle}</p>

          <div className="sp-search-row">
            <HomeSearch lang={locale} />
            <RandomPersonButton
              label={sp.randomPerson}
              locale={locale}
              totalCount={totalCount}
            />
          </div>

          <p className="sp-description">{sp.description}</p>
        </div>
      </section>

      {/* Featured People Grid */}
      <section className="sp-section">
        <div className="sp-container">
          <h2 className="sp-section-title">{sp.featuredPeople}</h2>
          <div className="sp-grid">
            {featuredPeople.map(person => (
              <Link
                key={person.id}
                href={`${localePrefix}/profile/person/${person.slug}`}
                className="sp-card"
              >
                <div className="sp-card-image">
                  <PersonImage
                    person={person}
                    src={`/profile/people/${person.id}.jpg`}
                    alt={person.name}
                    fallbackSrc={PERSON_FALLBACK}
                  />
                </div>
                <div className="sp-card-info">
                  <span className="sp-card-name">{person.name}</span>
                  <span className="sp-card-dates">
                    {person.birthyear}
                    {person.deathyear ? ` - ${person.deathyear}` : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      {trendingPeople.length > 0 && (
        <section className="sp-section sp-section-alt">
          <div className="sp-container">
            <h2 className="sp-section-title">{sp.trendingNow}</h2>
            <div className="sp-grid sp-grid-lg">
              {trendingPeople.map(person => (
                <Link
                  key={person.pid || person.id}
                  href={`${localePrefix}/profile/person/${person.slug}`}
                  className="sp-card sp-card-trending"
                >
                  <div className="sp-card-image">
                    <PersonImage
                      person={person}
                      src={`/profile/people/${person.pid || person.id}.jpg`}
                      alt={person.title || person.name}
                      fallbackSrc={PERSON_FALLBACK}
                    />
                  </div>
                  <div className="sp-card-info">
                    <span className="sp-card-name">
                      {person.title || person.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Domain */}
      <section className="sp-section">
        <div className="sp-container">
          <h2 className="sp-section-title">{sp.browseByField}</h2>
          <div className="sp-domains">
            {Object.entries(domainPeople).map(([domain, people]) => (
              <div key={domain} className="sp-domain-group">
                <h3 className="sp-domain-title">{domainLabels[domain]}</h3>
                <div className="sp-domain-list">
                  {people.map(person => (
                    <Link
                      key={person.id}
                      href={`${localePrefix}/profile/person/${person.slug}`}
                      className="sp-domain-item"
                    >
                      <div className="sp-domain-thumb">
                        <PersonImage
                          person={person}
                          src={`/profile/people/${person.id}.jpg`}
                          alt={person.name}
                          fallbackSrc={PERSON_FALLBACK}
                        />
                      </div>
                      <span className="sp-domain-name">{person.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More Links */}
      <section className="sp-section sp-section-explore">
        <div className="sp-container">
          <h2 className="sp-section-title">{sp.exploreMore}</h2>
          <div className="sp-explore-links">
            <Link
              href={`${localePrefix}/profile/select-occupation-country`}
              className="sp-explore-card"
            >
              <span className="sp-explore-label">{sp.byOccupationCountry}</span>
            </Link>
            <Link href={`${localePrefix}/rankings`} className="sp-explore-card">
              <span className="sp-explore-label">{sp.rankings}</span>
            </Link>
            <Link
              href={`${localePrefix}/profile/era`}
              className="sp-explore-card"
            >
              <span className="sp-explore-label">{sp.byEra}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
