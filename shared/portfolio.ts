export type FocusPosition = { x: number; y: number };
export type CanvasComponentType = "title" | "text" | "image" | "button" | "tag-list" | "stat" | "contact-card";
export type CustomSectionCanvasComponent = { id: string; type: CanvasComponentType; content: string; x: number; y: number; width: number; height: number; imageUrl?: string; href?: string; items?: string[] };
export type CanvasLayoutPreset = { id: string; name: string; components: CustomSectionCanvasComponent[]; canvasHeight: number };
export type CustomPortfolioSection = { id: string; eyebrow: string; title: string; body: string; components?: CustomSectionCanvasComponent[]; canvasHeight?: number };

export function getCustomSectionCanvasComponents(section: CustomPortfolioSection): CustomSectionCanvasComponent[] {
  if (section.components?.length) return section.components;
  return [
    { id: `${section.id}-title`, type: "title", content: section.title, x: 48, y: 58, width: 560, height: 116 },
    { id: `${section.id}-text`, type: "text", content: section.body, x: 48, y: 204, width: 500, height: 126 },
  ];
}

export const DEFAULT_FOCUS_POSITIONS: FocusPosition[] = [{ x: 4, y: 6 }, { x: 47, y: 22 }, { x: 47, y: 66 }, { x: 6, y: 66 }];
export const createDefaultFocusPositions = (): FocusPosition[] => DEFAULT_FOCUS_POSITIONS.map(({ x, y }) => ({ x, y }));

export type PortfolioContent = {
  sectionOrder?: string[];
  hiddenSections?: string[];
  customSections?: CustomPortfolioSection[];
  canvasPresets?: CanvasLayoutPreset[];
  navigation: { home: string; experience: string; skills: string; certifications: string; projects: string; writing: string; about: string; contact: string };
  hero: { hello: string; firstName: string; lastName: string; role: string; location: string; blurb: string; email: string; phone: string; githubUrl: string; linkedInUrl: string; portraitUrl: string; focusAreas: string[]; focusVisuals?: string[]; focusPositions?: FocusPosition[] };
  about: { eyebrow: string; title: string; paragraphs: string[]; tags: string[]; stats: { value: string; label: string }[] };
  experienceSection: { eyebrow: string; title: string; intro: string };
  experience: { date: string; role: string; company: string; companyLogo?: string; text: string; tags: string[]; details?: string[]; now?: boolean }[];
  skillsSection: { eyebrow: string; title: string };
  skills: { role?: string; heading: string; entries: string[] }[];
  credentialsSection: { eyebrow: string; title: string; intro: string };
  certifications: { name: string; provider: "aws" | "azure" | "cisco" | "cloudflare" | "comptia" | "coursera" | "custom" | "docker" | "fortinet" | "github" | "gitlab" | "google-cloud" | "hashicorp" | "ibm" | "isc2" | "jenkins" | "kodekloud" | "kubernetes" | "linux-foundation" | "microsoft" | "oracle" | "redhat" | "terraform"; providerLabel?: string; providerLogo?: string; issuer: string; issued: string; scope: string; pdf?: string; preview?: string; url?: string }[];
  capabilities: { eyebrow: string; title: string; description: string; services: { name: string; description: string }[] };
  projectsSection: { eyebrow: string; title: string; intro: string; problemLabel: string; descriptionLabel: string; realizationLabel: string; techLabel: string; deliveryLabel: string };
  projects: { image: string; imageFocus?: { x: number; y: number }; imageZoom?: number; imageAspectRatio?: "portrait" | "square" | "standard" | "widescreen"; imageFrameHeight?: number; githubUrl?: string; liveUrl?: string; type: string; state: string; title: string; byline: string; summary?: string; problem: string; body: string; realization: string; tech: string[]; delivery: string[]; caseStudyBlocks?: ("problem" | "body" | "realization")[] }[];
  writingSection: { eyebrow: string; title: string; intro: string };
  writing: { title: string; date: string; siteName?: string; category: string; readTime: string; preview: string; body: string[]; status: string; url?: string }[];
  contact: { eyebrow: string; title: string; intro: string; location: string; submitLabel: string };
  footer: string;
};

export const PORTFOLIO_SECTION_IDS = ["home", "about", "experience", "skills", "certifications", "capabilities", "projects", "writing", "contact"] as const;
export type PortfolioSectionId = (typeof PORTFOLIO_SECTION_IDS)[number];
export const DEFAULT_SECTION_ORDER: PortfolioSectionId[] = ["home", "about", "experience", "skills", "certifications", "capabilities", "projects", "writing", "contact"];

