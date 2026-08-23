# Current Work Ledger

## Snapshot

**Last context refresh:** 2026-08-23 (GMT+2)
**Latest saved project checkpoint:** `4d8c5b9d` — validated the design-navigation documentation, checklist, and AI continuity updates. The retained application code remains the lighter Experience timeline treatment from `d6caf36e`.
**Current immediate task:** The user clarified that `deployment_versel` must remain the deployment baseline and receive only the approved UI and compatible shared-file changes. A non-Production candidate branch, `release/ui-sync-deployment`, was created from `deployment_versel` at `7ebeb84`; commit `bcc887b` contains the reviewed UI, motion, editor-parity, shared portfolio-model, focused test, and design-navigation updates. Vercel routing, API bridge, server runtime, migrations, environment handling, `vercel.json`, and package configuration were excluded and have no candidate diff. TypeScript, 84 Vitest tests, and the production build passed. Present this exact candidate for a fresh final Production approval before any protected-branch push. The historical-media migration remains paused; its legacy references stay untouched in private Draft 2 until the user explicitly resumes it.
**Deployment status:** `main` is the stable development branch. By explicit user approval on 2026-08-22, Vercel Production now tracks `deployment_versel`. The setting was saved without redeploying an existing deployment; future pushes to `deployment_versel` create Production Deployments.

**Latest Production evidence:** The approved documentation-only commit `7ebeb84` from `deployment_versel` completed as a Vercel **Production** deployment (Ready, 21 seconds). No application code, portfolio content, database, Blob, domain, or secret change was included.

**Latest stable-branch synchronization:** GitHub `main` now includes the approved public-motion prototype, lighter Experience technical theme, full Home/About/Selected Work refinement set, and the new design-navigation documentation through merge commit `ce7df13` (`merge: integrate approved public motion prototype`). The documentation commit on the feature branch is `c369166`. This did not create a Vercel Production deployment because Vercel Production tracks `deployment_versel`, not `main`.

**Motion and Home-composition prototype branch:** `feature/public-motion-prototype` contains the public-only motion language, the floating-specialty Home composition, editorial About layout, refined technology indicator, adaptive Selected Work behavior, and the lighter Experience timeline treatment. All work passed TypeScript, 84 Vitest tests, and a production build before the merge. On 2026-08-23 the user approved and the project merged this work, along with the new developer and AI navigation documentation, into `main` at `ce7df13`. This approval did **not** authorize a `deployment_versel` push or Vercel Production release; a separate immediate confirmation remains mandatory.

**Operations documentation:** `docs/release-and-media-operations.md` now provides the exact approved `main` → `deployment_versel` release sequence, first-run Compose instructions, a complete safe environment reference at `docs/environment.example`, and the local-to-Vercel lifecycle for images, PDFs, and SVGs. Docker is intentionally not installed in this managed sandbox, so the Compose file was statically formatted/validated; developers must run the documented `docker compose` commands on a Docker-enabled machine.

**API bridge documentation boundary:** `main` now mirrors the Vercel handbook and AI-context guidance so work can be planned safely there. The Vercel route configuration, generated CommonJS `api/[...path].js` function, Blob service integration, and Preview runtime behavior remain on `deployment_versel` until a deliberate release handoff occurs.

## Active priorities

| Priority | Status | Work item | Next safe action |
|---:|---|---|---|
| 1 | Complete | Merged the validated public-motion/design prototype and design-navigation documentation into stable `main` at `ce7df13`. | Preserve the handbook and AI release workflow; update them with future branch/service policy changes. |
| 2 | Paused by user | Migrate historical `/manus-storage` media references to an object-storage-compatible path. | Project 1 is verified in private Draft 2 version 4. Do not modify Draft 2 or Main until the user explicitly asks to resume. |
| 3 | Active | Maintain the direct editor’s deployment risk boundary. | Do not push unreviewed work to `deployment_versel`; it now creates Production Deployments, and `/edit` is intentionally unauthenticated. |
| 4 | Complete | Provide an optional local Docker Compose environment. | Compose uses isolated local PostgreSQL from `main`; it contains no Vercel, Neon, Blob, or Production credentials, and does not replace Vercel Production. |

## PostgreSQL hosting state

The user requested a provider-neutral PostgreSQL implementation and connected a Vercel-hosted **Neon PostgreSQL** database. The database appears as `neon-citrine-mountain` on the Free plan, and Vercel created a sensitive `DATABASE_URL` environment variable for Preview and Production. Do not expose or copy that value into project files.

