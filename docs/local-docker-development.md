# Local Docker Compose Development

This optional setup runs a disposable, **local PostgreSQL** database and the portfolio application through Docker Compose. It is designed for normal work on `main`; it does not deploy anything, connect to Vercel Blob, or use the Vercel-connected PostgreSQL database.

> **Boundary:** this repository deliberately has no Production Docker Compose file and no root `Dockerfile`. Vercel remains the Production platform. The local Compose stack is a developer convenience, not a replacement deployment path.

## What runs locally

| Service | Role | Persistent state |
|---|---|---|
| `postgres` | Local PostgreSQL 16 database for draft and editor testing | Named Docker volume `portfolio-postgres-data` |
| `app` | Node 22 development process running `pnpm dev` | Source is mounted from the working tree; dependency and pnpm cache volumes are local |
| `migrate` | One-off Drizzle migration command | Runs only when explicitly requested |

The `migrate` service is intentionally not started by the normal `up` command. Review generated migrations first, then apply them deliberately to the **local** database.

## First-time setup

Install Docker Desktop or Docker Engine with the Compose plugin on your own development machine. From the project root, create an ignored local environment file using the safe placeholder values:

```bash
cp .env.local.example .env.local
```

Do not replace these values with Vercel, Neon, Blob, or other Production credentials. The Compose stack constructs a container-only `DATABASE_URL` that points at the local `postgres` service.

## Start a local persistent-editor environment

Start the database first, apply the reviewed repository migrations, then start the application.

```bash
docker compose --env-file .env.local up -d postgres
docker compose --env-file .env.local run --rm migrate
docker compose --env-file .env.local up app
```

Open `http://localhost:3000/` for the public portfolio and `http://localhost:3000/edit` for the direct editor. In this mode, `/edit` uses the local PostgreSQL database, so local saves and drafts persist through app restarts without touching the deployed portfolio.

The application service installs the lockfile-pinned dependencies inside an isolated Docker volume on first startup. Subsequent starts reuse that volume unless it is reset.

## Everyday commands

| Goal | Command | Effect |
|---|---|---|
| Start app and database | `docker compose --env-file .env.local up app` | Opens the local server at `http://localhost:3000`. |
| Stop local services | `docker compose --env-file .env.local down` | Stops containers and keeps local database data. |
| View local logs | `docker compose --env-file .env.local logs -f app` | Streams only the local application logs. |
| Apply reviewed migrations | `docker compose --env-file .env.local run --rm migrate` | Applies existing Drizzle migrations to local PostgreSQL only. |
| Reset local database | `docker compose --env-file .env.local down --volumes` | Deletes local Compose volumes, including all local drafts. This does not affect Vercel. |

When a schema change is needed, generate and inspect the migration on `main` first. Then use the `migrate` command above to test it locally. Follow the [branch workflow](./development-branch-workflow.md) before considering any Vercel release.

## Why there is no Production Compose command

Vercel already owns Production routing, its serverless API bridge, PostgreSQL connection, and Blob integration. A separate Compose-based Production path would create a second, divergent release system and invite accidental credential or data mistakes. The correct Production path remains:

```text
main (develop and validate) → explicit user release approval → deployment_versel → Vercel Production
```

Do not run the local `migrate` service against a remote connection string, and do not copy `.env.local` into Vercel.

## Troubleshooting

| Symptom | Check first |
|---|---|
| `postgres` will not start | Confirm the `LOCAL_POSTGRES_PORT` is free, then change it in `.env.local` if another PostgreSQL instance uses port 5432. |
| Migration cannot connect | Ensure `postgres` is healthy with `docker compose --env-file .env.local ps`, then run `migrate` again. |
| Editor content looks empty | This is expected on the first local database run. The app seeds its local draft records independently of Vercel’s data. |
| You need deployed data or Blob files | Stop and reassess. Local Compose is intentionally isolated; do not point it at Production services. |

For non-container development, continue to use the existing [Development Environment Guide](./development.md). For an exact first-time startup, environment-variable ownership, media workflow, and release sequence, read [Release and Media Operations](./release-and-media-operations.md). Obtain explicit approval before any push to `deployment_versel`.
