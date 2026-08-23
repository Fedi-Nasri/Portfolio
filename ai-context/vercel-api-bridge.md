# Vercel API Bridge and Master Deployment Boundary

## What this record protects

`master` contains the active Vercel-ready application implementation. Its generated `api/[...path].js` function allows Vercel to send backend `/api/*` requests into the Express/tRPC application while the Vite SPA continues to serve `/` and direct client-side routes such as `/edit`.

> **Current branch boundary, user-approved 2026-08-24:** `master` is both the local-development source and Vercel Production Branch. The Production deployment from `master` commit `732c0ac` is Ready. `deployment_versel` remains unchanged at `e448599` as a historical rollback reference, not the active runtime branch.

## Why the API bridge exists

The portfolio is a Vite single-page application. Page routes need an `index.html` fallback after a refresh, while the direct editor needs server-side tRPC routes under `/api/trpc/*` for draft data, immutable version saves, PostgreSQL persistence, and Blob uploads.

| Failure being prevented | Correction maintained on `master` | Expected result |
|---|---|---|
| `/api/trpc/*` falls through to the SPA. | `vercel.json` routes `/api/*` to the API function before client-side fallbacks. | `GET /api/trpc/auth.me` returns tRPC JSON, not HTML. |
| Serverless dependency/module-format failure. | `server/vercel-api-handler.ts` is bundled into CommonJS `api/[...path].js`; `api/package.json` scopes the API directory to CommonJS. | `/edit` loads its PostgreSQL-backed workspace. |
| Server/API source changes leave a stale function. | `pnpm build:vercel-api` regenerates the artifact. | The generated API function matches reviewed server source. |

## File responsibilities

| Path | Role | Rule for future agents |
|---|---|---|
| `server/vercel-api-handler.ts` | Source entry for the Vercel function bundle | Change only with relevant server/API tests. |
| `api/[...path].js` | Generated CommonJS Vercel catch-all function | Never hand-edit; regenerate it. |
| `api/package.json` | Keeps the generated API directory CommonJS inside an ESM repository | Preserve it with the generated function. |
| `vercel.json` | Prioritizes `/api/*`, preserves legacy media rewrite, then provides SPA fallback | Preserve route order unless a deployment architecture change is explicit. |
| `server/routers.ts` and `server/portfolio.ts` | Define tRPC editor/data contracts | Regenerate the artifact after relevant changes. |

## Required workflow for a server/API change

1. Start from current `master` and log work in `todo.md`.
2. Change source and tests, never generated `api/[...path].js` by hand.
3. Run `pnpm build:vercel-api`, then `pnpm check`, `pnpm test`, and `pnpm build`.
4. Checkpoint the work; update this record and the Vercel handbook if the runtime contract changed.
5. Obtain explicit approval before pushing `master`, because that creates Vercel Production.
6. On the Ready Production deployment, verify an API JSON response and `/edit`; use a disposable private draft for persistence or upload tests.

## Safety boundaries

The bridge is not authentication: `/edit` remains intentionally unauthenticated by user decision. It also does not migrate historical `/manus-storage` URLs; that remains a separate paused private-draft migration task. Do not change public draft selection, Production variables, database data, domains, Blob objects, or `deployment_versel` without a direct user instruction.

## References

- [`docs/vercel-deployment/05-api-bridge.md`](../docs/vercel-deployment/05-api-bridge.md) — detailed bridge guide.
- [`branch-and-release-workflow.md`](./branch-and-release-workflow.md) — master-first branch and release process.
- [`preview-verification-evidence.md`](./preview-verification-evidence.md) — observed Preview API, PostgreSQL, and Blob evidence.
