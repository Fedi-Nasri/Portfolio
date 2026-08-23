# Reference Motion Prototype Notes

## Source reviewed

The user requested an animation study of `https://my-portfolio-teal-one-43.vercel.app/` for an isolated public-view prototype. The reference was viewed in the browser on 2026-08-23.

## Observable motion language

The initial public composition relies on a clean staged presentation rather than continuous decorative movement. Its hero has distinct visual groups—header, introductory copy, portrait, and role cards—which make a short staggered entrance appropriate. The fixed navigation remains visually calm while the hero and later content sections are the likely motion focus.

The requested prototype should therefore use restrained opacity and transform transitions: a short initial hero sequence, section-level reveal as content enters the viewport, and small stagger intervals for repeated cards. It must not reproduce the reference content or code.

## Accessibility and product boundary

All motion must respect `prefers-reduced-motion`, remain below roughly 500 milliseconds per entry transition, avoid opacity values that leave content unreadable, and apply only to the public portfolio route. The `/edit` workspace is not part of this experiment. The prototype branch must remain separate from `main` and `deployment_versel` until the user approves a review and any later merge.

## Live prototype verification

The public route was opened after the implementation and retained its full hero, navigation, sections, and content. The motion system applies a staged header/hero entrance and one-time viewport reveals to public sections only. Browser controls did not report an observable scroll-position change in this environment, so section-transition timing was also validated through the deterministic observer configuration and visual full-page checks. The implementation has a reduced-motion bypass and an IntersectionObserver fallback that reveals all content if the browser lacks that API.
