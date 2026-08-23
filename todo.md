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

## Faithful Static Public ZIP Export

- [x] Replace the simplified ZIP export page with a faithful static rendering of the public portfolio.
- [x] Include offline HTML, CSS, JavaScript interactions and animations, and local exported assets.
- [x] Preserve public navigation, certificate interactions, experience disclosure, and project image presentation in the static package.
- [x] Verify ZIP structure, offline behavior, responsive rendering, tests, and production build before checkpointing.

## Local Certificate PDFs in Static ZIP Export

- [x] Download certificate PDFs into a local assets folder inside the static ZIP export.
- [x] Rewrite exported certificate viewer paths to use their packaged local PDF files.
- [x] Verify local certificate PDFs, offline viewer behavior, ZIP structure, tests, and production build before checkpointing.

## Vercel Deployment

- [x] Review the connected Vercel workspace and this app’s production requirements.
- [x] Prepare Vercel serverless routing and environment configuration for the full editor application.
- [x] Adapt draft persistence for the selected Vercel-connected database.
- [x] Adapt uploads and asset reads for Vercel Blob storage.
- [x] Configure secure Vercel production values for the database, Blob storage, and application runtime.
- [x] Deploy the public portfolio and direct `/edit` editor to the existing Vercel project.
- [x] Verify public, editor, draft persistence, and upload flows in production and share the live URL.

## Documentation for Developers, Editors, and AI Agents

- [x] Create a documentation index that explains the portfolio’s documentation map and intended audiences.
- [x] Document the full-stack architecture, data model, storage path, API boundary, and Vercel serverless adapter.
- [x] Document page, component, editor-canvas, and export workflows with source-file ownership.
- [x] Document the UI/UX design system, including visual tokens, layout rules, typography, interactions, responsive behavior, and accessibility expectations.
- [x] Document local development prerequisites, installation, database workflow, test commands, build commands, and debugging guidance.
- [x] Document production deployment, environment-variable responsibilities, database and storage setup, migrations, and post-deployment verification.
- [x] Document the direct `/edit` editor workflow, including drafts, history, public selection, custom canvas layouts, and export.
- [x] Validate all documentation against the current implementation, run checks, and save a checkpoint.

## AI Context for Future Agents

- [x] Create an `ai-context/` index with a mandatory agent onboarding and update protocol.
- [x] Add a concise project brief covering product purpose, audience, functional scope, non-negotiable requirements, and key routes.
- [x] Add a current-work ledger for active priorities, paused work, next actions, validation state, and ownership rules.
- [x] Add an architecture and code map linking data models, public/editor UI, API, storage, export, tests, and deployment adapters.
- [x] Add dedicated technical architecture, database schema/lifecycle, and UI/UX design-system context records for future agents.
- [x] Add decision, issue, and change-history records that distinguish facts, active risks, resolved work, and intentionally deferred items.
- [x] Validate the AI context against existing project documentation and save a checkpoint.

## AI Context Prompt and Detailed Architecture Diagram

- [x] Add a reusable system prompt that instructs future AI agents to read and maintain the AI context before and after project work.
- [x] Add an explicit architecture diagram and explanation for public/editor frontend, tRPC/Express backend, draft database, asset storage, and certificate PDF flow.
- [x] Cross-link the AI-context diagram with the existing full project architecture documentation and validate the new materials.

## Beginner-Friendly Vercel Deployment Guide

- [x] Create a step-by-step Vercel deployment guide explaining required services, provider compatibility, environment variables, deployment, migrations, storage, and verification in beginner-friendly language.
- [x] Link the new guide from the main documentation index and validate it against the current Vercel configuration and paused deployment state.

## Non-Deployment Improvement Review

- [x] Review the current public portfolio, editor workflow, technical risks, and documentation to identify the highest-value non-deployment improvements while Vercel remains paused.
- [x] Present prioritized, actionable improvement options and wait for the user’s selected direction before implementation.

