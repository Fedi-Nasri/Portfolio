import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { ProjectImageControlPanel } from "./ProjectImageControlPanel";

describe("ProjectImageControlPanel", () => {
  it("exposes visible image-management and crop controls for a project with an image", () => {
    const html = renderToStaticMarkup(<ProjectImageControlPanel projects={DEFAULT_PORTFOLIO_CONTENT.projects} onChange={() => {}} onUploadImage={() => {}} onRemoveImage={() => {}} />);

    expect(html).toContain("Replace image");
    expect(html).toContain("Remove image");
    expect(html).toContain("Zoom");
    expect(html).toContain("Aspect ratio");
    expect(html).toContain("Frame height");
    expect(html).toContain("Reset image settings");
    expect(html).toContain("mouse wheel");
  });

  it("keeps a visible add-image action when the selected project has no image", () => {
    const projects = structuredClone(DEFAULT_PORTFOLIO_CONTENT.projects);
    projects[0]!.image = "";
    const html = renderToStaticMarkup(<ProjectImageControlPanel projects={projects} onChange={() => {}} onUploadImage={() => {}} />);

    expect(html).toContain("No image attached to this project yet.");
    expect(html).toContain("Add image");
    expect(html).not.toContain("Remove image");
    expect(html).toContain('disabled=""');
  });
});
