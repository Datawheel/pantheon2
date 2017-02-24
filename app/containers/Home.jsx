import React from "react";
import styles from "css/components/home";
import searchSvg from "images/icon-search.svg";
import pantheonLogoSvg from "images/logo.svg";

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Home = () => {
  return (
    <div className="home-container">
      <div className="home-head">
        <h1><img src={pantheonLogoSvg} alt="Pantheon" /></h1>
        <h3>Mapping Cultural Memory</h3>
        <div className="home-search">
          <img src={searchSvg} alt="Search" />
          <input type={"text"} placeholder={"Napoleon, fine arts, Syria"} />
        </div>
      </div>
      <div className="home-body">
        <div className="home-blog-post">
          <p><strong>Pantheon</strong> is a data research project celebrating the cultural information that endows our species with these fantastic capacities. The goal is to explore our global cultural heritage and the process of cultural development. To begin exploring the Pantheon dataset, choose a <strong>Communication Era</strong>:</p>
        </div>

        <div className="timeline-container">
          <div className="stacked-viz"></div>
          <div className="era smartphone">
            <div className="era-img"></div>
            <p><a href="#">Smartphone Era</a></p>
          </div>
          <div className="era television">
            <div className="era-img"></div>
            <p><a href="#">Television Era</a></p>
          </div>
          <div className="era film-radio">
            <div className="era-img"></div>
            <p><a href="#">Film & Radio Era</a></p>
          </div>
          <div className="era printing">
            <div className="era-img"></div>
            <p><a href="#">Printing Era</a></p>
          </div>
          <div className="era scribal">
            <div className="era-img"></div>
            <p><a href="#">Scribal Era</a></p>
          </div>
        </div>

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
