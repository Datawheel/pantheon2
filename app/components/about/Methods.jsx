import React from 'react';

const Methods = () => {
  return (
    <div>
      <h1>Methods</h1>
      <h2>List of pages:</h2>
      <p>We collect the full list of pages within the scope of the WikiProject Biography as of December 2015 with more than 15 Wikipedia language editions. We complement this set with all the instances of the class human from the Wikidata dump from December 2015, with more than 15 Wikipedia language editions. This gives us a total of 52196 articles about biographies. We then use a simple classifier to filter out articles about more than one person (e.g. bands or music duos). This gives us a total of 49395 articles.</p>
      <h2>Properties:</h2>
      <p>All memorability indicators were collected using Wikipedia APIs. Birth and death parameters were collected from the Wikipedia infobox, when available, or from Wikidata.</p>
      <p>The occupation was collected by training a SVM algorithm using the Pantheon 1.0 dataset enriched with new manually curated biographies that account for the new occupations. The probability ration between the first and second occupations predicted by the model are provided as an accuracy measure for the predicted occupations. The model has an in-sample accuracy of 87%.</p>
      <p>Based on the birth_place and the list of ‘cities with more than 15000 people’ from geonames, we assigned each person to a (controlled) set of towns. Then, cities were created by grouping towns using the DBSCAN spatial clustering algorithm on top of the ‘cities with more than 15000 people’ from geonames. The parameters used varied by continent.</p>
      <p>Modern countries were assigned using Google geocoding API. Conflict areas were manually solved based on countries that are either UN members or participate in at least one UN specialized agency. For example, Palestine is not a UN member, but it participates in UNESCO. On the other hand, Turkish Republic of Northern Cyprus does not participate in any UN specialized agency and therefore is considered as part of Cyprus for the effects of our dataset.</p>
      <p>Based on birth_place and the birth_year, we collected the birth birth_civ using the polygons from geacron. When a polygon could not be found, such as for Pocahontas, we assigned the closest polygon for that year.</p>
    </div>
  );
};

export default Methods;
