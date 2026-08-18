import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { appendAboutStat, appendAboutTag, duplicateListItem, moveListItem, removeListItem } from "./editorContent";

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
