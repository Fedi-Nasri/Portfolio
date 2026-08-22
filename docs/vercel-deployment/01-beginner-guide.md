# Beginner Guide: How This Portfolio Uses Vercel

This guide explains the deployment process in plain language. It is intentionally cautious: following it helps you understand what to verify, but it does not mean you should click **Promote**, purchase a domain, or edit a secret unless you have decided to make that change.

## The three environments

| Environment | Simple meaning | This project’s use |
|---|---|---|
| **Local** | The app running on a developer’s computer. | Build and test features from the stable `main` branch. |
| **Preview** | A live but non-production test URL. | Use a safe Preview deployment to verify `/`, `/edit`, database persistence, and uploads before a production-ready commit is moved. |
| **Production** | The site visitors reach through the Production domain. | Vercel’s Production Branch is now `deployment_versel`; a new commit pushed there creates a Production Deployment. |

Vercel normally creates a Preview deployment for commits that are not on the configured Production branch. Each deployment has a unique URL, and a branch can also have a stable branch-specific URL.[1]

> For this portfolio, `main` means **stable development** and `deployment_versel` is the configured **Vercel Production Branch**. The names do not make a release safe by themselves: do not move a commit to `deployment_versel` without explicit release approval and completed validation.

## The basic journey of a feature

1. A developer builds and tests a feature on `main`.
2. The developer runs the required checks: TypeScript, Vitest, and production build. Server/API changes also require `pnpm build:vercel-api`.
3. The developer obtains explicit approval for the production-ready release.
4. The reviewed commits move to `deployment_versel`.
5. Vercel creates a Production Deployment from that branch.
6. The developer verifies `/`, `/edit`, and any affected database or file-upload workflow on the resulting deployment.

## Where to look in Vercel

| Vercel page | What it tells you | Portfolio URL |
|---|---|---|
| Project Overview | General project status | [Open project](https://vercel.com/fedi-s-projects2/portfolio) |
| Deployments | Which commit built, whether it is Preview or Production, and its test URL | [Open deployments](https://vercel.com/fedi-s-projects2/portfolio/deployments) |
| Logs | Build and runtime errors for the selected deployment | [Open logs](https://vercel.com/fedi-s-projects2/portfolio/logs) |
| Storage | Connected PostgreSQL/Neon and Blob resources | [Open storage](https://vercel.com/fedi-s-projects2/portfolio/stores) |
| Environment Variables | Variable names and their Local/Preview/Production scope | [Open environment variables](https://vercel.com/fedi-s-projects2/portfolio/settings/environment-variables) |
| Domains | Custom-domain assignment and DNS state | [Open domains](https://vercel.com/fedi-s-projects2/portfolio/settings/domains) |

## What each project service does

| Service | Role in this portfolio | Do not use it for |
|---|---|---|
| **React/Vite static site** | Displays the public portfolio and `/edit` interface. | Database queries or file persistence. |
| **Vercel Function** | Runs `/api/trpc` procedures for drafts, history, editor actions, and uploads. | Long-running background processes. |
| **PostgreSQL** | Stores drafts, immutable versions, public-draft selection, and media metadata. | Image/PDF file bytes. |
| **Vercel Blob** | Stores new portraits, project images, logos, certificate previews, and PDFs. | Draft history or structured portfolio content. |
| **Environment variables** | Supply connection and server-only configuration values to the correct environment. | User-editable portfolio content. |

## First checks when a Preview is ready

| Check | Expected result |
|---|---|
| Open `/` | The selected public draft renders. Some old `/manus-storage` media may still need its separate migration. |
| Open `/api/trpc/auth.me` | A JSON tRPC response appears instead of HTML from the SPA fallback. |
| Open `/edit` | The draft library and live preview load. |
| Select a private draft | Private test work appears without changing the public Main draft. |
| Save a test version | A new immutable version and its note appear after a reload. |
| Inspect Blob uploads | New media appears under the Blob store and has a public URL when the public store is used. |

## References

[1]: https://vercel.com/docs/deployments/environments "Vercel environments"
[2]: https://vercel.com/docs/storage "Vercel Storage overview"
[3]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
