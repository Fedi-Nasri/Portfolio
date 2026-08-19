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

  it("uses the public Home hero composition while keeping Home asset replacement controls active", () => {
    const html = renderToStaticMarkup(<FullLivePreview content={DEFAULT_PORTFOLIO_CONTENT} activeSection="home" activePath="" onSection={() => {}} onChange={() => {}} onSelect={() => {}} onAddTag={() => {}} onAddStat={() => {}} onInsertExperience={() => {}} onAddExperienceTag={() => {}} onRemoveExperience={() => {}} onUploadAsset={() => {}} uploadingAsset={null} />);
    expect(html).toContain("reference-hero live-reference-hero");
    expect(html).toContain("hero-copy-ref");
    expect(html).toContain("portrait-zone live-portrait-zone");
    expect(html).toContain("hero-role-stack live-hero-role-stack");
    expect((html.match(/Replace SVG/g) ?? []).length).toBe(4);
    expect(html).toContain("Upload image");
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
