# Portfolio Application Documentation

This folder is the working technical reference for **Fedi Nasri’s portfolio application**. It describes the public portfolio, the direct-access `/edit` workspace, the data and export paths that support them, and the production constraints that matter when the application is deployed outside its managed development environment.

The documentation is intentionally written for three audiences. Editors can use it to understand how to safely change content and publish a selected draft. Developers can use it to find the correct source files and validate changes. AI agents can use it as a durable project map before changing code, data structures, or deployment configuration.

> **Important security decision:** `/edit` has deliberately been implemented as a direct-access route without authentication. This makes the editor convenient but means that anyone able to reach the deployment can alter portfolio content. Do not expose the route publicly without accepting that risk or adding an access-control layer.

## Documentation map

| Document | Primary audience | Use it when you need to… |
|---|---|---|
| [Architecture](./architecture.md) | Developers and AI agents | Understand the React, Express, tRPC, Drizzle, storage, and serverless layers. |
| [Component structure and workflow](./components.md) | Developers and AI agents | Locate a feature, decide where a change belongs, or trace an editor interaction. |
| [UI/UX design system](./ui-design-system.md) | Designers, developers, and AI agents | Extend the visual language without breaking its palette, rhythm, responsiveness, or accessibility. |
| [Design, CSS, and component navigation](./design-code-navigation.md) | Developers and AI agents | Efficiently trace a visible section through routes, JSX, CSS cascade, Tailwind utilities, data, tests, and editor parity. |
| [Development environment](./development.md) | Developers | Install dependencies, connect a database, run checks, build, test, and debug locally. |
| [Local Docker Compose development](./local-docker-development.md) | Developers | Start an isolated local PostgreSQL database and application without touching Vercel or Production data. |
| [Release and media operations](./release-and-media-operations.md) | Developers and AI agents | Follow the exact validated `master` release procedure, run Compose for the first time, manage variables, and move media safely from local work to Vercel Blob. |
| [Complete environment template](./environment.example) | Developers and deployers | See every current variable name, source, scope, and secret-handling rule without exposing a value. |
| [Master-first development and release workflow](./development-branch-workflow.md) | Developers and AI agents | Start every feature from `master`, assess cross-layer impact, and prepare an explicitly approved Production push. |
| [Legacy production deployment overview](./production-deployment.md) | Developers and deployers | Read historical implementation context; use the current Vercel handbook for operational actions. |
| [Legacy Vercel deployment overview](./vercel-deployment.md) | First-time deployers, editors, and AI agents | Read supporting background; use the current Vercel handbook for the branch workflow and service procedures. |
| [Vercel Deployment Handbook](./vercel-deployment/README.md) | First-time deployers, developers, and AI agents | Follow the current branch policy, detailed Preview runbook, service-change guide, domain steps, and variable safety rules. |
| [Automated testing and CI plan](./testing-and-ci-plan.md) | Developers and AI agents | Implement the staged GitHub Actions, testing, visual-regression, documentation-check, and branch-protection plan. |
| [Editor workflow](./editor-workflow.md) | Portfolio editors, developers, and AI agents | Work safely with drafts, history, public selection, custom canvas sections, uploads, and exports. |

## Source-of-truth hierarchy

Documentation explains the intended structure, but the application source remains authoritative. When implementation and prose disagree, update the prose in the same change as the code.

| Concern | Authoritative source |
|---|---|
| Content shape, default data, section order, canvas blocks | [`shared/portfolio.ts`](../shared/portfolio.ts) |
| Persisted tables and column types | [`drizzle/schema.ts`](../drizzle/schema.ts) |
| Draft persistence and publication rules | [`server/portfolio.ts`](../server/portfolio.ts) |
| API contract and validation | [`server/routers.ts`](../server/routers.ts) |
| Editor state and interactions | [`client/src/pages/EditPortfolio.tsx`](../client/src/pages/EditPortfolio.tsx) |
| Live editor rendering and section controls | [`client/src/pages/FullLivePreview.tsx`](../client/src/pages/FullLivePreview.tsx) |
| Public portfolio rendering | [`client/src/pages/Home.tsx`](../client/src/pages/Home.tsx) |
| Visual tokens and responsive styling | [`client/src/index.css`](../client/src/index.css) |
| Static HTML and ZIP export | [`client/src/lib/portfolioExport.ts`](../client/src/lib/portfolioExport.ts) and [`client/src/lib/staticPublicExport.ts`](../client/src/lib/staticPublicExport.ts) |
| Vercel routing | [`vercel.json`](../vercel.json), generated [`api/[...path].js`](../api/[...path].js), and [`server/vercel-api-handler.ts`](../server/vercel-api-handler.ts) |

## Working principles

The portfolio is **data-driven**. Public rendering, the `/edit` preview, draft history, and export all consume the same `PortfolioContent` document. A content feature should therefore begin by extending the shared contract, then update the rendering path, editor controls, persistence behavior, export rendering, and regression tests together.

The project keeps uploaded files out of the database. Content records store URLs and metadata while images, logos, and certificate PDFs are served through object storage. This is important for editor performance, database size, and export behavior.

The application uses immutable version snapshots rather than in-place draft overwrites. A save creates the next version number, and a restore creates a new version from an older snapshot. This means history is preserved by design.

## Fast orientation

```text
Browser
  ├─ /        → public portfolio, selected public draft
  └─ /edit    → direct-access editor, live preview, draft library

React SPA → tRPC client → Express /api/trpc → portfolio service → PostgreSQL
                                           └→ storage service → object storage

Vercel deployment
  ├─ static SPA output in dist/public
  ├─ generated CommonJS API entry at api/[...path].js
  └─ API-first, filesystem, legacy-storage, then SPA fallback routes
```

For the recommended order of work, read [Architecture](./architecture.md) first, then [Component structure and workflow](./components.md), [Design, CSS, and component navigation](./design-code-navigation.md), and finally the relevant operational guide.
