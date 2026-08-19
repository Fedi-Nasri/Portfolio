import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { renderPortfolioHtml } from "./portfolioExport";

describe("portfolio export", () => {
  it("renders a portable document with the saved portfolio identity and project content", () => {
    const html = renderPortfolioHtml(structuredClone(DEFAULT_PORTFOLIO_CONTENT));
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Fedi NASRI.");
    expect(html).toContain(DEFAULT_PORTFOLIO_CONTENT.projects[0]!.title);
    expect(html).toContain("Selected Work");
  });
});
