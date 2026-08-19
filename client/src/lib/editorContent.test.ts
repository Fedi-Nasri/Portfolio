import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { addProjectCaseStudyBlock, appendAboutStat, appendAboutTag, appendExperienceTag, appendProjectDelivery, appendProjectTech, appendSkillTool, appendSkillToolbox, duplicateListItem, insertExperienceTemplate, insertProjectTemplate, moveListItem, removeAboutStat, removeAboutTag, removeExperienceTag, removeListItem, removeProject, removeProjectCaseStudyBlock, removeProjectDelivery, removeProjectTech, removeSkillTool, removeSkillToolbox } from "./editorContent";

describe("direct editor list operations", () => {
  it("duplicates, reorders, and removes draft list items without mutating the original content", () => {
    const duplicated = duplicateListItem(DEFAULT_PORTFOLIO_CONTENT, ["experience"], 0);
    expect(duplicated.experience).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.experience.length + 1);
    expect(DEFAULT_PORTFOLIO_CONTENT.experience).toHaveLength(2);

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
    expect(above.experience[0]).toMatchObject({ date: "MONTH — YEAR", role: "New experience title", tags: ["New tag"] });
    expect(below.experience[1]?.role).toBe("New experience title");
    expect(withTag.experience[0]?.tags).toEqual(["New tag", "New tag"]);
    expect(DEFAULT_PORTFOLIO_CONTENT.experience).toHaveLength(2);
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

  it("adds and removes toolbox categories and individual tools safely", () => {
    const withToolbox = appendSkillToolbox(DEFAULT_PORTFOLIO_CONTENT);
    const withTool = appendSkillTool(DEFAULT_PORTFOLIO_CONTENT, 0);
    const withoutTool = removeSkillTool(withTool, 0, withTool.skills[0]!.entries.length - 1);
    const oneToolbox = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    oneToolbox.skills = [oneToolbox.skills[0]!];

    expect(withToolbox.skills).toHaveLength(DEFAULT_PORTFOLIO_CONTENT.skills.length + 1);
    expect(withToolbox.skills.at(-1)).toEqual({ heading: "New toolbox", entries: ["New tool"] });
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
