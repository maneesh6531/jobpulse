from fastapi.testclient import TestClient

from app.main import app
from app.storage.database import get_connection, initialize_database


client = TestClient(app)


def clear_jobs():

    connection = get_connection()

    connection.execute("DELETE FROM jobs")

    connection.commit()
    connection.close()


def insert_test_jobs():

    initialize_database()
    clear_jobs()

    connection = get_connection()

    jobs = [
        (
            "jobicy",
            1001,
            "Data Engineer",
            "Company A",
            "Remote",
            '["Full-Time"]',
            '["Data Engineering"]',
            "Midweight",
            "Data engineering job",
            "Data job",
            "https://example.com/1001",
            "2026-08-18T12:00:00+00:00"
        ),
        (
            "jobicy",
            1002,
            "Python Developer",
            "Company B",
            "Remote",
            '["Full-Time"]',
            '["Software Development"]',
            "Junior",
            "Python development job",
            "Python job",
            "https://example.com/1002",
            "2026-08-17T12:00:00+00:00"
        ),
        (
            "jobicy",
            1003,
            "Data Analyst",
            "Company C",
            "India",
            '["Full-Time"]',
            '["Data Engineering"]',
            "Junior",
            "Data analyst job",
            "Analytics job",
            "https://example.com/1003",
            "2026-08-16T12:00:00+00:00"
        )
    ]

    for job in jobs:

        connection.execute(
            """
            INSERT INTO jobs (
                source,
                source_job_id,
                title,
                company,
                location,
                job_type,
                industry,
                level,
                description,
                excerpt,
                job_url,
                published_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            job
        )

    connection.commit()
    connection.close()


def test_get_jobs():

    insert_test_jobs()

    response = client.get(
        "/jobs",
        params={
            "page": 1,
            "page_size": 20
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "success"
    assert data["result"]["total"] == 3
    assert len(data["result"]["jobs"]) == 3


def test_pagination():

    insert_test_jobs()

    response = client.get(
        "/jobs",
        params={
            "page": 1,
            "page_size": 2
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["result"]["total"] == 3
    assert len(data["result"]["jobs"]) == 2
    assert data["result"]["page"] == 1
    assert data["result"]["page_size"] == 2


def test_industry_filter():

    insert_test_jobs()

    response = client.get(
        "/jobs",
        params={
            "industry": "Data Engineering"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["result"]["total"] == 2

    for job in data["result"]["jobs"]:
        assert "Data Engineering" in job["industry"]


def test_geo_filter():

    insert_test_jobs()

    response = client.get(
        "/jobs",
        params={
            "geo": "Remote"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["result"]["total"] == 2

    for job in data["result"]["jobs"]:
        assert job["location"] == "Remote"


def test_invalid_page():

    response = client.get(
        "/jobs",
        params={
            "page": 0
        }
    )

    assert response.status_code == 400


def test_invalid_page_size():

    response = client.get(
        "/jobs",
        params={
            "page_size": 101
        }
    )

    assert response.status_code == 400