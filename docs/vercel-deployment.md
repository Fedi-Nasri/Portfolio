# Vercel Deployment for Beginners

> **Current operational documentation:** Use the [Vercel Deployment Handbook](./vercel-deployment/README.md) first. It defines the current `main` to `deployment_versel` workflow, validated API/Blob architecture, and service-change procedures. This single-file guide remains as supporting background and may describe earlier deployment states.

This guide explains how to deploy **the full Fedi Nasri portfolio application** to Vercel, including the public site, the direct `/edit` workspace, draft history, image uploads, certificate PDFs, and static ZIP export.

> **Current status:** The approved `deployment_versel` branch has a working **Preview** deployment. Its direct editor, PostgreSQL draft persistence, and new Blob uploads have been verified. Production has not been promoted or reconfigured in this verification cycle; do not treat this guide as permission to change production settings or services without a clear new user request.

## Quick access links and exact project settings

| Item | URL or value | Use it for |
|---|---|---|
| Existing Vercel project | `https://vercel.com/fedi-s-projects2/portfolio` | Open the project overview, deployments, logs, and domains. |
| Storage | `https://vercel.com/fedi-s-projects2/portfolio/stores` | Create/connect Blob and inspect any connected database integration. |
| Environment variables | `https://vercel.com/fedi-s-projects2/portfolio/settings/environment-variables` | Add server-side secrets and scope each one to Preview or Production. |
| Existing production domain | `https://portfolio-theta-jet-90.vercel.app` | Treat this as the intended domain only; do not regard the editor as production-ready until database and storage compatibility work is complete. |
| Root directory | Project root (`.`) | The directory containing `package.json`, `vercel.json`, `api/`, and `server/`. |
| Install command | `pnpm install --frozen-lockfile` | Already defined by `vercel.json`; locks dependency versions for consistent builds. |
| Build command | `pnpm exec vite build` | Defined by `vercel.json`; builds the React public application. |
| Output directory | `dist/public` | Already defined by `vercel.json`; Vercel serves the built single-page application from here. |

> Do **not** remove the existing `vercel.json` rewrites. They keep `/edit` working after a page refresh, route `/api/*` to the bundled serverless function, and retain the temporary legacy `/manus-storage/*` compatibility rewrite.

## 1. What Vercel is doing for this project

Vercel hosts two parts of this application. The first is the **frontend**: the React pages that visitors see at `/` and editors use at `/edit`. The second is the **backend**: server code that handles the tRPC API, reads and saves draft versions, and receives uploads. Vercel calls the backend code a **Function**. Functions run only when a request arrives, so there is no server process for you to manage continuously.[1]

```mermaid
flowchart LR
  Visitor[Visitor or editor browser] --> Frontend[React single-page application]
  Frontend --> API[Vercel serverless API adapter]
  API --> DraftDB[(SQL database: drafts and history)]
  API --> Blob[(Object storage: images and PDFs)]
  Blob --> Frontend
```

The following table explains the role of each service in plain language.

| Service | What it stores or does | Why this portfolio needs it |
|---|---|---|
| **Vercel Project** | Builds and serves the application. | It gives the public portfolio and `/edit` route a live web address. |
| **Vercel Function** | Runs the Express/tRPC backend when the browser calls `/api/*`. | It saves drafts, creates version history, chooses the public draft, and mediates uploads. |
| **SQL database** | Stores draft names, public-draft selection, version notes, timestamps, and full `PortfolioContent` JSON snapshots. | Without it, `/edit` cannot keep changes after a refresh or support history. |
| **Object storage** | Stores portraits, project images, provider logos, certificate previews, and certificate PDFs. | Large files do not belong inside database rows; the database stores their URLs instead. |
| **Environment variables** | Secure configuration values, such as database credentials. | They keep secrets out of the Git repository and let Preview/Production use different settings.[2] |

## 2. Understand the current project before deploying

The repository includes a Vercel-oriented structure that is verified on the current Preview. Production remains a separate, explicit decision because the direct `/edit` route is unauthenticated and historical media has not yet been migrated.

