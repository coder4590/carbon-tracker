from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from app.models.user import User
from app.models.factory import Factory
from app.schemas.emission_schema import FactoryCreate, FactoryResponse, FactoryUpdate

router = APIRouter(prefix="/factories", tags=["Factories"])


@router.post("/", response_model=FactoryResponse, status_code=status.HTTP_201_CREATED)
def create_factory(
    factory_data: FactoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new factory."""
    db_factory = Factory(
        **factory_data.model_dump(),
        created_by=current_user.id
    )
    db.add(db_factory)
    db.commit()
    db.refresh(db_factory)
    return db_factory


@router.get("/", response_model=List[FactoryResponse])
def get_factories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all factories."""
    factories = db.query(Factory).offset(skip).limit(limit).all()
    return factories


@router.get("/{factory_id}", response_model=FactoryResponse)
def get_factory(
    factory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific factory."""
    factory = db.query(Factory).filter(Factory.id == factory_id).first()
    if not factory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factory not found"
        )
    return factory


@router.patch("/{factory_id}/limit", response_model=FactoryResponse)
def update_factory_limit(
    factory_id: int,
    limit_data: FactoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update factory emission limit."""
    factory = db.query(Factory).filter(Factory.id == factory_id).first()
    if not factory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Factory not found"
        )
    
    if limit_data.emission_limit is not None:
        factory.emission_limit = limit_data.emission_limit
    
    db.commit()
    db.refresh(factory)
    return factory


@router.delete("/{factory_id}")
def delete_factory(
    factory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a factory."""
    factory = db.query(Factory).filter(Factory.id == factory_id).first()
    if not factory:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Factory not found")
    db.delete(factory)
    db.commit()
    return {"message": "Factory deleted"}