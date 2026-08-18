import psycopg
from psycopg.types.json import Json

from app.models.job import Job
from app.storage.database import get_connection


class JobRepository:

    def save_job(self, job: Job) -> bool:

        connection = get_connection()

        try:

            with connection.cursor() as cursor:

                cursor.execute(
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
                    VALUES (
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s
                    )
                    """,
                    (
                        job.source,
                        job.source_job_id,
                        job.title,
                        job.company,
                        job.location,
                        Json(job.job_type),
                        Json(job.industry),
                        job.level,
                        job.description,
                        job.excerpt,
                        str(job.job_url),
                        job.published_at,
                        job.salary_min,
                        job.salary_max,
                        job.salary_currency
                    )
                )

            connection.commit()

            return True

        except psycopg.errors.UniqueViolation:

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

                conditions.append(
                    "location = %s"
                )

                parameters.append(geo)

            if industry:

                conditions.append(
                    "industry @> %s::jsonb"
                )

                parameters.append(
                    Json([industry])
                )

            where_clause = ""

            if conditions:

                where_clause = (
                    "WHERE " +
                    " AND ".join(conditions)
                )

            count_query = f"""
                SELECT COUNT(*) AS total
                FROM jobs
                {where_clause}
            """

            with connection.cursor() as cursor:

                cursor.execute(
                    count_query,
                    parameters
                )

                total = cursor.fetchone()[0]

            offset = (page - 1) * page_size

            jobs_query = f"""
                SELECT
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
                FROM jobs
                {where_clause}
                ORDER BY published_at DESC
                LIMIT %s OFFSET %s
            """

            with connection.cursor() as cursor:

                cursor.execute(
                    jobs_query,
                    parameters + [
                        page_size,
                        offset
                    ]
                )

                rows = cursor.fetchall()

            jobs = []

            for row in rows:

                jobs.append(
                    Job(
                        source=row[0],
                        source_job_id=row[1],
                        title=row[2],
                        company=row[3],
                        location=row[4],
                        job_type=row[5],
                        industry=row[6],
                        level=row[7],
                        description=row[8],
                        excerpt=row[9],
                        job_url=row[10],
                        published_at=row[11],
                        salary_min=row[12],
                        salary_max=row[13],
                        salary_currency=row[14]
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