function History({
  history,
  historyLoading,
  onOpenTest,
  onStartTest,
}) {
  return (
    <section className="history-page">
      {/* Header */}
      <div className="history-page-header">
        <div className="history-heading">
          <span className="history-section-number"></span>

          <h1>Test History</h1>

          <p>
            Revisit your previous prompt comparisons and discover
            which prompts performed best.
          </p>
        </div>

        {!historyLoading && history.length > 0 && (
          <div className="history-count">
            <strong>{history.length}</strong>
            <span>
              {history.length === 1 ? "saved test" : "saved tests"}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {historyLoading && (
        <div className="history-loading-state">
          <div className="history-spinner"></div>

          <h2>Loading your tests</h2>

          <p>
            Retrieving your previous prompt comparisons...
          </p>
        </div>
      )}

      {/* Empty History */}
      {!historyLoading && history.length === 0 && (
        <div className="history-empty-state">
          <div className="history-empty-icon">
            ✦
          </div>

          <h2>No tests yet</h2>

          <p>
            Your saved prompt comparisons will appear here once
            you run your first test.
          </p>

          <button
            className="history-primary-button"
            type="button"
            onClick={onStartTest}
          >
            Start Your First Test
            <span>→</span>
          </button>
        </div>
      )}

      {/* History List */}
      {!historyLoading && history.length > 0 && (
        <div className="history-grid">
          {history.map((test, index) => {
            const score =
              test.best_score !== null &&
              test.best_score !== undefined
                ? Number(test.best_score)
                : null;

            return (
              <article
                className="history-test-card"
                key={test.id}
              >
                {/* Card Top */}
                <div className="history-card-top">
                  <div className="history-test-number">
                    <span>TEST</span>
                    <strong>#{test.id}</strong>
                  </div>

                  <div className="history-card-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Task */}
                <div className="history-test-task">
                  <span className="history-label">
                    TASK
                  </span>

                  <h2>
                    {test.task}
                  </h2>
                </div>

                {/* Score */}
                <div className="history-score-block">
                  <div>
                    <span className="history-label">
                      BEST SCORE
                    </span>

                    <div className="history-score">
                      <strong>
                        {score !== null ? score : "—"}
                      </strong>

                      {score !== null && (
                        <span>/ 10</span>
                      )}
                    </div>
                  </div>

                  {score !== null && (
                    <div className="history-score-badge">
                      {score >= 9
                        ? "Excellent"
                        : score >= 8
                          ? "Strong"
                          : score >= 7
                            ? "Good"
                            : "Needs improvement"}
                    </div>
                  )}
                </div>

                {/* Best Prompt */}
                <div className="history-best-prompt">
                  <span className="history-label">
                    BEST PROMPT
                  </span>

                  <p>
                    {test.best_prompt ||
                      "No best prompt available"}
                  </p>
                </div>

                {/* Footer */}
                <div className="history-card-footer-modern">
                  <span>
                    Prompt comparison
                  </span>

                  <button
                    className="history-view-button"
                    type="button"
                    onClick={() =>
                      onOpenTest(test.id)
                    }
                  >
                    View Test
                    <span>→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default History;