import httpx


class JobicyClient:
    BASE_URL = "https://jobicy.com/api/v2/remote-jobs"

    def fetch_jobs(self, count=10, tag=None, geo=None, industry=None):
        params = {
            "count": count
        }

        if tag:
            params["tag"] = tag

        if geo:
            params["geo"] = geo

        if industry:
            params["industry"] = industry

        response = httpx.get(
            self.BASE_URL,
            params=params,
            timeout=10.0
        )

        response.raise_for_status()

        return response.json()