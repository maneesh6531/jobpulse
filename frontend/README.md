# JobPulse — Frontend

A modern job discovery interface built for the JobPulse resilient job ingestion platform. It consumes the FastAPI backend and provides real-time job search, multi-faceted filtering, pagination, detailed job drawers, API health monitoring, and live pipeline ingestion controls.

---

## Tech Stack

- **React** (v19) — Component-based UI library
- **JavaScript / JSX** — ES module client application code
- **Vite** (v8) — Next-generation frontend tooling and bundler
- **Tailwind CSS** (v4) — Utility-first styling framework
- **Lucide React** — Modern UI icons
- **Fetch API** — Native asynchronous HTTP requests with custom resilience/proxy fallbacks
- **Custom CSS / Design System** — Tailored typography, gradients, grid utilities, and micro-animations

---

## Features

- **Job Listing Feed**: Dynamic feed displaying ingested remote and technology job listings.
- **Search Capabilities**: Live search filtering by job title, company name, or keyword content.
- **Industry & Geo Filtering**: Quick filter badges and dropdown controls for job category and geography.
- **Pagination Controls**: Smooth page navigation with configurable items per page.
- **Job Details Drawer**: Slide-over drawer presenting detailed job descriptions, tags, published dates, and direct application links.
- **Direct Application Links**: Quick navigation to original job postings on source platforms.
- **API Health Monitoring**: Real-time status badge monitoring backend connectivity and database health.
- **Job Ingestion Controls Modal**:
  - **Editable Ingestion Count**: Flexible numeric input allowing custom ingestion sizes (e.g., 5, 10, 20, 50, 100, 120, 200).
  - **Preset Buttons**: Quick-select preset badges for standard batch sizes (5, 10, 20, 50).
  - **Requested vs. Fetched Statistics**: Transparent metric breakdown showing requested vs. actual upstream fetched jobs.
  - **Deduplication Breakdown**: Complete post-execution reporting of unique jobs, new insertions, and duplicate counts.
  - **Jobicy Limit Handling**: Upstream 100-jobs-per-request handling with subtle informational feedback.
- **Loading & State UI**:
  - Skeleton loaders during data fetch operations.
  - Informative empty states when no listings match active filters.
  - Graceful API error states with retry actions.
- **Responsive Layout**: Mobile, tablet, and desktop optimized responsive layout.
- **URL Synchronization**: Deep-link filter synchronization for shareable state.

---

## Backend Integration

The frontend communicates asynchronously with the FastAPI backend service.

### Base URL (Local Development)
```
http://127.0.0.1:8000
```

### Consumed Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /` | `GET` | API root status and platform version |
| `GET /health` | `GET` | Health check endpoint returning backend and database connectivity status |
| `GET /jobs` | `GET` | Fetches paginated job listings with active filter parameters |
| `POST /ingest` | `POST` | Triggers the live Jobicy ingestion pipeline with filter criteria |

#### `GET /jobs` Parameters
- `page` *(number)* — Page number (default: 1)
- `page_size` *(number)* — Items per page (default: 20)
- `geo` *(string, optional)* — Filter by geographic location (e.g., "Remote", "USA")
- `industry` *(string, optional)* — Filter by industry sector (e.g., "devops", "engineering")

#### `POST /ingest` Parameters
- `count` *(number)* — Number of jobs requested for ingestion
- `tag` *(string, optional)* — Keyword or tech stack tag (e.g., "python", "react")
- `geo` *(string, optional)* — Target location restriction
- `industry` *(string, optional)* — Target industry classification
- `source_url` *(string, optional)* — Custom ingestion source endpoint URL (if configured)

---

## Project Structure

