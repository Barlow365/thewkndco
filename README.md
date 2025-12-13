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
# optional auth/dev flags
# $env:SUPABASE_JWT_SECRET="your-supabase-jwt-secret"
# $env:ALLOW_NO_AUTH=true
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
Open http://localhost:8000/docs

### Supabase admin role claim (for protected admin routes)
- Admin endpoints require the JWT claim `{"role":"admin"}`.
- In Supabase, add a custom claim via Settings → API → JWT Custom Claims:
  ```
  select public.add_admin_role(raw_app_meta_data)
  ```
  and create `public.admin_users(email text primary key)` with your admin emails, plus a helper:
  ```sql
  create or replace function public.add_admin_role(claims jsonb)
  returns jsonb language plpgsql as $$
  declare is_admin boolean;
  begin
    select exists (select 1 from public.admin_users where email = claims->>'email') into is_admin;
    if is_admin then
      return jsonb_set(coalesce(claims, '{}'::jsonb), '{role}', '"admin"'::jsonb, true);
    end if;
    return claims;
  end;
  $$;
  ```
- Production: set `ALLOW_NO_AUTH=false` and a real `SUPABASE_JWT_SECRET`.

## Run frontend (Next.js app)
```
cd frontend
# ensure .env.local exists (see .env.local.example); at minimum:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
npm install
npm run dev
```
Open http://localhost:3000

### Stripe / payments
- Set `STRIPE_SECRET_KEY` in backend env to return real PaymentIntents; otherwise stubbed intents are returned and frontend shows “payments are in stub mode.”

## Tests
- Cypress (from `frontend/`): `npm run cy:run -- --spec cypress/e2e/home.cy.js` (after backend+frontend are running).
- Backend (from `backend/`): `pytest` (auth guard tests).

## Assets & docs
- Postman: `wknd_postman_collection.json`
- Roadmap spec: `Wknd Co Website Development Roadmap.pdf`
- Operator manual: `docs/OPERATOR_MANUAL.md`
