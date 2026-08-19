export type FocusPosition = { x: number; y: number };
export type CanvasComponentType = "title" | "text";
export type CustomSectionCanvasComponent = { id: string; type: CanvasComponentType; content: string; x: number; y: number; width: number; height: number };
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
  navigation: { home: string; experience: string; skills: string; certifications: string; projects: string; writing: string; about: string; contact: string };
  hero: { hello: string; firstName: string; lastName: string; role: string; location: string; blurb: string; email: string; phone: string; githubUrl: string; linkedInUrl: string; portraitUrl: string; focusAreas: string[]; focusVisuals?: string[]; focusPositions?: FocusPosition[] };
  about: { eyebrow: string; title: string; paragraphs: string[]; tags: string[]; stats: { value: string; label: string }[] };
  experienceSection: { eyebrow: string; title: string; intro: string };
  experience: { date: string; role: string; company: string; companyLogo?: string; text: string; tags: string[]; details?: string[]; now?: boolean }[];
  skillsSection: { eyebrow: string; title: string };
  skills: { heading: string; entries: string[] }[];
  credentialsSection: { eyebrow: string; title: string; intro: string };
  certifications: { name: string; provider: "aws" | "azure" | "cisco" | "cloudflare" | "comptia" | "coursera" | "custom" | "docker" | "fortinet" | "github" | "gitlab" | "google-cloud" | "hashicorp" | "ibm" | "isc2" | "jenkins" | "kodekloud" | "kubernetes" | "linux-foundation" | "microsoft" | "oracle" | "redhat" | "terraform"; providerLabel?: string; providerLogo?: string; issuer: string; issued: string; scope: string; pdf?: string; preview?: string; url?: string }[];
  capabilities: { eyebrow: string; title: string; description: string; services: { name: string; description: string }[] };
  projectsSection: { eyebrow: string; title: string; intro: string; problemLabel: string; descriptionLabel: string; realizationLabel: string; techLabel: string; deliveryLabel: string };
  projects: { image: string; type: string; state: string; title: string; byline: string; problem: string; body: string; realization: string; tech: string[]; delivery: string[]; caseStudyBlocks?: ("problem" | "body" | "realization")[] }[];
  writingSection: { eyebrow: string; title: string; intro: string };
  writing: { title: string; date: string; siteName?: string; category: string; readTime: string; preview: string; body: string[]; status: string; url?: string }[];
  contact: { eyebrow: string; title: string; intro: string; location: string; submitLabel: string };
  footer: string;
};

