import React from "react";
import {FORMATTERS} from "types/index";

const SectionHead = ({index, numSections, title}) =>
  <div className="section-head">
    <div className="section-title">
      <h4><a name={FORMATTERS.slugify(title)}>{title}</a></h4>
      <span className="section-nav">
        {[...Array(numSections)].map((x, i) =>
          i === index ? <span key={i} className="icons/icon-circle active"></span> : <span key={i} className="icon-circle"></span>
        )}
      </span>
    </div>
  </div>;

export default SectionHead;
