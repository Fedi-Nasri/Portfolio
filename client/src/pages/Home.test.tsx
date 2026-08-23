import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT, type PortfolioContent } from "@shared/portfolio";

let mockPublicContent: PortfolioContent | undefined;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    portfolio: {
      publicContent: {
        useQuery: () => ({ data: mockPublicContent, isLoading: false, error: null }),
      },
    },
  },
}));

import Home from "./Home";

describe("public contact section", () => {
  it("removes the contact form while preserving direct contact and social actions", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("contact-card-refinement");
    expect(html).toContain("contact-direct-card");
    expect(html).not.toContain("reference-form");
    expect(html).not.toContain('placeholder="Your name"');
    expect(html).toContain("mailto:fedinasri.fsb@gmail.com");
    expect(html).toContain("https://www.linkedin.com/in/fedinasri");
    expect(html).toContain("https://github.com/Fedi-Nasri");
  });

  it("renders a collapsed Experience detail disclosure and visible tags for each seeded experience", () => {
    const html = renderToStaticMarkup(<Home />);

    expect((html.match(/See details/g) ?? []).length).toBe(2);
    expect(html).toContain("experience-detail-toggle");
    expect(html).toContain("experience-tag-list");
  });

  it("renders alternating left and right Selected Work project feature rows", () => {
    const html = renderToStaticMarkup(<Home />);

    expect((html.match(/ref-project/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect((html.match(/project-layout-reversed/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect((html.match(/project-detail-disclosure/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(html).toContain("View detailed project");
    expect(html).not.toContain("project-detail-disclosure\" open");
    expect(html).toContain("project-summary");
    expect(html).toContain("A live embedded-Linux dashboard for autonomous navigation, telemetry, and waste detection.");
  });

  it("uses the wide three-column Home composition while preserving the seeded portrait and focus areas", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("reference-hero hero-wide-layout");
    expect(html).toContain("Portrait of Fedi NASRI.");
    expect(html).toContain("Cloud &amp; Network Engineer");
    expect(html).toContain("Security &amp; Networking");
  });

  it("renders the editorial About statistic grid for the public first-scroll reveal", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("about-editorial-layout");
    expect(html).toContain('class="ref-stats" data-stat-reveal="true"');
    expect((html.match(/about-numeric-indicator/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(html).toContain(">2<");
  });

  it("renders the role-focused Cloud, DevOps, and DevSecOps Toolbox cards", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("role-toolbox-section");
    expect(html).toContain("Cloud Engineering");
    expect(html).toContain("DevOps Engineering");
    expect(html).toContain("DevSecOps");
    expect(html).toContain("CI/CD Pipelines");
    expect(html).toContain("Kubernetes");
    expect(html).toContain("Trivy");
    expect(html).toContain("SonarQube");
    expect(html).toContain("Grafana");
    expect(html).toContain("Prometheus");
    expect(html).toContain("Loki");
    expect(html).toContain("HashiCorp Vault");
    expect(html).toContain("OpenTelemetry");
    expect(html).toContain("Argo CD");
    expect(html).toContain("toolbox-role-icon");
    expect(html).not.toContain("tool-brand-mark");
    expect(html).not.toContain("tool-brand-fallback");
  });

  it("expands a no-media project row and normalizes a bare valid project domain into a public action", () => {
    mockPublicContent = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    mockPublicContent.projects[1]!.image = "";
    mockPublicContent.projects[1]!.githubUrl = "googel.com";

    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("project-without-media");
    expect(html).toContain('href="https://googel.com/"');
    expect(html).toContain("GitHub");
    mockPublicContent = undefined;
  });
});
