from backend.database import SessionLocal
from backend.models.test import Test
from backend.models.prompt_result import PromptResult
from backend.models.evaluation import Evaluation

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def save_test(
    db,
    task,
    best_prompt=None,
    best_score=None
):
    test = Test(
        task=task,
        best_prompt=best_prompt,
        best_score=best_score
    )

    db.add(test)
    db.flush()
    return test

def save_result(
    db,
    test_id,
    prompt,
    response=None,
    overall_score=None,
    rank=None,
    error=None
):
    result = PromptResult(
        test_id=test_id,
        prompt=prompt,
        response=response,
        overall_score=overall_score,
        rank=rank,
        error=error
    )

    db.add(result)
    db.flush()

    return result
def save_evaluation(
    db,
    result_id,
    accuracy,
    relevance,
    completeness,
    clarity,
    creativity,
    conciseness,
    instruction_following
):
    evaluation = Evaluation(
        result_id=result_id,
        accuracy=accuracy,
        relevance=relevance,
        completeness=completeness,
        clarity=clarity,
        creativity=creativity,
        conciseness=conciseness,
        instruction_following=instruction_following
    )

    db.add(evaluation)
    db.flush()

    return evaluation