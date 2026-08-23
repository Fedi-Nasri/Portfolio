# Master-First Development and Release Workflow

This guide is the day-to-day operating contract for the portfolio. It defines one active branch—`master`—that contains the complete local-development and Vercel-ready application runtime.

> **Working policy, approved 2026-08-24:** `master` is the active development and Vercel **Production Branch**. Vercel deploys each approved push to `master` as Production. `deployment_versel` is retained unchanged as the historical Production release and rollback reference; it is not an active release target.

## Branch responsibilities

| Branch or environment | Purpose | Allowed work | Do not do |
|---|---|---|---|
| `master` | Canonical source, local-development baseline, and Vercel Production Branch | Build, test, document, checkpoint, and—after explicit approval—push reviewed releases. | Push unreviewed or failing work; force-push; treat a local commit as automatically published. |
| Short-lived `feature/*` branch (optional) | Isolated review space created **from current `master`** | Prototype or review a discrete feature, then validate it against the current master baseline. | Base it on stale `main` or `deployment_versel`; use it as a second source of truth. |
| `deployment_versel` | Historical release and rollback reference (`e448599`) | Preserve its evidence; use it only when the user explicitly requests a rollback strategy. | Delete, force-push, or continue ordinary feature/release work there. |
| Vercel Production | Live user-facing portfolio | Serves the latest Ready deployment created from approved `master` work. | Change branch tracking, domains, variables, or public draft selection without explicit user approval. |

## One active branch rule

This is one project, not two copies to synchronize. Start every future task from `master`; create a short-lived feature branch from `master` only when isolated review is useful. The tested, reviewed result must return to `master` before it can be released.

Because Vercel tracks `master` as Production, **pushing to `master` is a live release action**. Complete local validation and obtain explicit user approval immediately before the push. A local commit, a saved Manus checkpoint, or a Preview deployment is not itself a Production release.

```text
master (local development, validation, documentation) → explicit approval → push master → Vercel Production
                         ↑
                  optional feature/* from master
```

## Every new feature: required sequence

1. **Start from master.** Run `git switch master` and `git pull --ff-only origin master`; do not begin on `main` or `deployment_versel`.
2. **Understand the request.** Read `ai-context/README.md`, `current-work.md`, and the relevant specialist files. Add concrete unchecked work to `todo.md` before implementation.
3. **Map the impact.** Identify public rendering, `/edit`, shared content, database, tRPC/API, Blob storage, static export, Docker, and Vercel implications.
4. **Implement and document.** Keep `Home.tsx` and `FullLivePreview.tsx` aligned for editable public sections; update `docs/` and `ai-context/` with durable behavior and risks.
5. **Validate locally.** Run `pnpm check`, `pnpm test`, and `pnpm build`; run `pnpm build:vercel-api` whenever server/API routing or server dependencies change.
6. **Checkpoint reviewed work.** Confirm `todo.md` accurately distinguishes completed, active, and deliberately paused work.
7. **Request release approval.** Explicit approval is required immediately before pushing to `master`, because that creates a Production deployment.
8. **Push master safely.** Use a normal fast-forward-safe push. Never use `--force`, `git reset --hard`, or unrelated-history merges.
9. **Verify Production.** Inspect Vercel’s Ready deployment and test `/`, `/edit`, and `/api/trpc/auth.me` when API behavior is relevant. Use a disposable private draft for persistence or upload tests.
10. **Record evidence.** Update `ai-context/current-work.md`, `change-log.md`, and `issues.md` with the deployment URL, commit, relevant route checks, and known limits.

## Change-impact matrix

| If you change… | Also examine… | Minimum validation | Production verification |
|---|---|---|---|
| Public copy, layout, or styles | `Home.tsx`, `FullLivePreview.tsx`, responsive behavior | `pnpm check`, relevant tests, `pnpm build` | Check `/` and `/edit` visual parity. |
| Portfolio data field | `shared/portfolio.ts`, default data, editor, renderer, export, persistence | TypeScript and focused regression coverage | Save/reload a private draft. |
| New route or API procedure | `server/routers.ts`, API context, client query/mutation, errors | `pnpm build:vercel-api`, TypeScript, procedure/API test, build | Verify tRPC JSON and affected flow. |
| Database schema | `drizzle/schema.ts`, generated migration, query helpers, tests, docs | Migration review and PostgreSQL tests | Use only a disposable draft; never destructive Production experiments. |
| Image or PDF feature | `server/assets.ts`, editor upload controls, Blob metadata, export | Asset tests and full checks | Upload a safe file privately; verify Blob URL, metadata, and rendering. |
| Vercel routing/build behavior | `vercel.json`, `api/package.json`, `api/[...path].js` | API artifact build plus full checks | Reload `/edit`, test API JSON, inspect Vercel build/runtime logs. |

## Local Docker Compose

Use [Local Docker Compose development](./local-docker-development.md) for an isolated local PostgreSQL environment. Compose is local-only, runs the source currently checked out from `master`, and never contains Vercel, Neon, Blob, or Production credentials.

## Non-negotiable safeguards

The following still require direct user instruction: publishing a new `master` commit, changing Vercel branch tracking, changing Production variables or domains, destructive database work, deleting Blob objects, or changing the selected public portfolio draft. Preserve `deployment_versel` until the user explicitly requests a different rollback/archival decision.

For concrete commands, environment handling, and the image/PDF/SVG lifecycle, read [Release and Media Operations](./release-and-media-operations.md) and the [Vercel Deployment Handbook](./vercel-deployment/README.md).
