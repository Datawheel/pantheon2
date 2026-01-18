import {plural} from "pluralize";
import PersonImage from "../../utils/PersonImage";
import {toTitleCase} from "../../utils/vizHelpers";
import {FORMATTERS} from "../../utils/consts";
import {getTranslations} from "/app/translations";
import {DEFAULT_LOCALE} from "/app/locales";
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

// Get language links from English Wikipedia to find page titles in other languages
async function getLanguageLinks(pageIds, targetLang) {
  if (targetLang === "en") {
    // If target is English, no need to get language links
    return null;
  }

  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=langlinks&lllang=${targetLang}&pageids=${pageIds}&origin=*`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'User-Agent': 'Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)'
      },
    }
  );
  return res.json();
}

async function getWikiPageSummaries(top10Ids, locale = "en") {
  // Map locale codes to Wikipedia language codes
  const wikiLangMap = {
    ar: "ar",
    zh: "zh",
    nl: "nl",
    en: "en",
    fr: "fr",
    de: "de",
    hu: "hu",
    it: "it",
    ja: "ja",
    pl: "pl",
    pt: "pt",
    ru: "ru",
    es: "es",
  };

  const wikiLang = wikiLangMap[locale] || "en";

  if (wikiLang === "en") {
    // Fetch from English Wikipedia directly
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${top10Ids}&origin=*`,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'User-Agent': 'Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)'
        },
      }
    );
    return res.json();
  }

  // First, get language links from English Wikipedia
  const langLinks = await getLanguageLinks(top10Ids, wikiLang);

  if (!langLinks || !langLinks.query || !langLinks.query.pages) {
    return { query: { pages: {} } };
  }

  // Build map of English pageId to localized title
  const pageIdToLocalizedTitle = {};
  Object.entries(langLinks.query.pages).forEach(([pageId, page]) => {
    if (page.langlinks && page.langlinks.length > 0) {
      // Get the title in the target language
      pageIdToLocalizedTitle[pageId] = page.langlinks[0]["*"];
    }
  });

  // If no pages have translations, return empty
  if (Object.keys(pageIdToLocalizedTitle).length === 0) {
    return { query: { pages: {} } };
  }

  // Fetch summaries from the localized Wikipedia using titles
  const titles = Object.values(pageIdToLocalizedTitle).join("|");
  const res = await fetch(
    `https://${wikiLang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(titles)}&origin=*`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'User-Agent': 'Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)'
      },
    }
  );
  const localizedData = await res.json();

  // Map the localized page IDs back to original English page IDs
  if (!localizedData.query || !localizedData.query.pages) {
    return { query: { pages: {} } };
  }

  const mappedPages = {};
  Object.entries(pageIdToLocalizedTitle).forEach(([originalPageId, localizedTitle]) => {
    // Find the page in localizedData that matches this title
    const localizedPage = Object.values(localizedData.query.pages).find(
      page => page.title === localizedTitle
    );
    if (localizedPage) {
      // Map it back to the original English page ID
      mappedPages[originalPageId] = localizedPage;
    }
  });

  return { query: { pages: mappedPages } };
}

export default async function TopTen({country, occupation, people, locale = DEFAULT_LOCALE}) {
  const t = getTranslations(locale);
  const number1 = people[0];
  const top10Ids = people
    .slice(0, 10)
    .map(p => p.id)
    .join("|");
  const wikiPageSummaries = await getWikiPageSummaries(top10Ids, locale);

  // For English, use plural form with toTitleCase; for other languages, use the occupation as-is
  const occupationPlural = locale === "en"
    ? toTitleCase(plural(occupation.occupation))
    : occupation.occupation;

  const count = people.length >= 10 ? 10 : people.length;

  return (
    <section className="profile-section top-10">
      <GoogleAdSenseScript />
      <h2>{t.occupationCountry.top} {count}</h2>
      <p>
        {t.occupationCountry.topTenIntro({
          count,
          demonym: country.demonym,
          occupationPlural,
        })}
        {people.length >= 10 ? (
          <>
            {" "}
            {t.occupationCountry.visitRankings}{" "}
            <a
              href={`/explore/rankings?show=people&place=${country.country_code}&occupation=${occupation.occupation}`}
            >
              {country.demonym} {occupationPlural}
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
                    ({FORMATTERS.year(number1.birthyear)} -{" "}
                    {FORMATTERS.year(number1.deathyear)})
                  </span>
                ) : (
                  <span>(b. {FORMATTERS.year(number1.birthyear)})</span>
                )}
              </a>
            </h3>
            <p>
              {t.occupationCountry.withHpi({
                hpi: FORMATTERS.decimal(number1.hpi),
                name: number1.name,
              })}{" "}
              {t.occupationCountry.isMostFamous({
                demonym: country.demonym,
                occupation: locale === "en" ? toTitleCase(occupation.occupation) : occupation.occupation,
              })} &nbsp;
              {t.occupationCountry.biographyTranslated({
                possessive: "",
                count: number1.l,
              })} {t.occupationCountry.onWikipedia}.
            </p>
            {getSummary(wikiPageSummaries, number1.id) && (
              <p className="wiki-summary">
                {getSummary(wikiPageSummaries, number1.id)}
              </p>
            )}
          </div>
        </div>
        <div
          className="my-4"
          style={{
            minHeight: "250px",
            minWidth: "300px",
            margin: "0 0 40px",
          }}
        >
          <GoogleAdSense
            adClient="ca-pub-1706971377772539"
            adSlot="2596594359"
          />
        </div>
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
                        ({FORMATTERS.year(person.birthyear)} -{" "}
                        {FORMATTERS.year(person.deathyear)})
                      </span>
                    ) : (
                      <span>(b. {FORMATTERS.year(person.birthyear)})</span>
                    )}
                  </a>
                </h3>
                <p>
                  {t.occupationCountry.withHpi({
                    hpi: FORMATTERS.decimal(person.hpi),
                    name: person.name,
                  })}{" "}
                  {t.occupationCountry.isRankMostFamous({
                    rank: FORMATTERS.ordinal(i + 2),
                    demonym: country.demonym,
                    occupation: locale === "en" ? toTitleCase(occupation.occupation) : occupation.occupation,
                  })} &nbsp;
                  {t.occupationCountry.biographyTranslated({
                    possessive: "",
                    count: person.l,
                  })}.
                </p>
                {getSummary(wikiPageSummaries, person.id) && (
                  <p className="wiki-summary">
                    {getSummary(wikiPageSummaries, person.id)}
                  </p>
                )}
              </div>
            </div>
            {(i === 1 || i === 6) && (
              <div
                className="my-4"
                style={{
                  minHeight: "250px",
                  minWidth: "300px",
                  margin: "0 0 40px",
                }}
              >
                <GoogleAdSense
                  adClient="ca-pub-1706971377772539"
                  adLayoutKey="-fy-4i+hl-6o-xh"
                  adSlot={i === 1 ? "5507259348" : "3048020496"}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
