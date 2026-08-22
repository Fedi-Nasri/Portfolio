# Vercel API Bridge and Documentation Boundary

## What this record protects

`deployment_versel` contains the **Vercel-specific application implementation**. Its generated `api/[...path].js` function allows Vercel to send backend `/api/*` requests into the Express/tRPC application. The stable `main` branch now contains a synchronized **documentation and AI-context mirror** so feature work can be planned safely there; it does **not** mean that `main` currently owns, deploys, or runs the Vercel API bridge.

> **Branch boundary:** Documentation is mirrored on both branches. The deployed catch-all function, Vercel rewrites, Blob integration, and Preview runtime verification are implementation facts of `deployment_versel` until a deliberate, validated release candidate is moved according to `branch-and-release-workflow.md`.

## Why the API bridge was created

The portfolio is a Vite single-page application. Its page routes, including `/edit`, need an `index.html` fallback after a refresh. The direct editor also needs server-side tRPC routes under `/api/trpc/*` for draft data, immutable version saves, PostgreSQL persistence, and Blob uploads.

The initial Vercel configuration failed in two distinct ways. First, tRPC routes could reach the SPA fallback and return application HTML rather than a tRPC result. Second, an initial serverless entry could not safely resolve the shared server dependencies under the root ES-module configuration. The public page could therefore render while the direct editor could not load or save data.

| Failure | Correction on `deployment_versel` | Observed result |
|---|---|---|
| `/api/trpc/*` fell through to the SPA. | `vercel.json` routes `/api/*` to the API function before client-side fallbacks. | `GET /api/trpc/auth.me` returned tRPC JSON, not HTML. |
| Serverless dependency/module-format error. | `server/vercel-api-handler.ts` is bundled into self-contained CommonJS `api/[...path].js`; `api/package.json` scopes that directory to CommonJS. | `/edit` loaded its PostgreSQL-backed workspace in Preview. |
| A server/API source edit could leave the deployed function stale. | `pnpm build:vercel-api` regenerates the function artifact. | This command is a mandatory release gate whenever server/API sources change. |

## File responsibilities

| Path | Role | Rule for future agents |
|---|---|---|
| `server/vercel-api-handler.ts` | Source entry for the Vercel function bundle. | Change only with corresponding server/API tests. |
| `api/[...path].js` | Generated CommonJS Vercel catch-all function. | Never hand edit; regenerate it. |
| `api/package.json` | Keeps the generated API directory CommonJS inside an ESM repository. | Keep it with the generated function. |
| `vercel.json` | Prioritizes `/api/*`, keeps legacy media rewrite, then supplies SPA fallback. | Preserve route order unless deliberately redesigning the deployment architecture. |
| `server/routers.ts` and `server/portfolio.ts` | Define the tRPC editor/data contracts used by the function. | Regenerate the artifact after relevant changes. |

## Verified capability boundary

The `deployment_versel` Preview has verified tRPC availability, private draft creation/save/reload/restore behavior, PostgreSQL persistence, and new Blob upload behavior. The bridge is **not** authentication: `/edit` remains intentionally unauthenticated. It also does not migrate historical `/manus-storage` URLs; those remain a separate private-draft migration task.

## Documentation synchronization to `main`

On 2026-08-22, the full developer documentation suite (16 Markdown files) was copied into `main` at Git commit `6250d04`, and its AI-context mirror is being added through this work item. The copies are intentionally descriptive. Links from `main` documentation point to implementation files on `deployment_versel` where those files are deployment-specific.

| What is synchronized to `main` | What remains on `deployment_versel` |
|---|---|
| Vercel handbook, beginner guide, runbook, services guide, environment guide, API bridge guide, and AI continuation records. | Vercel routing, generated API bundle, API CommonJS metadata, Blob/media implementation, and the branch that Vercel uses for Preview. |
| Branch-policy instructions: develop/test on `main`, then move a checkpointed candidate. | Actual Preview deployment execution and runtime evidence. |
| Source-of-truth links back to the Vercel branch where necessary. | No automatic promotion of Preview or changes to Production. |

## Required workflow for a server/API change

1. Start on `main` and log the work in `todo.md`.
2. Change source and tests, not generated `api/[...path].js` by hand.
3. Run `pnpm build:vercel-api`, then `pnpm check`, `pnpm test`, and `pnpm build`.
4. Checkpoint the work and deliberately move the reviewed candidate to `deployment_versel`.
5. On Preview, verify an API JSON response and `/edit`; use a disposable private draft for persistence or upload tests.
6. Update this record, `current-work.md`, `decisions.md`, `issues.md`, `change-log.md`, and the Vercel handbook when the deployment behavior changes.

## References

- [`docs/vercel-deployment/05-api-bridge.md`](../docs/vercel-deployment/05-api-bridge.md) — detailed developer-facing bridge guide.
- [`branch-and-release-workflow.md`](./branch-and-release-workflow.md) — mandatory branch and release process.
- [`preview-verification-evidence.md`](./preview-verification-evidence.md) — observed Preview API, PostgreSQL, and Blob evidence.
