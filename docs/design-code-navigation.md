# Design, CSS, and Component Navigation Guide

This guide explains how to inspect and safely extend the visual system of **Fedi Nasri’s portfolio**. It is written for developers and AI agents who need to understand where a visible design comes from before changing it.

> **Working rule:** do not begin with a broad stylesheet rewrite. First identify the route, rendering component, data source, section selector, and final CSS override. The project has evolved through several design iterations, so the last matching selector in `client/src/index.css` is often the active visual rule.

## 1. Fast visual orientation

The application has two main visual routes. The public route `/` is rendered by `client/src/pages/Home.tsx`; the direct editor `/edit` is coordinated by `client/src/pages/EditPortfolio.tsx` and uses `client/src/pages/FullLivePreview.tsx` for its portfolio preview. The two routes intentionally share the same portfolio content model and near-identical section structure.

| What you see | Start here | Then inspect | Why it matters |
|---|---|---|---|
| Public portfolio section | `client/src/pages/Home.tsx` | `client/src/index.css` | Home supplies the public markup; `index.css` owns the portfolio’s visual system. |
| Editable portfolio preview | `client/src/pages/FullLivePreview.tsx` | `client/src/pages/full-live-preview.css` | This is the public-layout counterpart with edit affordances and controls. |
| Editor shell, draft actions, toolbars | `client/src/pages/EditPortfolio.tsx` | `client/src/pages/edit-extensions.css` | The shell manages active section selection, saving, drafts, and editor-specific layout. |
| Shared rich text | `client/src/components/RichText.tsx` | `client/src/lib/textFormatting.ts` | Keeps bold, italic, underline, and size tokens safe and consistent. |
| Project media crop, frame, or link controls | `client/src/components/ProjectImageControlPanel.tsx` | `client/src/components/project-image-control-panel.css` | Separates complex media controls from the page-level preview. |
| Custom editor canvas | `client/src/components/CustomSectionCanvas.tsx` | `client/src/components/custom-section-canvas.css` | Owns custom-section placement, selection, and resize behavior. |

## 2. Recommended folder scan order

Use a narrow-to-wide scan. The following sequence minimizes unnecessary reading and prevents a visual adjustment from accidentally bypassing the shared content or editor path.

| Step | Read or search | Goal | Typical command or action |
|---:|---|---|---|
| 1 | `ai-context/current-work.md` and `todo.md` | Learn the active branch, paused work, and current safety boundary. | Read these files before any edit. |
| 2 | `client/src/App.tsx` | Confirm the route and page component. | Search for `<Route` or `path=`. |
| 3 | Target page component | Locate the section JSX and its class names. | Search by visible heading text such as `Selected Work` or `Experience`. |
| 4 | `client/src/index.css` | Find every selector for that section and identify the last cascade rule. | Search the exact class, for example `.ref-experience`. |
| 5 | `FullLivePreview.tsx` | Confirm the editor version uses the same class names or compatible structure. | Search the same heading or section class. |
| 6 | `shared/portfolio.ts` | Confirm whether a requested label, card, image, link, or list is data-driven. | Search the data type and default value. |
| 7 | Relevant tests | Update coverage before final validation. | Search `Home.test.tsx`, `FullLivePreview.test.tsx`, or the corresponding library test. |

### Efficient search vocabulary

Use the public-facing text only to locate markup; use class names to locate styles. The following project terms map to major parts of the page.

| User-facing term | Markup or data concept | Primary visual selectors |
|---|---|---|
| Home | Hero, portrait, floating specialties | `.reference-hero`, `.hero-wide-layout`, `.hero-floating-labels`, `.floating-specialty` |
| About | Editorial copy and statistic cards | `.ref-about`, `.about-editorial-layout`, `.ref-stats`, `.about-numeric-indicator` |
| Experience | Timeline, details, tool tags | `.ref-experience`, `.reference-timeline`, `.reference-job`, `.experience-details` |
| Skills & Toolbox | Capability group cards | `.ref-skills`, `.skills-ref-grid` |
| Certifications | Credential grid and viewer controls | certification section selectors in `Home.tsx` and `FullLivePreview.tsx` |
| Selected Work / Projects | Project cards, media, case study blocks | `.ref-projects`, `.ref-project-list`, `.ref-project`, `.project-*` |
| Writing & Insights | Article cards | writing section selectors in `Home.tsx` and `FullLivePreview.tsx` |
| Contact | Direct contact card | `.ref-contact`, `.contact-direct-card` |

