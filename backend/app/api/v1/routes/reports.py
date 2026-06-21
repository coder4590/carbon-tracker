from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from app.models.user import User
from app.schemas.report_schema import ReportRequest, ReportResponse
from app.services.report_service import generate_factory_report, get_factory_list
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/emissions", response_model=ReportResponse)
def get_emissions_report(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    summaries = generate_factory_report(db, request)
    overall_total = sum(s.total_emissions for s in summaries)
    return ReportResponse(
        report_date=datetime.now(),
        summaries=summaries,
        overall_total_emissions=overall_total
    )


@router.get("/factories-summary")
def get_factories_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_factory_list(db)


@router.get("/trends")
def get_emission_trends(
    factory_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.services.report_service import get_monthly_trends
    return get_monthly_trends(db, factory_id)