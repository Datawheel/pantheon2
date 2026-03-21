const DIFFICULTIES = [
  {value: "easy", label: "Easy", desc: "Well-known figures"},
  {value: "medium", label: "Medium", desc: "Moderately famous"},
  {value: "hard", label: "Hard", desc: "Deep cuts"},
  {value: "mixed", label: "Mixed", desc: "A bit of everything"},
];

const DifficultySelector = ({onSelect, onBack}) => (
  <div className="difficulty-selector">
    <div className="mode-parchment">
      <h2 className="difficulty-title">Choose Difficulty</h2>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            className={`difficulty-btn difficulty-${d.value}`}
            onClick={() => onSelect(d.value)}
            type="button"
          >
            <span className="diff-label">{d.label}</span>
            <span className="diff-desc">{d.desc}</span>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={onBack} type="button">
        &larr; Back
      </button>
    </div>
  </div>
);

export default DifficultySelector;
