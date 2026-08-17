from backend.database import Base, engine
from backend.models import Test, PromptResult, Evaluation


Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")