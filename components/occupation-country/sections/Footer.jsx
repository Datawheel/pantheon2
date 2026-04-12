import {plural} from "pluralize";
import {toTitleCase} from "../../utils/vizHelpers";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import "../../common/Footer.css";

export default function Footer({
  allCountriesInOccupation,
  allOccupationsInCountry,
  locale = "en",
}) {
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};

  // Helper to get localized country name
  const getCountryName = (item) =>
    item.country_data?.[`${locale}_country`] || item.country_data?.country || item.country;

  // Helper to get localized "from country" phrase (e.g., "from Germany", "da Alemanha")
  const getFromCountry = (item) =>
    item.country_data?.[`${locale}_from_country`] ||
    `${tc.from || "from"} ${getCountryName(item)}`;

  // Helper to get localized occupation name
  const getOccupation = (item) =>
    item.occupation_data?.[`${locale}_occupation`] || item.occupation_data?.occupation || item.occupation;

  // Helper to format occupation for display (plural + title case for English)
  const formatOccupation = (occupation) =>
    locale === "en" ? toTitleCase(plural(occupation)) : occupation;

  return (
    <footer className="profile-footer">
      <div className="footer-container">
        <h4 className="footer-title">{tc.keepExploring || "Keep Exploring"}</h4>
        <ul className="footer-carousel-container">
          {allCountriesInOccupation.slice(0, 3).map(countryOccupation => {
            const countryName = getCountryName(countryOccupation);
            const fromCountry = getFromCountry(countryOccupation);
            const occupation = formatOccupation(countryOccupation.occupation);
            const countrySlug = countryOccupation.country_data?.slug || countryOccupation.country_slug;

            return (
              <li
                className="footer-carousel-item"
                key={countryOccupation.country}
              >
                <div className="footer-carousel-item-photo">
                  <a
                    aria-label={`${tc.top || "Top"} ${occupation} ${fromCountry}`}
                    href={`${localePrefix}/profile/occupation/${countryOccupation.occupation_slug}/country/${countrySlug}`}
                    style={{
                      backgroundImage: `url(https://static.pantheon.world/profile/country/${countrySlug}.jpg)`,
                    }}
                  ></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a
                    href={`${localePrefix}/profile/occupation/${countryOccupation.occupation_slug}/country/${countrySlug}`}
                  >
                    {tc.top || "Top"} {occupation}
                  </a>
                </h4>
                <p>{fromCountry}</p>
              </li>
            );
          })}
          {allOccupationsInCountry.slice(0, 3).map(occupationCountry => {
            const occupation = formatOccupation(getOccupation(occupationCountry));
            const occupationSlug = occupationCountry.occupation_data?.occupation_slug || occupationCountry.occupation_slug;
            const countrySlug = occupationCountry.country_slug;
            const countryName = occupationCountry.country;

            return (
              <li
                className="footer-carousel-item"
                key={`${occupationSlug}-${countrySlug}`}
              >
                <div className="footer-carousel-item-photo">
                  <a
                    aria-label={`${tc.top || "Top"} ${occupation}`}
                    href={`${localePrefix}/profile/occupation/${occupationSlug}/country/${countrySlug}`}
                    style={{
                      backgroundImage: `url(https://static.pantheon.world/profile/occupation/${occupationSlug}.jpg)`,
                    }}
                  ></a>
                </div>
                <h4 className="footer-carousel-item-title">
                  <a
                    href={`${localePrefix}/profile/occupation/${occupationSlug}/country/${countrySlug}`}
                  >
                    {tc.top || "Top"} {occupation}
                  </a>
                </h4>
                <p>{tc.from || "from"} {countryName}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
