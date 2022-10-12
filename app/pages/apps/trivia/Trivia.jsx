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
import {Classes, Dialog} from "@blueprintjs/core";
import classNames from "classnames";
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
    timeLeft: undefined,
    currentDate: new Date(),
    error: ""
  };


  const { t, i18n } = props;
  const [time, setTime] = useState(15);
  const timer = useRef(null);
  const [openConsent, setOpenConsent] = useState(false);
  const [saveConsent, setSaveConsent] = useState(false);
  const [openDemo, setOpenDemo] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);
  const [state, dispatch] = useReducer(TriviaReducer, initialState);
  const [recap, setRecap] = useState(undefined);
  const [gameId, setGameId] = useState(undefined);
  const [rKey, setRKey] = useState(10);
  const recaptchaRef = useRef();
  const refHandlers = useRef();

  
  const {
    questions,
    currentQuestion,
    currentAnswer,
    answers,
    showResults,
    timeLeft,
    currentDate,
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
        (question) => question.id === answer.questionId
      );
      const isCorrect = question.correct_answer === answer.answer;
      clearTimeout(timer.current);
      return (
        <div
          className={
            isCorrect
              ? "result-question q-correct"
              : "result-question q-incorrect"
          }
          key={question.id}
        >
          <div className="result-question-title">{question.question}</div>
          <div className="result-question-answer a-correct">
            <Icon icon="tick" iconSize={12} />{" "}
            {question[`answer_${question.correct_answer}`]}
          </div>
          {!isCorrect ? (
            <div className="result-question-answer a-incorrect">
              <Icon icon="cross" iconSize={12} />{" "}
              {question[`answer_${answer.answer}`]}{" "}
              <span className="a-yours">(your answer)</span>
            </div>
          ) : null}
        </div>
      );
    });

  

  const restart = () => {
    axios.get("/api/trivia/getQuestionsCSV").then((resp) => {
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
      date : dateDB,
      game_number: 1
    };

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getGame)
    };

    
    const triviaGame =  await fetch("/api/getTriviaGame", requestOptions).then(resp => resp.json());

    if (triviaGame.length === 0) {
      await fetch("/api/createTriviaGame", requestOptions);
      const gameDBid = await fetch("/api/getTriviaGame", requestOptions).then(resp => resp.json());
      setGameId(gameDBid[0].id);
    }else {
      setGameId(triviaGame[0].id);
    }
    
  }

  const saveInformation = () => {
    answers.map((answer) => {
      setRKey(rKey+1);
      callDB(answer);
    }); 
    
  }

  
  const callDB = async (getQuestion) => {

    const requestOptionsQ = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(getQuestion)
    };
   
    const gameDBaux = await fetch("/api/getTriviaQuestion", requestOptionsQ).then(resp => resp.json());
    if (gameDBaux.length === 0){
      await fetch("/api/createTriviaQuestion", requestOptionsQ);
    }

    console.log("create", gameDBaux,gameDBaux.length);

    const gameDBaux2 = await fetch("/api/getTriviaQuestion", requestOptionsQ).then(resp => resp.json());
    
    const questionScore = {
      user_id : localStorage.getItem("mptoken"),
      game_id: gameId,
      question_id: gameDBaux2[0].id, 
      answer: getQuestion.answer,
      correct_answer: getQuestion.correct_answer,
      token: recap
    };

    const requestOptionsS = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(questionScore)
    };

    const myTriviaScore = await fetch("/api/getTriviaScore", requestOptionsS).then(resp => resp.json());
    console.log("myTriviaScore", myTriviaScore);
    if (myTriviaScore.length === 0){
      await fetch("/api/createTriviaScore", requestOptionsS);
    }

  }

  const next = () => {

    if (time > 0){
      if (!currentAnswer) {
        dispatch({ type: SET_ERROR, error: "Please select an option" });
        return;
      }
    }

    setRKey(rKey+1);
    const answer = { 
      questionId: question.id, 
      answer: currentAnswer,
      game_id: gameId,
      text: question.question,
      answer_a : question.answer_a,
      answer_b : question.answer_b,
      answer_c : question.answer_c,
      answer_d : question.answer_d,
      correct_answer : question.correct_answer,
      token: recap 
    };
    
    callDB(answer);
    setTime(15);

    answers.push(answer);
    
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
    

    if (answers.length === 10) {
      saveInformation();
      
    }



  };

  const checkConsent = async () => {

    updateUserID();

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          user_id: localStorage.getItem("mptoken")
        })
      };

    const consent = await fetch("/api/getConsent", requestOptions).then(resp => resp.json());

    if (consent.length > 0) {
      setOpenConsent(false);
      setFirstOpen(false);
    }else{
      setOpenConsent(true);
      setFirstOpen(true);
    }
    const socioConsent = await fetch("/api/getParticipant", requestOptions).then(resp => resp.json());
    if (socioConsent.length === 0 && !openConsent) {
      setOpenDemo(true);
      setFirstOpen(true);
    }else{
      setOpenDemo(false);
      setFirstOpen(false);
    }
    

  }

  useEffect(
    () => {
      timer.current = setTimeout(() => {
        setTime(time - 1);
        if (time === 0){
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

    loadReCaptcha("6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D");
    updateUserID();
    // checkConsent();
    saveGameDB();

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
    
    // const consentText = t("text.game.popup.consent-form");
    console.log(localStorage.getItem("mptoken"));
    return <ConsentForm 
      isOpen={openConsent} 
      setIsOpenConsentForm ={setOpenConsent}
      userId={localStorage.getItem("mptoken")}
      universe={"trivia"}
      saveConsent = {saveConsent}
      setSaveConsent = {setSaveConsent}
      t = {t}
      />

    // return <Dialog
    //     isOpen={openConsent}
    //     id="dialogpopup"
    //     isCloseButtonShown={false}
    //     title={""}
    //   >
    //     <div className={classNames(Classes.DIALOG_BODY, "consent.consentform")}>
    //     <div className={"consent.description"} dangerouslySetInnerHTML={{__html:consentText}} />

    //     <div className={"consent.options"}>
    //       <button
    //       className={classNames("consent.button", "consent.lite")}
    //       onClick={event =>  window.location.href='/data/faq'}
    //       >Do not accept</button>
    //         <button
    //           className={"consent.button"}
    //           onClick={acceptClick}
    //         >Accept</button>
    //       </div>
    //     </div>

    //   </Dialog>
  }

  function Demographic () {

    if (openDemo === true){

      return <DemographicForm 
        isOpenDemographicForm = {openDemo}
        setIsOpenDemographicForm = {setOpenDemo}
        isOpen={openConsent}
        universe = {"trivia"}
        t = {t}
      />

    }
  }


  const acceptClick = async () => {

    if (openConsent){

      updateUserID();
      setOpenConsent(false);
      setTime(15);

      
      const data = {
        user_id: localStorage.getItem("mptoken"),
        locale: "en",
        universe: "trivia",
        url: window.location.href,
        token: recap
      };
      
      const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      };
      
      await fetch("/api/createConsent", requestOptions);

    }
    
  }

  function copyToClipboard(text) {
    let dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
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
    let resultToShare = "";
    const correctAnswers = answers.filter((answer) => {
      const question = questions.find(
        (question) => question.id === answer.questionId
      );

      if (question.correct_answer === answer.answer){
        resultToShare = resultToShare + "🟩";
      }
      // if ((resultToShare.length === Math.ceil(questions.length/2)) || (resultToShare.length === questions.length)){
      //   resultToShare = resultToShare + "\n";
      // }
      
      return question.correct_answer === answer.answer;
    });

    while(resultToShare.length !== 20) {
      resultToShare = resultToShare + "🟥";
    }

    const difference = +convertTZ(new Date(), "Europe/Paris") - +convertTZ(new Date(`10/06/2022 00:00:00`), "Europe/Paris");
    const gameIdShare = Math.ceil(difference/ (1000 * 60 * 60 * 24));

    return (
      <span>
        {correctAnswers.length} / {answers.length} correct
        <br/>
        {/* {resultToShare}
        <br/> */}
        <button classname="sharebutton" onClick = {() => {
            copyToClipboard("Pantheon Trivia "+ gameIdShare + "\n"+ resultToShare + correctAnswers.length + "0%" +
              "\nhttps://pantheon.world/app/trivia" +"\n#pantheon #trivia" +"\nWhat about you?");
            addToast({
              message: "Copied",
              intent: Intent.SUCCESS
            }, undefined);
          }}>Share</button>
          <Toaster ref={refHandlers} usePortal={false} position={Position.BOTTOM} >
          </Toaster>
      </span>
      
    );

    
  };

  function getRecaptcha() {
  
    return <ReCaptcha 
      key={rKey}
      ref={recaptchaRef} 
      sitekey={'6LfSffshAAAAAEUHlJ08Lk0YtnfJtXlBWsA2yq1D'} 
      verifyCallback={verifyCallback} />
  }
  
  return (
    <TriviaContext.Provider value={{ state, dispatch }}>


      {getRecaptcha()}
      {Demographic()}
      {Consent()}
      <Helmet title="Trivia" />
      <div>
        <h1 className="trivia-title">Trivia</h1>
        {showResults ? (
          <div className="results">
            <h2>Results: {renderScore()}</h2>
            <div>{renderResultsData()}</div>
            <div className="continue">
              <button className="btn-continue" onClick={restart}>
                Restart
              </button>
              
            </div>
          </div>
        ) : (
          <div className="quiz">
            <div className="countdown">
            <Countdown time={time} />
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