| Project item | Current value / file | Why it matters |
|---|---|---|
| Existing Vercel project | `portfolio` | Reuse this project if it remains the intended Vercel destination. |
| Public frontend build | `dist/public` | This is the folder Vercel serves for the React single-page application. |
| API source and artifact | `server/vercel-api-handler.ts` and generated `api/[...path].js` | The generated CommonJS artifact is the Vercel-recognized function that serves `/api/*`; rebuild it after server/API changes. |
| Routing configuration | `vercel.json` | Keeps `/edit` working after refresh and rewrites current storage proxy requests. |
| Draft data schema | `drizzle/schema.ts` | Defines the tables needed by the editor and version history. |
| Current storage implementation | `server/assets.ts`, `@vercel/blob`, and `portfolio_media_assets` | New editor uploads store object bytes in Blob and metadata in PostgreSQL. The legacy proxy remains only for unresolved historical `/manus-storage` references. |

> **PostgreSQL compatibility:** the application uses provider-neutral PostgreSQL packages and Drizzle’s PostgreSQL schema dialect. Neon is the connected Vercel host, but the code does not require Neon-specific APIs. Use any compatible PostgreSQL `DATABASE_URL`.

## 3. Requirements checklist

Before starting any deployment, make sure these requirements are satisfied.

| Requirement | What a beginner should check | Why it is required |
|---|---|---|
| Access to the Vercel project | You can open the `portfolio` project and edit its Storage and Environment Variables settings. | Without access, you cannot attach services or configure the application. |
| Clean local build | `pnpm check`, `pnpm test`, and `pnpm build` pass. | Vercel builds the same code. A local failure normally becomes a deployment failure. |
| Compatible SQL configuration | A PostgreSQL-compatible `DATABASE_URL` is connected for the target Vercel environments. | The editor’s draft history depends on the PostgreSQL driver, schema, and host agreeing. |
| Storage implementation decision | Keep the deployed Blob handler for new uploads and separately plan historical-media migration. | The Blob adapter is deployed, but existing `/manus-storage` URLs do not become Blob URLs automatically. |
| Environment-variable plan | You know which values belong to Production, Preview, and Development. | Vercel scopes variables by environment; a change affects new deployments, not old ones.[2] |
| Deployment access-control decision | You understand that `/edit` currently has no authentication. | A public deployment could allow anyone who reaches `/edit` to change portfolio content. |

## 4. PostgreSQL database status

The repository has completed its database port to **provider-neutral PostgreSQL**. Its Drizzle schema uses `pg-core`, runtime persistence uses `pg` through `drizzle-orm/node-postgres`, and the regression suite uses in-memory PostgreSQL support. The source has no Neon-specific database dependency.

The currently connected Vercel host is a Neon PostgreSQL database. Its initial additive schema and the later `portfolio_media_assets` metadata table were applied and verified on 2026-08-22. The editor then completed a disposable Preview draft workflow, including a save with a descriptive version note and restore-as-new-version. Do not copy or disclose `DATABASE_URL`.

> A database is not only a URL. The application code, ORM dialect, driver, migrations, and tests must all agree on the same database type. That agreement is now PostgreSQL; a different PostgreSQL provider can be substituted later without changing application database code.

## 5. Create the database and apply the schema

When Vercel preview work is explicitly approved, use this sequence:

1. Confirm the connected PostgreSQL host and its server-only `DATABASE_URL` remain scoped to the intended Preview and Production environments.
2. Confirm the verified initial schema remains present; future schema changes must be generated, reviewed, and applied as separate additive migrations.
3. Deploy a **Preview** build only after the user approves deployment activity.
4. Open `/edit` in that Preview deployment and confirm that the draft library, saving, history, publishing, restoration, and public-content reads work against PostgreSQL.

The current migration commands are:

```bash
pnpm drizzle-kit generate
# Read the generated SQL in drizzle/ before continuing.
pnpm drizzle-kit migrate
```

The essential editor tables are `portfolio_drafts` and `portfolio_draft_versions`. The first creates named workspaces; the second stores immutable JSON snapshots. The connected host already contains the initial schema; do not point a different production database at the editor without applying the equivalent reviewed schema first.

## 6. Set up file storage for images and certificate PDFs

