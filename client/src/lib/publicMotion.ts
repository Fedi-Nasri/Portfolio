export const PUBLIC_MOTION_ROOT_CLASS = "motion-ready";
export const PUBLIC_MOTION_REDUCED_CLASS = "motion-reduced";
export const PUBLIC_MOTION_REVEAL_SELECTOR = "main > section, .ref-footer";

export function getPublicMotionConfig(prefersReducedMotion: boolean) {
  return {
    enabled: !prefersReducedMotion,
    rootClass: PUBLIC_MOTION_ROOT_CLASS,
    reducedClass: PUBLIC_MOTION_REDUCED_CLASS,
    revealSelector: PUBLIC_MOTION_REVEAL_SELECTOR,
    observerOptions: {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    },
  } as const;
}
