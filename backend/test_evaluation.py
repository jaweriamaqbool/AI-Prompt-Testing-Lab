from services.evaluation_service import evaluate_response


task = "Explain machine learning to a beginner."

prompt = "Explain machine learning using a simple real-world analogy."

response = """
Machine learning is like teaching a child to recognize animals.
You show the child many examples of cats and dogs. Over time,
the child learns patterns that help them identify new animals.
Similarly, a machine learning model learns patterns from data
and uses those patterns to make predictions on new data.
"""


evaluation = evaluate_response(task, prompt, response)

print("\n===== EVALUATION RESULT =====")
print(f"Accuracy:              {evaluation.accuracy}")
print(f"Relevance:             {evaluation.relevance}")
print(f"Completeness:          {evaluation.completeness}")
print(f"Clarity:               {evaluation.clarity}")
print(f"Creativity:            {evaluation.creativity}")
print(f"Conciseness:           {evaluation.conciseness}")
print(f"Instruction Following: {evaluation.instruction_following}")
print(f"Overall Quality:       {evaluation.overall_quality}")