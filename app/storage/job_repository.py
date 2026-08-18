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

    def get_jobs(
        self,
        page=1,
        page_size=20,
        geo=None,
        industry=None
    ):

        connection = get_connection()

        try:

            conditions = []
            parameters = []

            if geo:
                conditions.append("location = ?")
                parameters.append(geo)

            if industry:
                conditions.append("industry LIKE ?")
                parameters.append(f'%"{industry}"%')

            where_clause = ""

            if conditions:
                where_clause = "WHERE " + " AND ".join(conditions)

            count_query = f"""
                SELECT COUNT(*) AS total
                FROM jobs
                {where_clause}
            """

            total = connection.execute(
                count_query,
                parameters
            ).fetchone()["total"]

            offset = (page - 1) * page_size

            jobs_query = f"""
                SELECT *
                FROM jobs
                {where_clause}
                ORDER BY published_at DESC
                LIMIT ? OFFSET ?
            """

            rows = connection.execute(
                jobs_query,
                parameters + [page_size, offset]
            ).fetchall()

            jobs = []

            for row in rows:

                jobs.append(
                    Job(
                        source=row["source"],
                        source_job_id=row["source_job_id"],
                        title=row["title"],
                        company=row["company"],
                        location=row["location"],
                        job_type=json.loads(row["job_type"]),
                        industry=json.loads(row["industry"]),
                        level=row["level"],
                        description=row["description"],
                        excerpt=row["excerpt"],
                        job_url=row["job_url"],
                        published_at=row["published_at"],
                        salary_min=row["salary_min"],
                        salary_max=row["salary_max"],
                        salary_currency=row["salary_currency"]
                    )
                )

            return {
                "jobs": jobs,
                "total": total,
                "page": page,
                "page_size": page_size
            }

        finally:

            connection.close()