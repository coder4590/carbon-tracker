from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class EmissionSummary(BaseModel):
    factory_id: int
    factory_name: str
    total_emissions: float
    record_count: int
    period_start: datetime
    period_end: datetime


class ReportRequest(BaseModel):
    factory_id: Optional[int] = None
    start_date: datetime
    end_date: datetime


class ReportResponse(BaseModel):
    report_date: datetime
    summaries: List[EmissionSummary]
    overall_total_emissions: float