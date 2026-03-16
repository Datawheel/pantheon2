import Link from "next/link";
import {REVALIDATE_PERIODS, BASE_API} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import {safeFetchJson} from "/app/utils/safeFetch";
import PlaceBubbleMap from "/components/place/PlaceBubbleMap";
import PlaceList from "/components/place/PlaceList";
import "/components/place/SelectPlace.css";

async function getTopPlaces() {
  const url = `${BASE_API}/place?select=id,place,slug,lat,lon,num_born,country:country(id,country,slug)&order=num_born.desc.nullslast&limit=1000&num_born=gt.0`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getTotalPlaceCount() {
  const url = `${BASE_API}/place?select=id&limit=1&num_born=gt.0`;
  const res = await fetch(url, {
    headers: {Prefer: "count=estimated", Range: "0-0"},
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
  const count = res.headers.get("content-range");
  return count ? parseInt(count.split("/")[1]) : 30000;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const sp = t.selectPlace;

  const title = `${sp.heading} | Pantheon`;
  const description = sp.metaDescription;

  return {
    title,
    description,
    keywords: "birthplaces, cities, notable people by city, historical birthplaces, famous people birthplace, pantheon",
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
      canonical: `https://pantheon.world/${locale}/profile/place`,
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);
  const sp = t.selectPlace;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  const [places, totalPlaceCount] = await Promise.all([
    getTopPlaces(),
    getTotalPlaceCount(),
  ]);

  const totalPeople = places.reduce((sum, p) => sum + (p.num_born || 0), 0);

  return (
    <div className="select-place-page">
      {/* Hero Section */}
      <section className="sp-place-hero">
        <div className="sp-place-hero-content">
          <div className="sp-place-stats">
            <span className="sp-place-stat">
              <strong>{totalPlaceCount.toLocaleString(locale)}</strong> {sp.totalPlaces}
            </span>
            <span className="sp-place-stat-divider" aria-hidden="true" />
            <span className="sp-place-stat">
              <strong>{totalPeople.toLocaleString(locale)}</strong> {sp.totalPeople}
            </span>
          </div>

          <h1 className="sp-place-title">{sp.heading}</h1>
          <p className="sp-place-subtitle">{sp.subtitle}</p>
        </div>
      </section>

      {/* Interactive Bubble Map */}
      <section className="sp-place-section">
        <div className="sp-place-container">
          <h2 className="sp-section-title">{sp.mapTitle}</h2>
          <PlaceBubbleMap
            places={places}
            locale={locale}
            hoverLabel={sp.people}
          />
        </div>
      </section>

      {/* Place List */}
      <section className="sp-place-section sp-place-section-alt">
        <div className="sp-place-container">
          <PlaceList
            places={places}
            localePrefix={localePrefix}
            locale={locale}
            labels={{
              placeList: sp.placeList,
              sortAlpha: sp.sortAlpha,
              sortPeople: sp.sortPeople,
              groupByCountry: sp.groupByCountry,
              people: sp.people,
            }}
          />
        </div>
      </section>

      {/* Explore More Links */}
      <section className="sp-place-section sp-place-section-explore">
        <div className="sp-place-container">
          <h2 className="sp-section-title">{sp.exploreMore}</h2>
          <div className="sp-explore-links">
            <Link href={`${localePrefix}/profile/person`} className="sp-explore-card">
              <span className="sp-explore-label">{sp.byPerson}</span>
            </Link>
            <Link href={`${localePrefix}/profile/country`} className="sp-explore-card">
              <span className="sp-explore-label">{sp.byCountry}</span>
            </Link>
            <Link href={`${localePrefix}/rankings`} className="sp-explore-card">
              <span className="sp-explore-label">{sp.rankings}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
