const TimerBar = ({timeLeft, maxTime}) => {
  const pct = Math.max(0, (timeLeft / maxTime) * 100);
  let colorClass = "timer-gold";
  if (pct <= 25) colorClass = "timer-danger";
  else if (pct <= 50) colorClass = "timer-warn";

  return (
    <div className="timer-bar-container">
      <div className="timer-bar-track">
        <div
          className={`timer-bar-fill ${colorClass}`}
          style={{width: `${pct}%`}}
        />
      </div>
      <span className="timer-bar-text">{timeLeft > 0 ? timeLeft : 0}s</span>
    </div>
  );
};

export default TimerBar;
