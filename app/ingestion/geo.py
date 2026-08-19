SUPPORTED_GEO_SLUGS = {
    "usa",
    "europe",
    "apac",
    "latam",
    "canada",
    "uk",
    "anywhere",
}

FRIENDLY_GEO_MAPPING = {
    "usa": "usa",
    "us": "usa",
    "united states": "usa",
    "europe": "europe",
    "eu": "europe",
    "apac": "apac",
    "asia-pacific": "apac",
    "latam": "latam",
    "latin america": "latam",
    "canada": "canada",
    "uk": "uk",
    "united kingdom": "uk",
    "anywhere": "anywhere",
    "worldwide": "anywhere",
    "global": "anywhere",
}


def validate_and_normalize_geo(geo: str | None) -> str | None:
    """
    Validates and normalizes the target geo location parameter.

    Jobicy expects specific location slugs (e.g., usa, europe, apac, latam, canada, uk, anywhere).
    Note: 'Remote' is a UI concept, not a valid location slug, and is explicitly rejected.
    """
    if geo is None:
        return None

    stripped = str(geo).strip()
    if not stripped:
        return None

    lowered = stripped.lower()

    if lowered in FRIENDLY_GEO_MAPPING:
        return FRIENDLY_GEO_MAPPING[lowered]

    if lowered in SUPPORTED_GEO_SLUGS:
        return lowered

    supported_list = ", ".join(sorted(SUPPORTED_GEO_SLUGS))
    raise ValueError(
        f"Invalid geo filter '{geo}'. Jobicy expects a valid location slug "
        f"(supported values: {supported_list}). Note: 'Remote' is a UI concept, not a valid Jobicy location slug."
    )
