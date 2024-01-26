import { Icon } from "@blueprintjs/core";

const Results = ({ answers, questions, timer }) => {
  return (
    <div key={"triviaResultsDivData"}>
      {answers.map((answer) => {
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
                <span key={`eachAnswer_${answer.quid}`} className="a-yours">
                  (your answer)
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default Results;
