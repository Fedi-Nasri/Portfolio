# Release and Media Operations Guide

This guide is the practical operating procedure for moving a tested portfolio change from local development to Vercel and for handling portfolio images, PDFs, and SVGs safely. It supplements the [local Compose guide](./local-docker-development.md), the [branch workflow](./development-branch-workflow.md), and the [Vercel release runbook](./vercel-deployment/02-release-runbook.md).

> **Production boundary:** `master` is the active development and Vercel Production Branch. A push to `master` creates a Production deployment. Do not make that push until the user has explicitly approved the exact release. `deployment_versel` remains unchanged as the historical rollback reference.

## 1. Exact release procedure: validated `master` to Vercel Production

Write and test a feature from the current `master` baseline. An optional short-lived feature branch must be created from `master` and merged back after review; do **not** recreate edits in `deployment_versel`. When the feature is ready, follow this sequence in order.

| Step | Command or action | Purpose |
|---:|---|---|
| 1 | `git switch master` | Return to the active development and release branch. |
| 2 | `git pull --ff-only origin master` | Ensure local `master` is current without creating an unintended merge. |
| 3 | `pnpm install --frozen-lockfile` | Install the exact lockfile-pinned dependencies. |
| 4 | `pnpm build:vercel-api` **if server/API code changed** | Regenerate `api/[...path].js` from `server/vercel-api-handler.ts`. |
| 5 | `pnpm check && pnpm test && pnpm build` | Run the required TypeScript, regression, and build gates. |
| 6 | `git status --short` | Confirm only the reviewed files are involved. |
| 7 | `git log --oneline origin/master..HEAD` and `git diff --stat origin/master...HEAD` | Review the exact commits and files that would enter Production. |
| 8 | Create a Manus checkpoint and update `todo.md`, `docs/`, and `ai-context/` | Preserve a recoverable, documented release candidate. |
| 9 | Request explicit user approval | This is the final control before a Production-affecting push. |
| 10 | Push the approved commit to `master` | Use the normal protected-branch or reviewed pull-request process below. |
| 11 | Inspect the Vercel Production build and smoke-test the affected routes | Confirm the actual Production behavior. |
| 12 | Record result, URL, known limits, and verification evidence | Keep `ai-context/` useful for the next release. |

### Approved Git release commands

Run the following only **after** explicit approval has been recorded. They publish the reviewed `master` commit without rewriting remote history.

```bash
git fetch origin
git switch master
git pull --ff-only origin master
git push origin master
```

If Git reports a conflict or rejected push, **stop**. Resolve it on the current `master` baseline, re-run validation, create a new checkpoint, and obtain approval again before retrying the Production push. Never use `git push --force`, `git reset --hard`, or manual file copying to make branches match.

For a team workflow, a pull request with **base** `master` and a feature branch created from `master` is an equivalent review mechanism. Merging that pull request is still a Production action and still requires approval immediately before merge.

### Production verification after the push

Verify only the behavior changed by the release. For this portfolio, the minimum safe check is the public `/` page, direct `/edit` route, and—when server behavior changed—`/api/trpc/auth.me` returning tRPC JSON rather than the SPA. Test database and media changes first with a private draft; never use the selected public `Main portfolio` as disposable test data.

The Vercel deployment output and environment model are described in the [Vercel documentation][1]. The direct `/edit` route is intentionally unauthenticated, so any Production release needs a careful security review even if the code change appears small.

## 2. First local Docker Compose startup

The repository’s `docker-compose.yml` is a **local development convenience**. It starts PostgreSQL, the development application, and a one-off migration service. It does not deploy to Vercel, interact with Vercel Blob, or contain Production credentials.

### One-time setup

Install Docker Desktop (Windows/macOS) or Docker Engine plus the Compose plugin (Linux) on your own computer. Then clone the repository and use the active `master` branch.

```bash
git clone https://github.com/Fedi-Nasri/Portfolio.git
cd Portfolio
git switch master
git pull --ff-only origin master
cp .env.local.example .env.local
docker compose --env-file .env.local up -d postgres
docker compose --env-file .env.local run --rm migrate
docker compose --env-file .env.local up app
```

