# UI/UX Design System

## Design intent

The portfolio uses a **light white and pale-blue technical editorial system**. It is inspired by a framed information card rather than a full-bleed dark product interface. The visual language is calm, structured, and engineering-oriented: soft neutral surfaces, strong navy text, royal-blue actions, compact labels, and generous section rhythm.

The system must remain consistent between the public portfolio and the `/edit` live preview. Editor controls should be clearly distinct from public content but should not distort the layout the public will see.

## Core visual tokens

The current global tokens live in `client/src/index.css`.

| Token / role | Current value | Usage |
|---|---:|---|
| Page surround | `#edf3fb` | Browser-page backdrop around the framed portfolio. |
| Main surface | `#ffffff` | Portfolio frame, cards, header, and primary content. |
| Ink | `#14213c` | Primary headings and high-emphasis content. |
| Body copy | `#526176` | Long-form text and secondary descriptions. |
| Primary blue | `#4567f4` | Main CTA, focus ring, links, active accents, key graphic details. |
| Secondary blue | `#6c83f5` | Gradient partner for key buttons and blue visual surfaces. |
| Soft blue | `#edf3ff` | Pills, subtle states, and calm blue emphasis. |
| Neutral line | `#e6ebf4` | Section dividers, borders, and containment. |
| Error | `#dc4054` | Destructive or validation states. |
| Base radius | `1rem` | Tailwind semantic radius source. |
| Portfolio frame radius | `32px` desktop, `22px` mobile | Outer portfolio shell. |

## Layout system

### Page frame

The portfolio is a centred white panel with a pale-blue page surround. On desktop it uses a **24px outer margin**, a maximum width of 1280px, a 1px light border, a 32px radius, and a restrained blue-tinted shadow. The frame becomes 12px from the viewport at mobile widths and reduces its radius to 22px.

### Section rhythm

Core sections use **100px vertical and 56px horizontal padding** on desktop. At tablet widths horizontal padding becomes 40px; at mobile widths the rhythm becomes 72px vertical and 24px horizontal. Do not add arbitrary section spacing without comparing it to this scale.

| Breakpoint | Frame behavior | Section padding | Primary layout changes |
|---|---|---|---|
| Desktop, above 1020px | Centred 1280px frame | `100px 56px` | Multi-column hero, timeline, project rows, contact split. |
| Tablet, 781–1020px | Same framed system | `100px 40px` | Tighter grids and reduced column gaps. |
| Mobile, 481–780px | 12px outer margin, 22px radius | `72px 24px` | One-column hero/contact/project structure; two-column stats/skills where appropriate. |
| Narrow mobile, 480px and below | Compact typography and spacing | `72px 24px` | One-column experience and skills; hero focus cards use a two-column/final-centred layout. |

## Typography

The primary typeface is **Inter**, loaded from Google Fonts. The project also references Outfit in a few legacy declarations, but the final refinement intentionally applies Inter across titles and body text to keep the UI consistent.

| Content level | Typical sizing | Weight and treatment |
|---|---|---|
| Hero name | `clamp(50px, 5.2vw, 73px)` | 700–800, tight negative tracking, very high contrast. |
| Section titles | `clamp(36px, 4vw, 57px)` | 700, approximately `1.04` line-height, tight tracking. |
| Project titles | `clamp(24px, 2.1vw, 34px)` in compact project rows | 700, tight tracking. |
| Standard body | 15–16px | 400, `1.62–1.8` line-height for comfortable reading. |
| Navigation/actions | 12–13px | 600–700; do not return to unreadably small 10px controls. |
| Eyebrows/metadata | 9–12px | 700, uppercase, letter-spaced, blue or muted ink. |
| Tags | 10–12px | 500–700 with a low-contrast filled or bordered surface. |

### Copy rules

Keep paragraphs readable rather than dense. Use soft slate body color, not full navy, for normal copy. Do not use all-caps for paragraphs; reserve it for compact labels and metadata. Maintain meaningful contrast, and do not make text smaller merely to fit an element.

## Component patterns

