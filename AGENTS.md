# Repository Guidelines

## Project Structure & Module Organization
- `bhsis/` main CRM app (web + server).
- `api-core/` NestJS REST/WS API.
- `dashboard-web/` React + Vite dashboard.
- `motoboy-app/` Field app (React + Vite).
- `routing-service/`, `tracking-service/`, `notification-service/` background services/workers.
- `database/` Postgres/PostGIS migrations, seeds, scripts.
- `docker/` compose stack and Graphhopper data tooling.
- `docs/` module docs and deployment coordination notes.

## Build, Test, and Development Commands
- BHSIS app: `cd bhsis && pnpm dev` (watch), `pnpm build`, `pnpm test`, `pnpm db:push` (migrations).
- API Core: `cd api-core && npm run start:dev`, `npm run build`, `npm run lint`, `npm run format`.
- Other services (`routing-service`, `tracking-service`, `notification-service`): `npm run dev`, `npm run build`, `npm start`.
- Frontends (`dashboard-web`, `motoboy-app`): `npm run dev`, `npm run build`, `npm run preview`.
- Full stack (local infra): `bash docker/graphhopper/download-brazil.sh` then `docker compose -f docker/docker-compose.yml up`.

## Coding Style & Naming Conventions
- Use 2-space indentation and semicolons (follow existing files).
- TypeScript is the default; keep files in module-specific folders.
- Naming patterns in use: `*.routes.ts`, `*.test.ts`, `*.spec.ts`.
- Formatting tools: Prettier in `bhsis/` and `api-core/`; ESLint in `api-core/`.

## Testing Guidelines
- `bhsis/` uses Vitest (`bhsis/vitest.config.ts`). Current config runs `bhsis/server/**/*.test.ts` and `**/*.spec.ts`.
- Client tests exist in `bhsis/client/src/`; if you add more, ensure the test runner covers them.
- Other modules do not currently define test scripts; add module-local tests as needed.

## Commit & Pull Request Guidelines
- Prefer Conventional Commit prefixes when possible (e.g., `feat:`, `fix:`, `docs:`, `chore:`). Short, Portuguese or English summaries are both seen in history.
- PRs should include a clear description of changes, linked issues (if any), and screenshots for UI changes.

## Configuration & Coordination
- Use `.env.example` as the baseline; never commit secrets.
- If you change deployment flow or module status, update `docs/deployment-tracking.md` and `docs/implantation-status.md`.
