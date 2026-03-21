const ResultsReview = ({questions, answers}) => (
  <div className="results-review">
    <h3 className="results-review-title">Review</h3>
    <div className="review-list">
      {questions.map((q, i) => {
        const answer = answers[i];
        if (!answer) return null;

        const isCorrect = answer.correct;
        const userAnswer = answer.selectedIndex != null ? q.options[answer.selectedIndex] : "No answer";
        const correctAnswer = q.options[q.correctIndex];

        return (
          <div
            key={q.id}
            className={`review-row ${isCorrect ? "review-correct" : "review-incorrect"}`}
          >
            <span className={`review-indicator ${isCorrect ? "ind-correct" : "ind-incorrect"}`}>
              {isCorrect ? "\u2713" : "\u2717"}
            </span>
            <div className="review-body">
              <span className="review-q-text">{q.questionText}</span>
              <span className="review-answer-line">
                <span className="review-correct-val">{correctAnswer}</span>
                {!isCorrect && (
                  <span className="review-wrong-val">(You: {userAnswer})</span>
                )}
              </span>
            </div>
            {q.personSlug && (
              <a
                href={`/en/profile/person/${q.personSlug}`}
                className="review-link"
                target="_blank"
                rel="noopener noreferrer"
                title="View Profile"
              >
                &#8594;
              </a>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ResultsReview;
