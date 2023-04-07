import React from "react";

const Progress = props =>
  <h3 className="progress">
    Question {props.current} of {props.total}
  </h3>;

export default Progress;
