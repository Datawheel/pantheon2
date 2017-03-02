import React from "react";
import styles from "css/components/home";
import searchSvg from "images/icons/icon-search.svg";
import pantheonLogoSvg from "images/logo.svg";
import iaPng from "images/home/ia_placeholder.png";
import horizSt from "images/home/stacked_viz_horiz.png";

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Home = () =>
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
        <div className="post">
          <p><strong>Pantheon</strong> is a data research project celebrating the cultural information that endows our species with these fantastic capacities. The goal is to explore our global cultural heritage and the process of cultural development. To begin exploring, choose a <strong>Communication Technology Era</strong>:</p>
        </div>

        <div className="post legend"></div>

        <div className="horiz-stacked">
          <img src={horizSt} alt="stacked placeholder" />
        </div>

        <div className="ia">
          <img src={iaPng} alt="IA Placeholder" />
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

        <div className="flying-plane"></div>
      </div>
    </div>
  ;

export default Home;
