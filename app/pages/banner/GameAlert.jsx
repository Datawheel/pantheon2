import {React, useRef, useState} from "react";
import "pages/banner/GameAlert.css";

const GameAlert = () => {

  const refHandlers = useRef();

  return (
    <div className="gamealert">
      New games! Play  
      <a href="/app/trivia" className="textgame" onClick={event =>  window.location.href='/app/trivia'}>Trivia</a> and<a href="/game/birthle" className="textgame" onClick={event =>  window.location.href='/game/birthle'}>Birthle</a>.
    </div> 
  );
};

export default GameAlert;
