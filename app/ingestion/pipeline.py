from app.ingestion.deduplicator import deduplicate_jobs
from app.ingestion.jobicy_client import JobicyClient
from app.ingestion.normalizer import normalize_job
from app.ingestion.validator import validate_jobicy_response
from app.storage.database import initialize_database
from app.storage.job_repository import JobRepository


class JobIngestionPipeline:

    def __init__(self, client=None, repository=None):

        self.client = client or JobicyClient()

        self.repository = repository or JobRepository()

        initialize_database()

    def run(self, count=10, tag=None, geo=None, industry=None):

        raw_data = self.client.fetch_jobs(
            count=count,
            tag=tag,
            geo=geo,
            industry=industry
        )

        validated_data = validate_jobicy_response(raw_data)

        jobs = [
            normalize_job(job.model_dump())
            for job in validated_data.jobs
        ]

        unique_jobs = deduplicate_jobs(jobs)

        inserted_count = 0

        for job in unique_jobs:

            inserted = self.repository.save_job(job)

            if inserted:
                inserted_count += 1

        return {
            "fetched": len(validated_data.jobs),
            "unique": len(unique_jobs),
            "inserted": inserted_count
        }