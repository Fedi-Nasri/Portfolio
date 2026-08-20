# Production Deployment Guide

## Current deployment status and compatibility

The repository contains a Vercel serverless adapter, but a production deployment of the **full editor** requires two managed services that are not optional for normal use:

1. A **MySQL-compatible SQL database** for named drafts and immutable history.
2. An object-storage implementation for images, logos, and certificate PDFs.

The existing source is written for **Drizzle MySQL (`mysql-core`) and `mysql2`**. Therefore, a plain PostgreSQL/Neon connection must not be placed into `DATABASE_URL` without a deliberate database-porting task. A PostgreSQL database can be used only after the Drizzle dialect, driver, schema imports/types, migration strategy, and potentially SQL assumptions are migrated to PostgreSQL.

> For the smallest production-risk path, provision a Vercel-connected **MySQL-compatible** database. If the selected Vercel marketplace option is Neon/PostgreSQL, treat it as an architecture change, not a configuration-only change.

The current upload implementation uses Forge/S3-style storage and a `/manus-storage` proxy. Vercel Blob is the intended Vercel-native replacement, but it still needs a provider adapter before production uploads can work without Forge.

## Vercel project topology

| Concern | Current repository configuration |
|---|---|
| Vercel project | Existing project: `portfolio` |
| Static build command | `pnpm exec vite build` |
| Install command | `pnpm install --frozen-lockfile` |
| Static output | `dist/public` |
| Serverless entry | `api/[...path].ts` |
| API app factory | `server/_core/app.ts` |
| Legacy storage rewrite | `/manus-storage/:path*` → `/api/manus-storage/:path*` |
| SPA fallback | Unmatched routes → `/index.html` |
| Critical public route | `/` |
| Critical direct editor route | `/edit` |

## Environment variables

Set production secrets in the Vercel project environment configuration. Do not put secret values in source code, exported ZIP files, or git commits.

| Variable | Scope | Current role | Production requirement |
|---|---|---|---|
| `DATABASE_URL` | Server only | MySQL/TiDB connection used by Drizzle and draft persistence. | **Required.** Must be a MySQL-compatible URL until the application is ported to PostgreSQL. |
| `JWT_SECRET` | Server only | Template session-cookie signing secret. | Supply a strong random value if OAuth/session routes remain mounted; direct `/edit` does not use it as access control. |
| `VITE_APP_ID` | Client-exposed build variable | Manus OAuth application identifier from the template. | Needed only if OAuth client behavior remains enabled. Vite embeds `VITE_*` values into client bundles. |
| `OAUTH_SERVER_URL` | Server/client configuration | Base URL used by Manus OAuth integration. | Required only when OAuth routes/login are actively used. |
| `VITE_OAUTH_PORTAL_URL` | Client-exposed build variable | Manus login portal location. | Optional for the current direct editor; required for restored OAuth UI. |
| `BUILT_IN_FORGE_API_URL` | Server only | Forge endpoint used by the current storage proxy/service. | Required only while retaining Forge storage. Remove the runtime dependency after a complete Blob adapter. |
| `BUILT_IN_FORGE_API_KEY` | Server only secret | Bearer token for current Forge storage calls. | Required only while retaining Forge storage. Never expose client-side. |
| `VITE_FRONTEND_FORGE_API_URL` | Client-exposed build variable | Frontend Forge endpoint configuration. | Needed only by client features that call Forge directly. Do not set when unused. |
| `VITE_FRONTEND_FORGE_API_KEY` | Client-exposed build variable | Frontend-scoped Forge access token. | Treat as public client configuration; do not use for privileged operations. |
| `OWNER_OPEN_ID` | Server only | Template owner identity. | Not an authorization control for the current direct editor; needed only by owner/OAuth template logic. |
| `OWNER_NAME` | Server only | Template owner display value. | Optional for the direct portfolio path; keep if template services reference it. |
| `BLOB_READ_WRITE_TOKEN` | Server only secret | Vercel Blob write credential when Blob adapter is introduced. | **Required after Blob migration.** Use Vercel’s connected Blob integration rather than hardcoding a token. |

## Recommended deployment sequence

### 1. Confirm the database strategy

Connect a Vercel-managed database that is compatible with the current MySQL implementation. Record its connection string in `DATABASE_URL` for Development, Preview, and Production as appropriate.

If only a PostgreSQL service such as Neon is available, stop before setting `DATABASE_URL`. Create a separate database-porting work item that changes:

