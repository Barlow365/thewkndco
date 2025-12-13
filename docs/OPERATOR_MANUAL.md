# Operator Manual

## Planning workflow (draft → confirm → execute)
- Draft: Write the intent, goal, files to touch, risks, and acceptance checks (e.g., in DEV_NOTES or PR description).
- Confirm: Share/validate the plan; ensure verification commands are listed.
- Execute: Apply changes, run the listed commands/tests, and log outputs (command + result). Keep logs in session history or `docs/logs/` if persisted.

## Error language for offline connectors / missing env vars
- “Service unavailable: <name>. Check network/VPN and env var <VAR>. Falling back to stub/no-op.”
- “Missing required env var <VAR>; set it in .env/.env.local before retrying.”

## Where proof lives
- Session command history (this log), `DEV_NOTES.md`, or `docs/logs/<date>.md` if created.
- CI artifacts and Cypress screenshots/videos (if enabled).

## Posting workflow (draft → confirm → execute; stub/log-only if disabled)
- Draft: Prepare payload + target channel/endpoint; note expected response.
- Confirm: Dry-run/log payload; ensure secrets are configured.
- Execute: Send the request or log-only if posting is disabled; capture the response and store in logs. If stubbed, mark “stubbed/log-only, no external post.”
