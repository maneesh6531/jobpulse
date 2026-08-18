from app.ingestion.deduplicator import (
    deduplicate_jobs,
    get_job_key
)

from app.models.job import Job


def create_job(job_id, title):

    return Job(
        source="jobicy",
        source_job_id=job_id,
        title=title,
        company="Test Company",
        location="Remote",
        job_type=["Full-Time"],
        industry=["Data Engineering"],
        level="Midweight",
        description="Test description",
        job_url=f"https://example.com/jobs/{job_id}",
        published_at="2026-08-18T12:00:00+00:00"
    )


def test_job_key():

    job = create_job(123, "Data Engineer")

    assert get_job_key(job) == "jobicy:123"


def test_deduplicate_jobs():

    jobs = [
        create_job(123, "Data Engineer"),
        create_job(456, "Data Analyst"),
        create_job(123, "Data Engineer"),
        create_job(789, "ML Engineer"),
        create_job(456, "Data Analyst")
    ]

    unique_jobs = deduplicate_jobs(jobs)

    assert len(unique_jobs) == 3

    assert get_job_key(unique_jobs[0]) == "jobicy:123"
    assert get_job_key(unique_jobs[1]) == "jobicy:456"
    assert get_job_key(unique_jobs[2]) == "jobicy:789"