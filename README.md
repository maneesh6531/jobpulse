# JobPulse

A resilient job listing ingestion system designed to demonstrate reliable data ingestion from a public job API.

## Current Status

Phase 1 — Project setup

## Architecture

Public Job Source
→ Ingestion Client
→ Rate Limiting
→ Retry & Backoff
→ Validation
→ Deduplication
→ PostgreSQL
→ FastAPI
→ Monitoring Interface

## Tech Stack

- Python
- FastAPI
- HTTPX
- Pydantic
- SQLAlchemy
- PostgreSQL
- HTML/CSS/JavaScript
- pytest