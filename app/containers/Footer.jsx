import React from "react";
import {Link} from "react-router";
import "css/components/navigation";
import mlLogo from "images/globalFooter/ml_logo.png";
import mcLogo from "images/globalFooter/CL_logo.svg";
import ccLogo from "images/globalFooter/cc.png";
import fb from "images/globalFooter/facebook.svg";
import tw from "images/globalFooter/twitter.svg";
import mail from "images/globalFooter/envelope-o.svg";
import dwLogo from "images/globalFooter/datawheel.png";

const Footer = () =>
      <div className="global-footer">
        <ul className="items site-map">
          <li className="item">
            <Link to="/explore/viz" className="item-link explore-link">Explore</Link>
            <ul className="sub-items">
              <li><a href="/explore/viz" className="item-link">Explorer</a></li>
              <li><a href="/explore/rankings" className="item-link">Rankings</a></li>
            </ul>
          </li>

          <li className="item">
            <Link to="/profile" className="item-link profiles-link">Profiles</Link>
            <ul className="sub-items">
              <li><a href="/profile/person" className="item-link">People</a></li>
              <li><a href="/profile/place" className="item-link">Places</a></li>
              <li><a href="/profile/occupation" className="item-link">Occupations</a></li>
              <li><a href="/profile/era" className="item-link">Eras</a></li>
            </ul>
          </li>

          <li className="item">
            <Link to="/about/vision" className="item-link about-link">About</Link>
            <ul className="sub-items">
              <li><a href="/about/vision" className="item-link">Vision</a></li>
              <li><a href="/about/team" className="item-link">Team</a></li>
              <li><a href="/about/publications" className="item-link">Publications</a></li>
              <li><a href="/about/methods" className="item-link">Methods</a></li>
              <li><a href="/about/data_sources" className="item-link">Data Sources</a></li>
              <li><a href="/about/resources" className="item-link">Resources</a></li>
              <li><a href="/about/contact" className="item-link">Contact</a></li>
            </ul>
          </li>

          <li className="item">
            <Link to="/data/datasets" className="item-link data-link">Data</Link>
            <ul className="sub-items">
              <li><a href="/data/datasets" className="item-link">Download</a></li>
              <li><a href="/data/api" className="item-link">API</a></li>
              <li><a href="/data/permissions" className="item-link">Permissions</a></li>
              <li><a href="/data/faq" className="item-link">FAQ</a></li>
            </ul>
          </li>
        </ul>

        <div className="sites right">
          <ul className="items authors">
            <li>
              <a href="http://macroconnections.media.mit.edu/">
              <img src={mcLogo} alt="Collective Learning website" />
              </a>
            </li>
            <li>
              <a href="https://www.media.mit.edu/">
              <img src={mlLogo} alt="MIT Media Lab" />
              </a>
            </li>
            <li>
              <a href="https://www.datawheel.us/">
              <img src={dwLogo} alt="Datawheel" />
              </a>
            </li>
          </ul>
          <ul className="items share">
            <li>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/">
              <img src={ccLogo} alt="Creative Commons" />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/macroconnections">
              <img src={fb} alt="Creative Commons" />
              </a>
            </li>
            <li>
              <a href="https://twitter.com/MacroMIT">
              <img src={tw} alt="Creative Commons" />
              </a>
            </li>
            <li>
              <a href="mailto:pantheon@media.mit.edu">
              <img src={mail} alt="Creative Commons" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    ;

export default Footer;
