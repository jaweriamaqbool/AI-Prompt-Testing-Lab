from pydantic import BaseModel, Field, field_validator

class PromptTestRequest(BaseModel):
    task: str = Field(min_length=1)
    prompts: list[str] = Field(min_length=2)

    @field_validator("task")
    @classmethod
    def validate_task(cls,value):
        if not value.strip():
            raise ValueError("Task cannot be empty")
        return value.strip()

    
    @field_validator("prompts")
    @classmethod
    def validate_prompts(cls, value):
        cleaned_prompts=[]        
        for prompt in value:
            prompt=prompt.strip()
            if not prompt:
                raise ValueError("Prompt cannot be empty")
            cleaned_prompts.append(prompt)
        return cleaned_prompts
        