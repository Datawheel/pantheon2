import AnchorList from "../utils/AnchorList";
import {plural} from "pluralize";
import {toTitleCase} from "../utils/vizHelpers";
import {FORMATTERS} from "../utils/consts";
import "../common/Intro.css";

export default function Intro({country, occupation, allCountriesInOccupation}) {
  const allCountriesInOccupationSorted = allCountriesInOccupation.sort(
    (a, b) => {
      if (b.num_people === a.num_people) {
        return b.hpi - a.hpi;
      }
      return b.num_people - a.num_people;
    }
  );
  const countryIndex = allCountriesInOccupationSorted.findIndex(
    d => d.country === country.id
  );
  const countriesAheadInRanking =
    countryIndex > 1
      ? allCountriesInOccupationSorted.slice(countryIndex - 2, countryIndex)
      : null;

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
            This page contains a list of the greatest {country.demonym}{" "}
            {toTitleCase(plural(occupation.occupation))}. The pantheon dataset
            contains {FORMATTERS.commas(occupation.num_born)}{" "}
            <a href={`/profile/occupation/${occupation.occupation_slug}`}>
              {toTitleCase(plural(occupation.occupation))}
            </a>
            ,{" "}
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
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
