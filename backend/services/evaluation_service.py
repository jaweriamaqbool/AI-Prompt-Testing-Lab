import os
import json
from dotenv import load_dotenv
from groq import Groq
from backend.schemas.evaluation import EvaluationResult
load_dotenv()

def evaluate_response(task, prompt, response):
    api_key=os.getenv("GROQ_API_KEY")
    
    if not api_key:
        raise ValueError("GROQ_API_KEY was not found in the .env file.")
    client=Groq(api_key=api_key)
    evaluation_prompt = f"""
You are an evaluator.

Evaluate the following AI response based on these criteria:

- Accuracy
- Relevance
- Completeness
- Clarity
- Creativity
- Conciseness
- Instruction Following

Give every criterion a score from 0 to 10.

Task:
{task}

Prompt:
{prompt}

Response:
{response}

Return ONLY a JSON object using EXACTLY these keys:

{{
    "accuracy": 0,
    "relevance": 0,
    "completeness": 0,
    "clarity": 0,
    "creativity": 0,
    "conciseness": 0,
    "instruction_following": 0
}}

Rules:
- Use the exact lowercase key names shown above.
- Do not capitalize the keys.
- Do not use spaces in key names.
- Use underscores where shown.
- Every value must be a number from 0 to 10.
- Do not include any additional keys.
- Return ONLY the JSON object.
"""
    evaluation_result=client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
        {
            "role": "user",
            "content": evaluation_prompt
        }
    ],
    response_format={"type": "json_object"}
    )

    evaluation_response = evaluation_result.choices[0].message.content

    evaluation_data = json.loads(evaluation_response)
    evaluation=  EvaluationResult(**evaluation_data)

    return evaluation
