import React from "react";
import Person from "../Person/Person";
import "./Game.css";

export default function Game({
  MAX_ATTEMPTS,
  N_PERSONS,
  fetchError,
  persons,
  setPersons,
  selectedPersons,
  sortedPersons,
  board,
  boardCellDefault,
  personPos,
  attempt,
  isWin,
  resultToShare,
  checkBtnRef,
  cancelBtnRef,
  resultBlockRef,
  gameBlockRef,
}) {
  const onPersonClick = (event) => {
    const id = event.target.parentNode.id;
    const person = persons.find((person) => person.id === id);

    if (personPos.get() < N_PERSONS) {
      if (person.selected === false) {
        selectPerson(person);
        personPos.set(personPos.get() + 1);
      }
    }

    if (personPos.get() > N_PERSONS - 1) checkBtnRef.current.disabled = false;

    cancelBtnRef.current.disabled = false;
  };

  const onCheckClick = () => {
    const newPersons = [...persons];

    newPersons.forEach((person) => (person.selected = false));
    setPersons(newPersons);

    const cells = document.querySelectorAll(".card");
    const newBoard = [...board.get()];
    const correctPersons = [];

    newBoard[attempt.get()].map((cell, i) => {
      if (selectedPersons.get()[i].id === sortedPersons[i].id) {
        cell.isCorrect = true;
        correctPersons.push(true);
        cells[N_PERSONS * attempt.get() + i + N_PERSONS].className =
          "card correct";
        resultToShare.set(resultToShare.get() + "🟩");
      } else {
        correctPersons.push(false);
        cells[N_PERSONS * attempt.get() + i + N_PERSONS].className =
          "card wrong";
        resultToShare.set(resultToShare.get() + "🟥");
      }
    });

    isWin.set(correctPersons.every((el) => el === true));

    if (isWin.get()) {
      resultBlockRef.current.style.display = "block";
      gameBlockRef.current.style.display = "none";
    } else if (attempt.get() === MAX_ATTEMPTS - 1) {
      resultBlockRef.current.style.display = "block";
      gameBlockRef.current.style.display = "none";
    } else {
      board.set(newBoard);
      personPos.set(0);
      attempt.set(attempt.get() + 1);
      selectedPersons.set([]);
      resultToShare.set(resultToShare.get() + "\n");
    }

    checkBtnRef.current.disabled = true;
    cancelBtnRef.current.disabled = true;
  };

  const selectPerson = (person) => {
    const newBoard = [...board.get()];

    newBoard[attempt.get()][personPos.get()] = { person, isCorrect: false };
    newBoard[attempt.get()][personPos.get()].person.selected = true;
    board.set(newBoard);

    selectedPersons.set([...selectedPersons.get(), person]);
  };

  const onCancelClick = () => {
    const id = selectedPersons.get()[selectedPersons.get().length - 1].id;
    const newBoard = board.get();

    newBoard[attempt.get()][personPos.get() - 1] = boardCellDefault;

    const newPersons = persons.map((person) => {
      if (person.id === id) person.selected = false;

      return person;
    });

    setPersons(newPersons);

    const newSelectedPersons = selectedPersons.get();

    newSelectedPersons.pop();
    selectedPersons.set(newSelectedPersons);

    personPos.set(personPos.get() - 1);

    if (+personPos.get() === 0) {
      cancelBtnRef.current.disabled = true;
    }
  };

  return (
    <main className="game" ref={gameBlockRef}>
      <div className="game-header">
        <div className="game-name">Who was born first?</div>
        <div className="game-goal">Guess the correct order</div>
      </div>
      <div className="game-panel">
        {!fetchError.get() ? (
          persons.length > 0 ? (
            <div className="panel">
              <ul className="panel-list">
                {persons.map((person) => (
                  <Person
                    data={person}
                    onClick={onPersonClick}
                    isBoardItem={false}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="error-block">Loading...</div>
          )
        ) : (
          <div className="error-block">Try to reload game later</div>
        )}
      </div>
      <div className="game-board">
        <div className="board">
          {
            <ul className="board-list">
              {board.get().map((row, i) => (
                <li key={i}>
                  <ul className="board-row-list">
                    {row.map((cell, j) => {
                      if (cell.person === null) {
                        return (
                          <li className="board-row-list-item" key={`${i}-${j}`}>
                            <div className="card board-item"></div>
                          </li>
                        );
                      } else {
                        return (
                          <Person
                            data={cell.person}
                            isBoardItem={true}
                            dataKey={`${i}-${j}`}
                          />
                        );
                      }
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          }
        </div>
        <div className="btn-list">
          <div>
            <button className="btn" ref={cancelBtnRef} onClick={onCancelClick}>
              <span className="btn-cancel">Cancel</span>
            </button>
          </div>
          <div>
            <button className="btn" ref={checkBtnRef} onClick={onCheckClick}>
              <span className="btn-check">Check</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}