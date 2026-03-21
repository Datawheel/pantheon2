const StreakCounter = ({streak}) => {
  if (!streak || streak <= 0) return null;

  return (
    <div className="streak-counter">
      <span className="streak-flame">&#128293;</span>
      <span className="streak-number">{streak}</span>
      <span className="streak-label">day streak</span>
    </div>
  );
};

export default StreakCounter;
