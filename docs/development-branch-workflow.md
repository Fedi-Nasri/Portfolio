# Stable Development Workflow: `main` to `deployment_versel`

This guide is the day-to-day development contract for the portfolio. It separates building a feature from deploying it, so a Vercel troubleshooting change does not accidentally become a Production release and an unfinished feature does not become the deployment baseline.

> **Working policy:** `main` is the **stable development branch**. Build portfolio features there. `deployment_versel` is the **Vercel-connected deployment branch**. It receives reviewed, validated release candidates from `main` and produces Preview deployments. Do not use this policy to change Vercel Production settings; that remains an explicit user decision.

## Branch responsibilities

| Branch | Purpose | Allowed work | Do not do |
|---|---|---|---|
| `main` | Stable development source of truth | Build features, fix bugs, update contracts, tests, documentation, and AI context. | Treat it as a request to publish a Production deployment. |
| `deployment_versel` | Vercel deployment candidate | Carry checkpointed, reviewed changes that need Preview verification; hold Vercel-specific packaging/configuration when required. | Make experimental changes without validation, force-push, or change Production settings automatically. |

## Every new feature: the required sequence

1. **Understand the request.** Read `ai-context/README.md`, `current-work.md`, and the specialist record for the affected area. Add a specific unchecked task to `todo.md`.
2. **Map the impact.** Decide whether the change affects public rendering, `/edit`, shared content types, database schema, tRPC routes, Blob storage, static export, or Vercel packaging.
3. **Implement on `main`.** Keep the public portfolio and `FullLivePreview.tsx` aligned when a section is editable.
4. **Test locally.** Run the checks required by the impact matrix below. Fix failures before handoff.
5. **Maintain documentation.** Update relevant `docs/` and `ai-context/` files in the same work item; record decisions and risks rather than leaving hidden assumptions.
6. **Checkpoint the stable work.** Ensure `todo.md` is accurate before creating a checkpoint.
7. **Create a deployment candidate.** Deliberately move only the desired checkpointed changes to `deployment_versel`.
8. **Verify Vercel Preview.** Inspect the generated Preview; test routes, server behavior, PostgreSQL changes, and uploads relevant to the feature.
9. **Record evidence.** Update `ai-context/current-work.md`, `issues.md`, and `change-log.md`. A Ready Preview is not a Production approval.

## Change-impact matrix

| If you change… | Also examine… | Minimum local validation | Preview validation |
|---|---|---|---|
| Public copy, layout, or styles | `Home.tsx`, `FullLivePreview.tsx`, responsive behavior | `pnpm check`, relevant tests, `pnpm build` | Verify `/` and `/edit` visual parity. |
| Portfolio data field | `shared/portfolio.ts`, default data, editor, renderer, export, persistence | TypeScript, test coverage, export test | Save/reload a private draft and review output. |
| New route or API procedure | `server/routers.ts`, API context, client query/mutation, errors | `pnpm check`, procedure/API test, `pnpm build:vercel-api` | Call the route and inspect Vercel logs. |
| Server implementation | `server/`, `server/vercel-api-handler.ts`, generated API artifact | `pnpm build:vercel-api`, `pnpm check`, `pnpm test`, `pnpm build` | Confirm `/api/trpc/auth.me` returns JSON and the affected procedure works. |
| Database schema | `drizzle/schema.ts`, generated migration, query helpers, tests, docs | Migration review, PostgreSQL tests, full checks | Validate only with a disposable Preview draft; no destructive data experiments. |
| Image or PDF feature | `server/assets.ts`, editor upload controls, Blob metadata, export | Asset tests, full checks | Upload a safe file privately, save/reload, verify Blob URL and display/viewer. |
| Vercel routing/build behavior | `vercel.json`, `api/package.json`, `api/[...path].js` | API artifact build plus full checks | Reload `/edit`, test API JSON, review build/runtime logs. |

## Adding a database table or column

1. Define it in `drizzle/schema.ts` using provider-neutral PostgreSQL types.
2. Generate migration SQL with `pnpm drizzle-kit generate`.
3. Read the SQL carefully; ensure it is additive, ordered safely, and has required indexes/foreign keys.
4. Apply the reviewed migration to the intended PostgreSQL host through the approved database workflow.
5. Add services, tRPC input/output validation, and Vitest coverage.
6. Update `ai-context/database-and-data.md`, architecture records, and any editor/export behavior.
7. Test with a disposable draft on Preview. Never use the selected public Main draft as the first migration test.

## Adding a file, folder, or Blob asset

| What you need | Correct location/action |
|---|---|
| React page | `client/src/pages/`, then register its route in `client/src/App.tsx`. |
| Reusable UI piece | `client/src/components/`; do not duplicate a public/editor shared pattern. |
| Shared data type/default field | `shared/portfolio.ts`. |
| Database definition/migration | `drizzle/schema.ts` and generated SQL under `drizzle/postgres/`. |
| Server/service logic | `server/`, with a Vitest test beside the behavior. |
| Small public configuration | `client/public/` only when it is a small configuration file. |
| Source image/PDF | `/home/ubuntu/webdev-static-assets/`, outside the project repository. |
| Visitor-facing media bytes | Vercel Blob through the server upload workflow; store metadata in `portfolio_media_assets`. |
| Documentation | `docs/` for durable manuals; `ai-context/` for current state and agent continuation. |

## Handoff checklist before `deployment_versel`

- [ ] The desired `main` commit is checkpointed and reviewed.
- [ ] `todo.md` is accurate; no incomplete work is falsely marked complete.
- [ ] `pnpm build:vercel-api` ran if server/API code changed.
- [ ] `pnpm check`, `pnpm test`, and `pnpm build` pass.
- [ ] Schema changes have reviewed migrations and no secret values were committed.
- [ ] Documentation and AI context reflect the new behavior and risks.
- [ ] The exact change set is reviewed before moving it to `deployment_versel`.
- [ ] Preview verification plan is written, including safe disposable data if persistence is affected.

## What must never be automatic

The following actions require an explicit user instruction: changing the Vercel Production branch, promoting a Preview to Production, purchasing or assigning a domain, changing Production environment variables, running destructive database operations, deleting Blob objects, or selecting/publishing a different public portfolio draft.

For Vercel-specific release work, continue with the [Vercel Deployment Handbook](./vercel-deployment/README.md).
