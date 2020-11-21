import React, {useReducer, useEffect} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Icon} from "@blueprintjs/core";
import {hot} from "react-hot-loader/root";
import {fetchData} from "@datawheel/canon-core";
import {Helmet} from "react-helmet-async";
import Progress from "pages/apps/trivia/Progress";
import Question from "pages/apps/trivia/Question";
import Answers from "pages/apps/trivia/Answers";
import TriviaContext from "pages/apps/trivia/TriviaContext.js";
import TriviaReducer from "pages/apps/trivia/TriviaReducer.js";

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

const Trivia = props => {
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
    questions: props.data.questions,
    currentQuestion: 0,
    currentAnswer: "",
    answers: [],
    showResults: false,
    error: ""
  };

  const [state, dispatch] = useReducer(TriviaReducer, initialState);
  const {questions, currentQuestion, currentAnswer, answers, showResults, error} = state;

  const question = questions[currentQuestion];

  const renderError = () => {
    if (!error) {
      return;
    }

    return <div className="error">{error}</div>;
  };

  const renderResultsData = () => answers.map(answer => {
    const question = questions.find(
      question => question.id === answer.questionId
    );
    const isCorrect = question.correct_answer === answer.answer;

    return (
      <div className={isCorrect ? "result-question q-correct" : "result-question q-incorrect"} key={question.id}>
        <div className="result-question-title">{question.question}</div>
        <div className="result-question-answer a-correct">
          <Icon icon="tick" iconSize={12} /> {question[`answer_${question.correct_answer}`]}
        </div>
        {!isCorrect
          ? <div className="result-question-answer a-incorrect">
            <Icon icon="cross" iconSize={12} /> {question[`answer_${answer.answer}`]} <span className="a-yours">(your answer)</span>
          </div>
          : null}
      </div>
    );
  });

  const renderScore = () => {
    const correctAnswers = answers.filter(answer => {
      const question = questions.find(
        question => question.id === answer.questionId
      );
      return question.correct_answer === answer.answer;
    });
    return <span>{correctAnswers.length} / {answers.length} correct</span>;
  };

  const restart = () => {
    axios.get("/api/trivia/getQuestions")
      .then(resp => {
        // console.log("resp.data!!!", resp.data);
        dispatch({type: RESET_QUIZ, questions: resp.data});
      });
  };

  const next = () => {
    const answer = {questionId: question.id, answer: currentAnswer};

    if (!currentAnswer) {
      dispatch({type: SET_ERROR, error: "Please select an option"});
      return;
    }

    answers.push(answer);
    dispatch({type: SET_ANSWERS, answers});
    dispatch({type: SET_CURRENT_ANSWER, currentAnswer: ""});

    if (currentQuestion + 1 < questions.length) {
      dispatch({
        type: SET_CURRENT_QUESTION,
        currentQuestion: currentQuestion + 1
      });
      return;
    }

    dispatch({type: SET_SHOW_RESULTS, showResults: true});
  };

  useEffect(() => {
    const keyPressHandler = e => {
      if (e.key === "Enter") {
        dispatch({type: SET_ERROR, error: ""});
        next();
      }
      if (["a", "b", "c", "d"].includes(e.key)) {
        dispatch({
          type: SET_CURRENT_ANSWER,
          currentAnswer: e.key
        });
        dispatch({type: SET_ERROR, error: ""});
      }
    };

    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, [currentAnswer]);

  return <TriviaContext.Provider value={{state, dispatch}}>
    <Helmet title="Trivia" />
    <div className={showResults ? "trivia-page trivia-results" : "trivia-page"}>
      {/* <h1 className="trivia-title">Trivia</h1> */}
      {showResults
        ? <div className="results">
          <h2>Results: {renderScore()}</h2>
          <div>{renderResultsData()}</div>
          <div className="continue">
            <button className="btn-continue" onClick={restart}>Restart</button>
          </div>
        </div>
        : <div className="quiz">
          <Question />
          <Progress
            total={questions.length}
            current={currentQuestion + 1}
          />
          {renderError()}
          <Answers />
          <div className="continue">
            <button className={currentAnswer ? "btn-continue" : "btn-continue btn-disabled"} onClick={next}>Confirm and Continue</button>
          </div>
        </div>
      }
    </div>
  </TriviaContext.Provider>;
};

Trivia.need = [
  fetchData("questions", "https://pantheon.world/api/trivia/getQuestions")
];

export default connect(state => ({data: state.data}), {})(hot(Trivia));
