# Quoriva frontend

React/TypeScript interface for Quoriva. The current foundation displays the Go API's availability with loading, ready, unavailable, and retry states.

## Source map

- `src/App.tsx`: page markup and status presentation.
- `src/api/serviceStatus.ts`: request and runtime JSON validation.
- `src/hooks/useServiceStatus.ts`: loading state, retry, timeout and request cleanup.
- `src/App.test.tsx` and `src/api/serviceStatus.test.ts`: UI lifecycle and API response cases.

Request functions live in `api`, React lifecycle code in `hooks`, and styles beside their component. Keep reusable functions with their responsibility instead of collecting unrelated helpers in one file.

## Work independently

Use Node 24.22.1 (the pinned container/CI version) and npm. From this repository root:

```powershell
npm ci
npm run test
npm run build
npm run dev
```

The development server listens on port 5173. It proxies `/api` to `http://localhost:8080` by default, so the Go backend must be running for the availability check to succeed. You can select another backend using `API_PROXY_TARGET`; this variable configures the server proxy and is not a browser database credential.

```powershell
$env:API_PROXY_TARGET = 'http://localhost:8080'
npm run dev
```

Component tests and the build do not require the backend. The Dockerfile provides the pinned Node environment and runs the development server as the node user. Source is copied during image build; rebuild after edits when using that image.

## Work in the main Quoriva checkout

When this folder is `Quoriva_frontend` inside the main Quoriva repository, run the shared stack and integration checks from the parent directory:

```powershell
docker compose up -d --build
docker compose run --build --rm web-test
docker compose run --build --rm browser-test
```

The main repository owns Compose, `contracts/openapi.yaml`, requirements and architecture in `docs/`, and Playwright under `tests/e2e/`. Read those from a matching main checkout; they are not duplicated in this repository. Browser/system tests require the complete stack.

## Repository state and boundaries

This folder is prepared as an independent local Git repository. Full submodule activation in the main repository requires initial child commits and parent gitlink references; consult the main repository's refactor notes for actual activation state. GitHub remotes will be configured after the organization exists. No frontend commit implies a main-repository integration update automatically.

See [AGENTS.md](AGENTS.md) for engineering and learning guidance. Local `.env` files, dependencies, build output, and test artifacts are ignored; source, the lockfile, Dockerfile, instructions and CI configuration are intended for version control after initial-commit approval.