const ROLE_FOCUSED_TOOLBOX = [
  { role: "Cloud Engineering", heading: "Cloud infrastructure", entries: ["AWS", "Microsoft Azure", "OVHcloud", "Cloud VMs", "IAM", "VPC Networking", "Terraform", "Ansible", "Helm"] },
  { role: "DevOps Engineering", heading: "Delivery & orchestration", entries: ["Linux", "Bash Scripting", "Git", "GitHub Actions", "CI/CD Pipelines", "Jenkins", "Docker", "Docker Compose", "Kubernetes", "Helm", "Argo CD"] },
  { role: "DevSecOps", heading: "Secure delivery", entries: ["HTTPS/TLS", "PKI", "Secrets Management", "HashiCorp Vault", "Trivy", "SonarQube", "Snyk", "OWASP ZAP", "Dependabot", "Dependency Checks", "SBOMs"] },
  { role: "Network Operations", heading: "Network foundations", entries: ["TCP/IP", "DNS", "Nginx", "Wireshark", "802.1X Authentication", "Firewalls", "VLANs", "NAT", "VPN", "Tailscale"] },
  { role: "Site Reliability", heading: "Observability & resilience", entries: ["Grafana", "Prometheus", "Loki", "Alertmanager", "OpenTelemetry", "PostgreSQL", "MySQL", "Redis", "Firebase", "RabbitMQ", "Health Checks", "Metrics", "Logging", "Alerting", "Incident Runbooks"] },
] satisfies PortfolioContent["skills"];

const LEGACY_TOOLBOX_HEADINGS = ["Systems & OS", "Containers & CI/CD", "Networking", "Cloud & Data", "Programming", "Frameworks & AI"];

