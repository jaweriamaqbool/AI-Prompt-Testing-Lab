import ReactMarkdown from "react-markdown";
function TestDetail({ selectedTest, onBackToHistory, onNewTest }) {
  return (
    <section className="history-detail-section">
      {/* Header */}
      <div className="history-detail-header">
        <button
          type="button"
          className="back-button"
          onClick={onBackToHistory}
        >
          ← Back to History
        </button>

        <span className="section-number">
          TEST #{selectedTest.id}
        </span>

        <h1>Saved Test Results</h1>

        <p>
          Review the prompts, responses, evaluations, and ranking from this
          previous test.
        </p>
      </div>

      {/* Task */}
      <div className="saved-task-card">
        <span>Task</span>

        <h2>{selectedTest.task}</h2>
      </div>

      {/* Best Prompt */}
      <div className="saved-best-card">
        <div className="best-card-label">
          BEST PROMPT
        </div>

        <h2>{selectedTest.best_prompt}</h2>

        <div className="saved-best-score">
          {selectedTest.best_score}
          <span>/ 10</span>
        </div>
      </div>

      {/* Prompt Results */}
      <div className="saved-results-section">
        <div className="saved-results-heading">
          <div>
            <span className="section-number">
              COMPARISON
            </span>

            <h2>Prompt Results</h2>

            <p>
              Compare how each saved prompt performed.
            </p>
          </div>
        </div>

        <div className="saved-results-list">
          {selectedTest.results.map((result) => (
            <article
              className={`saved-result-card ${result.rank === 1
                ? "saved-result-winner"
                : ""
                }`}
              key={result.id}
            >
              {/* Result Header */}
              <div className="saved-result-header">
                <div className="saved-result-rank">
                  {result.rank
                    ? `#${result.rank}`
                    : "Failed"}
                </div>

                <div className="saved-result-title">
                  <span>Prompt</span>

                  <h3>{result.prompt}</h3>
                </div>

                <div className="saved-result-score">
                  {result.overall_score !== null
                    ? result.overall_score
                    : "—"}

                  {result.overall_score !== null && (
                    <small>/ 10</small>
                  )}
                </div>
              </div>

              {/* Error */}
              {result.error && (
                <div className="saved-result-error">
                  {result.error}
                </div>
              )}

              {/* Response */}
              {result.response && (
                <div className="saved-response">
                  <span>AI Response</span>

                  <div className="response-content">
                    <div className="response-body">
                      <ReactMarkdown>
                        {result.response}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {/* Evaluation */}
              {result.evaluation && (
                <div className="saved-evaluation">
                  <div className="evaluation-heading">
                    <span>Evaluation</span>
                  </div>

                  <div className="evaluation-grid">
                    <div className="evaluation-item">
                      <span>Accuracy</span>

                      <strong>
                        {result.evaluation.accuracy}/10
                      </strong>
                    </div>

                    <div className="evaluation-item">
                      <span>Relevance</span>

                      <strong>
                        {result.evaluation.relevance}/10
                      </strong>
                    </div>

                    <div className="evaluation-item">
                      <span>Completeness</span>

                      <strong>
                        {result.evaluation.completeness}/10
                      </strong>
                    </div>

                    <div className="evaluation-item">
                      <span>Clarity</span>

                      <strong>
                        {result.evaluation.clarity}/10
                      </strong>
                    </div>

                    <div className="evaluation-item">
                      <span>Creativity</span>

                      <strong>
                        {result.evaluation.creativity}/10
                      </strong>
                    </div>

                    <div className="evaluation-item">
                      <span>Conciseness</span>

                      <strong>
                        {result.evaluation.conciseness}/10
                      </strong>
                    </div>

                    <div className="evaluation-item">
                      <span>
                        Instruction Following
                      </span>

                      <strong>
                        {result.evaluation.instruction_following}/10
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="detail-bottom-action">
        <button
          type="button"
          className="new-test-button"
          onClick={onNewTest}
        >
          Test Different Prompts
        </button>
      </div>
    </section>
  );
}

export default TestDetail;