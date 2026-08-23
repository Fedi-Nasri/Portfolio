import { describe, expect, it } from "vitest";
import { INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES, needsInlineImagePreparation, preparedImageFileName } from "./mediaUpload";

describe("inline media upload preparation", () => {
  it("only prepares oversized non-SVG images before Base64 transport", () => {
    expect(needsInlineImagePreparation({ type: "image/png", size: INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES + 1 })).toBe(true);
    expect(needsInlineImagePreparation({ type: "image/jpeg", size: INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES })).toBe(false);
    expect(needsInlineImagePreparation({ type: "image/svg+xml", size: INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES + 1 })).toBe(false);
    expect(needsInlineImagePreparation({ type: "application/pdf", size: INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES + 1 })).toBe(false);
  });

  it("derives an unambiguous WebP filename without changing the source basename", () => {
    expect(preparedImageFileName("robot-boat.png")).toBe("robot-boat-upload.webp");
    expect(preparedImageFileName("portfolio-image")).toBe("portfolio-image-upload.webp");
  });
});
