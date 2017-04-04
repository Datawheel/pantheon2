import React from 'react';
import "css/components/home/homeIA";

const HomeIA = () => {
  return (
    <div className="ia">
      <h3>The Structure of Pantheon</h3>
      <p>There are many ways to explore the Pantheon dataset:</p>
      <ul className="ia-top items">
        <li className="item ia-top-item">
          <h2>Explorer</h2>
          <p>Advanced exploration by combining and building your own visualizations and profiles.
          <a href="/explore/viz" className="deep-link">Try it out</a></p>
        </li>
        <li className="item ia-top-item">
          <h2>Profiles</h2>
          <p>Advanced exploration by combining and building your own visualizations and profiles.</p>
        </li>
        <li className="item ia-top-item">
          <h2>Rankings</h2>
          <p>All of Pantheon&#39;s people, places and occupations ranked by HPI (Historical Popularity Index) value.
          <a href="/explore/rankings" className="deep-link">Try it out</a></p>
        </li>
      </ul>
      <ul className="ia-p-types">
        <li className="item ia-top-item">
          <h2>People</h2>
          <p>Pantheon contains data on over 11,000 individuals whom we have classified as “historically memorable”.
          <a href="/explore/rankings" className="deep-link">View a person</a></p>
        </li>
        <li className="item ia-top-item">
          <h2>Places</h2>
          <p>We have scraped locations for every place of birth and death for every individuals, present-day and across time.
          <a href="/explore/rankings" className="deep-link">View a place</a></p>
        </li>
        <li className="item ia-top-item">
          <h2>Occupations</h2>
          <p>We categorized these individuals into 93 occupations, each nested in one of 30 industries, then one of 9 domains.
          <a href="/explore/rankings" className="deep-link">View an occupation</a></p>
        </li>
        <li className="item ia-top-item">
          <h2>Eras</h2>
          <p>Advanced exploration by combining and building your own visualizations and profiles.
          <a href="/explore/rankings" className="deep-link">View an era</a></p>
        </li>
      </ul>
    </div>
  );
};

export default HomeIA;
