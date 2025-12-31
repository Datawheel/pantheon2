"use client";

import {plural} from "pluralize";
import AnchorList from "../utils/AnchorList";
import {toTitleCase} from "../utils/vizHelpers";
import {FORMATTERS} from "../utils/consts";
import "../common/Intro.css";
import {useRouter} from "next/navigation";

export default function Intro({year, people, occupation, country}) {
  const router = useRouter();
  const peopleSortedByHPI = people
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
              alt="Icon of occuation in country"
            />
          </h3>
          <p>
            This page contains a list of the most famous people who died in{" "}
            {year}. The pantheon dataset contains{" "}
            {FORMATTERS.commas(people.length)} who passed this year, the most
            famous by HPI being{" "}
            <AnchorList
              items={peopleSortedByHPI.slice(0, 5)}
              name={d => d.name}
              url={d => `/profile/person/${d.slug}/`}
            />
            . The cities with the most deaths were{" "}
            <AnchorList
              items={topCities}
              name={d => `${d.city.place} (${d.count})`}
              url={d => `/profile/place/${d.city.slug}/`}
            />
            .{" "}
            {!occupation ? (
              <>
                The most common occupations for people who died this year were{" "}
                <AnchorList
                  items={topOccupations}
                  name={d =>
                    `${toTitleCase(d.occupation.occupation)} (${d.count})`
                  }
                  url={d =>
                    `/profile/deaths/${year}/occupation/${d.occupation.occupation_slug}/`
                  }
                />
                .
              </>
            ) : null}
            {/* ,{" "}
            {FORMATTERS.commas(
              allCountriesInOccupationSorted[countryIndex].num_people
            )}{" "}
            of which were born in{" "}
            <a href={`/profile/country/${country.slug}`}>{country.country}</a>.
            This makes{" "}
            <a href={`/profile/country/${country.slug}`}>{country.country}</a>{" "}
            the birth place of the{" "}
            {countryIndex ? FORMATTERS.ordinal(countryIndex + 1) : ""} most
            number of {toTitleCase(plural(occupation.occupation))}
            {countriesAheadInRanking ? (
              <>
                {" "}
                behind{" "}
                <AnchorList
                  items={countriesAheadInRanking}
                  name={d => d.country}
                  url={d =>
                    `/profile/occupation/${occupation.occupation_slug}/country/${d.country_slug}/`
                  }
                />
                .{" "}
              </>
            ) : (
              ". "
            )} */}
          </p>
        </div>
      </div>
      <div className="occupation-filter">
        <label htmlFor="occupation-select">Filter by Occupation: </label>
        <select
          id="occupation-select"
          onChange={e => {
            const path = e.target.value
              ? `/profile/deaths/${year}/occupation/${e.target.value}`
              : `/profile/deaths/${year}`;
            router.push(path);
          }}
          value={occupation?.occupation_slug || ""}
          disabled={!!country}
        >
          <option value="">All Occupations</option>
          {Object.values(occupationCounts)
            .sort((a, b) => b.count - a.count)
            .map(({occupation, count}) => (
              <option
                key={occupation.occupation_slug}
                value={occupation.occupation_slug}
              >
                {toTitleCase(occupation.occupation)} ({count})
              </option>
            ))}
        </select>
      </div>
      <div className="occupation-filter">
        <label htmlFor="country-select">Filter by Nationality: </label>
        <select
          id="country-select"
          onChange={e => {
            const path = e.target.value
              ? `/profile/deaths/${year}/country/${e.target.value}`
              : `/profile/deaths/${year}`;
            router.push(path);
          }}
          value={country?.slug || ""}
          disabled={!!occupation}
        >
          <option value="">All Countries</option>
          {Object.values(countryCounts)
            .sort((a, b) => b.count - a.count)
            .map(({country, count}) => (
              <option key={country.id} value={country.slug}>
                {country.country} ({count})
              </option>
            ))}
        </select>
      </div>
      <div className="year-navigation">
        <div>
          <a
            href={
              occupation
                ? `/profile/deaths/${parseInt(year) - 1}/occupation/${
                    occupation.occupation_slug
                  }`
                : country
                ? `/profile/deaths/${parseInt(year) - 1}/country/${
                    country.slug
                  }`
                : `/profile/deaths/${parseInt(year) - 1}`
            }
            className="year-navigation-link"
          >
            &laquo; view {parseInt(year) - 1} deaths
            {occupation
              ? ` (${plural(occupation.occupation.toLowerCase())})`
              : country
              ? ` (${country.country})`
              : ""}
          </a>
        </div>
        {parseInt(year) + 1 <= new Date().getFullYear() ? (
          <div>
            <a
              href={
                occupation
                  ? `/profile/deaths/${parseInt(year) + 1}/occupation/${
                      occupation.occupation_slug
                    }`
                  : country
                  ? `/profile/deaths/${parseInt(year) + 1}/country/${
                      country.slug
                    }`
                  : `/profile/deaths/${parseInt(year) + 1}`
              }
              className="year-navigation-link"
            >
              view {parseInt(year) + 1} deaths
              {occupation
                ? ` (${plural(occupation.occupation.toLowerCase())})`
                : country
                ? ` (${country.country})`
                : ""}{" "}
              &raquo;
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
