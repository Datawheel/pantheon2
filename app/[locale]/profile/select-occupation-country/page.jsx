"use client";
import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import axios from "axios";
import {nest} from "d3-collection";
import {plural} from "pluralize";
import Select from "/components/common/Select";
import FancyButton from "/components/common/FancyButton";
import {toTitleCase} from "/components/utils/vizHelpers";
import {FORMATTERS} from "/components/utils/consts";
import "/components/occupation-country/SelectOccupationCountry.css";
import Image from "next/image";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {getTranslations} from "/app/translations";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";

export default function Page() {
  const {push} = useRouter();
  const params = useParams();
  const locale = SUPPORTED_LOCALES.includes(params.locale) ? params.locale : DEFAULT_LOCALE;
  const t = getTranslations(locale);

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
      const getOccupations = await fetch(
        `${BASE_API}/occupation?order=num_born.desc.nullslast&select=*,${locale}_occupation:translations->${locale}->>occupation`,
        {
          next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
        }
      );
      const getCountries = await fetch(
        `${BASE_API}/country?order=num_born.desc.nullslast&select=*,${locale}_country:translations->${locale}->>country,${locale}_demonym:translations->${locale}->>demonym_m_plural`,
        {
          next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
        }
      );
      const getOccupationsInCountry = await fetch(
        `${BASE_API}/occupation_country?num_people=gte.18&select=*,occupation_data:occupation!occupation(occupation_slug,occupation,${locale}_occupation:translations->${locale}->>occupation),country_data:country!country(slug,country,demonym,${locale}_country:translations->${locale}->>country,${locale}_demonym:translations->${locale}->>demonym_m_plural)`,
        {
          next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
        }
      );
      try {
        const responses = await Promise.all([
          getOccupations,
          getCountries,
          getOccupationsInCountry,
        ]);

        const initialData = await Promise.all(
          responses.map(response => response.json())
        );

        const [occupations, countries, occupationsInCountry] = initialData;

        // Map localized occupation names
        const localizedOccupations = occupations.map(occ => ({
          ...occ,
          occupation: occ[`${locale}_occupation`] || occ.occupation,
        }));

        // Map localized country names and demonyms
        const localizedCountries = countries.map(country => ({
          ...country,
          country: country[`${locale}_country`] || country.country,
          demonym: country[`${locale}_demonym`] || country.demonym,
        }));

        setOccupations(localizedOccupations);
        setCountries(localizedCountries);

        const numPeopleSum = occupationsInCountry.reduce(
          (a, b) => a + (b.num_people || 0),
          0
        );
        let occupationsInCountryNested = occupationsInCountry.map(d => {
          const rca =
            d.num_people /
            d.num_people_country /
            (d.num_people_occupation / numPeopleSum);
          return {...d, rca};
        });
        occupationsInCountryNested = nest()
          .key(d => d.country_slug)
          .rollup(leaves => leaves.sort((a, b) => b.rca - a.rca).slice(0, 5))
          .entries(occupationsInCountry)
          .map(d => {
            const countryData = d.value[0].country_data;
            const c = {
              ...countryData,
              id: d.value[0].country,
              country: countryData[`${locale}_country`] || countryData.country,
              demonym: countryData[`${locale}_demonym`] || countryData.demonym,
            };
            return {values: d.value, country: c};
          });
        setOccupationsInCountry(occupationsInCountryNested);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchMyData();
  }, [locale]);

  useEffect(() => {
    setSelection1(occupation);
    async function fetchOccupationData() {
      const getOccupationsInCountry = await fetch(
        `${BASE_API}/occupation_country?occupation_slug=eq.${occupation}&order=num_people.desc.nullslast&select=*,country_data:country!country(slug,country,demonym,${locale}_country:translations->${locale}->>country,${locale}_demonym:translations->${locale}->>demonym_m_plural)`,
        {
          next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
        }
      );
      const countriesData = await getOccupationsInCountry.json();

      // Map localized country names from embedded country_data
      const localizedCountries = countriesData.map(item => ({
        ...item,
        country: item.country_data?.[`${locale}_country`] || item.country_data?.country || item.country,
        country_slug: item.country_data?.slug || item.country_slug,
        slug: item.country_data?.slug || item.country_slug,
      }));

      setCountries(localizedCountries);
    }
    fetchOccupationData();
  }, [occupation, locale]);

  return (
    <div className="welcome">
      {/* welcome text */}
      <div className="welcome-intro">
        <h1
          className="welcome-intro-heading u-font-lg u-margin-top-off"
          aria-label={t.selectOccupationCountry.heading}
        >
          {t.selectOccupationCountry.heading}
        </h1>
      </div>

      {/* entity selection form */}
      <div className="welcome-form-outer">
        <div className="welcome-form-inner">
          <h2 className="u-visually-hidden">
            {t.selectOccupationCountry.pleaseSelect}
          </h2>

          {/* the form */}
          <form onSubmit={evt => evt.preventDefault()} className="welcome-form">
            {/* entity 1 */}
            <div className="welcome-form-select-wrapper">
              <Select
                label="occupation"
                className="welcome-form-select"
                fontSize="lg"
                onChange={evt => setOccupation(evt.target.value)}
              >
                <option disabled={true}>{t.selectOccupationCountry.selectOccupation}</option>
                {occupations.map(occupation => (
                  <option
                    value={occupation.occupation_slug}
                    key={occupation.occupation_slug}
                  >
                    {locale === "en" ? toTitleCase(occupation.occupation) : occupation.occupation}
                  </option>
                ))}
              </Select>
            </div>

            {/* entity 2 */}
            {/* <div className="welcome-form-select-wrapper" disabled={selection1 === null}> */}
            <div className="welcome-form-select-wrapper" disabled={false}>
              <Select
                label="country"
                className="welcome-form-select"
                fontSize="lg"
                onChange={evt => setSelection2(evt.target.value)}
              >
                <option disabled={true}>{t.selectOccupationCountry.selectCountry}</option>
                {countries.map(country => (
                  <option
                    value={country.country_slug || country.slug}
                    key={country.country_slug || country.slug}
                  >
                    {country.num_people
                      ? `${country.country} (${country.num_people.toLocaleString(locale)})`
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
                    `/${locale}/profile/occupation/${selection1}/country/${selection2}`
                  )
                }
              >
                {t.selectOccupationCountry.goToProfile}
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
          {t.selectOccupationCountry.whoAreTheMostFamous}
        </h2>
        <ul className="sample-ctr-occs-list">
          {occupationsInCountry.map(aCountry => (
            <li key={aCountry.country.slug}>
              <ul className="sample-ctr-occs">
                {aCountry.values.map(occupationInCountry => {
                  // Get localized occupation name from embedded occupation_data
                  const localizedOccupation = occupationInCountry.occupation_data?.[`${locale}_occupation`] ||
                                              occupationInCountry.occupation_data?.occupation ||
                                              occupationInCountry.occupation;

                  // For English, use plural form with toTitleCase; for other languages, use the occupation as-is
                  const occupationDisplay = locale === "en"
                    ? toTitleCase(plural(localizedOccupation))
                    : localizedOccupation;

                  return (
                    <li
                      key={`${occupationInCountry.country_slug}-${occupationInCountry.occupation_slug}`}
                    >
                      <a
                        href={`/${locale}/profile/occupation/${occupationInCountry.occupation_slug}/country/${occupationInCountry.country_slug}`}
                      >
                        <Image
                          className="country-flag"
                          src={`/images/icons/country/${aCountry.country.slug}.svg`}
                          alt={`Round icon flag of ${aCountry.country.country}`}
                          width={20}
                          height={20}
                        />
                        <span>
                          {aCountry.country.demonym}{" "}
                          {occupationDisplay}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
