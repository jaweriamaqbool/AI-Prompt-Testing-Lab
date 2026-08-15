from pydantic import BaseModel, Field

class EvaluationResult(BaseModel):
    accuracy: float = Field(ge=0 , le= 10)
    relevance: float = Field(ge=0 , le= 10)
    completeness: float = Field(ge=0 , le= 10)
    clarity: float = Field(ge=0 , le= 10)
    creativity: float = Field(ge=0 , le= 10)
    conciseness: float = Field(ge=0 , le= 10)
    instruction_following: float = Field(ge=0 , le= 10)
