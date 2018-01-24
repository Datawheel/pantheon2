import React from "react";
import {FORMATTERS} from "types/index";

const SectionHead = ({index, numSections, title}) =>
  <div className="section-head">
    <div className="section-title">
      <a name={FORMATTERS.slugify(title)}><h4>{title}</h4></a>
      <span className="section-nav">
        {[...Array(numSections)].map((x, i) =>
          i === index ? <span key={i} className="icons/icon-circle active"></span> : <span key={i} className="icon-circle"></span>
        )}
      </span>
    </div>
    <div className="section-actions">
      <a className="section-share"><img src="/images/icons/icon-share.svg" alt="Share this visualization" /></a>
      <a className="section-download"><img src="/images/icons/icon-download.svg" alt="Download this visualization" /></a>
    </div>
  </div>;

export default SectionHead;
