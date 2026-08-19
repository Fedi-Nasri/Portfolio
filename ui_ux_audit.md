# UI/UX Readability Audit — Fedi Nasri Portfolio

## Overall Assessment

The portfolio has a strong foundation. Its **white and pale-blue frame**, circular portrait, structured hero, and clear section order create a calm, professional first impression. The navigation path is easy to understand, and the content aligns well with a cloud and network engineering profile.

The main opportunity is not the large titles. Their visual hierarchy is effective. The usability risk sits in the **secondary and tertiary text**: small navigation labels, tags, timeline metadata, contact details, and project-supporting copy become difficult to scan, especially on a phone. The screenshots also show a few areas where content or imagery looks less intentional than the rest of the visual system.

| Area | Current assessment | Priority |
|---|---|---|
| Main headlines and section hierarchy | Strong; titles provide clear page structure. | Preserve |
| Body paragraph readability | Improved, but some supporting text still feels small or light. | High |
| Mobile scanning | The page remains functional but has many compact labels and dense sections. | High |
| Project presentation | Clear content structure; visual specificity and image variety need work. | Medium |
| Navigation and interactive controls | Understandable, but some controls appear undersized for touch. | High |
| Brand distinctiveness | Cohesive but the `fedi.` wordmark is still visually generic. | Medium |

## Priority Findings

### 1. Small interface text is the clearest readability issue

The main narrative paragraphs are now substantially more readable, but multiple small text styles still sit below a comfortable size: navigation links, role-card labels, metadata, chips, timeline dates, footer links, contact facts, and form labels. On desktop they look refined but subdued; on mobile they become noticeably harder to read without zooming.

**Recommended adjustment:** make **12px** the smallest routine text size and use **13–14px** for all meaningful labels, tags, role-card captions, metadata, and contact information. Keep only decorative legal or helper text at 11px.

### 2. Text contrast should be stronger in supporting content

The pale slate used for metadata and smaller descriptions complements the visual system, but it is too light in several areas. This weakens the readability of job summaries, hero microcopy, tags, form placeholders, and the footer.

**Recommended adjustment:** reserve the lightest slate only for non-essential decoration. Shift readable secondary copy toward a darker slate such as `#536178` or `#5E6C82`; avoid pale blue text for small body information.

### 3. Mobile hero role cards are too compact

The three role cards preserve the reference composition, but their captions and miniature visuals become small on mobile. They read as decoration rather than as meaningful capability signals.

**Recommended adjustment:** stack the cards vertically or show two stronger cards with 12–13px captions on mobile. This gives “Cloud & DevOps,” “Network Security,” and “Linux Systems” more credibility as professional areas of focus.

### 4. The experience and projects sections ask for a lot of scanning

The timeline, capability grid, and four project case studies are informative but text-heavy. Desktop spacing is good; however, visual repetition and densely packed details make it difficult to identify the strongest evidence quickly.

**Recommended adjustment:** use a short lead sentence for each entry and place supporting stack tags or outcomes behind a “details” disclosure on mobile. Retain the full case-study narrative on desktop. This improves scanning without losing information.

### 5. Some touch controls look too small

The hero social buttons, email-copy control, small tag-like elements, and compact header controls appear around 26–34px. These may be difficult to use on touch screens.

**Recommended adjustment:** make all actionable icon controls at least **40–44px** tall and wide on mobile. Use clearly visible hover/focus states for the desktop version and retain keyboard focus outlines.

### 6. Project imagery is not yet specific enough to infrastructure work

The project section structure is clear, but several images share a beige product-mockup style and two projects appear to reuse a closely related visual. This reduces confidence that the work is distinctly about cloud, Linux, networking, or security.

**Recommended adjustment:** replace repeated images with a unified visual language built from network paths, terminal excerpts, topology diagrams, cloud nodes, Linux/server details, and deployment flows. Each project should have a visibly different but related systems-engineering visual.

### 7. The portfolio should avoid placeholder language

The availability line currently signals that information will be added later. This is honest but makes the profile feel incomplete.

**Recommended adjustment:** use a confident neutral alternative until availability is finalised, such as: “Open to internship and engineering opportunities in cloud infrastructure and networking.” Update it later with exact dates.

## What Is Working Well

The **portrait-led hero** creates a clear personal connection. The white card, pale-blue technical background, and role cards make the first screen easy to understand. The main section headings are large, direct, and useful for scanning. The cloud-blue accent is used consistently enough to guide attention without overwhelming the page.

The layout also has a consistent reading order: introduction, profile, experience, skills, capability, projects, then contact. This is a sound portfolio sequence and should be preserved.

## Recommended Order of Improvement

| Order | Change | Expected impact |
|---|---|---|
| 1 | Enlarge all labels, timeline metadata, tags, contact facts, and mobile role-card captions. | Immediate readability improvement across the site. |
| 2 | Darken secondary-text colors and form-placeholder text. | Better legibility without altering the visual direction. |
| 3 | Increase mobile touch-target sizes for icon actions and header controls. | More usable mobile interactions. |
| 4 | Replace repeated project images with cloud and network-specific visuals. | Stronger proof of domain expertise and a more ownable brand. |
| 5 | Replace unfinished availability wording and refine the wordmark. | More polished and credible professional impression. |

## Conclusion

The current site is visually coherent and reads as a polished personal portfolio. The large headings are already at the right scale. The next UI/UX pass should concentrate on **small-text readability, contrast, mobile interaction targets, and more domain-specific project visuals** rather than changing the structure that already works.
