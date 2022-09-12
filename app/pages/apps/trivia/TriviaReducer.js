import {
  SET_ANSWERS,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWER,
  SET_ERROR,
  SET_SHOW_RESULTS,
  RESET_QUIZ,
  UPDATE_DATE,
  GET_GAME_ID,
  GET_QUESTION_ID,
  UPDATE_CONSENT,
  SAVE_CONSENT,
} from "pages/apps/trivia/reducerTypes.js";

function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

/** */
function TriviaReducer(state, action) {
  switch (action.type) {
    case GET_GAME_ID:
      return {
        ...state,
        gameId: action.gameId
      };
    case UPDATE_CONSENT:
      return {
        ...state,
        isOpen: action.isOpen
      };
    case SAVE_CONSENT:
      return {
        ...state,
        saveConsent: action.saveConsent
      };
    case GET_QUESTION_ID:
      return {
        ...state,
        questionId: action.questionId
      };
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
    case UPDATE_DATE:
      return {
        ...state,
        currentDate: convertTZ(new Date(), "Europe/Paris")
      };
    case RESET_QUIZ:
      const date = convertTZ(new Date(), "Europe/Paris");
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const month = date.getMonth();
      return {
        ...state,
        answers: [],
        currentQuestion: 0,
        currentAnswer: "",
        showResults: false,
        timeLeft: {
          days: day,
          month: month,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          spentTime : 0
        },
        error: "",
        questions: action.questions
      };
    default:
      return state;
  }
}

export default TriviaReducer;
