from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g., "electricity", "natural_gas", "diesel"
    unit = Column(String, nullable=False)  # e.g., "kgCO2/kWh", "kgCO2/liter"
    value = Column(Float, nullable=False)  # the actual emission factor
    source = Column(String)  # where this factor comes from (EPA, IPCC, etc.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())