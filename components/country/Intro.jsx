import AnchorList from "../utils/AnchorList";
import {nest} from "d3-collection";
import {plural} from "pluralize";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getLocationTranslations} from "@/app/locationTranslations";
import "../common/Intro.css";

export default function Intro({
  country,
  countryRanks,
  peopleBornHere,
  peopleDiedHere,
  topCities,
  wikiSummary,
  lang = "en",
}) {
  const t = getLocationTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const occupationsBorn = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({
      num_born: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries((peopleBornHere || []).filter(d => d.occupation_id && d.occupation))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value)
    .slice(0, 2);
  const occupationsDied = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({
      num_died: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries((peopleDiedHere || []).filter(d => d.occupation_id && d.occupation))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value)
    .slice(0, 2);
  const myIndex = countryRanks
    ? countryRanks.findIndex(c => c.id === country.id)
    : null;
  let wikiLink, wikiSentence;

  // wikipedia summary
  if (wikiSummary) {
    if (wikiSummary.extract_html) {
      wikiSentence = wikiSummary.extract;
    }
    if (wikiSummary.content_urls) {
      wikiLink = wikiSummary.content_urls.desktop.page;
    }
  }
  return (
    <section className="intro-section">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" alt={t("iconCountry")} />
            {country.country}
          </h3>
          <p>
            {countryRanks && myIndex > 0 ? (
              <span>
                {t("rankIntro", {
                  location: country.country,
                  rank: country.born_rank_unique,
                })}{" "}
                <AnchorList
                  items={countryRanks.slice(Math.max(0, myIndex - 3), myIndex)}
                  name={d => d.country}
                  url={d => `${localePrefix}/profile/country/${d.slug}/`}
                  lang={lang}
                />
                .{" "}
              </span>
            ) : null}
            {peopleBornHere && peopleBornHere.length ? (
              <span>
                {t("famousBorn", {location: country.country})}{" "}
                <AnchorList
                  items={peopleBornHere.slice(0, 3).filter(d => d.slug)}
                  name={d => d.name}
                  url={d => `${localePrefix}/profile/person/${d.slug}/`}
                  lang={lang}
                />
                .
              </span>
            ) : null}
            {peopleDiedHere && peopleDiedHere.length ? (
              <span>
                {" "}{t("famousDied", {location: country.country})}{" "}
                <AnchorList
                  items={peopleDiedHere.slice(0, 3).filter(d => d.slug)}
                  name={d => d.name}
                  url={d => `${localePrefix}/profile/person/${d.slug}/`}
                  lang={lang}
                />
                .
              </span>
            ) : null}
            {occupationsBorn && occupationsBorn.length ? (
              <span>
                {" "}{t("birthOccupations", {location: country.country})}{" "}
                <AnchorList
                  items={occupationsBorn.filter(d => d.occupation)}
                  name={d => lang === "en"
                    ? plural(d.occupation.occupation.toLowerCase())
                    : d.occupation.occupation}
                  url={d =>
                    `${localePrefix}/profile/occupation/${d.occupation.occupation_slug}/`
                  }
                  lang={lang}
                />
              </span>
            ) : null}
            {occupationsDied && occupationsDied.length ? (
              <span>
                {" "}{t("deathOccupations")}{" "}
                <AnchorList
                  items={occupationsDied.filter(d => d.occupation)}
                  name={d => lang === "en"
                    ? plural(d.occupation.occupation.toLowerCase())
                    : d.occupation.occupation}
                  url={d =>
                    `${localePrefix}/profile/occupation/${d.occupation.occupation_slug}/`
                  }
                  lang={lang}
                />
                .
              </span>
            ) : (
              <span>.</span>
            )}
            {topCities && topCities.length ? (
              <span>
                {" "}{t("topCities", {location: country.country})}{" "}
                <AnchorList
                  items={topCities}
                  name={d => d.place}
                  url={d => `${localePrefix}/profile/place/${d.slug}/`}
                  lang={lang}
                />
                .
              </span>
            ) : null}
          </p>
          {wikiSentence ? (
            <p>
              {wikiSentence}{" "}
              <a href={wikiLink} target="_blank" rel="noopener noreferrer">
                {t("readMoreWikipedia")}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
