from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl


class Job(BaseModel):
    source: str
    source_job_id: int

    title: str
    company: str

    location: str | None = None
    job_type: list[str] = Field(default_factory=list)
    industry: list[str] = Field(default_factory=list)
    level: str | None = None

    description: str
    excerpt: str | None = None

    job_url: HttpUrl

    published_at: datetime

    salary_min: float | None = None
    salary_max: float | None = None
    salary_currency: str | None = None