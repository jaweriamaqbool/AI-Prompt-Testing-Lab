from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from backend.database import Base


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    best_prompt = Column(String, nullable=True)
    best_score = Column(Float, nullable=True)

    results = relationship(
        "PromptResult",
        back_populates="test"
    )