const LEGACY_CAPABILITIES = { eyebrow: "Cloud & Infrastructure", title: "One engineer,\nevery critical layer.", description: "Secure networks, Linux systems, containers, cloud services, real-time monitoring, and data infrastructure — designed to work together.", services: [{ name: "Linux Systems", description: "Debian and Ubuntu administration, Bash scripting, monitoring, and inter-service communication." }, { name: "Cloud & DevOps", description: "Docker, Compose, CI/CD, cloud VMs, service dependencies, and health checks." }, { name: "Network Security", description: "TCP/IP, DNS, TLS, VLANs, ACLs, NAT, VPNs, and enterprise access control." }, { name: "Databases", description: "PostgreSQL, MySQL, MongoDB, Firebase Firestore, and live telemetry data." }, { name: "Full-Stack", description: "React, Flask, Symfony, API services, dashboards, and dependable data flows." }, { name: "Applied AI", description: "Python, OpenCV, TensorFlow, YOLOv11, and deployable computer-vision pipelines." }] } satisfies PortfolioContent["capabilities"];
const PRIOR_LIFECYCLE_CAPABILITY_TITLE = "Engineering every stage\nfrom foundation to delivery.";
const LIFECYCLE_CAPABILITIES = { eyebrow: "Deployment Lifecycle", title: "From infrastructure foundations\nto reliable delivery.", description: "I connect Linux and networking foundations with cloud infrastructure, DevOps delivery, application services, data systems, and hands-on AI — building deployments that are secure, observable, and ready to evolve.", services: [{ name: "Linux Foundations", description: "Debian and Ubuntu administration, Bash automation, services, monitoring, and dependable system communication." }, { name: "Cloud & DevOps Delivery", description: "Cloud VMs, Docker, Compose, CI/CD, health checks, and repeatable delivery workflows." }, { name: "Networking & Security", description: "TCP/IP, DNS, TLS, VLANs, ACLs, NAT, VPNs, and secure enterprise access control." }, { name: "Data & Service Reliability", description: "PostgreSQL, MySQL, Firebase, telemetry flows, observability, and dependable service data." }, { name: "Development Services", description: "React, Flask, Symfony, APIs, dashboards, and practical full-stack integration work." }, { name: "Hands-on Applied AI", description: "Python, OpenCV, TensorFlow, YOLOv11, and deployable computer-vision services." }] } satisfies PortfolioContent["capabilities"];
const GALYLIO_DEVSECOPS_INTERNSHIP = {
  date: "JUN — AUG 2026",
  role: "DevSecOps Intern",
  company: "Galylio",
  text: "Built secure delivery workflows across development, testing, staging, and deployment environments, combining automated security checks with observability.",
  details: [
    "Designed GitHub Actions and Docker workflows to move changes through development, testing, staging, and deployment environments.",
    "Integrated code-quality, vulnerability, and dynamic security checks with SonarQube, Trivy, and OWASP ZAP to strengthen the delivery pipeline.",
    "Added Prometheus and Grafana monitoring so deployed services and pipeline outcomes could be observed and investigated.",
  ],
  tags: ["DevSecOps", "GitHub Actions", "Docker", "SonarQube", "Trivy", "OWASP ZAP", "Prometheus", "Grafana"],
  now: false,
} satisfies PortfolioContent["experience"][number];
const FREELANCE_CLOUD_DELIVERY_EXPERIENCE = {
  date: "FREELANCE · PROJECT-BASED",
  role: "Freelance Cloud & Kubernetes Engineer",
  company: "Independent Consulting",
  text: "Supported production modernization through Kubernetes upgrades, on-premises-to-Azure cloud migration, cloud-service implementation, and application deployments.",
  details: [
    "Supported Kubernetes production upgrades to strengthen application delivery, runtime consistency, and operational readiness.",
    "Contributed to moving application workloads from on-premises infrastructure toward Microsoft Azure cloud services.",
    "Implemented cloud services and deployment workflows for multiple applications, with attention to reliable releases and environment readiness.",
  ],
  tags: ["Freelance", "Kubernetes", "Microsoft Azure", "Cloud Migration", "Cloud Services", "Application Deployment"],
  now: true,
} satisfies PortfolioContent["experience"][number];
const LEGACY_DEFAULT_EXPERIENCE = [
  { date: "FEB — JUN 2025", role: "Software Engineering & AI Intern", company: "Graines d’Entrepreneurs Tunisie", text: "Built a real-time monitoring platform for an autonomous robot boat, including AI navigation services, YOLOv11 waste detection, Linux deployment, and live telemetry.", details: ["Built a live monitoring workflow that brought autonomous-boat telemetry and operator information into one dashboard.", "Integrated Python navigation services and YOLOv11 waste detection within an embedded Linux environment.", "Containerised services and connected real-time data flows so the system could be observed and maintained."], tags: ["React", "Flask", "Docker", "Firebase", "Python", "Linux"] },
  { date: "JUL — AUG 2024", role: "Full Stack Web Developer Intern", company: "Ministry of Health IT Center (CIMS)", text: "Developed a patient, doctor, and consultation management application with interactive reporting dashboards for hospital administrators.", details: ["Developed patient, doctor, and consultation management workflows for an internal healthcare application.", "Created interactive reporting dashboards that helped hospital administrators review operational information.", "Worked with Symfony 7, Twig, PostgreSQL, Docker, and Linux in a structured full-stack environment."], tags: ["Symfony 7", "Twig", "PostgreSQL", "Docker", "Linux"] },
] satisfies PortfolioContent["experience"];
const LEGACY_EXPERIENCE_SECTION = { eyebrow: "Experience", title: "Two internships,\none infrastructure-ready toolkit.", intro: "From full-stack application development to embedded AI and Linux deployment — a clear path toward cloud and network engineering." } satisfies PortfolioContent["experienceSection"];
const GALYLIO_EXPERIENCE_SECTION = { eyebrow: "Experience", title: "Three internships,\none secure delivery focus.", intro: "From full-stack delivery and embedded AI to DevSecOps pipelines, security checks, and observability — a practical path toward reliable cloud systems." } satisfies PortfolioContent["experienceSection"];
const CLOUD_DELIVERY_EXPERIENCE_SECTION = { eyebrow: "Experience", title: "Four engineering engagements,\nfrom secure delivery to cloud migration.", intro: "From full-stack delivery and embedded AI to DevSecOps pipelines, Kubernetes production upgrades, and Azure cloud migration — a practical path toward reliable delivery." } satisfies PortfolioContent["experienceSection"];
const LEGACY_ABOUT_COPY = { eyebrow: "About", title: "A systems-focused engineer\nconnecting every layer of the stack.", paragraphs: ["I'm a Computer Engineering Master's student at the Faculty of Sciences of Bizerte, specialising in networking and cloud computing. My experience spans Linux systems, secure network infrastructure, databases, and deployable AI services.", "I work across the service lifecycle — from reliable network architecture and cloud-aware automation to monitoring applications and real-time data pipelines.", "I enjoy making infrastructure practical, observable, and secure. My focus is server administration, network supervision, cloud deployment, and database management."] } satisfies Pick<PortfolioContent["about"], "eyebrow" | "title" | "paragraphs">;
const REVISED_ABOUT_COPY = { eyebrow: "About", title: "Building secure, reliable systems\nfrom infrastructure to delivery.", paragraphs: ["I am a Computer Engineering Master’s student at the Faculty of Sciences of Bizerte, focused on cloud, networking, Linux systems, and secure application delivery.", "My work spans the full operational lifecycle: designing dependable network and server foundations, building cloud-aware automation, strengthening CI/CD pipelines with security checks, and making services observable through monitoring and telemetry.", "I combine hands-on experience in DevSecOps, Kubernetes, Azure migration, application deployment, databases, and applied AI services. Whether I am improving a production workflow, connecting real-time data, or securing an infrastructure layer, I focus on solutions that are practical, maintainable, and ready to evolve."] } satisfies Pick<PortfolioContent["about"], "eyebrow" | "title" | "paragraphs">;
const DEVSECOPS_1111_TN_PROJECT = { image: "", type: "DevSecOps · Secure Delivery · Observability", state: "Professional project", title: "1111.tn DevSecOps Delivery", byline: "1111.tn · DevSecOps contribution", summary: "A security-focused delivery workflow for the 1111.tn application, covering environment promotion, automated checks, and operational visibility.", problem: "A production application needs a dependable release path that separates environments, identifies quality and security risks early, and makes deployed services observable.", body: "Contributed to the 1111.tn application’s DevSecOps workflow by supporting delivery across development, testing, staging, and deployment environments with container-based automation and layered security checks.", realization: "Established a more inspectable delivery path with automated code-quality, vulnerability, and dynamic-security checks, alongside metrics and dashboards for service and release visibility.", tech: ["GitHub Actions", "Docker", "SonarQube", "Trivy", "OWASP ZAP", "Prometheus", "Grafana"], delivery: ["Environment promotion", "Security checks", "Operational observability"] } satisfies PortfolioContent["projects"][number];
const FREELANCE_CLOUD_MODERNIZATION_PROJECT = { image: "", type: "Cloud Migration · Kubernetes · Delivery", state: "Freelance engagement", title: "Cloud & Kubernetes Modernization", byline: "Independent Consulting · Freelance", summary: "A production-modernization engagement spanning Kubernetes upgrades, on-premises-to-Azure migration planning, cloud services, and application deployments.", problem: "Application workloads need a controlled path from on-premises infrastructure to cloud services while keeping deployment practices, runtime readiness, and operational responsibilities clear.", body: "Supported Kubernetes production upgrades, contributed to moving workloads from on-premises infrastructure toward Microsoft Azure, and implemented cloud services and deployment workflows for multiple applications.", realization: "Delivered practical modernization support that connected upgraded Kubernetes delivery, Azure-oriented migration steps, cloud-service implementation, and repeatable application deployments.", tech: ["Kubernetes", "Microsoft Azure", "Docker", "Cloud Services", "Application Deployment"], delivery: ["Kubernetes upgrades", "Azure migration", "Production deployments"] } satisfies PortfolioContent["projects"][number];
const LEGACY_DEFAULT_PROJECTS = [
  { image: "/manus-storage/fedi-project-autonomous-boat_69519cd9.jpg", type: "AI · Edge Linux · Real-time Monitoring", state: "Internship project", title: "Autonomous Robot Boat Monitoring", byline: "Graines d’Entrepreneurs Tunisie · 2025", summary: "A live embedded-Linux dashboard for autonomous navigation, telemetry, and waste detection.", problem: "An autonomous robot boat required a reliable way to stream telemetry, support AI navigation decisions, and detect floating waste in real time.", body: "Architected a live monitoring web application, a Python navigation backend, and a YOLOv11 waste-detection pipeline deployed on embedded Linux.", realization: "Delivered an integrated embedded-Linux monitoring stack that brought live telemetry, navigation services, and waste-detection signals into one operator workflow.", tech: ["React", "Flask", "Firebase", "Python", "YOLOv11", "Docker"], delivery: ["Live telemetry", "Embedded Linux", "AI module"] },
  { image: "/manus-storage/fedi-eap-tls-reliable_c4eb57dd.jpg", type: "Network Security · PKI · Linux", state: "Infrastructure project", title: "802.1X / EAP-TLS Authentication", byline: "Enterprise Network Lab · 2025", summary: "A certificate-based access-control lab for password-free enterprise network admission.", problem: "Enterprise access control needs strong identity verification without relying on shared passwords or weak network admission practices.", body: "Built a complete certificate-based 802.1X / EAP-TLS authentication infrastructure across three Linux virtual machines, simulating mutual authentication in an enterprise network.", realization: "Delivered a three-VM lab that validates certificate-based mutual authentication and password-free enterprise network access.", tech: ["Linux", "EAP-TLS", "802.1X", "PKI", "Virtual Machines"], delivery: ["Mutual authentication", "Password-free access"] },
  { image: "/manus-storage/fedi-cicd-reliable_5af806ca.jpg", type: "DevOps · Containers · Automation", state: "Infrastructure project", title: "CI/CD & Docker Orchestration", byline: "Cloud Deployment Lab · 2025", summary: "A repeatable container delivery path from GitHub Actions to a cloud VM.", problem: "Service delivery needs repeatable build, test, and deployment practices with clear health checks and container dependencies.", body: "Automated GitHub Actions workflows for Docker image builds and cloud VM deployment, then managed multi-container environments with Docker Compose.", realization: "Delivered a repeatable build-test-deploy path to a cloud VM, with Compose-managed dependencies, health checks, and persistent volumes.", tech: ["GitHub Actions", "Docker", "Docker Compose", "Cloud VMs"], delivery: ["Build-test-deploy", "Health checks", "Persistent volumes"] },
  { image: "/manus-storage/fedi-secure-network-reliable_5c6d52b4.jpg", type: "Networking · Secure Deployment", state: "Systems project", title: "Secure Network Deployment Infrastructure", byline: "Network Systems Lab · 2025", summary: "A segmented network lab for secure DNS, TLS, routing, and VPN access.", problem: "Production-ready environments need secure connectivity, segmentation, TLS, and dependable routing between services and networks.", body: "Configured DNS zones, HTTPS/TLS certificates, VLANs, NAT, ACLs, static routing, and a Tailscale VPN across a structured multi-node lab environment.", realization: "Delivered a segmented multi-node network lab with secured DNS and TLS, controlled routing, and remote access through a Tailscale VPN.", tech: ["DNS", "TLS", "VLAN", "NAT", "ACL", "Tailscale"], delivery: ["Network segmentation", "Secure VPN", "Inter-VLAN routing"] }
] satisfies PortfolioContent["projects"];
const LEGACY_PROJECTS_SECTION = { eyebrow: "Selected Work", title: "Four systems,\nbuilt to run reliably.", intro: "From real-time AI monitoring to certificate-based access control and automated cloud deployment — each project strengthened a different infrastructure layer.", problemLabel: "Problem", descriptionLabel: "What it is", realizationLabel: "Realization", techLabel: "Tech stack", deliveryLabel: "Delivery" } satisfies PortfolioContent["projectsSection"];
const EXPANDED_PROJECTS_SECTION = { eyebrow: "Selected Work", title: "Six systems,\nbuilt to run reliably.", intro: "From secure DevSecOps delivery and cloud modernization to real-time AI monitoring and network infrastructure — each project strengthened a different operational layer.", problemLabel: "Problem", descriptionLabel: "What it is", realizationLabel: "Realization", techLabel: "Tech stack", deliveryLabel: "Delivery" } satisfies PortfolioContent["projectsSection"];

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: [],
  customSections: [],
  navigation: { home: "Home", experience: "Experience", skills: "Skills", certifications: "Certifications", projects: "Projects", writing: "Writing", about: "About", contact: "Let's talk" },
  hero: {
    hello: "Hello, I'm", firstName: "Fedi", lastName: "NASRI.", role: "Cloud & Network Engineer", location: "Tunis, TN",
    blurb: "Computer Engineering Master's student specialising in cloud infrastructure, networking, Linux systems, and secure deployment. I build reliable systems from network design to deployed services.",
    email: "fedinasri.fsb@gmail.com", phone: "+216 95730139", githubUrl: "https://github.com/Fedi-Nasri", linkedInUrl: "https://www.linkedin.com/in/fedinasri", portraitUrl: "/manus-storage/1759348095958_6c4dcf4b.jpeg",
    focusAreas: ["Cloud", "DevOps", "DevSecOps", "Security & Networking"], focusVisuals: ["", "", "", ""], focusPositions: createDefaultFocusPositions()
  },
  about: {
    ...REVISED_ABOUT_COPY,
    tags: ["#Cloud", "#Networking", "#Linux", "#DevOps", "#Docker", "#Cybersecurity", "#OpenToWork"],
    stats: [{ value: "4", label: "Professional engagements" }, { value: "4", label: "Infrastructure projects" }, { value: "5", label: "Professional certifications" }, { value: "20", label: "Technologies in toolbox" }]
  },
  experienceSection: { ...CLOUD_DELIVERY_EXPERIENCE_SECTION },
  experience: [
    { ...FREELANCE_CLOUD_DELIVERY_EXPERIENCE, details: [...FREELANCE_CLOUD_DELIVERY_EXPERIENCE.details], tags: [...FREELANCE_CLOUD_DELIVERY_EXPERIENCE.tags] },
    { ...GALYLIO_DEVSECOPS_INTERNSHIP, details: [...GALYLIO_DEVSECOPS_INTERNSHIP.details], tags: [...GALYLIO_DEVSECOPS_INTERNSHIP.tags] },
    ...LEGACY_DEFAULT_EXPERIENCE.map((experience) => ({ ...experience, details: [...(experience.details ?? [])], tags: [...experience.tags] }))
  ],
  skillsSection: { eyebrow: "Role Toolbox", title: "A DevOps-ready toolkit\nfor cloud, security, and delivery." },
  skills: ROLE_FOCUSED_TOOLBOX.map((group) => ({ ...group, entries: [...group.entries] })),
  credentialsSection: { eyebrow: "Credentials & Recognition", title: "Certifications that\nsupport the systems I build.", intro: "A focused record across network infrastructure, DevOps practices, cloud delivery, and AI fundamentals." },
  certifications: [
    { name: "CCNA 1", provider: "cisco", issuer: "Cisco Networking Academy", issued: "Jan 2026", scope: "Networking foundations" }, { name: "CCNA 2", provider: "cisco", issuer: "Cisco Networking Academy", issued: "May 2026", scope: "Switching, routing & wireless" },
    { name: "DevOps & Software Engineering", provider: "ibm", issuer: "IBM Professional Certificate", issued: "Mar 2026", scope: "DevOps engineering", pdf: "/manus-storage/coursera-devops-certificate_dba78de4.pdf", preview: "/manus-storage/coursera-devops-certificate-preview_df0e1e24.png" },
    { name: "DevOps, Cloud & Agile", provider: "ibm", issuer: "IBM Specialisation", issued: "Mar 2026", scope: "Cloud delivery practices" }, { name: "Azure AI Fundamentals", provider: "microsoft", issuer: "Microsoft · AZ-900", issued: "Nov 2024", scope: "AI fundamentals" }
  ],
  capabilities: { ...LIFECYCLE_CAPABILITIES, services: LIFECYCLE_CAPABILITIES.services.map((service) => ({ ...service })) },
  projectsSection: { ...EXPANDED_PROJECTS_SECTION },
  projects: [
    { ...DEVSECOPS_1111_TN_PROJECT, tech: [...DEVSECOPS_1111_TN_PROJECT.tech], delivery: [...DEVSECOPS_1111_TN_PROJECT.delivery] },
    { ...FREELANCE_CLOUD_MODERNIZATION_PROJECT, tech: [...FREELANCE_CLOUD_MODERNIZATION_PROJECT.tech], delivery: [...FREELANCE_CLOUD_MODERNIZATION_PROJECT.delivery] },
    ...LEGACY_DEFAULT_PROJECTS.map((project) => ({ ...project, tech: [...project.tech], delivery: [...project.delivery] }))
  ],
  writingSection: { eyebrow: "Writing & Insights", title: "Notes from the systems\nbehind the work.", intro: "A home for future technical articles, build notes, and public links from Medium, LinkedIn, or your own blog." },
  writing: [
    { title: "From Commit to Cloud VM: Notes on a Practical CI/CD Pipeline", date: "Mar 18, 2026", siteName: "Fedi Nasri · Portfolio Notes", category: "DevOps · Sample article", readTime: "5 min read", preview: "A short, practical field note on turning a Docker workflow into a repeatable build-test-deploy pipeline for cloud environments.", body: ["A useful CI/CD pipeline should reduce the distance between a small code change and a dependable deployment. For my infrastructure work, the essential loop was deliberately simple: validate the change, build a Docker image, then deploy a known version to a cloud VM.", "The most valuable discipline is making the service observable after deployment. Health checks, clear environment configuration, persistent volumes, and an explicit dependency order turn a collection of containers into an environment that can be understood and maintained.", "The goal is not automation for its own sake. It is creating a release path that is repeatable, easy to inspect, and safe enough to use again when the next change arrives."], status: "Open sample" },
    { title: "Your next Cloud, Linux, or Networking article", date: "Future article", siteName: "Your publication", category: "Future article slot", readTime: "Add a Medium or blog URL", preview: "Use this card for a real article, technical note, case-study recap, or link to a publication on Medium, LinkedIn, or your own blog.", body: [], status: "Link ready" }
  ],
  contact: { eyebrow: "Let's Talk", title: "Have an infrastructure challenge?\nLet's solve it.", intro: "Open to internship, graduate, and engineering opportunities in cloud infrastructure, networking, Linux systems, and secure deployment.", location: "Tunis, Tunisia · open to remote", submitLabel: "Send message" },
  footer: "© 2026 Fedi Nasri · Crafted with care in Tunis"
};

