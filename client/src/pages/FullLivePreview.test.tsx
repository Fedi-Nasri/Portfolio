import React from "react";
import { readFileSync } from "node:fs";
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

  it("uses the public navigation structure with a separate action group and compact call-to-action", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("live-public-header");
    expect(html).toContain("ref-header-actions");
    expect(html).toContain("tone-toggle");
    expect(html).toContain("talk-button");
    expect(html).toContain("Toggle navigation");
  });

  it("renders section ordering controls and an editable custom-section template", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.customSections = [{ id: "custom-1", eyebrow: "New section", title: "Custom focus", body: "Custom section copy" }];
    content.sectionOrder = [...(content.sectionOrder ?? []), "custom-1"];
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="custom" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onAddSection={() => {}} onAddCustomSection={() => {}} onMoveSection={() => {}} onRemoveSection={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("Portfolio layout");
    expect(html).toContain("Add custom section");
    expect(html).toContain("Move Custom focus section up");
    expect(html).toContain("Delete Custom focus section");
    expect(html).toContain("Custom focus");
    expect(html).toContain("Canvas section editor");
    expect(html).toContain("Component library");
    expect(html).toContain("Title box");
    expect(html).toContain("Text box");
  });

  it("keeps a public-hidden section in the editor with a Show action", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.hiddenSections = ["about"];
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="about" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onToggleSectionVisibility={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("section-about is-active is-hidden-public");
    expect(html).toContain("Hidden publicly");
    expect(html).toContain("Show About section on public site");
  });

  it("enables in-place text editing only for the active preview section", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="home" activePath="hero.blurb" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(html).toContain('contentEditable="true"');
    expect(html).toContain("live-editable-text is-editable");
    expect(html).toContain("section-home is-active");
  });

  it("uses the public Home hero composition while keeping Home asset replacement controls active", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="home" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(html).toContain("reference-hero live-reference-hero");
    expect(html).toContain("hero-copy-ref");
    expect(html).toContain("portrait-zone live-portrait-zone");
    expect(html).toContain("hero-role-stack live-hero-role-stack");
    expect((html.match(/Replace SVG/g) ?? []).length).toBe(4);
    expect(html).toContain("Upload image");
  });

  it("keeps the active focus-visual replacement control compact so it cannot cover the artwork", () => {
    const stylesheet = readFileSync(new URL("./full-live-preview.css", import.meta.url), "utf8");
    const focusControlRule = stylesheet.match(/\.live-reference-hero \.focus-asset-upload \{[^}]+\}/)?.[0] ?? "";

    expect(focusControlRule).toContain("width:26px");
    expect(focusControlRule).toContain("height:26px");
    expect(focusControlRule).toContain("top:8px");
    expect(focusControlRule).toContain("right:8px");
    expect(focusControlRule).not.toContain("inset:0");
  });

  it("renders draggable Home focus-card handles with saved coordinate styling only when Home is active", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.hero.focusPositions = [{ x: 8, y: 10 }, { x: 45, y: 20 }, { x: 45, y: 62 }, { x: 7, y: 63 }];
    const activeHtml = renderToStaticMarkup(<FullLivePreview content={content} activeSection="home" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const inactiveHtml = renderToStaticMarkup(<FullLivePreview content={content} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(activeHtml).toContain("Drag DevOps card");
    expect(activeHtml).toContain("left:45%");
    expect(activeHtml).toContain("top:20%");
    expect(inactiveHtml).not.toContain("Drag DevOps card");
  });

  it("shows the reset card layout action only while Home editing is active", () => {
    const activeHtml = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="home" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onResetFocusPositions={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const inactiveHtml = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onResetFocusPositions={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(activeHtml).toContain("Reset card layout");
    expect(inactiveHtml).not.toContain("Reset card layout");
  });

  it("renders Experience detail disclosure controls and active detail-management actions", () => {
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="experience" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onAddExperienceDetail={() => {}} onRemoveExperienceDetail={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(inactive).toContain("See details");
    expect(active).toContain("See details");
    expect(active).toContain("Add detail");
    expect(active).toContain("Add logo");
    expect(active).toContain("Drag experience detail 1");
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

  it("shows direct About tag and statistic deletion controls only while About is active", () => {
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="about" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onRemoveAboutTag={() => {}} onRemoveAboutStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(inactive).not.toContain("Delete tag #Cloud");
    expect(inactive).not.toContain("Delete statistic");
    expect(active).toContain("Delete tag #Cloud");
    expect(active).toContain("Delete statistic");
  });

  it("uses the public About composition while preserving its active management controls", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="about" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onRemoveAboutTag={() => {}} onRemoveAboutStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(html).toContain("ref-section ref-about live-reference-about");
    expect(html).toContain("about-ref-grid");
    expect(html).toContain("hashtag-cloud about-tag-list");
    expect(html).toContain("ref-stats");
    expect(html).toContain("Add statistic");
  });

  it("uses the public Selected Work composition while keeping project text editable", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="projects" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(html).toContain("ref-section ref-projects live-reference-projects");
    expect(html).toContain("ref-project-list");
    expect(html).toContain("project-thumb");
    expect(html).toContain("project-realization");
    expect(html).toContain("project-meta");
    expect(html).toContain('contentEditable="true"');
  });

  it("uses the public Certifications composition while keeping credential fields editable and the PDF viewer affordance available", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="certifications" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("ref-section ref-certifications live-reference-certifications");
    expect(html).toContain("cert-mosaic");
    expect(html).toContain("certifications-grid");
    expect(html).toContain("credential-card has-pdf");
    expect(html).toContain("cert-provider-mark");
    expect(html).toContain("View certificate");
    expect(html).toContain('contentEditable="true"');
  });

  it("shows certificate template, PDF, link, branding, and guarded deletion controls while Certifications is active", () => {
    const single = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    single.certifications = [single.certifications[0]!];
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={single} activeSection="certifications" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onAddCertificate={() => {}} onRemoveCertificate={() => {}} onUploadCertificatePdf={() => {}} onUploadProviderLogo={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(inactive).not.toContain("Add certificate");
    expect(active).toContain("Add certificate");
    expect(active).toContain("Credential link");
    expect(active).toContain("Upload logo");
    expect(active).toContain("Upload PDF");
    expect(active).toContain("Delete certificate");
    expect(active).toContain('class="certificate-delete-button" disabled=""');
  });

  it("renders extended Cloud and DevOps provider text-logo treatments, including Coursera and KodeKloud", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.certifications[0]!.provider = "coursera";
    content.certifications[1]!.provider = "kodekloud";
    content.certifications[2]!.provider = "aws";
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="certifications" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("coursera-mark");
    expect(html).toContain("kodekloud-mark");
    expect(html).toContain("aws-mark");
    expect(html).toContain("coursera");
    expect(html).toContain("KodeKloud");
  });

  it("renders the Microsoft wordmark and attachment cleanup controls for an editable credential", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.certifications[0]!.provider = "microsoft";
    content.certifications[0]!.pdf = "/manus-storage/microsoft-certificate.pdf";
    content.certifications[0]!.url = "https://example.com/microsoft-credential";
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="certifications" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onRemoveCertificatePdf={() => {}} onClearCertificateLink={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("microsoft-squares");
    expect(html).toContain("Microsoft");
    expect(html).toContain("Remove PDF");
    expect(html).toContain("Clear link");
  });

  it("uses the public Writing & Insights composition while preserving editable article metadata and reader actions", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="writing" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("ref-section ref-writing live-reference-writing");
    expect(html).toContain("writing-grid");
    expect(html).toContain("writing-card-main");
    expect(html).toContain("writing-card-meta");
    expect(html).toContain("writing-read");
    expect(html).toContain("writing-link-slot");
    expect(html).toContain('contentEditable="true"');
  });

  it("shows article management controls, an external destination, and revised site-name/date metadata while Writing is active", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.writing[0]!.url = "https://example.com/article";
    const active = renderToStaticMarkup(<FullLivePreview content={content} activeSection="writing" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onAddWritingArticle={() => {}} onRemoveWritingArticle={() => {}} onMoveWritingArticle={() => {}} onClearWritingLink={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(active).toContain("Add featured article");
    expect(active).toContain("writing-site-name");
    expect(active).toContain("writing-post-date");
    expect(active).toContain("https://example.com/article");
    expect(active).toContain("Clear link");
    expect(active).toContain("Move up");
    expect(active).toContain("Move down");
    expect(active).toContain("Delete article");
  });

  it("protects the final Writing & Insights article from deletion", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.writing = [content.writing[0]!];
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="writing" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain('class="writing-delete-button" disabled=""');
  });

  it("shows Selected Work template, image, metadata, case-study, ordering, and deletion controls only while projects are active", () => {
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="projects" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onAddProject={() => {}} onInsertProject={() => {}} onMoveProject={() => {}} onRemoveProject={() => {}} onAddProjectTech={() => {}} onRemoveProjectTech={() => {}} onAddProjectDelivery={() => {}} onRemoveProjectDelivery={() => {}} onAddProjectCaseStudyBlock={() => {}} onRemoveProjectCaseStudyBlock={() => {}} onUploadProjectImage={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(inactive).not.toContain("Add project");
    expect(active).toContain("Add project");
    expect(active).toContain("Upload image");
    expect(active).toContain("Add tech");
    expect(active).toContain("Add delivery");
    expect(active).toContain("Remove block");
    expect(active).toContain("Move up");
    expect(active).toContain("Move down");
    expect(active).toContain("Delete project");
  });

  it("offers restoration actions for hidden case-study blocks and protects the final project from deletion", () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.projects = [content.projects[0]!];
    content.projects[0]!.caseStudyBlocks = ["problem"];
    const html = renderToStaticMarkup(<FullLivePreview content={content} activeSection="projects" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);

    expect(html).toContain("Add What it is");
    expect(html).toContain("Add Realization");
    expect(html).toContain('class="project-delete-button" disabled=""');
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

  it("shows toolbox and tool management controls only while Skills is active", () => {
    const inactive = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection={null} activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    const active = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="skills" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onAddSkillToolbox={() => {}} onAddSkillTool={() => {}} onRemoveSkillTool={() => {}} onRemoveSkillToolbox={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(inactive).not.toContain("Add toolbox");
    expect(active).toContain("Add toolbox");
    expect(active).toContain("Add tool");
    expect(active).toContain("Delete toolbox");
    expect(active).toContain("Delete tool Linux");
  });
});
