from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    database_url: str

    jobicy_api_url: str = "https://jobicy.com/api/v2/remote-jobs"

    request_timeout: float = 10.0

    max_retries: int = 3

    base_retry_delay: float = 1.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()