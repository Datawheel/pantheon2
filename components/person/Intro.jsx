import PersonImage from "../utils/PersonImage";
import {toTitleCase} from "../utils/vizHelpers";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import "../common/Intro.css";
import Image from "next/image";

const Intro = ({person, personRanks, wikiExtract, ranklessUrl}) => {
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

  // wikipedia excerpt
  if (wikiExtract && wikiExtract.query && wikiExtract.query.pages) {
    const page = wikiExtract.query.pages[person.id];
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
      wikiSlug = wikiExtract.query.pages[`${person.id}`].title.replace(
        " ",
        "_"
      );
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
        <PersonImage
          fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
          src={`/profile/people/${person.id}.jpg`}
          alt={`Photo of ${person.name}`}
        />
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
              <a
                href={`https://en.wikipedia.org/wiki/${wikiSlug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more on Wikipedia
              </a>
            </p>
          ) : (
            <p>
              {person.name} {person.deathyear ? "was" : "is"} a{" "}
              <a
                href={`/profile/occupation/${person.occupation.occupation_slug}`}
              >
                {person.occupation.occupation.toLowerCase()}
              </a>
              {!person.bplace_country && !person.bplace_name ? (
                <span>. </span>
              ) : (
                <span> {fromSentence}</span>
              )}
              {person.deathyear
                ? `${person.name} died at ${age} years old in ${FORMATTERS.year(
                    person.deathyear.name
                  )}.`
                : `${person.name} is currently ${age} years old.`}
            </p>
          )}
          <p>
            {/* <>
              Since 2007, the English Wikipedia page of {person.name} has
              received more than {FORMATTERS.commas(totalPageViews)} page views.{" "}
            </> */}
            <>
              {person.gender
                ? person.gender === "M"
                  ? "His"
                  : "Her"
                : "Their"}{" "}
              biography is available in {personRanks.l} different languages on
              Wikipedia
              {personRanks.l_prev && personRanks.l !== personRanks.l_prev
                ? ` (${
                    personRanks.l > personRanks.l_prev ? "up" : "down"
                  } from ${personRanks.l_prev} in 2024)`
                : ""}
              .{" "}
            </>
            <>
              {person.name} is the{" "}
              {occupationRank === 1 ? "" : FORMATTERS.ordinal(occupationRank)}{" "}
              most popular{" "}
              <a
                href={`/profile/occupation/${person.occupation.occupation_slug}`}
              >
                {person.occupation.occupation.toLowerCase()}
              </a>
              {occupationRankPrev && occupationRankPrev !== occupationRank
                ? ` (${
                    occupationRank < occupationRankPrev ? "up" : "down"
                  } from ${FORMATTERS.ordinal(occupationRankPrev)} in 2024)`
                : ""}
            </>
            <>
              {!person.bplace_country ? (
                <span>.</span>
              ) : (
                <span>
                  , the{" "}
                  {bplaceCountryRank !== 1
                    ? FORMATTERS.ordinal(bplaceCountryRank)
                    : ""}{" "}
                  most popular biography from{" "}
                  <a href={`/profile/place/${person.bplace_country.slug}`}>
                    {person.bplace_country.country}
                  </a>
                </span>
              )}
              {bplaceCountryRankPrev &&
              bplaceCountryRankPrev !== bplaceCountryRank
                ? ` (${
                    bplaceCountryRank < bplaceCountryRankPrev ? "up" : "down"
                  } from ${FORMATTERS.ordinal(bplaceCountryRankPrev)} in 2019)`
                : !person.bplace_country
                ? ""
                : ""}
              {bplaceCountryOccupationRank && person.bplace_country ? (
                <span>
                  {" "}
                  and the{" "}
                  {bplaceCountryOccupationRank !== 1
                    ? FORMATTERS.ordinal(bplaceCountryOccupationRank)
                    : ""}{" "}
                  most popular{" "}
                  <a
                    href={`/profile/occupation/${person.occupation.occupation_slug}/country/${person.bplace_country.slug}`}
                  >
                    {person.bplace_country.demonym}{" "}
                    {toTitleCase(person.occupation.occupation)}
                  </a>
                  .
                </span>
              ) : (
                ""
              )}
              {ranklessUrl ? (
                <span>
                  {" "}
                  Learn more about{" "}
                  <a href={ranklessUrl}>
                    {person.name}&apos;s academic impact at Rankless
                  </a>
                  .
                </span>
              ) : null}
            </>
          </p>
          {person.famous_for ? <p>{person.famous_for}</p> : null}
        </div>
      </div>
    </section>
  );
};

export default Intro;
