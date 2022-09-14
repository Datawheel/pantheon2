import {React, useRef, useState} from "react";
import { Button, Card, Elevation, Callout, Dialog, Position } from "@blueprintjs/core";
import {Link} from "react-router";
import "./GameAlert.css";

const GameAlert = () => {

  const refHandlers = useRef();
  const [openAlert, setOpenAlert] = useState(true);

  return (
    //  <Dialog className="gamealert2"
    // isOpen={isOpen}
    // style={{ transition: 'none' }} 
    // onClose={() => setIsOpen(false)}
    // title={"Participate on our games"}
    // position={Position.TOP}
    // autoFocus={true}>
    //   <br />
    //   <div className="gamealert2inside">
    //   <button className="buttongamealert" onClick={event =>  window.location.href='/app/trivia'}>Play Trivia</button>
    //   <button className="buttongamealert" onClick={event =>  window.location.href='/game/birthle'}>Play Birthle</button>
    //   </div>
    // </Dialog>    
    <div className="gamealert" isOpen={openAlert}>
      New games! Play  
      <a href="/app/trivia" className="textgame" onClick={event =>  window.location.href='/app/trivia'}>Trivia</a> and<a href="/game/birthle" className="textgame" onClick={event =>  window.location.href='/game/birthle'}>Birthle</a>.
      {/* <button className="buttongamealert" onClick={event =>  window.location.href='/app/trivia'}>Trivia</button>
      and
      <button className="buttongamealert" onClick={event =>  window.location.href='/game/birthle'}>Birthle</button>. */}
    </div> 
  );
};

export default GameAlert;
