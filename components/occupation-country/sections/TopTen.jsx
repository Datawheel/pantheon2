import {plural} from "pluralize";
import PersonImage from "../../utils/PersonImage";
import {toTitleCase} from "../../utils/vizHelpers";
import {FORMATTERS} from "../../utils/consts";
import "../../common/Section.css";
import "./TopTen.css";
import GoogleAdSense from "../../common/GoogleAdSense";
import GoogleAdSenseScript from "../../common/GoogleAdSenseScript";
import React from "react";

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

async function getWikiPageSummaries(top10Ids) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${top10Ids}&origin=*`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );
  return res.json();
}

export default async function TopTen({country, occupation, people}) {
  const number1 = people[0];
  const top10Ids = people
    .slice(0, 10)
    .map(p => p.id)
    .join("|");
  const wikiPageSummaries = await getWikiPageSummaries(top10Ids);
  return (
    <section className="profile-section top-10">
      <GoogleAdSenseScript />
      <h2>Top {people.length >= 10 ? 10 : people.length}</h2>
      <p>
        The following people are considered by Pantheon to be the{" "}
        {people.length >= 10 ? "top 10" : null} most legendary {country.demonym}{" "}
        {toTitleCase(plural(occupation.occupation))} of all time. This list of
        famous {country.demonym} {toTitleCase(plural(occupation.occupation))} is
        sorted by HPI (Historical Popularity Index), a metric that aggregates
        information on a biography&apos;s online popularity.
        {people.length >= 10 ? (
          <>
            {" "}
            Visit the rankings page to view the entire list of{" "}
            <a
              href={`/explore/rankings?show=people&place=${country.country_code}&occupation=${occupation.occupation}`}
            >
              {country.demonym} {toTitleCase(plural(occupation.occupation))}
            </a>
            .
          </>
        ) : null}
      </p>
      <div className="section-body">
        <div className="top-person">
          <div className="top-person-img">
            <PersonImage
              fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
              src={`/profile/people/${number1.id}.jpg`}
              alt={`Photo of ${number1.name}`}
            />
          </div>
          <div className="top-person-details">
            <h3>
              1.{" "}
              <a href={`/profile/person/${number1.slug}`}>
                {number1.name}{" "}
                {number1.deathyear ? (
                  <span>
                    ({number1.birthyear} - {number1.deathyear})
                  </span>
                ) : (
                  <span>(b. {number1.birthyear})</span>
                )}
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
              {getSummary(wikiPageSummaries, number1.id)}
            </p>
          </div>
        </div>
        <GoogleAdSense adClient="ca-pub-1706971377772539" adSlot="2596594359" />
        {people.slice(1, 10).map((person, i) => (
          <React.Fragment key={person.id}>
            <div className="top-person">
              <div className="top-person-img">
                <PersonImage
                  fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                  src={`/profile/people/${person.id}.jpg`}
                  alt={`Photo of ${person.name}`}
                />
              </div>
              <div className="top-person-details">
                <h3>
                  {i + 2}.{" "}
                  <a href={`/profile/person/${person.slug}`}>
                    {person.name}{" "}
                    {person.deathyear ? (
                      <span>
                        ({person.birthyear} - {person.deathyear})
                      </span>
                    ) : (
                      <span>(b. {person.birthyear})</span>
                    )}
                  </a>
                </h3>
                <p>
                  With an HPI of {FORMATTERS.decimal(person.hpi)}, {person.name}{" "}
                  is the {FORMATTERS.ordinal(i + 2)} most famous{" "}
                  {country.demonym} {toTitleCase(occupation.occupation)}. &nbsp;
                  {person.gender
                    ? person.gender === "M"
                      ? "His"
                      : "Her"
                    : "Their"}{" "}
                  biography has been translated into {person.l} different
                  languages.
                </p>
                <p className="wiki-summary">
                  {getSummary(wikiPageSummaries, person.id)}
                </p>
              </div>
            </div>
            {(i === 1 || i === 6) && (
              <GoogleAdSense
                adClient="ca-pub-1706971377772539"
                adLayoutKey="-fy-4i+hl-6o-xh"
                adSlot={i === 1 ? "5507259348" : "3048020496"}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
