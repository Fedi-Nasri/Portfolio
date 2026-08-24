# Current Work Ledger

## Snapshot

**Last context refresh:** 2026-08-24 (GMT+2)
**Current branch policy, 2026-08-24:** The user explicitly selected `master` as the active branch for all future feature work and Vercel Production. Vercel Production Environment Branch Tracking records `master`; the current Ready Production deployment is commit `440a119`. `deployment_versel` remains unchanged at `e448599` as the historical release and rollback reference. Do not use `main` or `deployment_versel` as the starting point for new feature work.
**Latest managed-project checkpoint:** `0acff026` — records the master-synchronized Manus Preview workspace. The legacy media migration remains intentionally paused.
**Completed Experience release:** Approved master commits through `440a119` released the Galylio DevSecOps internship, Freelance Cloud & Kubernetes Engineer engagement, revised Experience heading, and “4 Professional engagements” statistic. The migration repairs preserve the legacy `now: true` marker and normalize only exact default-derived saved content; custom Experience data remains unchanged.
**Current immediate task:** The combined source release through `da792a1` is live and Ready on Vercel Production, with the final plain-text About copy rendering correctly. Production verification found that the saved Main draft uses zero-padded legacy statistics (`02`, `04`, `05`) and system-generated project summaries equal to each project body’s first sentence. The strict migration predicates did not recognize those two legacy shapes, so the public site still shows four Selected Work cards and the old statistics. A narrow local repair now recognizes only those exact legacy patterns, preserves any custom summary/statistic, and was validated by TypeScript, 17 Vitest files / 95 tests, production build, and public/editor preview review. Do not push the corrective candidate without a new explicit approval.
**Manus Preview boundary:** The managed workspace is aligned to master commit `440a119` and uses an in-memory development database. It may be synchronized with this validated local source for user review, but no managed-preview edit or restart affects Vercel Production data.
**Historical branch status, superseded 2026-08-24:** Before the master-first transition, `main` was the stable development branch and Vercel Production tracked `deployment_versel`. Preserve that fact only as release history; do not resume this two-branch workflow. The active branch and Vercel Production Branch are now `master`.

**Production release, 2026-08-23:** After the user’s fresh final confirmation, audited release candidate `e448599` was pushed to `deployment_versel`, advancing it from `70a4e3f`. The candidate contained only the reviewed Toolbox, Selected Work image/disclosure, and Cloud & Infrastructure refinements. The protected Vercel routing, API bridge, server runtime, migrations, package configuration, environment handling, `vercel.json`, and lockfile were unchanged. Candidate validation passed TypeScript, 16 Vitest files / 88 tests, and production build. The live public `/`, direct `/edit`, and `/api/trpc/auth.me` all returned HTTP 200. The Production public draft keeps the capabilities section explicitly hidden; `/edit` confirms the released Deployment Lifecycle content is available and remains editable. Do not change that visibility setting without user instruction.

**Stable main synchronization, 2026-08-23:** The user approved a broader runtime synchronization after a feature-only main candidate exposed that `main` lacked the full-stack runtime foundation. Stable `main` now contains reconciliation commits `531b67f` (released UI/features) and `0be6417` (runtime, PostgreSQL/Blob support, Vercel bridge, migrations, package and test foundation) on top of `ff7182a`. The complete candidate passed TypeScript, 16 Vitest files / 88 tests, and production build. The Vercel bridge bundle and a few framework source files were copied byte-for-byte from the released baseline; their existing whitespace warnings are inherited and were not introduced by this sync. `deployment_versel` remains at Production release `e448599`; the main push does not trigger Vercel Production.

