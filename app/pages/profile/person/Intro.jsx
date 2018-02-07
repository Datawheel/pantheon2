import React from "react";
import "pages/profile/common/Intro.css";
import PersonImage from "components/utils/PersonImage";
import {FORMATTERS} from "types";
import {COLORS_DOMAIN} from "types";

const Intro = ({person, totalPageViews}) => {
  const occupationRank = person.occupation_rank_unique;
  const birthcountryRank = person.countryRank ? person.me.birthcountry_rank_unique : null;
  const age = person.deathyear !== null
          ? person.deathyear.id - person.birthyear.id
          : new Date().getFullYear() - person.birthyear.id,
        backgroundColor = COLORS_DOMAIN[person.occupation.domain_slug],
        decoLines = 14;

  let fromSentence;
  if (!person.birthplace) {

    /* Example test case person:
        pope_pius_ii
        sergej_barbarez (w/o country)
    */
    const birthplace = person.bplace_name ? `${person.bplace_name}, ` : "";
    const birthcountry = person.birthcountry ? <span> in {birthplace}<a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a></span> : ` in ${birthplace.replace(", ", "")}`;
    fromSentence = <span>born in {FORMATTERS.year(person.birthyear.name)}{birthcountry}. </span>;
  }
  else if (person.geacron_name !== person.birthcountry.name) {
    fromSentence = <span>born in {FORMATTERS.year(person.birthyear.name)} in {person.bplace_name}, {person.geacron_name} which is now part of modern day <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>. </span>;
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
      fromSentence = <span>born in {FORMATTERS.year(person.birthyear.name)} in {birthplace}, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>. </span>;
    }
  }

  // <p>
  //   {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
  //   {!person.birthcountry && !person.bplace_name ? <span>. </span> : <span> {fromSentence}</span>}
  //   {person.deathyear
  //     ? `${person.gender ? " He" : " She"} lived to be ${age} before passing in ${FORMATTERS.year(person.deathyear.name)}.` : null }
  //   &nbsp;Since the start of Wikipedia, {person.gender ? "he" : "she"} has accumulated {FORMATTERS.commas(totalPageViews)} page views, spanning {person.langs} total different language editions.
  //   By analyzing all "globally remembered people," Pantheon aims to understand cultural development through changes in occupations, birth and death places, and Wikipedia activity.&nbsp;
  //   <a href="/about/" className="deep-link">Read about our methods</a>
  // </p>

  return (
    <section className="intro-section person">
      <div className="intro-deco">
        <div className="deco-lines">
          { Array(decoLines).fill().map((d, i) => <span key={i} className="deco-line" style={{backgroundColor}}></span>) }
        </div>
      </div>
      <div className="intro-content">
        <PersonImage src={`/images/profile/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" /> {person.name}
          </h3>
          <p>
            {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
            {!person.birthcountry && !person.bplace_name ? <span>. </span> : <span> {fromSentence}</span>}
            {person.deathyear
              ? `${person.name} died at ${age} years old in ${FORMATTERS.year(person.deathyear.name)}.`
              : `${person.name} is currently ${age} years old.`}
            &nbsp;Since 2007, {person.gender ? "his" : "her"} Wikipedia page in English has received more than {FORMATTERS.commas(totalPageViews)} page views.
            &nbsp;{person.gender ? "His" : "Her"} biography is available in {person.langs} different languages on Wikipedia making {person.gender ? "him" : "her"} the {FORMATTERS.ordinal(occupationRank)} most popular <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>
            {!person.birthcountry ? <span>.</span> : <span> and {FORMATTERS.ordinal(birthcountryRank)} most popular biography from {person.birthcountry.name}.</span>}
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
