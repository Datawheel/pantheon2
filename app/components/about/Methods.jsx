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

      <div>
        <h2>References and Endnotes</h2>
        <p>[1] Edward O. Wilson, The Social Conquest of Earth, Liveright (2012)</p>
        <p>[2] The definition of culture as the information transmitted through non-genetic means is a popular definition among scholars in a large number of disciplines. A non-exhaustive list of works that use this definition include (1) Spector, L., & Luke, S. (1996, July). Cultural transmission of information in genetic programming. In <i>Proceedings of the First Annual Conference on Genetic Programming</i> (pp. 209-214). MIT Press, (2) Danchin, É., Giraldeau, L. A., Valone, T. J., & Wagner, R. H. (2004). Public information: from nosy neighbors to cultural evolution. Science, 305(5683), 487-491. (3) Richerson, P. J., & Boyd, R. (2008). <i>Not by genes alone: How culture transformed human evolution.</i> University of Chicago Press.</p>
        <p>[3] Francis Fukuyama, Trust, Free Press (1995)</p>
        <p>[4] Murray, C. (2003). <i>Human accomplishment.</i> HarperCollins.</p>
        <p>[5] Bowlby, John. <i>Charles Darwin: A new life.</i> WW Norton & Company, 1992.</p>
        <p>[6] Darwin, Charles. <i>The Autobiography of Charles Darwin.</i> Barnes & Noble Publishing, 2005.</p>
        <p>[7] Cavalli-Sforza, L. L., & Feldman, M. W. (1981). Cultural transmission and evolution: a quantitative approach. Monographs in Population Biology, 16, 1–388.</p>
        <p>[8] Michel, J.-B., Shen, Y. K., Aiden, A. P., Veres, A., Gray, M. K., Pickett, J. P., … Aiden, E. L. (2011). Quantitative analysis of culture using millions of digitized books. Science (New York, N.Y.), 331(6014), 176–82.</p>
        <p>[9] Eom, Y., & Shepelyansky, D. L. (2013). Highlighting entanglement of cultures via ranking of multilingual Wikipedia articles.</p>
        <p>[10] Aragon, P., Laniado, D., Kaltenbrunner, A., & Volkovich, Y. (2011). Biographical Social Networks on Wikipedia A cross-cultural study of links that made history. In WikiSym ’12 (pp. 3–6).</p>
        <p>[11] Skiena, S., & Ward, C. (2013). Who’s Bigger?: Where Historical Figures Really Rank (p. 408). Cambridge University Press.</p>
        <p>[12] Yasseri, T., Spoerri, A., Graham, M., & Kertész, J. (2013). The most controversial topics in Wikipedia: A multilingual and geographical analysis.</p>
      </div>
    </div>
  );
};

export default Methods;
