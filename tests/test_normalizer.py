from app.ingestion.jobicy_client import JobicyClient
from app.ingestion.normalizer import normalize_job


client = JobicyClient()

data = client.fetch_jobs(count=1)

raw_job = data["jobs"][0]

job = normalize_job(raw_job)

print("Source:", job.source)
print("Source ID:", job.source_job_id)
print("Title:", job.title)
print("Company:", job.company)
print("Location:", job.location)
print("Type:", job.job_type)
print("Industry:", job.industry)
print("Level:", job.level)
print("URL:", job.job_url)
print("Published:", job.published_at)
print("Description:", job.description[:300])