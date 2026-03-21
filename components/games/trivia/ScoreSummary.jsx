import {useState} from "react";
import StreakCounter from "./StreakCounter";

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

const ScoreSummary = ({answers, totalQuestions, gameNumber, streak, mode, score}) => {
  const [copied, setCopied] = useState(false);

  const correctCount = answers.filter((a) => a.correct).length;
  const emojiGrid = answers.map((a) => (a.correct ? "\u{1F7E9}" : "\u{1F7E5}")).join("");

  const shareText = [
    `Pantheon Trivia #${gameNumber}`,
    `Score: ${score}/${totalQuestions * 100} | ${correctCount}/${totalQuestions}`,
    emojiGrid,
    streak > 0 ? `\u{1F525} ${streak} day streak!` : "",
    "pantheon.world/game/trivia",
  ]
    .filter(Boolean)
    .join("\n");

  const handleShare = () => {
    copyToClipboard(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="score-summary">
      <h2 className="score-title">
        {correctCount}/{totalQuestions} correct
      </h2>
      <div className="score-points">{score} points</div>
      <div className="score-emoji">{emojiGrid}</div>

      <StreakCounter streak={streak} />

      {mode === "daily" && (
        <button className="share-btn" onClick={handleShare} type="button">
          {copied ? "Copied!" : "Share Results"}
        </button>
      )}
    </div>
  );
};

export default ScoreSummary;
