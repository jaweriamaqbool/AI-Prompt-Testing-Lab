from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.services.groq_service import generate_response
from backend.schemas.prompt import PromptTestRequest

app = FastAPI()

class PromptRequest(BaseModel):
    prompt : str

@app.post("/generate")
def generate (request:PromptRequest):
    prompt=request.prompt
    try:
        response=generate_response(prompt)
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
            result={
                "prompt" : prompt,
                "response" : response
            }
            
        except Exception as e:
            print(f"Error processing prompt: {e}")
            result = {
                "prompt": prompt,
                "response": None,
                "error": "Failed to generate response"
            }
        results.append(result)
    return {
        "task": request.task,
        "results": results
    }
