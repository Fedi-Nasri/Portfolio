# Capability Map for Design-Engineered Full-Stack Development

This map organizes the skills that future AI agents should apply to this portfolio. It is not a promise to use every skill for every request; it is a routing guide for choosing the smallest appropriate capability set.

## 1. Core capability groups

| Capability group | What the agent can do | Use it for | Required evidence before completion |
|---|---|---|---|
| **UI/UX and design systems** | Define visual tokens, typography, spacing, hierarchy, interaction states, responsive behavior, and accessibility. | Public page refinement, editor parity, new portfolio sections, design audits. | Desktop/mobile review, keyboard/focus check, design-system update if reusable rules changed. |
| **Reference adaptation** | Translate a supplied site/screenshot into an original, compatible visual system. | User-provided design references or style corrections. | Explain which principles were adapted; preserve user identity and avoid unrelated copied branding. |
| **Information architecture and content design** | Organize technical stories, case studies, navigation, calls-to-action, and edit workflows. | Portfolio messaging, section order, content templates, editor ergonomics. | Clear user path and no fabricated credentials/claims. |
| **React and TypeScript** | Build typed pages, components, routing, state, and UI controls. | Public UI, `/edit`, dialogs, custom canvas, image controls. | `pnpm check`, relevant component tests, responsive verification. |
| **tRPC and API design** | Define typed procedures, inputs, mutations, errors, and client queries. | New persistence behavior, uploads, editor operations. | Router validation, server tests, client success/error states. |
| **Database and data modeling** | Design schemas, immutable drafts, migrations, validation, and safe data access. | New relational data, migrations, version-history invariants, provider migration. | Reviewed migrations, isolated testing, correct dialect/driver. |
| **Asset/PDF storage** | Implement upload, URL storage, previews, PDF viewing, and export packaging. | Portraits, logos, project images, certificate PDFs. | Browser refresh check, safe URL handling, export verification. |
| **Testing and quality** | Write unit/component/integration tests; run type/build checks; plan visual and CI evidence. | Every behavior change, regression prevention, release quality. | Relevant tests plus appropriate type/build checks. |
| **Documentation and agent continuity** | Maintain architecture, decisions, active work, task history, runbooks, and AI prompts. | Any durable behavior, architecture, or workflow change. | Updated AI context/docs in same checkpoint. |
| **Deployment readiness** | Prepare routing, environment plans, storage/database compatibility, and smoke tests. | Deployment preparation only. | Explicit user approval before live action; never assume a paused deployment is ready. |

## 2. Specialist agent roles

For a complex request, a primary agent can divide work into these roles. All roles still obey the same project rules and must hand off evidence rather than assumptions.

| Role | Starts by reading | Typical output | Must not do alone |
|---|---|---|---|
| **Product and content agent** | `product-context.md`, `decisions.md` | User-story clarification, factual content templates, acceptance criteria. | Invent career facts, metrics, certificates, testimonials, or reviews. |
| **Design agent** | `design-system.md`, public/editor screenshots | Layout proposal, interaction rules, accessibility risks, desktop/mobile acceptance criteria. | Apply visual changes without checking public/editor parity. |
| **Frontend agent** | `technical-architecture.md`, `design-system.md` | React/UI implementation and component tests. | Change persistence semantics without consulting data/API owner files. |
| **Data/API agent** | `database-and-data.md`, `server/portfolio.ts`, schema/router files | Contract/schema/procedure plan, migrations, server tests. | Change database provider, mutate version history, or expose secrets without explicit plan. |
| **Asset/export agent** | Storage and export sections of architecture docs | Upload/view/export compatibility plan and tests. | Store binary assets in relational tables or assume Vercel Blob is already live. |
| **Quality agent** | `development-and-quality.md`, CI plan | Test matrix, regression coverage, visual checks, release evidence. | Declare a feature complete without evidence from relevant checks. |
| **Documentation/continuity agent** | `README.md`, `current-work.md`, change/decision/issues records | Context updates, handoff record, checkpoint summary. | Replace source-of-truth implementation facts with unverified prose. |

## 3. Handoff contract between roles

Every specialist handoff should answer the following questions in plain language.

| Handoff field | Required content |
|---|---|
| User goal | What the user wants and any unresolved ambiguity. |
| Files/data affected | Exact paths, routes, content fields, database tables, storage keys, or export surfaces. |
| Constraints | Design rules, security decisions, paused work, data integrity, and facts that must not be invented. |
| Proposed change | Smallest coherent implementation approach. |
| Validation | Tests, screenshots, migrations, logs, or user checks required. |
| Risks / stop conditions | What would require user confirmation or a separate plan. |
| Documentation update | Which `ai-context/` and `docs/` files must change before checkpoint. |

## 4. Default capability routing

| Request pattern | Default capability combination |
|---|---|
| “Change a portfolio section’s text/layout.” | Product/content + design + frontend + quality. |
| “Add an editable portfolio field.” | Product/content + frontend + data/API + export + quality + documentation. |
| “Add a media/PDF feature.” | Frontend + data/API + asset/export + quality + documentation. |
| “Fix an editor bug.” | Frontend or data/API depending on root cause + quality + documentation. |
| “Improve design.” | Design + frontend + visual quality + documentation. |
| “Prepare deployment.” | Data/API + asset/export + deployment readiness + quality; wait for explicit approval before live actions. |
| “Continue an older task.” | Documentation/continuity first, then only the specialist roles that the active work requires. |

## 5. Minimum definition of done

No matter which specialist role is used, a completed change should have: a clear user-facing result, correctly scoped implementation, no fabricated content, relevant test evidence, updated `todo.md`, required AI-context updates, and a checkpoint that states remaining limitations honestly.
