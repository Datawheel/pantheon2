"use client";
import {useEffect, useRef, useState} from "react";
import useTrait from "./useTrait";
import Game from "./Game";
import Result from "./Result";
import fetchSlugs from "./fetchSlugs";
import fetchPersons from "./fetchPersons";
import {v4 as uuidv4} from "uuid";
import "./Birthle.css";

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function Birthle() {
  const MAX_ATTEMPTS = 3;
  const N_PERSONS = 5;
  const boardCellDefault = {
    person: null,
    isCorrect: false,
  };
  const boardDefault = (() =>
    Array.from({length: MAX_ATTEMPTS}, () =>
      Array.from({length: N_PERSONS}, () => boardCellDefault)
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
  const [correctPersons, setCorrectPersons] = useState(undefined);

  const checkBtnRef = useRef(0);
  const cancelBtnRef = useRef(0);
  const gameBlockRef = useRef(0);
  const resultBlockRef = useRef(0);

  const date = convertTZ(new Date(), "Europe/Paris");
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const gameNumber = 1;
  const gameDate = `${year}-${month}-${day}`;

  const fetchData = async () => {
    const slugs = await fetchSlugs();
    const persons = await fetchPersons(slugs);

    setPersons(persons);

    setSortedPersons(() =>
      [...persons].sort((a, b) => {
        if (a.birthyear === b.birthyear) {
          const dateA = new Date(a.birthdate);
          const dateB = new Date();

          return dateA - dateB;
        }

        return a.birthyear - b.birthyear;
      })
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }

    board.set(boardDefault);
    selectedPersons.set([]);
    setSortedPersons([]);
    fetchData().catch(() => {
      fetchError.set(true);
    });
  }, []);

  return (
    <div key={"birthleComponents"} className="birthle">
      <Game
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
        correctPersons={correctPersons}
        setCorrectPersons={setCorrectPersons}
      />
      <Result
        MAX_ATTEMPTS={MAX_ATTEMPTS}
        sortedPersons={sortedPersons}
        attempt={attempt}
        isWin={isWin}
        resultToShare={resultToShare}
        resultBlockRef={resultBlockRef}
      />
    </div>
  );
}

export default Birthle;