export function hydrateExperienceDetails(content: PortfolioContent): PortfolioContent {
  const shouldReplaceLegacyToolbox = content.skills.length === LEGACY_TOOLBOX_HEADINGS.length
    && content.skills.every((skill, index) => skill.heading === LEGACY_TOOLBOX_HEADINGS[index]);
  const hasExactLifecycleServices = content.capabilities.services.length === LIFECYCLE_CAPABILITIES.services.length
    && content.capabilities.services.every((service, index) => service.name === LIFECYCLE_CAPABILITIES.services[index]?.name && service.description === LIFECYCLE_CAPABILITIES.services[index]?.description);
  const shouldReplaceLegacyCapabilities = content.capabilities.eyebrow === LEGACY_CAPABILITIES.eyebrow
    && content.capabilities.title === LEGACY_CAPABILITIES.title
    && content.capabilities.description === LEGACY_CAPABILITIES.description
    && content.capabilities.services.length === LEGACY_CAPABILITIES.services.length
    && content.capabilities.services.every((service, index) => service.name === LEGACY_CAPABILITIES.services[index]?.name && service.description === LEGACY_CAPABILITIES.services[index]?.description);
  const shouldReplacePriorLifecycleCapabilities = content.capabilities.eyebrow === LIFECYCLE_CAPABILITIES.eyebrow
    && content.capabilities.title === PRIOR_LIFECYCLE_CAPABILITY_TITLE
    && content.capabilities.description === LIFECYCLE_CAPABILITIES.description
    && hasExactLifecycleServices;
  const matchesExperience = (experience: PortfolioContent["experience"][number], expected: PortfolioContent["experience"][number]) => experience.date === expected.date
    && experience.role === expected.role
    && experience.company === expected.company
    && experience.text === expected.text
    && JSON.stringify(experience.details ?? []) === JSON.stringify(expected.details ?? [])
    && JSON.stringify(experience.tags) === JSON.stringify(expected.tags)
    && (!expected.now || experience.now === true);
  const hasExactLegacyExperience = content.experience.length === LEGACY_DEFAULT_EXPERIENCE.length
    && content.experience.every((experience, index) => matchesExperience(experience, LEGACY_DEFAULT_EXPERIENCE[index]!));
  const hasExactGalylioExperience = content.experience.length === LEGACY_DEFAULT_EXPERIENCE.length + 1
    && matchesExperience(content.experience[0]!, GALYLIO_DEVSECOPS_INTERNSHIP)
    && content.experience.slice(1).every((experience, index) => matchesExperience(experience, LEGACY_DEFAULT_EXPERIENCE[index]!));
  const hasExactFreelanceExperience = content.experience.length === LEGACY_DEFAULT_EXPERIENCE.length + 2
    && matchesExperience(content.experience[0]!, GALYLIO_DEVSECOPS_INTERNSHIP)
    && matchesExperience(content.experience[1]!, FREELANCE_CLOUD_DELIVERY_EXPERIENCE)
    && content.experience.slice(2).every((experience, index) => matchesExperience(experience, LEGACY_DEFAULT_EXPERIENCE[index]!));
  const hasCurrentFreelanceExperienceOrder = content.experience.length === LEGACY_DEFAULT_EXPERIENCE.length + 2
    && matchesExperience(content.experience[0]!, FREELANCE_CLOUD_DELIVERY_EXPERIENCE)
    && matchesExperience(content.experience[1]!, GALYLIO_DEVSECOPS_INTERNSHIP)
    && content.experience.slice(2).every((experience, index) => matchesExperience(experience, LEGACY_DEFAULT_EXPERIENCE[index]!));
  const shouldAddFreelanceExperience = hasExactLegacyExperience || hasExactGalylioExperience;
  const shouldUpgradeExperienceSection = (hasExactLegacyExperience
    && content.experienceSection.eyebrow === LEGACY_EXPERIENCE_SECTION.eyebrow
    && content.experienceSection.title === LEGACY_EXPERIENCE_SECTION.title
    && content.experienceSection.intro === LEGACY_EXPERIENCE_SECTION.intro)
    || (hasExactGalylioExperience
      && content.experienceSection.eyebrow === GALYLIO_EXPERIENCE_SECTION.eyebrow
      && content.experienceSection.title === GALYLIO_EXPERIENCE_SECTION.title
      && content.experienceSection.intro === GALYLIO_EXPERIENCE_SECTION.intro);
  const isLegacyInternshipStat = (stat: PortfolioContent["about"]["stats"][number]) => {
    const value = String(stat.value).trim();
    return (value === "2" || value === "3") && stat.label.trim().toLowerCase() === "internships completed";
  };
  const shouldUpgradeEngagementStat = (shouldAddFreelanceExperience || hasExactFreelanceExperience || hasCurrentFreelanceExperienceOrder)
    && content.about.stats.some(isLegacyInternshipStat);
  const shouldUpgradeAboutCopy = content.about.eyebrow === LEGACY_ABOUT_COPY.eyebrow
    && content.about.title === LEGACY_ABOUT_COPY.title
    && JSON.stringify(content.about.paragraphs) === JSON.stringify(LEGACY_ABOUT_COPY.paragraphs);
  const normalizedAboutStats = content.about.stats.map((stat) => stat.label.trim().toLowerCase() === "languages spoken"
    ? { value: "20", label: "Technologies in toolbox" }
    : shouldUpgradeEngagementStat && isLegacyInternshipStat(stat)
      ? { value: "4", label: "Professional engagements" }
      : stat);
  const matchesExperienceContent = (experience: PortfolioContent["experience"][number], expected: PortfolioContent["experience"][number]) => experience.date === expected.date
    && experience.role === expected.role
    && experience.company === expected.company
    && experience.text === expected.text
    && JSON.stringify(experience.details ?? []) === JSON.stringify(expected.details ?? [])
    && JSON.stringify(experience.tags) === JSON.stringify(expected.tags);
  const hasPriorFreelanceExperienceOrder = content.experience.length === LEGACY_DEFAULT_EXPERIENCE.length + 2
    && matchesExperienceContent(content.experience[0]!, GALYLIO_DEVSECOPS_INTERNSHIP)
    && matchesExperienceContent(content.experience[1]!, FREELANCE_CLOUD_DELIVERY_EXPERIENCE)
    && content.experience.slice(2).every((experience, index) => matchesExperienceContent(experience, LEGACY_DEFAULT_EXPERIENCE[index]!));
  const matchesProject = (project: PortfolioContent["projects"][number], expected: PortfolioContent["projects"][number]) => project.image === expected.image
    && project.type === expected.type
    && project.state === expected.state
    && project.title === expected.title
    && project.byline === expected.byline
    && (project.summary === undefined || project.summary === expected.summary)
    && project.problem === expected.problem
    && project.body === expected.body
    && project.realization === expected.realization
    && JSON.stringify(project.tech) === JSON.stringify(expected.tech)
    && JSON.stringify(project.delivery) === JSON.stringify(expected.delivery)
    && !project.githubUrl
    && !project.liveUrl
    && !project.imageFocus
    && !project.imageZoom
    && !project.imageAspectRatio
    && !project.imageFrameHeight
    && !project.caseStudyBlocks;
  const shouldAddSelectedWorkProjects = content.projects.length === LEGACY_DEFAULT_PROJECTS.length
    && content.projects.every((project, index) => matchesProject(project, LEGACY_DEFAULT_PROJECTS[index]!));
  const shouldUpgradeProjectsSection = shouldAddSelectedWorkProjects
    && content.projectsSection.eyebrow === LEGACY_PROJECTS_SECTION.eyebrow
    && content.projectsSection.title === LEGACY_PROJECTS_SECTION.title
    && content.projectsSection.intro === LEGACY_PROJECTS_SECTION.intro
    && content.projectsSection.problemLabel === LEGACY_PROJECTS_SECTION.problemLabel
    && content.projectsSection.descriptionLabel === LEGACY_PROJECTS_SECTION.descriptionLabel
    && content.projectsSection.realizationLabel === LEGACY_PROJECTS_SECTION.realizationLabel
    && content.projectsSection.techLabel === LEGACY_PROJECTS_SECTION.techLabel
    && content.projectsSection.deliveryLabel === LEGACY_PROJECTS_SECTION.deliveryLabel;

  return {
    ...content,
    about: shouldUpgradeAboutCopy
      ? { ...content.about, ...REVISED_ABOUT_COPY, paragraphs: [...REVISED_ABOUT_COPY.paragraphs], stats: normalizedAboutStats }
      : { ...content.about, stats: normalizedAboutStats },
    experienceSection: shouldUpgradeExperienceSection
      ? { ...CLOUD_DELIVERY_EXPERIENCE_SECTION }
      : { ...content.experienceSection },
    projectsSection: shouldUpgradeProjectsSection
      ? { ...EXPANDED_PROJECTS_SECTION }
      : { ...content.projectsSection },
    experience: (hasPriorFreelanceExperienceOrder
      ? [
        { ...content.experience[1]!, now: true },
        { ...content.experience[0]!, now: false },
        ...content.experience.slice(2).map((experience) => ({ ...experience, now: false })),
      ]
      : shouldAddFreelanceExperience
      ? [
        { ...FREELANCE_CLOUD_DELIVERY_EXPERIENCE, details: [...FREELANCE_CLOUD_DELIVERY_EXPERIENCE.details], tags: [...FREELANCE_CLOUD_DELIVERY_EXPERIENCE.tags], now: true },
        hasExactLegacyExperience ? { ...GALYLIO_DEVSECOPS_INTERNSHIP, details: [...GALYLIO_DEVSECOPS_INTERNSHIP.details], tags: [...GALYLIO_DEVSECOPS_INTERNSHIP.tags], now: false } : { ...content.experience[0]!, now: false },
        ...(hasExactLegacyExperience ? content.experience : content.experience.slice(1)).map((experience) => ({ ...experience, now: false })),
      ]
      : content.experience).map((experience) => {
      const matchingDefault = DEFAULT_PORTFOLIO_CONTENT.experience.find((candidate) => candidate.role === experience.role && candidate.company === experience.company);
      return { ...experience, details: [...(experience.details ?? matchingDefault?.details ?? [])] };
    }),
    projects: (shouldAddSelectedWorkProjects
      ? [
        { ...DEVSECOPS_1111_TN_PROJECT, tech: [...DEVSECOPS_1111_TN_PROJECT.tech], delivery: [...DEVSECOPS_1111_TN_PROJECT.delivery] },
        { ...FREELANCE_CLOUD_MODERNIZATION_PROJECT, tech: [...FREELANCE_CLOUD_MODERNIZATION_PROJECT.tech], delivery: [...FREELANCE_CLOUD_MODERNIZATION_PROJECT.delivery] },
        ...content.projects.map((project) => ({ ...project, tech: [...project.tech], delivery: [...project.delivery] })),
      ]
      : content.projects).map((project) => ({ ...project, summary: project.summary ?? project.body.split(/(?<=[.!?])\s/)[0] ?? project.body })),
    capabilities: shouldReplaceLegacyCapabilities || shouldReplacePriorLifecycleCapabilities ? { ...LIFECYCLE_CAPABILITIES, services: LIFECYCLE_CAPABILITIES.services.map((service) => ({ ...service })) } : { ...content.capabilities, services: content.capabilities.services.map((service) => ({ ...service })) },
    skills: shouldReplaceLegacyToolbox
      ? ROLE_FOCUSED_TOOLBOX.map((group) => ({ ...group, entries: [...group.entries] }))
      : content.skills.map((skill) => ({ ...skill, role: skill.role ?? "Custom engineering focus" })),
  };
}
