import React, { useReducer, useEffect, useRef, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Icon, Intent, Toaster, Position } from "@blueprintjs/core";
import { fetchData } from "@datawheel/canon-core";
import { Helmet } from "react-helmet-async";
import Progress from "pages/apps/trivia/Progress";
import Question from "pages/apps/trivia/Question";
import Answers from "pages/apps/trivia/Answers";
import TriviaContext from "pages/apps/trivia/TriviaContext.js";
import TriviaReducer from "pages/apps/trivia/TriviaReducer.js";
import DemographicForm from "pages/game/birthle/components/DemographicForm/DemographicForm"
import ConsentForm from "pages/game/birthle/components/ConsentForm/ConsentForm"
import {v4 as uuidv4} from "uuid";
import { translate } from "react-i18next";
import {loadReCaptcha, ReCaptcha} from "react-recaptcha-v3";

import {
  SET_ANSWERS,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWER,
  SET_ERROR,
  SET_SHOW_RESULTS,
  RESET_QUIZ
} from "pages/apps/trivia/reducerTypes.js";

import "pages/about/About.css";
import "pages/apps/trivia/Trivia.css";

function Countdown(props) {
  
  const {time} = props;
    
  return <div className="countdown.label"><img src="../images/icons/oec-trivia-timer.svg" />{time}</div>;
  
}

