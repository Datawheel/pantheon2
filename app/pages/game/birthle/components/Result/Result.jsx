import React from "react";
import { useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./Result.css";

export default function Result({
  MAX_ATTEMPTS,
  sortedPersons,
  attempt,
  isWin,
  resultToShare,
  resultBlockRef,
}) {
  const shareBtn = useRef(0);

  const onShareBtnCLick = () => {
    shareBtn.current.innerHTML = "Copied";
    setTimeout(() => (shareBtn.current.innerHTML = "Share"), 1000);
  };

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
            {isWin.get() ? (
              <div>
                <CopyToClipboard
                  text={`Pantheon ${
                    attempt.get() + 1
                  }/${MAX_ATTEMPTS}\n\n${resultToShare.get()}`}
                  onCopy={onShareBtnCLick}
                >
                  <button className="btn">
                    <span className="btn-share" ref={shareBtn}>
                      Share
                    </span>
                  </button>
                </CopyToClipboard>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
