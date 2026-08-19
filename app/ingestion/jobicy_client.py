import time

import httpx

from app.core.config import settings
from app.core.logger import logger
from app.ingestion.geo import validate_and_normalize_geo
from app.ingestion.industry import validate_and_normalize_industry


class JobicyClient:

    def __init__(self, base_url=None):
        self.base_url = base_url or settings.jobicy_api_url

    def fetch_jobs(self, count=10, tag=None, geo=None, industry=None):

        params = {
            "count": count
        }

        if tag:
            params["tag"] = tag

        normalized_geo = validate_and_normalize_geo(geo)
        if normalized_geo:
            params["geo"] = normalized_geo

        normalized_industry = validate_and_normalize_industry(industry)
        if normalized_industry:
            params["industry"] = normalized_industry

        for attempt in range(settings.max_retries + 1):

            try:
                response = httpx.get(
                    self.base_url,
                    params=params,
                    timeout=settings.request_timeout
                )

                if response.status_code == 429:

                    if attempt == settings.max_retries:
                        logger.error(
                            "Rate limit exhausted | attempts=%s",
                            attempt + 1
                        )
                        response.raise_for_status()

                    delay = settings.base_retry_delay * (2 ** attempt)

                    logger.warning(
                        "Rate limited | attempt=%s | delay=%s",
                        attempt + 1,
                        delay
                    )

                    time.sleep(delay)
                    continue

                if response.status_code in (500, 502, 503, 504):

                    if attempt == settings.max_retries:
                        logger.error(
                            "Server failure exhausted | status_code=%s | attempts=%s",
                            response.status_code,
                            attempt + 1
                        )
                        response.raise_for_status()

                    delay = settings.base_retry_delay * (2 ** attempt)

                    logger.warning(
                        "Server error | status_code=%s | attempt=%s | delay=%s",
                        response.status_code,
                        attempt + 1,
                        delay
                    )

                    time.sleep(delay)
                    continue

                response.raise_for_status()

                return response.json()

            except (
                httpx.TimeoutException,
                httpx.ConnectError
            ) as error:

                if attempt == settings.max_retries:
                    logger.error(
                        "Network failure exhausted | attempts=%s | error=%s",
                        attempt + 1,
                        error
                    )
                    raise error

                delay = settings.base_retry_delay * (2 ** attempt)

                logger.warning(
                    "Network error | error=%s | attempt=%s | delay=%s",
                    error,
                    attempt + 1,
                    delay
                )

                time.sleep(delay)