import PeopleGrid from "@/components/deaths/PeopleGrid";
import "../common/Section.css";
import {
  formatDeathsYear,
  getDeathsTranslations,
} from "@/app/deathsTranslations";

export default function TopPeople({
  occupation,
  country,
  year,
  people,
  lang = "en",
}) {
  const t = getDeathsTranslations(lang);
  const formattedYear = formatDeathsYear(year, lang);
  const peopleSortedByHPI = [...people].sort((a, b) => {
    // Handle undefined HPI values to prevent NaN in sort comparison
    if (!a.hpi && !b.hpi) return 0;
    if (!a.hpi) return 1; // People without HPI go to the end
    if (!b.hpi) return -1;
    return b.hpi - a.hpi; // Sort by HPI descending
  });
  return (
    <section className="profile-section">
      {occupation ? (
        <h2>{t("topPeopleOccupationTitle", {
          year: formattedYear,
          occupation: occupation.occupation,
        })}</h2>
      ) : country ? (
        <h2>{t("topPeopleCountryTitle", {
          year: formattedYear,
          country: country.country,
        })}</h2>
      ) : (
        <h2>{t("topPeopleTitle", {year: formattedYear})}</h2>
      )}
      <div className="section-body">
        <p>{t("topPeopleDescription")}</p>
      </div>
      <PeopleGrid
        bios={peopleSortedByHPI.slice(0, 16)}
        occupation={occupation}
        year={year}
        lang={lang}
      />
    </section>
  );
}