| Confirmed | Still required |
|---|---|
| PostgreSQL is the project database technology. | Keep application code provider-neutral and do not disclose the connection value. |
| Neon is the currently connected Vercel PostgreSQL host. | Keep application code provider-neutral and do not disclose the connection value. |
| `DATABASE_URL` exists in Vercel Preview and Production. | Keep the runtime code provider-neutral and do not disclose the value. |
| PostgreSQL migration SQL and the additive `portfolio_media_assets` table were applied and table-verified on the connected host. | Migrate historical media references before treating all seeded public media as portable. |
| A disposable Preview draft was created, saved with a note, restored as a new version, reloaded, and kept private. | Leave Main selected as the public draft unless the user explicitly requests a change. |
| Vercel runtime logs show successful deployed tRPC save/create/restore/publish requests, and Blob contains new portrait/PDF-category objects. | Do not treat legacy `/manus-storage` URLs as Blob-migrated. |
| Private Draft 2 version 4 contains a Blob-backed replacement for the Autonomous Robot Boat project image; `assets.upload` and `portfolio.saveDraft` each returned HTTP 200 in Vercel logs. | Keep all remaining migrated references private until an explicit public-selection decision. |

## Validation baseline

The reported dark-mode screenshot revealed a contrast failure: focus-card labels were styled as light text despite rendering on white caption pills. The repair uses a dark navy caption color, a calmer blue-white caption surface, stronger dark-card boundaries, brighter visual-window separation, and reduced hero-orbit prominence. Browser verification confirmed legible Cloud, DevOps, and DevSecOps labels in both the public desktop dark hero and the `/edit` live preview dark hero. The Security & Networking artwork was also re-centred, with a mobile-specific geometry override, so its lower node remains inside the artwork frame rather than being clipped.

| Command / check | Last known result | Notes |
|---|---|---|
| `pnpm check` | Passed | TypeScript compiled with no errors before the main merge. |
| `pnpm test` | Passed: 15 files, 84 tests | Includes PostgreSQL persistence, Blob validation, API bridge, media upload preparation, public motion, text formatting, and development-only pg-mem fallback coverage. |
| `pnpm build` | Passed | Vite output and server bundle built successfully; bundle-size warning is informational. |
| Preview API and editor | Passed | `GET /api/trpc/auth.me` returned a tRPC JSON response; `/edit` loaded the full direct workspace. |

## Working rules for the next agent

1. Read `README.md`, this file, and the task-specific AI context before changes.
2. Add new user-requested work to `todo.md` as unchecked items before implementation.
3. Keep public `Home.tsx` and `FullLivePreview.tsx` visually aligned for any editable public section.
4. Test data behavior with a disposable draft, not the public Main portfolio, unless the user explicitly asks to alter public content.
5. Run TypeScript, Vitest, and build validation before checkpointing substantive code changes.
6. Update this ledger, `decisions.md`, `issues.md`, and `change-log.md` as the work changes state.
7. Build application changes on stable `main`; move only checkpointed, validated, explicitly approved releases to `deployment_versel`, then verify the resulting Production Deployment.
8. Use local Docker Compose only for isolated local development. Never place Vercel or Production credentials in `.env.local`, and never treat Compose as a Production deployment path.

## Preview deployment verification (2026-08-22)

The completed source is on GitHub branch `deployment_versel`; Vercel deploys it as a Preview without changing `main` or intentionally promoting Production. The current ready Preview is `https://portfolio-7ymbsxgog-fedi-s-projects2.vercel.app` from commit `91c8713`; the earlier API-packaging change in `54ef9eb` packages the Express/tRPC entry as `api/[...path].js` with an API-local CommonJS declaration, preventing the earlier SPA fallback and ESM dynamic-require failures.

On this Preview, `GET /api/trpc/auth.me` returned the expected tRPC JSON payload and `/edit` loaded the full workspace. A disposable `Draft 2` was created, saved as version 2 with the note `Vercel Preview PostgreSQL persistence verification`, reloaded, and then observed at version 3 after restore-as-new-version. Main remained marked Public and was not deliberately selected, deleted, or published during the verification. The Vercel Blob dashboard confirms the public `portfolio-blob` store is connected to Preview and Production and contains concrete `portfolio-editor/portrait/` JPEG objects.

The current documentation Preview is `https://portfolio-56o6c3vyb-fedi-s-projects2.vercel.app` from `3d8293c`. In its private Draft 2, a 3.78 MB PNG-encoded project source exceeded the JSON upload transport after Base64 expansion before reaching the function. The same 2304×1536 image was converted without cropping to a 236 kB JPEG derivative, uploaded successfully, and saved as Draft 2 version 4 with a clear migration note. Vercel logged HTTP 200 for both `assets.upload` and `portfolio.saveDraft`. See `preview-verification-evidence.md` for the source observations and remaining six legacy references.
