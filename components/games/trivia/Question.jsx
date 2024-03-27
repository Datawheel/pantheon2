const Question = ({questions, currentQuestion}) => {
  // const {state} = useContext(TriviaContext);
  // const {currentQuestion, questions} = state;
  const question = questions[currentQuestion];
  return (
    <h2 key={`${question.id}_triviaQuestion`} className="trivia-question">
      {question.question}
    </h2>
  );
};

export default Question;
