import React from "react";
import AnchorList from "components/utils/AnchorList";
import "pages/profile/common/Intro.css";
import {plural} from "pluralize";
import {toTitleCase} from "viz/helpers";
import {FORMATTERS} from "types";

const Intro = ({country, occupation, allCountriesInOccupation, allOccupationsInCountry}) => {
  const allCountriesInOccupationSorted = allCountriesInOccupation.sort((a, b) => {
    if (b.num_people === a.num_people) {
      return b.hpi - a.hpi;
    }
    return b.num_people - a.num_people;
  });
  const countryIndex = allCountriesInOccupationSorted.findIndex(d => d.country === country.id);
  const countriesAheadInRanking = countryIndex > 1
    ? allCountriesInOccupationSorted.slice(countryIndex - 2, countryIndex)
    : null;
  const countriesBehindInRanking = countryIndex < allCountriesInOccupationSorted.length - 2
    ? allCountriesInOccupationSorted.slice(countryIndex + 1, countryIndex + 3)
    : null;

  return (
    <section className="intro-section">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" alt="Icon of occuation in country" />
          </h3>
          <p>
            This page contains a list of the greatest {country.demonym} {toTitleCase(plural(occupation.occupation))}.
            The pantheon dataset contains {FORMATTERS.commas(occupation.num_born)} <a href={`/profile/occupation/${occupation.occupation_slug}`}>{toTitleCase(plural(occupation.occupation))}</a>, {FORMATTERS.commas(allCountriesInOccupationSorted[countryIndex].num_people)} of which were born in <a href={`/profile/country/${country.slug}`}>{country.country}</a>.
            This makes <a href={`/profile/country/${country.slug}`}>{country.country}</a> the birth place of the {countryIndex ? FORMATTERS.ordinal(countryIndex + 1) : ""} most number of {toTitleCase(plural(occupation.occupation))}{countriesAheadInRanking ? <React.Fragment> behind <AnchorList items={countriesAheadInRanking} name={d => d.country} url={d => `/profile/occupation/${occupation.occupation_slug}/country/${d.country_slug}/`} />. </React.Fragment> : ". "}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;
