# Reference-Style Redesign Checklist

## Certifications Section

## Interactive Certificate PDF Preview

## In-Page Certificate Viewer

## Certificate Hover Isolation Fix

## Writing & Insights Section

- [x] Add a reusable Writing & Insights section for blog, Medium, and article links.
- [x] Create one clearly labelled sample article card in a Medium-inspired editorial style.
- [x] Add navigation access and responsive layout for the article cards.
- [x] Verify the new section on desktop and mobile, then save a checkpoint.

## Selected Work Realization Blocks

- [x] Define a concise realization outcome for each portfolio project using the existing project descriptions.
- [x] Add a Realization block below What it is in every Selected Work project.
- [x] Adapt the project information layout to the supplied reference while preserving the light blue-and-white portfolio system.
- [x] Verify desktop and mobile layouts, then save a checkpoint.

## Portfolio Admin Editor Planning

- [x] Audit the current portfolio content structure and identify the editable content groups.
- [x] Define the secure admin route, authorization model, and persistence approach.
- [x] Specify text selection, floating formatting controls, responsive editing, previews, and publish workflow.
- [x] Record the implementation phases, acceptance criteria, and decisions requiring confirmation.

## Secure `/edit` Portfolio Editor

- [x] Update the editor plan and route specification from `/admin` to `/edit`.
- [x] Superseded: Confirm the owner’s authenticated session and verify the `/edit` workspace against the live auth boundary; `/edit` now opens directly by request.
- [x] Define and apply the database schema and migration for versioned portfolio content.
- [x] Superseded: Complete final authenticated route verification alongside type checks, unit tests, and production build; direct-access validation now applies.
- [x] Seed the current portfolio content as initial draft and published database versions on the owner’s first editor visit.
- [x] Create owner-only content procedures for public load, editor load, save draft, and publish actions.
- [x] Build the protected `/edit` content editor with selection-aware controls and a floating formatting toolbar.
- [x] Render the constrained bold, italic, underline, and text-size formatting safely on the public portfolio.
- [x] Superseded: Exercise Save draft and Publish from `/edit` through an authenticated session; the route is now direct access.
- [x] Superseded: Complete final authorization verification; the editor now intentionally has no authorization boundary.

## Unauthenticated `/edit` Editor Conversion

- [x] Revise the editor plan from owner-only access to direct public access at `/edit`.
- [x] Replace protected editor content procedures with direct editor access while retaining default seeding, draft saving, and publishing.
- [x] Remove sign-in, role checks, and the dashboard authentication wrapper from the `/edit` interface.
- [x] Verify that `/edit` opens directly and that public content still renders after draft and publish actions.
- [x] Save a distinctive draft change, re-fetch editor content, and confirm the change persists.
- [x] Publish a distinctive visible change, confirm it in inspectable public-page text, then restore and re-verify the original content.

## Direct Editor Continuation — No Authentication

- [x] Keep `/edit` as a direct public route with no sign-in, roles, or authentication controls.
- [x] Add structured controls to duplicate, reorder, and remove editable list items in the direct editor.
- [x] Add a reset-to-saved-draft action and clearer unsaved-change feedback.
- [x] Expand in-context preview selection to more portfolio sections without changing the public design.
- [x] Exercise the updated direct editor controls, save and publish a draft, verify public rendering, then re-check desktop and mobile layouts.

## Full Live Preview Editor — No Authentication

- [x] Render all public portfolio sections in the `/edit` live draft preview.
- [x] Add an Edit section control to Home, About, Experience, Skills, Certifications, Capabilities, Projects, Writing, Contact, and Footer preview areas.
- [x] Enable direct in-place text editing within an active preview section, with clear hover, text-cursor, and selected-section feedback.
- [x] Keep structured controls for cards, tags, images, and list items while routing selected text edits into the live draft state.
- [x] Add labelled thumbnail and URL controls for portrait and project image fields in the direct editor inspector.
- [x] Verify in-place editing, reset, save, publish, and responsive behavior without adding authentication.
- [x] Verify that the active preview text handler writes the selected path and new text into the draft state before final delivery.

## Inspector-Free Public-Layout Editor

