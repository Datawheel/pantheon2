import React from "react";
import "pages/profile/common/Intro.css";
import PersonImage from "components/utils/PersonImage";
import {FORMATTERS} from "types";
import {COLORS_DOMAIN} from "types";

const Intro = ({person, totalPageViews, wikiExtract}) => {
  const occupationRank = person.occupation_rank_unique;
  const birthcountryRank = person.birthcountry_rank_unique ? person.birthcountry_rank_unique : null;
  const backgroundColor = COLORS_DOMAIN[person.occupation.domain_slug];
  const decoLines = 14;
  let age = 0;
  if (person.birthyear) {
    age = person.deathyear !== null
      ? person.deathyear.id - person.birthyear.id
      : new Date().getFullYear() - person.birthyear.id;
  }

  let fromSentence, wikiSentence, wikiSlug;
  if (!person.birthplace) {

    /* Example test case person:
        pope_pius_ii
        sergej_barbarez (w/o country)
    */
    const birthplace = person.bplace_name ? `${person.bplace_name}, ` : "";
    const birthcountry = person.birthcountry ? <span> in {birthplace}<a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a></span> : ` in ${birthplace.replace(", ", "")}`;
    fromSentence = person.birthyear ? <span>born in {FORMATTERS.year(person.birthyear.name)}{birthcountry}. </span> : null;
  }
  else if (person.geacron_name !== person.birthcountry.name) {
    fromSentence = person.birthyear
      ? <span>born in {FORMATTERS.year(person.birthyear.name)} in {person.bplace_name}, {person.geacron_name} which is now part of modern day <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>. </span>
      : null;
  }
  else {
    const birthplace = person.birthplace.state
      ? <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}, {person.birthplace.state}</a>
      : <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>;
    if (person.bplace_name !== person.birthplace.name) {

      /* Example test case person:
          jack_nicholson (w/ state)
          jack_nicholson (w/o state)
      */
      fromSentence = <span>born in {FORMATTERS.year(person.birthyear.name)} in {person.bplace_name}, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a> which is near {birthplace}. </span>;
    }
    else {

      /* Example test case person:
          ada_lovelace (w/ state)
          bud_spencer (w/o state)
      */
      fromSentence = person.birthyear
        ? <span>born in {FORMATTERS.year(person.birthyear.name)} in {birthplace}, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>. </span>
        : null;
    }
  }

  // wikipedia excerpt
  if (wikiExtract) {
    if (wikiExtract.query) {
      if (wikiExtract.query.pages) {
        if (wikiExtract.query.pages[`${person.id}`]) {
          wikiSentence = wikiExtract.query.pages[`${person.id}`].extract;
          // take up until last full sentence
          wikiSentence = wikiSentence.slice(0, wikiSentence.lastIndexOf(". "));
          // remove line breaks
          wikiSentence = wikiSentence.replace(/(\r\n|\n|\r)/gm, " ");
          // remove all wiki markup (replace all instances of 2 or more `=` signs)
          wikiSentence = wikiSentence.replace(/={2,}[\w\s]+={2,}/g, "");
          // remove double spaces
          wikiSentence = wikiSentence.replace(/  +/g, " ");
          wikiSlug = wikiExtract.query.pages[`${person.id}`].title.replace(" ", "_");
        }
      }
    }
  }

  return (
    <section className="intro-section person">
      <div className="intro-deco">
        <div className="deco-lines">
          {Array(decoLines).fill().map((d, i) => <span key={i} className="deco-line" style={{backgroundColor}}></span>)}
        </div>
      </div>
      <div className="intro-content">
        <PersonImage src={`/images/profile/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" /> {person.name}
          </h3>
          {wikiSentence
            ? <p>{wikiSentence}. <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>
            : <p>
              {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
              {!person.birthcountry && !person.bplace_name ? <span>. </span> : <span> {fromSentence}</span>}
              {person.deathyear
                ? `${person.name} died at ${age} years old in ${FORMATTERS.year(person.deathyear.name)}.`
                : `${person.name} is currently ${age} years old.`}
            </p>}
          <p>
            <React.Fragment>Since 2007, {person.gender ? "his" : "her"} Wikipedia page in English has received more than {FORMATTERS.commas(totalPageViews)} page views. </React.Fragment>
            <React.Fragment>{person.gender ? "His" : "Her"} biography is available in {person.langs} different languages on Wikipedia making {person.gender ? "him" : "her"} the {FORMATTERS.ordinal(occupationRank)} most popular <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a></React.Fragment>
            <React.Fragment>{!person.birthcountry ? <span>.</span> : <span> and the {birthcountryRank !== 1 ? FORMATTERS.ordinal(birthcountryRank) : ""} most popular biography from <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>.</span>}</React.Fragment>
          </p>
        </div>
      </div>
    </section>
  );


  return (
    <section className="intro-section person">
      <div className="intro-deco">
        <div className="deco-lines">
          {Array(decoLines).fill().map((d, i) => <span key={i} className="deco-line" style={{backgroundColor}}></span>)}
        </div>
      </div>
      <div className="intro-content">
        <PersonImage src={`/images/profile/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" /> {person.name}
          </h3>
          {wikiSentence
            ? <p>{wikiSentence}. <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a></p>
            : <p>
              {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
              {!person.birthcountry && !person.bplace_name ? <span>. </span> : <span> {fromSentence}</span>}
              {person.deathyear
                ? `${person.name} died at ${age} years old in ${FORMATTERS.year(person.deathyear.name)}.`
                : `${person.name} is currently ${age} years old.`}
            </p>}
          <p>
            <React.Fragment>Since 2007, {person.gender ? "his" : "her"} Wikipedia page in English has received more than {FORMATTERS.commas(totalPageViews)} page views. </React.Fragment>
            <React.Fragment>{person.gender ? "His" : "Her"} biography is available in {person.langs} different languages on Wikipedia making {person.gender ? "him" : "her"} the {FORMATTERS.ordinal(occupationRank)} most popular <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a></React.Fragment>
            <React.Fragment>{!person.birthcountry ? <span>.</span> : <span> and the {birthcountryRank !== 1 ? FORMATTERS.ordinal(birthcountryRank) : ""} most popular biography from <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>.</span>}</React.Fragment>
          </p>
        </div>
      </div>
    </section>
  );
};

// Intro.propTypes = {
//   person: PropTypes.object
// };
//
// function mapStateToProps(state) {
//   return {
//     person: state.personProfile.person
//   };
// }

// export default connect(mapStateToProps)(Intro);
export default Intro;
