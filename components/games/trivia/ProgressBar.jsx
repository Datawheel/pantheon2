const ProgressBar = ({current, total, answers}) => (
  <div className="progress-bar">
    <div className="progress-track">
      {/* Connecting line is rendered via CSS ::before */}
      <div className="progress-icons">
        {Array.from({length: total}, (_, i) => {
          let dotClass = "progress-dot";
          if (i < current && answers[i] != null) {
            dotClass += answers[i].correct ? " dot-correct" : " dot-incorrect";
          } else if (i === current) {
            dotClass += " dot-active";
          }
          const isSun = i === current;
          return (
            <span key={i} className={dotClass}>
              <img
                src={isSun ? "/images/trivia/sun-icon.png" : "/images/trivia/urn-icon.png"}
                alt=""
                className="progress-icon"
              />
            </span>
          );
        })}
      </div>
    </div>
  </div>
);

export default ProgressBar;