Vercel Blob is object storage: a managed place for files such as images, documents, and videos. Public Blob stores return URLs that browsers can read directly; private stores require server-mediated reads. The access mode is chosen when the store is created and cannot later be changed.[3]

For this public portfolio, images and certificate PDFs are normally intended to be displayed or downloaded by visitors. A **public Blob store** is the straightforward fit, unless a future requirement makes certificates private.

| Blob setup step | Why it is necessary |
|---|---|
| Create a Blob store close to the intended users/functions. | A nearby region reduces upload latency; the region cannot later be changed.[3] |
| Connect the Blob store to the `portfolio` project. | Vercel then provides the project configuration the Blob SDK needs. |
| Keep the `@vercel/blob` server-side adapter deployed. | New uploads now call the deployed server handler, which uses a random-suffix object key and saves metadata after Blob writes. |
| Keep upload calls server-mediated. | The browser should not receive privileged write credentials. |
| Use unique filenames or random suffixes. | Immutable asset URLs avoid stale cached media after updates.[3] |
| Preserve old asset URLs or copy historical assets. | Existing drafts still refer to `/manus-storage/*` URLs and must be migrated separately. |

Vercel-connected Blob projects commonly use automatic short-lived OIDC credentials such as `VERCEL_OIDC_TOKEN` and `BLOB_STORE_ID`; the SDK can read them automatically. `BLOB_READ_WRITE_TOKEN` is primarily needed when code runs outside Vercel or for particular browser-upload token flows.[3]

## 7. Environment variables: what to add and why

Add variables in **Vercel → Project → Settings → Environment Variables**. Values configured there are encrypted at rest, but users with project access can view/manage them, so share project access carefully.[2]

| Variable | Add now? | Who can read it | What it does |
|---|---|---|---|
| `DATABASE_URL` | **Yes, after selecting a compatible database.** | Server only. | Connects Drizzle and the draft/version service to SQL. |
| `BLOB_STORE_ID`, `VERCEL_OIDC_TOKEN` | Added automatically after a Vercel Blob store is connected. | Server/build environment. | Lets a Vercel-hosted Blob SDK authenticate without a manually copied long-lived token.[3] |
| `BLOB_READ_WRITE_TOKEN` | Only if the chosen Blob workflow needs it. | Server only secret. | Alternative long-lived Blob write credential; never expose it to browser code.[3] |
| `JWT_SECRET` | Recommended if template session/cookie routes remain mounted. | Server only secret. | Signs session cookies; it does **not** protect `/edit` in the current direct-access design. |
| `BUILT_IN_FORGE_API_URL` | Only while the existing Forge storage proxy remains in use. | Server only. | Current Forge storage endpoint configuration. |
| `BUILT_IN_FORGE_API_KEY` | Only while the existing Forge storage proxy remains in use. | Server only secret. | Current Forge storage authorization; never expose it. |
| `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` | Only when OAuth functionality is still needed. | `VITE_*` variables are embedded into the client build. | Template OAuth configuration, not editor access control. |
| `OWNER_OPEN_ID`, `OWNER_NAME` | Only when template/owner services reference them. | Server only. | Template owner identity context, not a security boundary. |

### Preview versus Production

Vercel separates **Development**, **Preview**, and **Production** variables. Preview deployments are for testing changes without changing the live public site; Production is for the user-facing domain.[4] Use a separate test database if you want to safely exercise draft changes before release.

| Environment | Recommended use for this project |
|---|---|
| Development | Local work with local or managed-development configuration. |
| Preview | Test `/edit`, draft saving, uploads, images, PDFs, and ZIP export before making the site live. |
| Production | The real public portfolio and the editor data that must persist. |

## 8. Deploy in a safe order

Vercel can deploy from a connected Git repository, its dashboard, or the Vercel CLI. A Git connection is easiest for ongoing changes because commits automatically create deployments; Vercel also provides a unique URL for each deployment so you can test it before promotion.[4]

Use the following order after all prerequisite code work is finished.

1. **Build locally.** Run `pnpm check`, `pnpm test`, and `pnpm build`.
2. **Create a project checkpoint.** This gives the project a known restore point before production changes.
3. **Configure database and storage.** Do not skip compatibility and adapter work described above.
4. **Set environment variables.** Apply the right values to Preview first, then Production after testing.
5. **Create a Preview deployment.** Use it to test the full editor without changing the production portfolio.
6. **Read build and runtime logs.** Vercel’s deployment overview shows framework/build information, while the Functions/Observability views show backend activity and errors.[1]
7. **Promote or deploy to Production only after the checklist passes.**

