function HistoryCard({ test, onOpenTest }) {
  return (
    <div className="history-card">
      <div className="history-card-content">
        <div className="history-task">
          <span>Task</span>

          <h2>{test.task}</h2>
        </div>

        <div className="history-meta">
          <div>
            <span>Best Score</span>

            <strong>
              {test.best_score ?? "—"}
              <small>/ 10</small>
            </strong>
          </div>

          <div>
            <span>Test ID</span>

            <strong>#{test.id}</strong>
          </div>
        </div>
      </div>

      <div className="history-card-footer">
        <span>
          {test.best_prompt
            ? `Best: ${test.best_prompt}`
            : "No best prompt available"}
        </span>

        <button
          className="view-test-button"
          type="button"
          onClick={() => onOpenTest(test.id)}
        >
          View Test →
        </button>
      </div>
    </div>
  );
}

export default HistoryCard;