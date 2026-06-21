from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import io
from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from app.models.user import User
from app.models.emission_record import EmissionRecord
from app.models.emission_factor import EmissionFactor
from app.schemas.emission_schema import (
    EmissionFactorCreate,
    EmissionFactorResponse,
    EmissionRecordCreate,
    EmissionRecordResponse,
)
from app.services.emission_factor_service import (
    create_emission_factor,
    get_emission_factors,
)
from app.services.carbon_calculator import create_emission_record
from app.services.csv_importer import import_emissions_csv

router = APIRouter(prefix="/emissions", tags=["Emissions"])


# ----- Emission Factors -----
@router.post("/factors", response_model=EmissionFactorResponse, status_code=status.HTTP_201_CREATED)
def create_factor(
    factor_data: EmissionFactorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_emission_factor(db, factor_data)


@router.get("/factors", response_model=List[EmissionFactorResponse])
def get_factors(
    category: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_emission_factors(db, category=category, skip=skip, limit=limit)


@router.delete("/factors/{factor_id}")
def delete_factor(
    factor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Factor not found")
    db.delete(factor)
    db.commit()
    return {"message": "Factor deleted"}


# ----- Emission Records -----
@router.post("/records", response_model=EmissionRecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    record_data: EmissionRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_emission_record(db, record_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/records/upload")
def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be a CSV")
    try:
        content = file.file.read().decode('utf-8')
        result = import_emissions_csv(db, content)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/records/{record_id}")
def delete_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(EmissionRecord).filter(EmissionRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"message": "Record deleted"}