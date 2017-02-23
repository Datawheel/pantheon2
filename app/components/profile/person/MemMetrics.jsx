import React from "react";
import {FORMATTERS} from "types";

const MemMetrics = ({pageviews, person}) => {
  const totalPageviews = pageviews
                          .filter(pv => pv.num_pageviews)
                          .map(pv => pv.num_pageviews)
                          .reduce((total, newVal) => total + newVal, 0);

  return (
    <div className="metrics-container">
      <div className="metric-vid">
        {person.youtube ? <iframe width="560" height="315" src="https://www.youtube.com/embed/vw40NMa_0RM" frameBorder="0" allowFullScreen></iframe> : <a href="" className="press-play"><i></i></a>}
      </div>
      <ul className="metrics-list">
        <li className="metric">
          <h4>{FORMATTERS.bigNum(totalPageviews)}</h4>
          <p>Page Views (PV)</p>
        </li>
        <li className="metric">
          <h4>12.7 M</h4>
          <p>English Page Views (PVE)</p>
        </li>
        <li className="metric">
          <h4>{person.langs}</h4>
          <p>Different Languages (L)</p>
        </li>
        <li className="metric">
          <h4>7.19</h4>
          <p>Effective Languages (L*)</p>
        </li>
        <li className="metric">
          <h4>0.00459</h4>
          <p>Coefficient of Variation (CV)</p>
        </li>
      </ul>
    </div>
  );
};

export default MemMetrics;
