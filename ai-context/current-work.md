# Current Work Ledger

## Snapshot

**Last context refresh:** 2026-08-22 (GMT+2)  
**Latest saved project checkpoint:** `327f3425` — provider-neutral PostgreSQL source conversion; this follow-up schema application is awaiting its own checkpoint.  
**Current immediate task:** Reconcile the verified PostgreSQL schema application in documentation, run the regression suite, and checkpoint the work.  
**Deployment status:** The initial database schema is applied and verified. Preview/production deployment and Vercel Blob work remain incomplete and require separate approval.

## Active priorities

| Priority | Status | Work item | Next safe action |
|---:|---|---|---|
| 1 | Active | Reconcile the existing Vercel project’s connected source before requesting a Preview deployment. | The current live deployment serves server source instead of the portfolio and does not match the checkpointed local repository. |
| 2 | Pending after source reconciliation | Exercise disposable-draft PostgreSQL persistence in a Vercel Preview deployment. | Verify public/editor routes, draft workflows, and public reads before any production deployment. |
| 3 | Pending | Replace Forge/S3 storage dependence with Vercel Blob for standalone Vercel uploads. | Add a server-side storage provider adapter, migrate/test asset reads/writes, then validate a preview. |

## PostgreSQL hosting state

The user requested a provider-neutral PostgreSQL implementation and connected a Vercel-hosted **Neon PostgreSQL** database. The database appears as `neon-citrine-mountain` on the Free plan, and Vercel created a sensitive `DATABASE_URL` environment variable for Preview and Production. Do not expose or copy that value into project files.

| Confirmed | Still required |
|---|---|
| PostgreSQL is the project database technology. | Verify real draft save/restore/publish behavior only in an approved Vercel Preview deployment. |
| Neon is the currently connected Vercel PostgreSQL host. | Keep application code provider-neutral and do not disclose the connection value. |
| `DATABASE_URL` exists in Vercel Preview and Production. | Keep the runtime code provider-neutral and do not disclose the value. |
| PostgreSQL migration SQL was generated, reviewed, applied, and table-verified on the connected host. | Connect Blob, implement its adapter, and run upload smoke tests before production uploads. |

## Validation baseline

The reported dark-mode screenshot revealed a contrast failure: focus-card labels were styled as light text despite rendering on white caption pills. The repair uses a dark navy caption color, a calmer blue-white caption surface, stronger dark-card boundaries, brighter visual-window separation, and reduced hero-orbit prominence. Browser verification confirmed legible Cloud, DevOps, and DevSecOps labels in both the public desktop dark hero and the `/edit` live preview dark hero. The Security & Networking artwork was also re-centred, with a mobile-specific geometry override, so its lower node remains inside the artwork frame rather than being clipped.

| Command / check | Last known result | Notes |
|---|---|---|
| `pnpm check` | Passed | TypeScript compiled with no errors after the PostgreSQL conversion. |
| `pnpm test` | Passed: 10 files, 71 tests | Uses an in-memory PostgreSQL compatibility setup for draft persistence workflows. |
| `pnpm build` | Passed | Vite output and server bundle built successfully; bundle-size warning is informational. |
| Dev server | Running at port 3000 | Public and editor routes were previously available in the managed preview. |

## Working rules for the next agent

1. Read `README.md`, this file, and the task-specific AI context before changes.
2. Add new user-requested work to `todo.md` as unchecked items before implementation.
3. Keep public `Home.tsx` and `FullLivePreview.tsx` visually aligned for any editable public section.
4. Test data behavior with a disposable draft, not the public Main portfolio, unless the user explicitly asks to alter public content.
5. Run TypeScript, Vitest, and build validation before checkpointing substantive code changes.
6. Update this ledger, `decisions.md`, `issues.md`, and `change-log.md` as the work changes state.

## Existing TODO status

The PostgreSQL conversion and initial schema application are recorded in `todo.md`. The current Vercel production deployment was inspected only and serves server source rather than the portfolio, indicating a source/build-target mismatch that must be reconciled before Preview-backed persistence testing. The Blob adapter and deployment verification remain unchecked.

## Preview deployment investigation (2026-08-22)

The completed source was pushed to GitHub branch `deployment_versel`, which Vercel correctly deploys as Preview without touching `main` or production. The public Preview UI renders, but its historical `/manus-storage` media is unavailable. The editor is stalled because its tRPC calls initially matched the SPA fallback; after an explicit API route was added, Vercel reached the function but failed to resolve `/var/task/server/_core/app`. A follow-up `@vercel/node` builder configuration also failed at install because Vercel chose pnpm 9 and reported `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` for the repository’s patched-dependency configuration. Preserve this evidence and finish API packaging before using the editor or testing PostgreSQL writes.
