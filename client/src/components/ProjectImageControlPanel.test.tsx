import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { ProjectImageControlPanel } from "./ProjectImageControlPanel";

describe("ProjectImageControlPanel", () => {
  it("exposes precise zoom, aspect ratio, frame size, and reset controls", () => {
    const html = renderToStaticMarkup(<ProjectImageControlPanel projects={DEFAULT_PORTFOLIO_CONTENT.projects} onChange={() => {}} />);

    expect(html).toContain("Zoom");
    expect(html).toContain("Aspect ratio");
    expect(html).toContain("Frame height");
    expect(html).toContain("Reset image settings");
    expect(html).toContain("mouse wheel");
  });
});