If you use the Vercel CLI yourself, the official production command is:

```bash
pnpm i -g vercel
vercel --prod
```

The CLI first links the local directory to the Vercel project and then creates the production deployment.[4] Do not run it until the deployment prerequisites and user approval are in place.

## 9. Test the live deployment

Run these checks in a Preview deployment first. Repeat critical checks in Production only after the user explicitly authorizes a production change.

| Test | What should happen | If it fails, start here |
|---|---|---|
| Open `/` | The selected public draft renders. New Blob-backed media can render directly; historical `/manus-storage` media may still require migration. | Build output, public draft selection, asset URL access. |
| Reload `/edit` | The direct editor route returns the SPA and the API request reaches the CommonJS function. | `vercel.json` API and SPA rewrites, `api/[...path].js`. |
| Save a version | A new draft-version entry appears without overwriting earlier history. | `DATABASE_URL`, migrations, `server/portfolio.ts`, tRPC logs. The Preview workflow has verified this on a private draft. |
| Publish a draft | The public page changes to the selected draft. | Public flag transaction and query refresh. |
| Restore a version | A new version is created from an older snapshot. | Version service logic and database writes. |
| Upload portrait/project/certificate PDF | The server returns a public Blob URL, the metadata record is written in PostgreSQL, and the file remains visible after refresh. | Blob adapter, server upload procedure, storage access mode. The Preview store already contains new portrait and certificate-PDF category objects. |
| Download ZIP export | Archive contains public-style page and available local certificate PDF assets. | Export utilities and network access to stored PDFs. |
| Inspect logs | No unexplained function/database/storage errors appear. | Vercel deployment and runtime logs.[1] |

## 10. Security decision before a broad public launch

The biggest non-technical deployment question is editor access. The public page at `/` is intended for everyone. The `/edit` route is currently direct-access by user choice. That means deploying it publicly can give an untrusted visitor the ability to change the portfolio.

| Option | Beginner explanation | Protection level |
|---|---|---|
| Keep `/edit` open | Anyone who finds the link can use the editor. | None. |
| Use Vercel deployment protection | Put a basic login/password-style gate around the deployment or preview. | Basic perimeter. |
| Add a route gate | Require a secret before loading `/edit`. | Better, but server write procedures also need protection. |
| Restore application authentication | Verify an editor identity and enforce authorization in tRPC/server code. | Strongest of these options. |

Protecting only the visible editor page is not enough. Any real security design must also prevent unauthorised calls to the write procedures at `/api/trpc`.

## 11. How to recover when something goes wrong

Code, database data, and files are different types of state. A Vercel rollback can restore an older code deployment, but it does not automatically undo database migrations or remove uploaded files. Keep migrations reviewed and additive where possible; use the editor’s immutable version history for content recovery; and keep a backup plan for any database before destructive schema changes.

| Problem | First recovery action |
|---|---|
| New code deployment is broken | Roll back to a known good project checkpoint or Vercel deployment after reviewing logs. |
| Public content is wrong | Use `/edit` draft history and restore the right snapshot as a new version. |
| Database migration is wrong | Stop traffic-changing work, inspect the migration, and restore/provider-recover using the database backup plan. |
| New uploads do not display | Check storage access mode, server logs, stored URL, and whether the Blob adapter is deployed. |

## Next reading

Read [`production-deployment.md`](./production-deployment.md) for the implementation-level deployment runbook and PostgreSQL/Blob requirements. Read [`../ai-context/technical-architecture.md`](../ai-context/technical-architecture.md) for the full project relationship diagram and [`../ai-context/issues.md`](../ai-context/issues.md) for active deployment risks.

## References

[1]: https://vercel.com/docs/functions "Vercel Functions documentation"
[2]: https://vercel.com/docs/projects/environment-variables "Vercel environment variables documentation"
[3]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
[4]: https://vercel.com/docs/deployments "Vercel deployments documentation"
