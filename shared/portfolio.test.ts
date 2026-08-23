import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT, hydrateExperienceDetails } from "./portfolio";

describe("role-focused Toolbox hydration", () => {
  it("upgrades legacy Toolbox headings into the DevOps, DevSecOps, and Cloud Engineering groups without mutating saved content", () => {
    const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    legacy.skills = [
      "Systems & OS",
      "Containers & CI/CD",
      "Networking",
      "Cloud & Data",
      "Programming",
      "Frameworks & AI",
    ].map((heading) => ({ heading, entries: ["Legacy tool"] }));

    const hydrated = hydrateExperienceDetails(legacy);

    expect(hydrated.skills).toHaveLength(5);
    expect(hydrated.skills.map((group) => group.role)).toEqual(["Cloud Engineering", "DevOps Engineering", "DevSecOps", "Network Operations", "Site Reliability"]);
    expect(hydrated.skills[1]).toMatchObject({ heading: "Delivery & orchestration", entries: expect.arrayContaining(["Kubernetes", "Argo CD", "Jenkins"]) });
    expect(hydrated.skills[2]).toMatchObject({ heading: "Secure delivery", entries: expect.arrayContaining(["HTTPS/TLS", "HashiCorp Vault", "OWASP ZAP"]) });
    expect(hydrated.skills[4]).toMatchObject({ heading: "Observability & resilience", entries: expect.arrayContaining(["OpenTelemetry", "RabbitMQ", "Alertmanager"]) });
    expect(legacy.skills).toHaveLength(6);
    expect(legacy.skills[0]?.role).toBeUndefined();
  });
});
