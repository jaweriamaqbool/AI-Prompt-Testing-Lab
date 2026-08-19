import { useState } from "react";
import { testPrompts, getTests, getTest } from "./services/api";

import History from "./components/History";
import TestDetail from "./components/TestDetail";
import ResultsView from "./components/ResultsView";
import TestView from "./components/TestView";
import Navbar from "./components/Navbar";

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
      <Navbar
        currentView={currentView}
        onTest={() => {
          setCurrentView("test");
          setSelectedTest(null);
        }}
        onHistory={() => {
          setCurrentView("history");
          setSelectedTest(null);
          loadHistory();
        }}
      />

      <main className="main-content">
        {/* TEST VIEW*/}
        {currentView === "test" && (
          <>
            <TestView
              task={task}
              prompts={prompts}
              loading={loading}
              error={error}
              onTaskChange={setTask}
              onPromptChange={updatePrompt}
              onAddPrompt={addPrompt}
              onRemovePrompt={removePrompt}
              onTest={handleTestPrompts}
            />

            {results && (
              <ResultsView
                results={results}
                expandedResults={expandedResults}
                onToggleResponse={toggleResponse}
                onNewTest={() => {
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
              />
            )}
          </>
        )}

        {/* HISTORY VIEW */}
        {currentView === "history" && (
          <History
            history={history}
            historyLoading={historyLoading}
            onOpenTest={openTest}
            onStartTest={() => {
              setCurrentView("test");
            }}
          />
        )}
        {/* SAVED TEST DETAIL VIEW */}
        {currentView === "test-detail" && selectedTest && (
          <TestDetail
            selectedTest={selectedTest}
            onBackToHistory={() => {
              setSelectedTest(null);
              setCurrentView("history");
            }}
            onNewTest={() => {
              setSelectedTest(null);
              setCurrentView("test");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;