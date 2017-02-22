import React, {Component, PropTypes} from "react";
import styles from "css/components/profile/section";
import downloadSvg from "images/icon-download.svg";
import shareSvg from "images/icon-share.svg";

const Section = ({children, index, numSections, slug, title}) => {
  return (
    <section className="profile-section" key={slug}>
      <div className="section-head">
        <div className="section-title">
          <a name={slug}><h4>{title}</h4></a>
          <span className="section-nav">
            {[...Array(numSections)].map((x, i) =>
              i === index ? <span key={i} className="icon-circle active"></span> : <span key={i} className="icon-circle"></span>
            )}
          </span>
        </div>
        <div className="section-actions">
          <a className="section-share"><img src={shareSvg} alt={`Share this visualization`} /></a>
          <a className="section-download"><img src={downloadSvg} alt={`Download this visualization`} /></a>
        </div>
      </div>
      <div className="section-body">
        { children }
      </div>
    </section>
  );
};

export default Section;
