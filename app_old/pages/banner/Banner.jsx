import React from "react";
import Link from "next/link";
import "./Banner.css";

const Banner = () => {
  return (
    <div className="banner">
      <div className="birthlebanner">
        <img className="birthleimage" src="./images/games/birthle.png" alt="" />
        <h2>Which famous person was born first?</h2>
        <span>Order famous people by their birth year</span>
        <br />
        <br />
        <button
          className="button"
          onClick={(event) => (window.location.href = "/game/birthle")}
        >
          Play
          <br />
          Birthle
        </button>
      </div>
      <div className="triviabanner">
        <img className="triviaimage" src="./images/games/trivia_5.png" alt="" />
        <h2>How much do you know about famous people?</h2>
        <span>Who was ... ? Which famous was born in ... ?</span>
        <br />
        <br />
        <button
          className="button"
          onClick={(event) => (window.location.href = "/app/trivia")}
        >
          Play
          <br />
          Trivia
        </button>
      </div>
    </div>
  );
};

export default Banner;
