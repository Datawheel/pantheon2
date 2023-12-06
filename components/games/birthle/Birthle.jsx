"use client";
import { useRef, useState } from "react";
import useTrait from "./useTrait";
import "./Birthle.css";

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function Birthle(props) {
  const { t, i18n } = props;
  const MAX_ATTEMPTS = 3;
  const N_PERSONS = 5;
  const boardCellDefault = {
    person: null,
    isCorrect: false,
  };
  const boardDefault = (() =>
    Array.from({ length: MAX_ATTEMPTS }, () =>
      Array.from({ length: N_PERSONS }, () => boardCellDefault)
    ))();

  const fetchError = useTrait(false);
  const [persons, setPersons] = useState([]);
  const [sortedPersons, setSortedPersons] = useState([]);
  const selectedPersons = useTrait([]);
  const board = useTrait(boardDefault);
  const personPos = useTrait(0);
  const attempt = useTrait(0);
  const isWin = useTrait(false);
  const resultToShare = useTrait("");
  const [userId, setUserId] = useState(undefined);
  const [correctPersons, setCorrectPersons] = useState(undefined);
  const [scoreDB, setScoreDB] = useState(-1);
  const [isOpenConsentForm, setIsOpenConsentForm] = useState(undefined);
  const [isOpenDemographicForm, setIsOpenDemographicForm] = useState(undefined);
  const [saveConsent, setSaveConsent] = useState(true);

  const checkBtnRef = useRef(0);
  const cancelBtnRef = useRef(0);
  const gameBlockRef = useRef(0);

  const date = convertTZ(new Date(), "Europe/Paris");
  const year = date.getFullYear();
  const day = date.getDate();
  const hour = date.getHours();
  const month = date.getMonth() + 1;
  const gameNumber = 1; // (hour >= 2 && hour < 14) ? 1 : 2;
  const gameDate = `${year}-${month}-${day}`; // 2022-5-25

  return (
    <div key={"birthleComponents"} className="birthle">
      GAME!!!
      {/* <Game
        MAX_ATTEMPTS={MAX_ATTEMPTS}
        N_PERSONS={N_PERSONS}
        fetchError={fetchError}
        persons={persons}
        setPersons={setPersons}
        selectedPersons={selectedPersons}
        sortedPersons={sortedPersons}
        board={board}
        boardCellDefault={boardCellDefault}
        personPos={personPos}
        attempt={attempt}
        isWin={isWin}
        resultToShare={resultToShare}
        checkBtnRef={checkBtnRef}
        cancelBtnRef={cancelBtnRef}
        resultBlockRef={resultBlockRef}
        gameBlockRef={gameBlockRef}
        gameDate={gameDate}
        gameNumber={gameNumber}
        userId={userId}
        correctPersons={correctPersons}
        setCorrectPersons={setCorrectPersons}
        scoreDB={scoreDB}
        setScoreDB={setScoreDB}
        setIsOpenDemographicForm={setIsOpenDemographicForm}
        setIsOpenConsentForm={setIsOpenConsentForm}
        setSaveConsent={setSaveConsent}
      /> */}
    </div>
  );
}

export default Birthle;
