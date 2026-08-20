# Database and Data Context

## Current database model

The active editor persistence model stores full JSON snapshots of `PortfolioContent`. This intentionally lets one version capture all public sections, order/visibility preferences, canvas layouts, image settings, and content at a single point in time.

| Table | Current role | Key invariants |
|---|---|---|
| `portfolio_content_versions` | Legacy single-stream drafts/published versions. | Retained as bootstrap/fallback source; do not build new features on it without a migration plan. |
| `portfolio_drafts` | One row per named portfolio draft. | `draftKey` is unique; exactly one active public draft is intended. |
| `portfolio_draft_versions` | Immutable historical snapshot per draft. | `versionNumber` increases per draft; `contentJson` is the whole `PortfolioContent`; notes are optional and limited to 500 characters. |
| `users` | Framework-provided OAuth/user table. | Not required for direct `/edit` functionality; do not assume it authorizes editor writes. |

## Relevant schema fields

| Entity | Fields that future agents most often need |
|---|---|
| `portfolio_drafts` | `id`, `draftKey`, `name`, `isPublic`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt` |
| `portfolio_draft_versions` | `id`, `draftId`, `versionNumber`, `contentJson`, `note`, `createdBy`, `createdAt` |
| `portfolio_content_versions` | `id`, `status`, `contentJson`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `publishedAt` |

The schema is in [`drizzle/schema.ts`](../drizzle/schema.ts). The database uses camel-case model properties mapped to explicit table/column names by Drizzle’s MySQL schema definitions.

## Draft lifecycle and invariants

| Operation | Server behavior | Must remain true |
|---|---|---|
| First editor load | Seeds `Main portfolio` from legacy content or `DEFAULT_PORTFOLIO_CONTENT` when no draft exists. | Seeding must not happen repeatedly once drafts exist. |
| Save version | Validates the complete content document and inserts next `versionNumber`. | Existing versions must not be overwritten. |
| Load version | Returns selected historical content into browser state. | Loading alone does not publish or mutate history. |
| Restore version | Loads an old snapshot and saves it as the next version. | Later history remains accessible; restore is additive. |
| Rename draft | Updates the user-visible name. | `draftKey` remains the stable identifier. |
| Delete draft | Deletes draft and its versions. | Public draft cannot be deleted; last draft cannot be deleted. |
| Set public | Clears prior public flags and marks target draft public. | The public page reads newest snapshot of designated draft. |
| Publish | Saves current content then selects that draft public. | Publishing should preserve all other drafts/history. |

## `PortfolioContent` data map

The shared type is located in [`shared/portfolio.ts`](../shared/portfolio.ts). It includes first-class data for navigation, hero, About, Experience, Skills, Certifications, Capabilities, Projects, Writing, Contact, and footer, as well as editor-managed composition fields.

| Special data area | Fields / behavior |
|---|---|
| Section composition | `sectionOrder`, `hiddenSections`, and `customSections` persist public structure safely per draft. |
| Hero layout | `focusPositions` contains persisted X/Y values for four desktop focus cards; mobile falls back to readable grid composition. |
| Experience expansion | `details` provides the expanded bullet list; `hydrateExperienceDetails()` backfills defaults for older snapshots. |
| Certifications | `pdf`, `preview`, `url`, and `providerLogo` are URL references, not binary content. |
| Project media | `imageFocus`, `imageZoom`, `imageAspectRatio`, and `imageFrameHeight` drive safe `object-fit` rendering. |
| Custom canvas | Blocks include type/content/coordinates/sizing and optional image/link/list data. |
| Canvas presets | Persisted at draft level as `canvasPresets`, reusable across custom sections in that draft. |

## Database usage rules

Never store images or PDFs as BLOB columns. The portfolio database stores structured content and URLs only. Preserve full JSON snapshots when a user saves; do not attempt to patch historical JSON in place unless a carefully tested migration is required.

Do not write test data into the user’s main public draft. The existing tests create isolated test drafts. Follow the same pattern for manual integration checks wherever possible.

## Migrations and schema changes

| Safe workflow | Reason |
|---|---|
| Update `drizzle/schema.ts`. | Makes application types and intended schema explicit. |
| Generate migration SQL. | Creates reviewable DDL instead of relying on unstated database changes. |
| Read generated SQL before applying. | Prevents accidental destructive changes. |
| Apply migration to the correct database. | Keeps runtime and schema compatible. |
| Run `pnpm check`, `pnpm test`, and relevant persistence tests. | Detects type/API/history regressions. |
| Update `ai-context/` and `docs/` if data behavior changes. | Keeps future agents from using stale assumptions. |

`drizzle.config.ts` currently uses `dialect: "mysql"` and fails fast if `DATABASE_URL` is missing. The project command `pnpm db:push` runs generate plus migrate, but it must be used only after migration review.

## Neon/PostgreSQL warning

The Vercel user flow chose **Neon Serverless Postgres** as the intended connected database because the Vercel marketplace did not expose a suitable MySQL service in the observed UI. The source code is still MySQL/TiDB-specific.

> Do **not** set a Neon PostgreSQL URL as `DATABASE_URL` in the current code and expect it to work. A valid PostgreSQL port must change the Drizzle dialect, table imports/types, runtime driver, dependency set, migrations, and database test validation together.

| Current MySQL implementation | Required PostgreSQL port work |
|---|---|
| `drizzle-orm/mysql-core` | Use PostgreSQL schema builders and equivalent column definitions. |
| `drizzle-orm/mysql2` / `mysql2` | Use a supported PostgreSQL/Neon driver and Drizzle adapter. |
| `dialect: "mysql"` | Set PostgreSQL dialect/configuration. |
| Existing MySQL migrations | Generate/review new PostgreSQL-compatible DDL. |
| MySQL URL semantics | Use a secure PostgreSQL `DATABASE_URL` supplied by the connected service. |

Do not start this port unless deployment work is explicitly resumed. Add specific todo items and a migration plan first.

## Storage data rule

The current storage system returns `/manus-storage/...` URLs through an Express proxy. Vercel Blob is not yet integrated. A Blob migration must preserve existing URL references or include a controlled backfill/copy process. New uploads should not become unusable historical references after deployment.
