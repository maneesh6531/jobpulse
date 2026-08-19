from fastapi import APIRouter, HTTPException

from app.ingestion.pipeline import JobIngestionPipeline
from app.storage.job_repository import JobRepository


router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "healthy"
    }


@router.post("/ingest")
def ingest_jobs(
    count: int = 10,
    tag: str | None = None,
    geo: str | None = None,
    industry: str | None = None
):
    try:
        pipeline = JobIngestionPipeline()

        result = pipeline.run(
            count=count,
            tag=tag,
            geo=geo,
            industry=industry
        )

        return {
            "status": "success",
            "result": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@router.get("/jobs")
def get_jobs(
    page: int = 1,
    page_size: int = 20,
    geo: str | None = None,
    industry: str | None = None
):
    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="page must be greater than 0"
        )

    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=400,
            detail="page_size must be between 1 and 100"
        )

    try:

        repository = JobRepository()

        result = repository.get_jobs(
            page=page,
            page_size=page_size,
            geo=geo,
            industry=industry
        )

        return {
            "status": "success",
            "result": result
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )