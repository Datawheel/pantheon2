import React, {useContext} from "react";
import TriviaContext from "pages/apps/trivia/TriviaContext.js";

const Question = () => {
  const {state} = useContext(TriviaContext);
  const {currentQuestion, questions} = state;
  const question = questions[currentQuestion];
  return <h2 className="trivia-question">{question.question}</h2>;
};

export default Question;
