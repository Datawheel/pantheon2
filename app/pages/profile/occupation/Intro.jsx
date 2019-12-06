import React from "react";
import AnchorList from "components/utils/AnchorList";
import "pages/profile/common/Intro.css";
import {plural} from "pluralize";
import {toTitleCase} from "viz/helpers";
import {FORMATTERS} from "types";

const Intro = ({occupation, occupations}) => {
  const myIndex = occupations.findIndex(o => o.id === occupation.id);

  return (
    <section className="intro-section">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" />
          </h3>
          <p>
            With {FORMATTERS.commas(occupation.num_born)} biographies, {toTitleCase(plural(occupation.occupation))} are the { myIndex ? <span>{FORMATTERS.ordinal(myIndex + 1)}</span> : <span>are the top ranked profession</span> } most common occupation in Pantheon{ myIndex ? <span>, behind <AnchorList items={occupations.slice(Math.max(0, myIndex - 3), myIndex)} name={o => toTitleCase(plural(o.occupation))} url={o => `/profile/occupation/${o.occupation_slug}/`} /></span> : null }.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;
