function TestView({
  task,
  prompts,
  loading,
  error,
  onTaskChange,
  onPromptChange,
  onAddPrompt,
  onRemovePrompt,
  onTest,
}) {
  return (
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
            <span className="section-number"></span>
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
          onChange={(event) =>
            onTaskChange(event.target.value)
          }
          rows="4"
        />

        {/* Prompts */}
        <div className="section-header prompts-header">
          <div>
            <span className="section-number"></span>
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
                    onClick={() =>
                      onRemovePrompt(index)
                    }
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
                  onPromptChange(
                    index,
                    event.target.value
                  )
                }
                rows="4"
              />
            </div>
          ))}
        </div>

        {/* Add Prompt */}
        <button
          className="add-prompt-button"
          onClick={onAddPrompt}
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
            onClick={onTest}
            disabled={loading}
            type="button"
          >
            {loading ? "Testing..." : "Test Prompts"}
            <span>→</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </section>
    </>
  );
}

export default TestView;