from fastapi import FastAPI
from fastapi.responses import JSONResponse
import time


app = FastAPI()


@app.get("/success")
def success():
    return {
        "statusCode": 200,
        "success": True,
        "jobCount": 1,
        "jobs": [
            {
                "id": 999999,
                "url": "https://example.com/job/999999",
                "jobTitle": "Test Data Engineer",
                "companyName": "JobPulse Test",
                "jobIndustry": ["Data Engineering"],
                "jobType": ["Full-Time"],
                "jobGeo": "Remote",
                "jobLevel": "Midweight",
                "jobExcerpt": "Test job",
                "jobDescription": "<p>Test job description</p>",
                "pubDate": "2026-08-18T12:00:00+00:00"
            }
        ]
    }


@app.get("/429")
def rate_limited():
    return JSONResponse(
        status_code=429,
        content={"error": "rate limited"}
    )


@app.get("/500")
def server_error():
    return JSONResponse(
        status_code=500,
        content={"error": "server error"}
    )


@app.get("/400")
def bad_request():
    return JSONResponse(
        status_code=400,
        content={"error": "bad request"}
    )


@app.get("/empty")
def empty():
    return {
        "statusCode": 200,
        "success": True,
        "jobCount": 0,
        "jobs": []
    }


@app.get("/invalid")
def invalid():
    return JSONResponse(
        status_code=200,
        content={"unexpected": "response"}
    )


@app.get("/timeout")
def timeout():
    time.sleep(15)

    return {
        "statusCode": 200,
        "success": True,
        "jobs": []
    }