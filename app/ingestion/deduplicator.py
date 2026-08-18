from app.models.job import Job


def get_job_key(job: Job) -> str:
    return f"{job.source}:{job.source_job_id}"


def deduplicate_jobs(jobs: list[Job]) -> list[Job]:

    unique_jobs = {}
    
    for job in jobs:
        key = get_job_key(job)

        if key not in unique_jobs:
            unique_jobs[key] = job

    return list(unique_jobs.values())