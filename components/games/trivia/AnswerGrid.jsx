import AnswerOption from "./AnswerOption";

const AnswerGrid = ({options, selectedIndex, revealed, correctIndex, onSelect, disabled}) => (
  <div className="answer-grid">
    {options.map((text, i) => (
      <AnswerOption
        key={i}
        index={i}
        text={text}
        selected={selectedIndex === i}
        revealed={revealed}
        correct={selectedIndex === correctIndex}
        isCorrectAnswer={i === correctIndex}
        onClick={onSelect}
        disabled={disabled}
      />
    ))}
  </div>
);

export default AnswerGrid;
