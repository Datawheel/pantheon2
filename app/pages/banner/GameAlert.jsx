import { React, useRef } from "react";
import "pages/banner/GameAlert.css";

const GameAlert = () => {
  return (
    <div className="gamealert">
      New games! Play
      <a href="/app/trivia" className="textgame">
        Trivia
      </a>{" "}
      and
      <a href="/game/birthle" className="textgame">
        Birthle
      </a>
      .
    </div>
  );
};

export default GameAlert;
