import React from "react";
import { Helmet } from "react-helmet-async";

const Game = ({ children }) => (
  <div className="data-page">
    <Helmet title="Games - Pantheon" />
    <div>{children}</div>
  </div>
);

export default Game;
