import React from 'react';

const Api = () => {
  return (
    <div className="api-container">
      <h1>API</h1>
      <p className="intro">
        Access the API online <a href="https://app.swaggerhub.com/api/alexandersimoes/Pantheon/2.0.0">here</a>.
      </p>
      <h2>People:</h2>
        <h3>Identifiers:</h3>
        <ul className="items">
          <li className="item" className="item">en_curid : English Wikipedia page ID.</li>
          <li className="item" className="item">name : English Wikipedia page title.</li>
          <li className="item" className="item">wd_id : Wikidata entity ID.</li>
        </ul>

        <h3>Birth and death:</h3>
        <ul className="items">
          <li className="item">birth_place : Birth place.</li>
          <li className="item">lat,lon : Coordinates of birth place.</li>
          <li className="item">birth_year : Year of birth (or best estimation of).</li>
          <li className="item">birth_town : Closest settlement (above 15000 people) to birth_place (identified using the geonameid from geonames.org).</li>
          <li className="item">birth_civ : Ancient civilization of birth according to the birth_place and birth_year.</li>
        </ul>

        <h3>Occupation:</h3>
        <ul className="items">
          <li className="item">occupation : Occupation that best describes the person’s mayor field of contribution.</li>
          <li className="item">prob_ratio : Score of the quality of the estimation.</li>
        </ul>

        <h3>Memorability indicators (static):</h3>
        <ul className="items">
          <li className="item">L : Number of Wikipedia language editions that have a biography about this character.</li>
          <li className="item">pv : Total English Wikipedia pageviews from XX 2007 until XX 2016.</li>
          <li className="item">HPI : Human popularity index following Yu et. al. using pageviews data from July 2015 until June 2016.</li>
        </ul>

        <h3>Memorability indicators (dynamic):</h3>
        <ul className="items">
          <li className="item">L : Number of Wikipedia language editions as a function of time.</li>
          <li className="item">l : Fraction of Wikipedia language editions over the number of Wikipedias expressed in Pantheon.</li>
          <li className="item">l* : Number of Wikipedia language editions normalized by the mean number of editions of all people in Pantheon.</li>
          <li className="item">C : Article coverage. For each language at each month we define the language’s coverage as the number of people with a page in that language divided by the number of people with a page in any language. The coverage for each person is calculated as the total coverage of the languages he or she appears on.</li>
          <li className="item">c : Article coverage normalized by the total coverage of all language editions expressed in the dataset.</li>
          <li className="item">S : Score. The score for each language edition at each month is calculated as one over the coverage. The score of each article is calculated as the total score of the language editions it appears on. This measure is meant to assign more value to rare language editions.</li>
          <li className="item">s : Score normalized by the total score of all language editions expressed in the dataset.</li>
          <li className="item">R : Number of revisions of the English Wikipedia page as a function of time.</li>
          <li className="item">r : Number of revisions of the English Wikipedia normalized by all the revisions in Pantheon.</li>
          <li className="item">r* : Number of revisions of the English Wikipedia normalized by the average number of revisions.</li>
          <li className="item">pv : Monthly pageviews for the English Wikipedia page.</li>
        </ul>

        <h3>Reference indicators (dynamic)</h3>
        <ul className="items">
          <li className="item">nw : Total number of Wikipedia editions expressed in the dataset.</li>
          <li className="item">L_av : Average number of language editions of biographies in the dataset.</li>
          <li className="item">cov : Total coverage of all the language editions expressed in the dataset.</li>
          <li className="item">score : Total score of all language editions expressed in the dataset.</li>
        </ul>

        <h2>Town:</h2>
        <p>birth_town : geonameid identifier.</p>
        <p>population : Current population estimate according to geonames.org</p>
        <p>lat,lon : Coordinates according to geonames.org</p>
        <p>city : Big city the town belongs to, following the DBSCAN algorithm to group towns into clusters.</p>
        <p>country : Country the town belongs to (country code), according to modern borders.</p>

        <h2>Country:</h2>
        <p>country : Country code identifier.</p>
        <p>founded : Country foundation year according to <a href="https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_formation" target="_blank">Wikipedia</a>.</p>
        <p>region : UN region the country belongs to.</p>
        <p>continent : Continent the country belongs to.</p>

        <h2>Groupings:</h2>
        <p>least_developed : Countries that are the least developed according to the UN.</p>
        <p>language : Countries grouped according to shared language.</p>
        <p>colonial : Countries grouped according to shared colonial past.</p>
        <p>industry : Second level of aggregation for occupations.</p>
        <p>domain : Third level of aggregation for occupations.</p>
        <p>group : Alternative aggregation for occupations (used to track changes in composition of history due to changes in media).</p>

    </div>
  );
};

export default Api;