## Documentation and AI-Agent Continuous Development Review

- [x] Review the existing documentation and AI-context system for gaps in agent onboarding, decision traceability, validation, and continuous maintenance.
- [x] Present prioritized documentation and agentic-workflow recommendations without implementing them until the user selects a direction.

## Expanded AI Context Architecture and Quality Plan

- [x] Create a standalone comprehensive Markdown architecture diagram covering frontend, backend, database, asset storage, certificate PDFs, export, and paused deployment boundaries.
- [x] Add a worked example showing how an AI agent reads, plans, implements, validates, documents, and checkpoints a new feature request.
- [x] Organize the project-relevant design and full-stack capability guidance for future AI agents.
- [x] Propose a concrete automated testing and continuous-integration plan with phases, checks, ownership, and implementation prerequisites.
- [x] Validate the new AI-context materials, cross-links, and CI plan against the current codebase before checkpointing.

## Dark-Mode Hero Focus-Card UX Repair

- [x] Audit the dark-mode Home hero focus-card labels, visual surfaces, borders, shadows, connector details, and hover/focus hierarchy against the reported screenshot.
- [x] Correct dark-mode focus-card contrast and visual hierarchy while preserving the light-mode design and editable preview parity.
- [x] Verify the corrected hero in dark mode at desktop and mobile sizes, run relevant regression checks, and save a checkpoint.

## Security & Networking Focus-Card Artwork Repair

- [x] Audit the Security & Networking network illustration for clipping, visual-centre alignment, and consistency with the other Home focus-card artwork.
- [x] Correct the network illustration’s framing in public and editor hero cards without changing the shared card shell, caption treatment, or saved position behavior.
- [x] Verify light/dark desktop and responsive focus-card presentation, run relevant checks, and save a checkpoint.

## UI and UX Improvement Review — Vercel Paused

- [x] Review the current portfolio and direct editor to identify the highest-value visual, usability, accessibility, and content-flow improvements without resuming Vercel work.
- [x] Present prioritized UI/UX recommendations and wait for the user to choose before implementation.

## Visual Form, Background, and Color Direction Review

- [x] Review the portfolio’s section shapes, background layers, color rhythm, and decorative geometry without changing the site.
- [x] Present coherent visual-form and background/color directions for the user to select before implementation.

## Free-Tier Vercel Deployment Walkthrough

- [x] Review and present the project-specific Vercel deployment URL, free-tier services, environment variables, database/storage compatibility requirements, and step-by-step verification guidance without initiating deployment.

## Mermaid Architecture Diagram Rendering Repair

- [x] Replace unsafe Mermaid route labels in architecture documentation with renderer-safe text and validate all related diagrams.

## Vercel-Neon Database Compatibility Decision

- [x] Confirm whether to port the current MySQL/TiDB application to PostgreSQL for Neon or instead use a MySQL-compatible database before connecting the Vercel project.

## Neon PostgreSQL Connection and Compatibility

- [x] Confirm the Neon database `neon-citrine-mountain` was created on the Free plan; do not copy database secrets from the provider interface.
- [x] Connect the Neon database to the `portfolio` Vercel project with the final `DATABASE_URL` variable name and confirm the integration-created variable without revealing its value.
- [x] Port the application’s MySQL/TiDB database layer, Drizzle dialect, migrations, and persistence tests to PostgreSQL before configuring the direct editor to use Neon.

## Provider-Neutral PostgreSQL Database Port

