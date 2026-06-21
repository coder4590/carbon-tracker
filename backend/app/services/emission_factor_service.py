from sqlalchemy.orm import Session
from app.models.emission_factor import EmissionFactor
from app.schemas.emission_schema import EmissionFactorCreate
from typing import List, Optional


def create_emission_factor(db: Session, factor_data: EmissionFactorCreate) -> EmissionFactor:
    """Create a new emission factor."""
    db_factor = EmissionFactor(**factor_data.model_dump())
    db.add(db_factor)
    db.commit()
    db.refresh(db_factor)
    return db_factor


def get_emission_factors(
    db: Session, 
    category: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100
) -> List[EmissionFactor]:
    """Get all emission factors with optional category filter."""
    query = db.query(EmissionFactor)
    if category:
        query = query.filter(EmissionFactor.category == category)
    return query.offset(skip).limit(limit).all()


def get_emission_factor_by_id(db: Session, factor_id: int) -> EmissionFactor:
    """Get a specific emission factor by ID."""
    return db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()


def update_emission_factor(
    db: Session, 
    factor_id: int, 
    factor_data: EmissionFactorCreate
) -> EmissionFactor:
    """Update an emission factor."""
    db_factor = get_emission_factor_by_id(db, factor_id)
    if not db_factor:
        raise ValueError("Emission factor not found")
    
    for key, value in factor_data.model_dump().items():
        setattr(db_factor, key, value)
    
    db.commit()
    db.refresh(db_factor)
    return db_factor


def delete_emission_factor(db: Session, factor_id: int) -> None:
    """Delete an emission factor."""
    db_factor = get_emission_factor_by_id(db, factor_id)
    if not db_factor:
        raise ValueError("Emission factor not found")
    
    db.delete(db_factor)
    db.commit()