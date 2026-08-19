# Portfolio Editor — Feature Plan

## Purpose and scope

This document defines the feature before any implementation begins. The goal is to add a direct `/edit` area where the portfolio owner can select visible content, edit it in context, use a floating formatting toolbar, preview changes, and publish approved content to the public portfolio.

The public site currently keeps its content directly inside `client/src/pages/Home.tsx`. The editor moves content into a persistent versioned document so that `/edit` can load, save, preview, and publish updates without code changes.

> **Operating principle:** The public portfolio renders only published content. The editor operates on a draft, never by changing the live page’s HTML directly.

## Desired editor experience

In edit mode, the owner opens `/edit` and sees the same portfolio layout in an editable preview. Hovering a supported item shows a subtle blue outline and a short label such as “Hero title” or “Project realization.” Clicking an item selects it and opens an editing panel. If text is selected within a rich-text field, a small floating toolbar appears beside the selection.

The toolbar should offer useful editorial controls rather than unrestricted page design controls. The initial toolset will include bold, italic, underline, text size, paragraph/body style, heading style, link insertion, text colour from a constrained palette, and clear formatting. Controlled fields such as project tags, contact links, dates, images, and certification metadata should use clear form inputs instead of free-form rich text.

| Editing goal | Planned interaction | Result |
| --- | --- | --- |
| Change a heading or paragraph | Click the highlighted item, edit in a side panel, then save draft | The new text appears immediately in the private preview. |
| Bold, italicise, resize, or link selected text | Select a phrase in an approved rich-text field | A floating contextual toolbar appears next to the selection. |
| Edit a project, certification, experience item, or article | Select its card or choose it from the admin navigation | A structured form prevents invalid fields and preserves the portfolio layout. |
| Change a profile or contact fact | Open the Profile group in the admin sidebar | The corresponding portfolio locations update together. |
| Make changes live | Review the draft and select **Publish** | The public portfolio receives a new published content version. |

## Content model

The editor will move hard-coded portfolio copy into structured records. This preserves the current page design while allowing each content item to be managed safely. The public `Home` page will read a published portfolio document and render the same sections it has today.

| Content group | Editable fields | Editing method |
| --- | --- | --- |
| Profile and hero | Name, role, location, email, phone, social URLs, hero description, availability text | Structured form; selected text editing for the description. |
| About | Section title, introductory paragraphs, hashtags, statistics | Rich-text fields for paragraphs; controlled fields for tags and statistics. |
| Experience | Date, role, organisation, summary, tags, current-role flag | Reorderable structured cards with text fields and tag controls. |
| Skills and services | Group name, item tags, service title, service description | Structured list editor with validation. |
| Certifications | Title, issuer, issue date, scope, provider, PDF and preview references | Structured card editor; file references remain storage URLs. |
| Selected Work | Image, type, state, title, byline, problem, what-it-is, realization, tech stack, delivery labels | Project-specific form plus rich-text editing only for the three narrative fields. |
| Writing | Date, title, category, read time, article preview, article body, outgoing URL | Article list editor and controlled rich-text body editor. |
| Contact and footer | Intro copy, location line, social links, footer text | Structured form with link validation. |

## Proposed route and access model

The editor uses persistent data and a server-backed route so that drafts and publications survive page reloads. In this release, it deliberately omits a sign-in step and relies on the direct `/edit` URL for access during the portfolio-building phase.

| Route | Visibility | Responsibility |
| --- | --- | --- |
| `/` | Public | Renders the latest published portfolio content. |
| `/edit` | Direct access | Opens the visual editor, editable preview, draft controls, and content library. |
| `/edit/history` | Future extension | Shows recent saved drafts and published versions, with restore controls. |

The initial editor uses direct access without a sign-in flow. The route is intentionally not shown in the public navigation, but it is accessible to anyone who knows the `/edit` URL. This makes the editor convenient during the portfolio-building phase; access control can be restored later before wider public distribution.

## Data and publishing design

The recommended persistence design separates editable drafts from public content. A versioned JSON document is sufficient for the first release because the portfolio already has a stable, known structure. This lets the editor save a complete valid content snapshot while the React page receives one predictable data object.

| Record | Purpose | Minimum fields |
| --- | --- | --- |
| `portfolio_content_version` | Stores a complete version of the portfolio content | `id`, `status`, `contentJson`, `createdBy`, `createdAt`, `publishedAt` |
| `portfolio_edit_log` | Records meaningful admin activity | `id`, `versionId`, `action`, `summary`, `createdBy`, `createdAt` |

The status model will be `draft` and `published`. Saving updates the current draft. Publishing validates the complete document, marks that version published, and makes it the source used by the public portfolio. The previous published version remains available for recovery. This avoids partial updates, accidental live changes, and content corruption.

## Visual editor design

