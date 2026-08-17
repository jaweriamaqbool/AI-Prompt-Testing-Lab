from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)

    result_id = Column(
        Integer,
        ForeignKey("prompt_results.id"),
        nullable=False,
        unique=True
    )

    accuracy = Column(Float, nullable=False)
    relevance = Column(Float, nullable=False)
    completeness = Column(Float, nullable=False)
    clarity = Column(Float, nullable=False)
    creativity = Column(Float, nullable=False)
    conciseness = Column(Float, nullable=False)
    instruction_following = Column(Float, nullable=False)

    result = relationship(
        "PromptResult",
        back_populates="evaluation"
    )