const API_BASE_URL = "http://127.0.0.1:8000";

export async function testPrompts(task, prompts) {
  const response = await fetch(`${API_BASE_URL}/test-prompts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task,
      prompts,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to test prompts.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getTests() {
  const response = await fetch(`${API_BASE_URL}/tests`);

  if (!response.ok) {
    throw new Error("Failed to load test history.");
  }

  return response.json();
}

export async function getTest(testId) {
  const response = await fetch(`${API_BASE_URL}/tests/${testId}`);

  if (!response.ok) {
    throw new Error("Failed to load test.");
  }

  return response.json();
}