```
src/
├── components/
│   ├── EmptyState.jsx       # No-results empty state illustration and reset filter action
│   ├── ErrorState.jsx       # API error handling component with retry controls
│   ├── FilterBar.jsx        # Search input, filter selectors, and page size dropdown
│   ├── Header.jsx           # Hero banner section with live result counters
│   ├── IngestModal.jsx      # Modal for triggering pipeline ingestion & displaying metrics
│   ├── JobCard.jsx          # Individual job card with company logo, badges, and tags
│   ├── JobDetailsDrawer.jsx # Slide-over drawer presenting detailed job information
│   ├── Navbar.jsx           # Top header bar with branding, health indicator, and actions
│   ├── Pagination.jsx       # Numeric page navigation controls
│   ├── Sidebar.jsx          # Telemetry stats and quick industry/geo filter selectors
│   └── SkeletonLoader.jsx   # Animated loading cards for async operations
├── hooks/
│   ├── useHealth.js         # React hook for monitoring API health status
│   └── useJobs.js           # React hook for job fetching, filtering, and pagination state
├── services/
│   └── api.js               # Centralized Fetch API client with resilience fallbacks
├── App.css                  # Custom styling utilities and animation keyframes
├── App.jsx                  # Main dashboard layout wrapper and state management
├── index.css                # Global Tailwind CSS imports and design tokens
└── main.jsx                 # Application entry point rendering React DOM root
```

---

## Environment Variables

The frontend relies on an environment configuration variable for backend communication:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

To configure local environment settings:
1. Create a `.env` file inside the `frontend/` directory:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_API_BASE_URL` to match your local FastAPI server instance.

> **Note:** Never commit production `.env` files or secret values to version control.

---

## Local Development

Follow these steps to run the complete stack locally:

### 1. Start the FastAPI Backend
From the repository root directory:
```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Launch the Frontend Development Server
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
Open the Vite development URL output in your terminal (typically `http://localhost:5173`).

---

## Production Build

To build and preview the optimized production bundle:

```bash
# Generate production build output in dist/
npm run build

# Locally preview the built production bundle
npm run preview
```

Running `npm run build` compiles and minifies all JSX, JavaScript, and Tailwind CSS assets into the `dist/` directory.

---

## Testing & Quality Assurance

- **Backend Integration Tests**: The frontend is backed by a FastAPI server verified by an automated backend test suite containing **25 tests**, all of which pass successfully (`pytest tests/`).
- **Production Build Verification**: The frontend bundle build process has been validated using Vite (`npm run build`), compiling cleanly into lightweight production static assets.

---

## Design System & Aesthetics

JobPulse features a polished editorial job-portal interface built around modern web design principles:

- **Color Palette**: Clean white and soft slate backgrounds (`#FAFCFB`), rich deep navy typography (`#111A35`), vibrant teal/cyan primary accents, and warm amber highlights for duplicate counts.
- **Card Design**: Soft borders (`border-slate-200`), rounded corners (`rounded-2xl`), and subtle elevation shadows for high readability.
- **Typography**: Clean hierarchy with weighted headings, monospace font highlights for pipeline metrics, and high-contrast metadata badges.
- **Interactive Feedback**: Hover transitions, micro-animations, loading spinners, and state indicators for an engaging user experience.

---

## Ingestion Behavior & Pipeline Math

When triggering job ingestion from the UI, keep in mind how upstream API limits and pipeline deduplication work:

1. **Requested vs. Fetched**: The ingestion count entered by the user is the count sent to the upstream provider (Jobicy). Jobicy currently returns a **maximum of 100 jobs** per request. If a user requests 120 jobs, Jobicy will return 100.
2. **Fetched vs. New Jobs**: The backend pipeline normalizes and deduplicates incoming jobs against existing database records in Supabase/PostgreSQL.

### Ingestion Example
```
Requested:   120  (User-entered target count)
Fetched:     100  (Actual jobs returned by Jobicy)
Unique:      100  (Unique listings within the response)
New Jobs:     20  (Listings newly inserted into database)
Duplicates:   80  (Listings already existing in database)
```

The pipeline remains strictly truthful — duplicate records are skipped safely without throwing errors or duplicating entries in the system.
