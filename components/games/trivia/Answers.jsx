import Answer from "./Answer";

const Answers = ({ currentAnswer, currentQuestion, questions }) => {
  const question = questions[currentQuestion];

  return (
    <div className="answers">
      <Answer
        letter="a"
        answer={question.answer_a}
        selected={currentAnswer === "a"}
      />
      <Answer
        letter="b"
        answer={question.answer_b}
        selected={currentAnswer === "b"}
      />
      <Answer
        letter="c"
        answer={question.answer_c}
        selected={currentAnswer === "c"}
      />
      <Answer
        letter="d"
        answer={question.answer_d}
        selected={currentAnswer === "d"}
      />
    </div>
  );
};

export default Answers;
