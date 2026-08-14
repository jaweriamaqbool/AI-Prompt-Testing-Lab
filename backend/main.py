from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.services.groq_service import generate_response

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

