import React from "react";
import "pages/profile/common/Nav.css";

const Nav = ({sections}) =>
  <nav className="profile-nav">
    <ol>
      {sections.map(section =>
        <li key={section.slug}>
          <span>
            <a href={`#${section.slug}`} className={`${section.slug}`}>. {section.title}</a>
          </span>
          <span className="jump-to-link"><a href={`#${section.slug}`}>Jump to</a></span>
        </li>
      )}
    </ol>
  </nav>;

export default Nav;