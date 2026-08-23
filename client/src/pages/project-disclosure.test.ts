import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./project-disclosure.css", import.meta.url), "utf8");

describe("collapsed Selected Work disclosure layout", () => {
  it("keeps desktop metadata in the grid so every card safely contains varied tech and delivery content", () => {
    expect(css).toContain(".project-content {\n    display: grid;");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr) minmax(230px, 0.58fr);");
    expect(css).toContain(".project-compact-meta {\n    grid-column: 2;\n    grid-row: 1 / span 4;");
    expect(css).toContain(".project-detail-disclosure {\n    grid-column: 1 / -1;\n    margin-top: 10px;");
    expect(css).not.toContain("position: absolute;");
  });
});
