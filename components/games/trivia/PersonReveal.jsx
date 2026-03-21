const PersonReveal = ({question, correct, onNext}) => {
  const {explanation, personSlug, personId, personName} = question;

  const photoSrc = personId
    ? `https://static.pantheon.world/profile/people/${personId}.jpg`
    : null;
  const fallbackSrc = "/images/icons/icon-person.svg";

  return (
    <div className={`person-reveal ${correct ? "reveal-correct-bg" : "reveal-incorrect-bg"}`}>
      {/* Banner ribbon */}
      <div className={`reveal-banner ${correct ? "banner-correct" : "banner-incorrect"}`}>
        <span className="banner-text">{correct ? "Correct!" : "Incorrect!"}</span>
      </div>

      {/* Large portrait */}
      {photoSrc && (
        <div className="reveal-portrait-frame">
          <img
            src={photoSrc}
            alt={personName || ""}
            className="reveal-portrait"
            onError={e => { e.target.onerror = null; e.target.src = fallbackSrc; }}
          />
        </div>
      )}

      {/* Person name as profile link */}
      {personName && (
        personSlug ? (
          <a
            href={`/en/profile/person/${personSlug}`}
            className="reveal-person-name reveal-name-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            {personName}
          </a>
        ) : (
          <h3 className="reveal-person-name">{personName}</h3>
        )
      )}

      {/* Explanation */}
      <p className="reveal-explanation">{explanation}</p>

      {/* Next Question button */}
      <button
        type="button"
        className={`reveal-next-btn ${correct ? "btn-correct" : "btn-incorrect"}`}
        onClick={e => { e.stopPropagation(); onNext(); }}
      >
        Next Question &raquo;
      </button>
    </div>
  );
};

export default PersonReveal;
