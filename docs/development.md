# Development Environment Guide

## Prerequisites

Use a current Node.js 22 environment and pnpm. The project is configured as an ES module application and uses TypeScript, Vite, Express, tRPC, Drizzle, and Vitest.

| Requirement | Recommended version / value | Why it is needed |
|---|---|---|
| Node.js | 22.x | Matches the project’s current toolchain. |
| pnpm | 10.x | Lockfile and package-manager metadata are pnpm-based. |
| PostgreSQL database | PostgreSQL-compatible connection | The Drizzle schema uses `pg-core` and `pg`. |
| `DATABASE_URL` | PostgreSQL connection URL | Required for Drizzle commands and database-backed editor persistence. |
| Storage provider | Managed Forge/S3 in current development setup | Required for upload endpoints and asset retrieval. |

## Installation

Clone or open the project, then install locked dependencies.

```bash
cd /home/ubuntu/adapted-portfolio
pnpm install --frozen-lockfile
```

Do not commit a real `.env` file or secret values. Environment variables should be injected by the hosting environment or managed secure project settings.

## Environment setup

At minimum, set a PostgreSQL-compatible `DATABASE_URL` before running migrations or validating the persistent `/edit` workspace.

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require'
```

Connection-string details vary by provider. The implementation requires a valid **PostgreSQL** URL, not merely any SQL connection string.

For an isolated PostgreSQL database managed on your own computer, use the optional [Local Docker Compose development](./local-docker-development.md) workflow. It supplies a container-only local `DATABASE_URL` and must not be pointed at Vercel or any Production database.

For the complete variable reference and production responsibilities, read [Production deployment](./production-deployment.md#environment-variables).

## Database workflow

The Drizzle configuration uses `drizzle/schema.ts`, writes PostgreSQL migration output under `drizzle/postgres/`, and expects a PostgreSQL connection. `drizzle.config.ts` throws early when `DATABASE_URL` is absent.

| Task | Command | Notes |
|---|---|---|
| Generate migration SQL | `pnpm drizzle-kit generate` | Inspect generated SQL before applying it. |
| Apply generated migrations | `pnpm drizzle-kit migrate` | Requires a reachable `DATABASE_URL`. |
| Generate + apply | `pnpm db:push` | Project convenience command; use only after reviewing schema/migration intent. |
| Type-check the schema/API/UI | `pnpm check` | Runs TypeScript with no emitted files. |

For a production schema change, follow this order: update `drizzle/schema.ts`, generate the migration, inspect the new SQL, apply it to the intended database, then run the application checks. Keep production migrations additive and backward-compatible when possible, because stored `contentJson` snapshots may span older editor versions.

## Run locally

```bash
pnpm dev
```

The development command runs the Express entry point under `tsx watch`. It serves the Vite-backed SPA and the tRPC API together. Open:

| URL | Purpose |
|---|---|
| `/` | Public portfolio built from the selected public draft. |
| `/edit` | Direct-access editor workspace. |
| `/api/trpc` | tRPC transport endpoint; use typed client hooks instead of manually calling it. |

The first `/edit` request seeds `Main portfolio` only when no multi-draft records exist. Use a disposable newly-created draft when testing editor changes so production-like public history is not polluted.

## Development loop

1. Read the relevant documentation and source-of-truth file before changing a feature.
2. Add an unchecked task to `todo.md` before implementation.
3. Make the smallest coherent change across shared types, public render, editor preview, state helpers, export, and tests.
4. Run `pnpm check`, targeted tests, and then `pnpm test`.
5. Visually verify `/` and `/edit` at desktop and mobile widths.
6. Mark completed `todo.md` items as checked and save a checkpoint.

## Test suite

Run the complete suite with:

```bash
pnpm test
```

The project has targeted regression coverage for editor persistence, multi-draft flows, restore/version-note behavior, canvas behavior, project image behavior, and export rendering. New functionality should add a test where it changes a data invariant, a persistence path, or a serialized export contract.

| Test need | Suggested test location |
|---|---|
| Draft persistence, restore, publication | `server/portfolio.editor-flow.test.ts` or related `server/*.test.ts` |
| Shared content defaults and canvas data | Tests close to `shared/portfolio.ts` or existing canvas tests |
| Export output and packaged assets | `client/src/lib/*test.ts` patterns |
| Pure editing transforms | Tests close to `client/src/lib/editorContent.ts` |

## Production build

```bash
pnpm build
```

The current local build does two things: Vite emits the frontend to `dist/public`, then esbuild bundles `server/_core/index.ts` to `dist/index.js`. For Vercel, `vercel.json` uses Vite’s static output and the `api/` function separately; read [Production deployment](./production-deployment.md) before assuming the local `start` command matches serverless behavior.

## Debugging guide

| Symptom | First checks |
|---|---|
| `/edit` cannot load content | Verify `DATABASE_URL`, database reachability, and that migrations have been applied. Review server logs for the portfolio service error. |
| Save/publish fails | Confirm schema contains `portfolio_drafts` and `portfolio_draft_versions`; verify the version tables are writable. |
| Upload fails | Confirm current storage environment variables and storage proxy configuration. On Vercel, confirm the planned Blob adapter has been completed. |
| Public page shows unexpected data | Inspect which draft is marked `isPublic`; public rendering uses that draft’s newest version. |
| Changes disappear | Check whether the editor was reset or a save mutation completed; browser-state changes are intentionally unsaved until Save or Publish. |
| `/edit` layout differs from `/` | Compare `Home.tsx`, `FullLivePreview.tsx`, and the shared CSS before adding editor-only layout patches. |
| New route returns 404 on Vercel | Confirm SPA rewrite behavior and whether it belongs under `/api/*` or client-side Wouter routing. |

## File and asset hygiene

Do not place large images, PDFs, or videos inside `client/public` or `client/src/assets`. Keep original working assets outside the project directory and use the configured object-storage upload path. The portfolio stores URLs in `PortfolioContent`; it does not store binary files in database columns.

When adding a new upload category, verify all five stages: browser file selection, tRPC payload validation, server storage write, draft field update, and public/export rendering.
