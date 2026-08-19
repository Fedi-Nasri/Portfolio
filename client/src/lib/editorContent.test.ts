import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { appendAboutStat, appendAboutTag, appendExperienceTag, duplicateListItem, insertExperienceTemplate, moveListItem, removeExperienceTag, removeListItem } from "./editorContent";

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
});
