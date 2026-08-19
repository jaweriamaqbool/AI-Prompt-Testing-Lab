function Navbar({
  currentView,
  onTest,
  onHistory,
}) {
  return (
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
          onClick={onTest}
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
          onClick={onHistory}
        >
          History
        </button>
      </div>
    </nav>
  );
}

export default Navbar;