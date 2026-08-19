import os
import psycopg

from app.core.config import settings


def verify_safe_test_db(db_url: str):

    prod_url = settings.database_url

    if not db_url:
        raise RuntimeError("Test database URL is empty or None.")

    if db_url.strip() == prod_url.strip():

        raise RuntimeError(
            "CRITICAL SAFETY VIOLATION: Active database URL matches production DATABASE_URL! "
            "Tests are strictly forbidden from connecting to or modifying the production database."
        )

    if prod_url.rstrip("/").endswith("/postgres") and db_url.rstrip("/").endswith("/postgres"):

        raise RuntimeError(
            "CRITICAL SAFETY VIOLATION: Active test database URL points to production 'postgres' database! "
            "Tests must use a separate test database (e.g. 'jobpulse_test')."
        )


def get_database_url() -> str:

    is_test_env = (
        "PYTEST_CURRENT_TEST" in os.environ or
        os.environ.get("USE_TEST_DB") == "true"
    )

    if is_test_env:

        url = settings.test_database_url or os.environ.get("TEST_DATABASE_URL")

        if not url:

            raise RuntimeError(
                "TEST_DATABASE_URL is not set! Refusing to run tests against default DATABASE_URL to protect production data."
            )

        verify_safe_test_db(url)

        return url

    return settings.database_url


def get_connection(db_url: str | None = None):

    url = db_url or get_database_url()

    is_test_env = (
        "PYTEST_CURRENT_TEST" in os.environ or
        os.environ.get("USE_TEST_DB") == "true"
    )

    if is_test_env:

        verify_safe_test_db(url)

    return psycopg.connect(url)


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