import StreakCounter from "./StreakCounter";

const ModeSelector = ({streak, dailyPlayed, onSelectMode}) => (
  <div className="mode-selector">
    <div className="mode-parchment">
      <h1 className="trivia-title">Pantheon Trivia</h1>
      <p className="trivia-subtitle">Test your knowledge of history&apos;s most notable figures</p>

      <StreakCounter streak={streak} />

      <div className="mode-buttons">
        <button
          className="mode-btn mode-daily"
          onClick={() => onSelectMode("daily")}
          disabled={dailyPlayed}
          type="button"
        >
          <span className="mode-icon">
            <img src="/images/trivia/sun-icon.png" alt="" className="mode-icon-img" />
          </span>
          <div className="mode-info">
            <span className="mode-title">Daily Challenge</span>
            <span className="mode-desc">
              {dailyPlayed
                ? "Come back tomorrow!"
                : "10 questions · 20s timer · same for everyone"}
            </span>
          </div>
        </button>

        <button
          className="mode-btn mode-practice"
          onClick={() => onSelectMode("practice")}
          type="button"
        >
          <span className="mode-icon">
            <img src="/images/trivia/urn-icon.png" alt="" className="mode-icon-img" />
          </span>
          <div className="mode-info">
            <span className="mode-title">Practice Mode</span>
            <span className="mode-desc">Unlimited play &middot; choose your difficulty</span>
          </div>
        </button>
      </div>
    </div>
  </div>
);

export default ModeSelector;
