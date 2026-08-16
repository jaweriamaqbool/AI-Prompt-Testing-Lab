from pydantic import BaseModel, Field

class EvaluationResult(BaseModel):
    accuracy: float = Field(
        ge=0,
        le=10,
        description="How factually correct the response is."
    )

    relevance: float = Field(
        ge=0,
        le=10,
        description="How directly the response addresses the task."
    )

    completeness: float = Field(
        ge=0,
        le=10,
        description="How adequately the response covers the important parts of the task."
    )

    clarity: float = Field(
        ge=0,
        le=10,
        description="How clear and easy to understand the response is."
    )

    creativity: float = Field(
        ge=0,
        le=10,
        description="How original or engaging the response is."
    )

    conciseness: float = Field(
        ge=0,
        le=10,
        description="How effectively the response avoids unnecessary information and repetition."
    )

    instruction_following: float = Field(
        ge=0,
        le=10,
        description="How well the response follows the instructions in the prompt."
    )
