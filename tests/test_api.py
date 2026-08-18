from fastapi.testclient import TestClient

from app.api.routes import JobIngestionPipeline
from app.main import app
from app.ingestion.jobicy_client import JobicyClient


client = TestClient(app)


def test_health():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }


def test_ingest_with_mock_source(monkeypatch):

    mock_client = JobicyClient(
        "http://127.0.0.1:8001/success"
    )

    original_pipeline = JobIngestionPipeline

    def create_test_pipeline():

        return original_pipeline(
            client=mock_client
        )

    monkeypatch.setattr(
        "app.api.routes.JobIngestionPipeline",
        create_test_pipeline
    )

    response = client.post(
        "/ingest",
        params={
            "count": 1
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "success"
    assert data["result"]["fetched"] == 1
    assert data["result"]["unique"] == 1