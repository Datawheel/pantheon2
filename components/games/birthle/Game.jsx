"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import Person from "./Person";
import "./Game.css";
// import { loadReCaptcha, ReCaptcha } from "react-recaptcha-v3";
import { useGoogleReCaptcha, GoogleReCaptcha } from "react-google-recaptcha-v3";

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
  gameDate,
  gameNumber,
  correctPersons,
  setCorrectPersons,
  scoreDB,
  setScoreDB,
  setIsOpenDemographicForm,
  setIsOpenConsentForm,
  setSaveConsent,
}) {
  const [recap, setRecap] = useState(undefined);
  const [rKey, setRKey] = useState(Math.random() * (15000 - 150) + 150);

  // const verifyCallback = (recaptchaToken) => {
  //   setRecap(recaptchaToken);
  // };

  // useEffect(() => {
  //   loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");
  // }, []);

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("yourAction");
    // Do whatever you want with the token
  }, [executeRecaptcha]);

  // You can use useEffect to trigger the verification as soon as the component being loaded
  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  const onPersonClick = (person) => {
    if (personPos.get() < N_PERSONS) {
      if (person !== undefined) {
        if (person.selected === false) {
          selectPerson(person);
          personPos.set(personPos.get() + 1);
        }
      }
    }

    if (personPos.get() > N_PERSONS - 1) checkBtnRef.current.disabled = false;

    cancelBtnRef.current.disabled = false;
  };

  const saveInformation = async function (correctPersonsAux) {
    const savePersons = [...persons].sort((a, b) => {
      if (a.birthyear === b.birthyear) {
        const dateA = new Date(a.birthdate);
        const dateB = new Date();

        return dateA - dateB;
      }

      return a.birthyear - b.birthyear;
    });

    const gameDataSave = {
      user_id: localStorage.getItem("mptoken"),
      game_date: gameDate,
      game_number: gameNumber,
      sorted_person_1: savePersons[0].slug,
      sorted_person_2: savePersons[1].slug,
      sorted_person_3: savePersons[2].slug,
      sorted_person_4: savePersons[3].slug,
      sorted_person_5: savePersons[4].slug,
      token: recap,
      scoreDB: scoreDB,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameDataSave),
    };

    const gameDB = await fetch("/api/getGame", requestOptions).then((resp) =>
      resp.json()
    );
    if (gameDB.length === 0) {
      await fetch("/api/createGame", requestOptions);
    }

    const gameDB2 = await fetch("/api/getGame", requestOptions).then((resp) =>
      resp.json()
    );

    if (gameDB2.length > 0) {
      const proposal = {
        game_share_id: gameDB2[0].id,
        trials: correctPersonsAux,
        solved: isWin.get() ? 1 : 0,
        user_id: localStorage.getItem("mptoken"),
        level: attempt.get(),
        token: recap,
      };

      const requestOptions2 = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposal),
      };
      await fetch("/api/createGameParticipation", requestOptions2);
    }
  };

  const fetchDB = async () => {
    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }

    const gameDataSave = {
      user_id: localStorage.getItem("mptoken"),
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameDataSave),
    };

    await fetch("/api/getParticipant", requestOptions)
      .then((resp) => resp.json())
      .then((socioConsent) => {
        console.log("socioConsent", socioConsent);
        if (socioConsent.length > 0) {
          setScoreDB(parseFloat(socioConsent[0].score_bot));
          setIsOpenDemographicForm(false);
        } else {
          setIsOpenDemographicForm(true);
        }
      });

    await fetch("/api/getConsent", requestOptions)
      .then((resp) => resp.json())
      .then((consent) => {
        console.log("consent", consent);
        if (consent.length > 0) {
          setScoreDB(parseFloat(consent[0].score_bot));
          setSaveConsent(false);
          setIsOpenConsentForm(false);
        } else {
          setSaveConsent(true);
          setIsOpenConsentForm(true);
        }
      });
  };

  const onCheckClick = () => {
    if (personPos.get() === 5 && attempt.get() === 2) {
      fetchDB();
    }

    if (personPos.get() === 5) {
      const newPersons = [...persons];

      newPersons.forEach((person) => (person.selected = false));
      setPersons(newPersons);

      const cells = document.querySelectorAll(".card");
      const newBoard = [...board.get()];
      const correctPersonsAux = [];

      newBoard[attempt.get()].map((cell, i) => {
        if (selectedPersons.get()[i].id === sortedPersons[i].id) {
          cell.isCorrect = true;
          correctPersonsAux.push(true);
          cells[N_PERSONS * attempt.get() + i + N_PERSONS].className =
            "card correct";
          resultToShare.set(resultToShare.get() + "🟩");
        } else {
          correctPersonsAux.push(false);
          cells[N_PERSONS * attempt.get() + i + N_PERSONS].className =
            "card wrong";
          resultToShare.set(resultToShare.get() + "🟥");
        }
      });

      setCorrectPersons(correctPersonsAux);
      isWin.set(correctPersonsAux.every((el) => el === true));

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

      setRKey(rKey + 1);
      // saveInformation(correctPersonsAux);
    }
  };

  const selectPerson = (person) => {
    const newBoard = [...board.get()];

    newBoard[attempt.get()][personPos.get()] = { person, isCorrect: false };
    newBoard[attempt.get()][personPos.get()].person.selected = true;
    board.set(newBoard);

    selectedPersons.set([...selectedPersons.get(), person]);
  };

  const onCancelClick = () => {
    if (selectedPersons.get().length > 0) {
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
    }
  };

  return (
    <div className="game-container">
      <main key="bGameDiv" className="game" ref={gameBlockRef}>
        <GoogleReCaptcha onVerify={handleReCaptchaVerify} />
        <div key="bGameDivHeader" className="game-header">
          <div key="bGameDivName" className="game-name">
            Who was born first?
          </div>
          <div key="bGameDivGoal" className="game-goal">
            Guess the correct order
          </div>
        </div>
        <div key="bGameDivPanel" className="game-panel">
          {!fetchError.get() ? (
            persons.length > 0 ? (
              <div key="bGameDivPanelDiv" className="panel">
                <ul key="bGameDivPanelList" className="panel-list">
                  {persons.map((person, i) => (
                    <Person
                      data={person}
                      onClick={() => onPersonClick(person)}
                      isBoardItem={false}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div key="bGameDivLoading" className="error-block">
                Loading...
              </div>
            )
          ) : (
            <div key="bGameDivErrorBlock" className="error-block">
              Try to reload game later
            </div>
          )}
        </div>
        <div key="gameBoard" className="game-board">
          <div key={"gameBoard2"} className="board">
            {
              <ul key={"gameBoardList"} className="board-list">
                {board.get().map((row, i) => (
                  <li key={`r${i}`}>
                    <ul key={`ulr${i}`} className="board-row-list">
                      {row.map((cell, j) => {
                        if (cell.person === null) {
                          return (
                            <li
                              className="board-row-list-item"
                              key={`${i}-${j}`}
                            >
                              <div
                                className="card board-item"
                                key={`b${i}-${j}`}
                              ></div>
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
          <div key={"gameButtons"} className="btn-list">
            <div>
              <button
                key={"gameCancel"}
                className="btn"
                ref={cancelBtnRef}
                onClick={onCancelClick}
              >
                <span key={"labelGameCancel"} className="btn-cancel">
                  Cancel
                </span>
              </button>
            </div>
            <div>
              <button
                key={"gameCheck"}
                className="btn"
                ref={checkBtnRef}
                onClick={onCheckClick}
              >
                <span key={"labelGameCheck"} className="btn-check">
                  Check
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
