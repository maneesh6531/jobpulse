from bs4 import BeautifulSoup

from app.models.job import Job


def clean_html(html):
    if not html:
        return ""

    soup = BeautifulSoup(html, "html.parser")

    return soup.get_text(" ", strip=True)


def clean_text(text):
    if not text:
        return ""

    soup = BeautifulSoup(text, "html.parser")

    return soup.get_text(" ", strip=True)


def normalize_job(raw_job):
    return Job(
        source="jobicy",
        source_job_id=raw_job["id"],
        title=clean_text(raw_job["jobTitle"]),
        company=clean_text(raw_job["companyName"]),
        location=clean_text(raw_job.get("jobGeo")),
        job_type=[
            clean_text(job_type)
            for job_type in raw_job.get("jobType", [])
        ],
        industry=[
            clean_text(industry)
            for industry in raw_job.get("jobIndustry", [])
        ],
        level=clean_text(raw_job.get("jobLevel")),
        description=clean_html(raw_job.get("jobDescription")),
        excerpt=clean_html(raw_job.get("jobExcerpt")),
        job_url=raw_job["url"],
        published_at=raw_job["pubDate"],
        salary_min=raw_job.get("salaryMin"),
        salary_max=raw_job.get("salaryMax"),
        salary_currency=raw_job.get("salaryCurrency")
    )