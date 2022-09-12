import React from "react";
import PropTypes from "prop-types";
import AnchorList from "components/utils/AnchorList";
import "pages/profile/common/Intro.css";
import {FORMATTERS} from "types/index";
import {nest} from "d3-collection";
import {plural} from "pluralize";

const Intro = ({place, country, placeRanks, peopleBornHere, peopleDiedHere, wikiSummary}) => {
  // console.log("placeRanks!!!", placeRanks);
  // return <div>intro</div>;
  const myIndex = placeRanks ? placeRanks.findIndex(p => p.place === place.place) : null;
  let wikiLink, wikiSentence;

  const occupationsBorn = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({num_born: leaves.length, occupation: leaves[0].occupation}))
    .entries(peopleBornHere.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value)
    .slice(0, 2);
  const occupationsDied = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({num_died: leaves.length, occupation: leaves[0].occupation}))
    .entries(peopleDiedHere.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value)
    .slice(0, 2);

  // // wikipedia excerpt
  // if (wikiExtract) {
  //   if (wikiExtract.query) {
  //     if (wikiExtract.query.pages) {
  //       const results = Object.values(wikiExtract.query.pages);
  //       if (results.length) {
  //         wikiSentence = results[0].extract;
  //         wikiSentence = wikiSentence.slice(0, wikiSentence.lastIndexOf(". "));
  //         wikiSlug = results[0].title.replace(" ", "_");
  //       }
  //     }
  //   }
  // }
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
            <img src="/images/ui/profile-w.svg" alt="Icon of place" />
            {place.place}
          </h3>
          <p>
            {placeRanks
              ? <span>{place.place} ranks {FORMATTERS.ordinal(place.born_rank_unique)} in number of biographies on Pantheon, behind <AnchorList items={placeRanks.slice(Math.max(0, myIndex - 3), myIndex)} name={d => d.place} url={d => `/profile/place/${d.slug}/`} />. </span>
              : null}
            {peopleBornHere.length
              ? <span>Memorable people born in {place.place} include <AnchorList items={peopleBornHere.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span>
              : null}
            {peopleDiedHere.length
              ? <span> Memorable people who died in {place.place} include <AnchorList items={peopleDiedHere.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span>
              : null}
            {occupationsBorn.length
              ? <span> {place.place} has been the birth place of many <AnchorList items={occupationsBorn} name={d => plural(d.occupation.occupation.toLowerCase())} url={d => `/profile/occupation/${d.occupation.occupation_slug}/`} /></span>
              : null}
            {occupationsDied.length
              ? <span> and the death place of many <AnchorList items={occupationsDied} name={d => plural(d.occupation.occupation.toLowerCase())} url={d => `/profile/occupation/${d.occupation.occupation_slug}/`} />.</span>
              : <span>.</span>}
            {country ? <span> {place.place} is located in <a href={`/profile/country/${country.slug}`}>{country.country}</a>.</span> : null}
          </p>
          {wikiSentence
            ? <p>{wikiSentence} <a href={wikiLink} target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>
            : null}
        </div>
      </div>
    </section>
  );
};

Intro.propTypes = {
  person: PropTypes.object
};

export default Intro;