After the last command, open:

| Address | Purpose |
|---|---|
| `http://localhost:3000/` | Local public portfolio. |
| `http://localhost:3000/edit` | Local direct editor using local PostgreSQL drafts. |

The first start can take longer because the container installs the lockfile-pinned dependencies. The local database is isolated in the `portfolio-postgres-data` Docker volume. It is not the Vercel-connected PostgreSQL database.

### Everyday local commands

| Goal | Command |
|---|---|
| Start app and database | `docker compose --env-file .env.local up app` |
| Start only PostgreSQL | `docker compose --env-file .env.local up -d postgres` |
| Apply an already reviewed migration locally | `docker compose --env-file .env.local run --rm migrate` |
| View app logs | `docker compose --env-file .env.local logs -f app` |
| Stop containers but keep local drafts | `docker compose --env-file .env.local down` |
| Delete all local Compose data | `docker compose --env-file .env.local down --volumes` |

> The reset command deletes **only local Compose volumes**. It cannot delete Vercel PostgreSQL records or Blob objects, but it does remove your local drafts and database state.

## 3. Environment variables: local Compose versus Vercel

Use [`environment.example`](./environment.example) as a **reference template**, not as a file to commit with values. It lists every current application or platform variable, indicates whether it is required, and explains where the value comes from. The existing `.env.local.example` is intentionally shorter because Compose needs only its local database and port values.

| Location | What belongs there | What must not be placed there |
|---|---|---|
| `.env.local` on a developer computer | Local PostgreSQL/port settings from `.env.local.example`; optional local-only values when testing a feature. | Any Vercel, Neon, Blob, GitHub, or Production secret. This file is ignored by Git. |
| Docker Compose `app` / `migrate` services | A container-only `DATABASE_URL` constructed from `LOCAL_POSTGRES_*`. | A remote Production URL or a Blob token. |
| Vercel Preview / Production settings | Server-only database and Blob values, plus public `VITE_*` configuration only when required by the deployed feature. | Values committed to Git, pasted into documentation, or exposed through `VITE_*` when secret. |
| Git repository | `.env.local.example`, `environment.example`, and explanation only. | `.env`, `.env.local`, real keys, tokens, connection strings, or passwords. |

### Where variables come from

