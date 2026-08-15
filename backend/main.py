from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.services.groq_service import generate_response
from backend.schemas.prompt import PromptTestRequest
from backend.services.evaluation_service import evaluate_response

app = FastAPI()

class PromptRequest(BaseModel):
    prompt : str

@app.post("/generate")
def generate (request:PromptRequest):
    prompt=request.prompt
    try:
        response = generate_response(prompt)
    except Exception:
        raise HTTPException(
            status_code= 500,
            detail = "Failed to generate AI response"
        )
    return {"response" : response}

@app.post("/test-prompts")
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
            evaluation = evaluate_response(
                request.task,
                prompt,
                response
            )
            evaluation_data = evaluation.model_dump()
            total_scores = sum(evaluation_data[key] for key in evaluation_data)

            overall_score = round(total_scores / len(evaluation_data), 2)
            result = {
                "prompt": prompt,
                "response": response,
                "evaluation": evaluation_data,
                "overall_score": overall_score
            }
            
        except Exception as e:
            print(f"Error processing prompt: {e}")
            result = {
                "prompt": prompt,
                "response": None,
                "evaluation": None,
                "overall_score": None,
                "error": "Failed to generate or evaluate response"
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
    best_result = max(
        valid_results,
        key=lambda result: result["overall_score"]
    )
    return {
        "task": request.task,
        "results": results,
        "best_prompt": best_result["prompt"],
        "best_score" : best_result["overall_score"]
    }
