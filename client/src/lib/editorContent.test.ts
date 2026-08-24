import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { addPortfolioSection, addProjectCaseStudyBlock, appendAboutStat, appendAboutTag, appendCanvasCopyFromSection, appendCertificate, appendCustomPortfolioSection, appendExperienceDetail, appendExperienceTag, appendProjectDelivery, appendProjectTech, appendSkillTool, appendSkillToolbox, appendWritingArticle, createProjectTemplate, duplicateListItem, getHiddenPortfolioSections, getPortfolioSectionOrder, insertExperienceTemplate, insertProjectTemplate, isPortfolioSectionHidden, moveListItem, movePortfolioSection, removeAboutStat, removeAboutTag, removeCertificate, removeExperienceDetail, removeExperienceTag, removeListItem, removePortfolioSection, removeProject, removeProjectCaseStudyBlock, removeProjectDelivery, removeProjectTech, removeSkillTool, removeSkillToolbox, removeWritingArticle, reorderExperienceDetail, togglePortfolioSectionVisibility } from "./editorContent";

describe("direct editor list operations", () => {
  it("duplicates, reorders, and removes draft list items without mutating the original content", () => {
    const duplicated = duplicateListItem(DEFAULT_PORTFOLIO_CONTENT, ["experience"], 0);
    expect(duplicated.experience).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.experience.length + 1);
    expect(DEFAULT_PORTFOLIO_CONTENT.experience).toHaveLength(4);

    const moved = moveListItem(duplicated, ["experience"], 0, 1);
    expect(moved.experience[0].role).toBe(duplicated.experience[1].role);

    const removed = removeListItem(moved, ["experience"], 1);
    expect(removed.experience).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.experience.length);
  });
});

describe("About quick additions", () => {
  it("appends editable tag and statistic defaults without mutating existing portfolio content", () => {
    const withTag = appendAboutTag(DEFAULT_PORTFOLIO_CONTENT);
    const withStat = appendAboutStat(withTag);

    expect(withTag.about.tags.at(-1)).toBe("New tag");
    expect(withStat.about.stats.at(-1)).toEqual({ value: "00", label: "New statistic" });
    expect(DEFAULT_PORTFOLIO_CONTENT.about.tags).not.toContain("New tag");
  });
});

