# Implementation History

This is a concise continuation history. The complete checkpoint ledger is available in the project environment, while this log retains the milestones most likely to affect future work.

| Period / checkpoint | Completed movement | Continuation relevance |
|---|---|---|
| Initial portfolio work | Rebuilt public portfolio around Fedi Nasri’s identity, circular portrait, light pale-blue framed design, readable Inter typography, and technical project content. | Preserve brand/palette/spacing choices; do not regress to generic or dark layout. |
| Editor evolution | Added direct `/edit` route and later removed authentication by user request. | Editor write access is public by design; security remains a risk, not an accidental omission. |
| Live preview parity | Replaced inspector-first editing with a public-style live preview and section-specific editing actions. | Public and editor markup/styles need coupled maintenance. |
| Draft workspace | Added named drafts, immutable per-draft versions, public-draft selection, search/filter, version notes, and restore-as-new-version. | Protect history invariants when changing persistence. |
| Canvas builder | Added custom canvas sections, block palette, snap/alignment, duplicates, delete repair, groups, presets, existing-section canvas copies, and image uploads. | Preserve mobile fallback and draft-level preset data. |
| Experience refinement | Added timeline states, expanded bullets, tag placement, company logos, and detail reordering. | Preserve current/most-recent marker and collapsed/expanded content behavior. |
| Selected Work refinement | Added alternating rows with compact consistent media, focal point, crop zoom, ratios, resize frame, and control overlay. | Avoid letting media sizing consume detail space or reveal blank crop regions. |
| Export refinement | Added standalone HTML and faithful static ZIP export with offline-style assets and locally bundled certificate PDFs. | Update export with all new content fields/interactions. |
| Checkpoint `40629cf8` | Added local certificate PDF packaging inside static ZIP. | Export regression baseline before documentation work. |
| Checkpoint `93795ce2` | Added `docs/` architecture/component/design/development/deployment/editor manuals. Passed TypeScript, 71 tests, build. | Read `docs/` for detailed manuals; this is the latest completed checkpoint before AI-context work. |
| Current work | Creating `ai-context/` folder with living memory for agents. Vercel work paused. | Complete/validate/checkpoint this folder next. |
| Current extension | Added `AI_AGENT_SYSTEM_PROMPT.md` and expanded the technical architecture context with an end-to-end diagram for public/editor frontend, tRPC/Express, drafts, assets/PDFs, export, and paused Vercel services. | Future agents should apply the prompt and read the diagram before changing data, UI, storage, or deployment work. |
| Current documentation extension | Added `docs/vercel-deployment.md`, a beginner-friendly deployment guide covering PostgreSQL, Blob storage, environment variables, Preview/Production testing, security, and recovery. | The guide is instructional only; Vercel work remains paused until the user explicitly resumes it. |
| Current continuity extension | Added a standalone architecture diagram, a worked agent feature-request workflow, a design/full-stack capability map, and a staged automated testing/CI plan. | Future agents can now select specialist roles, follow a concrete cross-layer workflow, and implement GitHub Actions CI from a documented staged plan. |
| Checkpoint `b7252cb3` | Validated and saved the comprehensive architecture, workflow, capability, and CI planning extension. | Use this as the current documentation/AI-context baseline; Vercel work remains paused. |
| Current visual repair | Corrected dark-mode focus-card labels, surfaces, boundaries, connector hierarchy, and orbit prominence; re-centred the Security & Networking network illustration with responsive geometry. | Preserve focus-card public/editor parity and keep each artwork fully within its visual window across themes and breakpoints. |
| Checkpoint `3e35d774` | Validated and saved the dark-mode focus-card contrast/hierarchy repair and the Security & Networking artwork framing correction. | This is the current visual baseline for Home focus cards; retain high-contrast captions and the mobile network-art geometry. |
| Checkpoint `327f3425` | Replaced MySQL/TiDB Drizzle schema/driver/configuration with provider-neutral PostgreSQL using `pg-core`, `pg`, and new PostgreSQL migrations. Added an in-memory PostgreSQL compatibility setup so all 71 regressions exercise PostgreSQL persistence behavior. | Treat Neon as a connected host only; retain standard PostgreSQL code paths and direct-editor behavior. |
| PostgreSQL schema application | Applied the reviewed additive schema one PostgreSQL statement at a time to the connected host and verified the four application tables: `users`, `portfolio_content_versions`, `portfolio_drafts`, and `portfolio_draft_versions`. | Preview-backed live draft persistence and Vercel Blob work remain pending and require a separate deployment approval. |

## How to add a new entry

Add an entry when a checkpoint changes user-visible behavior, persistence semantics, design rules, deployment architecture, or future-agent workflow. State what changed, what a future agent must preserve, and which validation was run. Avoid one-line messages that only say “fixed bug.”
