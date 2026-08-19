import pytest
from fastapi.testclient import TestClient

from app.api.routes import JobIngestionPipeline
from app.ingestion.geo import validate_and_normalize_geo
from app.ingestion.jobicy_client import JobicyClient
from app.main import app


client = TestClient(app)


def test_geo_none_or_empty():
    assert validate_and_normalize_geo(None) is None
    assert validate_and_normalize_geo("") is None
    assert validate_and_normalize_geo("   ") is None


def test_geo_valid_slugs():
    assert validate_and_normalize_geo("usa") == "usa"
    assert validate_and_normalize_geo("europe") == "europe"
    assert validate_and_normalize_geo("apac") == "apac"
    assert validate_and_normalize_geo("latam") == "latam"
    assert validate_and_normalize_geo("canada") == "canada"
    assert validate_and_normalize_geo("uk") == "uk"
    assert validate_and_normalize_geo("anywhere") == "anywhere"


def test_geo_friendly_mappings():
    assert validate_and_normalize_geo("USA") == "usa"
    assert validate_and_normalize_geo("United States") == "usa"
    assert validate_and_normalize_geo("Europe") == "europe"
    assert validate_and_normalize_geo("EU") == "europe"
    assert validate_and_normalize_geo("APAC") == "apac"
    assert validate_and_normalize_geo("LatAm") == "latam"
    assert validate_and_normalize_geo("Canada") == "canada"
    assert validate_and_normalize_geo("UK") == "uk"
    assert validate_and_normalize_geo("Worldwide") == "anywhere"


def test_geo_invalid_remote_raises_value_error():
    with pytest.raises(ValueError) as exc_info:
        validate_and_normalize_geo("Remote")
    assert "Invalid geo filter 'Remote'" in str(exc_info.value)
    assert "Jobicy expects a valid location slug" in str(exc_info.value)


def test_ingest_api_invalid_geo_returns_400():
    response = client.post("/ingest?count=10&geo=Remote")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "Invalid geo filter 'Remote'" in data["detail"]
    assert "Jobicy expects a valid location slug" in data["detail"]


def test_ingest_api_valid_geo(monkeypatch):
    mock_client = JobicyClient("http://127.0.0.1:8001/success")
    original_pipeline = JobIngestionPipeline

    def create_test_pipeline():
        return original_pipeline(client=mock_client)

    monkeypatch.setattr(
        "app.api.routes.JobIngestionPipeline",
        create_test_pipeline
    )

    response = client.post("/ingest?count=1&geo=usa")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