- [x] Remove the Content Inspector from `/edit` while retaining direct in-preview editing and save/publish controls.
- [x] Reuse the public portfolio’s desktop header, hero-card composition, spacing, palette, and section visual system in the `/edit` preview.
- [x] Compare the public and editor preview compositions across desktop and mobile viewports.
- [x] Add an in-preview Add tag control in About that appends an editable tag.
- [x] Add an in-preview Add statistic control in About that appends a new editable statistic box.
- [x] Verify direct editing, About additions, save/publish persistence, desktop/mobile behavior, and no authentication.

## Editable Public-Style Home Section

- [x] Reuse the public Home hero’s portrait composition, focus-card visual language, and SVG treatment in the `/edit` preview.
- [x] Add a portrait hover control that opens an image upload flow and writes the resulting storage URL into the draft.
- [x] Add hover controls to each Cloud, DevOps, DevSecOps, and Security & Networking card for replacing its visual from an uploaded image or SVG upload.
- [x] Verify a portrait replacement through draft save, publish, public Home rendering, and restoration.
- [x] Verify the Home portrait and focus-card replacement controls on a mobile `/edit` layout, then confirm the restored public Home remains intact.

- [x] Scope the View certificate reveal to only the matching PDF-enabled card.
- [x] Verify hover and keyboard-focus behavior is independent for every certification card.
- [x] Save a checkpoint containing the fixed interaction.

- [x] Remove the permanent PDF action button from the certificate card.
- [x] Reveal a View certificate action on hover or keyboard focus between the card details and metadata.
- [x] Open the supplied PDF in a centred in-page viewer with a clear close control.
- [x] Verify desktop and mobile interaction, then save a checkpoint.

- [x] Convert the supplied Coursera certificate PDF into a preview image and upload both assets for portfolio use.
- [x] Add hover preview and full-PDF viewing interactions to the supplied certificate card.
- [x] Keep certificates without a provided PDF in the standard static-card presentation.
- [x] Verify the PDF preview interaction on desktop and mobile, then save a checkpoint.

- [x] Extract the actual certifications and providers from Fedi Nasri’s CV.
- [x] Add a light-theme credential heading and responsive certification-card grid.
- [x] Add provider marks and only verified links that are available from the CV.
- [x] Verify the new section on desktop and mobile, then save a checkpoint.

## CV-Led Personalization Checklist

## Reference Background Panel Refinement

## Page-Frame Spacing Refinement

## Reference Section Padding Correction

## Reference Typography Refinement

## UI/UX Readability Audit

## Audit-Driven Refinement Pass

## Experience Timeline Enhancement

## Floating Hero Role-Card Refinement

## Four-Card Hero Layout Correction

## Hero Arc Composition Refinement

## Hero Composition Polish

## Manual Focus-Card Position Adjustment

## Visual-Editor Repair

## Second Visual-Editor Repair

## Raised Focus-Card Redesign

## DevOps SVG Refinement

## Blue Infinity Logo Simplification

## DevSecOps SVG Integration

- [x] Adapt the supplied shield-and-infinity SVG into a compact icon without its dark backdrop or small unreadable labels.
- [x] Replace the current DevSecOps visual with the adapted SVG inside the raised card.
- [x] Verify the adapted SVG at desktop and mobile size, then save a checkpoint.

- [x] Replace the detailed DevOps illustration with a clean blue infinity logo-only SVG.
- [x] Verify the simplified logo in the raised card and save a checkpoint.

- [x] Replace the current DevOps infinity mark with a more expressive custom SVG.
- [x] Verify the revised DevOps visual remains crisp within the raised-card system, then save a checkpoint.

- [x] Restyle the focus cards as large white rounded cards with an inset pale-blue visual window.
- [x] Apply the reference-style floating pill label and soft shadow without obscuring the card visuals.
- [x] Verify desktop and mobile card presentation, then save a checkpoint.

- [x] Remove the second set of malformed duplicate inline style attributes.
- [x] Translate the valid card-height and spacing intent into stable CSS offsets.
- [x] Verify the repaired hero layout and create a checkpoint.

- [x] Remove duplicate and invalid inline style attributes from the hero focus cards.
- [x] Apply the valid upward/right and vertical placement intentions through stable CSS rules.
- [x] Verify the repaired desktop and mobile hero layout, then save a checkpoint.

- [x] Shift the targeted hero-card group slightly upward and to the right.
- [x] Verify the revised hero balance and save a checkpoint.

- [x] Rebalance the four hero focus cards into a visually even orbit around the portrait.
- [x] Refine the DevOps card into a continuous blue-violet-warm gradient infinity loop.
- [x] Verify the refined hero composition on desktop and mobile, then save a checkpoint.

