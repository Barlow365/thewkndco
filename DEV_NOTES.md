Working notes for PartyWKND stack

Inventory (from tmp/ after unzip):
- full_server: FastAPI app with routers admin.py, edge.py; main.py wiring; minimal requirements/Dockerfile; deploy.yml stub.
- mock_server: FastAPI routers for packages/messages/bookings with stub responses; Dockerfile/requirements minimal.
- sqlalchemy_models: SQLAlchemy Base + Event/Lodging/Booking/Package models, Alembic env (SQLite URL), empty 0001 migration placeholder.
- nextjs: Minimal Next.js app with pages/index.js (Welcome to PartyWKND dYZ%) and pages/api/hello.js; tiny package.json.
- frontend_admin: fastapi-admin setup script and seed script using SQLite; static public/index.html/main.js.
- cypress: Cypress config + e2e tests (home.cy.js expects home title; agent.cy.js expects /agent/dashboard to show "No messages yet").

Backups: All provided ZIPs, Postman collection, and roadmap PDF stored in input_backups/.

Immediate next actions:
- Build backend scaffold in backend/ merging full_server + mock_server routers + sqlalchemy models; align schemas to roadmap/Postman; swap SQLite placeholder to Postgres env-driven.
- Flesh out Alembic migration for core schema; add Pydantic schemas and CRUD layers.
- Move Next.js app into frontend/ and integrate admin seed UI; prepare API client config via env.
- Place Cypress tests under frontend/ and adjust baseUrl/selectors once pages exist.
- Add docker-compose, Dockerfiles, nginx/deploy scripts; set up CI and git init later.

Notes: ROADMAP_NOTES.md still to be populated after reviewing the PDF. Keep CHANGELOG.md in sync with structural steps.

Progress log:
- 2025-12-12: Created repo skeleton; copied roadmap PDF and Postman collection to root.
- 2025-12-12: Merged backend assets into backend/ (full_server base, mock_server routers, sqlalchemy_models, Alembic config).
- 2025-12-12: Expanded backend models (users, agents, admin_users, events, lodgings, packages, bookings, messages, package_events), added Pydantic schemas, DB session/config, Alembic migration, and real router logic for packages/messages/bookings/admin.
- 2025-12-12: Ported Next.js app into frontend/, added hero + planner form with backend hooks, created agent dashboard page stub, integrated Cypress tests/config, and mounted admin seed static assets under public/admin/.
- 2025-12-12: Added backend seed_data.py helper and enabled CORS for frontend requests.
- 2025-12-13: Added Operator Manual (`docs/OPERATOR_MANUAL.md`) with planning/error/proof/posting workflows.
