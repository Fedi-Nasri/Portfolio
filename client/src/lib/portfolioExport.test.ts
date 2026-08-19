import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import { renderPortfolioHtml } from "./portfolioExport";
import { renderFaithfulStaticPortfolio, STATIC_PUBLIC_CSS, STATIC_PUBLIC_JS } from "./staticPublicExport";

describe("portfolio export", () => {
  it("renders a portable document with the saved portfolio identity and project content", () => {
    const html = renderPortfolioHtml(structuredClone(DEFAULT_PORTFOLIO_CONTENT));
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Fedi NASRI.");
    expect(html).toContain(DEFAULT_PORTFOLIO_CONTENT.projects[0]!.title);
    expect(html).toContain("Selected Work");
  });

  it("renders the static public-preview package with interactive and responsive assets", () => {
    const html = renderFaithfulStaticPortfolio(structuredClone(DEFAULT_PORTFOLIO_CONTENT));
    expect(html).toContain('href="styles.css"');
    expect(html).toContain('src="app.js"');
    expect(html).toContain('class="hero-visual"');
    expect(html).toContain(DEFAULT_PORTFOLIO_CONTENT.projects[0]!.title);
    expect(STATIC_PUBLIC_CSS).toContain("@media(max-width:800px)");
    expect(STATIC_PUBLIC_JS).toContain("data-pdf");
  });
});
