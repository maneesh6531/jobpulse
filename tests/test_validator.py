import pytest
from pydantic import ValidationError

from app.ingestion.validator import validate_jobicy_response


def test_valid_response():

    data = {
        "statusCode": 200,
        "success": True,
        "jobs": [
            {
                "id": 123,
                "url": "https://example.com/job/123",
                "jobTitle": "Data Engineer",
                "companyName": "Example Company",
                "jobGeo": "Remote",
                "jobType": ["Full-Time"],
                "jobIndustry": ["Data Engineering"],
                "jobLevel": "Midweight",
                "jobDescription": "<p>Build data pipelines</p>",
                "pubDate": "2026-08-18T12:00:00+00:00"
            }
        ]
    }

    response = validate_jobicy_response(data)

    assert response.success is True
    assert len(response.jobs) == 1
    assert response.jobs[0].jobTitle == "Data Engineer"


def test_invalid_response():

    data = {
        "unexpected": "response"
    }

    with pytest.raises(ValidationError):
        validate_jobicy_response(data)