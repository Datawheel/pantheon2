import {
  SET_ANSWERS,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWER,
  SET_ERROR,
  SET_SHOW_RESULTS,
  RESET_QUIZ
} from "pages/apps/trivia/reducerTypes.js";

/** */
function TriviaReducer(state, action) {
  switch (action.type) {
    case SET_CURRENT_ANSWER:
      return {
        ...state,
        currentAnswer: action.currentAnswer
      };
    case SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.currentQuestion
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.error
      };
    case SET_SHOW_RESULTS:
      return {
        ...state,
        showResults: action.showResults
      };
    case SET_ANSWERS:
      return {
        ...state,
        answers: action.answers
      };
    case RESET_QUIZ:
      return {
        ...state,
        answers: [],
        currentQuestion: 0,
        currentAnswer: "",
        showResults: false,
        error: "",
        questions: action.questions
      };
    default:
      return state;
  }
}

export default TriviaReducer;
