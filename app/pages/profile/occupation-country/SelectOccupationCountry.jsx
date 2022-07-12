import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "@datawheel/canon-core";
import { Helmet } from "react-helmet-async";
import config from "helmet.js";
import { toTitleCase } from "viz/helpers";
import { nest } from "d3-collection";
import { plural } from "pluralize";
import { FORMATTERS } from "types";
import FancyButton from "pages/profile/common/FancyButton";
import Select from "pages/profile/common/Select";
import "pages/profile/common/Structure.css";
import "pages/profile/occupation-country/SelectOccupationCountry.css";
import api from "apiConfig";

class SelectOccupationCountry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      selection1: "soccer-player",
      selection2: "united-states",
      selection2Entity: "product",
    };
  }

  setOccupation = (e) => {
    const { env } = this.props;
    const { selection2 } = this.state;
    this.setState({ selection1: e.target.value });
    api(env)
      .get(
        `/occupation_country?occupation_slug=eq.${e.target.value}&order=num_people.desc.nullslast`
      )
      .then((occupationCountryResults) => {
        const countries = occupationCountryResults.data;
        if (countries.length) {
          const chosenCountryInList = countries.filter(
            (d) => d.country_slug === selection2
          ).length;
          const newSelection2 = chosenCountryInList ? selection2 : null;
          this.setState({ countries, selection2: newSelection2 });
        } else {
          this.setState({ countries: [] });
        }
      });
  };

  render() {
    const { selection1, selection2, selection2Entity } = this.state;
    const { data, router } = this.props;
    const { countries: countryList, occupations } = data;
    const countries = this.state.countries.length
      ? this.state.countries
      : countryList;

    const countryIconPath = "/images/icons/country";
    const productIconPath = "/images/icons/product";
    const countryDefaultIcon = `${countryIconPath}/country.svg`;
    const productDefaultIcon = `${productIconPath}/product.svg`;

    const numPeopleSum = data.occupationsInCountry.reduce(
      (a, b) => a + (b.num_people || 0),
      0
    );
    let occupationsInCountry = data.occupationsInCountry.map((d) => {
      const rca =
        d.num_people /
        d.num_people_country /
        (d.num_people_occupation / numPeopleSum);
      return { ...d, rca };
    });
    occupationsInCountry = nest()
      .key((d) => d.country_slug)
      .rollup((leaves) => leaves.sort((a, b) => b.rca - a.rca).slice(0, 5))
      .entries(occupationsInCountry)
      .map((d) => {
        const c = countryList.find((c) => c.id === d.value[0].country);
        return { values: d.value, country: c };
      });

    return (
      <div className="welcome">
        <Helmet
          title={"Occupation country profile selection"}
          meta={config.meta.map((meta) => {
            if (meta.property && meta.property === "og:title") {
              return {
                property: "og:title",
                content: "Occupation country profile selection",
              };
            }
            if (meta.property && meta.property === "og:description") {
              return {
                property: "og:description",
                content:
                  "Select a country and occupation to view a dynamic profile of the greatest people in that selection of all time.",
              };
            }
            return meta;
          })}
        />
        {/* welcome text */}
        <div className="welcome-intro">
          <h1
            className="welcome-intro-heading u-font-lg u-margin-top-off"
            aria-label="Select an occupation and country"
          >
            Select an occupation and country
          </h1>
        </div>

        {/* entity selection form */}
        <div className="welcome-form-outer">
          <div className="welcome-form-inner">
            <h2 className="u-visually-hidden">
              Please select an occupation and country combination to see the
              most memorable biographies
            </h2>

            {/* the form */}
            <form
              onSubmit={(e) => this.handleSubmit(e)}
              className="welcome-form"
            >
              {/* entity 1 */}
              <div className="welcome-form-select-wrapper">
                <img
                  src={
                    selection1 === "unspecified"
                      ? countryDefaultIcon
                      : `${countryIconPath}/country_${selection1}.png`
                  }
                  className="welcome-form-select-icon"
                  alt=""
                />
                <Select
                  label="occupation"
                  className="welcome-form-select"
                  fontSize="lg"
                  onChange={this.setOccupation}
                >
                  <option disabled={true}>Select an occupation</option>
                  {occupations.map((occupation) => (
                    <option
                      value={occupation.occupation_slug}
                      key={occupation.occupation_slug}
                    >
                      {toTitleCase(occupation.occupation)}
                    </option>
                  ))}
                </Select>
              </div>

              {/* entity 2 */}
              {/* <div className="welcome-form-select-wrapper" disabled={selection1 === null}> */}
              <div className="welcome-form-select-wrapper" disabled={false}>
                <img
                  src={
                    selection2Entity === "product"
                      ? selection2 === "unspecified"
                        ? productDefaultIcon
                        : `${productIconPath}/hs_${selection2}.png`
                      : selection2 === "unspecified"
                      ? countryDefaultIcon
                      : `${countryIconPath}/country_${selection2}.png`
                  }
                  className="welcome-form-select-icon"
                  alt=""
                />
                <Select
                  label="country"
                  className="welcome-form-select"
                  fontSize="lg"
                  onChange={(e) =>
                    this.setState({ selection2: e.target.value })
                  }
                >
                  <option disabled={true}>Select a country</option>
                  {countries.map((country) => (
                    <option
                      value={country.country_slug || country.slug}
                      key={country.country_slug || country.slug}
                    >
                      {country.num_people
                        ? `${country.country} (${FORMATTERS.commas(
                            country.num_people
                          )})`
                        : country.country}
                    </option>
                  ))}
                </Select>
              </div>

              {/* submit button submits the form */}
              <div className="welcome-form-button-wrapper">
                <FancyButton
                  icon="arrow-right"
                  disabled={selection1 === "unspecified"}
                  onClick={() =>
                    router.push(
                      `/profile/occupation/${selection1}/country/${selection2}`
                    )
                  }
                >
                  Go to profile
                </FancyButton>
              </div>
            </form>
          </div>
        </div>

        {/* welcome text */}
        <div className="sample-ctr-occs">
          <h2
            className="welcome-intro-heading u-font-lg u-margin-top-off"
            aria-label="The most famous occupation / country combinations"
          >
            Who are the most famous...
          </h2>
          <ul className="sample-ctr-occs-list">
            {occupationsInCountry.map((aCountry) => (
              <li key={aCountry.country.slug}>
                <ul className="sample-ctr-occs">
                  {aCountry.values.map((occupationInCountry) => (
                    <li
                      key={`${occupationInCountry.country_slug}-${occupationInCountry.occupation_slug}`}
                    >
                      <a
                        href={`/profile/occupation/${occupationInCountry.occupation_slug}/country/${occupationInCountry.country_slug}`}
                      >
                        <img
                          className="country-flag"
                          src={`/images/icons/country/${aCountry.country.slug}.svg`}
                        />
                        <span>
                          {aCountry.country.demonym}{" "}
                          {toTitleCase(plural(occupationInCountry.occupation))}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const occupationsURL = "/occupation?order=num_born.desc.nullslast";
const allOccupationsInCountryURL = "/occupation_country?num_people=gte.18";
const countriesURL = "/country?order=num_born.desc.nullslast";

SelectOccupationCountry.preneed = [
  fetchData("occupations", occupationsURL),
  fetchData("countries", countriesURL),
  fetchData("occupationsInCountry", allOccupationsInCountryURL),
];

export default connect(
  (state) => ({ data: state.data, env: state.env }),
  {}
)(SelectOccupationCountry);
