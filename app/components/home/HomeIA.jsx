import React from 'react';
import "css/components/home/homeIA";

const HomeIA = () => {
  return (
    <div className="ia">
      <h3>The Structure of Pantheon</h3>
      <p>There are many ways to explore the Pantheon dataset:</p>
      <ul className="items ia-top">
        <li className="ia-top-bg"></li>
        <li className="item ia-top-item">
          <h2 className="viz-explorer">Explorer</h2>
          <p>Visually explore by building your own data visualizations and profiles.&nbsp;
          <a href="/explore/viz" className="deep-link">Try it out</a></p>
        </li>
        <li className="item ia-top-item center">
          <h2 className="profiles">Profiles</h2>
        </li>
        <li className="item ia-top-item">
          <h2 className="ranks">Rankings</h2>
          <p>All of Pantheon&#39;s people, places and occupations ranked by HPI (Historical Popularity Index) value.&nbsp;
          <a href="/explore/rankings" className="deep-link">Try it out</a></p>
        </li>
      </ul>
      <ul className="items ia-p-types">
        <li className="item ia-p-type">
          <h2>People</h2>
          <p>Pantheon contains data on over <span>11,000 individuals</span> whom have been classified as “historically memorable”.&nbsp;
          <a href="/profile/person/" className="deep-link">View a person</a></p>
        </li>
        <li className="item ia-p-type">
          <h2>Places</h2>
          <p>We have scraped locations for every place of <span>birth</span> and <span>death</span> for every individuals, present-day and across time.&nbsp;
          <a href="/profile/place/" className="deep-link">View a place</a></p>
        </li>
        <li className="item ia-p-type">
          <h2>Occupations</h2>
          <p>We categorized these individuals into <span>93</span> occupations, each nested in one of <span>30</span> industries, then one of <span>9</span> domains.&nbsp;
          <a href="/profile/occupation/" className="deep-link">View an occupation</a></p>
        </li>
        <li className="item ia-p-type">
          <h2>Eras</h2>
          <p>We’ve found that spikes in number of historically memorable people coincide with eras of new <span>communication</span> technologies.&nbsp;
          <a href="/profile/era/" className="deep-link">View an era</a></p>
        </li>
      </ul>
    </div>
  );
};

export default HomeIA;
