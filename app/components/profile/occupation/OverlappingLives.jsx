import React, {Component} from "react";
import {plural} from "pluralize";

const OverlappingLives = ({ people, occupation }) => {
  return (
    <div>
      <p>
        Which {plural(occupation.occupation)} were alive at the same time? This visualization shows the lifespans of the 25 most globally memorable {plural(occupation.occupation)} over all time.
      </p>
    </div>
  );
};

export default OverlappingLives;
