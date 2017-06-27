import React from "react";
import PropTypes from "prop-types";
import AnchorList from "components/utils/AnchorList";
import "css/components/profile/intro";
import iconProfW from "images/globalNav/profile-w.svg";
import {plural} from "pluralize";
import {FORMATTERS} from "types";

const Intro = ({occupation, occupations}) => {
  const myIndex = occupations.findIndex(o => o.id === occupation.id);
  console.log(occupation)

  return (
    <section className={"intro-section"}>
      <div className={"intro-content"}>
        <div className={"intro-text"}>
          <h3>
            <img src={iconProfW} />
          </h3>
          <p>
            With {FORMATTERS.commas(occupation.num_born)} biographies, {plural(occupation.occupation)} are the { myIndex ? <span>{FORMATTERS.ordinal(myIndex+1)}</span> : <span>are the top ranked profession</span> } most common occupation in Pantheon{ myIndex ? <span>, behind <AnchorList items={occupations.slice(Math.max(0, myIndex-3), myIndex)} name={o => plural(o.occupation)} url={p => `/profile/occupation/${p.slug}/`} /></span> : null }.
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
