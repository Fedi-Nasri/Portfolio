# Product Context

## Product definition

This project is a personal portfolio application for **Fedi Nasri**, a Cloud & Network Engineer based in Tunis, Tunisia. It presents a public professional portfolio at `/` and provides a direct in-browser portfolio workspace at `/edit`. The workspace allows a trusted editor to update content, create independent drafts, inspect version history, select the public draft, upload media, create custom canvas sections, and export static copies.

The portfolio is not a generic landing page. It is a content-managed technical portfolio whose public rendering, editor preview, history, and export all derive from one shared `PortfolioContent` model.

## Primary audiences

| Audience | Needs | Product response |
|---|---|---|
| Recruiters and hiring managers | A readable, credible view of Fedi’s cloud, network, security, DevOps, and project experience. | A refined public portfolio with concise case studies, experience, tools, credentials, writing, and direct contact paths. |
| Fedi or a trusted editor | Direct control over portfolio content without editing source files. | The `/edit` workspace with live preview, drafts, versions, uploads, section controls, and export. |
| Future developer or AI agent | A safe way to extend the application without breaking persistence or visual fidelity. | Shared data contract, typed API, regression tests, `docs/`, and this `ai-context/` folder. |

## Routes and user-facing surfaces

| Route / surface | Purpose | Access model | Primary source |
|---|---|---|---|
| `/` | Public portfolio that renders the selected public draft. | Public. | `client/src/pages/Home.tsx` |
| `/edit` | Direct portfolio editor with live public-style preview. | **Intentionally unauthenticated.** | `client/src/pages/EditPortfolio.tsx` |
| `/api/trpc` | Typed backend procedure transport. | Public procedures currently include draft write operations. | `server/routers.ts` |
| `/manus-storage/*` | Current development asset URL path. | Proxied from Express to configured storage. | `server/_core/storageProxy.ts` |

## Non-negotiable product requirements

| Requirement | Current implementation expectation |
|---|---|
| Visual direction | Light white and pale-blue framed composition, not a dark editorial redesign. |
| Main type | Inter, with readable 15–16px regular body text. |
| Outer frame | 24px desktop surround, rounded white container, pale-blue page background. |
| Section rhythm | 100px vertical / 56px horizontal desktop padding; responsive reductions on smaller screens. |
| Hero portrait | Circular, positioned in a portrait-led hero composition. |
| Hero focus cards | Exactly four core focus areas: Cloud, DevOps, DevSecOps, and Security & Networking. Their desktop positioning persists per draft. |
| Editor access | `/edit` must remain direct-access unless the user explicitly asks for access control. |
| Public/editor parity | The editable preview should show the public layout, not a simplified content inspector. |
| Draft safety | Saving creates immutable snapshots; restoring creates a new version; selecting one public draft does not delete other drafts. |
| Content safety | A hidden section remains editable; a removed/hidden section must not silently destroy unrelated content. |
| Static export | The editor exports HTML and a faithful public-style ZIP including accessible certificate PDFs as local assets. |

## Content scope

`PortfolioContent` includes the following core public sections in default order: Home, About, Experience, Skills, Certifications, Capabilities, Projects, Writing, and Contact. The editor may hide eligible sections, alter their saved order, or append custom sections. Home stays at the top by design.

| Section | Editorial intent |
|---|---|
| Home | Establish identity, role, location, contact context, circular portrait, and four expertise areas. |
| About | Explain systems-oriented profile through readable narrative, tags, and outcome statistics. |
| Experience | Present internships in a timeline with concise summaries and expandable responsibility details. |
| Skills & Toolbox | Group technologies by operating domain rather than showing an undifferentiated keyword list. |
| Certifications | Show credential provider, context, attachments, and verified links. |
| Capabilities | Translate technical skills into clear engineering service areas. |
| Selected Work | Use structured Problem / What it is / Realization narratives and practical delivery evidence. |
| Writing & Insights | Support real external articles, portfolio notes, and future article placeholders. |
| Contact | Offer direct contact paths without a placeholder or non-functional public form. |

## Product constraints an agent must preserve

The portfolio currently uses a **direct-access editor** rather than an admin-authenticated editor. This is a deliberate user preference but a real production risk. Do not introduce OAuth prompts, role checks, or authentication wrappers without explicit approval. Equally, do not represent the current editor as secure.

The user paused Vercel work. Do not deploy, alter production environment variables, accept third-party terms, or continue database/storage setup unless the user explicitly resumes deployment work.

## Public identity data

| Field | Current intended public value |
|---|---|
| Name | Fedi Nasri |
| Role | Cloud & Network Engineer |
| Location | Tunis, TN / Tunisia |
| Email | fedinasri.fsb@gmail.com |
| Phone | +216 95730139 |
| GitHub | github.com/Fedi-Nasri |
| LinkedIn | linkedin.com/in/fedinasri |

Verify personal-data changes directly with the user; do not infer credentials, experience, certificates, or employment facts.
