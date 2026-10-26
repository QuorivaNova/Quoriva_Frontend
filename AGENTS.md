# Quoriva frontend guidance

This repository owns the React interface, frontend dependencies, component tests, and frontend image. Shared product requirements, API contracts, full-stack Compose, system browser tests, and orchestration belong to the main Quoriva repository.

## Context and authorization

Inspect this repository's working tree before edits. In an umbrella checkout, explicitly read `../AGENTS.md`, `../docs/planning/status.md`, the relevant backlog item, and the authoritative product/contract documents before changing behavior. A standalone checkout must not assume outer instructions are loaded: request or locate a matching main-repository checkout when material product context is missing. Do not invent pending product decisions or duplicate the specification here.

The current authorization is the repository-organization refactor; QV-001 is implemented. Do not start later features automatically. No commit, push, merge, deployment, or GitHub mutation without explicit authorization. Preserve unrelated work and never commit local secrets. Check the latest user instruction and main status for later authorization.

## Implementation and checks

Use React/TypeScript with existing CSS Modules and a small fetch-based foundation. Keep browser data validation, cancellation, bounded requests, accessible loading/error/retry states, keyboard use, and responsive layout. Server responses authorize operations; stale frontend state never establishes seat ownership. Coordinate shared API changes with the backend/main repositories.

Node 24.22.1 is the pinned container/CI runtime; host Node must satisfy package.json engines. Run `npm ci`, `npm run test`, and `npm run build` for relevant changes. Report actual results and limitations. System Playwright tests are owned by the main repository, not this package. See README.md for standalone and umbrella commands.

## AI workflow and learning

Use the main Quoriva development workflow for cross-repository increments. If its skill is unavailable, read its checked-in source from the main checkout. Delegate only genuinely independent tasks with clear file ownership. Explain significant new concepts before implementing and walk through actual changes and a relevant exercise afterward. Pause for teaching only when the user requests it; teaching is not another permission gate. Keep learning activity separate from verified application behavior.
