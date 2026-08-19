import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT } from "@shared/portfolio";
import JSZip from "jszip";
import { packageCertificatePdfs, renderPortfolioHtml } from "./portfolioExport";
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

  it("writes certificate PDFs to local paths in the static ZIP package", async () => {
    const content = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    content.certifications[0]!.pdf = "https://example.test/certificate.pdf";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(new Blob(["pdf"]), { status: 200 }));
    const zip = new JSZip();
    const result = await packageCertificatePdfs(content, zip);
    expect(result.count).toBe(1);
    expect(result.paths.get("https://example.test/certificate.pdf")).toBe("assets/certificates/certificate-1.pdf");
    expect(zip.file("assets/certificates/certificate-1.pdf")).toBeTruthy();
    fetchMock.mockRestore();
  });
});
