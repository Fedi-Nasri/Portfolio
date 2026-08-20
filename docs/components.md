# Component Structure and Workflow

## Component ownership model

The project separates **content shape**, **page orchestration**, **reusable interaction components**, **server procedures**, and **pure editing/export utilities**. This separation matters because public rendering and editor preview must remain visually aligned while the editor retains additional controls.

| Area | Main files | Ownership |
|---|---|---|
| Routes and providers | `client/src/App.tsx`, `client/src/main.tsx` | Registers `/`, `/edit`, fallback routing, React Query, tRPC, theme, tooltips, and notifications. |
| Public portfolio | `client/src/pages/Home.tsx` | Loads the public draft and renders the polished public experience. |
| Editor workspace | `client/src/pages/EditPortfolio.tsx` | Owns draft browser state, tRPC mutations, save/publish actions, text selection tools, and the draft sidebar. |
| Editable public-style preview | `client/src/pages/FullLivePreview.tsx` | Renders all portfolio sections in their public layout plus editor-only section controls. |
| Canvas builder | `client/src/components/CustomSectionCanvas.tsx` | Supports palette-based components, drag/resize, grouping, guides, presets, duplication, and deletion. |
| Project image controls | `client/src/components/ProjectImageControlPanel.tsx` | Manages focal point, zoom, aspect ratio, frame height, pointer/wheel/key controls, and reset. |
| Export controls | `client/src/components/PortfolioExportActions.tsx` | Exposes HTML and static ZIP download actions in the editor. |
| Editor styles | `client/src/pages/edit-extensions.css` | Holds workspace, draft-library, version history, overlay, and editing affordance styles. |
| Public visual system | `client/src/index.css` | Holds the reference portfolio token set, section patterns, motion, and responsive rules. |

## Page flow

### Public route: `/`

`Home.tsx` requests public content through `trpc.portfolio.publicContent`. The server returns the newest snapshot from the single selected public draft. The page then builds the visible section sequence from `sectionOrder`, excludes IDs in `hiddenSections`, and renders optional custom sections after core content where appropriate.

Public-only behavior includes navigation anchors, the Experience detail disclosure, certificate PDF viewer, project visual cropping, external links, and the floating contact affordance. The public route never receives editor controls.

### Editor route: `/edit`

`EditPortfolio.tsx` requests `portfolio.editorContent`, which returns the active draft’s full content, available draft summaries, and version history. The component clones this into local React state. All direct edits are immutable transformations of that local document until a save or publish mutation completes.

`FullLivePreview` receives the draft document plus callbacks. It preserves the public section markup and styling, while adding hover-selectable sections, editable text bindings, asset inputs, add/remove/reorder controls, canvas access, and other editor affordances.

> The editor preview should not become a second design system. When public markup or public CSS changes, update the corresponding `FullLivePreview` rendering path in the same task.

## UI component inventory

| Feature | Public rendering | Editor capabilities | Primary data fields |
|---|---|---|---|
| Navigation and footer | Header, anchor links, contact CTA, footer | Direct text selection where bound to content; section ordering/visibility is editor-managed. | `navigation`, `footer`, `sectionOrder`, `hiddenSections` |
| Hero / Home | Copy card, circular portrait, four focus cards arranged around portrait | Text editing, portrait upload, focus-card visual upload, drag placement, reset placement. | `hero` |
| About | Two-column narrative, hashtag cloud, statistic cards | In-place text edit, add/delete tags, add/delete statistic cards. | `about` |
| Experience | Timeline with collapsed summary, expandable detail bullets, tool chips, optional logos | Add above/below, delete, add/delete/reorder detail bullets, add/delete tags, upload/clear logo. | `experienceSection`, `experience` |
| Skills & Toolbox | Category cards with compact tool tags | Add/delete toolboxes and add/delete tools. | `skillsSection`, `skills` |
| Certifications | Provider card grid, hover action, in-page PDF viewer | Add/delete certificates, edit fields, upload/delete PDF, link set/clear, provider brand selection/logo upload. | `credentialsSection`, `certifications` |
| Capabilities | Blue services section | Direct editable text in live preview; can be copied to a custom canvas. | `capabilities` |
| Selected Work | Alternating compact image/details rows | Add/delete/reorder projects, edit case-study blocks, tech/delivery chips, project image upload, crop controls. | `projectsSection`, `projects` |
| Writing & Insights | Horizontal article rows with stable metadata column | Add/delete/reorder articles, edit content and source URL, clear link. | `writingSection`, `writing` |
| Contact | Structured heading and direct-contact card | Direct text editing; section visibility and ordering controls. | `contact`, `hero` contact data |
| Custom sections | Public responsive block rendering | Canvas layout creation, add components, select/group, drag/resize, alignment guides, presets, image upload. | `customSections`, `canvasPresets` |

