import json
import sqlite3

from app.models.job import Job
from app.storage.database import get_connection


class JobRepository:

    def save_job(self, job: Job) -> bool:

        connection = get_connection()

        try:
            connection.execute(
                """
                INSERT INTO jobs (
                    source,
                    source_job_id,
                    title,
                    company,
                    location,
                    job_type,
                    industry,
                    level,
                    description,
                    excerpt,
                    job_url,
                    published_at,
                    salary_min,
                    salary_max,
                    salary_currency
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    job.source,
                    job.source_job_id,
                    job.title,
                    job.company,
                    job.location,
                    json.dumps(job.job_type),
                    json.dumps(job.industry),
                    job.level,
                    job.description,
                    job.excerpt,
                    str(job.job_url),
                    job.published_at.isoformat(),
                    job.salary_min,
                    job.salary_max,
                    job.salary_currency
                )
            )

            connection.commit()

            return True

        except sqlite3.IntegrityError:

            connection.rollback()

            return False

        finally:

            connection.close()