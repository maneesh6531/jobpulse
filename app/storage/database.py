import psycopg

from app.core.config import settings


def get_connection():

    return psycopg.connect(
        settings.database_url
    )


def initialize_database():

    connection = get_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS jobs (
                    id BIGSERIAL PRIMARY KEY,

                    source TEXT NOT NULL,
                    source_job_id BIGINT NOT NULL,

                    title TEXT NOT NULL,
                    company TEXT NOT NULL,

                    location TEXT,
                    job_type JSONB NOT NULL,
                    industry JSONB NOT NULL,
                    level TEXT,

                    description TEXT NOT NULL,
                    excerpt TEXT,

                    job_url TEXT NOT NULL,

                    published_at TIMESTAMPTZ NOT NULL,

                    salary_min DOUBLE PRECISION,
                    salary_max DOUBLE PRECISION,
                    salary_currency TEXT,

                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                    UNIQUE(source, source_job_id)
                )
                """
            )

        connection.commit()

    finally:

        connection.close()