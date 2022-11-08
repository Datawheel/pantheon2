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


  const difference = +convertTZ(new Date(), "Europe/Paris") - +convertTZ(new Date(`10/06/2022 00:00:00`), "Europe/Paris");
  const gameIdShare = Math.ceil(difference/ (1000 * 60 * 60 * 24));
    
  return (
    <div key={"resultDiv"} className="result" ref={resultBlockRef}>
      <div key={"resultBlock"} className="result-block">
        <div key={"resultBlockBorder"} className="result-block-border">
          {isWin.get() ? (
            <div key={"resultTitleSuccess"} className="result-title_success">You won!!!</div>
          ) : (
            <div key={"resultTitleFail"} className="result-title_fail">The correct order:</div>
          )}
          <div>
            <ul key={"resultLinksList"} className="result-links-list">
              {sortedPersons.map((person) => (
                <li key={`${person.id}_people`}>
                  <a
                    key={`${person.id}_peopleLink`}
                    className="result-link"
                    href={`https://pantheon.world/profile/person/${person.slug}`}
                  >
                    {person.name} ({person.birthyear})
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div key={"resultBtnList"} className="btn-list">
            <div>
              <CopyToClipboard
              // ${attempt.get() + 1}/${MAX_ATTEMPTS}\n${resultToShare.get()}
                text={`Pantheon Birthle ${gameIdShare} \n${resultToShare.get()}\nhttps://pantheon.world/game/birthle \n#pantheon #birthle \nWhat about you?`}
                key="CopyToClipboardBirthle"
                onCopy={onShareBtnCLick}
              >
                <button key={"resultBtnShare"} className="btn">
                  <span key={"resultBtnShareLabel"} className="btn-share" ref={shareBtn}>
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
