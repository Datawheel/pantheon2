import React from "react";
import Link from "next/link";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import SectionHead from "pages/profile/common/SectionHead";
import PersonImage from "components/utils/PersonImage";
import { FORMATTERS } from "types";
import { toTitleCase } from "viz/helpers";
import { plural } from "pluralize";
import "pages/profile/occupation-country/sections/TopTen.css";

const getSummary = (wikiSummaries, id) => {
  if (wikiSummaries && wikiSummaries.query) {
    if (wikiSummaries.query.pages) {
      const thisWikiSummary = wikiSummaries.query.pages[parseInt(id, 10)];
      if (thisWikiSummary) {
        return thisWikiSummary.extract || "";
      }
      return "";
    }
    return "";
  }
  return "";
};

const TopTen = ({ country, people, occupation, wikiSummaries }) => {
  const number1 = people[0];
  return (
    <section className="profile-section top-10">
      <h2>Top {people.length >= 10 ? 10 : people.length}</h2>
      <p>
        The following people are considered by Pantheon to be the{" "}
        {people.length >= 10 ? "top 10" : null} most legendary {country.demonym}{" "}
        {toTitleCase(plural(occupation.occupation))} of all time. This list of
        famous {country.demonym} {toTitleCase(plural(occupation.occupation))} is
        sorted by HPI (Historical Popularity Index), a metric that aggregates
        information on a biography’s online popularity.
        {people.length >= 10 ? (
          <React.Fragment>
            {" "}
            Visit the rankings page to view the entire list of{" "}
            <a
              href={`/explore/rankings?show=people&place=${country.country_code}&occupation=${occupation.occupation}`}
            >
              {country.demonym} {toTitleCase(plural(occupation.occupation))}
            </a>
            .
          </React.Fragment>
        ) : null}
      </p>
      <div className="section-body">
        <div className="top-person">
          <div className="top-person-img">
            <PersonImage
              fallbackSrc="/images/icons/icon-person.svg"
              src={`/images/profile/people/${number1.id}.jpg`}
              alt={`Photo of ${number1.name}`}
            />
          </div>
          <div className="top-person-details">
            <h3>
              1.{" "}
              <a href={`/profile/person/${number1.slug}`}>
                {number1.name} ({number1.birthyear} - {number1.deathyear})
              </a>
            </h3>
            <p>
              With an HPI of {FORMATTERS.decimal(number1.hpi)}, {number1.name}{" "}
              is the most famous {country.demonym}{" "}
              {toTitleCase(occupation.occupation)}. &nbsp;
              {number1.gender
                ? number1.gender === "M"
                  ? "His"
                  : "Her"
                : "Their"}{" "}
              biography has been translated into {number1.l} different languages
              on wikipedia.
            </p>
            <p className="wiki-summary">
              {getSummary(wikiSummaries, number1.id)}
            </p>
          </div>
        </div>
        {people.slice(1, 10).map((person, i) => (
          <div className="top-person" key={person.id}>
            <div className="top-person-img">
              <PersonImage
                fallbackSrc="/images/icons/icon-person.svg"
                src={`/images/profile/people/${person.id}.jpg`}
                alt={`Photo of ${person.name}`}
              />
            </div>
            <div className="top-person-details">
              <h3>
                {i + 2}.{" "}
                <a href={`/profile/person/${person.slug}`}>
                  {person.name} ({person.birthyear} - {person.deathyear})
                </a>
              </h3>
              <p>
                With an HPI of {FORMATTERS.decimal(person.hpi)}, {person.name}{" "}
                is the {FORMATTERS.ordinal(i + 2)} most famous {country.demonym}{" "}
                {toTitleCase(occupation.occupation)}. &nbsp;
                {person.gender
                  ? person.gender === "M"
                    ? "His"
                    : "Her"
                  : "Their"}{" "}
                biography has been translated into {person.l} different
                languages.
              </p>
              <p className="wiki-summary">
                {getSummary(wikiSummaries, person.id)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopTen;
