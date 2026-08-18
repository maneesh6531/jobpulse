from fastapi import FastAPI

app = FastAPI(
    title="JobPulse",
    description="Resilient Job Listing Ingestion System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "name": "JobPulse",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }