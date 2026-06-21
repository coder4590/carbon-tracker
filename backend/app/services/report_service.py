from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.emission_record import EmissionRecord
from app.models.factory import Factory
from app.schemas.report_schema import EmissionSummary, ReportRequest
from datetime import datetime
from typing import List


def generate_factory_report(
    db: Session,
    request: ReportRequest
) -> List[EmissionSummary]:
    """Generate emission report for one or all factories."""
    
    query = db.query(
        EmissionRecord.factory_id,
        Factory.name.label("factory_name"),
        func.sum(EmissionRecord.total_emissions).label("total_emissions"),
        func.count(EmissionRecord.id).label("record_count"),
        func.min(EmissionRecord.record_date).label("period_start"),
        func.max(EmissionRecord.record_date).label("period_end")
    ).join(
        Factory, EmissionRecord.factory_id == Factory.id
    ).filter(
        EmissionRecord.record_date >= request.start_date,
        EmissionRecord.record_date <= request.end_date
    )
    
    # Filter by specific factory if provided
    if request.factory_id:
        query = query.filter(EmissionRecord.factory_id == request.factory_id)
    
    # Group by factory
    query = query.group_by(EmissionRecord.factory_id, Factory.name)
    
    results = query.all()
    
    summaries = []
    for row in results:
        summary = EmissionSummary(
            factory_id=row.factory_id,
            factory_name=row.factory_name,
            total_emissions=row.total_emissions,
            record_count=row.record_count,
            period_start=row.period_start,
            period_end=row.period_end
        )
        summaries.append(summary)
    
    return summaries


def get_factory_list(db: Session):
    """Get list of all factories with their total emissions and limits."""
    factories = db.query(
        Factory,
        func.coalesce(func.sum(EmissionRecord.total_emissions), 0).label("total_emissions")
    ).outerjoin(
        EmissionRecord, Factory.id == EmissionRecord.factory_id
    ).group_by(Factory.id).all()
    
    return [
        {
            "id": factory.id,
            "name": factory.name,
            "location": factory.location,
            "industry_type": factory.industry_type,
            "emission_limit": float(factory.emission_limit or 0),
            "total_emissions": float(total),
            "emission_limit": float(factory.emission_limit or 0),
            "status": "exceeded" if factory.emission_limit and total > factory.emission_limit else "safe"
        }
        for factory, total in factories
    ]

def get_monthly_trends(db: Session, factory_id: int = None):
    """Get monthly emission totals for trend analysis."""
    from sqlalchemy import extract
    
    query = db.query(
        extract('year', EmissionRecord.record_date).label('year'),
        extract('month', EmissionRecord.record_date).label('month'),
        func.sum(EmissionRecord.total_emissions).label('total')
    )
    
    if factory_id:
        query = query.filter(EmissionRecord.factory_id == factory_id)
    
    query = query.group_by('year', 'month').order_by('year', 'month')
    
    results = query.all()
    
    return [
        {
            "year": int(r.year),
            "month": int(r.month),
            "month_name": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][int(r.month) - 1],
            "total_emissions": float(r.total)
        }
        for r in results
    ]