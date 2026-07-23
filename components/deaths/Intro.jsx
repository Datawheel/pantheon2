"use client";

import AnchorList from "../utils/AnchorList";
import "../common/Intro.css";
import {useRouter} from "next/navigation";
import {DEFAULT_LOCALE} from "@/app/locales";
import {
  formatDeathsNumber,
  formatDeathsYear,
  getDeathsTranslations,
} from "@/app/deathsTranslations";

export default function Intro({
  year,
  people,
  occupation,
  country,
  lang = "en",
}) {
  const router = useRouter();
  const t = getDeathsTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const peopleSortedByHPI = [...people]
    .filter(person => {
      if (occupation) return person.occupation?.id === occupation.id;
      if (country) return person.bplace_country?.id === country.id;
      return true;
    })
    .sort((a, b) => {
      // Handle undefined HPI values to prevent NaN in sort comparison
      if (!a.hpi && !b.hpi) return 0;
      if (!a.hpi) return 1;
      if (!b.hpi) return -1;
      return b.hpi - a.hpi;
    });

  const occupationCounts = people.reduce((acc, person) => {
    if (person.occupation) {
      const occupationId = person.occupation.id;
      if (!acc[occupationId]) {
        acc[occupationId] = {
          count: 0,
          occupation: person.occupation,
        };
      }
      acc[occupationId].count++;
    }
    return acc;
  }, []);

  const countryCounts = people.reduce((acc, person) => {
    if (person.bplace_country) {
      const countryId = person.bplace_country.id;
      if (!acc[countryId]) {
        acc[countryId] = {
          count: 0,
          country: person.bplace_country,
        };
      }
      acc[countryId].count++;
    }
    return acc;
  }, {});

  const cityDiedCounts = peopleSortedByHPI.reduce((acc, person) => {
    if (person.dplace_geonameid) {
      const cityId = person.dplace_geonameid.id;
      if (!acc[cityId]) {
        acc[cityId] = {
          count: 0,
          city: person.dplace_geonameid,
        };
      }
      acc[cityId].count++;
    }
    return acc;
  }, {});

  const topCities = Object.values(cityDiedCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const topOccupations = Object.values(occupationCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <section className="intro-section">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img
              src="/images/ui/profile-w.svg"
              alt={t("introIconAlt")}
            />
          </h3>
          <p>
            {t("introSummary", {
              year: formatDeathsYear(year, lang),
              count: formatDeathsNumber(people.length, lang),
            })}
            {peopleSortedByHPI.length ? (
              <>
                {" "}{t("introMostFamous")}{" "}
                <AnchorList
                  items={peopleSortedByHPI.slice(0, 5)}
                  name={d => d.name}
                  url={d => `${localePrefix}/profile/person/${d.slug}/`}
                  lang={lang}
                  noAnd
                />
                .
              </>
            ) : null}
            {topCities.length ? (
              <>
                {" "}{t("introCities")}{" "}
                <AnchorList
                  items={topCities}
                  name={d => `${d.city.place} (${formatDeathsNumber(
                    d.count,
                    lang,
                  )})`}
                  url={d => `${localePrefix}/profile/place/${d.city.slug}/`}
                  lang={lang}
                  noAnd
                />
                .
              </>
            ) : null}
            {!occupation && topOccupations.length ? (
              <>
                {" "}{t("introOccupations")}{" "}
                <AnchorList
                  items={topOccupations}
                  name={d => `${d.occupation.occupation} (${formatDeathsNumber(
                    d.count,
                    lang,
                  )})`}
                  url={d =>
                    `${localePrefix}/profile/deaths/${year}/occupation/${d.occupation.occupation_slug}/`
                  }
                  lang={lang}
                  noAnd
                />
                .
              </>
            ) : null}
          </p>
        </div>
      </div>
      <div className="occupation-filter">
        <label htmlFor="occupation-select">{t("filterOccupation")} </label>
        <select
          id="occupation-select"
          onChange={e => {
            const path = e.target.value
              ? `${localePrefix}/profile/deaths/${year}/occupation/${e.target.value}`
              : `${localePrefix}/profile/deaths/${year}`;
            router.push(path);
          }}
          value={occupation?.occupation_slug || ""}
          disabled={!!country}
        >
          <option value="">{t("allOccupations")}</option>
          {Object.values(occupationCounts)
            .sort((a, b) => b.count - a.count)
            .map(({occupation, count}) => (
              <option
                key={occupation.occupation_slug}
                value={occupation.occupation_slug}
              >
                {occupation.occupation} ({formatDeathsNumber(count, lang)})
              </option>
            ))}
        </select>
      </div>
      <div className="occupation-filter">
        <label htmlFor="country-select">{t("filterCountry")} </label>
        <select
          id="country-select"
          onChange={e => {
            const path = e.target.value
              ? `${localePrefix}/profile/deaths/${year}/country/${e.target.value}`
              : `${localePrefix}/profile/deaths/${year}`;
            router.push(path);
          }}
          value={country?.slug || ""}
          disabled={!!occupation}
        >
          <option value="">{t("allCountries")}</option>
          {Object.values(countryCounts)
            .sort((a, b) => b.count - a.count)
            .map(({country, count}) => (
              <option key={country.id} value={country.slug}>
                {country.country} ({formatDeathsNumber(count, lang)})
              </option>
            ))}
        </select>
      </div>
      <div className="year-navigation">
        <div>
          <a
            href={
              occupation
                ? `${localePrefix}/profile/deaths/${parseInt(year) - 1}/occupation/${
                    occupation.occupation_slug
                  }`
                : country
                ? `${localePrefix}/profile/deaths/${parseInt(year) - 1}/country/${
                    country.slug
                  }`
                : `${localePrefix}/profile/deaths/${parseInt(year) - 1}`
            }
            className="year-navigation-link"
          >
            &laquo; {t("previousYear", {
              year: formatDeathsYear(parseInt(year) - 1, lang),
            })}
          </a>
        </div>
        {parseInt(year) + 1 <= new Date().getFullYear() ? (
          <div>
            <a
              href={
                occupation
                  ? `${localePrefix}/profile/deaths/${parseInt(year) + 1}/occupation/${
                      occupation.occupation_slug
                    }`
                  : country
                  ? `${localePrefix}/profile/deaths/${parseInt(year) + 1}/country/${
                      country.slug
                    }`
                  : `${localePrefix}/profile/deaths/${parseInt(year) + 1}`
              }
              className="year-navigation-link"
            >
              {t("nextYear", {
                year: formatDeathsYear(parseInt(year) + 1, lang),
              })} &raquo;
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
