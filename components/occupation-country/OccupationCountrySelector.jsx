"use client";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Select from "@/components/common/Select";
import {ArrowRight} from "lucide-react";
import FancyButton from "@/components/common/FancyButton";
import {toTitleCase} from "@/components/utils/vizHelpers";
import {PUBLIC_API} from "@/app/constants";

export default function OccupationCountrySelector({
  initialOccupations,
  initialCountries,
  locale,
  labels,
}) {
  const router = useRouter();
  const [occupation, setOccupation] = useState("soccer-player");
  const [country, setCountry] = useState("united-states");
  const [countries, setCountries] = useState(initialCountries);

  // When occupation changes, fetch countries with counts for that occupation
  useEffect(() => {
    async function fetchCountriesForOccupation() {
      try {
        const res = await fetch(
          `${PUBLIC_API}/occupation_country?occupation_slug=eq.${occupation}&order=num_people.desc.nullslast&select=*,country_data:country!country(slug,country,${locale}_country:translations->${locale}->>country)`
        );
        if (!res.ok) return;
        const text = await res.text();
        if (text.startsWith("<")) return;
        const data = JSON.parse(text);

        const localizedCountries = data.map(item => ({
          ...item,
          country: item.country_data?.[`${locale}_country`] || item.country_data?.country,
          slug: item.country_data?.slug,
        }));

        setCountries(localizedCountries);
        // Set first country as default if available
        if (localizedCountries.length > 0) {
          setCountry(localizedCountries[0].slug);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountriesForOccupation();
  }, [occupation, locale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/${locale}/profile/occupation/${occupation}/country/${country}`);
  };

  return (
    <form onSubmit={handleSubmit} className="selector-form">
      <div className="selector-row">
        <div className="selector-field">
          <label className="selector-label">{labels.selectOccupation}</label>
          <Select
            label="occupation"
            className="selector-select"
            fontSize="lg"
            value={occupation}
            onChange={e => setOccupation(e.target.value)}
          >
            {initialOccupations.map(occ => (
              <option value={occ.occupation_slug} key={occ.occupation_slug}>
                {locale === "en" ? toTitleCase(occ.occupation) : occ.occupation}
              </option>
            ))}
          </Select>
        </div>

        <span className="selector-plus">+</span>

        <div className="selector-field">
          <label className="selector-label">{labels.selectCountry}</label>
          <Select
            label="country"
            className="selector-select"
            fontSize="lg"
            value={country}
            onChange={e => setCountry(e.target.value)}
          >
            {countries.map(c => (
              <option value={c.slug} key={c.slug}>
                {c.num_people
                  ? `${c.country} (${c.num_people.toLocaleString(locale)})`
                  : c.country}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="selector-button-wrapper">
        <FancyButton icon={ArrowRight} type="submit">
          {labels.goToProfile}
        </FancyButton>
      </div>
    </form>
  );
}