- [x] Audit MySQL-specific drivers, schema types, raw queries, migration configuration, and persistence tests for PostgreSQL conversion.
- [x] Convert Drizzle schema, database client, and migration configuration to standard PostgreSQL-compatible implementations, without coupling application code to Neon.
- [x] Generate and review provider-neutral PostgreSQL migration SQL, apply it to the currently connected PostgreSQL database, and verify schema presence.
- [x] Verify editor draft save, restore, publish, and public content read flows against PostgreSQL before any production deployment.
- [x] Create a Vercel Preview deployment and exercise PostgreSQL persistence with a disposable draft while preserving the Main public draft and production boundary.
- [x] Reconcile the existing Vercel project’s connected Git source and build target with the checkpointed portfolio repository before requesting a Preview deployment.
- [x] Commit and push the checkpointed portfolio source to `Fedi-Nasri/Portfolio` on the approved `deployment_versel` branch without changing `main`.
- [x] Configure Vercel to build `deployment_versel` as a Preview-only deployment and verify the portfolio UI before writing any disposable editor data.
- [x] Expose the CommonJS Vercel API bridge through a Vercel-recognized `.js` function so Preview `/api/trpc` does not fall through to the SPA.
- [x] Fix the Vercel Preview `/edit` loading state by making deployed tRPC requests reach the serverless application.
- [x] Restore local `/edit` persistence when the sandbox lacks a usable PostgreSQL `DATABASE_URL`, without weakening deployed PostgreSQL requirements.
- [ ] Restore Preview rendering for the remaining legacy portrait, project, logo, and certificate media currently referenced through historical `/manus-storage` URLs. One private-draft project-image migration is verified; Main remains unchanged.
- [x] Superseded: Vercel Production intentionally tracks `deployment_versel`; require explicit user approval immediately before every push to that branch.
- [x] Add a PostgreSQL media metadata library for uploaded images and PDFs, with object storage holding the file bytes and the database holding file records.
- [ ] Replace historical Preview media references with an object-storage-compatible delivery path while preserving existing portfolio content URLs where feasible.
- [x] Provision or connect a Vercel Blob store for `deployment_versel` and record only Blob object metadata in PostgreSQL.
- [x] Add a migration, tRPC media API, and editor workflow for Vercel Blob image/PDF uploads without storing file bytes in database rows.

## Approved Provider-Neutral MySQL/TiDB to PostgreSQL Conversion

- [x] Preserve the direct `/edit` data model and public portfolio behavior while converting the database implementation to PostgreSQL.
- [x] Replace MySQL/TiDB-specific Drizzle imports, driver configuration, schema types, and upsert behavior with PostgreSQL equivalents.
- [x] Generate, inspect, and safely apply the PostgreSQL schema to the configured provider only after regression validation and migration review.
- [x] Validate all existing draft, version-history, public-selection, upload-reference, export, and direct-editor persistence tests after the port.

- [x] Update developer, deployment, and AI-context documentation to describe PostgreSQL as the general technology and Neon only as the currently connected hosting option.

## Branch Comparison: Development Baseline and `deployment_versel`

- [x] Identify the prior development baseline and compare it with `deployment_versel` without modifying either branch.
- [x] Summarize the resulting deployment, database, media, API, and documentation differences in plain language.

## Stable Development and Vercel Deployment Documentation

- [x] Define `main` as the stable development branch and `deployment_versel` as the Vercel-connected deployment branch, including ownership and safety boundaries.
- [x] Create a `docs/vercel-deployment/` documentation suite with a beginner guide, detailed deployment runbook, Vercel services guide, project URLs, and environment-variable responsibilities.
- [x] Document safe procedures for Vercel changes, including PostgreSQL database changes, Vercel Blob media, custom domains, environment variables, deployment verification, and rollback.
- [x] Document the development workflow for new features, files, database tables, Blob assets, migrations, testing, checkpoints, and handoff from `main` to `deployment_versel`.
- [x] Update the `docs/` index and `ai-context/` records so future agents understand the branch flow, service architecture, current safeguards, and documentation maintenance process.
- [x] Validate the documentation structure and internal links, then checkpoint the completed documentation update.

## Vercel Media Upload Reliability

