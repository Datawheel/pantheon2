import React, {Component} from "react";
import {Link} from "react-router";
import "components/Navigation.css";

class Navigation extends Component {

  constructor(props) {
    super(props);
  }

  toggleSubNav(e) {
    const itemChildren = e.target.childNodes;
    e.target.classList.toggle("o");
    itemChildren.forEach(child => {
      if (child.nodeType === 1 && child.tagName === "UL") {
        child.classList.toggle("open");
      }
    });
    document.getElementById("m-navigation").classList.toggle("expanded");
    document.body.classList.toggle("frozen");
  }

  toggleSubNavSib(e) {
    const itemSibling = e.target.nextSibling;
    itemSibling.classList.toggle("open");
    e.target.parentNode.classList.toggle("o");
    document.getElementById("m-navigation").classList.toggle("expanded");
    document.body.classList.toggle("frozen");
  }

  closeMobileNav() {
    document.getElementById("m-navigation").classList.remove("open");
    document.getElementById("m-navigation").classList.remove("expanded");
    document.body.classList.remove("frozen");

    const subItems = document.getElementsByClassName("sub-items");
    [].forEach.call(subItems, el => {
      el.classList.remove("open");
    });

    const items = document.getElementsByClassName("item");
    [].forEach.call(items, el => {
      el.classList.remove("o");
    });
  }

  render() {
    const {activateSearch} = this.props;

    return (
      <nav>
        <div id="navigation" className="global-nav" role="navigation">
          <ul className="items">
            <li className="nav-btn" onClick={() => {
              document.querySelector("#m-navigation").classList.add("open");
            }}>
              <span>
                <img src="/images/icons/icon-nav.svg" alt="Open navigation." />
              </span>
            </li>
            <li className="item">
              <Link to="/explore/viz" className="item-link explore-link">Visualizations</Link>
            </li>
            <li className="item">
              <Link to="/explore/rankings?show=people" className="item-link rankings-link">Rankings</Link>
            </li>
            <li className="item">
              <a href="#" className="item-link profiles-link dd">Profiles</a>
              <ul className="sub-items">
                <li><a href="/profile/person" className="item-link">People</a></li>
                <li><a href="/profile/place" className="item-link">Places</a></li>
                <li><a href="/profile/country" className="item-link">Countries</a></li>
                <li><a href="/profile/occupation" className="item-link">Occupations</a></li>
                <li><a href="/profile/era" className="item-link">Eras</a></li>
              </ul>
            </li>
            <li className="item home-link">
              <a href="/" className="home">
                <img className="logo" src="/images/logos/logo_pantheon.svg" alt="Pantheon" />
              </a>
            </li>
            <li className="item">
              <Link to="/about/vision" className="item-link about-link dd" activeClassName="active">About</Link>
              <ul className="sub-items">
                <li><a href="/about/vision" className="item-link">Vision</a></li>
                <li><a href="/data/faq" className="item-link">FAQ</a></li>
                <li><a href="/about/team" className="item-link">Team</a></li>
                <li><a href="/about/publications" className="item-link">Publications</a></li>
                <li><a href="/about/methods" className="item-link">Methods</a></li>
                <li><a href="/about/data_sources" className="item-link">Data Sources</a></li>
                <li><a href="/about/contact" className="item-link">Contact</a></li>
              </ul>
            </li>
            <li className="item">
              <Link to="/data/datasets" className="item-link data-link dd" activeClassName="active">Data</Link>
              <ul className="sub-items">
                <li><a href="/data/datasets" className="item-link">Download</a></li>
                <li><a href="/data/permissions" className="item-link">Permissions</a></li>
              </ul>
            </li>
            <li className="item">
              <Link to="/data/api" className="item-link api-link" activeClassName="active">API</Link>
            </li>
            <li className="search-btn">
              <a href="#" onClick={activateSearch}>
                <img src="/images/icons/icon-search.svg" alt="Search" />
              </a>
            </li>
          </ul>
        </div>
        <div id="m-navigation" className="global-nav">
          <div className="logo-container">
            <a href="/" className="home">
              <img className="logo" src="/images/logos/logo_pantheon.svg" alt="Pantheon" />
            </a>
            <span className="close-btn" onClick={this.closeMobileNav}>
              <img src="/images/icons/icon-close.svg" alt="Close navigation." />
            </span>
          </div>
          <ul className="items">
            <li className="item">
              <a href="/" className="item-link home-link">Home</a>
            </li>
            <li className="item">
              <a href="/explore/viz" className="item-link explore-link">Visualizations</a>
            </li>
            <li className="item">
              <a href="/explore/rankings" className="item-link rankings-link">Rankings</a>
            </li>
            <li className="item" onClick={this.toggleSubNav}>
              <a className="item-link profiles-link" onClick={this.toggleSubNavSib}>Profiles</a>
              <ul className="sub-items">
                <li><a href="/profile/person">People</a></li>
                <li><a href="/profile/place">Places</a></li>
                <li><a href="/profile/country">Countries</a></li>
                <li><a href="/profile/occupation">Occupations</a></li>
                <li><a href="/profile/era">Eras</a></li>
              </ul>
            </li>
            <li className="item" onClick={this.toggleSubNav}>
              <a className="item-link about-link" onClick={this.toggleSubNavSib}>About</a>
              <ul className="sub-items">
                <li><a href="/about/vision">Vision</a></li>
                <li><a href="/data/faq">FAQ</a></li>
                <li><a href="/about/team">Team</a></li>
                <li><a href="/about/publications">Publications</a></li>
                <li><a href="/about/methods">Methods</a></li>
                <li><a href="/about/data_sources">Data Sources</a></li>
                <li><a href="/about/contact">Contact</a></li>
              </ul>
            </li>
            <li className="item" onClick={this.toggleSubNav}>
              <a className="item-link data-link" onClick={this.toggleSubNavSib}>Data</a>
              <ul className="sub-items">
                <li><a href="/data/datasets">Download</a></li>
                <li><a href="/data/permissions">Permissions</a></li>
              </ul>
            </li>
            <li className="item">
              <a href="/data/api" className="item-link api-link">API</a>
            </li>
            <li className="item search-link item-link" onClick={activateSearch}>Search</li>
            <li className="item">
              <a href="http://bit.ly/QWSKoc" target="_blank" rel="noopener noreferrer" className="item-link feedback-link">Give Feedback</a>
            </li>
            <li className="item item-link citation-link">
              Usage Citation
              <input readOnly type="text" value="Yu, A. Z., et al. (2016). Pantheon 1.0, a manually verified dataset of globally famous biographies. Scientific Data 2:150075. doi: 10.1038/sdata.2015.75" />
            </li>
          </ul>
        </div>
      </nav>
    );
  }

}

export default Navigation;
