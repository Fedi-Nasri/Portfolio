# Design Navigation and CSS Scan Protocol

This is the short operational guide for an AI agent changing the portfolio’s visuals. Read it together with [`design-system.md`](./design-system.md), [`current-work.md`](./current-work.md), and the long-form developer guide at [`docs/design-code-navigation.md`](../docs/design-code-navigation.md).

## Mandatory pre-edit sequence

| Order | Action | Stop condition |
|---:|---|---|
| 1 | Read `current-work.md`, `todo.md`, and the relevant section of `design-system.md`. | Do not edit if a branch, release, or data boundary is unclear. |
| 2 | Map the user’s term to a section root and component pair. | Example: “Experience” means `Home.tsx`, `FullLivePreview.tsx`, `.ref-experience`, and `.reference-job`. |
| 3 | Search the CSS selector across all of `client/src/index.css`. | Identify the last applicable selector, mobile rule, and dim-mode rule. |
| 4 | Check whether the request changes data or only visual treatment. | Read `shared/portfolio.ts` before changing labels, arrays, URLs, cards, or defaults. |
| 5 | Add a precise unchecked `todo.md` item. | Do this before implementation. |

## Source map for visual work

| Concern | Primary source | Secondary source | Notes |
|---|---|---|---|
| Public layout | `client/src/pages/Home.tsx` | `client/src/index.css` | Public source of visible hierarchy. |
| Editor preview parity | `client/src/pages/FullLivePreview.tsx` | `client/src/pages/full-live-preview.css` | Controls may differ; visual hierarchy should not. |
| Editor workspace | `client/src/pages/EditPortfolio.tsx` | `client/src/pages/edit-extensions.css` | Do not put public section styling here. |
| Shared content schema | `shared/portfolio.ts` | `client/src/lib/editorContent.ts` | Extend before updating data-driven JSX. |
| Public motion | `client/src/lib/publicMotion.ts` | `client/src/index.css` | Public-only; reduced motion remains visible and static. |
| Media controls | `client/src/components/ProjectImageControlPanel.tsx` | its co-located CSS | Keep crop and upload controls out of the base project composition. |

## CSS scanning rules

1. Treat `client/src/index.css` as a historical cascade, not a single flat design file.
2. Search from top to bottom, but implement near the final refinement block for the relevant section.
3. Pair a light-mode rule with an applicable `.dim-mode` rule.
4. Pair desktop positioning with the `max-width: 780px` fallback.
5. Do not use `!important` until you have proven a semantic late override cannot solve the issue.
6. Use pseudo-elements for backgrounds and decorative geometry; keep content at a higher `z-index`.
7. Preserve the design grammar: pale-blue technical field, few low-contrast motifs, white/translucent content surface, navy text, royal-blue accents.

## Visual-change decision tree

```text
User asks for a visual change
│
├─ Is content or a default value changing?
│  └─ Yes → shared/portfolio.ts → public JSX → editor JSX → tests
│
├─ Is only one public section changing?
│  └─ Yes → root semantic CSS selector → responsive rule → dim-mode review
│
├─ Does the editor show the same section?
│  └─ Yes → inspect FullLivePreview.tsx and full-live-preview.css
│
├─ Does it animate?
│  └─ Yes → publicMotion.ts / public-only CSS and reduced-motion fallback
│
└─ Validate → check → test → build → public + /edit screenshots → checkpoint
```

## Required verification matrix

| Change | Minimum verification |
|---|---|
| CSS-only public section refinement | `pnpm check`, `pnpm test`, `pnpm build`, public desktop/mobile screenshot. |
| Shared public/editor visual refinement | All above plus `/edit` desktop/mobile screenshot. |
| Interactive control or motion | All above plus manual behavior verification and reduced-motion reasoning. |
| Shared content/data field | All above plus public/editor render test and editor save/load path. |

## Release boundary

The normal development integration branch is `main`. `deployment_versel` is Vercel Production and must not receive a push unless the user gives a **separate explicit immediate approval** for that specific Production release. A user’s approval to merge a feature into `main` is not approval to release Production.

## Efficient handoff note

At the end of visual work, update `todo.md` and `current-work.md` with the exact section, selector family, validation result, checkpoint, and branch state. If the work changes reusable visual rules, update `design-system.md` and the long-form navigation guide in the same change set.
