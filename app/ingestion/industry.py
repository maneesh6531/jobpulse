"""
JobPulse Industry Category Validation & Normalization.

This module enforces an allowlist of supported Jobicy industry category slugs based on Jobicy API
documentation and verified response behavior.

Note: This is an intentionally supported subset for JobPulse and does not claim to represent
Jobicy's entire internal taxonomy.
"""

SUPPORTED_INDUSTRY_SLUGS = {
    "engineering",
    "marketing",
    "data-science",
    "business",
    "copywriting",
    "supporting",
    "management",
    "hr",
    "legal",
    "dev",
    "admin",
    "seller",
    "seo",
    "smm",
}

FRIENDLY_INDUSTRY_MAPPING = {
    "engineering": "engineering",
    "eng": "engineering",
    "marketing": "marketing",
    "mktg": "marketing",
    "data-science": "data-science",
    "data science": "data-science",
    "business": "business",
    "biz": "business",
    "copywriting": "copywriting",
    "supporting": "supporting",
    "support": "supporting",
    "management": "management",
    "hr": "hr",
    "human resources": "hr",
    "legal": "legal",
    "dev": "dev",
    "development": "dev",
    "admin": "admin",
    "administration": "admin",
    "seller": "seller",
    "seo": "seo",
    "smm": "smm",
}


def validate_and_normalize_industry(industry: str | None) -> str | None:
    """
    Validates and normalizes the target industry parameter.

    Jobicy expects a supported industry category slug (e.g. engineering, marketing, data-science).
    Note: 'devops' is not a valid Jobicy industry slug and is explicitly rejected.
    """
    if industry is None:
        return None

    stripped = str(industry).strip()
    if not stripped:
        return None

    lowered = stripped.lower()

    if lowered in FRIENDLY_INDUSTRY_MAPPING:
        return FRIENDLY_INDUSTRY_MAPPING[lowered]

    if lowered in SUPPORTED_INDUSTRY_SLUGS:
        return lowered

    supported_list = ", ".join(sorted(SUPPORTED_INDUSTRY_SLUGS))
    raise ValueError(
        f"Invalid industry filter '{industry}'. Jobicy expects a supported industry category slug "
        f"(supported values: {supported_list}). Note: 'devops' is not a valid Jobicy industry slug."
    )