describe("Experience quick additions", () => {
  it("inserts a clean editable template above or below an entry and appends a tag without mutating saved content", () => {
    const above = insertExperienceTemplate(DEFAULT_PORTFOLIO_CONTENT, 0, "above");
    const below = insertExperienceTemplate(DEFAULT_PORTFOLIO_CONTENT, 0, "below");
    const withTag = appendExperienceTag(above, 0);

    expect(above.experience).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.experience.length + 1);
    expect(above.experience[0]).toMatchObject({ date: "MONTH — YEAR", role: "New experience title", details: ["Describe a key responsibility, delivery, or measurable outcome."], tags: ["New tag"] });
    expect(below.experience[1]?.role).toBe("New experience title");
    expect(withTag.experience[0]?.tags).toEqual(["New tag", "New tag"]);
    expect(DEFAULT_PORTFOLIO_CONTENT.experience).toHaveLength(4);
  });

  it("does not remove the final Experience entry from a draft", () => {
    const single = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    single.experience = [single.experience[0]!];

    expect(removeListItem(single, ["experience"], 0).experience).toEqual(single.experience);
  });

  it("removes an individual Experience tag, including the final tag when needed", () => {
    const withOneTag = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    withOneTag.experience[0]!.tags = ["Only tag"];

    expect(removeExperienceTag(DEFAULT_PORTFOLIO_CONTENT, 0, 1).experience[0]?.tags).not.toContain("Flask");
    expect(removeExperienceTag(withOneTag, 0, 0).experience[0]?.tags).toEqual([]);
  });

  it("adds and removes expandable Experience detail bullets, including the final detail", () => {
    const withDetail = appendExperienceDetail(DEFAULT_PORTFOLIO_CONTENT, 0);
    const withOneDetail = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    withOneDetail.experience[0]!.details = ["Only detail"];

    expect(withDetail.experience[0]?.details?.at(-1)).toBe("New experience detail");
    expect(removeExperienceDetail(withDetail, 0, (withDetail.experience[0]?.details.length ?? 1) - 1).experience[0]?.details).toEqual(DEFAULT_PORTFOLIO_CONTENT.experience[0]?.details);
    expect(removeExperienceDetail(withOneDetail, 0, 0).experience[0]?.details).toEqual([]);
  });

  it("reorders Experience detail bullets without changing the saved source or accepting invalid moves", () => {
    const original = DEFAULT_PORTFOLIO_CONTENT.experience[0]?.details ?? [];
    const moved = reorderExperienceDetail(DEFAULT_PORTFOLIO_CONTENT, 0, 0, 2);

    expect(moved.experience[0]?.details).toEqual([original[1], original[2], original[0]]);
    expect(DEFAULT_PORTFOLIO_CONTENT.experience[0]?.details).toEqual(original);
    expect(reorderExperienceDetail(DEFAULT_PORTFOLIO_CONTENT, 0, 0, 99)).toBe(DEFAULT_PORTFOLIO_CONTENT);
  });

  it("adds and removes toolbox categories and individual tools safely", () => {
    const withToolbox = appendSkillToolbox(DEFAULT_PORTFOLIO_CONTENT);
    const withTool = appendSkillTool(DEFAULT_PORTFOLIO_CONTENT, 0);
    const withoutTool = removeSkillTool(withTool, 0, withTool.skills[0]!.entries.length - 1);
    const oneToolbox = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    oneToolbox.skills = [oneToolbox.skills[0]!];

    expect(withToolbox.skills).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.skills.length + 1);
    expect(withToolbox.skills.at(-1)).toEqual({ role: "Custom engineering focus", heading: "New toolbox", entries: ["New tool"] });
    expect(withoutTool.skills[0]!.entries).toEqual(DEFAULT_PORTFOLIO_CONTENT.skills[0]!.entries);
    expect(removeSkillToolbox(oneToolbox, 0).skills).toEqual(oneToolbox.skills);
  });

  it("removes individual About tags and statistics, including the final item", () => {
    const oneTagAndStat = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    oneTagAndStat.about.tags = ["Only tag"];
    oneTagAndStat.about.stats = [{ value: "01", label: "Only statistic" }];

    expect(removeAboutTag(DEFAULT_PORTFOLIO_CONTENT, 0).about.tags).not.toContain("#Cloud");
    expect(removeAboutStat(DEFAULT_PORTFOLIO_CONTENT, 0).about.stats).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.about.stats.length - 1);
    expect(removeAboutTag(oneTagAndStat, 0).about.tags).toEqual([]);
    expect(removeAboutStat(oneTagAndStat, 0).about.stats).toEqual([]);
  });
});

