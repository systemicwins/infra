# Repository Guidelines

## Project Structure & Module Organization
- `backend/`: Express + TypeScript API; keep feature logic in `src/{routes,services,utils}` and colocate specs in `tests/`.
- `frontend/`: Svelte/Vite client; components sit in `src/`, static assets in `public/`, automation scripts under `scripts/`.
- `terraform/`: GCP infrastructure entrypoint (`main.tf`) with reusable `modules/` and environment values in `variables/`.
- `deployment/` + `docker-compose.yml`: Nginx proxy, local stack wiring; operational references live in `docs/` and `SCALING.md`.

## Build, Test, and Development Commands
- `docker-compose up --build` launches the full stack locally (frontend 5173, backend 8080, Firestore emulator 8081).
- Backend: `cd backend && npm install && npm run dev`; use `npm run build` and `npm run start` to validate the compiled bundle.
- Validation: `npm run lint`, `npm run test`, and `npm run test:watch` while iterating on API changes.
- Frontend: `cd frontend && npm run dev`; run `npm run build` and `npm run check` before raising a PR.
- Infrastructure: from the repo root run `terraform init`, `terraform plan`, then `terraform apply`; commit only sanitized plan outputs.

## Coding Style & Naming Conventions
- Prefer 2-space indentation and ES module syntax in TypeScript; `backend/src/index.ts` is the canonical reference.
- Name files and exports by domain (`supportRouter.ts`, `conversationService.ts`); camelCase functions, PascalCase Svelte components.
- Backend linting runs through ESLint (`npm run lint`); rely on the shared `logger` utility instead of `console.*`.
- Frontend formatting is enforced with Prettier (`npm run format`); keep shared styling assets in `public/` when not component-scoped.

## Testing Guidelines
- Place Jest specs under `backend/tests`, mirroring `src` paths and suffixing files with `*.spec.ts`.
- Stub external services (Vertex AI, Twilio, Firestore) via Jest mocks; avoid live API calls in local runs or CI.
- Run `npm run test` and `npm run check` before pushing; add smoke tests whenever routes or UI flows change.

## Commit & Pull Request Guidelines
- Use imperative commit subjects ≤72 characters (e.g., `Add explanation of why merge.dev is great for acquisitions`).
- Keep commits focused and squash WIP before review; include configuration updates in the same change set.
- PR descriptions must cite related issues, list verification commands (`npm run test`, `npm run lint`, `terraform plan`), and flag env changes.
- Attach UI screenshots or GIFs for frontend updates; paste relevant plan diffs or emulator notes when infrastructure or Docker changes are involved.
