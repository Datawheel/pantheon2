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
import DemographicForm from "../../game/birthle/components/DemographicForm/DemographicForm"
import {Classes, Dialog} from "@blueprintjs/core";
import classNames from "classnames";
import {v4 as uuidv4} from "uuid";
import { translate } from "react-i18next";


import {
  SET_ANSWERS,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWER,
  SET_ERROR,
  SET_SHOW_RESULTS,
  RESET_QUIZ,
  GET_GAME_ID,
  GET_QUESTION_ID,
  UPDATE_CONSENT,
  SAVE_CONSENT
} from "pages/apps/trivia/reducerTypes.js";

import "pages/about/About.css";
import "pages/apps/trivia/Trivia.css";

function Countdown(props) {
  
  const {time} = props;
    
  return <div className="countdown.label"><img src="../images/icons/oec-trivia-timer.svg" />{time}</div>;
  
}

const Trivia = (props) => {
  // const questions = [
  //   {
  //     id: 1,
  //     question: "What year was Tom Cruise born?",
  //     answer_a: "1962",
  //     answer_b: "1955",
  //     answer_c: "1971",
  //     answer_d: "1965",
  //     correct_answer: "a"
  //   },
  //   {
  //     id: 2,
  //     question: "Where was Boris Johnson born?",
  //     answer_a: "London, United Kingdom",
  //     answer_b: "Leeds, United Kingdom",
  //     answer_c: "Belfast, United Kingdom",
  //     answer_d: "New York City, USA",
  //     correct_answer: "d"
  //   },
  //   {
  //     id: 3,
  //     question: "Which of the following Musicians died in 1981?",
  //     answer_a: "John Lennon",
  //     answer_b: "Bob Marley",
  //     answer_c: "Muddy Waters",
  //     answer_d: "Keith Moon",
  //     correct_answer: "b"
  //   }
  // ];

  /**
   * Debug 'RESULTS' state with:
   const initialState = {
    answers: [
      {questionId: 1, answer: "d"},
      {questionId: 2, answer: "c"},
      {questionId: 3, answer: "a"}
    ],
    showResults: false,
   }
   */
  

  const initialState = {
    gameId: undefined,
    questionId: undefined,
    questions: props.data.questions,
    currentQuestion: 0,
    currentAnswer: "",
    answers: [],
    showResults: false,
    timeLeft: undefined,
    currentDate: new Date(),
    isOpen: true,
    saveConsent: true,
    error: ""
  };


  const { t, i18n } = props;
  const [time, setTime] = useState(15);
  const timer = useRef(null);
  const [openConsent, setOpenConsent] = useState(false);
  const [openDemo, setOpenDemo] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);
  const [state, dispatch] = useReducer(TriviaReducer, initialState);
  const refHandlers = useRef();
  const {
    gameId,
    questionId,
    questions,
    currentQuestion,
    currentAnswer,
    answers,
    showResults,
    timeLeft,
    currentDate,
    error,
    isOpen,
    saveConsent
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

  const calculateTimeLeft = () => {
    
    let year = currentDate.getFullYear();
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const month = currentDate.getMonth();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    if (timeLeft === undefined){
      return {
        days: day,
        month: month,
        hours: hours,
        minutes: minutes,
        seconds: seconds, 
        spentTime: 0
      };
    }
  
    const difference = +convertTZ(new Date(), "Europe/Paris") - +convertTZ(new Date(`${timeLeft.month}/${timeLeft.day}/${timeLeft.year} ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`), "Europe/Paris");
    // console.log(difference);

    if (difference > 0) {
      return {
        days: day,
        month: month,
        hours: hours,
        minutes: minutes,
        seconds: seconds, 
        spentTime: difference
      };
    }

    return timeLeft;
  };

  
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
    // axios.get("/api/trivia/getQuestions").then((resp) => {
    //   console.log("resp.data!!!", resp.data);
    //   dispatch({ type: RESET_QUIZ, questions: resp.data });
    // });
    axios.get("/api/trivia/getQuestionsCSV").then((resp) => {
      // console.log("resp.data!!!", resp.data);
      dispatch({ type: RESET_QUIZ, questions: resp.data });
    });
    
  };


  const fetchDB = async () => {

    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());
    }

    const now = convertTZ(new Date(), "Europe/Paris");
    const dateDB = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
    const getGame = {
      date : dateDB,
      game_number: 1
    };

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getGame)
    };

    const gameDBAux = await fetch("/api/getTriviaGame", requestOptions).then(resp => resp.json());
    // console.log("gameDBAux", gameDBAux);

    if (gameDBAux.length === 0){
      // console.log("gameDBAux.length", gameDBAux.length);
      await fetch("/api/createTriviaGame", requestOptions);
    }

    const gameDBid = await fetch("/api/getTriviaGame", requestOptions).then(resp => resp.json());
    // console.log("gameDBid.length", gameDBid.length);

    const getQuestion = {
      game_id: gameDBid[0].id,
      text: question.question,
      answer_a : question.answer_a,
      answer_b : question.answer_b,
      answer_c : question.answer_c,
      answer_d : question.answer_d,
      correct_answer : question.correct_answer,
    };

    const requestOptionsQ = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(getQuestion)
    };

    const gameDBaux = await fetch("/api/getTriviaQuestion", requestOptionsQ).then(resp => resp.json());

    if (gameDBaux.length === 0){
      await fetch("/api/createTriviaQuestion", requestOptionsQ);
      const gameDBaux = await fetch("/api/getTriviaQuestion", requestOptionsQ).then(resp => resp.json());
      dispatch({ type: GET_QUESTION_ID, questionId: gameDBaux[0].id });
    }

    const gameDBaux2= await fetch("/api/getTriviaQuestion", requestOptionsQ).then(resp => resp.json());
    // console.log("gameDBaux2.length", gameDBaux2.length);

    const questionScore = {
      user_id : localStorage.getItem("mptoken"),
      game_id: gameDBid[0].id,
      question_id: gameDBaux2[0].id, 
      answer: question[`answer_${question.correct_answer}`],
      correct_answer: question.correct_answer
    };

    const requestOptionsS = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(questionScore)
  };
    
    fetch("/api/createTriviaScore", requestOptionsS);

  }

  const next = () => {

    if (time > 0){
      if (!currentAnswer) {
        dispatch({ type: SET_ERROR, error: "Please select an option" });
        return;
      }
    }

    setTime(15);
    const answer = { questionId: question.id, answer: currentAnswer };

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

  };

  const checkConsent = async () => {

    const token = localStorage.getItem("mptoken");
    if (!token) {
      localStorage.setItem("mptoken", uuidv4());;
    }

    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          user_id: localStorage.getItem("mptoken")
        })
      };

    const socioConsent = await fetch("/api/getParticipant", requestOptions).then(resp => resp.json());
    if (socioConsent.length > 0) {
      setOpenDemo(false);
      setFirstOpen(false);
    }else{
      setOpenDemo(true);
      setFirstOpen(true);
    }

    const consent = await fetch("/api/getConsent", requestOptions).then(resp => resp.json());
    
    if (consent.length > 0) {
      dispatch({ type: UPDATE_CONSENT, isOpen: false });
      dispatch({ type: SAVE_CONSENT, saveConsent: false });
      setOpenConsent(false);
      setFirstOpen(false);
    }else{
      setOpenConsent(true);
      setFirstOpen(true);
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

    checkConsent();
    fetchDB();
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
    
    const noacceptBtn = "Do not accept"; // | t("text.game.no-accept");
    const acceptBtn = "Accept" // | t("text.game.accept");
    const consentFormContent = "<p>Welcome to Pantheon.world. By participating in our online games, you agree that your participation is voluntary and that the information you provide can be used for research purposes. The goal of this project is to understand human collective memory. </p> <p>If you agree to participate, we will collect data on your answers, and you will have the option to answer a demographic questionnaire (age, gender, location, education, and languages). The data collected will be anonymized at the moment of collection using a one-way (irreversible) hashing method. Participation data will be stored in pantheon.world servers. Anonymized data may be released publicly in the future for research purposes. As a user you can decide to end your participation in the study at any moment (no minimum participation time is required). You will not be paid for playing these online games. New games will be made available on a daily basis.</p> <p>This proposal has been reviewed and approved by the TSE-IAST Review Board for Ethical Standards in Research.</p> <p>In case of questions, contact <a href=\"mailto:hello@centerforcollectivelearning.org\">hello@centerforcollectivelearning.org</a> </p> <p>Agree and Continue</p>" 
    //| t("text.game.consent");

    return <Dialog
        isOpen={openConsent}
        id="dialogpopup"
        isCloseButtonShown={false}
        title={""}
      >
        <div className={classNames(Classes.DIALOG_BODY, "consent.consentform")}>
          <div dangerouslySetInnerHTML={{__html: consentFormContent}} />

          <div className={"consent.options"}>
          <button
          className={classNames("consent.button", "consent.lite")}
          onClick={event =>  window.location.href='/data/faq'}
          >{noacceptBtn}</button>
            <button
              className={"consent.button"}
              onClick={acceptClick}
            >{acceptBtn}</button>
          </div>
        </div>

      </Dialog>
  }

  function Demographic (){
    if (openDemo === true){
      return <DemographicForm 
        isOpenDemographicForm = {openDemo}
        setIsOpenDemographicForm = {setOpenDemo}
        universe = {"trivia"}
        t = {t}
      />
    }
  }

  const acceptClick = async () => {
    
    if (openConsent){

      setOpenConsent(false);
      setTime(15);

      if (!localStorage.getItem("mptoken")) {
        localStorage.setItem("mptoken", uuidv4());
      }

      dispatch({ type: UPDATE_CONSENT, isOpen: false });
      dispatch({ type: SAVE_CONSENT, saveConsent: false });

      const data = {
        user_id: localStorage.getItem("mptoken"),
        locale: "en",
        universe: "trivia",
        url: window.location.href
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

    const difference = +convertTZ(new Date(), "Europe/Paris") - +convertTZ(new Date(`09/15/2022 00:00:00`), "Europe/Paris");
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
      // <button onClick={() => {
      //   copyToClipboard(resultToShare + "\nhttps://pantheon.world/");
        // addToast({
        //   message: t("text.copied"),
        //   intent: Intent.SUCCESS
        // }, undefined);
      // }}>{"Copied!"}</button>
    );

    
  };

  return (
    <TriviaContext.Provider value={{ state, dispatch }}>
      {Demographic()}
      {Consent()}
      <Helmet title="Trivia" />
      <div
        // className={showResults ? "trivia-page trivia-results" : "trivia-page"}
      >
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
  // fetchData("questions", "http://localhost:3300/api/trivia/getQuestions"),
  // fetchData("questions", "https://pantheon.world/api/getTriviaQuestion"),
];

export default translate()(connect((state) => ({ data: state.data }), {})(Trivia));