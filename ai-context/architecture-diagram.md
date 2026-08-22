# Comprehensive Architecture Diagram

This document is the standalone architecture reference for the portfolio. It explains how the public site, `/edit` workspace, API, database, asset/PDF storage, exports, and paused deployment boundary work together.

> **Current deployment boundary:** local/managed development works with MySQL/TiDB plus Forge/S3-style storage. Vercel work is paused. Do not assume Neon PostgreSQL or Vercel Blob has been configured, migrated, or tested.

## 1. Runtime architecture

```mermaid
flowchart LR
  subgraph Browser[Visitor or trusted editor browser]
    Public[Public portfolio\n`/`]
    Editor[Direct editor\n`/edit`]
    Download[HTML and ZIP download]
  end

  subgraph Client[React 19 SPA · Vite · Wouter · Tailwind]
    Home[Home.tsx\npublic renderer]
    EditPage[EditPortfolio.tsx\ndrafts, save/publish, uploads]
    Preview[FullLivePreview.tsx\npublic-style editable preview]
    Canvas[CustomSectionCanvas.tsx\nfreeform custom sections]
    Query[tRPC + React Query client]
    Exports[portfolioExport.ts\nstaticPublicExport.ts]
  end

  subgraph API[Express 4 + tRPC backend]
    Trpc[tRPC request transport]
    Routers[server/routers.ts\ninput validation + procedures]
    Portfolio[server/portfolio.ts\ndraft lifecycle]
    Storage[server/storage.ts\nasset helper]
    Proxy[storageProxy.ts\n`/manus-storage/*`]
  end

  subgraph Database[MySQL/TiDB today]
    Drafts[(portfolio_drafts)]
    Versions[(portfolio_draft_versions)]
    Legacy[(portfolio_content_versions\nlegacy fallback)]
  end

  subgraph ObjectStore[Forge/S3-style object storage today]
    Images[Portraits · project images\ncompany/provider logos · previews]
    PDFs[Certificate PDFs]
  end

  Public --> Home
  Editor --> EditPage
  EditPage --> Preview
  Preview --> Canvas
  Home --> Query
  EditPage --> Query
  Query --> Trpc
  Trpc --> Routers
  Routers --> Portfolio
  Portfolio --> Drafts
  Portfolio --> Versions
  Portfolio -. first-load fallback .-> Legacy
  Routers --> Storage
  Storage --> Images
  Storage --> PDFs
  Public -->|asset URL| Proxy
  Editor -->|asset URL| Proxy
  Proxy --> Images
  Proxy --> PDFs
  EditPage --> Exports
  Exports --> Download
```

## 2. Database relationship diagram

The application stores editable portfolio content as immutable JSON snapshots. This is intentional: one snapshot can capture the whole public portfolio, section order, hidden sections, images, canvas layouts, and exportable content as one coherent version.

```mermaid
erDiagram
  PORTFOLIO_DRAFTS ||--o{ PORTFOLIO_DRAFT_VERSIONS : "has immutable versions"

  PORTFOLIO_DRAFTS {
    int id PK
    varchar draftKey UK
    varchar name
    boolean isPublic
    int createdBy
    int updatedBy
    timestamp createdAt
    timestamp updatedAt
  }

  PORTFOLIO_DRAFT_VERSIONS {
    int id PK
    int draftId FK
    int versionNumber
    json contentJson
    text note
    int createdBy
    timestamp createdAt
  }

  PORTFOLIO_CONTENT_VERSIONS {
    int id PK
    enum status
    json contentJson
    timestamp publishedAt
  }
```

| Record | Purpose | Important invariant |
|---|---|---|
| `portfolio_drafts` | Stores a named workspace such as Main portfolio or a future alternative draft. | One draft is selected as public at a time. |
| `portfolio_draft_versions` | Stores the full `PortfolioContent` document for each saved version. | Existing versions are immutable; a restore inserts another version instead of changing history. |
| `portfolio_content_versions` | Stores the legacy pre-multi-draft stream. | It is a bootstrap/fallback source, not the preferred target for new features. |

## 3. Public read flow

```mermaid
sequenceDiagram
  participant B as Visitor browser
  participant H as Home.tsx
  participant T as tRPC API
  participant P as Portfolio service
  participant D as Draft/version database
  participant S as Storage proxy/object store

  B->>H: Open `/`
  H->>T: portfolio.publicContent query
  T->>P: getPublishedPortfolioContent()
  P->>D: Find draft with isPublic = true
  D-->>P: Latest immutable contentJson
  P-->>T: PortfolioContent
  T-->>H: Typed public content
  H->>S: Render images/PDF previews from stored URLs
  S-->>B: Media response
  H-->>B: Public portfolio
```

The public site is data-driven. It does not have separate hard-coded public text for every editable item. The selected public draft determines the content rendered by `Home.tsx`.

## 4. Editor save, publish, and restore flow

```mermaid
sequenceDiagram
  participant E as Editor browser
  participant W as EditPortfolio.tsx
  participant V as FullLivePreview.tsx
  participant T as tRPC API
  participant P as Portfolio service
  participant D as Draft/version database

  E->>W: Open `/edit`
  W->>T: portfolio.editorContent query
  T->>P: getEditorPortfolioContent()
  P->>D: Load selected draft + versions
  D-->>W: Draft workspace and PortfolioContent
  W->>V: Render local unsaved content
  E->>W: Edit text, cards, sections, media settings
  W->>W: Update immutable local state
  E->>W: Save version
  W->>T: savePortfolioDraft(content, note)
  T->>P: Validate and compute next version number
  P->>D: INSERT new portfolio_draft_versions row
  D-->>W: New immutable version metadata
  E->>W: Publish selected draft
  W->>T: publishPortfolioContent(...)
  T->>P: Save current version + set isPublic
  P->>D: Transactional draft selection update
```

| Editor action | Database result | What it does **not** do |
|---|---|---|
| Change a field locally | Nothing until Save or Publish. | It does not alter public content immediately. |
| Save version | Inserts the next immutable snapshot. | It does not automatically make the draft public. |
| Publish | Saves the current snapshot, then selects the draft as public. | It does not delete other drafts or versions. |
| Restore | Uses old content to create a new current version. | It does not overwrite newer history. |

## 5. Asset and certificate PDF lifecycle

```mermaid
flowchart TD
  Select[Editor selects image or PDF] --> Encode[Browser reads file as Base64]
  Encode --> Upload[tRPC assets.upload procedure]
  Upload --> Service[server/storage.ts]
  Service --> Store[Object storage write]
  Store --> URL[Stable asset URL or key]
  URL --> Draft[URL is written into draft-local PortfolioContent]
  Draft --> Save[Save or Publish creates a new JSON snapshot]

  Save --> Public[Public or editor preview reads URL]
  Public --> Proxy[Asset URL proxy when required]
  Proxy --> Store
  Store --> Viewer[Image element or PDF viewer]

  Save --> Export[Static ZIP export]
  Export --> Fetch[Fetch available certificate PDFs]
  Fetch --> LocalPDF[assets/certificates/*.pdf inside ZIP]
```

| Asset kind | Stored where | Database/snapshot stores | Public consumer |
|---|---|---|---|
| Portrait, project image, custom canvas image | Object storage | URL in `PortfolioContent` | `<img>` in public/editor render. |
| Company/provider logo | Object storage or provider text configuration | URL/value in `PortfolioContent` | Experience/certification cards. |
| Certificate preview | Object storage | Preview URL | Certificate-card image. |
| Certificate PDF | Object storage | PDF URL | In-page viewer and static ZIP package. |

The relational database stores **references**, not file bytes. This keeps version records compact and lets the static export package download accessible PDFs separately.

## 6. Export boundary

The export utilities receive the current browser draft state. They can generate a simple standalone HTML file or a faithful ZIP package with `index.html`, `styles.css`, `app.js`, image assets where available, and certificate PDFs stored locally under `assets/certificates/`.

```mermaid
flowchart LR
  Draft[Current in-memory PortfolioContent] --> Renderer[staticPublicExport.ts]
  Renderer --> HTML[index.html]
  Renderer --> CSS[styles.css]
  Renderer --> JS[app.js]
  Draft --> PDFLinks[Certificate PDF URLs]
  PDFLinks --> Downloader[portfolioExport.ts]
  Downloader --> LocalPDFs[assets/certificates/*.pdf]
  HTML --> ZIP[JSZip archive]
  CSS --> ZIP
  JS --> ZIP
  LocalPDFs --> ZIP
```

Exporting does not automatically save or publish the current draft. An editor must save/publish separately if the exported state should become durable or public.

## 7. Paused Vercel target boundary

```mermaid
flowchart LR
  Vite[Vite build] --> Static[dist/public on Vercel]
  Serverless[Vercel API adapter] --> Express[Shared Express app factory]
  Express -. current database driver is MySQL/TiDB .-> CurrentDB[(MySQL-compatible SQL)]
  Express -. future provider adapter needed .-> Blob[(Vercel Blob)]
  Express -. future full PostgreSQL port required .-> Neon[(Neon PostgreSQL)]
```

The `vercel.json` file already defines the static output, SPA fallback, and current `/manus-storage/*` rewrite. It does **not** make the database or uploads production-ready by itself. Vercel work remains paused.

## 8. Source ownership map

| Concern | Authoritative files |
|---|---|
| Public presentation | `client/src/pages/Home.tsx`, `client/src/index.css` |
| Editor workspace | `client/src/pages/EditPortfolio.tsx`, `client/src/pages/FullLivePreview.tsx`, `client/src/pages/edit-extensions.css` |
| Shared content contract | `shared/portfolio.ts` |
| Immutable editor transforms | `client/src/lib/editorContent.ts` |
| Canvas behavior | `client/src/components/CustomSectionCanvas.tsx` |
| Project crop controls | `client/src/components/ProjectImageControlPanel.tsx` |
| API validation | `server/routers.ts` |
| Draft lifecycle | `server/portfolio.ts` |
| Database schema | `drizzle/schema.ts`, `drizzle.config.ts`, `server/db.ts` |
| Asset storage/proxy | `server/storage.ts`, `server/_core/storageProxy.ts` |
| Export | `client/src/lib/portfolioExport.ts`, `client/src/lib/staticPublicExport.ts` |
| Vercel routing | `vercel.json`, `api/[...path].ts`, `server/_core/app.ts` |

## 9. Change-impact rule

When a request adds an editable content field, treat it as a cross-layer change: update the shared contract/defaults, public render, live preview, editor controls/state helpers, server validation if needed, static export, and regression tests. Update this diagram whenever the relationship between these layers changes.
