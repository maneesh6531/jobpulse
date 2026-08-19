# JobPulse — Engineering Decisions

This document records the major architectural and implementation decisions made during the development of JobPulse, including the reasoning behind them and the trade-offs considered.

---

## 1. Supabase PostgreSQL for Persistent Storage

### Decision
JobPulse uses **Supabase PostgreSQL** as its primary persistent database, accessed via the `psycopg` (v3) Python driver, rather than relying on a local SQLite database or ephemeral file-based storage.

### Reasoning
- **Relational Data Structure**: Job listings have structured attributes (source ID, title, company, dates, salaries) that fit naturally into a relational schema.
- **Strict Data Integrity**: Database-level constraints enforce field nullability and unique key indexes.
- **Uniqueness Enforcement**: The table schema enforces a composite uniqueness constraint:
  ```sql
  UNIQUE(source, source_job_id)
  ```
  Even if application-level deduplication logic were to fail or be bypassed, the database guarantees that duplicate listings cannot be saved.
- **Querying & Filtering**: PostgreSQL supports JSONB containment queries for multi-value fields such as industry, while standard column queries handle location filtering.
- **Remote Persistence**: Hosting the database on Supabase ensures that stored data persists independently of local developer environments or application container restarts.

### Trade-offs
- Requires an active network connection and external database configuration (`DATABASE_URL`).
- Slightly higher network latency during database writes compared to local SQLite.

---

## 2. FastAPI for the Backend

### Decision
**FastAPI** was chosen as the web framework for the JobPulse REST API.

### Reasoning
- **Native Pydantic Integration**: FastAPI seamlessly integrates with Pydantic for request parsing, response serialization, and automatic parameter validation.
- **Declarative Route Handling**: Defining query parameters (`count`, `page`, `page_size`, `geo`, `industry`, `tag`) with type hints enables automatic type conversion and validation out of the box.
- **Simplified Testing**: FastAPI applications can be tested using Starlette's TestClient, allowing HTTP API tests without manually starting an external web server.

### Endpoints Implemented
- `GET /` — API root status
- `GET /health` — API health/status check
- `GET /jobs` — Paginated job discovery feed with location and industry filtering
- `POST /ingest` — Ingestion pipeline execution trigger

---

## 3. Jobicy as the Initial External Data Source

### Decision
Jobicy (`https://jobicy.com/api/v2/remote-jobs`) was selected as the launch job feed provider. All API communication is encapsulated inside a dedicated `JobicyClient` class.

### Reasoning
- **Client Encapsulation**: Isolating external HTTP calls within `JobicyClient` decouples third-party API specifics (parameter naming, JSON payload layout) from the core ingestion pipeline.
- **Extensibility**: Future job providers (e.g., Remotive, RemoteOK) can be added by implementing new client classes without modifying the `JobIngestionPipeline` or database repository logic.
- **Upstream Limit Handling**: Based on observed API behavior, Jobicy caps single HTTP responses at **100 jobs**. Separating the client layer allows JobPulse to track the user's **Requested Count** independently from the actual **Fetched Count** returned by the API.

---

## 4. HTTPX with Retry and Exponential Backoff

### Decision
`JobicyClient` uses `httpx` for synchronous HTTP requests, wrapped in an exponential backoff retry loop for transient failure recovery.

### Reasoning
- **Transient Failure Resilience**: External APIs experience temporary network blips, server overloads, and rate limiting. Retrying failed requests improves pipeline success rates.
- **Handled Error Scenarios**:
  - `httpx.TimeoutException` — Network timeout
  - `httpx.ConnectError` — Connection failure
  - `HTTP 429` — Rate limiting (Too Many Requests)
  - `HTTP 500, 502, 503, 504` — Upstream server errors
- **Exponential Backoff**: Immediately retrying a rate-limited or overloaded server often worsens the outage. Applying exponential backoff (`delay = base_retry_delay * 2^attempt`) allows upstream servers time to recover.

### Trade-offs
- Retries add execution delay during upstream API outages (up to 3 retries with 1.0s base delay).
- The client executes synchronously, which blocks the request thread during retries.

---

## 5. Pydantic Validation Before Database Insertion

### Decision
Raw JSON data fetched from the external API is validated against Pydantic schema models (`JobicyResponse`) *before* normalization or database persistence.

### Reasoning
- **Untrusted External Data**: Third-party APIs may return missing fields, unexpected types, or structural changes without notice.
- **Preventing Corrupt Writes**: Schema validation ensures that invalid or partial payloads trigger a controlled exception (`ValidationError`) and halt the pipeline before writing malformed data to PostgreSQL.

---

## 6. HTML Normalization with BeautifulSoup