- [x] Prepare oversized editor image uploads in the browser before Base64 tRPC transport so Vercel request-size limits do not reject otherwise valid portfolio media.
- [x] Preserve original image dimensions and avoid modifying images that already fit the safe upload budget.
- [x] Add regression coverage for upload preparation and verify the remaining legacy media only in private Draft 2 before any public-selection decision.

## Vercel API Bridge Documentation and Main Sync

- [x] Document the Vercel API bridge problem, the role of `api/[...path].js`, the CommonJS packaging choice, and the tRPC routes it enables.
- [x] Synchronize the Vercel deployment documentation suite and API-bridge explanation from `deployment_versel` into the stable `main` branch without changing application deployment settings.
- [x] Validate documentation links and commit the documentation-only updates on both branches.

## AI Context: API Bridge and Branch Documentation Sync

- [x] Record the deployed API bridge purpose, prior routing/module failures, generated-artifact maintenance rule, and Preview verification evidence in `deployment_versel` AI context.
- [x] Record the documentation synchronization to `main`, explicitly distinguishing copied documentation from the Vercel-only application implementation on `deployment_versel`.
- [x] Synchronize the relevant AI-context records into `main`, validate cross-links, and commit the documentation-only updates on both branches.

## Approved Vercel Production Branch Policy

- [x] Set the Vercel project Production Branch to `deployment_versel` after the user’s explicit confirmation, without promoting an existing deployment.
- [x] Verify the saved Vercel setting and update the branch workflow, Vercel handbook, and AI context to state that future Production deployments originate from `deployment_versel`.

## Single-Source Development Workflow and Local Docker Compose

- [x] Define a one-working-branch workflow so normal development stays on `main` and only an explicitly approved release commit reaches `deployment_versel`.
- [x] Add a Docker Compose configuration for local PostgreSQL-backed development without replacing Vercel’s managed Production services.
- [x] Add safe local environment templates and Compose usage documentation without committing credentials or Vercel secrets.
- [x] Validate the Compose configuration structure and the existing TypeScript, test, and production-build checks before checkpointing.
- [x] Keep this implementation local-only: do not change Vercel settings, production data, domains, secrets, or push to `deployment_versel`.
- [x] Synchronize the local-only Compose workflow and documentation to GitHub `main` without creating a Production deployment.

## Release, Environment, and Media Operations Guide

- [x] Document the exact approved release sequence from `main` to `deployment_versel`, including comparison, validation, approval, push, and Production verification.
- [x] Document first-time local Docker Compose startup, migration, stop, reset, and troubleshooting steps.
- [x] Add a safe complete environment reference that explains every local and Vercel environment-variable name, source, scope, and handling rule without committing real credentials.
- [x] Document the local-versus-Vercel lifecycle for images, PDFs, and SVGs, including development asset preparation, Blob upload, PostgreSQL metadata, draft use, release, and historical-media boundaries.
- [x] Cross-link the new operations guides, validate all instructions against the existing configuration, and checkpoint the documentation-only update.
- [x] Synchronize the release, environment, and media operations documentation to GitHub `main` without creating a Production deployment.
- [x] Correct the remaining Vercel handbook wording that incorrectly describes the Production release handoff as a Preview action.
- [x] Synchronize the corrected Vercel Production wording to GitHub `main` without touching `deployment_versel`.

## Isolated Public Motion Prototype

- [x] Study the reference portfolio’s page-load and scroll-reveal motion and define an accessible public-view animation scope.
- [x] Create a dedicated feature branch from stable `main`; do not modify or push to `deployment_versel` during the prototype.
- [x] Implement the approved loading and scroll-reveal motion for the public portfolio while preserving direct-editor functionality.
- [x] Verify desktop and mobile motion, `prefers-reduced-motion`, TypeScript, tests, build, and visual behavior before checkpointing.
- [x] Present the isolated branch for review before any merge to `main` or explicitly approved Production release.

## Isolated Home Composition Redesign

