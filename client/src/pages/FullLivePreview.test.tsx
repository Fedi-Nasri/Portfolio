import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import FullLivePreview, { EditableText } from "./FullLivePreview";

describe("FullLivePreview", () => {
  it("renders the complete portfolio with an Edit section control for every major area", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} />);
    ["Home", "About", "Experience", "Skills &amp; Toolbox", "Certifications", "Capabilities", "Selected Work", "Writing &amp; Insights", "Contact", "Footer"].forEach((label) => expect(html).toContain(label));
    expect((html.match(/live-section-hoverbar/g) ?? []).length).toBe(10);
  });

  it("enables in-place text editing only for the active preview section", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="home" activePath="hero.blurb" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} />);
    expect(html).toContain('contentEditable="true"');
    expect(html).toContain("live-editable-text is-editable");
    expect(html).toContain("section-home is-active");
  });

  it("writes direct preview text edits to the selected content path", () => {
    const changes: Array<{ path: unknown; value: string }> = [];
    const text = EditableText({ value: "Before", path: ["hero", "blurb"], section: "home", activeSection: "home", activePath: "", onSection: () => {}, onSelect: () => {}, onChange: (path, value) => changes.push({ path, value }) });
    (text.props as { onBlur: (event: { currentTarget: { innerText: string } }) => void }).onBlur({ currentTarget: { innerText: "After" } });
    expect(changes).toEqual([{ path: ["hero", "blurb"], value: "After" }]);
  });

  it("shows About add controls only while the About section is active", () => {
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="about" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} />);
    expect(inactive).not.toContain("Add tag");
    expect(active).toContain("Add tag");
    expect(active).toContain("Add statistic");
    expect(active).toContain("live-public-header");
  });
});
