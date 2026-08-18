from app.storage.database import (
    initialize_database,
    get_connection
)


def test_database_initialization():

    initialize_database()

    connection = get_connection()

    result = connection.execute(
        """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'jobs'
        """
    ).fetchone()

    connection.close()

    assert result is not None
    assert result[0] == "jobs"