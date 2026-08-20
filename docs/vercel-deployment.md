# Vercel Deployment for Beginners

This guide explains how to deploy **the full Fedi Nasri portfolio application** to Vercel, including the public site, the direct `/edit` workspace, draft history, image uploads, certificate PDFs, and static ZIP export.

> **Current status:** Vercel work is **paused by user request**. This document is a preparation and learning guide. Do not treat it as permission to deploy, change cloud services, accept terms, or add production secrets. Resume those actions only after a clear new request.

## 1. What Vercel is doing for this project

Vercel hosts two parts of this application. The first is the **frontend**: the React pages that visitors see at `/` and editors use at `/edit`. The second is the **backend**: server code that handles the tRPC API, reads and saves draft versions, and receives uploads. Vercel calls the backend code a **Function**. Functions run only when a request arrives, so there is no server process for you to manage continuously.[1]

```mermaid
flowchart LR
  Visitor[Visitor or editor browser] --> Frontend[React SPA\n/ and /edit]
  Frontend --> API[Vercel Function\n/api/[...path].ts]
  API --> DraftDB[(SQL database\ndrafts and history)]
  API --> Blob[(Object storage\nimages and PDFs)]
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

The repository already includes a Vercel-oriented structure. It is not yet sufficient for a full editor deployment until the database and file-storage compatibility work is completed.

| Project item | Current value / file | Why it matters |
|---|---|---|
| Existing Vercel project | `portfolio` | Reuse this project if it remains the intended Vercel destination. |
| Public frontend build | `dist/public` | This is the folder Vercel serves for the React single-page application. |
| API entry point | `api/[...path].ts` | Sends `/api/*` requests to the shared Express application. |
| Shared server factory | `server/_core/app.ts` | Prevents Vercel API behavior from drifting away from local development. |
| Routing configuration | `vercel.json` | Keeps `/edit` working after refresh and rewrites current storage proxy requests. |
| Draft data schema | `drizzle/schema.ts` | Defines the tables needed by the editor and version history. |
| Current storage implementation | `server/storage.ts`, `server/_core/storageProxy.ts` | Uses Forge/S3-style behavior today; a Vercel Blob adapter still needs to be written. |

> **Important compatibility warning:** the current database code uses **MySQL/TiDB** packages and Drizzle’s MySQL schema dialect. A Neon database is PostgreSQL. Do not simply paste a Neon PostgreSQL URL into `DATABASE_URL`; the code needs a planned database-porting change first.

## 3. Requirements checklist

Before starting any deployment, make sure these requirements are satisfied.

| Requirement | What a beginner should check | Why it is required |
|---|---|---|
| Access to the Vercel project | You can open the `portfolio` project and edit its Storage and Environment Variables settings. | Without access, you cannot attach services or configure the application. |
| Clean local build | `pnpm check`, `pnpm test`, and `pnpm build` pass. | Vercel builds the same code. A local failure normally becomes a deployment failure. |
| Compatible SQL decision | A MySQL-compatible service is available **or** a PostgreSQL port has been designed and completed. | The editor’s draft history depends on a working SQL driver and schema dialect. |
| Storage implementation decision | Keep current Forge storage temporarily, or complete the Vercel Blob adapter first. | The current upload code does not automatically become Blob-compatible just because a Blob store exists. |
| Environment-variable plan | You know which values belong to Production, Preview, and Development. | Vercel scopes variables by environment; a change affects new deployments, not old ones.[2] |
| Deployment access-control decision | You understand that `/edit` currently has no authentication. | A public deployment could allow anyone who reaches `/edit` to change portfolio content. |

## 4. Choose the database correctly

### Recommended path: MySQL-compatible database

The lowest-risk route is to connect a **MySQL-compatible** database because the current app is already built for MySQL/TiDB. Once connected, its secure connection string becomes `DATABASE_URL`. This avoids a large code conversion.

### Alternative path: Neon PostgreSQL

Neon is a valid Vercel-connected relational service, but it is **not a drop-in configuration change** for this repository. Choose this path only after creating a separate implementation task for the port.

| Current MySQL code | PostgreSQL port needed before Neon can be used |
|---|---|
| `drizzle-orm/mysql-core` schema imports | Convert table and column definitions to PostgreSQL equivalents. |
| `drizzle-orm/mysql2` and `mysql2` | Install and configure a supported PostgreSQL/Neon driver and Drizzle adapter. |
| `dialect: "mysql"` in Drizzle configuration | Change to PostgreSQL configuration and regenerate safe migrations. |
| MySQL migration history | Generate and review new PostgreSQL DDL for the new database. |
| MySQL integration tests | Run persistence, preview, and production smoke tests against PostgreSQL. |

> A database is not only a URL. The application code, ORM dialect, driver, migrations, and tests must all agree on the same database type.

## 5. Create the database and apply the schema

When Vercel work is explicitly resumed and the compatible provider is selected, use this sequence:

1. Open **Vercel → Project → Storage** and create or connect the selected SQL service.
2. Connect it to the `portfolio` Vercel project for the required environments.
3. Confirm Vercel adds or exposes the provider’s connection string securely.
4. Set that value as server-only `DATABASE_URL` for Preview and Production, after confirming the database type matches the application code.
5. Run the Drizzle migration workflow against that database.
6. Open `/edit` in a Preview deployment first and confirm that the draft library, saving, history, publishing, and restoration work.

The current migration commands are:

```bash
pnpm drizzle-kit generate
# Read the generated SQL in drizzle/ before continuing.
pnpm drizzle-kit migrate
```

The essential editor tables are `portfolio_drafts` and `portfolio_draft_versions`. The first creates named workspaces; the second stores immutable JSON snapshots. Do not point a production editor at an empty database without applying the schema first.

## 6. Set up file storage for images and certificate PDFs

Vercel Blob is object storage: a managed place for files such as images, documents, and videos. Public Blob stores return URLs that browsers can read directly; private stores require server-mediated reads. The access mode is chosen when the store is created and cannot later be changed.[3]

For this public portfolio, images and certificate PDFs are normally intended to be displayed or downloaded by visitors. A **public Blob store** is the straightforward fit, unless a future requirement makes certificates private.

| Blob setup step | Why it is necessary |
|---|---|
| Create a Blob store close to the intended users/functions. | A nearby region reduces upload latency; the region cannot later be changed.[3] |
| Connect the Blob store to the `portfolio` project. | Vercel then provides the project configuration the Blob SDK needs. |
| Add `@vercel/blob` to the codebase and implement a server-side adapter. | Creating a store alone does not reroute the current Forge/S3 upload code. |
| Keep upload calls server-mediated. | The browser should not receive privileged write credentials. |
| Use unique filenames or random suffixes. | Immutable asset URLs avoid stale cached media after updates.[3] |
| Preserve old asset URLs or copy historical assets. | Existing drafts may still refer to `/manus-storage/*` URLs. |

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

Run these checks in a Preview deployment first and repeat the critical ones in Production.

| Test | What should happen | If it fails, start here |
|---|---|---|
| Open `/` | The selected public draft renders with hero image, projects, certificates, and contact links. | Build output, public draft selection, asset URL access. |
| Reload `/edit` | The direct editor route returns the SPA rather than 404. | `vercel.json` SPA fallback. |
| Save a version | A new draft-version entry appears without overwriting earlier history. | `DATABASE_URL`, migrations, `server/portfolio.ts`, tRPC logs. |
| Publish a draft | The public page changes to the selected draft. | Public flag transaction and query refresh. |
| Restore a version | A new version is created from an older snapshot. | Version service logic and database writes. |
| Upload portrait/project/certificate PDF | URL is stored, file remains visible after refresh, and certificate viewer can open it. | Blob adapter, server upload procedure, storage access mode. |
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

Read [`production-deployment.md`](./production-deployment.md) for the implementation-level deployment runbook, including the MySQL-to-PostgreSQL port matrix. Read [`../ai-context/technical-architecture.md`](../ai-context/technical-architecture.md) for the full project relationship diagram and [`../ai-context/issues.md`](../ai-context/issues.md) for active deployment risks.

## References

[1]: https://vercel.com/docs/functions "Vercel Functions documentation"
[2]: https://vercel.com/docs/projects/environment-variables "Vercel environment variables documentation"
[3]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
[4]: https://vercel.com/docs/deployments "Vercel deployments documentation"
