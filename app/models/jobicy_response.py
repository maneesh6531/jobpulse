from pydantic import BaseModel, Field


class JobicyRawJob(BaseModel):
    id: int
    url: str
    jobTitle: str
    companyName: str

    jobGeo: str | None = None
    jobType: list[str] = Field(default_factory=list)
    jobIndustry: list[str] = Field(default_factory=list)
    jobLevel: str | None = None

    jobExcerpt: str | None = None
    jobDescription: str | None = None

    pubDate: str

    salaryMin: float | None = None
    salaryMax: float | None = None
    salaryCurrency: str | None = None


class JobicyResponse(BaseModel):
    statusCode: int
    success: bool
    jobs: list[JobicyRawJob] = Field(default_factory=list)