const Trivia = (props) => {

  
  const initialState = {
    questions: props.data.questions,
    currentQuestion: 0,
    currentAnswer: "",
    answers: [],
    showResults: false,
    error: ""
  };


  const { t, i18n } = props;
  const [time, setTime] = useState(15);
  const timer = useRef(null);
  const [isOpenConsentForm, setIsOpenConsentForm] = useState(false);
  const [scoreDB, setScoreDB] = useState(-1.0);
  const [firstOpen, setFirstOpen] = useState(true);
  const [saveConsent, setSaveConsent] = useState(false);
  const [isOpenDemographicForm, setIsOpenDemographicForm] = useState(false);
  const [state, dispatch] = useReducer(TriviaReducer, initialState);
  const [recap, setRecap] = useState(undefined);
  const [rKey, setRKey] = useState(10);
  const recaptchaRef = useRef();
  const refHandlers = useRef();
  const difference = +convertTZ(new Date(), "Europe/Paris") - +convertTZ(new Date(`10/06/2022 00:00:00`), "Europe/Paris");
  const gameIdShare = Math.ceil(difference/ (1000 * 60 * 60 * 24));


  
  const {
    questions,
    currentQuestion,
    currentAnswer,
    answers,
    showResults,
    error,
  } = state;

  const question = questions[currentQuestion];

  const renderError = () => {
    if (!error) {
      return;
    }

    return <div className="error">{error}</div>;
  };

  function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
  }

  const verifyCallback = (recaptchaToken) => {
    setRecap(recaptchaToken);
  }

  const renderResultsData = () =>
    answers.map((answer) => {
      const question = questions.find(
        (question) => question.id === answer.qid
      );
      const isCorrect = question.correct_answer === answer.ao;
      clearTimeout(timer.current);
      return (
        <div
          className={
            isCorrect
              ? "result-question q-correct"
              : "result-question q-incorrect"
          }
          key={question.id.toString()}
        >
          <div className="result-question-title">{question.question}</div>
          <div className="result-question-answer a-correct">
            <Icon icon="tick" iconSize={12} />{" "}
            {question[`answer_${question.correct_answer}`]}
          </div>
          {!isCorrect ? (
            <div className="result-question-answer a-incorrect">
              <Icon icon="cross" iconSize={12} />{" "}
              {question[`answer_${answer.ao}`]}{" "}
              <span key={`eachAnswer_${answer.quid}`} className="a-yours">(your answer)</span>
            </div>
          ) : null}
        </div>
      );
    });

  

  const restart = () => {

    axios.get("http://localhost:3300/api/trivia/getQuestionsCSV").then((resp) => {
      dispatch({ type: RESET_QUIZ, questions: resp.data });
    });
    
  };



  const updateUserID = async () => {

    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }

  }

  const saveGameDB = async () => {

    const now = convertTZ(new Date(), "Europe/Paris");
    const dateDB = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    const getGame = {
      game_share_id: gameIdShare,
      date : dateDB,
      game_number: 1,
      questions: questions
    };

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getGame)
    };

    const triviaGame =  await fetch("/api/getTriviaGame", requestOptions).then(resp => resp.json());
    
    if (triviaGame.length === 0) {
      await fetch("/api/createTriviaGame", requestOptions);
    }

  }

  const saveQuestion = async (answer, tempScore) => {

    const questionScore = {
      user_id : localStorage.getItem("mptoken"),
      game_share_id: gameIdShare,
      token: recap,
      answer: answer,
      scoreDB: tempScore
    };

    const requestOptionsS = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(questionScore)
    };
    await fetch("/api/createTriviaScore", requestOptionsS);
  }


  const fetchDB = async () => {

    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }
    
    const gameDataSave = {
      user_id: localStorage.getItem("mptoken")
    }
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(gameDataSave)
      };

    await fetch("/api/getParticipant", requestOptions)
        .then(resp => resp.json())
        .then(socioConsent => {
          if (socioConsent.length > 0) {
            setScoreDB(parseFloat(socioConsent[0].score_bot));
            setIsOpenDemographicForm(false);
          }else{
            setIsOpenDemographicForm(true);
          }
        });


    await fetch("/api/getConsent", requestOptions)
        .then(resp => resp.json())
        .then(consent => {
          if (consent.length > 0) {
            setScoreDB(parseFloat(consent[0].score_bot));
            setSaveConsent(false);
            setIsOpenConsentForm(false);
          }else{
            setSaveConsent(true);
            setIsOpenConsentForm(true);
          }
        });
    
  }

  const callDB = async (answer) => {
    
    if (scoreDB === -1) {

      const questionScore = {
        user_id : localStorage.getItem("mptoken"),
      };
      const requestOptions = {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(questionScore)
      };
      const consent = await fetch("/api/getConsent", requestOptions).then(resp => resp.json());
      
      if (consent.length > 0) {
        const tempScore = parseFloat(consent[0].score_bot);
        setScoreDB(tempScore);
        saveQuestion(answer, tempScore);
      }

    }else{
      saveQuestion(answer, scoreDB);
    }

  }

  const next = () => {

    if (firstOpen){

      fetchDB();
      setFirstOpen(false);

    }else{

      if (answers.length >= 0 && answers.length <= 10) {

        if (time > 0){
          if (!currentAnswer) {
            dispatch({ type: SET_ERROR, error: "Please select an option" });
            return;
          }
        }
  
        setRKey(rKey+1);
        
        const answer = {
          qid: question.id,
          quid: question.questionUid,
          ao : currentAnswer,
          at : currentAnswer !== ''? question[`answer_${currentAnswer}`]: '',
          cao : question.correct_answer,
          cat : question[`answer_${question.correct_answer}`]
        };
        callDB(answer);
        answers.push(answer);
        setTime(15);
        
        dispatch({ type: SET_ANSWERS, answers });
        dispatch({ type: SET_CURRENT_ANSWER, currentAnswer: "" });
        
        if (currentQuestion + 1 < questions.length) {
          dispatch({
            type: SET_CURRENT_QUESTION,
            currentQuestion: currentQuestion + 1,
          });
          return;
        }
        
        dispatch({ type: SET_SHOW_RESULTS, showResults: true });
      
      }
    }

    
  };

  useEffect(
    () => {
      timer.current = setTimeout(() => {
        setTime(time - 1);
        if (time === 0 || firstOpen){
          next();
        }
      }, 1 * 1000);

      
      return () => {
        clearTimeout(timer.current);
      };
    },
    [time]
  );

  useEffect(() => {

    updateUserID();
    loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");

    const keyPressHandler = (e) => {
      if (e.key === "Enter") {
        dispatch({ type: SET_ERROR, error: "" });
        next();
      }
      if (["a", "b", "c", "d"].includes(e.key)) {
        dispatch({
          type: SET_CURRENT_ANSWER,
          currentAnswer: e.key,
        });
        dispatch({ type: SET_ERROR, error: "" });
      }
    };

    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };

    

  }, [currentAnswer]);
  
  function Consent() {

    return <ConsentForm 
      isOpenConsentForm={isOpenConsentForm} 
      setIsOpenConsentForm ={setIsOpenConsentForm}
      universe={"trivia"}
      saveConsent = {saveConsent}
      setSaveConsent = {setSaveConsent}
      setScoreDB = {setScoreDB}
      scoreDB = {scoreDB}
      t = {t}
      />

  }

  function Demographic () {

      return <DemographicForm 
      isOpenDemographicForm = {isOpenDemographicForm}
      setIsOpenDemographicForm = {setIsOpenDemographicForm}
      universe = {"trivia"}
      scoreDB = {scoreDB}
      setScoreDB = {setScoreDB}
      t = {t}
      />

  }

  function copyToClipboard(text) {
    let dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  const addToast = (toast, callback) => {
    
    const defaultToast = {
      className: "toast-sucess",
      timeout: 5000,
      intent: Intent.SUCCESS,
      position: Position.BOTTOM
    };

    const toastOutput = Object.assign(defaultToast, toast);
    refHandlers.current.show(toastOutput);
  };

  const renderScore = () => {

    saveGameDB();
    let resultToShare = "";
    const correctAnswers = answers.filter((answer) => {
      const question = questions.find(
        (question) => question.id === answer.qid
      );

      if (question.correct_answer === answer.ao){
        resultToShare = resultToShare + "🟩";
      }
      
      return question.correct_answer === answer.ao;
    });

    while(resultToShare.length !== 20) {
      resultToShare = resultToShare + "🟥";
    }

    return (
      <span key={"renderScoreAnswers"}>
        {correctAnswers.length.toString()} / {answers.length.toString()} correct
        <br/>
        {/* {resultToShare}
        <br/> */}
      <button key={"buttonShareKey"} className="sharebutton" onClick = {() => {
            copyToClipboard("Pantheon Trivia "+ gameIdShare + "\n"+ resultToShare + correctAnswers.length + "0%" +
              "\nhttps://pantheon.world/app/trivia" +"\n#pantheon #trivia" +"\nWhat about you?");
            addToast({
              message: "Copied",
              intent: Intent.SUCCESS
            }, undefined);
          }}>Share</button>
          <Toaster key={"toasterTriviaPage"} ref={refHandlers} usePortal={false} position={Position.BOTTOM} >
          </Toaster>
      </span>
      
    );

    
  };

  function getRecaptcha() {

    return <ReCaptcha 
        id = "trivia"
        key={"trivia"+rKey.toString()}
        ref={recaptchaRef} 
        sitekey={'6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D'} 
        verifyCallback={verifyCallback} />


  }
  
  return (
    <TriviaContext.Provider key={"triviaContextProvider"} value={{ state, dispatch }}>
      {getRecaptcha()}
      {Demographic()}
      {Consent()}
      <Helmet key={"triviaTitle"} title="Trivia" />
      <div key={"triviaDiv1"}>
        <h1 key={"triviaTitleH1"} className="trivia-title">Trivia</h1>
        {showResults ? (
          <div key={"triviaResultsDiv"} className="results">

            <h2 key={"triviaResultsDivH2"}>Results: {renderScore()}</h2>
            <div key={"triviaResultsDivData"}>{renderResultsData()}</div>

            {/* <div className="continue">
              <button className="btn-continue" onClick={restart}>
                Restart
              </button>
            </div> */}
          </div>
        ) : (
          <div key={"triviaQuizDiv"} className="quiz">
            <div key={"triviaCountDownDiv"} className="countdown">
            <Countdown key={"triviaCountDownTime"} time={time} />
            <Question />
            <Progress total={questions.length} current={currentQuestion + 1} />
            {renderError()}
            <Answers />
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
      </div>
      <br/> <br/> <br/>
    </TriviaContext.Provider>
  );
};

Trivia.need = [
  fetchData("questions", "http://localhost:3300/api/trivia/getQuestionsCSV"),
];

export default translate()(connect((state) => ({ data: state.data }), {})(Trivia));