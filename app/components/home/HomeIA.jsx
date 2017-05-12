import React from "react";
import "css/components/home/homeIA";
import HelpText from "components/utils/HelpText";

const HomeIA = () => (
  <div className="ia">
    <h3>The Structure of Pantheon</h3>
    <p className="post">This site visualizes data on over <span>47,000</span> of the most <HelpText text="globally memorable individuals" msg="Individuals with L > 25 and HPI > 15. L is the number of Wikipedia language editions a character is featured in. Historical Popularity Index (HPI) corrects L by adding information an an individual's age, pageview concentrations, and number of non-English pageviews." /> around the world. We invite you to explore and engage with our research through a variety of avenues:</p>
    <ul className="items ia-top">
      <li className="ia-top-bg"></li>
      <li className="item ia-top-item viz">
        <a href="/explore/viz"><h2 className="viz-explorer">Visualizations</h2></a>
        <p>Create data visualizations using the Pantheon dataset.&nbsp;
        <a href="/explore/viz" className="deep-link">View Visualizations</a></p>
      </li>
      <li className="item ia-top-item profiles">
        <h2 className="profiles">Profiles</h2>
      </li>
      <li className="item ia-top-item ranks">
        <a href="/explore/rankings"><h2 className="ranks">Rankings</h2></a>
        <p>Rank all people, places and occupations by Historical Popularity Index (HPI).&nbsp;
        <a href="/explore/rankings" className="deep-link">View Rankings</a></p>
      </li>
    </ul>
    <ul className="items ia-p-types">
      <li className="item ia-p-type">
        <a href="/profile/person/"><h2>People</h2></a>
        <p>Pantheon contains data on over <span>11,000 individuals</span> whom have been classified as “historically memorable.”&nbsp;
        <a href="/profile/person/" className="deep-link">View a person</a></p>
      </li>
      <li className="item ia-p-type">
        <a href="/profile/place/"><h2>Places</h2></a>
        <p>We have scraped locations for every place of <span>birth</span> and <span>death</span> for every individual, present-day and across time.&nbsp;
        <a href="/profile/place/" className="deep-link">View a place</a></p>
      </li>
      <li className="item ia-p-type">
        <a href="/profile/occupation/"><h2>Occupations</h2></a>
        <p>We categorized these individuals into <span>93</span> occupations, each nested in one of <span>30</span> industries, then one of <span>9</span> domains.&nbsp;
        <a href="/profile/occupation/" className="deep-link">View an occupation</a></p>
      </li>
      <li className="item ia-p-type">
        <a href="/profile/era/"><h2>Eras</h2></a>
        <p>We’ve found that spikes in number of historically memorable people coincide with eras of new <span>communication</span> technologies.&nbsp;
        <a href="/profile/era/" className="deep-link">View an era</a></p>
      </li>
    </ul>
  </div>
);

export default HomeIA;
