from app.storage.database import initialize_database, get_connection


def test_database_initialization():

    initialize_database()

    connection = get_connection()

    result = connection.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type='table' AND name='jobs'
        """
    ).fetchone()

    connection.close()

    assert result is not None
    assert result["name"] == "jobs"