| Pattern | Visual definition | Interaction guidance |
|---|---|---|
| Primary CTA | Blue/blue-violet gradient, white text, rounded pill or rounded rectangle, soft shadow. | Hover may lift by 1–2px; active state should scale subtly. |
| Secondary control | Pale or white surface, blue/ink text, fine blue-gray border. | Must retain clear focus visibility and readable contrast. |
| Content card | White or soft-gradient surface, light border, 10–18px radius, restrained shadow. | Card hover is optional; use only when it signals a link or meaningful detail. |
| Tag/chip | Compact rounded rectangle, muted blue/gray surface, 5–9px internal padding. | Wrap naturally; never overlay or compress text until unreadable. |
| Section eyebrow | Small uppercase label with a preceding 22px hairline. | Use to establish structure before a large heading. |
| Timeline entry | Four-column desktop grid with date marker, role/company, summary, and tags/details. | The detail disclosure should be explicit and keyboard operable. |
| Project row | Alternating left/right visual column, dominant text column, calm bordered card. | Maintain the same 31% media-column width for both orientations. |
| Certificate card | Provider mark, title, issuer, compact metadata; PDF actions revealed on that card alone. | Hover and keyboard focus must remain scoped to the individual card. |

## Section-specific rules

### Hero

The hero uses a three-column composition: copy card, circular portrait zone, and focus-card stack. The portrait must remain circular. Four focus cards represent **Cloud**, **DevOps**, **DevSecOps**, and **Security & Networking**. They are positioned as a readable arc rather than overlapping the copy or portrait.

Focus-card motion is intentionally limited to hover emphasis. Do not reintroduce continuous floating animation because it previously caused visual overlap and content obstruction.

### Experience

The timeline makes the most recent entry visually current with a filled blue marker. In the collapsed state, date, role/company, brief description, and tags remain visible. Expanding an entry hides the concise description, reveals accessible bullet details, and moves tags beneath the detail list.

### Selected Work

Selected Work uses alternating media and text placement. The image must occupy a consistent compact column; the case-study text remains the dominant reading area. All image cropping uses `object-fit: cover` plus persisted focal-point/zoom settings to avoid blank frame areas.

### Contact

The Contact section uses a structured heading plus a direct-contact card. It should foreground email, phone, location, LinkedIn, and GitHub actions rather than a non-functional form.

## Motion and feedback

Motion is used to confirm input, not decorate empty space.

| Interaction | Target behavior |
|---|---|
| Button press | Use a quick transform-based active response, approximately 100–160ms. |
| Hoverable cards or links | Use subtle color, border, shadow, or `translateY` changes; avoid layout reflow. |
| Experience expansion | Use opacity/transform and measured grid-row expansion around 200–260ms. |
| Modals / overlays | Fade and scale from approximately 0.95 rather than scale 0. |
| Reduced motion | Respect `prefers-reduced-motion: reduce`; disable nonessential transition and animation. |

Do not animate width, height, margins, or positional layout values when a transform or opacity transition can communicate the interaction. The CSS system already gates motion for reduced-motion users.

## Accessibility baseline

The existing base styles apply a visible 2px blue focus outline with 3px offset to buttons, anchors, inputs, and textareas. Maintain this pattern for new controls. All editor interactions should be reachable with a keyboard, and icon-only controls need an accessible name through visible text, `aria-label`, or a related tooltip.

The user-visible editor preview must still work on small screens. Canvas content has an intentionally semantic stacked fallback rather than preserving desktop absolute-position geometry. New interactions need to be tested at desktop and mobile breakpoints before a checkpoint.

## UI change checklist

| Before marking a design change complete | Verification |
|---|---|
| Preserve visual parity | Compare public `/` and active `/edit` preview for the changed section. |
| Preserve responsive rhythm | Check desktop and mobile screenshots, including real text wrapping. |
| Preserve contrast and focus | Test hover, keyboard focus, and normal states against the intended backgrounds. |
| Preserve component isolation | Hovering or opening one certificate, project, or experience control must not change sibling components. |
| Preserve reduced-motion behavior | Avoid adding unguarded keyframe motion. |
| Preserve data ownership | Keep content in `PortfolioContent`; keep layout tokens in CSS; keep editor-only affordances out of public output. |
