from pydantic import ValidationError
from schemas.prompt import PromptTestRequest


# Test 1: Valid input
try:
    data = PromptTestRequest(
        task="Explain machine learning",
        prompts=[
            "Explain it to a beginner.",
            "Use an analogy."
        ]
    )

    print("Test 1 passed:")
    print(data)

except ValidationError as e:
    print("Test 1 failed:")
    print(e)


# Test 2: Empty task
try:
    data = PromptTestRequest(
        task="",
        prompts=[
            "Explain it simply.",
            "Use an analogy."
        ]
    )

    print("Test 2 passed unexpectedly")

except ValidationError:
    print("Test 2 passed: empty task rejected")


# Test 3: Only one prompt
try:
    data = PromptTestRequest(
        task="Explain machine learning",
        prompts=[
            "Explain it simply."
        ]
    )

    print("Test 3 passed unexpectedly")

except ValidationError:
    print("Test 3 passed: fewer than 2 prompts rejected")


# Test 4: Empty prompt
try:
    data = PromptTestRequest(
        task="Explain machine learning",
        prompts=[
            "Explain it simply.",
            "   "
        ]
    )

    print("Test 4 passed unexpectedly")

except ValidationError:
    print("Test 4 passed: empty prompt rejected")