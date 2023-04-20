import AnchorList from "../utils/AnchorList";
import { FORMATTERS } from "../utils/consts";
import { nest } from "d3-collection";
import { plural } from "pluralize";
import "../common/Intro.css";

async function getWikiSummary(countryName) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`
  );
  return res.json();
}

export default async function Intro({
  country,
  countryRanks,
  peopleBornHere,
  peopleDiedHere,
}) {
  const occupationsBorn = nest()
    .key((d) => d.occupation.id)
    .rollup((leaves) => ({
      num_born: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries(peopleBornHere.filter((d) => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map((d) => d.value)
    .slice(0, 2);
  const occupationsDied = nest()
    .key((d) => d.occupation.id)
    .rollup((leaves) => ({
      num_died: leaves.length,
      occupation: leaves[0].occupation,
    }))
    .entries(peopleDiedHere.filter((d) => d.occupation_id))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map((d) => d.value)
    .slice(0, 2);
  const myIndex = countryRanks
    ? countryRanks.findIndex((c) => c.country === country.country)
    : null;
  let wikiLink, wikiSentence;

  const wikiSummary = await getWikiSummary(country.country);

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
            <img src="/images/ui/profile-w.svg" alt="Icon of country" />
            {country.country}
          </h3>
          <p>
            {countryRanks ? (
              <span>
                {country.country} ranks{" "}
                {FORMATTERS.ordinal(country.born_rank_unique)} in number of
                biographies on Pantheon
                {country.born_rank_unique === 1 ? (
                  <></>
                ) : (
                  <>
                    , behind{" "}
                    <AnchorList
                      items={countryRanks.slice(
                        Math.max(0, myIndex - 3),
                        myIndex
                      )}
                      name={(d) => d.country}
                      url={(d) => `/profile/country/${d.slug}/`}
                    />
                  </>
                )}
                .{" "}
              </span>
            ) : null}
            {peopleBornHere.length ? (
              <span>
                Memorable people born in present day {country.country} include{" "}
                <AnchorList
                  items={peopleBornHere.slice(0, 3)}
                  name={(d) => d.name}
                  url={(d) => `/profile/person/${d.slug}/`}
                />
                .
              </span>
            ) : null}
            {peopleDiedHere ? (
              <span>
                {" "}
                Memorable people who died in {country.country} include{" "}
                <AnchorList
                  items={peopleDiedHere.slice(0, 3)}
                  name={(d) => d.name}
                  url={(d) => `/profile/person/${d.slug}/`}
                />
                .
              </span>
            ) : null}
            {occupationsBorn ? (
              <span>
                {" "}
                {country.country} has been the birth place of many{" "}
                <AnchorList
                  items={occupationsBorn}
                  name={(d) => plural(d.occupation.occupation.toLowerCase())}
                  url={(d) =>
                    `/profile/occupation/${d.occupation.occupation_slug}/`
                  }
                />
              </span>
            ) : null}
            {occupationsDied ? (
              <span>
                {" "}
                and the death place of many{" "}
                <AnchorList
                  items={occupationsDied}
                  name={(d) => plural(d.occupation.occupation.toLowerCase())}
                  url={(d) =>
                    `/profile/occupation/${d.occupation.occupation_slug}/`
                  }
                />
                .
              </span>
            ) : (
              <span>.</span>
            )}
          </p>
          {wikiSentence ? (
            <p>
              {wikiSentence}{" "}
              <a href={wikiLink} target="_blank" rel="noopener noreferrer">
                Read more on Wikipedia
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
