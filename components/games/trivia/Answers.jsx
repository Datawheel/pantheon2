import Answer from "./Answer";

const Answers = ({
  currentAnswer,
  setCurrentAnswer,
  currentQuestion,
  questions,
}) => {
  const question = questions[currentQuestion];

  return (
    <div className="answers">
      <Answer
        letter="a"
        answer={question.answer_a}
        selected={currentAnswer === "a"}
        setCurrentAnswer={setCurrentAnswer}
      />
      <Answer
        letter="b"
        answer={question.answer_b}
        selected={currentAnswer === "b"}
        setCurrentAnswer={setCurrentAnswer}
      />
      <Answer
        letter="c"
        answer={question.answer_c}
        selected={currentAnswer === "c"}
        setCurrentAnswer={setCurrentAnswer}
      />
      <Answer
        letter="d"
        answer={question.answer_d}
        selected={currentAnswer === "d"}
        setCurrentAnswer={setCurrentAnswer}
      />
    </div>
  );
};

export default Answers;
