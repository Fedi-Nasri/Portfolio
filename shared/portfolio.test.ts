import { describe, expect, it } from "vitest";
import { DEFAULT_PORTFOLIO_CONTENT, hydrateExperienceDetails } from "./portfolio";

describe("role-focused Toolbox hydration", () => {
  it("adds the Galylio and freelance cloud-delivery entries only to exact untouched Experience defaults", () => {
    const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    legacy.experience = legacy.experience.slice(2);
    legacy.experience[0]!.now = true;
    legacy.experienceSection = { eyebrow: "Experience", title: "Two internships,\none infrastructure-ready toolkit.", intro: "From full-stack application development to embedded AI and Linux deployment — a clear path toward cloud and network engineering." };
    legacy.about.stats[0] = { value: "2", label: "Internships completed" };
    const custom = structuredClone(legacy);
    custom.experience[0]!.text = "A saved custom experience summary.";

    const hydrated = hydrateExperienceDetails(legacy);
    const customHydrated = hydrateExperienceDetails(custom);
    const persistedGalylio = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    persistedGalylio.experience = persistedGalylio.experience.filter((experience) => experience.company !== "Independent Consulting");
    persistedGalylio.experienceSection = { eyebrow: "Experience", title: "Three internships,\none secure delivery focus.", intro: "From full-stack delivery and embedded AI to DevSecOps pipelines, security checks, and observability — a practical path toward reliable cloud systems." };
    persistedGalylio.about.stats[0] = { value: "3", label: "Internships completed" };
    const persistedFreelance = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    persistedFreelance.about.stats[0] = { value: "2", label: "Internships completed " };

    expect(hydrated.experience[0]).toMatchObject({ role: "Freelance Cloud & Kubernetes Engineer", company: "Independent Consulting", date: "FREELANCE · PROJECT-BASED", now: true });
    expect(hydrated.experience[1]).toMatchObject({ role: "DevSecOps Intern", company: "Galylio", date: "JUN — AUG 2026", now: false });
    expect(hydrated.experience[1]?.tags).toEqual(expect.arrayContaining(["GitHub Actions", "Docker", "SonarQube", "Trivy", "OWASP ZAP", "Prometheus", "Grafana"]));
    expect(hydrated.experienceSection.title).toBe("Four engineering engagements,\nfrom secure delivery to cloud migration.");
    expect(hydrated.about.stats[0]).toEqual({ value: "4", label: "Professional engagements" });
    expect(hydrateExperienceDetails(persistedGalylio).experience[0]).toMatchObject({ role: "Freelance Cloud & Kubernetes Engineer", company: "Independent Consulting", now: true });
    expect(hydrateExperienceDetails(persistedGalylio).about.stats[0]).toEqual({ value: "4", label: "Professional engagements" });
    expect(hydrateExperienceDetails(persistedFreelance).about.stats[0]).toEqual({ value: "4", label: "Professional engagements" });
    expect(customHydrated.experience).toHaveLength(2);
    expect(customHydrated.experience[0]?.text).toBe("A saved custom experience summary.");
  });

  it("adds the 1111.tn and freelance Selected Work entries only to an untouched legacy project baseline", () => {
    const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    legacy.projects = legacy.projects.slice(2);
    legacy.projects.forEach((project) => { project.summary = undefined; });
    legacy.projectsSection = { ...legacy.projectsSection, title: "Four systems,\nbuilt to run reliably.", intro: "From real-time AI monitoring to certificate-based access control and automated cloud deployment — each project strengthened a different infrastructure layer." };
    const custom = structuredClone(legacy);
    custom.projects[0]!.summary = "A custom saved project summary.";

    const hydrated = hydrateExperienceDetails(legacy);
    const customHydrated = hydrateExperienceDetails(custom);

    expect(hydrated.projects).toHaveLength(6);
    expect(hydrated.projectsSection.title).toBe("Six systems,\nbuilt to run reliably.");
    expect(hydrated.projects[0]).toMatchObject({ title: "1111.tn DevSecOps Delivery", state: "Professional project", tech: expect.arrayContaining(["GitHub Actions", "Trivy", "OWASP ZAP", "Grafana"]) });
    expect(hydrated.projects[1]).toMatchObject({ title: "Cloud & Kubernetes Modernization", state: "Freelance engagement", tech: expect.arrayContaining(["Kubernetes", "Microsoft Azure"]) });
    expect(customHydrated.projects).toHaveLength(4);
    expect(customHydrated.projects[0]?.summary).toBe("A custom saved project summary.");
    expect(customHydrated.projectsSection.title).toBe("Four systems,\nbuilt to run reliably.");
  });

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
    expect(hydrated.skills[0]).toMatchObject({ heading: "Cloud infrastructure", entries: expect.arrayContaining(["OVHcloud", "Terraform"]) });
    expect(hydrated.skills[2]).toMatchObject({ heading: "Secure delivery", entries: expect.arrayContaining(["HTTPS/TLS", "HashiCorp Vault", "OWASP ZAP"]) });
    expect(hydrated.skills[3]).toMatchObject({ heading: "Network foundations", entries: expect.arrayContaining(["Wireshark", "802.1X Authentication", "Firewalls"]) });
    expect(hydrated.skills[4]).toMatchObject({ heading: "Observability & resilience", entries: expect.arrayContaining(["OpenTelemetry", "RabbitMQ", "Alertmanager", "MySQL", "Firebase"]) });
    expect(legacy.skills).toHaveLength(6);
    expect(legacy.skills[0]?.role).toBeUndefined();
  });

  it("adds a concise summary for legacy projects without overwriting an existing project summary", () => {
    const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    legacy.projects = legacy.projects.slice(2);
    legacy.projects[0]!.summary = undefined;
    legacy.projects[1]!.summary = "Saved concise summary.";

    const hydrated = hydrateExperienceDetails(legacy);

    expect(hydrated.projects[0]!.summary).toBe("Architected a live monitoring web application, a Python navigation backend, and a YOLOv11 waste-detection pipeline deployed on embedded Linux.");
    expect(hydrated.projects[1]!.summary).toBe("Saved concise summary.");
    expect(legacy.projects[0]!.summary).toBeUndefined();
  });

  it("upgrades only the untouched About copy to the approved systems-and-delivery positioning", () => {
    const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    legacy.about.title = "A systems-focused engineer\nconnecting every layer of the stack.";
    legacy.about.paragraphs = ["I'm a Computer Engineering Master's student at the Faculty of Sciences of Bizerte, specialising in networking and cloud computing. My experience spans Linux systems, secure network infrastructure, databases, and deployable AI services.", "I work across the service lifecycle — from reliable network architecture and cloud-aware automation to monitoring applications and real-time data pipelines.", "I enjoy making infrastructure practical, observable, and secure. My focus is server administration, network supervision, cloud deployment, and database management."];
    const custom = structuredClone(legacy);
    custom.about.paragraphs[1] = "A custom saved About paragraph.";

    const hydrated = hydrateExperienceDetails(legacy);
    const customHydrated = hydrateExperienceDetails(custom);

    expect(hydrated.about.title).toBe("A passionate engineer,\nfrom secure infrastructure foundations to reliable cloud delivery.");
    expect(hydrated.about.paragraphs[0]).toContain("**cloud, networking, Linux systems, and secure application delivery**");
    expect(hydrated.about.stats).toEqual([{ value: "4", label: "Professional engagements" }, { value: "6", label: "Systems delivered" }, { value: "5", label: "Professional certifications" }, { value: "20+", label: "Technologies in toolbox" }]);
    expect(customHydrated.about.title).toBe("A systems-focused engineer\nconnecting every layer of the stack.");
    expect(customHydrated.about.paragraphs[1]).toBe("A custom saved About paragraph.");
  });

  it("upgrades only the untouched capability-map messaging to the lifecycle positioning", () => {
    const legacy = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    legacy.capabilities = { eyebrow: "Cloud & Infrastructure", title: "One engineer,\nevery critical layer.", description: "Secure networks, Linux systems, containers, cloud services, real-time monitoring, and data infrastructure — designed to work together.", services: [{ name: "Linux Systems", description: "Debian and Ubuntu administration, Bash scripting, monitoring, and inter-service communication." }, { name: "Cloud & DevOps", description: "Docker, Compose, CI/CD, cloud VMs, service dependencies, and health checks." }, { name: "Network Security", description: "TCP/IP, DNS, TLS, VLANs, ACLs, NAT, VPNs, and enterprise access control." }, { name: "Databases", description: "PostgreSQL, MySQL, MongoDB, Firebase Firestore, and live telemetry data." }, { name: "Full-Stack", description: "React, Flask, Symfony, API services, dashboards, and dependable data flows." }, { name: "Applied AI", description: "Python, OpenCV, TensorFlow, YOLOv11, and deployable computer-vision pipelines." }] };
    const hydrated = hydrateExperienceDetails(legacy);
    expect(hydrated.capabilities.title).toBe("From infrastructure foundations\nto reliable delivery.");
    expect(hydrated.capabilities.services.map((service) => service.name)).toEqual(["Linux Foundations", "Cloud & DevOps Delivery", "Networking & Security", "Data & Service Reliability", "Development Services", "Hands-on Applied AI"]);
    expect(legacy.capabilities.title).toBe("One engineer,\nevery critical layer.");
  });

  it("upgrades the exact prior lifecycle title without changing a custom capability title", () => {
    const prior = structuredClone(DEFAULT_PORTFOLIO_CONTENT);
    prior.capabilities.title = "Engineering every stage\nfrom foundation to delivery.";
    const custom = structuredClone(prior);
    custom.capabilities.title = "My custom engineering story";

    expect(hydrateExperienceDetails(prior).capabilities.title).toBe("From infrastructure foundations\nto reliable delivery.");
    expect(hydrateExperienceDetails(custom).capabilities.title).toBe("My custom engineering story");
  });
});
