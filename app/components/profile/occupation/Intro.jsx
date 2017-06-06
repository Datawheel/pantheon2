import React from "react";
import PropTypes from "prop-types";
import AnchorList from "components/utils/AnchorList";
import "css/components/profile/intro";
import iconProfW from "images/globalNav/profile-w.svg";
import {plural} from "pluralize";
import {FORMATTERS} from "types";

const Intro = ({occupation, occupations}) => {
  const myIndex = occupations.findIndex(o => o.id === occupation.id);

  return (
    <section className={"intro-section"}>
      <div className={"intro-content"}>
        <div className={"intro-text"}>
          <h3>
            <img src={iconProfW} />
            What is the cultural export of {plural(occupation.occupation)}?
          </h3>
          <p>
            {plural(occupation.occupation)} { myIndex ? <span>rank {FORMATTERS.ordinal(myIndex+1)}</span> : <span>are the top ranked profession</span> } for producing culturally remembered individuals{ myIndex ? <span>, behind <AnchorList items={occupations.slice(Math.max(0, myIndex-3), myIndex)} name={o => plural(o.occupation)} url={p => `/profile/occupation/${p.slug}/`} /></span> : null }.
            Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
          </p>
        </div>
      </div>
    </section>
  );
};

Intro.propTypes = {
  occupation: PropTypes.object
};

export default Intro;
