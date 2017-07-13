import React from "react";
import "css/components/home/homeIA";

const HomeIA = () =>
  <div className="ia">
    <h3>How Pantheon Works</h3>
    <p className="post">Pantheon helps you visually explore data of more than 50,000 biographies with a presence of <strong>14+ language editions</strong> on Wikipedia. You can explore pantheon data by looking at:</p>
    <ul className="items ia-top">
      <li className="item ia-top-item viz">
        <a href="/explore/viz"><h2 className="viz-explorer">Visualizations</h2></a>
        <p>
        Create custom charts and maps using the Pantheon data. <a href="/explore/viz" className="deep-link">View Visualizations</a>
        </p>
      </li>
      <li className="item ia-top-item profiles">
        <h2 className="profiles">Profiles</h2>
        <p>
        Explore interactive stories for <a href="/profile/place">places</a>, <a href="/profile/person">people</a>, <a href="/profile/occupation">occupations</a> and <a href="/profile/era">eras</a>.
        </p>
      </li>
      <li className="item ia-top-item ranks">
        <a href="/explore/rankings"><h2 className="ranks">Rankings</h2></a>
        <p>
        Rank <a href="/profile/person">people</a>, <a href="/profile/place">places</a>, and <a href="/profile/occupation">occupations</a>. <a href="/explore/rankings" className="deep-link">View Rankings</a>
        </p>
      </li>
    </ul>
  </div>;

export default HomeIA;
