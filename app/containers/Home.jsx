import React from "react";
import styles from "css/components/home";
import searchSvg from "images/icon-search.svg";
import pantheonLogoSvg from "images/logo.svg";
import placeholderHome from "images/placeholder_home.png";

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Home = () => {
  return (
    <div className="home-container">
      <div className="home-head">
        <h1><img src={pantheonLogoSvg} alt={`Pantheon`} /></h1>
        <h3>Mapping Cultural Memory</h3>
        <div className="home-search">
          <img src={searchSvg} alt={`Search`} />
          <input type={"text"} placeholder={"Napoleon, fine arts, Syria"} />
        </div>
      </div>
      <div className="home-body">
        <div className="placeholder-home-img"></div>
        <div className="floating-content l-1">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>

        <div className="floating-content l-2">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