describe("Selected Work project management", () => {
  it("inserts an editable project template above or below an existing project without mutating saved content", () => {
    const above = insertProjectTemplate(DEFAULT_PORTFOLIO_CONTENT, 0, "above");
    const below = insertProjectTemplate(DEFAULT_PORTFOLIO_CONTENT, 0, "below");

    expect(above.projects).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.projects.length + 1);
    expect(above.projects[0]).toMatchObject({ title: "New infrastructure project", state: "Draft template", tech: ["New technology"], delivery: ["Project outcome"] });
    expect(createProjectTemplate()).toMatchObject({ image: "", githubUrl: "", liveUrl: "", summary: "Add a concise description that explains this project at a glance." });
    expect(below.projects[1]?.title).toBe("New infrastructure project");
    expect(DEFAULT_PORTFOLIO_CONTENT.projects).toHaveLength(4);
  });

  it("adds and removes project tech and delivery items, including the final item", () => {
    const withTech = appendProjectTech(DEFAULT_PORTFOLIO_CONTENT, 0);
    const withDelivery = appendProjectDelivery(withTech, 0);
    const oneItemProject = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    oneItemProject.projects[0]!.tech = ["Only tech"];
    oneItemProject.projects[0]!.delivery = ["Only delivery"];

    expect(withDelivery.projects[0]!.tech.at(-1)).toBe("New technology");
    expect(withDelivery.projects[0]!.delivery.at(-1)).toBe("Project outcome");
    expect(removeProjectTech(withDelivery, 0, withDelivery.projects[0]!.tech.length - 1).projects[0]!.tech).toEqual(DEFAULT_PORTFOLIO_CONTENT.projects[0]!.tech);
    expect(removeProjectDelivery(withDelivery, 0, withDelivery.projects[0]!.delivery.length - 1).projects[0]!.delivery).toEqual(DEFAULT_PORTFOLIO_CONTENT.projects[0]!.delivery);
    expect(removeProjectTech(oneItemProject, 0, 0).projects[0]!.tech).toEqual([]);
    expect(removeProjectDelivery(oneItemProject, 0, 0).projects[0]!.delivery).toEqual([]);
  });

  it("hides and restores individual case-study blocks in a consistent public order", () => {
    const withoutDescription = removeProjectCaseStudyBlock(DEFAULT_PORTFOLIO_CONTENT, 0, "body");
    const restored = addProjectCaseStudyBlock(withoutDescription, 0, "body");

    expect(withoutDescription.projects[0]!.caseStudyBlocks).toEqual(["problem", "realization"]);
    expect(restored.projects[0]!.caseStudyBlocks).toEqual(["problem", "body", "realization"]);
  });

  it("reorders projects and keeps one project when deletion reaches the final item", () => {
    const moved = moveListItem(DEFAULT_PORTFOLIO_CONTENT, ["projects"], 0, 1);
    const single = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    single.projects = [single.projects[0]!];

    expect(moved.projects[0]!.title).toBe(DEFAULT_PORTFOLIO_CONTENT.projects[1]!.title);
    expect(removeProject(single, 0).projects).toEqual(single.projects);
  });
});

describe("Certifications management", () => {
  it("adds a complete editable certificate template without mutating saved content", () => {
    const withCertificate = appendCertificate(DEFAULT_PORTFOLIO_CONTENT);

    expect(withCertificate.certifications).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.certifications.length + 1);
    expect(withCertificate.certifications.at(-1)).toMatchObject({ name: "New professional certificate", provider: "custom", providerLabel: "Provider", url: "" });
    expect(DEFAULT_PORTFOLIO_CONTENT.certifications).toHaveLength(5);
  });

  it("protects the final certificate while allowing a credential list with multiple items to shrink", () => {
    const single = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    single.certifications = [single.certifications[0]!];

    expect(removeCertificate(DEFAULT_PORTFOLIO_CONTENT, 0).certifications).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.certifications.length - 1);
    expect(removeCertificate(single, 0).certifications).toEqual(single.certifications);
  });
});

describe("Writing & Insights management", () => {
  it("adds a complete featured-article template and preserves external link fields", () => {
    const withArticle = appendWritingArticle(DEFAULT_PORTFOLIO_CONTENT);

    expect(withArticle.writing).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.writing.length + 1);
    expect(withArticle.writing.at(-1)).toMatchObject({ title: "New featured article", siteName: "Your site or publication", status: "Read article", url: "" });
    expect(DEFAULT_PORTFOLIO_CONTENT.writing).toHaveLength(2);
  });

  it("reorders articles and protects the final article from deletion", () => {
    const moved = moveListItem(DEFAULT_PORTFOLIO_CONTENT, ["writing"], 0, 1);
    const single = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    single.writing = [single.writing[0]!];

    expect(moved.writing[0]!.title).toBe(DEFAULT_PORTFOLIO_CONTENT.writing[1]!.title);
    expect(removeWritingArticle(DEFAULT_PORTFOLIO_CONTENT, 0).writing).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.writing.length - 1);
    expect(removeWritingArticle(single, 0).writing).toEqual(single.writing);
  });
});

