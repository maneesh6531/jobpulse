from pydantic import ValidationError

from app.core.logger import logger
from app.models.jobicy_response import JobicyResponse


def validate_jobicy_response(data):

    try:
        response = JobicyResponse.model_validate(data)

        logger.info(
            "Jobicy response validated | jobs=%s",
            len(response.jobs)
        )

        return response

    except ValidationError as error:

        logger.error(
            "Jobicy response validation failed | errors=%s",
            error.errors()
        )

        raise