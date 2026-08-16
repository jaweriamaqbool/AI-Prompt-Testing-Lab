from fastapi import FastAPI, HTTPException
from pydantic import BaseModel,Field
from backend.services.groq_service import generate_response
from backend.schemas.prompt import PromptTestRequest
from backend.services.evaluation_service import evaluate_response
from backend.schemas.response import PromptTestResponse
app = FastAPI(
    title="AI Prompt Testing Lab",
    description="An API for testing, evaluating, comparing, and ranking multiple AI prompts.",
    version="1.0.0"
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
    prompt=request.prompt
    try:
        response = generate_response(prompt)
    except Exception:
        raise HTTPException(
            status_code= 500,
            detail = "Failed to generate AI response"
        )
    return {"response" : response}
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
    results=[]

    for prompt in request.prompts:
        combined_prompt = f"""
        Task:
        {request.task}

        Instruction:
        {prompt}
        """
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
    valid_results = [
        result for result in results
        if result["overall_score"] is not None
    ]

    if not valid_results:
        raise HTTPException(
            status_code=500,
            detail="Failed to evaluate all prompts"
        )
    ranked_results = sorted(
        valid_results,
        key=lambda result: result["overall_score"],
        reverse=True
    )

    for rank, result in enumerate(ranked_results, start=1):
        result["rank"] = rank
    failed_results = [
        result for result in results
        if result["overall_score"] is None
    ]

    final_results = ranked_results + failed_results

    best_result = ranked_results[0]
    return {
    "task": request.task,
    "results": final_results,
    "best_prompt": best_result["prompt"],
    "best_score": best_result["overall_score"]
    }
