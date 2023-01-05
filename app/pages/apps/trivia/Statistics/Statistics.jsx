import React, { useEffect, useState } from "react";
import { Button, Classes, Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./Statistics.module.scss";

export default function Statistics({
  allScores,
  isOpenStatistics,
  setIsOpenStatistics,
  t,
}) {
  
  const acceptClick = async () => {
    setIsOpenStatistics(false);
  };

  useEffect(() => {
    if (allScores.length === 0){
      setIsOpenStatistics(false);
    }
  }, []);

  return (
    <Dialog
      isOpen={isOpenStatistics}
      id="statisticsD"
      key={"statisticsD"}
      isCloseButtonShown={false}
      title={"Statistics"}
    >
      <div
        key={"dialogbodyStatisticsTrivia"}
        className={classNames(Classes.DIALOG_BODY, styles.consentform)}
      >
        {/* <div
          key={"statisticsTriviaTitle"}
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: " " }}
        /> */}
        {allScores.length === 0 ? <div></div> :
        ( <div className="boardS">

            <div className="line1">
              <div className="bestScoreB">
                <span className="bestScore">{allScores[0].bestScore}</span>
              <span className="bestScoreLabel">Best Score (%)</span>
              </div>
              <div className="currentStreakB">
                <span className="currentStreak">{allScores[0].currentStreak}</span>
                <span className="currentStreakLabel">Current Streak</span>
              </div>
              <div className="maxStreakB">
                <span className="maxStreak">{allScores[0].maxStreak}</span>
                <span className="maxStreakLabel">Max Streak</span>
              </div>
            </div>
            <br/>
            <div className="line2">

              <div className="numberAttemptsB">
                <span className="numberAttempts">{allScores[0].numberAttempts}</span>
                <span className="numberAttemptsLabel">Attempts</span>
              </div>

              <div className="numberDaysB">
                <span className="numberDays">{allScores[0].numberDays}</span>
                <span className="numberDaysLabel">Days</span>
              </div>

              <div className="numberWinsB">
                <span className="numberWins">{allScores[0].numberWins}</span>
                <span className="numberWinsLabel">Wins</span>
              </div>

            </div>
          </div>)}


        <div
          id={"consentbuttons2"}
          key={"consentbuttons2"}
          className={classNames(styles.options, "consentbuttons2")}
        >
          <Button
            key={"closeStats"}
            id={"closeStats"}
            className={classNames(styles.button, styles.lite)}
            onClick={acceptClick}
          >
            Close
          </Button>
        
        </div>
      </div>
    </Dialog>
  );
}
