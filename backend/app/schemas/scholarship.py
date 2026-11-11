from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, HttpUrl


class SourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    label: str
    url: HttpUrl
    source_type: str
    verified_at: datetime | None


class ScholarshipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    provider: str
    summary: str
    award_display: str
    deadline: date | None
    application_status: str
    application_url: HttpUrl | None
    application_url_verified: bool
    sources: list[SourceRead]
