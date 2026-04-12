import Link from "next/link";

import "../../../styles/Misc.css";
import "../../../styles/About.css";

export default function AboutLayout({children}) {
  return (
    <div className="about-page">
      <nav className="page-nav" role="navigation">
        <ul className="page-items">
          <li className="item">
            <Link
              href="/about/vision"
              className="item-link"
              activeClassName="is-active"
            >
              Vision
            </Link>
          </li>
          <li className="item">
            <Link
              href="/about/methods"
              className="item-link"
              activeClassName="is-active"
            >
              Methods
            </Link>
          </li>
          <li className="item">
            <Link
              href="/about/team"
              className="item-link"
              activeClassName="is-active"
            >
              Team
            </Link>
          </li>
          <li className="item">
            <Link
              href="/about/publications"
              className="item-link"
              activeClassName="is-active"
            >
              Publications
            </Link>
          </li>
          <li className="item">
            <Link
              href="/about/data_sources"
              className="item-link"
              activeClassName="is-active"
            >
              Data Sources
            </Link>
          </li>
          <li className="item">
            <Link
              href="/about/contact"
              className="item-link"
              activeClassName="is-active"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}
