from sqlalchemy.orm import Session
from app.models.emission_record import EmissionRecord
from app.models.emission_factor import EmissionFactor
from app.models.factory import Factory
from app.schemas.emission_schema import EmissionRecordCreate
from typing import List
from datetime import datetime


def calculate_emissions(
    quantity: float, 
    emission_factor_id: int, 
    db: Session
) -> float:
    """Calculate total emissions: quantity × emission factor value."""
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == emission_factor_id).first()
    if not factor:
        raise ValueError("Emission factor not found")
    
    return quantity * factor.value


def create_emission_record(
    db: Session, 
    record_data: EmissionRecordCreate
) -> EmissionRecord:
    """Create an emission record with calculated total emissions."""
    # Calculate emissions
    total = calculate_emissions(
        quantity=record_data.quantity,
        emission_factor_id=record_data.emission_factor_id,
        db=db
    )
    
    # Create record
    db_record = EmissionRecord(
        **record_data.model_dump(),
        total_emissions=total
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_factory_emissions(
    db: Session, 
    factory_id: int,
    start_date: datetime,
    end_date: datetime
) -> List[EmissionRecord]:
    """Get emissions for a factory within a date range."""
    return db.query(EmissionRecord).filter(
        EmissionRecord.factory_id == factory_id,
        EmissionRecord.record_date >= start_date,
        EmissionRecord.record_date <= end_date
    ).all()


def get_total_emissions(
    db: Session,
    factory_id: int,
    start_date: datetime,
    end_date: datetime
) -> float:
    """Get total emissions for a factory in a period."""
    records = get_factory_emissions(db, factory_id, start_date, end_date)
    return sum(record.total_emissions for record in records)