**Current capability-map refinement:** The isolated Cloud & Infrastructure section now uses a blue technical field with a tighter three-part heading, compact six-card capability map, role-representative Lucide icons, clear numeric wayfinding, and restrained hover feedback. The original six editable topics and descriptions remain unchanged. The direct editor mirrors this structure with in-place text editing. Desktop and 390 px mobile screenshots show the section remains legible; the mobile grid collapses to one column. The first test run exposed a JSX transform issue in the new shared icon module; importing React resolved it, and TypeScript, all 16 Vitest files / 88 tests, and the production build now pass. This remains isolated on `feature/toolbox-devops-cloud`; no Production state changed.

**Current lifecycle-positioning refinement:** The user requested calmer contrast and positioning that reflects their work across the deployment lifecycle rather than a generic “every critical layer” statement. The capability map now uses a pale-blue field, dark readable headings, low-contrast technical grid, and light elevated cards. Its editable copy introduces six connected areas: Linux Foundations, Cloud & DevOps Delivery, Networking & Security, Data & Service Reliability, Development Services, and Hands-on Applied AI. Hydration upgrades only the exact untouched prior capability copy; saved custom content remains unchanged. Public and `/edit` desktop views were visually checked, and TypeScript, 16 Vitest files / 88 tests, and production build passed. The isolated feature remains unreleased.

**Approved capability headline:** The user selected “From infrastructure foundations to reliable delivery.” as the Cloud & Infrastructure heading. The default now uses this exact two-line wording. Hydration also recognizes the exact immediately prior lifecycle title and upgrades it only when its surrounding lifecycle description and six service entries remain untouched. Custom headings remain unchanged. The public and direct editor views were reviewed, while TypeScript, all 16 Vitest files / 88 tests, and production build passed. This update stays isolated from Production.

**Latest Production evidence:** The user-approved deployment-baseline UI reconciliation was merged and pushed to `deployment_versel` at `70a4e3f` on 2026-08-23. Vercel marked deployment `AdTSvGJVZcuBkhfC8WRUgDyi2ZEM` **Ready**. The public portfolio, direct `/edit` workspace, and tRPC API bridge were smoke-tested successfully at `https://portfolio-fedi-s-projects2.vercel.app/`. No database schema, Blob object, domain, secret, routing, API bridge, server runtime, migration, or environment-handling change was included.

**Latest stable-branch synchronization:** GitHub `main` now includes the approved public-motion prototype, lighter Experience technical theme, full Home/About/Selected Work refinement set, and the new design-navigation documentation through merge commit `ce7df13` (`merge: integrate approved public motion prototype`). The documentation commit on the feature branch is `c369166`. This did not create a Vercel Production deployment because Vercel Production tracks `deployment_versel`, not `main`.

**Motion and Home-composition prototype branch:** `feature/public-motion-prototype` contains the public-only motion language, the floating-specialty Home composition, editorial About layout, refined technology indicator, adaptive Selected Work behavior, and the lighter Experience timeline treatment. All work passed TypeScript, 84 Vitest tests, and a production build before the merge. On 2026-08-23 the user approved and the project merged this work, along with the new developer and AI navigation documentation, into `main` at `ce7df13`. This approval did **not** authorize a `deployment_versel` push or Vercel Production release; a separate immediate confirmation remains mandatory.

**Operations documentation:** `docs/release-and-media-operations.md` now provides the exact approved `main` → `deployment_versel` release sequence, first-run Compose instructions, a complete safe environment reference at `docs/environment.example`, and the local-to-Vercel lifecycle for images, PDFs, and SVGs. Docker is intentionally not installed in this managed sandbox, so the Compose file was statically formatted/validated; developers must run the documented `docker compose` commands on a Docker-enabled machine.

**API bridge documentation boundary:** `main` now mirrors the Vercel handbook and AI-context guidance so work can be planned safely there. The Vercel route configuration, generated CommonJS `api/[...path].js` function, Blob service integration, and Preview runtime behavior remain on `deployment_versel` until a deliberate release handoff occurs.

## Active priorities