| Porting area | Current implementation | PostgreSQL port needed |
|---|---|---|
| Drizzle schema imports | `drizzle-orm/mysql-core` | PostgreSQL table/column imports and equivalents. |
| Driver | `drizzle-orm/mysql2`, `mysql2` | A supported PostgreSQL driver and Drizzle adapter. |
| Drizzle config | `dialect: "mysql"` | `dialect: "postgresql"` plus appropriate credentials. |
| Generated migrations | MySQL DDL | New PostgreSQL-safe migration history. |
| Runtime validation | MySQL URL | PostgreSQL connection and preview/production smoke tests. |

### 2. Apply database migrations

Once `DATABASE_URL` points to the intended MySQL-compatible database, apply the project schema before deploying editor traffic.

```bash
pnpm drizzle-kit generate
# Inspect the generated SQL under drizzle/.
pnpm drizzle-kit migrate
```

The database must contain the `portfolio_drafts` and `portfolio_draft_versions` tables before `/edit` can support persistent data. Initial editor access creates the Main portfolio draft from the existing default/legacy content when no multi-draft rows exist.

### 3. Connect and adapt Vercel Blob

Create a Vercel Blob store in the Vercel project and allow Vercel to provide `BLOB_READ_WRITE_TOKEN`. Then implement a storage-provider change before relying on uploads:

1. Add `@vercel/blob` to the project dependencies.
2. Introduce a storage interface with a `put` operation that returns a stable public URL and, where needed, a key/path.
3. Implement the Vercel Blob adapter with the server-side `BLOB_READ_WRITE_TOKEN`.
4. Route `assets.upload` through the adapter rather than `server/storage.ts` Forge presigning.
5. Update asset retrieval so public URLs work directly or through a deliberate proxy.
6. Preserve existing database content URLs or provide a one-time migration/copy path for historical Forge assets.
7. Test portrait, project image, canvas image, company/provider logo, and certificate PDF upload from `/edit` in a preview deployment.

Do not expose `BLOB_READ_WRITE_TOKEN` to browser code. Browser uploads must remain mediated by the server mutation unless a carefully scoped client-upload flow is explicitly designed.

### 4. Configure Vercel project variables

Set the required variables in Vercel’s project settings for the intended environments. Apply `DATABASE_URL` first, then the storage variables that correspond to the adapter actually deployed. Avoid carrying dead Forge credentials into a Vercel-native Blob deployment unless legacy assets still require them.

### 5. Deploy and smoke-test

Deploy only after local checks pass:

```bash
pnpm check
pnpm test
pnpm build
```

After deployment, verify the following in the production URL:

| Test | Expected result |
|---|---|
| Public route `/` | Loads the selected public draft, including images and certificate interactions. |
| Direct editor `/edit` | Loads a draft library, version history, live preview, and save controls. |
| Save version | Creates the next version without replacing history. |
| Publish | Changes the selected public draft and refreshes the public page content. |
| Restore | Creates a new version from a prior snapshot while retaining newer versions. |
| Uploads | New media URL renders after saving/publishing and remains available after refresh. |
| ZIP export | Downloads a public-style package and includes locally packaged accessible certificate PDFs. |
| SPA reload | Reloading `/edit` returns the SPA rather than a Vercel 404. |

## Security hardening before broad launch

The current application intentionally has no authentication on `/edit`. This is the largest deployment risk, more significant than ordinary styling or data bugs.

| Option | Protection level | Implementation direction |
|---|---|---|
| Keep direct `/edit` public | None | Suitable only for a private/unlisted environment where content tampering is accepted. |
| Vercel deployment protection | Basic perimeter | Use Vercel project/deployment protection if it covers the editor path for intended users. |
| Edge/password gate | Moderate | Require a shared secret before serving `/edit`; do not hardcode it in client code. |
| OAuth/user roles | Stronger application control | Restore a server-side protected procedure and require a verified editor identity. |

Changing the public route is a product decision. Protecting only the UI while leaving tRPC write procedures public is not sufficient; enforce the control in the server router/service path too.

## Rollback and recovery

Create a project checkpoint before publishing. If a code release fails, roll back to a known good project checkpoint. Database migrations and uploaded files are external state; do not assume a code rollback reverses them.

For content recovery, use the editor’s immutable draft version history. For schema recovery, keep reviewed migration files, use additive migrations where possible, and take a database provider backup before destructive changes.

## References

[1]: https://vercel.com/docs/functions "Vercel Functions documentation"
[2]: https://vercel.com/docs/storage/vercel-blob "Vercel Blob documentation"
[3]: https://orm.drizzle.team/docs/kit-overview "Drizzle Kit documentation"

The deployment concepts above should be read together with the official guides for [Vercel Functions][1], [Vercel Blob][2], and [Drizzle Kit][3].
