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

1. Accuracy
   How factually correct and reliable is the response?
   Penalize incorrect, misleading, or unsupported claims.

2. Relevance
   How directly does the response address the given task and prompt?
   Penalize information that is unrelated or unnecessarily off-topic.

3. Completeness
   Does the response adequately cover the important parts of the task?
   Penalize missing important information.

4. Clarity
   Is the response easy to understand, well-organized, and clearly written?
   Penalize confusing explanations, poor structure, or ambiguous wording.

5. Creativity
   Does the response demonstrate originality or use an effective, engaging approach?
   Penalize generic responses when a more creative approach would improve the answer.

6. Conciseness
   Does the response provide enough information without unnecessary repetition or excessive detail?
   Penalize unnecessary verbosity and repetition.

7. Instruction Following
   Did the response follow the specific instructions given in the prompt?
   Penalize ignored requirements, incorrect format, or failure to follow requested constraints.

Use this general scoring scale for every criterion:

0–2: Very Poor
The response seriously fails the criterion.

3–4: Poor
The response shows significant weaknesses.

5–6: Average
The response partially satisfies the criterion but has noticeable weaknesses.

7–8: Good
The response satisfies the criterion well with only minor weaknesses.

9–10: Excellent
The response satisfies the criterion exceptionally well with little or no meaningful weakness.
Give every criterion a score from 0 to 10.
Score each criterion independently using the 0–10 scale.

Do not give the same score to every criterion unless the response genuinely deserves it.

Base each score on the actual quality of the response rather than on the prompt alone.

Do not assume that a long response is automatically complete or that a short response is automatically concise.
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
Important:
Evaluate only the response that was generated for the given task and prompt.
Do not reward or penalize the response based on how good the prompt itself is.
The score should reflect the quality of the generated response against the task and instructions.
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