## 3. CSS architecture: read the cascade from the bottom

The visual system is primarily custom CSS in `client/src/index.css`. It uses Tailwind 4 as a utility foundation, but the public portfolio’s distinctive layout, background fields, responsive compositions, and editor parity are mostly authored with semantic CSS selectors.

| CSS layer | Where to look | Responsibility | Change guidance |
|---|---|---|---|
| Global variables and base | top of `index.css` | Semantic color variables, type family, page frame, focus outlines | Change only when the whole site should change. |
| Base portfolio sections | early and middle `index.css` | Header, hero, section layout, About, Experience, projects, contact | Use for structural styles shared by public and preview. |
| Responsive rules | `@media (max-width: 1020px)`, `780px`, and `480px` | Tablet and mobile fallback layouts | Edit the desktop rule and its mobile counterpart together. |
| Dark/dim-mode selectors | `.reference-portfolio.dim-mode …` | Alternate theme surfaces and contrast | Pair every meaningful light-surface change with a dim-mode review. |
| Late feature refinements | lower portion of `index.css` | Home floating labels, About indicators, project media adaptations, themed section backgrounds | These selectors deliberately override earlier historical rules. Add a focused override here rather than editing unrelated legacy rules. |
| Reduced-motion rules | `@media (prefers-reduced-motion: reduce)` and public-motion selectors | Animation suppression and accessible reveal fallback | Any new animation must have a reduced-motion-safe result. |

### Safe CSS inspection method

1. Search for the section’s root selector, such as `.ref-projects` or `.ref-experience`.
2. Note every occurrence from top to bottom. Later declarations normally win when specificity is equal.
3. Inspect the nearest responsive and dim-mode rules for the same selector.
4. Decide whether the request is **global** (for example, all tags), **section-specific** (for example, Selected Work cards), or **one state** (for example, an expanded Experience disclosure).
5. Add the smallest semantic override at the end of the relevant refinement block. Do not duplicate a rule in multiple disconnected places.
6. Capture public and `/edit` screenshots at desktop and mobile sizes before saving a checkpoint.

> **Avoid:** applying `!important` as a first response to a cascade issue. It makes editor parity and later refinements harder to maintain. Locate the active final selector instead.

## 4. Tailwind 4 in this project

Tailwind is available through `@import "tailwindcss";` in `client/src/index.css` and the Vite Tailwind plugin. It is most useful for local layout, editor controls, and prebuilt UI components. The portfolio’s public section visuals intentionally rely on semantic CSS classes because their designs require layered backgrounds, responsive positional composition, and public/editor parity that would be difficult to maintain as long utility strings.

| Use Tailwind utilities when… | Use semantic CSS when… |
|---|---|
| Building an isolated control, toolbar, empty state, or local alignment adjustment | Styling a public portfolio section, repeating project card, hero composition, timeline, or responsive visual system |
| A prebuilt shadcn/Radix component already owns interaction behavior | A selector needs dim-mode, mobile, hover, reduced-motion, and public/editor rules together |
| The visual rule is unique to one small component | The rule represents reusable portfolio design language |

The project preserves core semantic variables declared near the top of `index.css`. Do not remove the variable layer or the Tailwind imports. Existing public selectors use portfolio variables such as `--ink`, `--body`, `--blue`, `--soft-blue`, and `--line`; new section work should begin by reusing those values rather than introducing unrelated colors.

## 5. Design-system connection map

The current design language is a light white-and-pale-blue canvas with royal-blue technical accents. It uses rounded white or translucent surfaces, low-contrast grids and orbital geometry, dark navy headings, readable grey-blue body copy, and restrained blue rails/pills for hierarchy.

| Design decision | Shared implementation | Preserve when extending |
|---|---|---|
| Page frame | `.reference-portfolio` | Rounded outer white frame, pale-blue page surroundings, generous desktop margin. |
| Section rhythm | `.ref-section`, `.full-stack-ref`, `.ref-contact` | Consistent section padding and title-label pattern. |
| Heading hierarchy | `.ref-section-title` | Small tracked blue eyebrow plus large navy headline. |
| Technical backgrounds | Section root pseudo-elements | Use sparse grids, circles, and glow fields; keep them behind text with low opacity. |
| White content surfaces | Timeline and project cards | Use soft border, restrained shadow, and high text contrast. |
| Accent rails | Project and Experience entry pseudo-elements | Reserve royal-blue rails for key structural emphasis, not every element. |
| Tags and pills | `.ref-tags`, `.delivery-row`, `.hashtag-cloud` | Maintain readable text, compact padding, and adequate contrast. |
| Motion | `publicMotion.ts` and CSS animation blocks | Public-only, one-time section entrance, short stagger, no lateral layout movement, and reduced-motion fallback. |

