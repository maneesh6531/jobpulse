import os
import socket
import threading
import time
import pytest
import uvicorn

from app.storage.database import get_database_url, verify_safe_test_db, initialize_database
from tests.mock_source import app as mock_app


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    os.environ["USE_TEST_DB"] = "true"
    db_url = get_database_url()
    verify_safe_test_db(db_url)
    print(f"\n[pytest] Active Test Database URL: {db_url}")
    initialize_database()


class MockServerThread(threading.Thread):
    def __init__(self, app, host="127.0.0.1", port=8001):
        super().__init__()
        self.host = host
        self.port = port
        self.server = uvicorn.Server(
            config=uvicorn.Config(
                app=app,
                host=host,
                port=port,
                log_level="error"
            )
        )
        self.daemon = True

    def run(self):
        self.server.run()

    def stop(self):
        self.server.should_exit = True


def is_port_open(host="127.0.0.1", port=8001):
    try:
        with socket.create_connection((host, port), timeout=0.1):
            return True
    except (OSError, ConnectionRefusedError):
        return False


def wait_for_port(host="127.0.0.1", port=8001, timeout=5.0):
    start_time = time.time()
    while time.time() - start_time < timeout:
        if is_port_open(host, port):
            return True
        time.sleep(0.05)
    return False


@pytest.fixture(scope="session", autouse=True)
def start_mock_server():
    if is_port_open("127.0.0.1", 8001):
        yield
        return

    server_thread = MockServerThread(mock_app, host="127.0.0.1", port=8001)
    server_thread.start()

    if not wait_for_port("127.0.0.1", 8001, timeout=5.0):
        raise RuntimeError("Mock HTTP server failed to start on 127.0.0.1:8001")

    yield

    server_thread.stop()
