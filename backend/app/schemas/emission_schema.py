from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ----- Emission Factor Schemas -----
class EmissionFactorBase(BaseModel):
    name: str
    category: str
    unit: str
    value: float
    source: Optional[str] = None


class EmissionFactorCreate(EmissionFactorBase):
    pass


class EmissionFactorResponse(EmissionFactorBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ----- Factory Schemas -----
class FactoryBase(BaseModel):
    name: str
    location: Optional[str] = None
    industry_type: Optional[str] = None
    annual_capacity: Optional[float] = None
    emission_limit: Optional[float] = 0


class FactoryCreate(FactoryBase):
    pass

class FactoryResponse(FactoryBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True

class FactoryUpdate(BaseModel):
    emission_limit: Optional[float] = None

# ----- Emission Record Schemas -----
class EmissionRecordBase(BaseModel):
    factory_id: int
    emission_factor_id: int
    quantity: float
    record_date: datetime
    notes: Optional[str] = None


class EmissionRecordCreate(EmissionRecordBase):
    pass


class EmissionRecordResponse(EmissionRecordBase):
    id: int
    total_emissions: float
    created_at: datetime

    class Config:
        from_attributes = True