### Decision
JobPulse uses **BeautifulSoup4** (`clean_html` / `clean_text`) to parse and strip HTML tags from raw job descriptions, excerpts, titles, companies, and locations.

### Reasoning
- **Consistent Display**: Raw job listings frequently contain inline HTML tags (`<p>`, `<div>`, `<span>`, `<a>`, `<br>`). Stripping markup produces clean plaintext for UI rendering and snippet truncation.
- **Clarification**: This step is implemented as **HTML Content Normalization** for UI text formatting, not as security-grade XSS sanitization.

---

## 7. Two-Stage Deduplication

### Decision
JobPulse combines in-memory batch deduplication with PostgreSQL unique constraints to achieve idempotent job ingestion.

```
[ Raw API Batch ] ──► [ Stage 1: In-Memory Key Hash ] ──► [ Stage 2: PostgreSQL UNIQUE Constraint ] ──► [ Safe Storage ]
```

### Stage 1 — In-Memory Deduplication
Inside `deduplicate_jobs()`, incoming items are hashed by a composite key:
```python
key = f"{job.source}:{job.source_job_id}"
```
If an API response contains duplicate listings within the same payload batch, the in-memory map collapses them into a single unique instance.

### Stage 2 — PostgreSQL Uniqueness
The database table enforces `UNIQUE(source, source_job_id)`. When `JobRepository.save_job()` attempts an `INSERT`, any listing already stored in the database triggers a `psycopg.errors.UniqueViolation`. The repository catches this exception, rolls back the sub-transaction, and returns `False`.

### Consequence
Repeatedly running ingestion with the same parameters is completely **idempotent**. Duplicate listings are safely skipped without throwing runtime errors or corrupting existing data.

---

## 8. JSONB for Industry and Job Type

### Decision
The `job_type` and `industry` fields are defined as `JSONB NOT NULL` columns in PostgreSQL, modeled as `list[str]` in Python, and inserted using `psycopg.types.json.Json`.

```sql
job_type JSONB NOT NULL,
industry JSONB NOT NULL
```

### Reasoning
- **Multi-Category Storage**: A single job posting can belong to multiple industries (e.g., `["Data Engineering", "DevOps"]`) or employment types (e.g., `["Full-Time", "Remote"]`).
- **PostgreSQL JSONB Filtering**: Allows PostgreSQL to query JSONB array containment directly:
  ```sql
  SELECT * FROM jobs WHERE industry @> '["Data Engineering"]'::jsonb;
  ```

### Trade-offs
- `JSONB` provides categorical flexibility without managing separate junction tables, but lacks foreign-key referential integrity compared to a fully normalized relational category schema.

---

## 9. Separate Test Database

### Decision
Tests operate strictly on an isolated test database defined by `TEST_DATABASE_URL`, completely separate from the primary application `DATABASE_URL`.

### Reasoning
- **Data Protection**: Automated tests frequently truncate or delete table records (`DELETE FROM jobs`). Running tests against the development/production database would destroy real data.
- **Test Activation**: Setting `USE_TEST_DB=true` or running under `pytest` causes `get_database_url()` to switch to `TEST_DATABASE_URL`.

### Trade-offs
- Requires configuring two database connection strings in `.env` (`DATABASE_URL` and `TEST_DATABASE_URL`).

---

## 10. Automatic Mock Server for Tests

### Decision
The `pytest` fixture suite in `tests/conftest.py` automatically spawns a background thread running a mock HTTP server (`MockServerThread`) on `127.0.0.1:8001`.

### Reasoning
- **Deterministic & Fast Testing**: Tests for network resilience, rate limiting (`429`), server errors (`500`), and valid ingestion execute against a local mock server rather than hitting live external APIs.
- **Zero Manual Setup**: Developers can run `pytest tests/` immediately without manually starting a secondary server process.

---

## 11. React + JavaScript/JSX for the Frontend

### Decision
The JobPulse frontend is built using **React** (v19), **JavaScript/JSX**, **Vite**, and **Tailwind CSS**.

### Reasoning
- **Component Architecture**: React enables a modular UI structure (`Navbar`, `Header`, `FilterBar`, `JobCard`, `JobDetailsDrawer`, `IngestModal`, `Pagination`).
- **JavaScript/JSX Choice**: Retaining standard JavaScript/JSX provided an approachable setup while avoiding additional build-step complexity for the current dashboard scope.

### Trade-offs
- JavaScript/JSX does not provide compile-time type safety compared to TypeScript.

---

## 12. Backend Filtering vs. Frontend Search

### Decision
Responsibility for filtering and search is divided between the backend and frontend:

- **Backend (`GET /jobs`)**: Handles dataset pagination (`page`, `page_size`) and structured JSONB/column filtering (`geo`, `industry`).
- **Frontend (`useJobs.js` / `FilterBar.jsx`)**: Handles instant client-side keyword search (matching title, company, or excerpt) across the fetched result set.