export const PORTFOLIO_SECTION_IDS = ["home", "about", "experience", "skills", "certifications", "capabilities", "projects", "writing", "contact"] as const;
export type PortfolioSectionId = (typeof PORTFOLIO_SECTION_IDS)[number];
export const DEFAULT_SECTION_ORDER: PortfolioSectionId[] = ["home", "about", "experience", "skills", "certifications", "capabilities", "projects", "writing", "contact"];

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
    eyebrow: "About", title: "A systems-focused engineer\nconnecting every layer of the stack.",
    paragraphs: ["I'm a Computer Engineering Master's student at the Faculty of Sciences of Bizerte, specialising in networking and cloud computing. My experience spans Linux systems, secure network infrastructure, databases, and deployable AI services.", "I work across the service lifecycle — from reliable network architecture and cloud-aware automation to monitoring applications and real-time data pipelines.", "I enjoy making infrastructure practical, observable, and secure. My focus is server administration, network supervision, cloud deployment, and database management."],
    tags: ["#Cloud", "#Networking", "#Linux", "#DevOps", "#Docker", "#Cybersecurity", "#OpenToWork"],
    stats: [{ value: "02", label: "Internships completed" }, { value: "04", label: "Infrastructure projects" }, { value: "05", label: "Professional certifications" }, { value: "03", label: "Languages spoken" }]
  },
  experienceSection: { eyebrow: "Experience", title: "Two internships,\none infrastructure-ready toolkit.", intro: "From full-stack application development to embedded AI and Linux deployment — a clear path toward cloud and network engineering." },
  experience: [
    { date: "FEB — JUN 2025", role: "Software Engineering & AI Intern", company: "Graines d’Entrepreneurs Tunisie", text: "Built a real-time monitoring platform for an autonomous robot boat, including AI navigation services, YOLOv11 waste detection, Linux deployment, and live telemetry.", details: ["Built a live monitoring workflow that brought autonomous-boat telemetry and operator information into one dashboard.", "Integrated Python navigation services and YOLOv11 waste detection within an embedded Linux environment.", "Containerised services and connected real-time data flows so the system could be observed and maintained."], tags: ["React", "Flask", "Docker", "Firebase", "Python", "Linux"], now: true },
    { date: "JUL — AUG 2024", role: "Full Stack Web Developer Intern", company: "Ministry of Health IT Center (CIMS)", text: "Developed a patient, doctor, and consultation management application with interactive reporting dashboards for hospital administrators.", details: ["Developed patient, doctor, and consultation management workflows for an internal healthcare application.", "Created interactive reporting dashboards that helped hospital administrators review operational information.", "Worked with Symfony 7, Twig, PostgreSQL, Docker, and Linux in a structured full-stack environment."], tags: ["Symfony 7", "Twig", "PostgreSQL", "Docker", "Linux"] }
  ],
  skillsSection: { eyebrow: "Toolbox", title: "Skills, sorted by the systems\nthey help keep running." },
  skills: [
    { heading: "Systems & OS", entries: ["Linux", "Debian", "Ubuntu", "Bash Scripting", "Git", "GitHub"] }, { heading: "Containers & CI/CD", entries: ["Docker", "Docker Compose", "GitHub Actions", "Health Checks", "Cloud VMs"] },
    { heading: "Networking", entries: ["TCP/IP", "DNS", "HTTPS/TLS", "VLANs", "NAT", "VPN", "Tailscale"] }, { heading: "Cloud & Data", entries: ["Firebase", "Microsoft Azure", "AWS", "PostgreSQL", "MySQL", "MongoDB", "Firestore"] },
    { heading: "Programming", entries: ["Python", "Bash", "JavaScript", "Node.js", "Java", "PHP", "C"] }, { heading: "Frameworks & AI", entries: ["React", "Flask", "Symfony 7", "OpenCV", "TensorFlow", "YOLOv11"] }
  ],
  credentialsSection: { eyebrow: "Credentials & Recognition", title: "Certifications that\nsupport the systems I build.", intro: "A focused record across network infrastructure, DevOps practices, cloud delivery, and AI fundamentals." },
  certifications: [
    { name: "CCNA 1", provider: "cisco", issuer: "Cisco Networking Academy", issued: "Jan 2026", scope: "Networking foundations" }, { name: "CCNA 2", provider: "cisco", issuer: "Cisco Networking Academy", issued: "May 2026", scope: "Switching, routing & wireless" },
    { name: "DevOps & Software Engineering", provider: "ibm", issuer: "IBM Professional Certificate", issued: "Mar 2026", scope: "DevOps engineering", pdf: "/manus-storage/coursera-devops-certificate_dba78de4.pdf", preview: "/manus-storage/coursera-devops-certificate-preview_df0e1e24.png" },
    { name: "DevOps, Cloud & Agile", provider: "ibm", issuer: "IBM Specialisation", issued: "Mar 2026", scope: "Cloud delivery practices" }, { name: "Azure AI Fundamentals", provider: "microsoft", issuer: "Microsoft · AZ-900", issued: "Nov 2024", scope: "AI fundamentals" }
  ],
  capabilities: { eyebrow: "Cloud & Infrastructure", title: "One engineer,\nevery critical layer.", description: "Secure networks, Linux systems, containers, cloud services, real-time monitoring, and data infrastructure — designed to work together.", services: [{ name: "Linux Systems", description: "Debian and Ubuntu administration, Bash scripting, monitoring, and inter-service communication." }, { name: "Cloud & DevOps", description: "Docker, Compose, CI/CD, cloud VMs, service dependencies, and health checks." }, { name: "Network Security", description: "TCP/IP, DNS, TLS, VLANs, ACLs, NAT, VPNs, and enterprise access control." }, { name: "Databases", description: "PostgreSQL, MySQL, MongoDB, Firebase Firestore, and live telemetry data." }, { name: "Full-Stack", description: "React, Flask, Symfony, API services, dashboards, and dependable data flows." }, { name: "Applied AI", description: "Python, OpenCV, TensorFlow, YOLOv11, and deployable computer-vision pipelines." }] },
  projectsSection: { eyebrow: "Selected Work", title: "Four systems,\nbuilt to run reliably.", intro: "From real-time AI monitoring to certificate-based access control and automated cloud deployment — each project strengthened a different infrastructure layer.", problemLabel: "Problem", descriptionLabel: "What it is", realizationLabel: "Realization", techLabel: "Tech stack", deliveryLabel: "Delivery" },
  projects: [
    { image: "/manus-storage/fedi-project-autonomous-boat_69519cd9.jpg", type: "AI · Edge Linux · Real-time Monitoring", state: "Internship project", title: "Autonomous Robot Boat Monitoring", byline: "Graines d’Entrepreneurs Tunisie · 2025", problem: "An autonomous robot boat required a reliable way to stream telemetry, support AI navigation decisions, and detect floating waste in real time.", body: "Architected a live monitoring web application, a Python navigation backend, and a YOLOv11 waste-detection pipeline deployed on embedded Linux.", realization: "Delivered an integrated embedded-Linux monitoring stack that brought live telemetry, navigation services, and waste-detection signals into one operator workflow.", tech: ["React", "Flask", "Firebase", "Python", "YOLOv11", "Docker"], delivery: ["Live telemetry", "Embedded Linux", "AI module"] },
    { image: "/manus-storage/fedi-eap-tls-reliable_c4eb57dd.jpg", type: "Network Security · PKI · Linux", state: "Infrastructure project", title: "802.1X / EAP-TLS Authentication", byline: "Enterprise Network Lab · 2025", problem: "Enterprise access control needs strong identity verification without relying on shared passwords or weak network admission practices.", body: "Built a complete certificate-based 802.1X / EAP-TLS authentication infrastructure across three Linux virtual machines, simulating mutual authentication in an enterprise network.", realization: "Delivered a three-VM lab that validates certificate-based mutual authentication and password-free enterprise network access.", tech: ["Linux", "EAP-TLS", "802.1X", "PKI", "Virtual Machines"], delivery: ["Mutual authentication", "Password-free access"] },
    { image: "/manus-storage/fedi-cicd-reliable_5af806ca.jpg", type: "DevOps · Containers · Automation", state: "Infrastructure project", title: "CI/CD & Docker Orchestration", byline: "Cloud Deployment Lab · 2025", problem: "Service delivery needs repeatable build, test, and deployment practices with clear health checks and container dependencies.", body: "Automated GitHub Actions workflows for Docker image builds and cloud VM deployment, then managed multi-container environments with Docker Compose.", realization: "Delivered a repeatable build-test-deploy path to a cloud VM, with Compose-managed dependencies, health checks, and persistent volumes.", tech: ["GitHub Actions", "Docker", "Docker Compose", "Cloud VMs"], delivery: ["Build-test-deploy", "Health checks", "Persistent volumes"] },
    { image: "/manus-storage/fedi-secure-network-reliable_5c6d52b4.jpg", type: "Networking · Secure Deployment", state: "Systems project", title: "Secure Network Deployment Infrastructure", byline: "Network Systems Lab · 2025", problem: "Production-ready environments need secure connectivity, segmentation, TLS, and dependable routing between services and networks.", body: "Configured DNS zones, HTTPS/TLS certificates, VLANs, NAT, ACLs, static routing, and a Tailscale VPN across a structured multi-node lab environment.", realization: "Delivered a segmented multi-node network lab with secured DNS and TLS, controlled routing, and remote access through a Tailscale VPN.", tech: ["DNS", "TLS", "VLAN", "NAT", "ACL", "Tailscale"], delivery: ["Network segmentation", "Secure VPN", "Inter-VLAN routing"] }
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
  return {
    ...content,
    experience: content.experience.map((experience) => {
      const matchingDefault = DEFAULT_PORTFOLIO_CONTENT.experience.find((candidate) => candidate.role === experience.role && candidate.company === experience.company);
      return { ...experience, details: [...(experience.details ?? matchingDefault?.details ?? [])] };
    }),
  };
}
