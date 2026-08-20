# `/edit` Workspace Guide

## Purpose and access model

The `/edit` route is a direct-access portfolio workspace. It is designed for Fedi Nasri or a trusted editor to change the portfolio while seeing a live rendering that mirrors the public desktop experience. There is no sign-in gate in the current implementation.

> Anyone with access to an unprotected production `/edit` URL can modify portfolio content. Use deployment protection or application authentication before sharing the editor broadly.

## Workspace anatomy

| Workspace area | What it does |
|---|---|
| Top bar | Links to the public site, shows whether changes are unsaved, exposes Reset, Save version, and Publish. |
| Export actions | Downloads a standalone HTML file or a faithful static ZIP from the current browser draft. |
| Draft library | Creates, loads, searches, filters, renames, designates, and deletes drafts. |
| Version history | Loads an older version, edits its note, or restores it as a new latest version. |
| Full live preview | Shows portfolio sections using public-style layouts and reveals scoped editing controls on active sections. |
| Floating text tools | Applies supported formatting tokens after a text selection in the preview. |
| Project image overlay | Provides focal point, zoom, aspect ratio, frame height, and reset controls for an active project image. |

## Draft concepts

| Term | Meaning |
|---|---|
| Draft | A named independent working branch of the portfolio, such as “Main portfolio” or “Cloud applications revision.” |
| Version | An immutable content snapshot inside one draft. Version numbers increase sequentially. |
| Public draft | The one draft whose newest version is rendered at `/`. |
| Save version | Preserves the current editor state as the next historical version without necessarily changing the public site. |
| Publish | Saves the current editor state and marks that draft as public. |
| Restore | Copies an older version into a brand-new latest version; no historical version is overwritten. |
| Reset | Discards unsaved browser changes and returns to the last saved snapshot. |

## Recommended editorial workflow

1. Open `/edit` and identify the active draft in the Draft library.
2. Create a new draft for experimental or larger changes. A new draft begins as a copy of the active draft.
3. Make edits in the live preview. A visible **Unsaved changes** state confirms that the browser draft differs from the latest stored snapshot.
4. Enter a concise change note, for example: `Updated Cloud project image and delivery points`.
5. Select **Save version**. The history receives a new immutable version.
6. Compare the draft in the preview and, if necessary, use the public-site link in a separate tab to confirm the currently selected public draft has not changed.
7. Select **Set as public** when the draft should become the next public portfolio candidate.
8. Select **Publish**, review the confirmation, and complete it only when the draft is ready to appear at `/`.

For risky restructuring work, create a separate draft first and keep Main portfolio public until the new draft has been verified.

## Draft library operations

| Action | Effect | Guardrail |
|---|---|---|
| New draft | Creates a draft with version 1 copied from the active draft. | Use a descriptive renamed title before major work. |
| Search | Filters draft names case-insensitively. | Does not modify content. |
| Filter | Shows all, public, or private drafts. | Does not modify content. |
| Rename | Changes the current draft’s human-readable name. | A blank rename retains the existing name. |
| Set as public | Switches the public marker to the active draft. | There is always one intended public source. |
| Delete | Removes a private draft and all its versions. | Cannot delete the public draft or the last remaining draft. |

## Version history operations

Each version shows a local timestamp and optional note. **Load** places a historical snapshot into browser state for inspection. It does not immediately publish or change stored history. **Restore** asks for confirmation, then saves that snapshot as the next version. This keeps both the original restored version and any newer versions available.

Version notes are intentionally capped at 500 characters. Write notes that identify an observable change, a motivation, or a review state rather than generic wording such as “updates.”

## Section editing guide

| Section | Typical editor actions |
|---|---|
| Home | Edit text, upload portrait, replace focus visuals, drag focus cards, reset card layout. |
| About | Edit narrative, add/remove tags, add/remove statistic cards. |
| Experience | Add above/below, delete entry, edit summary/detail bullets, reorder bullets, add/remove tags, upload/clear company logo. |
| Skills | Add/delete a toolbox and add/delete individual tools. |
| Certifications | Add/delete credential, edit provider, add/clear URL, upload/remove PDF, upload provider logo. |
| Capabilities | Edit text; create a custom canvas copy when a distinct layout is needed. |
| Selected Work | Add/delete/reorder projects; add/remove case-study blocks, technology, delivery; upload image; adjust crop, zoom, ratio, and frame. |
| Writing & Insights | Add/delete/reorder articles; edit source, date, category, preview, body, and destination link. |
| Contact | Edit copy and direct contact information; show/hide/reorder section where allowed. |
| Custom | Create a canvas section, add components, resize/reposition them, group blocks, and save/reuse presets. |

## Text formatting

When a text range is selected in a supported preview field, the floating toolbar can apply bold, italic, underline, smaller, and lead-size tokens. Use these sparingly to preserve the visual system. The editor stores simple markup tokens in content rather than arbitrary rich HTML, so unsupported formatting should not be pasted into text fields.

## Section visibility and ordering

The editor keeps the Home section as the opening section. Other eligible sections can be moved, removed, or hidden. **Hide** keeps the data and editor controls but omits the section and its navigation path from the public portfolio. A hidden section can be shown again later without rebuilding it.

Removing a section from a draft changes that draft only. Use a separate draft to test major structural changes before publishing.

## Custom canvas builder

The custom canvas is suitable for a bespoke section or a safe copy of a known section pattern. Components include title, text, image, button, tag list, statistic, and contact card blocks. Editors can select a block, drag it, resize it, duplicate it, delete it, and use alignment feedback. Shift-click enables multiple block selection for grouped moves/resizes.

Canvas coordinates are designed for desktop composition. The public mobile render stacks the content into a readable single column. Always inspect the mobile fallback before publishing a custom section.

## Media and certificate files

Uploaded files are attached to the current browser draft through a URL. Save or publish after an upload to persist the URL in version history. Removing an image/PDF/link from the draft removes the reference; it does not necessarily delete the original object from storage.

| File type | Where it is used |
|---|---|
| Portrait | Hero circular image. |
| Focus visual | One of the four hero focus cards. |
| Company logo | Experience company presentation. |
| Project image | Selected Work media frame. |
| Provider logo | Certification branding override. |
| Certificate PDF | Hover/focus action and centred in-page document viewer. |
| Canvas image | Image block in a custom canvas section. |

## Exporting

The editor can export the **current in-memory draft**, including unsaved changes. This is useful for an immediate handoff but means an exported file may not correspond to a named version until it is saved first.

| Option | Choose it when… |
|---|---|
| Export HTML | You need a lightweight standalone document for a quick review or manual use. |
| Export ZIP | You need a faithful static public-portfolio package with CSS, JS, media assets, interactions, and local certificate PDFs where accessible. |

Before delivering an export externally, save a named version and verify the ZIP in an offline browser context when certificate availability matters.

## Editor publishing checklist

| Check | Why it matters |
|---|---|
| Save a named version | Makes recovery and comparison possible. |
| Inspect desktop preview | Ensures card positioning, content hierarchy, and project media balance are intentional. |
| Inspect mobile preview | Protects readable stacking and prevents custom canvas or long-text problems. |
| Open the target link/PDF | Confirms destination URLs and certificate viewer data are valid. |
| Confirm public draft designation | Prevents publishing a different draft from the one you reviewed. |
| Publish deliberately | Updates the content visible at `/`. |
