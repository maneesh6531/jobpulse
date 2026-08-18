from app.models.job import Job
from app.storage.database import get_connection, initialize_database
from app.storage.job_repository import JobRepository


def create_job(job_id=12345):

    return Job(
        source="jobicy",
        source_job_id=job_id,
        title="Data Engineer",
        company="Test Company",
        location="Remote",
        job_type=["Full-Time"],
        industry=["Data Engineering"],
        level="Midweight",
        description="Build data pipelines",
        excerpt="Data engineering role",
        job_url=f"https://example.com/jobs/{job_id}",
        published_at="2026-08-18T12:00:00+00:00"
    )


def clear_jobs():

    connection = get_connection()

    connection.execute("DELETE FROM jobs")

    connection.commit()
    connection.close()


def test_save_job():

    initialize_database()
    clear_jobs()

    repository = JobRepository()

    job = create_job()

    result = repository.save_job(job)

    assert result is True

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM jobs
        WHERE source = %s AND source_job_id = %s
        """,
        ("jobicy", 12345)
    ).fetchone()

    connection.close()

    assert row is not None
    assert row[3] == "Data Engineer"
    assert row[4] == "Test Company"


def test_duplicate_job_is_not_inserted():

    initialize_database()
    clear_jobs()

    repository = JobRepository()

    job = create_job()

    first_result = repository.save_job(job)
    second_result = repository.save_job(job)

    assert first_result is True
    assert second_result is False

    connection = get_connection()

    row = connection.execute(
        """
        SELECT COUNT(*) AS count
        FROM jobs
        WHERE source = %s AND source_job_id = %s
        """,
        ("jobicy", 12345)
    ).fetchone()

    connection.close()

    assert row[0] == 1