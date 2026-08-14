import os
from dotenv import load_dotenv
from groq import Groq
load_dotenv()
def generate_response(prompt):
    api_key=os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY was not found in the .env file.")
    client=Groq(api_key=api_key)
    response=client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
    )
    answer = response.choices[0].message.content
    return answer
