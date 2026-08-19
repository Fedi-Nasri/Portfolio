import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import FullLivePreview, { EditableText } from "./FullLivePreview";

describe("FullLivePreview", () => {
  it("renders the complete portfolio with an Edit section control for every major area", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    ["Home", "About", "Experience", "Skills &amp; Toolbox", "Certifications", "Capabilities", "Selected Work", "Writing &amp; Insights", "Contact", "Footer"].forEach((label) => expect(html).toContain(label));
    expect((html.match(/live-section-hoverbar/g) ?? []).length).toBe(10);
  });

  it("enables in-place text editing only for the active preview section", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="home" activePath="hero.blurb" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
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
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="about" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(inactive).not.toContain("Add tag");
    expect(active).toContain("Add tag");
    expect(active).toContain("Add statistic");
    expect(active).toContain("live-public-header");
  });

  it("shows per-entry Experience insertion, tag, and delete controls only while Experience is active", () => {
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="experience" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(inactive).not.toContain("Add above");
    expect(active).toContain("Add above");
    expect(active).toContain("Add below");
    expect(active).toContain("Add tag");
    expect(inactive).not.toContain("Delete experience");
    expect(active).toContain("Delete experience");
    expect(active).toContain("reference-timeline experience-editor-timeline");
  });

  it("assigns the filled current marker to the first Experience entry rather than a stored now flag", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.experience.unshift({ date: "NEW", role: "Newest experience", company: "New company", text: "Newest experience summary.", tags: ["New"], now: false });
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const timeline = html.slice(html.indexOf("experience-editor-timeline"), html.indexOf("section-skills"));
    expect((timeline.match(/latest-job/g) ?? [])).toHaveLength(1);
    expect(timeline.indexOf("latest-job")).toBeLessThan(timeline.indexOf("Newest experience"));
  });

  it("disables deletion when the Experience timeline has only one entry", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.experience = [content.experience[0]!];
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="experience" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(html).toContain('class="experience-delete-button" disabled=""');
  });
});
