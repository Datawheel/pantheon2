import PersonImage from "../utils/PersonImage";
import {toTitleCase} from "../utils/vizHelpers";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import {getTranslations} from "/app/translations";
import "../common/Intro.css";
import Image from "next/image";

const Intro = ({
  person,
  personRanks,
  wikiExtract,
  ranklessUrl,
  lang = "en",
}) => {
  const t = getTranslations(lang);
  const {
    occupation_rank: occupationRank,
    occupation_rank_prev: occupationRankPrev,
    bplace_country_rank: bplaceCountryRank,
    bplace_country_rank_prev: bplaceCountryRankPrev,
    bplace_country_occupation_rank: bplaceCountryOccupationRank,
  } = personRanks;
  // const bplaceCountryRank = personRanks.bplaceCountryRank ? personRanks.bplaceCountryRank : null;
  const backgroundColor = COLORS_DOMAIN[person.occupation.domain_slug];
  const decoLines = 14;
  let age = 0;
  if (person.birthyear) {
    age =
      person.deathyear !== null
        ? person.deathyear - person.birthyear
        : new Date().getFullYear() - person.birthyear;
  }

  let fromSentence, wikiSentence, wikiSlug;
  if (person.bplace_country) {
    if (!person.bplace_geonameid) {
      // Example test case person:
      //   pope_pius_ii
      //   sergej_barbarez (w/o country)
      const birthplace = person.bplace_name ? `${person.bplace_name}, ` : "";
      const birthcountry = person.bplace_country ? (
        <span>
          {" "}
          in {birthplace}
          <a href={`/profile/place/${person.bplace_country.slug}`}>
            {person.bplace_country.country}
          </a>
        </span>
      ) : (
        ` in ${birthplace.replace(", ", "")}`
      );
      fromSentence = person.birthyear ? (
        <span>
          born in {FORMATTERS.year(person.birthyear)}
          {birthcountry}.{" "}
        </span>
      ) : null;
    } else if (
      person.bplace_country &&
      person.geacron_name !== person.bplace_country.country
    ) {
      fromSentence = person.birthyear ? (
        <span>
          born in {FORMATTERS.year(person.birthyear)} in {person.bplace_name},{" "}
          {person.geacron_name} which is now part of modern day{" "}
          <a href={`/profile/place/${person.bplace_geonameid.slug}`}>
            {person.bplace_geonameid.place}
          </a>
          ,{" "}
          <a href={`/profile/place/${person.bplace_country.slug}`}>
            {person.bplace_country.country}
          </a>
          .{" "}
        </span>
      ) : null;
    } else {
      const birthplace = person.bplace_geonameid.state ? (
        <a href={`/profile/place/${person.bplace_geonameid.slug}`}>
          {person.bplace_geonameid.place}, {person.bplace_geonameid.state}
        </a>
      ) : (
        <a href={`/profile/place/${person.bplace_geonameid.slug}`}>
          {person.bplace_geonameid.place}
        </a>
      );
      if (person.bplace_name !== person.bplace_geonameid.place) {
        // Example test case person:
        //     jack_nicholson (w/ state)
        //     jack_nicholson (w/o state)
        fromSentence = (
          <span>
            born in {FORMATTERS.year(person.birthyear.name)} in{" "}
            {person.bplace_name},{" "}
            <a href={`/profile/country/${person.bplace_country.slug}`}>
              {person.bplace_country.country}
            </a>{" "}
            which is near {birthplace}.{" "}
          </span>
        );
      } else {
        // Example test case person:
        //     ada_lovelace (w/ state)
        //     bud_spencer (w/o state)
        fromSentence = person.birthyear ? (
          <span>
            born in {FORMATTERS.year(person.birthyear.name)} in {birthplace},{" "}
            <a href={`/profile/country/${person.bplace_country.slug}`}>
              {person.bplace_country.country}
            </a>
            .{" "}
          </span>
        ) : null;
      }
    }
  }

  // wikipedia excerpt and URL
  let wikiUrl;
  if (wikiExtract && wikiExtract.query && wikiExtract.query.pages) {
    // Get the first page object (since we're querying by title, page ID will be language-specific)
    const pageId = Object.keys(wikiExtract.query.pages)[0];
    const page = wikiExtract.query.pages[pageId];
    if (page && page.extract) {
      wikiSentence = page.extract;
      if (wikiSentence.length > 1000) {
        // take up until last full sentence
        wikiSentence = wikiSentence.slice(0, wikiSentence.lastIndexOf(". "));
        // remove line breaks
        wikiSentence = wikiSentence.replace(/(\r\n|\n|\r)/gm, " ");
        // remove all wiki markup (replace all instances of 2 or more `=` signs)
        wikiSentence = wikiSentence.replace(/={2,}[\w\s]+={2,}/g, "");
        // remove double spaces
        wikiSentence = wikiSentence.replace(/  +/g, " ");
        // add final period back in
        wikiSentence = wikiSentence + ".";
      }
      // Use the actual Wikipedia URL from the API (includes proper slug with disambiguation)
      wikiUrl = page.fullurl;
      // Fallback: construct URL from title if fullurl not available
      if (!wikiUrl) {
        wikiSlug = page.title.replace(/ /g, "_");
        wikiUrl = `https://${lang}.wikipedia.org/wiki/${wikiSlug}`;
      }
    }
  }
  // return <div>another new intro here...</div>;

  return (
    <section className="intro-section person">
      <div className="intro-deco">
        <div className="deco-lines">
          {Array(decoLines)
            .fill()
            .map((d, i) => (
              <span
                key={i}
                className="deco-line"
                style={{backgroundColor}}
              ></span>
            ))}
        </div>
      </div>
      <div className="intro-content">
        <div className="person-image-wrapper">
          <PersonImage
            fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
            src={`/profile/people/${person.id}.jpg`}
            alt={`Photo of ${person.name}`}
          />
          {person.twitter && (
            <a
              href={`https://x.com/${person.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="twitter-icon-link"
            >
              <Image
                src="/images/logos/icons-x-logo-50.png"
                alt="X (Twitter) profile"
                width={20}
                height={20}
              />
            </a>
          )}
        </div>
        <div className="intro-text">
          <h3>
            <Image
              src="/images/ui/profile-w.svg"
              alt="Icon of person"
              width={24}
              height={24}
            />{" "}
            {person.name}
          </h3>
          {wikiSentence ? (
            <p>
              {wikiSentence}{" "}
              <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
                {t.readMoreWikipedia}
              </a>
            </p>
          ) : null}
          <p
            dangerouslySetInnerHTML={{
              __html:
                t.intro.rankingSentence({
                  name: person.name,
                  gender: person.gender,
                  l: personRanks.l,
                  l_prev: personRanks.l_prev,
                  occupationRank,
                  occupationRankPrev,
                  occupation: person.occupation.occupation,
                  occupationSlug: person.occupation.occupation_slug,
                  bplaceCountryRank,
                  bplaceCountryRankPrev,
                  country: person.bplace_country?.country,
                  countrySlug: person.bplace_country?.slug,
                  bplaceCountryOccupationRank,
                  demonym: person.bplace_country?.demonym,
                  nationalityAdj: person.bplace_country?.nationalityAdj,
                  fromCountry: person.bplace_country?.fromCountry,
                  formatOrdinal: FORMATTERS.ordinal,
                }) +
                (ranklessUrl
                  ? ` <a href="${ranklessUrl}">${t.learnMoreRankless.replace("{name}", person.name)}</a>.`
                  : ""),
            }}
          />
          {person.famous_for && lang === "en" ? <p>{person.famous_for}</p> : null}
        </div>
      </div>
    </section>
  );
};

export default Intro;