### Reasoning
- **Simple REST Design**: Keeps backend SQL queries straightforward and fast without requiring full-text search indexes (`tsvector`).
- **Responsive UX**: Client-side search provides instant feedback as the user types.

### Trade-offs
- Client-side search filters only the items fetched in the active page/dataset rather than performing a full database-wide text search across millions of records.

---

## 13. Centralized Frontend API Service

### Decision
All HTTP communication in the frontend is centralized within `frontend/src/services/api.js`.

### Reasoning
- **Single Source of Truth**: Base URL configuration (`VITE_API_BASE_URL`), headers, JSON parsing, and error handling are encapsulated in one module.
- **Proxy Fallback**: Includes automatic fallback routing (`/api-proxy`) if direct backend requests encounter CORS or network issues.

---

## 14. Ingestion Transparency: Requested vs. Fetched

### Decision
The ingestion modal explicitly displays five distinct metrics post-execution: `Requested`, `Fetched`, `Unique`, `New Jobs`, and `Duplicates`.

### Reasoning
- **Upstream API Limits**: Jobicy limits single HTTP responses to 100 jobs. If a user requests 120 jobs, the API returns 100.
- **Metrics Clarity**:
  - `Requested` ≠ `Fetched` (due to upstream API limits)
  - `Fetched` ≠ `New Jobs` (due to deduplication of existing database records)
- Displaying all metrics ensures complete operational transparency for the user.

---

## 15. Synchronous Ingestion as a Current Trade-Off

### Decision
The `POST /ingest` route executes the pipeline synchronously within the request lifecycle.

### Reasoning
- **Simplicity**: Synchronous execution keeps control flow, error reporting, and test verification straightforward.
- **Scale**: Suitable for small-to-medium batch sizes (e.g., 10–100 jobs).

### Trade-offs
- Large batch requests cause the HTTP request to wait until fetching, deduplicating, and database writes complete. For high-volume production pipelines, an asynchronous task queue (e.g., Celery / Redis) would be preferred.

---

## 16. Testing Strategy

### Decision
The backend uses `pytest` with 25 automated tests covering unit, integration, and failure scenarios:

- **API Route Tests**: Health checks, ingestion endpoints, CORS preflight headers.
- **Repository & Database Tests**: Connections, schema initialization, SQL queries.
- **Deduplication Tests**: In-memory key collision and unique constraint handling.
- **Pipeline Integration Tests**: End-to-end flow with mock server and database verification.
- **Resilience Tests**: Network timeouts, connection errors, HTTP 429 rate limits, and 5xx server errors.
- **Validation Tests**: Schema validation and error handling for malformed JSON payloads.

---

## 17. Database Safety Over Convenience

### Decision
The database connection module (`app/storage/database.py`) explicitly validates `verify_safe_test_db()` before executing test operations.

### Reasoning
- **Data Protection**: If `TEST_DATABASE_URL` is missing or matches `DATABASE_URL`, tests instantly throw a `RuntimeError` and abort.
- **Prioritizing Safety**: Requiring explicit test database configuration prevents developer mistake from wiping real database tables during automated test runs.

---

## 18. Architectural Trade-offs Summary

| Decision | Primary Benefit | Trade-off / Limitation |
| :--- | :--- | :--- |
| **Supabase PostgreSQL** | Remote persistence and strict constraints | Requires active database connection |
| **JSONB Categories** | Flexible multi-category lists without junction tables | Less relationally strict than normalized tables |
| **Client-Side Search** | Instant UI search without complex SQL indexes | Search is limited to loaded dataset |
| **Synchronous Ingestion** | Simple control flow and deterministic testing | HTTP thread waits during batch processing |
| **Two-Stage Deduplication** | Guaranteed idempotency at app and DB levels | Requires exception handling for unique collisions |
| **Separate Test Database** | Prevents test operations from modifying real data | Requires managing a secondary test connection string |
| **React + JavaScript/JSX** | Clean component architecture and fast setup | Lacks compile-time type checking of TypeScript |

---

## 19. Future Architectural Considerations

The following architectural enhancements are identified for potential future iteration:

- **Asynchronous Task Queue**: Transitioning ingestion runs to background workers (e.g., Celery / Redis / APScheduler) for periodic automated fetching.
- **Multi-Source Pipeline**: Expanding `JobIngestionPipeline` with additional client connectors (e.g., Remotive, RemoteOK).
- **Redis Query Caching**: Caching high-frequency `/jobs` queries to reduce database load.
- **Observability**: Adding OpenTelemetry tracing and Prometheus metrics for pipeline execution telemetry.
