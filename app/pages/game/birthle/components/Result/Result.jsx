import React from "react";
import { useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./Result.css";

function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

export default function Result({
  MAX_ATTEMPTS,
  sortedPersons,
  attempt,
  isWin,
  gameId,
  resultToShare,
  resultBlockRef,
}) {
  const shareBtn = useRef(0);

  const onShareBtnCLick = () => {
    shareBtn.current.innerHTML = "Copied";
    setTimeout(() => (shareBtn.current.innerHTML = "Share"), 1000);
  };


  const difference = +convertTZ(new Date(), "Europe/Paris") - +convertTZ(new Date(`09/15/2022 00:00:00`), "Europe/Paris");
  const gameIdShare = Math.ceil(difference/ (1000 * 60 * 60 * 24));
    
  return (
    <div className="result" ref={resultBlockRef}>
      <div className="result-block">
        <div className="result-block-border">
          {isWin.get() ? (
            <div className="result-title_success">You won!!!</div>
          ) : (
            <div className="result-title_fail">The correct order:</div>
          )}
          <div>
            <ul className="result-links-list">
              {sortedPersons.map((person) => (
                <li key={person.id}>
                  <a
                    className="result-link"
                    href={`https://pantheon.world/profile/person/${person.slug}`}
                  >
                    {person.name} ({person.birthyear})
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="btn-list">
            <div>
              <CopyToClipboard
              // ${attempt.get() + 1}/${MAX_ATTEMPTS}\n${resultToShare.get()}
                text={`Pantheon Birthle ${gameIdShare} \n${resultToShare.get()}\nhttps://pantheon.world/game/birthle \n#pantheon #birthle \nWhat about you?`}
                onCopy={onShareBtnCLick}
              >
                <button className="btn">
                  <span className="btn-share" ref={shareBtn}>
                    Share
                  </span>
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
