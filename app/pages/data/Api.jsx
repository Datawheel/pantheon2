import React from "react";
// import "css/common/plane";

const Api = () =>
  <div className="api-container">
    <div className="flying-plane"></div>
    <h1>API</h1>
    <p className="intro">
      Access the API online <a href="https://app.swaggerhub.com/api/alexandersimoes/Pantheon/2.0.0">here</a>.
    </p>

    <h2>Sample URLs:</h2>
    <ul className="items">
      <li>
        Fetch data on a specific person: James Joyce
        <input defaultValue="https://api.pantheon.world/person?slug=eq.James_Joyce" />
      </li>
      <li>
        Fetch data on a specific city: Dublin, IRL
        <input defaultValue="https://api.pantheon.world/place?slug=eq.dublin" />
      </li>
      <li>
        Fetch data on a specific country: Ireland
        <input defaultValue="https://api.pantheon.world/country?slug=eq.ireland" />
      </li>
      <li>
        Fetch data on a specific occupation: Writer
        <input defaultValue="https://api.pantheon.world/occupation?occupation_slug=eq.writer" />
      </li>
      <li>
        Fetch data on a specific era: Newspaper Era
        <input defaultValue="https://api.pantheon.world/era?slug=eq.newspaper" />
      </li>
    </ul>

    <h2>People:</h2>
    <h3>Identifiers:</h3>
    <dl className="items">
      <dt>en_curid</dt> <dd>English Wikipedia page ID.</dd>
      <dt>name</dt> <dd>English Wikipedia page title.</dd>
      <dt>wd_id</dt> <dd>Wikidata entity ID.</dd>
    </dl>

    <h3>Birth and death:</h3>
    <dl className="items">
      <dt>birth_place</dt> <dd>Birth place.</dd>
      <dt>lat,lon</dt> <dd>Coordinates of birth place.</dd>
      <dt>birth_year</dt> <dd>Year of birth (or best estimation of).</dd>
      <dt>birth_town</dt> <dd>Closest settlement (above 15000 people) to birth_place (identified using the geonameid from geonames.org).</dd>
      <dt>birth_civ</dt> <dd>Ancient civilization of birth according to the birth_place and birth_year.</dd>
    </dl>

    <h3>Occupation:</h3>
    <dl className="items">
      <dt>occupation</dt> <dd>Occupation that best describes the person’s mayor field of contribution.</dd>
      <dt>prob_ratio</dt> <dd>Score of the quality of the estimation.</dd>
    </dl>

    <h3>Memorability indicators (static):</h3>
    <dl className="items">
      <dt>L</dt> <dd>Number of Wikipedia language editions that have a biography about this character.</dd>
      <dt>pv</dt> <dd>Total English Wikipedia pageviews from XX 2007 until XX 2016.</dd>
      <dt>HPI</dt> <dd>Human popularity index following Yu et. al. using pageviews data from July 2015 until June 2016.</dd>
    </dl>

    <h3>Memorability indicators (dynamic):</h3>
    <dl className="items">
      <dt>L</dt> <dd>Number of Wikipedia language editions as a function of time.</dd>
      <dt>l</dt> <dd>Fraction of Wikipedia language editions over the number of Wikipedias expressed in Pantheon.</dd>
      <dt>l*</dt> <dd>Number of Wikipedia language editions normalized by the mean number of editions of all people in Pantheon.</dd>
      <dt>C</dt> <dd>Article coverage. For each language at each month we define the language’s coverage as the number of people with a page in that language divided by the number of people with a page in any language. The coverage for each person is calculated as the total coverage of the languages he or she appears on.</dd>
      <dt>c</dt> <dd>Article coverage normalized by the total coverage of all language editions expressed in the dataset.</dd>
      <dt>S</dt> <dd>Score. The score for each language edition at each month is calculated as one over the coverage. The score of each article is calculated as the total score of the language editions it appears on. This measure is meant to assign more value to rare language editions.</dd>
      <dt>s</dt> <dd>Score normalized by the total score of all language editions expressed in the dataset.</dd>
      <dt>R</dt> <dd>Number of revisions of the English Wikipedia page as a function of time.</dd>
      <dt>r</dt> <dd>Number of revisions of the English Wikipedia normalized by all the revisions in Pantheon.</dd>
      <dt>r*</dt> <dd>Number of revisions of the English Wikipedia normalized by the average number of revisions.</dd>
      <dt>pv</dt> <dd>Monthly pageviews for the English Wikipedia page.</dd>
    </dl>

    <h3>Reference indicators (dynamic)</h3>
    <dl className="items">
      <dt>nw</dt> <dd>Total number of Wikipedia editions expressed in the dataset.</dd>
      <dt>L_av</dt> <dd>Average number of language editions of biographies in the dataset.</dd>
      <dt>cov</dt> <dd>Total coverage of all the language editions expressed in the dataset.</dd>
      <dt>score</dt> <dd>Total score of all language editions expressed in the dataset.</dd>
    </dl>

    <h2>Town:</h2>
    <dl className="items">
      <dt>birth_town</dt> <dd>geonameid identifier.</dd>
      <dt>population</dt> <dd>Current population estimate according to geonames.org</dd>
      <dt>lat,lon</dt> <dd>Coordinates according to geonames.org</dd>
      <dt>city</dt> <dd>Big city the town belongs to, following the DBSCAN algorithm to group towns into clusters.</dd>
      <dt>country</dt> <dd>Country the town belongs to (country code), according to modern borders.</dd>
    </dl>

    <h2>Country:</h2>
    <dl className="items">
      <dt>country</dt> <dd>Country code identifier.</dd>
      <dt>founded</dt> <dd>Country foundation year according to <a href="https://en.wikipedia.org/wiki/List_of_sovereign_states_by_date_of_formation" target="_blank">Wikipedia</a>.</dd>
      <dt>region</dt> <dd>UN region the country belongs to.</dd>
      <dt>continent</dt> <dd>Continent the country belongs to.</dd>
    </dl>

    <h2>Groupings:</h2>
    <dl className="items">
      <dt>least_developed</dt> <dd>Countries that are the least developed according to the UN.</dd>
      <dt>language</dt> <dd>Countries grouped according to shared language.</dd>
      <dt>colonial</dt> <dd>Countries grouped according to shared colonial past.</dd>
      <dt>industry</dt> <dd>Second level of aggregation for occupations.</dd>
      <dt>domain</dt> <dd>Third level of aggregation for occupations.</dd>
      <dt>group</dt> <dd>Alternative aggregation for occupations (used to track changes in composition of history due to changes in media).</dd>
    </dl>

  </div>;

export default Api;
