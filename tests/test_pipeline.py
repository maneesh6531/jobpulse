from app.ingestion.jobicy_client import JobicyClient
from app.ingestion.pipeline import JobIngestionPipeline
from app.storage.database import get_connection, initialize_database


def clear_jobs():

    connection = get_connection()

    connection.execute("DELETE FROM jobs")

    connection.commit()
    connection.close()


def test_pipeline():

    initialize_database()
    clear_jobs()

    client = JobicyClient(
        "http://127.0.0.1:8001/success"
    )

    pipeline = JobIngestionPipeline(client)

    result = pipeline.run()

    assert result["fetched"] == 1
    assert result["unique"] == 1
    assert result["inserted"] == 1

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM jobs
        WHERE source = %s AND source_job_id = %s
        """,
        ("jobicy", 999999)
    ).fetchone()

    connection.close()

    assert row is not None
    assert row[3] == "Test Data Engineer"
    assert row[4] == "JobPulse Test"

def test_pipeline_is_idempotent():

    initialize_database()
    clear_jobs()

    client = JobicyClient(
        "http://127.0.0.1:8001/success"
    )

    pipeline = JobIngestionPipeline(client)

    first_result = pipeline.run()
    second_result = pipeline.run()

    assert first_result["fetched"] == 1
    assert first_result["unique"] == 1
    assert first_result["inserted"] == 1

    assert second_result["fetched"] == 1
    assert second_result["unique"] == 1
    assert second_result["inserted"] == 0