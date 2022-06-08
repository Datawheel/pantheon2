import React from "react";
import Helmet from "react-helmet";

const Game = ({children}) => 
  <div className="data-page">
    <Helmet title="Game - Pantheon" />
    <div>{children}</div>
  </div>;

export default Game;