describe("Portfolio section management", () => {
  it("persists safe section ordering while keeping Home fixed at the top", () => {
    const moved = movePortfolioSection(DEFAULT_PORTFOLIO_CONTENT, "about", 1);

    expect(getPortfolioSectionOrder(moved).slice(0, 3)).toEqual(["home", "experience", "about"]);
    expect(movePortfolioSection(DEFAULT_PORTFOLIO_CONTENT, "home", 1)).toBe(DEFAULT_PORTFOLIO_CONTENT);
  });

  it("removes and restores an optional built-in section around the contact position", () => {
    const removed = removePortfolioSection(DEFAULT_PORTFOLIO_CONTENT, "writing");
    const restored = addPortfolioSection(removed, "writing");

    expect(getPortfolioSectionOrder(removed)).not.toContain("writing");
    expect(getPortfolioSectionOrder(restored).at(-2)).toBe("writing");
    expect(getPortfolioSectionOrder(restored).at(-1)).toBe("contact");
  });

  it("hides and restores a section without changing its order or content", () => {
    const hidden = togglePortfolioSectionVisibility(DEFAULT_PORTFOLIO_CONTENT, "about");
    const restored = togglePortfolioSectionVisibility(hidden, "about");

    expect(getHiddenPortfolioSections(hidden)).toEqual(["about"]);
    expect(isPortfolioSectionHidden(hidden, "about")).toBe(true);
    expect(getPortfolioSectionOrder(hidden)).toEqual(getPortfolioSectionOrder(DEFAULT_PORTFOLIO_CONTENT));
    expect(restored.hiddenSections).toEqual([]);
    expect(restored.about).toEqual(DEFAULT_PORTFOLIO_CONTENT.about);
  });

  it("adds a complete custom section template and removes its data when deleted", () => {
    const withCustom = appendCustomPortfolioSection(DEFAULT_PORTFOLIO_CONTENT);
    const customId = withCustom.customSections?.[0]?.id ?? "";
    const withoutCustom = removePortfolioSection(withCustom, customId);

    expect(withCustom.customSections?.[0]).toMatchObject({ id: "custom-1", eyebrow: "New section", title: "A new portfolio section", canvasHeight: 420 });
    expect(withCustom.customSections?.[0]?.components).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "custom-1-title", type: "title", width: 560, height: 116 }),
      expect.objectContaining({ id: "custom-1-text", type: "text", width: 500, height: 126 }),
    ]));
    expect(getPortfolioSectionOrder(withCustom).at(-2)).toBe("custom-1");
    expect(withoutCustom.customSections).toEqual([]);
    expect(getPortfolioSectionOrder(withoutCustom)).not.toContain("custom-1");
  });

  it("copies an existing section into a separate editable canvas without changing the source section", () => {
    const copied = appendCanvasCopyFromSection(DEFAULT_PORTFOLIO_CONTENT, "projects");
    const section = copied.customSections?.[0];

    expect(section).toMatchObject({ eyebrow: DEFAULT_PORTFOLIO_CONTENT.projectsSection.eyebrow, title: DEFAULT_PORTFOLIO_CONTENT.projectsSection.title, canvasHeight: 420 });
    expect(section?.components).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "image", imageUrl: DEFAULT_PORTFOLIO_CONTENT.projects[0]?.image }),
      expect.objectContaining({ type: "button", href: "#projects" }),
    ]));
    expect(copied.projectsSection).toEqual(DEFAULT_PORTFOLIO_CONTENT.projectsSection);
    expect(getPortfolioSectionOrder(copied).at(-2)).toBe(section?.id);
  });
});