- [x] Arrange the four focus cards in a balanced arc around the portrait without overlap.
- [x] Replace the DevOps visual with a clear infinity-loop design.
- [x] Verify the arc composition on desktop and mobile, then save a checkpoint.

- [x] Remove the floating animation that causes role-card label overlap.
- [x] Create four larger, clearly separated role cards for Cloud, DevOps, DevSecOps, and Security & Networking.
- [x] Verify every visual and label is visible on desktop and mobile, then save a checkpoint.

- [x] Move the circular portrait slightly upward and centre it within the hero composition.
- [x] Restyle the role cards as floating white cards with pill labels beneath the visual area.
- [x] Update the role titles to Cloud & DevOps, Networking & Security, and DevSecOps.
- [x] Add subtle staggered floating motion and verify desktop/mobile presentation.

- [x] Add a vertical blue timeline spine and milestone circles to the experience entries.
- [x] Use a filled, haloed marker to distinguish the current or most recent experience entry.
- [x] Verify the desktop and mobile timeline layout, then save a checkpoint.

- [x] Create consistent cloud, network, Linux, and DevOps project visuals for all featured case studies.
- [x] Improve small-text scale, supporting-copy contrast, labels, tags, and contact details.
- [x] Make mobile icon controls and role cards easier to read and interact with.
- [x] Refine the personal wordmark and hero connector motif; replace placeholder availability language.
- [x] Verify desktop and mobile refinement results, then save a checkpoint.

- [x] Capture the current portfolio at desktop and mobile sizes.
- [x] Review typography, readability, information density, hierarchy, and accessibility risks.
- [x] Deliver a prioritized UI/UX report with practical recommendations.

- [x] Match the supplied screenshots’ type family, text sizing, weights, line heights, and label treatment.
- [x] Apply the typography system consistently to the hero, About, experience, projects, skills, capability, and contact sections.
- [x] Verify desktop and mobile readability, then save a checkpoint.

- [x] Remove the global 56px inner frame padding and 283px desktop side margin.
- [x] Apply the reference-style 100px vertical and 56px horizontal padding to portfolio sections.
- [x] Verify the corrected spacing at desktop width and save a checkpoint.

- [x] Distinguish the browser-inspector overlay colors from the actual reference-site visual treatment.
- [x] Confirm whether the requested change is the 24px outer frame, a blue visual theme, or both.
- [x] Apply the confirmed page-frame treatment and verify it on desktop and mobile.

- [x] Inspect the reference site’s background layers and white information-card structure.
- [x] Add matching pale background depth and white information panels to the personalized hero and content sections.
- [x] Verify the refinement on desktop and mobile, then save a checkpoint.

- [x] Extract the name, title, biography, experience, education, skills, and contact facts from the supplied CV.
- [x] Upload the supplied professional photo for portfolio use.
- [x] Confirm missing social links, target role, availability, and project-selection preferences.
- [x] Replace the previous identity, portrait, copy, project content, and contact links with Fedi Nasri's details.
- [x] Verify the personalized desktop and mobile portfolio, then save a delivery checkpoint.

- [x] Re-map the reference hero into a white, portrait-led three-column composition.
- [x] Replace the editorial paper and cobalt system with the reference's clean white, pale-blue, and royal-blue palette.
- [x] Rebuild navigation, cards, section spacing, and rounded surfaces to mirror the reference rhythm.
- [x] Preserve Ala Din Habibi's existing content while presenting it in the new visual system.
- [x] Verify desktop and mobile fidelity against the supplied reference.
- [x] Save and deliver a revised checkpoint.

## Centred Experience Editor Enhancement

- [x] Centre the `/edit` live draft preview within the editor workspace while preserving responsive width and clear section controls.
- [x] Render the Experience editing view with the public portfolio’s timeline structure, visual hierarchy, spacing, and milestone styling.
- [x] Add in-preview actions to insert an editable experience template immediately above or below every existing experience entry.
- [x] Make every template field and its tags editable in place, including an action to append an editable tag.
- [x] Verify desktop and mobile editing, draft/save/publish persistence, public rendering, automated tests, and production build before checkpointing.

## Mobile Live Preview Repair

- [x] Restore the single-column Home preview layout at mobile widths so the portrait and focus cards do not overflow beside the copy card.

## Experience Current Marker Order

- [x] Keep the filled blue timeline marker on the topmost Experience entry, including after adding a new entry above it, while all later entries use outlined markers.

