import React, {Component, PropTypes} from 'react';

const MemMetrics = () => {

  return (
    <div className="metrics-container">
      <div className="metric-vid">
        <a href="" className="press-play"><i></i></a>
      </div>
      <ul className="metrics-list">
        <li className="metric">
          <h4>27.4 M</h4>
          <p>Page Views (PV)</p>
        </li>
        <li className="metric">
          <h4>12.7 M</h4>
          <p>English Page Views (PVE)</p>
        </li>
        <li className="metric">
          <h4>64</h4>
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