## Editor event workflow

The following workflow should guide new editor features.

```mermaid
sequenceDiagram
  participant E as Editor
  participant P as FullLivePreview
  participant W as EditPortfolio state
  participant R as tRPC router
  participant S as Portfolio service
  participant D as Database

  E->>P: Edit text / click an editor action
  P->>W: Invoke typed callback with content path or intent
  W->>W: Create updated immutable PortfolioContent
  Note over W: UI shows unsaved changes
  E->>W: Save version or Publish
  W->>R: saveDraft or publish mutation
  R->>S: Validate and create snapshot
  S->>D: Insert draft version; update draft metadata
  D-->>S: Stored version number
  S-->>R: Updated result
  R-->>W: Mutation success
  W->>W: Invalidate editor/public queries
```

### Text editing and formatting

Text is selected through an in-preview content path. `EditPortfolio.tsx` records selection start/end offsets, then writes lightweight formatting tokens such as `**bold**`, `_italic_`, `__underline__`, or `[[size:lead]]...[[/size]]` back into the draft. Rendering code is responsible for safely interpreting the supported tokens. Do not introduce arbitrary HTML into content fields.

### Immutable collection editing

`client/src/lib/editorContent.ts` contains pure helper functions such as `appendAboutTag`, `insertExperienceTemplate`, `moveListItem`, `removeProject`, and `togglePortfolioSectionVisibility`. Use helpers rather than mutating nested arrays in React state. This makes the unsaved-change check reliable and keeps behavior reusable in tests.

## Canvas system

The canvas is an editor extension for custom sections and safe copies of certain existing sections. It is not a pixel-perfect replacement for every public section.

| Block type | Intended use |
|---|---|
| `title` | Major heading or introductory title. |
| `text` | Readable body copy. |
| `image` | Storage-backed visual with alternate text. |
| `button` | Action with label and destination URL. |
| `tag-list` | Reusable compact tags. |
| `stat` | Portfolio-style statistic card. |
| `contact-card` | Direct contact information presentation. |

Desktop canvas components use `x`, `y`, `width`, and `height` coordinates. The canvas supports an 8px snap rhythm, alignment guides, shift-click multi-selection, proportional group resize, duplicate/delete actions, and saved layout presets. On narrow displays, public rendering uses a single-column content flow to preserve readability instead of preserving arbitrary absolute positions.

## Upload workflow

1. An editor selects a file from a context-specific upload control.
2. The browser turns the file into a Base64 payload and calls `assets.upload` with a category such as `portrait`, `project-image`, `canvas-image`, `company-logo`, or `certificate-pdf`.
3. The server stores the file and returns a URL.
4. The editor writes the URL into the relevant field of the in-memory draft.
5. A subsequent **Save version** or **Publish** persists the URL inside `contentJson`.

Because uploads and content snapshots are separate steps, an unused uploaded object can exist if an editor abandons or resets a draft. A future storage-cleanup process should be designed carefully and should not delete assets still referenced by any historical draft version or exported file.

## Export workflow

| Export | Result | Constraints |
|---|---|---|
| HTML | A standalone simplified portfolio document | Best for a lightweight handoff; remote/available image data is inlined where possible. |
| Static ZIP | `index.html`, `styles.css`, `app.js`, usage note, and local assets | Recreates the public portfolio hierarchy and interactions offline, including certificate PDFs downloaded into `assets/certificates/` when accessible. |

The export utility runs in the browser against the current editor draft. It does not automatically create a database version; editors should save first when an export needs to correspond to a named historical version.

## Adding a feature safely

| Step | Required result |
|---|---|
| 1. Define the contract | Extend `PortfolioContent` and defaults with backward-compatible optional fields where possible. |
| 2. Render publicly | Update `Home.tsx` and relevant shared render utilities. |
| 3. Render in the editor | Add matching output and controls in `FullLivePreview`. |
| 4. Add state behavior | Use or extend pure helpers in `editorContent.ts`; wire callbacks in `EditPortfolio.tsx`. |
| 5. Persist and export | Ensure JSON serialization, upload references, and static export output all understand the field. |
| 6. Test and visually verify | Add/update Vitest coverage, run checks, and compare `/` with `/edit` at desktop and mobile widths. |
