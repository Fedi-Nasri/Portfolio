# Development and Quality Context

## Local environment

| Requirement | Current expectation |
|---|---|
| Node.js | Node 22.x compatible environment. |
| Package manager | pnpm 10.x. |
| Database | Provider-neutral PostgreSQL; requires a PostgreSQL `DATABASE_URL` to persist drafts/migrate outside the development-only fallback. |
| Storage | Vercel Blob for new uploads, PostgreSQL metadata, and a legacy Manus-storage compatibility path for unresolved historic references. |
| Dev command | `pnpm dev` runs the Express/Vite development entry. |

Never commit `.env` files or credentials. Environment configuration is managed through secure project/hosting settings. Only document variable names and purposes.

## Core commands

| Goal | Command | Expected use |
|---|---|---|
| Install exact deps | `pnpm install --frozen-lockfile` | Use after clean checkout or lockfile changes. |
| Start development | `pnpm dev` | Local public and `/edit` verification. |
| Type-check | `pnpm check` | Required before a substantial checkpoint. |
| Run full test suite | `pnpm test` | Required before a substantial checkpoint. |
| Production build | `pnpm build` | Required before a substantial checkpoint. |
| Generate migration | `pnpm drizzle-kit generate` | Review generated SQL before applying. |
| Apply migrations | `pnpm drizzle-kit migrate` | Requires correct database URL. |
| Generate + apply | `pnpm db:push` | Use only after schema/migration review. |
| Generate Vercel API artifact | `pnpm build:vercel-api` | Required after server/API changes before moving a candidate to `deployment_versel`. |

## Current quality baseline

The latest full validation passed TypeScript, **12 Vitest files / 76 tests**, and the production build. It includes PostgreSQL persistence, Blob validation, Vercel API bridge, and development-only PostgreSQL fallback coverage. The build emits a chunk-size warning for a JavaScript asset above Vite’s default 500 kB threshold; this is a performance follow-up, not a build failure.

## Tests and their meaning

| Area | Representative coverage | Why it matters |
|---|---|---|
| Editor content transforms | `client/src/lib/editorContent.test.ts` | Protects immutable list/order/section change behavior. |
| Live preview | `client/src/pages/FullLivePreview.test.tsx` | Protects editor controls, public-style rendering, and section workflows. |
| Public page | `client/src/pages/Home.test.tsx` | Protects core visible portfolio behavior. |
| Draft persistence | `server/portfolio.editor-flow.test.ts`, `portfolio.direct.test.ts` | Protects multi-draft creation/save/publish/restore semantics. |
| Assets | `server/assets.test.ts` | Protects supported upload flow. |
| Canvas and crop controls | Component tests | Protects resize/group/preset and image-crop behavior. |
| Export | `client/src/lib/portfolioExport.test.ts` | Protects HTML/ZIP output and certificate asset packaging. |

## Required implementation sequence

1. Read `ai-context/`, including `branch-and-release-workflow.md`, and the relevant source files.
2. Add task-specific unchecked items to `todo.md` before editing.
3. Change the shared contract before consumers when adding a content field.
4. Keep public rendering, editor preview, editor controls, persistence, export, and tests in sync.
5. Verify UI with desktop and mobile screenshots if layout changes.
6. Run checks appropriate to the change; default to `pnpm check && pnpm test && pnpm build`.
7. Mark completed items in `todo.md`.
8. Update `ai-context/` records and then save a checkpoint.
9. Build stable work on `main`; move only a checkpointed, validated candidate to `deployment_versel`, then verify Vercel Preview before any distinct Production decision.

## Debugging order

| Symptom | Investigation order |
|---|---|
| `/edit` fails to load | `DATABASE_URL`, migration state, `server/portfolio.ts` errors, tRPC router input. |
| Editor change does not persist | Browser unsaved state, save mutation, draft key, version history, DB write. |
| Public site shows unexpected content | Find draft marked public, inspect newest version, invalidate/query refresh. |
| Upload fails | Browser file/Base64, upload category, tRPC input, Blob token/service availability, metadata insert, and legacy storage path. |
| Public/editor mismatch | Compare `Home.tsx`, `FullLivePreview.tsx`, and shared CSS; avoid editor-only visual drift. |
| Vercel route 404 or API returns HTML | Confirm API-first route order in `vercel.json`, regenerate `api/[...path].js`, and verify the CommonJS API directory metadata. |
| Build/server runtime error | Inspect `.manus-logs/` via terminal tools; use relevant tests and production logs once deployed. |

## Checkpoint protocol

Before saving a checkpoint, read the complete `todo.md` and verify requested completed work is marked `[x]`. The checkpoint note must name the user-facing behavior, data impact, validation performed, and any remaining known limitation. Do not call a feature bug-free; report what was verified and what remains pending.
