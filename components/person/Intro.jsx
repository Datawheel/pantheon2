import PersonImage from "../utils/PersonImage";
import {toTitleCase} from "../utils/vizHelpers";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import WikiExtract from "./WikiExtract";
import "../common/Intro.css";
import Image from "next/image";

const Intro = ({
  person,
  personRanks,
  ranklessUrl,
  lang = "en",
}) => {
  const t = getTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const {
    occupation_rank: occupationRank,
    occupation_rank_prev: occupationRankPrev,
    bplace_country_rank: bplaceCountryRank,
    bplace_country_rank_prev: bplaceCountryRankPrev,
    bplace_country_occupation_rank: bplaceCountryOccupationRank,
    occupation_rank_unique: occupationRankUnique,
    bplace_country_rank_unique: bplaceCountryRankUnique,
    bplace_country_occupation_rank_unique: bplaceCountryOccupationRankUnique,
  } = personRanks;
  const occupationRankDisplay = occupationRankUnique || occupationRank;
  const bplaceCountryRankDisplay = bplaceCountryRankUnique || bplaceCountryRank;
  const bplaceCountryOccupationRankDisplay =
    bplaceCountryOccupationRankUnique || bplaceCountryOccupationRank;
  const hasOccupationRank = occupationRankDisplay != null;
  const hasBplaceCountryRank = bplaceCountryRankDisplay != null;
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

  const rankingSentence = hasOccupationRank
    ? t.intro.rankingSentence({
        name: person.name,
        gender: person.gender,
        l: personRanks.l,
        // Translation functions use the API's historical snake_case key.
        // eslint-disable-next-line camelcase
        l_prev: personRanks.l_prev,
        occupationRank: occupationRankDisplay,
        occupationRankPrev,
        occupation: person.occupation.occupation,
        occupationSlug: person.occupation.occupation_slug,
        bplaceCountryRank: bplaceCountryRankDisplay,
        bplaceCountryRankPrev,
        country: hasBplaceCountryRank ? person.bplace_country?.country : null,
        countrySlug: person.bplace_country?.slug,
        bplaceCountryOccupationRank: bplaceCountryOccupationRankDisplay,
        demonym: person.bplace_country?.demonym || "",
        nationalityAdj: person.bplace_country?.nationalityAdj || "",
        fromCountry: person.bplace_country?.fromCountry || "",
        formatOrdinal: FORMATTERS.ordinal,
      })
    : "";
  const ranklessLink = ranklessUrl
    ? `<a href="${ranklessUrl}">${t.learnMoreRankless.replace("{name}", person.name)}</a>.`
    : "";
  const rankingHtml = [rankingSentence, ranklessLink].filter(Boolean).join(" ");

  let fromSentence;
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
          <a href={`${localePrefix}/profile/place/${person.bplace_country.slug}`}>
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
          <a href={`${localePrefix}/profile/place/${person.bplace_geonameid.slug}`}>
            {person.bplace_geonameid.place}
          </a>
          ,{" "}
          <a href={`${localePrefix}/profile/place/${person.bplace_country.slug}`}>
            {person.bplace_country.country}
          </a>
          .{" "}
        </span>
      ) : null;
    } else {
      const birthplace = person.bplace_geonameid.state ? (
        <a href={`${localePrefix}/profile/place/${person.bplace_geonameid.slug}`}>
          {person.bplace_geonameid.place}, {person.bplace_geonameid.state}
        </a>
      ) : (
        <a href={`${localePrefix}/profile/place/${person.bplace_geonameid.slug}`}>
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
            <a href={`${localePrefix}/profile/country/${person.bplace_country.slug}`}>
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
            <a href={`${localePrefix}/profile/country/${person.bplace_country.slug}`}>
              {person.bplace_country.country}
            </a>
            .{" "}
          </span>
        ) : null;
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
            person={person}
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
          <WikiExtract
            personSlug={person.slug}
            localizedName={person.name}
            lang={lang}
          />
          {rankingHtml ? (
            <p dangerouslySetInnerHTML={{__html: rankingHtml}} />
          ) : null}
          {person.famous_for && lang === "en" ? <p>{person.famous_for}</p> : null}
        </div>
      </div>
    </section>
  );
};

export default Intro;
