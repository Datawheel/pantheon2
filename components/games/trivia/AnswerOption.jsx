const LETTERS = ["A", "B", "C", "D"];

const AnswerOption = ({index, text, selected, revealed, correct, isCorrectAnswer, onClick, disabled}) => {
  let className = "answer-option";
  if (selected) className += " selected";
  if (revealed) {
    if (isCorrectAnswer) className += " reveal-correct";
    else if (selected && !correct) className += " reveal-incorrect";
    else className += " reveal-neutral";
  }

  return (
    <button
      className={className}
      onClick={() => !disabled && onClick(index)}
      disabled={disabled}
      type="button"
    >
      <span className="answer-letter">{index + 1}.</span>
      <span className="answer-text">{text}</span>
      {revealed && isCorrectAnswer && <span className="answer-icon">&#10003;</span>}
      {revealed && selected && !correct && <span className="answer-icon answer-icon-wrong">&#10007;</span>}
    </button>
  );
};

export default AnswerOption;