### Background checklist

When a user asks to “improve the background,” clarify and then implement one primary visual anchor. A strong section background usually contains: a pale base gradient; one geometric texture such as a grid; one secondary shape such as a circle or glow; and an opaque or translucent content surface. Too many foreground motifs make the information feel less readable.

## 6. Public and editor parity contract

The public page and `/edit` preview are separate React components, so a design change usually needs two checks. Public mode may have route-scoped motion; `/edit` must remain usable without public page-load animations. The editor may add controls, but it should not change the portfolio’s underlying hierarchy, colors, or layout intent.

| Change type | Public path | Editor path | Required verification |
|---|---|---|---|
| Copy, label, statistic, tag, project field | `Home.tsx` | `FullLivePreview.tsx` plus `shared/portfolio.ts` | Public display, in-place edit, save/load behavior, regression tests. |
| Shared section background or card styling | `index.css` | `index.css` and, when needed, `full-live-preview.css` | Desktop and mobile screenshots for both routes. |
| Editor-only action/control | Not rendered | `EditPortfolio.tsx` or `FullLivePreview.tsx` | Keyboard reachability, no interference with preview layout. |
| Public animation | `Home.tsx` plus `publicMotion.ts` / `index.css` | No route-load animation in editor | `prefers-reduced-motion` and no editor motion regression. |

## 7. Standard visual-change workflow

Follow this workflow for a visual request.

1. **Record the request.** Add a precise unchecked entry to `todo.md` before changing code.
2. **Read state.** Check `ai-context/current-work.md`, the applicable design record, and the root component/class names.
3. **Trace data.** If the request changes displayed content, inspect `shared/portfolio.ts` before JSX.
4. **Change the smallest layer.** Prefer a targeted semantic CSS addition over broad rewrites.
5. **Maintain parity.** Review public `Home.tsx` and editor `FullLivePreview.tsx` if the layout or content is shared.
6. **Update tests.** Add or adjust Vitest coverage for new behavior or modified markup.
7. **Validate.** Run `pnpm check`, `pnpm test`, and `pnpm build`; inspect `/` and `/edit` at desktop and mobile sizes.
8. **Document.** Mark completed checklist items and update `ai-context/current-work.md` before checkpointing.
9. **Checkpoint and branch.** Save a checkpoint, then synchronize the approved branch. Never push `deployment_versel` without a separate immediate Production approval.

## 8. Common visual-change failure modes

| Symptom | Likely cause | Safe correction |
|---|---|---|
| CSS edit appears to do nothing | A later selector overrides it | Search all occurrences and add one narrowly scoped later rule. |
| Public and `/edit` no longer match | Only one render path was changed | Update both `Home.tsx` and `FullLivePreview.tsx`, then compare screenshots. |
| Mobile layout overflows | Desktop grid or absolute positioning has no mobile fallback | Add/verify a `max-width: 780px` rule and use stacked layout. |
| Motion hides content | Initial hidden state lacks a reduced-motion or observer fallback | Ensure reduced-motion leaves content visible and observer failure reveals content. |
| Text loses contrast on dim mode | Light selector changed without dim-mode pair | Test the `.dim-mode` counterpart before checkpointing. |
| Section feels visually crowded | Background has too many decorative layers | Keep one texture plus one focal motif; let card surfaces do the reading work. |

## 9. Quick command reference

| Purpose | Command |
|---|---|
| Locate a visible section | `rg -n "Selected Work|Experience|About" client/src` |
| Locate a CSS selector | `rg -n "\.ref-experience|\.ref-projects" client/src/index.css` |
| Inspect the cascade around a match | `rg -n -C 3 "\.ref-experience" client/src/index.css` |
| Run static checks | `pnpm check` |
| Run regression suite | `pnpm test` |
| Create a production build | `pnpm build` |
| Check current branch | `git branch --show-current` |
| Compare the feature against main | `git diff --stat origin/main...HEAD` |

## References

[1] [Tailwind CSS documentation](https://tailwindcss.com/docs)

[2] [WCAG 2.2—prefers-reduced-motion and accessible motion context](https://www.w3.org/TR/WCAG22/)
