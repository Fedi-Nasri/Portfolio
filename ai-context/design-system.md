# UI/UX Design Context

## Visual north star

The portfolio is a framed, light technical portfolio. Its defining characteristics are a pale-blue page surround, a rounded white content frame, navy typography, royal-blue accent behavior, structured spacing, circular portrait treatment, and quiet information-rich cards. It should feel crafted and highly legible rather than dark, generic, or over-animated.

> The reference direction is **white / pale blue with precise spacing**, not the reference site’s green tone. Preserve the layout rhythm and information-card treatment, not unrelated brand colors.

## Token reference

| Role | Current token/value | Usage rule |
|---|---:|---|
| Page surround | `#edf3fb` | Shows around the white portfolio frame. |
| Main surface | `#ffffff` | Primary panels, frame, cards, header, and content background. |
| Ink | `#14213c` | High-emphasis headings and critical text. |
| Body | `#526176` | Long-form readable copy. |
| Primary action | `#4567f4` | CTA, focus ring, active emphasis, key technical accents. |
| Secondary blue | `#6c83f5` | Gradient companion for primary CTAs. |
| Soft blue | `#edf3ff` | Calm tags, pills, highlights, and pale emphasis. |
| Structural line | `#e6ebf4` | Borders, dividers, and containment. |
| Destructive state | `#dc4054` | Destructive/validation treatment only. |
| Standard radius | `1rem` base | Use semantic Tailwind radius when possible. |
| Outer frame | 32px desktop / 22px mobile | Do not flatten the portfolio’s outer card. |

The implementation lives primarily in [`client/src/index.css`](../client/src/index.css). Treat this file as the visual source of truth and avoid scattering conflicting hard-coded values through components.

## Typography and readability

The intended primary family is **Inter**. Titles should have strong hierarchy, tight tracking, and high contrast. Body copy must remain at readable 15–16px scale with approximately 1.62–1.8 line-height. Compact labels and tags may be smaller, but their contrast and spacing must remain clear.

| Content level | Visual treatment |
|---|---|
| Hero name | Responsive large display scale, 700–800 weight, tight but not clipped tracking. |
| Section title | Large responsive scale, 700 weight, short lines encouraged. |
| Project title | Prominent but subordinate to hero/section titles. |
| Body copy | 15–16px, normal weight, soft slate text, comfortable line-height. |
| Eyebrow/meta labels | Compact uppercase, tracked, blue or muted gray. |
| Tags and chips | Small but readable text on calm neutral/blue surfaces. |

Do not shrink long text to force it into a layout. Reflow the layout or use responsive wrapping instead.

## Layout rules

| Surface | Desktop rule | Mobile rule |
|---|---|---|
| Outer portfolio frame | 24px surrounding margin, max width 1280px, rounded white panel. | 12px surround, 22px radius. |
| Core section padding | `100px 56px`. | `72px 24px`. |
| Header | Sticky, concise navigation and compact CTA. | Mobile menu; avoid crowded desktop nav. |
| Hero | Three-column copy / portrait / focus-card composition. | One-column flow with portrait and readable focus-card grid. |
| About | Two-column narrative/summary then statistics. | Single narrative flow; stats remain centred in usable rows. |
| Experience | Multi-column timeline row. | Reflow cleanly to one/two column layout depending width. |
| Projects | Alternating media/details grid. | One-column content with image above/below details in logical order. |
| Contact | Copy plus direct-contact card. | Stacked with direct actions retained. |

## Component behavior to preserve

### Hero and focus cards

The portrait is always circular. The four focus cards are Cloud, DevOps, DevSecOps, and Security & Networking. Their positions are draft-persisted on desktop and must form a readable arc without overlapping labels or obscuring the portrait. The project intentionally removed continuous floating card animation after it caused collisions; only subtle hover feedback should remain.

### Experience

The topmost/recent item has a filled blue timeline marker; later items are outlined. Collapsed cards show date, role/company, brief description, and tags. Expanded cards hide the short description, show designed bullet points, then tags. The disclosure must be keyboard reachable and motion must be quick and optional for reduced-motion users.

### Certificates

Certificate hover/focus must be scoped to the active card. A PDF-enabled card reveals its View certificate affordance only when interacted with; sibling cards must not animate. The viewer opens centred in the page with a clear close path.

### Selected Work

Each alternating project row gives the image the same compact media-column proportion. The details column remains dominant. Images must never reveal blank space from zoom-out; use persisted focal point, zoom, aspect ratio, and frame height with `object-fit: cover` behavior.

### Editor preview

The editor must render the same public visual language, with additional clearly scoped editor controls. Avoid building a simplified inspector as a substitute for public preview. Editor overlays must not compress the live preview or create accidental horizontal overflow.

## Motion, feedback, and accessibility

| Rule | Implementation expectation |
|---|---|
| Motion purpose | Confirm actions and reveal context; do not add ambient movement that reduces clarity. |
| Timing | Normal hover/button feedback stays under roughly 300ms; use transform/opacity preferentially. |
| Button feedback | Subtle active scale and clear hover state. |
| Focus | Retain visible 2px primary-blue focus outline with offset. |
| Reduced motion | Respect `prefers-reduced-motion` and disable nonessential movement. |
| Touch/mobile | Controls must be readable/tappable; no hover-only critical path. |
| Color | Pair surfaces and foreground text deliberately; do not create low-contrast muted text. |

## Design change protocol

When changing reusable visual behavior, update the public and editable render paths, verify desktop and mobile, test focus/keyboard access, and document the revised rule in this file. If an image, card, or overlay looks misaligned in the editor, investigate the public CSS/layout relationship before applying editor-only positioning hacks.
