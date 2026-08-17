from backend.database import SessionLocal
from backend.services.database_service import (
    save_test,
    save_result,
    save_evaluation
)


db = SessionLocal()

try:
    # 1. Save a test
    test = save_test(
        db=db,
        task="Explain machine learning",
        best_prompt="Explain machine learning using a simple analogy",
        best_score=9.3
    )

    print("Test saved:", test.id)

    # 2. Save a prompt result
    result = save_result(
        db=db,
        test_id=test.id,
        prompt="Explain machine learning using a simple analogy",
        response="Machine learning is like teaching a computer...",
        overall_score=9.3,
        rank=1
    )

    print("Result saved:", result.id)
    failed_result = save_result(
        db=db,
        test_id=test.id,
        prompt="This prompt will fail",
        error="Model request failed"
    )

    print("Failed result saved:", failed_result.id)

    # 3. Save evaluation
    evaluation = save_evaluation(
        db=db,
        result_id=result.id,
        accuracy=9.5,
        relevance=9.0,
        completeness=9.2,
        clarity=9.4,
        creativity=8.8,
        conciseness=9.1,
        instruction_following=9.6
    )

    print("Evaluation saved:", evaluation.id)

finally:
    db.close()