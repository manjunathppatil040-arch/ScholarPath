from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload
from app.database.session import get_db
from app.models import Scholarship
from app.schemas.scholarship import ScholarshipRead

router = APIRouter(prefix="/api/v1")


@router.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/scholarships", response_model=list[ScholarshipRead], tags=["scholarships"])
def list_scholarships(
    q: str | None = Query(default=None, min_length=1, max_length=100),
    status: str | None = Query(default=None, pattern="^(Applications Open|Upcoming|Closed|Unknown)$"),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[Scholarship]:
    statement = select(Scholarship).options(selectinload(Scholarship.sources)).order_by(Scholarship.name)
    if q:
        term = f"%{q.strip()}%"
        statement = statement.where(or_(Scholarship.name.ilike(term), Scholarship.provider.ilike(term), Scholarship.summary.ilike(term)))
    if status:
        statement = statement.where(Scholarship.application_status == status)
    return list(db.scalars(statement.limit(limit)).all())
