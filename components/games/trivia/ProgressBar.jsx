const ProgressBar = ({current, total, answers}) => (
  <div className="progress-bar">
    <div className="progress-track">
      <div className="progress-icons">
        {Array.from({length: total}, (_, i) => {
          const answer = answers[i];
          const isAnswered = i < current && answer != null;
          const isCorrect = isAnswered && answer.correct;
          const isIncorrect = isAnswered && !answer.correct;
          const isActive = i === current;

          let dotClass = "progress-dot";
          if (isCorrect) dotClass += " dot-correct";
          else if (isIncorrect) dotClass += " dot-incorrect";
          else if (isActive) dotClass += " dot-active";

          return (
            <span key={i} className={dotClass}>
              {isCorrect ? (
                <span className="progress-result-icon result-correct">&#10003;</span>
              ) : isIncorrect ? (
                <span className="progress-result-icon result-incorrect">&#10007;</span>
              ) : (
                <img
                  src={isActive ? "/images/trivia/sun-icon.png" : "/images/trivia/urn-icon.png"}
                  alt=""
                  className="progress-icon"
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  </div>
);

export default ProgressBar;