## Experience Deletion Control

- [x] Add a direct Delete experience action for every editable Experience entry, disabling it when only one entry remains.
- [x] Verify a new Experience template and tag through the live `/edit` Save draft and Publish controls, confirm public rendering, then restore the original two-entry content.

## Experience Tag Deletion Control

- [x] Add a direct Delete tag action for each tag in an active Experience entry, including the final tag when an entry should have none.

## Skills & Toolbox Management Controls

- [x] Add a new editable toolbox category from the active Skills & Toolbox editor.
- [x] Add an editable tool inside each existing toolbox category.
- [x] Add direct deletion controls for individual tools, including the final tool when a category should be empty.
- [x] Add a direct delete control for each toolbox category, disabling it when only one category remains.
- [x] Verify toolbox and tool additions/deletions through the live editor, persistence flow, responsive layout, tests, build, and restoration before checkpointing.

## About Tags and Statistics Management

- [x] Add a direct Delete tag control for every editable About tag.
- [x] Add a direct Delete statistic control for every editable About statistic box.
- [x] Centre incomplete About statistic rows so one, two, or three boxes remain centred, with four boxes occupying a full row.
- [x] Verify About additions/deletions, responsive statistic centring, draft persistence, tests, build, and restoration before checkpointing.

## About Control Spacing Repair

- [x] Separate the About add-control row from the per-statistic delete controls so they do not overlap on desktop or mobile.

## Public-Style Editable Home Composition

- [x] Reuse the public Home hero frame, copy card, portrait scale, connector motif, and focus-card orbit in the active `/edit` Home preview.
- [x] Preserve in-place Home text editing plus portrait and focus-card visual replacement controls in the matched public composition.
- [x] Verify desktop and mobile visual fidelity, editing/upload controls, persistence, tests, build, and restoration before checkpointing.

## Public-Style Editable About Composition

- [x] Reuse the public About heading, two-column copy layout, tag treatment, and statistic-card system in the active `/edit` About preview.
- [x] Preserve direct in-place About text editing plus tag/statistic add and delete controls in the matched public composition.
- [x] Verify desktop and mobile visual fidelity, About management controls, persistence, tests, build, and restoration before checkpointing.

## About Statistic Visual-Parity Repair

- [x] Make editable About statistic values use the public page’s large blue display-number typography and matching card hierarchy.
- [x] Verify desktop and mobile visual parity between public and editable About statistic cards without disrupting edit controls.
- [x] Match the public mobile About statistic layout with two cards per row and 29px blue display values at phone widths.

## Public-Style Editable Selected Work Composition

- [x] Reuse the public Selected Work heading, project-card media layout, metadata, and Problem / What it is / Realization structure in the active `/edit` preview.
- [x] Preserve direct in-place Selected Work text editing in the matched public composition.
- [x] Verify desktop and mobile visual fidelity, direct editing, persistence, tests, build, and restoration before checkpointing.

## Selected Work Management Controls

- [x] Add a new editable project template from the active Selected Work editor.
- [x] Add a per-project image upload control that persists its storage URL to the draft.
- [x] Add and delete individual Tech Stack items and Delivery items within each project.
- [x] Add and delete individual Problem, What it is, and Realization case-study blocks within each project.
- [x] Add direct project deletion, retaining at least one project in the Selected Work list.
- [x] Add move-up and move-down controls to reorder projects in the live preview.
- [x] Verify all project management controls through live save/publish/public restoration, desktop/mobile layout, tests, and production build before checkpointing.

## Skills Mobile Verification Follow-up

- [x] Verify Skills & Toolbox add/delete controls and layout at a mobile `/edit` viewport, then re-confirm the restored public Skills section before checkpointing.

## Public-Style Editable Certifications Composition

- [x] Reuse the public Certifications heading, credential-card layout, provider marks, metadata, hover state, and certificate-view affordance in the active `/edit` preview.
- [x] Preserve direct in-place editing for every available credential field inside the matched public composition.
- [x] Verify public-layout parity, certificate viewing, desktop/mobile behavior, automated tests, and production build before checkpointing.

## Certifications Management Controls

