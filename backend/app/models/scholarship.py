from datetime import date, datetime, timezone
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Scholarship(Base):
    __tablename__ = "scholarships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(300), index=True)
    provider: Mapped[str] = mapped_column(String(240), index=True)
    summary: Mapped[str] = mapped_column(Text)
    award_display: Mapped[str] = mapped_column(String(240))
    deadline: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    application_status: Mapped[str] = mapped_column(String(32), default="Unknown", index=True)
    application_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    application_url_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    sources: Mapped[list["ScholarshipSource"]] = relationship(back_populates="scholarship", cascade="all, delete-orphan")


class ScholarshipSource(Base):
    __tablename__ = "scholarship_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scholarship_id: Mapped[int] = mapped_column(ForeignKey("scholarships.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(1000))
    label: Mapped[str] = mapped_column(String(240))
    source_type: Mapped[str] = mapped_column(String(32), default="official")
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    scholarship: Mapped[Scholarship] = relationship(back_populates="sources")
