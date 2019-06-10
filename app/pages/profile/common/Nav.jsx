import React from "react";
import {AnchorLink} from "@datawheel/canon-core";
import "pages/profile/common/Nav.css";

const Nav = ({sections}) =>
  <nav className="profile-nav">
    <ol className="profile-nav-list">
      {sections.map(section =>
        <li className="profile-nav-item" key={section.slug}>
          <AnchorLink to={section.slug} className={`profile-nav-link ${section.slug}`}>
            <span className="profile-nav-link-title">{section.title}</span>
            <span className="jump-to-text" ariaHidden>Jump to</span>
          </AnchorLink>
        </li>
      )}
    </ol>
  </nav>;

export default Nav;