- [x] Add a new editable certificate template from the active Certifications editor.
- [x] Add direct certificate deletion controls while retaining at least one credential.
- [x] Add per-certificate PDF upload with persisted storage URL and in-page viewer support.
- [x] Add a direct editable external certificate link per credential.
- [x] Add a per-certificate provider branding control supporting built-in Cisco, IBM, and Microsoft marks, a custom logo URL, or editable provider text.
- [x] Centre incomplete certificate rows after the first five-card row on desktop and preserve responsive wrapping.
- [x] Verify certificate management, saved draft and publish persistence, public rendering, desktop/mobile layout, tests, and production build before checkpointing.

## Certificate Provider Brand Library

- [x] Add curated Cloud, DevOps, security, container, networking, and infrastructure provider options to the editable certificate selector.
- [x] Add distinct compact text-logo treatments for Coursera and KodeKloud alongside the established Cisco, IBM, and Microsoft marks.
- [x] Preserve custom provider text and uploaded-logo options in both the public portfolio and live editor preview.
- [x] Verify provider switching, desktop/mobile display, tests, and production build before checkpointing.

## Certificate Branding and Attachment Cleanup

- [x] Ensure the Microsoft provider always displays a clear compact mark or text treatment in the public portfolio and `/edit` preview.
- [x] Add a direct per-certificate control to remove the uploaded PDF reference from the draft.
- [x] Add a direct per-certificate control to clear the external credential link from the draft.
- [x] Verify provider visibility, removal behavior, persistence, tests, and production build before checkpointing.

## Public-Style Editable Writing & Insights Composition

- [x] Reuse the public Writing & Insights heading, horizontal article-row layout, metadata chips, future-entry treatment, and reader affordance in the active `/edit` preview.
- [x] Preserve direct in-place editing for every available Writing & Insights field within the matched public composition.
- [x] Verify direct editing, article reader behavior, desktop/mobile presentation, automated tests, and production build before checkpointing.

## Writing & Insights Management Controls

- [x] Add a new editable featured-article template from the active Writing & Insights editor.
- [x] Add direct article deletion controls while retaining at least one Writing & Insights entry.
- [x] Add an editable external article link and make the article action navigate to it when present.
- [x] Add move-up and move-down controls to reorder articles in the live editor.
- [x] Replace the card’s upper date display with editable site-name metadata and place the editable posting date below each article title.
- [x] Verify article navigation, additions, deletion safeguards, ordering, metadata layout, draft persistence, desktop/mobile behavior, tests, and production build before checkpointing.

## Writing Article Metadata Alignment

- [x] Keep the article category, read-time, and action button in a protected right-side metadata column on desktop, even for long titles.
- [x] Preserve readable title wrapping in the left content column without allowing it to push metadata below the title.
- [x] Preserve the intentional stacked mobile metadata layout and verify editor controls, tests, and production build before checkpointing.

## Public-Style Editable Navigation Header

- [x] Align the `/edit` navigation header structure, spacing, and label placement with the public portfolio view.
- [x] Restore the public header’s separate compact theme control and compact Let’s talk call-to-action treatment in `/edit`.
- [x] Verify desktop/mobile header parity, keyboard interaction, tests, and production build before checkpointing.

## Public Contact Form Removal

- [x] Remove the public contact form from the contact section.
- [x] Preserve direct contact information and actionable email, phone, LinkedIn, and GitHub paths.
- [x] Rebalance the public and editable contact layouts after form removal, then verify tests and production build before checkpointing.

## Public Contact Card Refinement

- [x] Rebuild the public Contact section using the structured heading-and-contact-card composition from the editable preview.
- [x] Preserve direct email, phone, location, LinkedIn, and GitHub actions within the refined layout.
- [x] Verify desktop/mobile layout parity, automated tests, and production build before checkpointing.

## Portfolio Section Management Controls

- [x] Add persistent section ordering so the public portfolio and `/edit` preview use the same saved sequence.
- [x] Add move-up and move-down controls to reorder eligible sections from the live editor.
- [x] Add an optional-section template workflow for inserting a new portfolio section into the chosen position.
- [x] Add safe deletion controls for removable sections while preserving essential structural sections.
- [x] Verify section ordering, insertion, deletion safeguards, draft/publish persistence, public rendering, responsive behavior, tests, and production build before checkpointing.

## Draggable Home Focus Cards

- [x] Add persisted per-card placement coordinates for the four Home focus cards.
- [x] Add direct pointer drag controls for focus cards in the active Home editor preview.
- [x] Apply saved focus-card placement to the public desktop hero after Save draft and Publish, while preserving a readable mobile fallback.
- [x] Verify drag interactions, saved placement, public rendering, responsive behavior, tests, and production build before checkpointing.

