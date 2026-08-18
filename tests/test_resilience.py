import pytest

from app.ingestion.jobicy_client import JobicyClient


def test_success():
    client = JobicyClient(
        "http://127.0.0.1:8001/success"
    )

    data = client.fetch_jobs()

    assert data["success"] is True
    assert len(data["jobs"]) == 1


def test_bad_request():
    client = JobicyClient(
        "http://127.0.0.1:8001/400"
    )

    with pytest.raises(Exception):
        client.fetch_jobs()


def test_empty_response():
    client = JobicyClient(
        "http://127.0.0.1:8001/empty"
    )

    data = client.fetch_jobs()

    assert data["success"] is True
    assert data["jobs"] == []


def test_invalid_response_structure():
    client = JobicyClient(
        "http://127.0.0.1:8001/invalid"
    )

    data = client.fetch_jobs()

    assert "jobs" not in data

def test_rate_limit():
    client = JobicyClient(
        "http://127.0.0.1:8001/429"
    )

    with pytest.raises(Exception):
        client.fetch_jobs()


def test_server_error():
    client = JobicyClient(
        "http://127.0.0.1:8001/500"
    )

    with pytest.raises(Exception):
        client.fetch_jobs()

def test_timeout():
    client = JobicyClient(
        "http://127.0.0.1:8001/timeout"
    )

    with pytest.raises(Exception):
        client.fetch_jobs()