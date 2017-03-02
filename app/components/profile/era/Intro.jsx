import React from "react";
import styles from "css/components/profile/intro";
import iconProfW from "images/globalNav/profile-w.svg";

const Intro = ({era}) =>
    <section className="intro-section era">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src={iconProfW} />
            What was the cultural production of the Radio & Film Era?
          </h3>
          <p>
            The Radio & Film Era occured roughly between {era.name} and is defined by the rapid adoption of a new <strong>communication technology</strong>. The most globally remembered individuals born in this time period are <a href="">Che Guevara (AR)</a>, <a href="">Martin Luther King, Jr. (US)</a>, and <a href="#">Elvis Presley (US)</a>. This Era was preceded by the <a href="#">Newspaper Era</a> and followed by the <a href="#">Television Era</a>.
            Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.&nbsp;
            <a href="/about/" className="deep-link">Read about our methods</a>
          </p>
        </div>
        <ul className="items era-timeline">
          <li className="item era-time">
            <a href="#" className="item-link era-time-link">Scribal</a>
          </li>
          <li className="item era-time tick"></li>
          <li className="item era-time">
            <a href="#" className="item-link era-time-link">Printing</a>
          </li>
          <li className="item era-time tick"></li>
          <li className="item era-time">
            <a href="#" className="item-link era-time-link">Newspaper</a>
          </li>
          <li className="item era-time tick"></li>
          <li className="item era-time">
            <a href="#" className="item-link era-time-link active">Radio & Film</a>
          </li>
          <li className="item era-time tick"></li>
          <li className="item era-time">
            <a href="#" className="item-link era-time-link">Television</a>
          </li>
          <li className="item era-time tick"></li>
          <li className="item era-time">
            <a href="#" className="item-link era-time-link">Personal Computer</a>
          </li>
        </ul>
      </div>
    </section>
  ;

export default Intro;
