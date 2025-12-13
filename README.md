# WKND Co / PartyWKND Stack

Unified FastAPI backend + Next.js frontend for WKND Co. Backend lives in `backend/`; frontend in `frontend/` (Supabase-ready Next.js app). Postman collection and roadmap PDF are in the repo root.

## Run backend (FastAPI + Postgres)
```
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
$env:DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/partywknd"
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
Open http://localhost:8000/docs

## Run frontend (Next.js app)
```
cd frontend
# ensure .env.local exists (see .env.local.example); at minimum:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm install
npm run dev
```
Open http://localhost:3000

## Tests
- Cypress (from `frontend/`): `npm run cy:run -- --spec cypress/e2e/home.cy.js` (after backend+frontend are running).

## Assets & docs
- Postman: `wknd_postman_collection.json`
- Roadmap spec: `Wknd Co Website Development Roadmap.pdf`
- Operator manual: `docs/OPERATOR_MANUAL.md`
