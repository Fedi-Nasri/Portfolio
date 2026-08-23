import { describe, expect, it } from "vitest";
import { formatSelectedText } from "./textFormatting";

describe("formatSelectedText", () => {
  it("wraps the selected text in the safe bold token used by public RichText", () => {
    expect(formatSelectedText("Cloud & Network Engineer", 0, 5, "bold")).toBe("**Cloud** & Network Engineer");
  });

  it("keeps unselected text and rejects empty selections", () => {
    expect(formatSelectedText("Build reliable systems", 6, 14, "italic")).toBe("Build _reliable_ systems");
    expect(formatSelectedText("Cloud", 2, 2, "bold")).toBe("Cloud");
  });
});
