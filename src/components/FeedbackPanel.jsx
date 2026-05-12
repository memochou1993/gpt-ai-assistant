import './FeedbackPanel.css';

export default function FeedbackPanel({ feedback }) {
  const { overallFeedback, grammarCorrections, vocabularySuggestions } = feedback;

  return (
    <div className="feedback-panel">
      <h2 className="section-title">Detailed Feedback</h2>

      {overallFeedback && (
        <div className="feedback-block feedback-overall">
          <span className="feedback-block-icon">💬</span>
          <p>{overallFeedback}</p>
        </div>
      )}

      {grammarCorrections?.length > 0 && (
        <div className="feedback-block">
          <h3 className="feedback-block-title">
            <span>✏️</span> Grammar Corrections
          </h3>
          <ul className="correction-list">
            {grammarCorrections.map((item, i) => (
              <li key={i} className="correction-item">
                <span className="correction-original">"{item.original}"</span>
                <span className="correction-arrow">→</span>
                <span className="correction-fixed">"{item.corrected}"</span>
                {item.explanation && (
                  <p className="correction-note">{item.explanation}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {vocabularySuggestions?.length > 0 && (
        <div className="feedback-block">
          <h3 className="feedback-block-title">
            <span>📚</span> Vocabulary Suggestions
          </h3>
          <ul className="vocab-list">
            {vocabularySuggestions.map((item, i) => (
              <li key={i} className="vocab-item">
                <span className="vocab-original">"{item.word}"</span>
                <span className="correction-arrow">→</span>
                <span className="vocab-better">"{item.betterAlternative}"</span>
                {item.reason && (
                  <p className="correction-note">{item.reason}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!overallFeedback && !grammarCorrections?.length && !vocabularySuggestions?.length && (
        <p className="feedback-empty">No detailed feedback available.</p>
      )}
    </div>
  );
}
