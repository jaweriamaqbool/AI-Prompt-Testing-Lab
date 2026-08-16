from pydantic import BaseModel, Field
from typing import Optional

from backend.schemas.evaluation import EvaluationResult


class PromptResult(BaseModel):
    rank: Optional[int] = None
    prompt: str
    response: Optional[str] = None
    evaluation: Optional[EvaluationResult] = None
    overall_score: Optional[float] = None
    error: Optional[str] = None

class PromptTestResponse(BaseModel):
    task: str
    results: list[PromptResult]
    best_prompt: str
    best_score: float