from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class PromptResult(Base):
    __tablename__ = "prompt_results"

    id = Column(Integer, primary_key=True, index=True)

    test_id = Column(
        Integer,
        ForeignKey("tests.id"),
        nullable=False
    )

    prompt = Column(String, nullable=False)
    response = Column(String, nullable=True)
    overall_score = Column(Float, nullable=True)
    rank = Column(Integer, nullable=True)
    error = Column(String, nullable=True)

    test = relationship(
        "Test",
        back_populates="results"
    )

    evaluation = relationship(
        "Evaluation",
        back_populates="result",
        uselist=False
    )