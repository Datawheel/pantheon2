"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { nest } from "d3-collection";
import { plural } from "pluralize";
import Select from "/components/common/Select";
import FancyButton from "/components/common/FancyButton";
import { toTitleCase } from "../../../components/utils/vizHelpers";
import { FORMATTERS } from "../../../components/utils/consts";
import "../../../components/occupation-country/SelectOccupationCountry.css";

export default function Page() {
  const { push } = useRouter();
  const selection2Entity = "product";

  const countryIconPath = "/images/icons/country";
  const productIconPath = "/images/icons/product";
  const countryDefaultIcon = `${countryIconPath}/country.svg`;
  const productDefaultIcon = `${productIconPath}/product.svg`;

  const [selection1, setSelection1] = useState("soccer-player");
  const [selection2, setSelection2] = useState("united-states");
  const [occupations, setOccupations] = useState([]);
  const [countries, setCountries] = useState([]);
  const [occupationsInCountry, setOccupationsInCountry] = useState([]);

  const [occupation, setOccupation] = useState("soccer-player");

  useEffect(() => {
    async function fetchMyData() {
      const getOccupations = await axios.get(
        `https://api.pantheon.world/occupation?order=num_born.desc.nullslast`
      );
      const getCountries = await axios.get(
        `https://api.pantheon.world/country?order=num_born.desc.nullslast`
      );
      const getOccupationsInCountry = await axios.get(
        `https://api.pantheon.world/occupation_country?num_people=gte.18`
      );
      const initialData = await axios
        .all([getOccupations, getCountries, getOccupationsInCountry])
        .then(axios.spread((...responses) => responses.map((r) => r.data)))
        .catch((errors) => {
          console.log("ERRORS!", errors);
        });
      const [occupations, countries, occupationsInCountry] = initialData;
      setOccupations(occupations);
      setCountries(countries);
      const numPeopleSum = occupationsInCountry.reduce(
        (a, b) => a + (b.num_people || 0),
        0
      );
      let occupationsInCountryNested = occupationsInCountry.map((d) => {
        const rca =
          d.num_people /
          d.num_people_country /
          (d.num_people_occupation / numPeopleSum);
        return { ...d, rca };
      });
      occupationsInCountryNested = nest()
        .key((d) => d.country_slug)
        .rollup((leaves) => leaves.sort((a, b) => b.rca - a.rca).slice(0, 5))
        .entries(occupationsInCountry)
        .map((d) => {
          const c = countries.find((c) => c.id === d.value[0].country);
          return { values: d.value, country: c };
        });
      setOccupationsInCountry(occupationsInCountryNested);
    }
    fetchMyData();
  }, []);

  useEffect(() => {
    setSelection1(occupation);
    async function fetchOccupationData() {
      const getOccupationsInCountry = await axios.get(
        `https://api.pantheon.world/occupation_country?occupation_slug=eq.${occupation}&order=num_people.desc.nullslast`
      );
      const { data: countries } = getOccupationsInCountry;
      setCountries(countries);
      console.log("getOccupationsInCountry!");
    }
    fetchOccupationData();
  }, [occupation]);

  return (
    <div className="welcome">
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
            Please select an occupation and country combination to see the most
            memorable biographies
          </h2>

          {/* the form */}
          <form
            onSubmit={(evt) => evt.preventDefault()}
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
                onChange={(evt) => setOccupation(evt.target.value)}
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
                onChange={(evt) => setSelection2(evt.target.value)}
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
                  push(
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