## Focus-Card Overlay Repair

- [x] Prevent the Home focus-card visual-replacement control from obscuring artwork or labels while a card is being repositioned.
- [x] Verify focus-card dragging and replacement controls on desktop and mobile, then run tests and a production build before checkpointing.

## Focus-Card Layout Reset

- [x] Add an active-Home editor action that restores all four focus cards to the default saved arrangement.
- [x] Verify the reset action leaves other draft content unchanged, supports a subsequent drag, and passes desktop/mobile, tests, and production build checks before checkpointing.

## Expandable Experience Details

- [x] Add a right-aligned View details / Hide details control to each public and editable Experience entry.
- [x] Add expandable per-entry detail bullet points using the existing portfolio visual system.
- [x] Add direct `/edit` controls to add, edit, and delete detail bullet points for every Experience entry.
- [x] Verify public expansion, editor management, draft persistence, responsive presentation, tests, and production build before checkpointing.

## Experience Two-State Refinement

- [x] Keep date, company, concise description, and tags visible in the collapsed Experience state.
- [x] In the expanded Experience state, hide the concise description and present visible-bullet details above the tags.
- [x] Replace the current detail control with a clearer, polished disclosure design and smooth expand/collapse motion.
- [x] Add optional per-experience company logo upload and rendering without requiring a logo.
- [x] Add direct drag-to-reorder controls for Experience detail bullets in the active `/edit` preview.
- [x] Verify public/editor state transitions, logo fallback/upload, detail reordering, responsive behavior, tests, and production build before checkpointing.

## Experience Tag Placement and Detail Markers

- [x] Place collapsed-state Experience tags beneath the complete entry content instead of a separate right-side tag column.
- [x] Add an explicit blue bullet marker design for expanded Experience responsibility items in public and editable views.
- [x] Verify the refined public/editor layout on desktop and mobile, then run tests and a production build before checkpointing.

## Experience Tag Visual Polish

- [x] Refine the Experience technology-tag grouping, surfaces, spacing, and wrapping in public and editable views.
- [x] Verify desktop/mobile tag readability and interaction controls, then run tests and a production build before checkpointing.

## Experience Tag Spacing Correction

- [x] Reduce the vertical space and divider separation between the collapsed Experience summary and its technology-tag group.
- [x] Verify the tightened desktop/mobile Experience spacing, then run tests and a production build before checkpointing.

## Reversible Section Visibility

- [x] Add persisted section visibility preferences that keep hidden sections in the direct editor.
- [x] Add Hide / Show controls for every eligible section in `/edit` without changing the section’s content or ordering.
- [x] Omit hidden sections from the public page and public navigation, while allowing them to be restored in `/edit`.
- [x] Verify hide/show behavior, draft/save persistence, public navigation, responsive layout, tests, and production build before checkpointing.

## Multi-Draft Portfolio Workspace

- [x] Define persisted portfolio draft records, human-readable draft names, version history, and a selected public draft.
- [x] Add direct editor operations to create, save, load, duplicate, rename, and safely delete drafts.
- [x] Add a draft sidebar that lists available drafts, selected draft state, version history, and creation/deletion controls.
- [x] Allow the user to choose the public draft without losing other drafts or their versions.
- [x] Keep the current public portfolio content safe throughout draft testing and restoration.
- [x] Verify multi-draft persistence, version history, public selection, deletion safeguards, responsive behavior, tests, and production build before checkpointing.

## Draft History Refinements

- [x] Add restore-as-new-version so an older snapshot can become a new immutable version without overwriting history.
- [x] Store and edit optional descriptive notes for each individual draft version.
- [x] Add case-insensitive draft library search and status filtering for fast draft discovery.
- [x] Verify restored content, version notes, draft filtering, responsive editor behavior, tests, and production build before checkpointing.

## Custom Section Canvas Builder

- [x] Define reusable, persisted canvas components for custom portfolio sections.
- [x] Add customizable section templates that can reuse title and text components from the portfolio design system.
- [x] Add a right-side component palette for title and text boxes.
- [x] Add pointer drag placement with live pixel-position guides for selected canvas components.
- [x] Add pointer resizing for title and text component dimensions with visible measurement feedback.
- [x] Render saved custom-section content safely in the public portfolio with a readable responsive fallback.
- [x] Verify canvas creation, component reuse, drag/resize persistence, mobile behavior, tests, and production build before checkpointing.

