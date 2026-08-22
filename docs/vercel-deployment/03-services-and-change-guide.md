# Vercel Services and Change Guide

This guide explains what to do when the portfolio needs a new database capability, media storage behavior, a custom domain, or another Vercel service. Make one bounded change at a time and keep the service decision separate from the application code change.

## Current service map

| Need | Current solution | Application rule |
|---|---|---|
| Drafts, versions, public selection | PostgreSQL through `pg` and Drizzle | PostgreSQL remains provider-neutral; Neon is the current Vercel-connected host only. |
| Images and PDFs | Public Vercel Blob store `portfolio-blob` | Blob holds file bytes; PostgreSQL holds metadata and portfolio URLs. |
| Website and API | Vercel static deployment plus serverless function | React files serve from `dist/public`; API is `api/[...path].js`. |
| Configuration | Vercel Project Environment Variables | Use names and scope only in docs; never commit values. |
| Domain | Vercel project Domains settings | A domain points at the Production deployment unless deliberately assigned otherwise. |

## Add or change PostgreSQL data

Use PostgreSQL for structured records with relationships, transactions, history, and querying—not for raw binary files. Vercel Marketplace can connect external PostgreSQL providers such as Neon and inject credentials into the linked project.[1]

1. Define the new table or column in `drizzle/schema.ts`.
2. Generate a migration with `pnpm drizzle-kit generate`.
3. Read the generated SQL. Prefer additive, reversible changes; identify indexes and dependencies.
4. Apply the reviewed migration to the intended PostgreSQL host using the approved project database workflow.
5. Add query/service behavior and tRPC validation.
6. Add Vitest coverage using the PostgreSQL-compatible test setup.
7. Update `ai-context/database-and-data.md`, architecture documentation, and the release runbook if the data flow changes.
8. Validate on a disposable Preview draft before considering a public-data action.

> Never place image or PDF bytes in a PostgreSQL column for this portfolio. Store object metadata such as key, URL, content type, category, and size in `portfolio_media_assets`; retain bytes in Blob.

## Add or change Blob media

Vercel Blob is the correct service here for large files such as portraits, project images, certificate previews, and PDFs.[2]

| Step | Required action |
|---|---|
| Decide access | The current store is public because portfolio media is meant to be displayed or downloaded by visitors. Do not make sensitive files public. |
| Preserve originals | Keep source files outside the repository in `/home/ubuntu/webdev-static-assets/`; do not add large media to `client/public/` or source folders. |
| Use the server handler | Call the project’s server upload path; the browser must not receive a privileged write token. |
| Validate type/size | Follow the handler’s accepted MIME types and size caps. |
| Persist metadata | Insert the Blob key and URL metadata in PostgreSQL after a successful Blob write. |
| Test safely | Upload to a disposable private draft, save a version, reload, and verify the Preview renderer or viewer. |
| Plan legacy migration | `/manus-storage` URLs require an explicit inventory and private-draft migration; do not claim they moved merely because new uploads work. |

## Add or change a custom domain

Vercel automatically gives deployments a `.vercel.app` URL. A custom domain can be bought through Vercel or added from another registrar. A domain assigned to a project normally resolves to the most recent Production deployment, so treat this as a Production-affecting action.[3]

1. Confirm the exact domain name and whether it is purchased through Vercel or a third-party registrar.
2. Go to **Project → Settings → Domains** and add the domain to `portfolio`.
3. Follow the displayed verification/DNS instructions. Third-party domains may require DNS configuration at the registrar; Vercel-managed nameservers allow DNS management in Vercel.
4. Decide the canonical address, commonly `www.example.com` or the apex domain, and configure the redirect deliberately.
5. Confirm HTTPS, the public home route, deep link `/edit`, and API route `/api/trpc/auth.me`.
6. Check that contact links and any absolute URLs remain correct.

Do not use a custom domain as a substitute for editor security: a public `/edit` route remains publicly reachable if the deployment is public.

## Other Vercel services: when to consider them

| Service category | Consider it when | Do not add it when |
|---|---|---|
| Marketplace PostgreSQL | The current relational data model needs a supported managed host or provider change. | You only need to store an image/PDF. |
| Vercel Blob | You need visitor-facing images, PDFs, or other file objects. | You need queryable relationships or version history. |
| Global Config | You need globally readable, rarely changing configuration such as feature flags. | You need transactional draft records. |
| Redis/KV integration | You need caching, rate limiting, or transient sessions. | You only need the existing draft database. |
| Vercel Firewall/Deployment Protection | You need a perimeter around Preview or a public deployment. | You expect it alone to protect public API write procedures permanently. |
| Custom Environment | You need a persistent staging/QA environment and your Vercel plan supports it. | Preview URLs already cover a short-lived feature check. |

## References

[1]: https://vercel.com/docs/storage "Vercel Storage overview"
[2]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
[3]: https://vercel.com/docs/domains/working-with-domains "Working with domains on Vercel"
[4]: https://vercel.com/docs/deployments/environments "Vercel environments"
