from app.ingestion.jobicy_client import JobicyClient


client = JobicyClient()

data = client.fetch_jobs(count=5)

print("Status:", data.get("statusCode"))
print("Success:", data.get("success"))
print("Number of jobs:", len(data.get("jobs", [])))

for job in data.get("jobs", []):
    print("\n-----------------------------")
    print("ID:", job.get("id"))
    print("Title:", job.get("jobTitle"))
    print("Company:", job.get("companyName"))
    print("Location:", job.get("jobGeo"))
    print("Type:", job.get("jobType"))
    print("Published:", job.get("pubDate"))