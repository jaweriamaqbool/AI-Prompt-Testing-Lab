import { useState } from "react";
import { testPrompts, getTests, getTest } from "./services/api";

const evaluationLabels = {
  accuracy: "Accuracy",
  relevance: "Relevance",
  completeness: "Completeness",
  clarity: "Clarity",
  creativity: "Creativity",
  conciseness: "Conciseness",
  instruction_following: "Instruction Following",
};

function App() {
  const [task, setTask] = useState("");
  const [prompts, setPrompts] = useState(["", ""]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedResults, setExpandedResults] = useState({});
  const [currentView, setCurrentView] = useState("test");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setError("");

      const data = await getTests();

      setHistory(data);
    } catch (err) {
      console.error("History error:", err);

      setError(
        err.message || "Failed to load test history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const openTest = async (testId) => {
    try {
      setHistoryLoading(true);
      setError("");

      const data = await getTest(testId);

      setSelectedTest(data);
      setCurrentView("test-detail");
    } catch (err) {
      console.error("Test loading error:", err);

      setError(
        err.message || "Failed to load saved test."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const addPrompt = () => {
    setPrompts([...prompts, ""]);
  };

  const removePrompt = (index) => {
    if (prompts.length <= 2) return;

    setPrompts(
      prompts.filter((_, promptIndex) => promptIndex !== index)
    );
  };

  const updatePrompt = (index, value) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index] = value;
    setPrompts(updatedPrompts);
  };

  const handleTestPrompts = async () => {
    setError("");
    setResults(null);
    setExpandedResults({});

    const trimmedTask = task.trim();
    const trimmedPrompts = prompts.map((prompt) => prompt.trim());

    if (!trimmedTask) {
      setError("Please enter a task.");
      return;
    }

    if (trimmedPrompts.length < 2) {
      setError("Please add at least two prompts.");
      return;
    }

    if (trimmedPrompts.some((prompt) => !prompt)) {
      setError("Please fill in all prompt fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await testPrompts(
        trimmedTask,
        trimmedPrompts
      );

      console.log("Test results:", data);

      setResults(data);
    } catch (err) {
      console.error("Test error:", err);

      setError(
        err.message ||
        "Something went wrong while testing the prompts."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleResponse = (index) => {
    setExpandedResults((previous) => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>PromptLab</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${
              currentView === "test" ? "active" : ""
            }`}
            type="button"
            onClick={() => {
              setCurrentView("test");
              setSelectedTest(null);
            }}
          >
            Test Prompts
          </button>

          <button
            className={`nav-link ${
              currentView === "history" ||
              currentView === "test-detail"
                ? "active"
                : ""
            }`}
            type="button"
            onClick={() => {
              setCurrentView("history");
              setSelectedTest(null);
              loadHistory();
            }}
          >
            History
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* ==================================================
            TEST VIEW
        ================================================== */}
        {currentView === "test" && (
          <>
            {/* Hero */}
            <section className="hero">
              <div className="hero-badge">
                AI PROMPT TESTING LAB
              </div>

              <h1>
                Compare prompts.
                <br />
                <span>Find what works best.</span>
              </h1>

              <p>
                Test multiple prompts, evaluate their responses, and
                discover which prompt delivers the best results.
              </p>
            </section>

            {/* Testing Workspace */}
            <section className="workspace">
              {/* Task */}
              <div className="section-header">
                <div>
                  <span className="section-number">01</span>
                  <h2>Define your task</h2>
                </div>

                <span className="section-description">
                  What do you want the AI to accomplish?
                </span>
              </div>

              <textarea
                className="task-input"
                placeholder="Example: Explain machine learning to a beginner..."
                value={task}
                onChange={(event) => setTask(event.target.value)}
                rows="4"
              />

              {/* Prompts */}
              <div className="section-header prompts-header">
                <div>
                  <span className="section-number">02</span>
                  <h2>Add your prompts</h2>
                </div>

                <span className="section-description">
                  Compare multiple approaches to the same task.
                </span>
              </div>

              <div className="prompts-list">
                {prompts.map((prompt, index) => (
                  <div className="prompt-card" key={index}>
                    <div className="prompt-card-header">
                      <div className="prompt-label">
                        <span>Prompt {index + 1}</span>
                      </div>

                      {prompts.length > 2 && (
                        <button
                          className="remove-button"
                          onClick={() => removePrompt(index)}
                          type="button"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <textarea
                      className="prompt-input"
                      placeholder={
                        index === 0
                          ? "Example: Explain machine learning using a simple real-world analogy."
                          : "Enter another prompt to compare..."
                      }
                      value={prompt}
                      onChange={(event) =>
                        updatePrompt(index, event.target.value)
                      }
                      rows="4"
                    />
                  </div>
                ))}
              </div>

              {/* Add Prompt */}
              <button
                className="add-prompt-button"
                onClick={addPrompt}
                type="button"
              >
                <span>+</span>
                Add another prompt
              </button>

              {/* Test */}
              <div className="test-section">
                <div className="test-info">
                  <strong>Ready to compare?</strong>

                  <span>
                    Your prompts will be evaluated across 7 quality
                    criteria.
                  </span>
                </div>

                <button
                  className="test-button"
                  onClick={handleTestPrompts}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Testing..." : "Test Prompts"}

                  <span>
                    {loading ? "..." : "→"}
                  </span>
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </section>

            {/* Results */}
            {results && (
              <section className="results-section">
                {/* Results Header */}
                <div className="results-heading">
                  <div>
                    <span className="section-number">03</span>
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
                    <span className="section-number">04</span>
                    <h2>Prompt Comparison</h2>
                  </div>

                  <span>
                    Ranked from highest to lowest
                  </span>
                </div>

                <div className="results-list">
                  {results.results.map((result, index) => {
                    const isExpanded = expandedResults[index];
                    const isWinner = result.rank === 1;

                    return (
                      <article
                        className={`result-card ${
                          isWinner ? "winner" : ""
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
                              {Object.entries(
                                result.evaluation
                              ).map(([key, score]) => (
                                <div
                                  className="evaluation-item"
                                  key={key}
                                >
                                  <div className="evaluation-label">
                                    <span>
                                      {evaluationLabels[key] ||
                                        key}
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
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response */}
                        {result.response && (
                          <div className="response-section">
                            <button
                              className="response-toggle"
                              type="button"
                              onClick={() =>
                                toggleResponse(index)
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
                                {result.response}
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
                    onClick={() => {
                      setTask("");
                      setPrompts(["", ""]);
                      setResults(null);
                      setError("");
                      setExpandedResults({});

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    Test Different Prompts
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* ==================================================
            HISTORY VIEW
        ================================================== */}
        {currentView === "history" && (
          <section className="history-section">
            <div className="history-header">
              <div>
                <span className="section-number">05</span>
                <h1>Test History</h1>

                <p>
                  Revisit your previous prompt comparisons and
                  see which prompts performed best.
                </p>
              </div>
            </div>

            {/* Loading */}
            {historyLoading && (
              <div className="history-loading">
                Loading your previous tests...
              </div>
            )}

            {/* Empty History */}
            {!historyLoading && history.length === 0 && (
              <div className="empty-history">
                <div className="empty-history-icon">✦</div>

                <h2>No tests yet</h2>

                <p>
                  Your previous prompt comparisons will appear here.
                </p>

                <button
                  className="test-button"
                  type="button"
                  onClick={() => {
                    setCurrentView("test");
                  }}
                >
                  Start Your First Test →
                </button>
              </div>
            )}

            {/* History List */}
            {!historyLoading && history.length > 0 && (
              <div className="history-list">
                {history.map((test) => (
                  <div
                    className="history-card"
                    key={test.id}
                  >
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
                        onClick={() => openTest(test.id)}
                      >
                        View Test →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ==================================================
            SAVED TEST DETAIL VIEW
        ================================================== */}
        {currentView === "test-detail" && selectedTest && (
          <section className="history-detail-section">
            {/* Header */}
            <div className="history-detail-header">
              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setSelectedTest(null);
                  setCurrentView("history");
                }}
              >
                ← Back to History
              </button>

              <span className="section-number">
                TEST #{selectedTest.id}
              </span>

              <h1>Saved Test Results</h1>

              <p>
                Review the prompts, responses, evaluations, and
                ranking from this previous test.
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
                    className={`saved-result-card ${
                      result.rank === 1
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
                          {result.response}
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
                              {
                                result.evaluation
                                  .instruction_following
                              }
                              /10
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
                onClick={() => {
                  setSelectedTest(null);
                  setCurrentView("test");

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Test Different Prompts
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;