import React from "react";
import Link from "next/link";
import "./Nav.css";

const Nav = ({ sections }) => (
  <nav className="profile-nav">
    <ol className="profile-nav-list">
      {sections.map((section) => (
        <li className="profile-nav-item" key={section.slug}>
          <Link
            href={section.slug}
            className={`profile-nav-link ${section.slug}`}
          >
            <span className="profile-nav-link-roman-numeral"></span>
            <span className="profile-nav-link-title">{section.title}</span>
            <span className="jump-to-text" aria-hidden>
              {" "}
              »
            </span>
          </Link>
        </li>
      ))}
    </ol>
  </nav>
);

export default Nav;
