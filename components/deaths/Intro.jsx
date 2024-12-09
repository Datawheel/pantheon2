import AnchorList from "../utils/AnchorList";
import {plural} from "pluralize";
import {toTitleCase} from "../utils/vizHelpers";
import {FORMATTERS} from "../utils/consts";
import "../common/Intro.css";

export default function Intro({year, people}) {
  const peopleSortedByHPI = people.sort((a, b) => b.hpi - a.hpi);
  const countryBornCounts = people.reduce((acc, person) => {
    if (person.dplace_country) {
      const countryId = person.dplace_country.id;
      if (!acc[countryId]) {
        acc[countryId] = {
          count: 0,
          country: person.dplace_country,
        };
      }
      acc[countryId].count++;
    }
    return acc;
  }, {});

  const topCountries = Object.values(countryBornCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const cityDiedCounts = people.reduce((acc, person) => {
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
            .
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
      <div className="year-navigation">
        <div>
          <a
            href={`/profile/deaths/${parseInt(year) - 1}`}
            className="year-navigation-link"
          >
            &laquo; view {parseInt(year) - 1} deaths
          </a>
        </div>
        {parseInt(year) + 1 < 2025 ? (
          <div>
            <a
              href={`/profile/deaths/${parseInt(year) + 1}`}
              className="year-navigation-link"
            >
              view {parseInt(year) + 1} deaths &raquo;
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