| Variable group | How to obtain it | Scope and handling |
|---|---|---|
| `LOCAL_POSTGRES_*`, `APP_PORT` | Choose local-only values in `.env.local`; the defaults are suitable for one developer’s Docker machine. | Compose only; not sent to Vercel. Change `LOCAL_POSTGRES_PORT` if port 5432 is already in use. |
| `DATABASE_URL` | Compose derives it internally for local containers. In Vercel, connect the approved PostgreSQL store/integration through Project Settings. | Server-only. Never copy Vercel’s value into local files, chat, Git, or client code. |
| `BLOB_READ_WRITE_TOKEN` | Created or connected by Vercel Blob in the Vercel project’s storage/integration settings. | Server-only Vercel value. Do not use it for normal local Compose work. |
| `JWT_SECRET` | Generate and manage through the secure Vercel environment-variable interface. | Server-only. Keep it secret even though `/edit` itself is intentionally unauthenticated. |
| `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Supplied by the Manus environment only while legacy `/manus-storage` compatibility still needs them. | Server-only compatibility values; do not invent, copy, or expose them. |
| `VITE_*` configuration | Obtain identifiers/endpoints from the enabled service or project settings only when that feature is used. | Public build-time configuration. Never put a password, database URL, Blob token, or private API key in a `VITE_*` variable. |
| `OWNER_OPEN_ID`, `OWNER_NAME`, OAuth-related values | Obtain from the project’s configured identity/OAuth service only if a feature still uses them. | Configuration values; no change is required for the current unauthenticated `/edit` workflow. |

Vercel applies variable changes to new deployments, rather than changing an old deployment in place.[2] Therefore, variable changes require the same documented change control as code changes: specify the environment scope, avoid exposing the value, deploy deliberately, and test only the affected flow.

## 4. Images, PDFs, and SVGs: local-to-Vercel lifecycle

The portfolio uses a deliberate separation of **working source files**, **application data**, and **visitor-facing file bytes**.

| Stage | Images and SVGs | Certificate PDFs | Database and storage consequence |
|---|---|---|---|
| Prepare locally | Keep original sources outside the repository, for example in `/home/ubuntu/webdev-static-assets/` in Manus or a local `portfolio-assets/` folder. Do not place large files in `client/public/` or `client/src/assets/`. | Keep the original PDF outside the repository in the same way. | No database or Blob change. |
| Develop code from `master` | Test layout, editor controls, field types, upload validation, and export behavior. Use safe existing URLs or local placeholders where appropriate. | Test viewer and export behavior without committing document bytes. | Do not place source binary files in Git. |
| Local Compose | Local PostgreSQL supports persistent draft/editor testing. The default local stack intentionally has no Vercel Blob token. | The default stack does not upload visitor-facing PDFs to Vercel Blob. | Local drafts stay in the Docker volume and are separate from Vercel data. |
| Release code | Push validated `master` changes only after approval. | Same. | The Vercel deployment gets application code, not source media files. |
| Upload through deployed `/edit` | Raster images accepted: JPEG, PNG, WebP, GIF; SVG is accepted unchanged. Raster images above the 2.4 MB inline-transport threshold are prepared as WebP in the browser while preserving dimensions and edges. | PDF accepted only for the `certificate-pdf` category. | The server validates size/type, writes bytes to Vercel Blob, then stores URL/key/type/category/size metadata in PostgreSQL. |
| Verify in a private draft | Confirm public Blob URL, media metadata record, editor preview, and saved draft version. | Confirm viewer/download behavior and static-export packaging when applicable. | Do not select or overwrite the public Main draft without explicit instruction. |
| Publish selected content | Choose a draft as public only after explicit review. | Same. | The public portfolio reads the selected public draft’s latest immutable version. |

### Enforced upload rules in the current server

| Asset kind | Supported types | Server-side size limit | Blob path category examples |
|---|---|---:|---|
| Image | JPEG, PNG, WebP, GIF, SVG | 5 MB | `portrait`, `focus-visual`, `project-image`, `canvas-image`, `provider-logo`, `company-logo` |
| Certificate document | PDF only | 12 MB | `certificate-pdf` |

The deployed upload handler saves new object bytes to public Vercel Blob and stores only metadata in PostgreSQL. It never stores file bytes in a database row. Vercel Blob is designed for file-object storage, while PostgreSQL keeps the application’s relational metadata.[3]

### Important historical-media boundary

The older portfolio still contains legacy `/manus-storage` references for the portrait, project images, and certificate assets. Those references are **not** automatically copied by Docker, Git, a code release, or a new Blob upload. Historical-media migration remains paused by user request and must use private Draft 2, one reviewed reference at a time. Do not claim that the public Main draft is fully Blob-migrated until those specific references are replaced and verified.

## 5. What crosses from development to Vercel

| Item | Move through Git release? | Move through upload/editor workflow? | Notes |
|---|---|---|---|
| React, server, tRPC, and export code | Yes: approved push to `master` | No | Run full validation before release. |
| Generated `api/[...path].js` | Yes, when server/API source changed | No | Regenerate with `pnpm build:vercel-api` before the release checks. |
| PostgreSQL schema migration files | Yes | Apply reviewed migration separately through the approved database workflow | A Git commit does not automatically make a migration safe to execute. |
| Draft content | No | Yes, through `/edit` save/version procedures | Private drafts are the safe test boundary. |
| Image/PDF/SVG source originals | No | No | Keep outside Git; they are working files, not deployed application assets. |
| Visitor-facing image/PDF/SVG bytes | No | Yes, through deployed editor upload to Blob | PostgreSQL keeps metadata only. |
| Vercel variables | No | No | Set through Vercel Project Settings; never source control. |

## References

[1]: https://vercel.com/docs/deployments/overview "Vercel deployments overview"
[2]: https://vercel.com/docs/environment-variables "Vercel environment variables"
[3]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