- [x] Map the supplied wide three-column Home layout to Fedi’s existing portrait, role-card, contact, and editable-content model.
- [x] Rebuild the public Home composition on the isolated feature branch to match the supplied hierarchy and spacing without replacing Fedi’s identity or content.
- [x] Preserve Home editing, focus-card management, image replacement, and public/editor visual parity in the redesigned composition.
- [x] Retain the motion prototype and validate desktop/mobile layout, reduced-motion behavior, editor controls, TypeScript, tests, and production build.
- [x] Present the revised isolated prototype before merging to `main` or making any separate Production-release decision.

## Isolated Home Role Selector and Editor Typography Refinement

- [x] Replace the dense four-card Home specialty grid with a clearer, less crowded role-selector pattern while retaining all four editable specialties.
- [x] Reduce the public and editable Home portrait scale and add a soft lower-edge transparency fade without changing Fedi’s source image.
- [x] Add an accessible bold-text action to the direct editor for selected editable text while preserving existing rich-text rendering and draft persistence.
- [x] Validate the role-selector, portrait fade, public/editor parity, mobile layout, editor keyboard behavior, TypeScript, tests, and production build.
- [x] Present the refined isolated prototype before any merge to `main` or separately approved Production release.

## Home Specialty Presentation Research

- [x] Research less card-heavy visual patterns for presenting four technical specialties beside a portrait-led Home hero.
- [x] Compare the strongest patterns against editable labels, four existing focus visuals, drag-position controls, public/editor parity, mobile readability, and the pale-blue portfolio system.
- [x] Recommend one direction and wait for approval before replacing the current isolated prototype’s role selector.

## Featured Specialty Panel and Numbered Rail

- [x] Replace the equal role tiles with one selected specialty visual panel and a compact numbered rail of all four editable specialty labels.
- [x] Add click and keyboard selection with a concise visual transition, preserving uploaded focus visuals and default SVGs.
- [x] Mirror the selected-panel and role-rail experience in `/edit` while retaining direct label edits, image upload/replacement, focus-card positioning controls, and reset behavior.
- [x] Validate public/editor desktop and mobile interaction, keyboard access, reduced-motion behavior, TypeScript, tests, and production build.
- [x] Present the isolated featured-specialty prototype for review before any merge to `main` or separately approved Production release.

## Floating Specialty Labels and Hero Theme

- [x] Replace the featured visual panel and numbered rail with four editable rounded floating specialty labels; do not display SVGs or uploaded focus images in this Home composition.
- [x] Arrange the labels as a balanced orbit around the portrait area while retaining saved label text and direct editor in-place editing.
- [x] Add a subtle pale-blue technical background theme with low-contrast orbital, grid, and glow details that preserve the portfolio’s readability.
- [x] Validate public/editor desktop and mobile layout, reduced-motion treatment, keyboard editing, TypeScript, tests, and production build.
- [ ] Present the revised isolated floating-label prototype for review before any merge to `main` or separately approved Production release.

## Floating Label Motion and Four-Discipline Theme Refinement

- [x] Remove numeric prefixes from the four floating specialty labels while preserving editable role names.
- [x] Add low-amplitude, slow, staggered floating motion that respects reduced-motion preferences.
- [x] Add a subtle non-image background motif for Cloud, DevOps, DevSecOps, and Security & Networking that fits the pale-blue technical design system.
- [x] Validate public/editor desktop and mobile balance, animation restraint, reduced-motion behavior, TypeScript, tests, and production build.
- [ ] Present the refined isolated motion-and-theme prototype for review before any merge to `main` or separately approved Production release.

## Portrait-and-Label Backdrop and Motion Clarity Refinement

- [x] Refine the technical background specifically beneath and around the portrait and floating specialty labels rather than only the broad hero canvas.
- [x] Increase the specialty-label visual size while retaining balanced desktop and mobile placement.
- [x] Make the DevOps, DevSecOps, and Security & Networking labels stay crisp and clearly readable during their subtle motion.
- [x] Validate public/editor desktop and mobile balance, reduced-motion behavior, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## Editorial About Section Organization

