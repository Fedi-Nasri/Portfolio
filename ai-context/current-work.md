# Current Work Ledger

## Snapshot

**Last context refresh:** 2026-08-20 (GMT+2)  
**Latest saved project checkpoint:** `b7252cb3` — standalone architecture diagram, agent workflow example, capability map, and staged automated testing/CI plan.  
**Current immediate task:** Save the completed dark-mode focus-card and Security & Networking artwork repairs as a checkpoint. Vercel work remains paused.  
**Deployment status:** **Paused by user.** Do not resume Vercel or Neon actions without a new explicit request.

## Active priorities

| Priority | Status | Work item | Next safe action |
|---:|---|---|---|
| 1 | In progress | Save the completed dark-mode focus-card and Security & Networking artwork repairs. | Create a checkpoint, then update the ledger with its identifier and wait for the next request. |
| 2 | Paused | Vercel deployment for the full editor application. | Wait for user to explicitly resume deployment. First verify whether Neon was actually created; do not assume it was. |
| 3 | Pending after deployment resumes | Port current MySQL/TiDB Drizzle layer to PostgreSQL if Neon is selected. | Perform a deliberate schema/driver/migration port; do not paste a PostgreSQL URL into MySQL code. |
| 4 | Pending after database decision | Replace Forge/S3 storage dependence with Vercel Blob for standalone Vercel uploads. | Add a server-side storage provider adapter, migrate/test asset reads/writes, then validate production. |

## Paused Vercel / Neon state

The user requested Vercel deployment, confirmed use of a Vercel-connected SQL database, and accepted Vercel/Neon terms. In the Vercel Storage UI, the intended configuration was: **Neon PostgreSQL**, Frankfurt (`fra1`) region, Free plan, and built-in Neon Auth disabled. A resource name of `portfolio-editor-db` was entered during the wizard.

The user then explicitly said to “forget about Vercel for now.” The creation wizard was handed back to the user, and this context cannot verify whether the final **Create** action completed. Treat the database as **unconfirmed** until Vercel Storage visibly lists it and a connection string/environment variable can be verified.

| Do not assume | Required confirmation |
|---|---|
| Neon resource exists. | Verify it appears in Vercel Storage. |
| `DATABASE_URL` is configured. | Verify Vercel environment variables without disclosing the value. |
| Migrations were applied. | Inspect migration state against the connected database. |
| The application can use Neon already. | Complete the MySQL-to-PostgreSQL port and test it. |
| Blob storage exists or uploads are production-ready. | Connect Blob, implement adapter, and run upload smoke tests. |

## Validation baseline

The reported dark-mode screenshot revealed a contrast failure: focus-card labels were styled as light text despite rendering on white caption pills. The repair uses a dark navy caption color, a calmer blue-white caption surface, stronger dark-card boundaries, brighter visual-window separation, and reduced hero-orbit prominence. Browser verification confirmed legible Cloud, DevOps, and DevSecOps labels in both the public desktop dark hero and the `/edit` live preview dark hero. The Security & Networking artwork was also re-centred, with a mobile-specific geometry override, so its lower node remains inside the artwork frame rather than being clipped.

| Command / check | Last known result | Notes |
|---|---|---|
| `pnpm check` | Passed | TypeScript compiled with no errors after the focus-card repairs. |
| `pnpm test` | Passed: 10 files, 71 tests | Includes editor, data, canvas, project image, export, public page, and assets coverage. |
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

The documentation and AI-context checklists are recorded in `todo.md`. The Vercel deployment checklist remains unchecked and paused. The current beginner-focused Vercel guide is documentation only; it does not resume deployment activity.
