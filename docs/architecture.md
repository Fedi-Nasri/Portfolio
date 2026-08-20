# Architecture Overview

## System purpose

The application is a full-stack personal portfolio for **Fedi Nasri, Cloud & Network Engineer**. It exposes a visually polished public portfolio at `/` and a direct editing workspace at `/edit`. The editor supports independent drafts, immutable history, public-draft selection, uploads, custom canvas sections, and downloadable static exports.

The central architectural rule is that **one shared portfolio document drives every presentation**. The public site, live editor preview, database snapshots, and export utilities all use `PortfolioContent` from `shared/portfolio.ts`.

## Logical topology

```mermaid
flowchart LR
  Visitor[Visitor or editor browser] --> SPA[React 19 + Vite SPA]
  SPA -->|public content / editor mutations| TRPC[tRPC client]
  TRPC -->|/api/trpc| API[Express application]
  API --> Router[tRPC routers]
  Router --> Portfolio[Portfolio persistence service]
  Portfolio --> DB[(MySQL / TiDB)]
  Router --> Upload[Asset upload service]
  Upload --> Storage[Object storage]
  Storage --> Proxy[/manus-storage proxy/]
  SPA --> Export[HTML and ZIP export utilities]

  Vercel[Vercel deployment] --> Static[dist/public SPA assets]
  Vercel --> Serverless[api/[...path].ts]
  Serverless --> API
```

## Runtime layers

| Layer | Technology | Responsibility | Key implementation points |
|---|---|---|---|
| User interface | React 19, Tailwind CSS 4, shadcn/ui primitives, Wouter | Renders the public portfolio and editor workspace. | `client/src/pages/Home.tsx`, `EditPortfolio.tsx`, `FullLivePreview.tsx` |
| Client data boundary | tRPC React Query client, SuperJSON | Loads content and invokes typed mutations without handwritten REST clients. | `client/src/lib/trpc.ts`, `client/src/main.tsx` |
| API | Express 4, tRPC 11, Zod | Mounts typed public/editor procedures beneath `/api/trpc`. | `server/_core/app.ts`, `server/routers.ts` |
| Domain service | TypeScript | Validates, seeds, versions, restores, publishes, and selects portfolio drafts. | `server/portfolio.ts` |
| Persistence | Drizzle ORM, `mysql2`, MySQL/TiDB | Stores draft metadata and immutable JSON snapshots. | `drizzle/schema.ts`, `server/db.ts` |
| Assets | Forge/S3-style storage and an asset proxy | Stores images, logos, previews, and PDFs outside relational tables. | `server/storage.ts`, `server/_core/storageProxy.ts` |
| Static export | JSZip and browser download APIs | Produces an HTML export or a faithful offline ZIP with local assets. | `client/src/lib/portfolioExport.ts`, `staticPublicExport.ts` |
| Hosting adapter | Vite static build plus Vercel serverless function | Serves SPA routes and API routes in Vercel. | `api/[...path].ts`, `vercel.json` |

## Shared content contract

`PortfolioContent` represents the entire editable portfolio. It contains section labels and visibility controls as well as all content for hero, About, Experience, Skills, Certifications, Capabilities, Projects, Writing, Contact, Footer, and optional custom sections.

| Content area | Important fields | Editorial behavior |
|---|---|---|
| Global composition | `sectionOrder`, `hiddenSections`, `customSections`, `canvasPresets` | Controls public section ordering, reversible visibility, custom sections, and reusable canvas layouts. |
| Hero | identity, contact links, portrait, focus areas, visuals, `focusPositions` | Supports portrait/focus-visual upload and persisted focus-card positioning. |
| About | paragraphs, tags, statistics | Direct in-place editing plus add/delete operations. |
| Experience | role, company, logo, summary, tags, `details` | Collapsed/expanded public states, editable bullet details, and company logos. |
| Skills | toolbox headings and entries | Toolbox and tool add/delete controls. |
| Certifications | provider, credential details, link, PDF, preview, logo | Supports provider branding, document viewing, and storage-backed attachment URLs. |
| Projects | case study, tech, delivery, image crop/frame preferences | Alternating public rows with persisted focal point, zoom, aspect ratio, and frame height. |
| Writing | publishing metadata, article content, URL | Supplies stacked article rows with a protected right-side metadata area on desktop. |
| Custom canvas | title, text, image, button, tag-list, statistic, contact-card blocks | Renders a freeform desktop canvas with a readable responsive fallback. |

## Database architecture

The schema has both a legacy single-stream version table and the active multi-draft model. New work should use the multi-draft tables.

| Table | Purpose | Critical fields |
|---|---|---|
| `portfolio_content_versions` | Legacy content history retained for bootstrap and fallback. | `status`, `contentJson`, `publishedAt` |
| `portfolio_drafts` | One record per named workspace draft. | `draftKey`, `name`, `isPublic`, timestamps |
| `portfolio_draft_versions` | Immutable snapshots for one draft. | `draftId`, `versionNumber`, `contentJson`, `note`, `createdAt` |
| `users` | Template-provided OAuth user table; not required by the direct `/edit` workflow. | `openId`, `role`, timestamps |