- [x] Reorganize the public About section into a large title above a left copy column and right 2×2 statistics grid, following the supplied layout reference.
- [x] Place the existing editable topic tags beneath the primary About copy while retaining all current add/delete controls in `/edit`.
- [x] Mirror the reorganized public layout in the `/edit` live preview without changing saved About data.
- [x] Validate public/editor desktop and mobile layouts, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## About Statistics Card Design and First-Scroll Reveal

- [x] Restyle the four About statistic cards with the supplied rounded-card, strong-number, concise-label visual direction.
- [x] Add a one-time staggered first-scroll reveal for the public About statistic cards that progresses incrementally through the grid.
- [x] Preserve editor legibility and direct statistic controls without applying public route-load motion to `/edit`.
- [x] Respect `prefers-reduced-motion` by revealing the complete grid without animation.
- [x] Validate public/editor desktop and mobile layouts, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## About Statistic Theme, Controls, and Reveal Repair

- [x] Apply the supplied soft pale-blue gradient treatment and large blue statistic value styling to all four About cards.
- [x] Make the existing About statistic add action visually explicit with a + control and retain a direct per-card delete action in `/edit`.
- [x] Diagnose and repair the missing one-time incremental reveal on the public About statistics grid.
- [x] Preserve immediate complete-grid visibility for reduced-motion users and motion-free `/edit` behavior.
- [x] Validate public/editor desktop and mobile layouts, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## Non-Numeric About Experience Summary Redesign

- [x] Explore a non-numeric experience-summary approach; superseded after the user requested that numeric indicators be retained.
- [x] Preserve editable About data and direct add/delete controls during the experiment; the retained direction uses the original numeric values.
- [x] Preserve the public first-scroll reveal and reduced-motion safety during the direction change.
- [x] Validate the experiment before the user feedback redirected this work to the numeric treatment.
- [x] Record the user’s rejection of the non-numeric direction; no non-numeric presentation is retained.

## Refined Numeric About Indicator Design

- [x] Remove the rejected non-numeric summary experiment and restore the editable numeric About indicator values.
- [x] Redesign the numeric indicator cards with stronger hierarchy and a more intentional technical visual treatment.
- [x] Preserve explicit editor add/delete controls, public first-scroll reveal, and reduced-motion behavior.
- [x] Validate public/editor desktop and mobile layouts, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## Plain-Number About Indicators

- [x] Remove leading zeros from all editable About indicator defaults while preserving the refined numeric-card presentation.
- [x] Validate public/editor rendering, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## Adaptive Project Media and Optional Project Links

- [x] Make public and editable project rows use the full content width when no project image is present, while retaining the alternating media layout when an image exists.
- [x] Add editable optional GitHub and live-project URLs to the project content model and new-project template.
- [x] Render accessible project action buttons only when their associated GitHub or live-project URL is non-empty and valid.
- [x] Preserve existing image upload, crop, zoom, focal-point, and media-frame controls when project media exists.
- [x] Validate public/editor desktop and mobile layouts, conditional links, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## No-Media Project Metadata and Link Rendering Repair

- [x] Move the no-media project Tech stack and Delivery groups into a distinct right-side desktop column with larger, clearer typography.
- [x] Preserve a readable stacked mobile layout and retain the image-backed alternating project presentation.
- [x] Inspect the user-added test project link and repair public GitHub/live-project actions so valid links render reliably.
- [x] Validate public/editor layouts, conditional links, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.

## No-Media Project Metadata Typography Refinement

- [x] Increase and unify the font scale of no-media project Tech stack and Delivery labels and tag items.
- [x] Preserve the metadata column’s desktop hierarchy and its mobile stacked fallback.
- [x] Validate public/editor typography, TypeScript, tests, and production build before checkpointing.
- [ ] Present the revised isolated prototype for review before any merge to `main` or separately approved Production release.
