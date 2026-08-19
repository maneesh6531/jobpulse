import pytest
from fastapi.testclient import TestClient

from app.api.routes import JobIngestionPipeline
from app.ingestion.industry import validate_and_normalize_industry
from app.ingestion.jobicy_client import JobicyClient
from app.main import app


client = TestClient(app)


def test_industry_none_or_empty():
    assert validate_and_normalize_industry(None) is None
    assert validate_and_normalize_industry("") is None
    assert validate_and_normalize_industry("   ") is None


def test_industry_valid_slugs():
    assert validate_and_normalize_industry("engineering") == "engineering"
    assert validate_and_normalize_industry("marketing") == "marketing"
    assert validate_and_normalize_industry("data-science") == "data-science"
    assert validate_and_normalize_industry("business") == "business"
    assert validate_and_normalize_industry("management") == "management"
    assert validate_and_normalize_industry("hr") == "hr"


def test_industry_friendly_mappings():
    assert validate_and_normalize_industry("Engineering") == "engineering"
    assert validate_and_normalize_industry("Marketing") == "marketing"
    assert validate_and_normalize_industry("Data Science") == "data-science"
    assert validate_and_normalize_industry("Human Resources") == "hr"


def test_industry_invalid_devops_raises_value_error():
    with pytest.raises(ValueError) as exc_info:
        validate_and_normalize_industry("devops")
    assert "Invalid industry filter 'devops'" in str(exc_info.value)
    assert "Jobicy expects a supported industry category slug" in str(exc_info.value)


def test_ingest_api_geo_usa_valid_industry(monkeypatch):
    mock_client = JobicyClient("http://127.0.0.1:8001/success")
    original_pipeline = JobIngestionPipeline

    def create_test_pipeline():
        return original_pipeline(client=mock_client)

    monkeypatch.setattr(
        "app.api.routes.JobIngestionPipeline",
        create_test_pipeline
    )

    response = client.post("/ingest?count=1&geo=usa&industry=engineering")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"


def test_ingest_api_geo_usa_invalid_industry_devops_returns_400():
    response = client.post("/ingest?count=10&geo=usa&industry=devops")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "Invalid industry filter 'devops'" in data["detail"]
