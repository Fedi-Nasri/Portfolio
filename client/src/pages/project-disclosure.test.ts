import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./project-disclosure.css", import.meta.url), "utf8");

describe("collapsed Selected Work disclosure layout", () => {
  it("uses an independent desktop metadata panel so a short summary does not inherit its height", () => {
    expect(css).toContain(".project-content {\n    display: block;");
    expect(css).toContain(".project-compact-meta {\n    position: absolute;");
    expect(css).toContain(".project-detail-disclosure {\n    width: 100%;\n    margin-top: 16px;");
  });
});
