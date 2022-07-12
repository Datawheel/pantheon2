import { useEffect, useRef, useState } from "react";
import "./Birthle.css";
import fetchSlugs from "./fetchSlugs";
import fetchPersons from "./fetchPersons";
import Result from "./components/Result/Result";
import Game from "./components/Game/Game";
import useTrait from "./useTrait";

const N_PERSONS = 5;
const MAX_ATTEMPTS = 4;

const boardCellDefault = {
  person: null,
  isCorrect: false,
};

const boardDefault = (() =>
  Array.from({ length: MAX_ATTEMPTS }, () =>
    Array.from({ length: N_PERSONS }, () => boardCellDefault)
  ))();

function Birthle() {
  const [persons, setPersons] = useState([]);
  const [sortedPersons, setSortedPersons] = useState([]);

  const fetchError = useTrait(false);
  const selectedPersons = useTrait([]);
  const board = useTrait(boardDefault);
  const personPos = useTrait(0);
  const attempt = useTrait(0);
  const isWin = useTrait(false);
  const resultToShare = useTrait("");

  const resultBlockRef = useRef(0);
  const gameBlockRef = useRef(0);
  const cancelBtnRef = useRef(0);
  const checkBtnRef = useRef(0);

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
    board.set(boardDefault);
    selectedPersons.set([]);
    setSortedPersons([]);
    checkBtnRef.current.disabled = true;
    cancelBtnRef.current.disabled = true;
    fetchData().catch(() => {
      fetchError.set(true);
    });
  }, []);

  return (
    <div className="birthle">
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
