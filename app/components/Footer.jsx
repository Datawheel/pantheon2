import React from "react";
import {Link} from "react-router";
import "components/Footer.css";

const Footer = () =>
  <div className="global-footer">
    <ul className="items site-map">
      <li className="item">
        <Link to="/explore/viz" className="item-link explore-link">Explore</Link>
        <ul className="sub-items">
          <li><a href="/explore/viz" className="item-link">Visualizations</a></li>
          <li><a href="/explore/rankings" className="item-link">Rankings</a></li>
        </ul>
      </li>

      <li className="item">
        <Link to="/profile/person" className="item-link profiles-link">Profiles</Link>
        <ul className="sub-items">
          <li><a href="/profile/person" className="item-link">People</a></li>
          <li><a href="/profile/place" className="item-link">Places</a></li>
          <li><a href="/profile/country" className="item-link">Countries</a></li>
          <li><a href="/profile/occupation" className="item-link">Occupations</a></li>
          <li><a href="/profile/select-occupation-country" className="item-link">Occupations / Countries</a></li>
          <li><a href="/profile/era" className="item-link">Eras</a></li>
        </ul>
      </li>

      {/* <li className="item">
        <Link to="/about/vision" className="item-link about-link">About</Link>
        <ul className="sub-items">
          <li><a href="/about/vision" className="item-link">Vision</a></li>
          <li><a href="/data/faq" className="item-link">FAQ</a></li>
          <li><a href="/about/team" className="item-link">Team</a></li>
          <li><a href="/about/publications" className="item-link">Publications</a></li>
          <li><a href="/about/methods" className="item-link">Methods</a></li>
          <li><a href="/about/data_sources" className="item-link">Data Sources</a></li>
          <li><a href="/about/contact" className="item-link">Contact</a></li>
        </ul>
      </li> */}
      <li className="item">
        <Link to="/data/faq" className="item-link about-link">About</Link>
        <ul className="sub-items">
          <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSdHKWwONdugZfwQvCvkSHakG-xeFh_HOZcvK3NqVOv19h0-jQ/viewform" target="_blank" rel="noopener noreferrer" className="item-link">Report Data Error</a></li>
          <li><Link to="/about/privacy" className="item-link about-link">Privacy Policy</Link></li>
          <li><Link to="/about/terms" className="item-link about-link">Terms of Service</Link></li>
        </ul>
      </li>

      <li className="item">
        <Link to="/data/permissions" className="item-link data-link">Data</Link>
        <ul className="sub-items">
          <li><a href="/data/permissions" className="item-link">Permissions</a></li>
          <li><a href="/data/datasets" className="item-link">Download</a></li>
          <li><Link to="/data/api" className="item-link api-link">API</Link></li>
        </ul>
      </li>

      <li className="item">
        <Link to="/app/yearbook" className="item-link data-link">Apps</Link>
        <ul className="sub-items">
          <li><a href="/app/yearbook" className="item-link">Yearbook</a></li>
        </ul>
      </li>
    </ul>

    <div className="sites right">
      <ul className="items authors">
        <li>
          <a href="https://www.datawheel.us/" target="_blank" rel="noopener noreferrer">
            <img src="/images/logos/logo_datawheel.png" alt="Datawheel" />
          </a>
        </li>
      </ul>
      <ul className="items share">
        <li>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
            <img src="/images/logos/logo_creative_commons.png" alt="Creative Commons" />
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/datawheel" target="_blank" rel="noopener noreferrer">
            <img src="/images/logos/logo_facebook.svg" alt="Facebook" />
          </a>
        </li>
        <li>
          <a href="https://twitter.com/PantheonW" target="_blank" rel="noopener noreferrer">
            <img src="/images/logos/logo_twitter.svg" alt="Creative Commons" />
          </a>
        </li>
      </ul>
    </div>
  </div>;

export default Footer;
