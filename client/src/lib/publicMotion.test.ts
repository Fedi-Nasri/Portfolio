import { describe, expect, it } from "vitest";
import {
  PUBLIC_MOTION_REDUCED_CLASS,
  PUBLIC_MOTION_REVEAL_SELECTOR,
  PUBLIC_MOTION_ROOT_CLASS,
  getPublicMotionConfig,
} from "./publicMotion";

describe("public motion configuration", () => {
  it("enables intersection-based motion with stable public selectors by default", () => {
    const config = getPublicMotionConfig(false);

    expect(config.enabled).toBe(true);
    expect(config.rootClass).toBe(PUBLIC_MOTION_ROOT_CLASS);
    expect(config.revealSelector).toBe(PUBLIC_MOTION_REVEAL_SELECTOR);
    expect(config.observerOptions).toEqual({
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    });
  });

  it("disables non-essential motion when reduced motion is preferred", () => {
    const config = getPublicMotionConfig(true);

    expect(config.enabled).toBe(false);
    expect(config.reducedClass).toBe(PUBLIC_MOTION_REDUCED_CLASS);
  });
});
