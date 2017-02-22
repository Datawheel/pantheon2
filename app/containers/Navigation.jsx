import React, { PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { logOut, activateSearch } from "actions/users";
import classNames from "classnames/bind";
import styles from "css/components/navigation";
import pantheonLogoSvg from "images/logo.svg";
import searchSvg from "images/icon-search.svg";
import navSvg from "images/icon-nav.svg";
import closeSvg from "images/icon-close.svg";

const toggleSubNav = (e) => {
  const itemChildren = e.target.childNodes;
  itemChildren.forEach((child)=>{
    if(child.nodeType === 1 && child.tagName === "UL") {
      child.style.display = "block";
    }
  })
}

const Navigation = ({ user, logOut, activateSearch }) => {
    return (
      <nav>
        <div className="navigation global-nav" role="navigation">
          <ul className="items">
            <li className="nav-btn">
              <span>
                <img src={navSvg} alt={`Open navigation.`} />
              </span>
            </li>
            <li className="item">
              <Link to="/explore/viz" className="item-link explore-link" activeClassName="active">Explore</Link>
              <ul className={"sub-items"}>
                <li><a href="/explore/viz" className="item-link">Visual Explorer</a></li>
                <li><a href="/explore/rankings" className="item-link">Rankings</a></li>
              </ul>
            </li>
            <li className="item">
              <Link to="/profile" className="item-link profiles-link" activeClassName="active">Profiles</Link>
              <ul className={"sub-items"}>
                <li><a href="/profile/person" className="item-link">People</a></li>
                <li><a href="/profile/place" className="item-link">Places</a></li>
                <li><a href="/profile/occupation" className="item-link">Occupations</a></li>
              </ul>
            </li>
            <li className="item home-link">
              <a href="/" className="home">
                <img className="logo" src={pantheonLogoSvg} alt={`Pantheon`} />
              </a>
            </li>
            <li className="item">
              <Link to="/about/vision" className="item-link about-link" activeClassName="active">About</Link>
              <ul className={"sub-items"}>
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
              <Link to="/data/datasets" className="item-link data-link" activeClassName="active">Data</Link>
              <ul className={"sub-items"}>
                <li><a href="/data/datasets" className="item-link">Download</a></li>
                <li><a href="/data/api" className="item-link">API</a></li>
                <li><a href="/data/permissions" className="item-link">Permissions</a></li>
                <li><a href="/data/faq" className="item-link">FAQ</a></li>
              </ul>
            </li>
            <li className="search-btn">
              <span onClick={ activateSearch }>
                <img src={searchSvg} alt={`Search`} />
              </span>
            </li>
          </ul>
        </div>
        <div className="m-navigation global-nav">
          <div className="logo-container">
            <a href="/" className="home">
              <img className="logo" src={pantheonLogoSvg} alt={`Pantheon`} />
            </a>
            <span className="close-btn">
              <img src={closeSvg} alt={`Close navigation.`} />
            </span>
          </div>
          <ul className="items">
            <li className="item">
              <Link to="/" className="item-link home-link" activeClassName="active">Home</Link>
            </li>
            <li className="item">
              <Link to="/explore/viz" className="item-link explore-link" activeClassName="active">Explore</Link>
              <ul className={"sub-items"}>
                <li><a href="/explore/viz">Visual Explorer</a></li>
                <li><a href="/explore/rankings">Rankings</a></li>
              </ul>
            </li>
            <li className="item">
              <Link to="/profile" className="item-link profiles-link" activeClassName="active">Profiles</Link>
              <ul className={"sub-items"}>
                <li><a href="/profile/person">People</a></li>
                <li><a href="/profile/place">Places</a></li>
                <li><a href="/profile/occupation">Occupations</a></li>
              </ul>
            </li>
            <li className="item">
              <Link to="/about/vision" className="item-link about-link" activeClassName="active">About</Link>
              <ul className={"sub-items"}>
                <li><a href="/about/vision">Vision</a></li>
                <li><a href="/about/team">Team</a></li>
                <li><a href="/about/publications">Publications</a></li>
                <li><a href="/about/methods">Methods</a></li>
                <li><a href="/about/data_sources">Data Sources</a></li>
                <li><a href="/about/resources">Resources</a></li>
                <li><a href="/about/references">References</a></li>
                <li><a href="/about/contact">Contact</a></li>
              </ul>
            </li>
            <li className="item">
              <Link to="/data/datasets" className="item-link data-link" activeClassName="active">Data</Link>
              <ul className={"sub-items"}>
                <li><a href="/data/datasets">Download</a></li>
                <li><a href="/data/api">API</a></li>
                <li><a href="/data/permissions">Permissions</a></li>
                <li><a href="/data/faq">FAQ</a></li>
              </ul>
            </li>
            <li className="search-link item-link" onClick={ activateSearch }>Search</li>
          </ul>
        </div>
      </nav>
    );
};

Navigation.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired,
  activateSearch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { logOut, activateSearch })(Navigation);
