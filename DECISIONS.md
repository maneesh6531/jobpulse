# JobPulse — Engineering Decisions

## 1. Ingestion Strategy

I chose to integrate the **Jobicy public REST API** (`https://jobicy.com/api/v2/remote-jobs`) through a resilient ingestion pipeline rather than attempting to scrape high-risk platforms such as LinkedIn, Indeed, or Naukri. The assessment guidelines recommended a low-risk public API, RSS feed, or sandbox source. Direct scraping of major job boards can introduce operational risks such as rate limiting, anti-bot challenges, dynamic page changes, and potential terms-of-service concerns. My goal was to demonstrate a robust end-to-end ingestion system rather than spend the assignment time bypassing anti-scraping mechanisms.

All external HTTP communication is isolated inside a dedicated `JobicyClient`. The client uses `httpx` with retry logic and exponential backoff for transient failures including timeouts, connection errors, HTTP 429 rate limits, and HTTP 5xx server errors. Incoming payloads are validated with Pydantic before persistence, while BeautifulSoup is used to normalize HTML content into clean text for the application.

Data is persisted in **Supabase PostgreSQL**. Idempotency is enforced through two-stage deduplication: an in-memory key removes duplicates within an incoming batch, while `UNIQUE(source, source_job_id)` provides database-level uniqueness. Jobicy was observed to cap a single response at 100 jobs, so the frontend explicitly distinguishes *Requested*, *Fetched*, *Unique*, *New Jobs*, and *Duplicates* rather than implying that a requested count was always returned.

## 2. Time-Limited Trade-off

The main trade-off I made under the time limit was keeping job ingestion **synchronous** through `POST /ingest`. The request waits while the backend fetches, validates, deduplicates, and persists the records.

I chose this because it kept the control flow simple, deterministic, and straightforward to test, while remaining sufficient for the current batch sizes. Introducing a task queue during the assignment would have added worker orchestration and status-management complexity without materially improving the core ingestion demonstration.

With a full development week, I would move ingestion to background workers with scheduling, add additional source connectors, and introduce stronger observability for pipeline execution and failures.

## 3. AI Usage and Personal Verification

I used AI tools as an implementation accelerator for debugging, test infrastructure, documentation refinement, and deployment troubleshooting, including CORS configuration, environment variables, and Render deployment issues.

AI did not independently design or verify the completed system. I personally inspected the implementation and verified its behavior through the 25-test `pytest` suite, isolated test-database configuration, mock HTTP server testing, database inspection, duplicate-ingestion checks, and production deployment testing.

I manually verified the end-to-end application by triggering ingestion from the React frontend, checking CORS and API responses, validating the *Requested* vs. *Fetched* metrics, inspecting Render deployment logs, and testing filtering, pagination, and job-detail interactions. AI-generated suggestions were accepted only after checking them against the actual code and runtime behavior.

## Final Architecture

**Jobicy API** → **Pydantic Validation** → **HTML Normalization** → **Two-Stage Deduplication** → **Supabase PostgreSQL** → **FastAPI REST API** → **React (Vite + Tailwind) Frontend**