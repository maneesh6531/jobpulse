from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    jobicy_api_url: str = "https://jobicy.com/api/v2/remote-jobs"

    request_timeout: float = 10.0

    max_retries: int = 3

    base_retry_delay: float = 1.0


settings = Settings()