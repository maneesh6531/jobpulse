import sqlite3
from pathlib import Path


DATABASE_PATH = Path("data/jobpulse.db")


def get_connection():
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(DATABASE_PATH)

    connection.row_factory = sqlite3.Row

    return connection

def initialize_database():

    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            source TEXT NOT NULL,
            source_job_id INTEGER NOT NULL,

            title TEXT NOT NULL,
            company TEXT NOT NULL,

            location TEXT,
            job_type TEXT NOT NULL,
            industry TEXT NOT NULL,
            level TEXT,

            description TEXT NOT NULL,
            excerpt TEXT,

            job_url TEXT NOT NULL,

            published_at TEXT NOT NULL,

            salary_min REAL,
            salary_max REAL,
            salary_currency TEXT,

            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(source, source_job_id)
        )
        """
    )

    connection.commit()
    connection.close()