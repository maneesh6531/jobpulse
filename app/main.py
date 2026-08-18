from fastapi import FastAPI

from app.api.routes import router


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


app.include_router(router)