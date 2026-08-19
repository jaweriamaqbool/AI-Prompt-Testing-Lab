# AI Prompt Testing Lab

AI Prompt Testing Lab is a web application for comparing multiple prompts for the same task, evaluating the generated AI responses, ranking prompt performance, and identifying the best-performing prompt.

The application helps users understand how different prompt instructions affect AI output and provides structured evaluation instead of relying only on subjective comparison.

## Features

* Enter a task and multiple prompts for comparison.
* Run multiple prompts against an AI model.
* Generate an independent AI response for each prompt.
* Evaluate responses using seven criteria:

  * Accuracy
  * Relevance
  * Completeness
  * Clarity
  * Creativity
  * Conciseness
  * Instruction Following
* Calculate an overall score for each prompt.
* Rank prompts based on their overall scores.
* Identify the best-performing prompt.
* View detailed responses and evaluation results.
* Save completed tests to a local History database.
* Reopen and review previous tests from History.
* Validate user input before processing requests.

## Technology Stack

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* SQLite
* Groq API

### Frontend

* React
* Vite
* JavaScript
* CSS

### AI Model

The application uses the Groq API to generate and evaluate responses.

The API key is stored in an environment variable and is not included in the source code.

## Application Workflow

The application follows this workflow:

```text
Task
  ↓
Multiple Prompts
  ↓
Generate AI Responses
  ↓
Evaluate Responses
  ↓
Calculate Overall Scores
  ↓
Rank Prompts
  ↓
Recommend Best Prompt
  ↓
Save Test to History
```

## Project Structure

```text
AI-Prompt-Testing-Lab/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── init_db.py
│   ├── models.py
│   ├── schemas/
│   │   └── prompt.py
│   └── services/
│       ├── groq_service.py
│       └── evaluation_service.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── History.jsx
│   │   │   ├── HistoryCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResultsView.jsx
│   │   │   ├── TestDetail.jsx
│   │   │   └── TestView.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
│
├── .env
├── .gitignore
└── prompt_testing.db
```

> `prompt_testing.db` is created locally when the application initializes the database and is excluded from Git.

## Prerequisites

Before running the project, install:

* Python 3.10+ recommended
* Node.js and npm
* A Groq API key

## Backend Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd AI-Prompt-Testing-Lab
```

Replace `<repository-url>` with the repository URL.

### 2. Create a Python virtual environment

Windows:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

### 3. Install Python dependencies

If the project contains a `requirements.txt` file:

```powershell
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Replace the placeholder with your actual Groq API key.

**Do not commit `.env` to Git.**

### 5. Initialize the database

From the project root, run:

```powershell
python -m backend.init_db
```

You should see:

```text
Database tables created successfully.
```

The command creates the required SQLite database tables.

## Running the Backend

From the project root, with the virtual environment activated:

```powershell
uvicorn backend.main:app --reload
```

The FastAPI backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Running the Frontend

Open a second terminal and navigate to the frontend:

```powershell
cd frontend
```

Install the frontend dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Vite will display the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

Open the displayed URL in a browser.

## Using the Application

### 1. Create a Test

Enter a task that you want the AI to perform.

For example:

```text
Explain what an API is to a beginner.
```

Add at least two prompts for the same task.

Example:

```text
Explain what an API is.
```

and:

```text
Explain what an API is to a beginner using a simple real-world analogy and a short example.
```

### 2. Run the Test

The application sends each prompt to the AI model and generates an independent response.

### 3. Review Evaluation Results

Each response is evaluated using seven criteria:

| Criterion             | Purpose                                               |
| --------------------- | ----------------------------------------------------- |
| Accuracy              | Measures factual correctness                          |
| Relevance             | Measures how directly the response addresses the task |
| Completeness          | Measures whether important information is covered     |
| Clarity               | Measures how understandable the response is           |
| Creativity            | Measures originality and quality of presentation      |
| Conciseness           | Measures whether unnecessary information is avoided   |
| Instruction Following | Measures compliance with the prompt requirements      |

Each criterion receives a score, which is then used to calculate the prompt's overall score.

### 4. Compare Rankings

The application calculates the overall score for each prompt and ranks the prompts accordingly.

The highest-performing prompt can then be identified as the recommended prompt.

### 5. Review History

Completed tests are saved to the local SQLite database.

The History section allows users to:

* View previously completed tests.
* See the task associated with each test.
* Reopen a saved test.
* Review its prompts, responses, scores, and rankings.

## API Overview

The backend is built with FastAPI.

### Generate Response

```text
POST /generate
```

Generates an AI response for a prompt.

### Test Multiple Prompts

```text
POST /test-prompts
```

Accepts a task and multiple prompts, runs them through the AI model, evaluates the responses, calculates scores, and returns ranked results.

The FastAPI Swagger interface can be used to inspect and test the available API endpoints:

```text
http://127.0.0.1:8000/docs
```

## Input Validation

The backend validates prompt-testing requests before processing them.

Examples of validation include:

* The task cannot be empty.
* At least two prompts are required for comparison.
* Individual prompts cannot be empty.
* Invalid input is rejected with an appropriate validation response.

## Database

The application uses SQLite with SQLAlchemy.

The database file is:

```text
prompt_testing.db
```

Database initialization is handled by:

```text
backend/init_db.py
```

The database contains the application's stored testing and evaluation information.

The database file is intentionally excluded from Git because it contains local application data.

To create a fresh local database:

```powershell
python -m backend.init_db
```

## Environment Variables

The application requires the following environment variable:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Keep the actual API key private and never commit it to the repository.

## Troubleshooting

### `ModuleNotFoundError: No module named 'backend'`

Run backend modules from the project root.

Use:

```powershell
python -m backend.init_db
```

instead of:

```powershell
python backend/init_db.py
```

### Frontend dependencies are missing

From the `frontend` directory:

```powershell
npm install
```

Then:

```powershell
npm run dev
```

### Database does not exist

Initialize it from the project root:

```powershell
python -m backend.init_db
```

### Groq API errors

Check that:

1. `.env` exists in the project root.
2. `GROQ_API_KEY` is correctly configured.
3. The API key is valid.
4. The backend is being started from the project root.

## Security Notes

* API credentials are stored in environment variables.
* `.env` should not be committed to Git.
* The local SQLite database is excluded from Git.
* Production deployments should use appropriate secret-management and database infrastructure.

## Current Scope

This project is designed as an internship project demonstrating:

* Prompt engineering concepts
* LLM API integration
* Automated response evaluation
* Backend API development
* Frontend development
* Database persistence
* Prompt comparison and ranking
* Full-stack application workflow

## Future Improvements

Possible future improvements include:

* User authentication
* Multiple AI model/provider support
* Advanced evaluation metrics
* Prompt versioning
* Exporting test results
* Search and filtering in History
* Production database support
* Deployment to a cloud platform
* More advanced analytics and visualizations

## Demonstration

The application demonstration showcases the complete workflow:

```text
Create Task
    ↓
Add Multiple Prompts
    ↓
Generate Responses
    ↓
Evaluate Responses
    ↓
Compare Scores
    ↓
View Ranking
    ↓
Identify Best Prompt
    ↓
Save to History
    ↓
Reopen Previous Test
```

## License

This project was developed as an internship project.
