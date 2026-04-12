import AnchorList from "../utils/AnchorList";
import {plural} from "pluralize";
import {toTitleCase} from "../utils/vizHelpers";
import {FORMATTERS} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import "../common/Intro.css";

export default function Intro({country, occupation, allCountriesInOccupation, locale = DEFAULT_LOCALE}) {
  const t = getTranslations(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
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

  // For English, use plural form with toTitleCase; for other languages, use the occupation as-is
  const occupationPlural = locale === "en"
    ? toTitleCase(plural(occupation.occupation))
    : occupation.occupation;

  // Create occupation link
  const occupationLink = `<a href="${localePrefix}/profile/occupation/${occupation.occupation_slug}">${occupationPlural}</a>`;

  // Create country link
  const countryLink = `<a href="${localePrefix}/profile/country/${country.slug}">${country.country}</a>`;

  // Format numbers with proper locale
  const totalCount = occupation.num_born.toLocaleString(locale);
  const countryCount = allCountriesInOccupationSorted[countryIndex]?.num_people.toLocaleString(locale);

  // Get rank ordinal
  const rank = countryIndex ? FORMATTERS.ordinal(countryIndex + 1) : "";

  // Build countries behind list with links
  let countriesBehindText = "";
  if (countriesAheadInRanking) {
    const countryLinks = countriesAheadInRanking.map(d => {
      // Use localized country name if available, fallback to English
      const countryName = d.country_data?.[`${locale}_country`] || d.country_data?.country || d.country;
      return `<a href="${localePrefix}/profile/occupation/${occupation.occupation_slug}/country/${d.country_slug}/">${countryName}</a>`;
    });
    if (countryLinks.length === 1) {
      countriesBehindText = countryLinks[0];
    } else if (countryLinks.length === 2) {
      countriesBehindText = `${countryLinks[0]} ${t.occupationCountry.and} ${countryLinks[1]}`;
    }
  }

  // Get the intro text
  let introHTML = t.occupationCountry.introText({
    demonym: country.demonym,
    occupationPlural,
    totalCount,
    countryCount,
    country: country.country,
    rank,
    countriesBehind: countriesBehindText,
  });

  // Replace occupation and country names with links
  // Replace first occurrence of occupationPlural with link
  introHTML = introHTML.replace(new RegExp(`(${totalCount}\\s+)${occupationPlural}`, 'i'), `$1${occupationLink}`);
  // Replace country names with links
  introHTML = introHTML.replace(new RegExp(`(in|en|em|в|в|in|en)\\s+${country.country}`, 'gi'), (match) => {
    return match.replace(country.country, countryLink);
  });

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
          <p dangerouslySetInnerHTML={{__html: introHTML}} />
        </div>
      </div>
    </section>
  );
}
