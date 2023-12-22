"use client";
import { useCallback, useEffect, useRef, useState } from "react";
// import useTrait from "./useTrait";
// import Game from "./Game";
import ConsentForm from "../ConsentForm";
import DemographicForm from "../DemographicForm";
import Question from "./Question";
import Progress from "./Progress";
import Answers from "./Answers";
// import fetchSlugs from "./fetchSlugs";
// import fetchPersons from "./fetchPersons";
// import { v4 as uuidv4 } from "uuid";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import "./Trivia.css";

const TIME_PER_QUESTION = 1;

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function Trivia({ questions }) {
  const timer = useRef(null);
  const difference =
    +convertTZ(new Date(), "Europe/Paris") -
    +convertTZ(new Date(`10/06/2022 00:00:00`), "Europe/Paris");
  const gameIdShare = Math.ceil(difference / (1000 * 60 * 60 * 24));

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [firstOpen, setFirstOpen] = useState(true);
  const [isOpenConsentForm, setIsOpenConsentForm] = useState(false);
  const [saveConsent, setSaveConsent] = useState(false);
  const [isOpenDemographicForm, setIsOpenDemographicForm] = useState(true);
  const [scoreDB, setScoreDB] = useState(-1.0);

  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [time, setTime] = useState(5);
  const [rKey, setRKey] = useState(10);

  const question = questions[currentQuestion];

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

    await fetch("/api/getConsent", requestOptions)
      .then((resp) => resp.json())
      .then((consent) => {
        if (consent.length > 0) {
          setScoreDB(parseFloat(consent[0].score_bot));
          setSaveConsent(false);
          setIsOpenConsentForm(false);
        } else {
          window.location.href = "/game/birthle";
        }
      });
  };

  const next = useCallback(async () => {
    const token = await executeRecaptcha("trivia");
    if (firstOpen) {
      fetchDB();
      setFirstOpen(false);
    } else {
      if (answers.length >= 0 && answers.length <= 10) {
        if (time > 0) {
          if (!currentAnswer) {
            setError("Please select an option");
            return;
          }
        }

        setRKey(rKey + 1);

        const answer = {
          qid: question.id,
          quid: question.questionUid,
          ao: currentAnswer,
          at: currentAnswer !== "" ? question[`answer_${currentAnswer}`] : "",
          cao: question.correct_answer,
          cat: question[`answer_${question.correct_answer}`],
        };
        console.log("ANSWER!", answer);

        callDB(answer, token);
        setAnswers((prevAnswers) => [...prevAnswers, answer]);
        setTime(TIME_PER_QUESTION);

        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion + 1);
          return;
        }

        setShowResults(true);

        if (answers.length === 10) {
          await checkDemographics();
        }
      }
    }
  }, [executeRecaptcha, firstOpen, answers, time]);

  const checkDemographics = async () => {
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
        if (socioConsent.length > 0) {
          setScoreDB(parseFloat(socioConsent[0].score_bot));
          setIsOpenDemographicForm(false);
        } else {
          setIsOpenDemographicForm(true);
        }
      });
  };

  const callDB = async (answer, token) => {
    if (scoreDB === -1) {
      const questionScore = {
        user_id: localStorage.getItem("mptoken"),
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionScore),
      };
      const consent = await fetch("/api/getConsent", requestOptions).then(
        (resp) => resp.json()
      );

      if (consent.length > 0) {
        const tempScore = parseFloat(consent[0].score_bot);
        setScoreDB(tempScore);
        saveQuestion(answer, tempScore);
      }
    } else {
      console.log("GOT HERE!!!!");
      await saveQuestion(answer, scoreDB, token);
    }
  };

  const saveQuestion = async (answer, tempScore, token) => {
    const questionScore = {
      user_id: localStorage.getItem("mptoken"),
      game_share_id: gameIdShare,
      token: token,
      answer: answer,
      scoreDB: tempScore,
    };

    const requestOptionsS = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionScore),
    };
    await fetch("/api/createTriviaScore", requestOptionsS);
  };

  useEffect(() => {
    timer.current = setTimeout(() => {
      setTime(time - 1);
      if (time === 0 || firstOpen) {
        next();
      }
    }, 1 * 1000);

    return () => {
      clearTimeout(timer.current);
    };
  }, [time]);

  return (
    <div key={"triviaDiv1"}>
      <ConsentForm
        isOpenConsentForm={isOpenConsentForm}
        setIsOpenConsentForm={setIsOpenConsentForm}
        universe={"trivia"}
        saveConsent={saveConsent}
        setSaveConsent={setSaveConsent}
        scoreDB={scoreDB}
        setScoreDB={setScoreDB}
      />
      <DemographicForm
        isOpenDemographicForm={isOpenDemographicForm}
        setIsOpenDemographicForm={setIsOpenDemographicForm}
        universe={"trivia"}
        scoreDB={scoreDB}
        setScoreDB={setScoreDB}
      />
      <h1 key={"triviaTitleH1"} className="trivia-title">
        Trivia
      </h1>
      {showResults ? (
        <div key={"triviaResultsDiv"} className="results">
          {/* <h2 key={"triviaResultsDivH2"}>Results: {renderScore()}</h2> */}
          {/* <div key={"triviaResultsDivData"}>{renderResultsData()}</div> */}
        </div>
      ) : (
        <div key={"triviaQuizDiv"} className="quiz">
          <div key={"triviaCountDownDiv"} className="countdown">
            <div className="countdown.label">
              <img src="../images/icons/oec-trivia-timer.svg" />
              {time}
            </div>
            <Question questions={questions} currentQuestion={currentQuestion} />
            <Progress total={questions.length} current={currentQuestion + 1} />
            {error ? <div className="error">{error}</div> : null}
            <Answers
              currentAnswer={currentAnswer}
              currentQuestion={currentQuestion}
              questions={questions}
            />
            <div className="continue">
              <button
                className={
                  currentAnswer ? "btn-continue" : "btn-continue btn-disabled"
                }
                onClick={next}
              >
                Confirm and Continue
              </button>
            </div>
          </div>
        </div>
      )}
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

export default Trivia;