## Expanded Canvas Component Library

- [x] Add reusable existing-portfolio block templates to the canvas component library.
- [x] Add image and action-button components with direct editing and public rendering.
- [x] Add snap-to-grid and alignment-guide feedback for accurate block positioning.
- [x] Add per-block duplicate and delete controls while preserving the selected layout state.
- [x] Add custom-layout editing support that applies reusable patterns from existing sections without changing their saved content until explicitly used.
- [x] Verify extended canvas interactions, persisted public rendering, responsive behavior, tests, and production build before checkpointing.

## Advanced Canvas Editing

- [x] Repair reusable canvas block deletion and cover the regression.
- [x] Add multi-select, grouped movement, and group resizing for canvas blocks.
- [x] Add persisted reusable canvas layout presets with save and apply controls.
- [x] Add a direct existing-section action that opens a protected canvas editing mode for that section.
- [x] Verify advanced canvas controls, preset persistence, direct section editing, responsive behavior, tests, and production build before checkpointing.

## Canvas Image Upload

- [x] Add direct image-file upload from a selected canvas image block.
- [x] Persist the uploaded image URL into the active draft while retaining manual URL entry.
- [x] Add upload progress and error feedback without disrupting canvas selection or editing.
- [x] Verify image upload, draft persistence, responsive behavior, tests, and production build before checkpointing.

## Alternating Selected Work Layout

- [x] Restyle public Selected Work projects as alternating left/right image-and-details feature rows.
- [x] Refine project title, metadata, case-study blocks, stack, and delivery presentation to follow the supplied reference’s compact hierarchy.
- [x] Mirror the alternating project presentation in the editable live preview without removing existing project controls.
- [x] Verify public/editor desktop and mobile layouts, regression tests, and production build before checkpointing.

## Selected Work Media Column Consistency

- [x] Lock every project visual to the same compact media-column width in alternating rows.
- [x] Preserve the larger text/details column for both left- and right-aligned project visuals.
- [x] Verify public/editor desktop and mobile layout consistency, tests, and production build before checkpointing.

## Selected Work Image Focal Point

- [x] Add persisted X/Y focal-point data for each project image.
- [x] Add an in-preview image focal-point picker that lets the user position the crop cursor over an image.
- [x] Apply the saved focal point to project-image cropping in both public and editable previews.
- [x] Verify focal-point editing, persistence, responsive behavior, tests, and production build before checkpointing.

## Selected Work Image Zoom and Reset

- [x] Add a persisted per-project image zoom level with safe default sizing.
- [x] Add in-preview zoom controls that work alongside the focal-point picker.
- [x] Add a Reset position action that clears a project’s custom focal point and returns its crop to centre.
- [x] Verify zoom, reset, public rendering, responsive behavior, tests, and production build before checkpointing.

## Project Image Crop and Frame Controls

- [x] Prevent zoom-out from revealing blank space by enforcing the fitted image size as the minimum zoom.
- [x] Add precise zoom plus/minus controls, mouse-wheel zooming, and keyboard adjustment for image position.
- [x] Add saved project-image aspect-ratio choices for portrait, square, standard, and widescreen frames.
- [x] Add a directly resizable image frame with an accessible resize handle and saved dimensions.
- [x] Apply saved crop, ratio, and frame dimensions consistently in public and editable project rows.
- [x] Verify crop safety, interactions, responsive behavior, tests, and production build before checkpointing.

## Project Image Control Layout Repair

- [x] Remove project image controls from the editor workspace flow so they cannot squeeze the live preview.
- [x] Present project image controls in a responsive, non-intrusive overlay or drawer.
- [x] Restore consistent media sizing and vertical alignment in public and editable Selected Work rows.
- [x] Verify desktop/mobile layout, regression tests, and production build before checkpointing.

## Reversed Project Media Inset

- [x] Add balanced inner spacing to right-aligned project media in alternating Selected Work rows.
- [x] Preserve matching media dimensions and readable text width in public and editable previews.
- [x] Verify desktop/mobile balance, tests, and production build before checkpointing.

## Portfolio HTML and ZIP Export

- [x] Generate a portable standalone HTML export from the active portfolio draft.
- [x] Package exported HTML and required portfolio assets into a downloadable ZIP archive.
- [x] Add clear direct-editor export actions and download feedback.
- [x] Verify exported files, asset references, tests, and production build before checkpointing.
