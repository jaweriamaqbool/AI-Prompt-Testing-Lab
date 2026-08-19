import ReactMarkdown from "react-markdown";
const evaluationLabels = {
  accuracy: "Accuracy",
  relevance: "Relevance",
  completeness: "Completeness",
  clarity: "Clarity",
  creativity: "Creativity",
  conciseness: "Conciseness",
  instruction_following: "Instruction Following",
};
function ResultsView({
  results,
  expandedResults,
  onToggleResponse,
  onNewTest,
}) {
  return (
    <section className="results-section">
      {/* Results Header */}
      <div className="results-heading">
        <div>
          <span className="section-number"></span>
          <h2>Test Results</h2>
        </div>

        <span>
          {results.results.length} prompts compared
        </span>
      </div>

      {/* Best Prompt */}
      <div className="best-prompt-card">
        <div className="best-badge">
          <span>✦</span>
          BEST PROMPT
        </div>

        <div className="best-content">
          <div className="best-prompt-text">
            {results.best_prompt}
          </div>

          <div className="best-score">
            <strong>{results.best_score}</strong>
            <span>/ 10</span>
          </div>
        </div>

        <p>
          This prompt achieved the highest overall score
          across all evaluation criteria.
        </p>
      </div>

      {/* Comparison */}
      <div className="comparison-header">
        <div>
          <span className="section-number"></span>
          <h2>Prompt Comparison</h2>
        </div>

        <span>Ranked from highest to lowest</span>
      </div>

      <div className="results-list">
        {results.results.map((result, index) => {
          const isExpanded = expandedResults[index];
          const isWinner = result.rank === 1;

          return (
            <article
              className={`result-card ${isWinner ? "winner" : ""
                }`}
              key={index}
            >
              {/* Result Header */}
              <div className="result-header">
                <div className="rank-container">
                  <div className="rank">
                    #{result.rank ?? "—"}
                  </div>

                  {isWinner && (
                    <span className="winner-label">
                      Winner
                    </span>
                  )}
                </div>

                <div className="result-score">
                  {result.overall_score !== null
                    ? result.overall_score
                    : "—"}

                  <span>/ 10</span>
                </div>
              </div>

              {/* Prompt */}
              <div className="result-prompt">
                <span>Prompt</span>
                <p>{result.prompt}</p>
              </div>

              {/* Error */}
              {result.error && (
                <div className="result-error">
                  {result.error}
                </div>
              )}

              {/* Evaluation */}
              {result.evaluation && (
                <div className="evaluation-section">
                  <div className="evaluation-title">
                    Evaluation
                  </div>

                  <div className="evaluation-grid">
                    {Object.entries(result.evaluation).map(
                      ([key, score]) => (
                        <div
                          className="evaluation-item"
                          key={key}
                        >
                          <div className="evaluation-label">
                            <span>
                              {evaluationLabels[key] || key}
                            </span>

                            <strong>
                              {score}/10
                            </strong>
                          </div>

                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{
                                width: `${score * 10}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* AI Response */}
              {result.response && (
                <div className="response-section">
                  <button
                    className="response-toggle"
                    type="button"
                    onClick={() =>
                      onToggleResponse(index)
                    }
                  >
                    <span>AI Response</span>

                    <span>
                      {isExpanded
                        ? "Hide response ↑"
                        : "View response ↓"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="response-content">
                      <div className="response-body">
                        <ReactMarkdown>
                          {result.response}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* New Test */}
      <div className="new-test-container">
        <button
          className="new-test-button"
          type="button"
          onClick={onNewTest}
        >
          Test Different Prompts
        </button>
      </div>
    </section>
  );
}

export default ResultsView;