`contentJson` is a typed JSON document rather than a column per portfolio field. This makes the diverse and evolving portfolio content practical to version atomically. Each `portfolio_draft_versions` row is a full historical snapshot rather than a patch.

### Draft lifecycle

1. On first editor use, `ensurePortfolioDrafts()` creates **Main portfolio** and version `1` from legacy published/draft content or `DEFAULT_PORTFOLIO_CONTENT`.
2. Editing happens in browser state, so changes are not persistent until a save or publish action runs.
3. **Save version** inserts a new immutable snapshot with the next version number and an optional note.
4. **Restore** loads an earlier snapshot and saves it again as a new latest version. It does not overwrite later history.
5. **Publish** saves the current browser state as a version and marks the selected draft as the single public draft.
6. `/` loads the most recent version of the `isPublic = true` draft.

## API boundary

The API follows tRPC contracts rather than ad-hoc REST resources. The high-level interface is exposed by `appRouter`.

| Router group | Operations | Consumer |
|---|---|---|
| `portfolio` | public content load, editor workspace load, save, publish, draft create/rename/delete, public selection, version load/restore, version note update | Public page and `/edit` workspace |
| `assets` | Uploads for portraits, focus cards, projects, canvas images, provider/company logos, and certificate PDFs | `/edit` workspace |
| `auth` | Template-provided `me` and logout actions | Not used as an access gate for `/edit` |

The Express app sets JSON and URL-encoded body limits to 50 MB, registers the storage proxy and OAuth routes, then mounts tRPC at `/api/trpc`. Any new server-backed feature should normally be added as a typed tRPC procedure and covered by a Vitest test.

## Storage architecture

The current development implementation sends uploads through `server/storage.ts` and references them using `/manus-storage/{key}` URLs. `server/_core/storageProxy.ts` resolves those URLs through a signed Forge/S3 download path. The database stores only those URLs inside `PortfolioContent`; it does not store image or PDF bytes.

> **Deployment boundary:** Vercel Blob is not yet wired into the current storage abstraction. The Vercel deployment guide explains the required provider replacement. Do not assume that a Forge URL or the `/manus-storage` proxy will work in a standalone Vercel deployment without its matching Forge environment variables.

## Vercel serverless adapter

Local development starts the Express server from `server/_core/index.ts`. On Vercel, `api/[...path].ts` exports the reusable app factory from `server/_core/app.ts` so `/api/*` is handled by a serverless function. The static Vite build is output to `dist/public`.

`vercel.json` has three important routing decisions:

| Rule | Why it exists |
|---|---|
| Build only the Vite frontend | Vercel serves the SPA as static output while serverless functions are built from `api/`. |
| Rewrite `/manus-storage/:path*` to `/api/manus-storage/:path*` | Keeps legacy asset URLs aligned with the Express storage proxy. |
| Rewrite all other unmatched paths to `/index.html` | Lets Wouter resolve `/edit` and other SPA paths client-side. |

## Security and operational boundaries

The direct editor currently has **no authorization check**. The portfolio service uses a fixed `DIRECT_EDITOR_ID` only as an audit placeholder, not as identity verification. This should be viewed as an intentional editing mode, not user authentication.

The public draft selector does protect against deleting the current public draft and protects against removing the final remaining draft. These are data-integrity safeguards, not access-control safeguards. Before broad public deployment, place `/edit` behind an identity provider, an edge password, or another enforced access boundary.

## Change impact checklist

When changing an editable feature, trace the full path below rather than modifying only one page.

| Change type | Required touch points |
|---|---|
| New editable field | `PortfolioContent` type, defaults, public render, `FullLivePreview`, editor handler, exported render, persistence test. |
| New list-like section | Shared shape, immutable helpers in `editorContent.ts`, add/remove/reorder UI, empty/limit guards, export, tests. |
| New file attachment | Upload category validation, storage provider, draft URL field, public display, editor removal path, export packaging if offline behavior matters. |
| Design-token change | `index.css`, public render, editor preview parity, responsive breakpoints, contrast and focus verification. |
| New deployment provider | Environment documentation, provider abstraction, local fallback, production migration/runbook, smoke tests. |

## AI continuation reference

For a future-agent-focused end-to-end relationship diagram covering the public/editor frontend, Express/tRPC backend, draft database, assets, certificate PDF storage, static export, and the paused Vercel target, read [`ai-context/technical-architecture.md`](../ai-context/technical-architecture.md#end-to-end-application-and-data-diagram). The reusable agent onboarding prompt is available at [`ai-context/AI_AGENT_SYSTEM_PROMPT.md`](../ai-context/AI_AGENT_SYSTEM_PROMPT.md).
