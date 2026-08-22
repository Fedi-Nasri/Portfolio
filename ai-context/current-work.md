# Current Work Ledger

## Snapshot

**Last context refresh:** 2026-08-22 (GMT+2)  
**Latest saved project checkpoint:** `ccc0c9de` — renderer-safe Mermaid architecture diagrams.  
**Current immediate task:** Finish the provider-neutral PostgreSQL conversion by applying reviewed migrations to the connected host and verifying live draft persistence.  
**Deployment status:** Database migration work is active by user request. Deployment and Vercel Blob work are still not complete.

## Active priorities

| Priority | Status | Work item | Next safe action |
|---:|---|---|---|
| 1 | Active | Apply the reviewed provider-neutral PostgreSQL migration to the configured database and validate live draft persistence. | Use the configured host without exposing `DATABASE_URL`; do not apply to the legacy managed MySQL database. |
| 2 | Pending after database migration | Replace Forge/S3 storage dependence with Vercel Blob for standalone Vercel uploads. | Add a server-side storage provider adapter, migrate/test asset reads/writes, then validate production. |
| 3 | Pending after storage work | Deploy and smoke-test the full editor application. | Verify public/editor routes, draft workflows, assets, and exports in a preview before production. |

## PostgreSQL hosting state

The user requested a provider-neutral PostgreSQL implementation and connected a Vercel-hosted **Neon PostgreSQL** database. The database appears as `neon-citrine-mountain` on the Free plan, and Vercel created a sensitive `DATABASE_URL` environment variable for Preview and Production. Do not expose or copy that value into project files.

| Confirmed | Still required |
|---|---|
| PostgreSQL is the project database technology. | Apply the generated PostgreSQL migration to the configured host. |
| Neon is the currently connected Vercel PostgreSQL host. | Verify real draft save/restore/publish behavior after migration. |
| `DATABASE_URL` exists in Vercel Preview and Production. | Keep the runtime code provider-neutral and do not disclose the value. |
| PostgreSQL migration SQL is generated and reviewed. | Connect Blob, implement its adapter, and run upload smoke tests before production uploads. |

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

The PostgreSQL conversion, generated migration, provider-neutral documentation, and regression validation are recorded in `todo.md`. The live migration, Blob adapter, and deployment verification remain unchecked.
