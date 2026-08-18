from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from backend.services.groq_service import generate_response
from backend.schemas.prompt import PromptTestRequest
from backend.services.evaluation_service import evaluate_response
from backend.schemas.response import PromptTestResponse

from backend.database import SessionLocal
from backend.services.database_service import (
    save_test,
    save_result,
    save_evaluation
)
from backend.models.test import Test
from backend.models.prompt_result import PromptResult
from backend.models.evaluation import Evaluation

app = FastAPI(
    title="AI Prompt Testing Lab",
    description="An API for testing, evaluating, comparing, and ranking multiple AI prompts.",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str = Field(
        min_length=1,
        description="The prompt to send to the AI model."
    )


@app.post(
    "/generate",
    summary="Generate an AI response",
    description="Generates an AI response for a single prompt using the configured Groq model."
)
def generate(request: PromptRequest):
    prompt = request.prompt

    try:
        response = generate_response(prompt)

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response"
        )

    return {"response": response}


EVALUATION_CRITERIA = [
    "accuracy",
    "relevance",
    "completeness",
    "clarity",
    "creativity",
    "conciseness",
    "instruction_following"
]


@app.post(
    "/test-prompts",
    response_model=PromptTestResponse,
    summary="Test and rank multiple prompts",
    description=(
        "Generates responses for multiple prompts, evaluates each response "
        "using seven criteria, calculates an overall score, and ranks "
        "successful prompts from highest to lowest."
    )
)
def test_prompts(request: PromptTestRequest):

    db = SessionLocal()
    results = []

    try:

        # -----------------------------------------
        #  Generate and evaluate each prompt
        # -----------------------------------------

        for prompt in request.prompts:

            combined_prompt = f"""
            Task:
            {request.task}

            Instruction:
            {prompt}
            """

            # -----------------------------------------
            # Generate response
            # -----------------------------------------

            try:
                response = generate_response(combined_prompt)

            except Exception as e:
                print(f"Generation error: {e}")

                result = {
                    "prompt": prompt,
                    "response": None,
                    "evaluation": None,
                    "overall_score": None,
                    "error": "Generation failed"
                }

                results.append(result)
                continue

            # -----------------------------------------
            # Evaluate response
            # -----------------------------------------

            try:
                evaluation = evaluate_response(
                    request.task,
                    prompt,
                    response
                )

            except Exception as e:
                print(f"Evaluation error: {e}")

                result = {
                    "prompt": prompt,
                    "response": response,
                    "evaluation": None,
                    "overall_score": None,
                    "error": "Evaluation failed"
                }

                results.append(result)
                continue

            # -----------------------------------------
            # Calculate evaluation scores
            # -----------------------------------------

            evaluation_data = evaluation.model_dump()

            total_scores = sum(
                evaluation_data[key]
                for key in EVALUATION_CRITERIA
            )

            overall_score = round(
                total_scores / len(EVALUATION_CRITERIA),
                2
            )

            result = {
                "prompt": prompt,
                "response": response,
                "evaluation": evaluation_data,
                "overall_score": overall_score
            }

            results.append(result)

        # -----------------------------------------
        #  Get successful results
        # -----------------------------------------

        valid_results = [
            result
            for result in results
            if result["overall_score"] is not None
        ]

        if not valid_results:
            raise HTTPException(
                status_code=500,
                detail="Failed to evaluate all prompts"
            )

        # -----------------------------------------
        # Rank successful results
        # -----------------------------------------

        ranked_results = sorted(
            valid_results,
            key=lambda result: result["overall_score"],
            reverse=True
        )

        for rank, result in enumerate(ranked_results, start=1):
            result["rank"] = rank

        # -----------------------------------------
        #  Add failed results back
        # -----------------------------------------

        failed_results = [
            result
            for result in results
            if result["overall_score"] is None
        ]

        final_results = ranked_results + failed_results

        # -----------------------------------------
        # Determine best prompt
        # -----------------------------------------

        best_result = ranked_results[0]

        # -----------------------------------------
        # Save Test
        # -----------------------------------------

        test = save_test(
            db=db,
            task=request.task,
            best_prompt=best_result["prompt"],
            best_score=best_result["overall_score"]
        )

        # -----------------------------------------
        #  Save Prompt Results
        # -----------------------------------------

        for result in final_results:

            saved_result = save_result(
                db=db,
                test_id=test.id,
                prompt=result["prompt"],
                response=result["response"],
                overall_score=result["overall_score"],
                rank=result.get("rank"),
                error=result.get("error")
            )

            # -----------------------------------------
            #  Save Evaluation
            # -----------------------------------------

            if result["evaluation"] is not None:

                evaluation_data = result["evaluation"]

                save_evaluation(
                    db=db,
                    result_id=saved_result.id,
                    accuracy=evaluation_data["accuracy"],
                    relevance=evaluation_data["relevance"],
                    completeness=evaluation_data["completeness"],
                    clarity=evaluation_data["clarity"],
                    creativity=evaluation_data["creativity"],
                    conciseness=evaluation_data["conciseness"],
                    instruction_following=evaluation_data[
                        "instruction_following"
                    ]
                )
        db.commit()

        # -----------------------------------------
        #  Return API response
        # -----------------------------------------

        return {
            "task": request.task,
            "results": final_results,
            "best_prompt": best_result["prompt"],
            "best_score": best_result["overall_score"]
        }

    except HTTPException:
        raise

    except Exception as e:

        print(f"Database error: {e}")

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to save test results"
        )

    finally:
        db.close()

@app.get(
    "/tests",
    summary="Get all saved tests",
    description="Returns all previously saved prompt tests."
)
def get_tests():
    db = SessionLocal()

    try:
        tests = db.query(Test).order_by(Test.id.desc()).all()

        return [
            {
                "id": test.id,
                "task": test.task,
                "created_at": test.created_at,
                "best_prompt": test.best_prompt,
                "best_score": test.best_score
            }
            for test in tests
        ]

    finally:
        db.close()

@app.get(
    "/tests/{test_id}",
    summary="Get a saved test",
    description="Returns a saved test with all prompt results and evaluations."
)
def get_test(test_id: int):
    db = SessionLocal()

    try:
        test = db.query(Test).filter(Test.id == test_id).first()

        if test is None:
            raise HTTPException(
                status_code=404,
                detail="Test not found"
            )

        results = (
            db.query(PromptResult)
            .filter(PromptResult.test_id == test_id)
            .order_by(PromptResult.rank.asc())
            .all()
        )

        result_data = []

        for result in results:

            evaluation_data = None

            if result.evaluation is not None:
                evaluation_data = {
                    "accuracy": result.evaluation.accuracy,
                    "relevance": result.evaluation.relevance,
                    "completeness": result.evaluation.completeness,
                    "clarity": result.evaluation.clarity,
                    "creativity": result.evaluation.creativity,
                    "conciseness": result.evaluation.conciseness,
                    "instruction_following": (
                        result.evaluation.instruction_following
                    )
                }

            result_data.append({
                "id": result.id,
                "prompt": result.prompt,
                "response": result.response,
                "overall_score": result.overall_score,
                "rank": result.rank,
                "error": result.error,
                "evaluation": evaluation_data
            })

        return {
            "id": test.id,
            "task": test.task,
            "created_at": test.created_at,
            "best_prompt": test.best_prompt,
            "best_score": test.best_score,
            "results": result_data
        }

    finally:
        db.close()