The edit workspace should use a dedicated internal-tool layout with a sidebar, while the editable preview should retain the public portfolio’s familiar light blue-and-white appearance. The editor must not give arbitrary access to layout CSS, raw HTML, or injected scripts.

| Surface | Behaviour |
| --- | --- |
| Editor sidebar | Provides content groups, draft status, preview, save, publish, and version-history actions. |
| Editable preview canvas | Shows the portfolio using the selected draft. Supported content targets reveal an outline only in edit mode. |
| Selection indicator | Adds a pale-blue outline, label, and keyboard-focus state without changing the public portfolio view. |
| Field inspector | Shows the selected item’s label, edit inputs, character guidance, validation messages, and save status. |
| Floating toolbar | Appears only when text is selected in an approved rich-text field; it stays within the viewport and is keyboard accessible. |
| Draft controls | Shows unsaved, saved, publishing, and published states clearly. A publish action requires confirmation. |

### Formatting rules

The editor will preserve the portfolio’s visual system by constraining formatting. Body text can use the established Inter font family; the heading scale will be limited to predefined portfolio tokens rather than arbitrary pixel values. Text colour will be limited to accessible approved colours. Links must be validated, and all inserted links will open externally only when that is appropriate.

| Toolbar control | Permitted values in the first release |
| --- | --- |
| Text style | Paragraph, small label, heading levels already used by the portfolio. |
| Weight | Regular, medium, semibold, bold. |
| Emphasis | Bold, italic, underline, clear formatting. |
| Text size | Existing token steps only: small, body, lead, section heading, display heading. |
| Text colour | Navy, body slate, royal blue, muted slate; colours are contrast-tested for the light surface. |
| Link | HTTPS URL, `mailto:`, or `tel:`; link text and URL are separately editable. |

## Technical implementation plan

Implementation follows the confirmed direct-access workflow below.

| Phase | Work | Completion condition |
| --- | --- | --- |
| 1. Editor foundation | Upgrade the static project, use the editor workspace layout, and add a direct `/edit` route. | The editor opens without a sign-in flow. |
| 2. Content migration | Define the versioned portfolio schema, migrate the current hard-coded content into the first published record, and refactor the public page to render it. | The public page is visually equivalent using database-backed published content. |
| 3. Content forms | Build section and item forms for every content group, including add, edit, reorder, and delete operations where appropriate. | The editor can edit all requested visible portfolio text through controlled forms. |
| 4. Visual selection layer | Add edit-mode outlines, element labels, preview synchronisation, and field inspector selection. | Clicking a supported portfolio item selects the correct content field. |
| 5. Rich-text toolbar | Add selection-aware formatting to approved narrative fields, normalise saved content, and render it safely. | The owner can apply allowed formatting without breaking section layout or injecting markup. |
| 6. Draft, publish, and history | Add draft autosave, explicit publish confirmation, validation, activity log, and restore flow. | Public visitors only see published content and the editor can restore a prior version. |
| 7. Verification | Test validation, keyboard access, responsive controls, rich-text rendering, and failure recovery. | The editor is usable and does not regress the public portfolio. |

## Validation and safety requirements

The editor validates content on both the client and server. Server validation remains important because browser validation can be bypassed. Rich text is stored in a constrained representation and rendered as React elements; raw arbitrary HTML is not accepted.

The first implementation includes clear error messages and draft feedback only when the server accepts the change. Publishing requires a confirmation dialog and never overwrites the last published version permanently. The public portfolio still loads successfully if a draft is invalid or the editor route is unavailable.

## Decisions requiring confirmation

Before implementation, please confirm the following recommended defaults.

| Decision | Recommended default | Why it matters |
| --- | --- | --- |
| Access | Direct access through `/edit`, with no sign-in flow. | Keeps portfolio maintenance immediate during the build phase. |
| Authentication | Not used in this release. | The editor’s URL is unlisted but not access-controlled. |
| Publishing | Save privately as draft, then publish manually. | Prevents accidental public changes. |
| Formatting scope | Floating toolbar only for narrative text; structured fields use forms. | Protects layout and keeps editing simple. |
| Font sizes | Use portfolio size tokens, not arbitrary pixel values. | Preserves the visual design and responsive readability. |
| Images and PDFs | Keep current assets initially; plan replacement uploads as a later extension. | Keeps the first editor release focused on text. |
| Restore | Keep published version history and allow restoring a prior version. | Provides safe recovery after an unwanted edit. |

## Acceptance criteria

The feature will be ready for delivery when the editor can open `/edit` directly, select each portfolio text group, edit all requested text, apply permitted formatting in rich-text areas, save a draft, preview the draft, and publish deliberately. The public portfolio must preserve its current light blue-and-white design after publication.

## Out of scope for the first release

The initial editor will not provide a free-form page builder, arbitrary CSS editing, custom script insertion, collaborative editing, third-party CMS synchronisation, or automatic AI content rewriting. Those capabilities can be evaluated after the secure text-editing and publishing workflow is stable.