| Priority | Status | Work item | Next safe action |
|---:|---|---|---|
| 1 | Complete | Merged the validated public-motion/design prototype and design-navigation documentation into stable `main` at `ce7df13`. | Preserve the handbook and AI release workflow; update them with future branch/service policy changes. |
| 2 | Paused by user | Migrate historical `/manus-storage` media references to an object-storage-compatible path. | Project 1 is verified in private Draft 2 version 4. Do not modify Draft 2 or Main until the user explicitly asks to resume. |
| 3 | Active | Review the isolated role-focused Toolbox redesign on `feature/toolbox-devops-cloud`. | Do not merge or push the Toolbox feature to `deployment_versel` until the user explicitly approves it; `/edit` remains intentionally unauthenticated. |
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
| `pnpm check` | Passed | TypeScript compiled with no errors after the corrected Selected Work containment repair. |
| `pnpm test` | Passed: 16 files, 88 tests | Includes Project image-panel add/replace/remove and collapsed-card metadata-containment regression coverage plus PostgreSQL persistence, Blob validation, API bridge, media upload preparation, public motion, Toolbox migration/editor parity, text formatting, and development-only pg-mem fallback coverage. |
| `pnpm build` | Passed | Vite output and server bundle built successfully after the corrected Selected Work containment repair; bundle-size warning is informational. |
| Preview API and editor | Passed | `GET /api/trpc/auth.me` returned a tRPC JSON response; `/edit` loaded the full direct workspace. |

## Working rules for the next agent

1. Read `README.md`, this file, and the task-specific AI context before changes.
2. Add new user-requested work to `todo.md` as unchecked items before implementation.
3. Keep public `Home.tsx` and `FullLivePreview.tsx` visually aligned for any editable public section.
4. Test data behavior with a disposable draft, not the public Main portfolio, unless the user explicitly asks to alter public content.
5. Run TypeScript, Vitest, and build validation before checkpointing substantive code changes.
6. Update this ledger, `decisions.md`, `issues.md`, and `change-log.md` as the work changes state.
7. Begin application changes from current `master`; after full validation and explicit approval, push `master` and verify the resulting Vercel Production deployment. Preserve `deployment_versel` as an unchanged rollback reference.
8. Use local Docker Compose only for isolated local development. Never place Vercel or Production credentials in `.env.local`, and never treat Compose as a Production deployment path.

## Preview deployment verification (2026-08-22)

The completed source is on GitHub branch `deployment_versel`; Vercel deploys it as a Preview without changing `main` or intentionally promoting Production. The current ready Preview is `https://portfolio-7ymbsxgog-fedi-s-projects2.vercel.app` from commit `91c8713`; the earlier API-packaging change in `54ef9eb` packages the Express/tRPC entry as `api/[...path].js` with an API-local CommonJS declaration, preventing the earlier SPA fallback and ESM dynamic-require failures.

On this Preview, `GET /api/trpc/auth.me` returned the expected tRPC JSON payload and `/edit` loaded the full workspace. A disposable `Draft 2` was created, saved as version 2 with the note `Vercel Preview PostgreSQL persistence verification`, reloaded, and then observed at version 3 after restore-as-new-version. Main remained marked Public and was not deliberately selected, deleted, or published during the verification. The Vercel Blob dashboard confirms the public `portfolio-blob` store is connected to Preview and Production and contains concrete `portfolio-editor/portrait/` JPEG objects.

The current documentation Preview is `https://portfolio-56o6c3vyb-fedi-s-projects2.vercel.app` from `3d8293c`. In its private Draft 2, a 3.78 MB PNG-encoded project source exceeded the JSON upload transport after Base64 expansion before reaching the function. The same 2304×1536 image was converted without cropping to a 236 kB JPEG derivative, uploaded successfully, and saved as Draft 2 version 4 with a clear migration note. Vercel logged HTTP 200 for both `assets.upload` and `portfolio.saveDraft`. See `preview-verification-evidence.md` for the source observations and remaining six legacy references.
