/**
 * Design reminder — Reference Fidelity: light white canvas, dark navy typography,
 * royal-blue accents, portrait-led hero, soft raised cards, and technical connectors.
 */
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Smartphone,
  Sparkles,
  Sun,
  X,
} from "lucide-react";

const email = "fedinasri.fsb@gmail.com";
const phone = "+216 95730139";
const githubUrl = "https://github.com/Fedi-Nasri";
const linkedInUrl = "https://www.linkedin.com/in/fedinasri";

const experience = [
  { date: "FEB — JUN 2025", role: "Software Engineering & AI Intern", company: "Graines d’Entrepreneurs Tunisie", text: "Built a real-time monitoring platform for an autonomous robot boat, including AI navigation services, YOLOv11 waste detection, Linux deployment, and live telemetry.", tags: ["React", "Flask", "Docker", "Firebase", "Python", "Linux"], now: true },
  { date: "JUL — AUG 2024", role: "Full Stack Web Developer Intern", company: "Ministry of Health IT Center (CIMS)", text: "Developed a patient, doctor, and consultation management application with interactive reporting dashboards for hospital administrators.", tags: ["Symfony 7", "Twig", "PostgreSQL", "Docker", "Linux"] },
];

const skills = [
  ["Systems & OS", ["Linux", "Debian", "Ubuntu", "Bash Scripting", "Git", "GitHub"]],
  ["Containers & CI/CD", ["Docker", "Docker Compose", "GitHub Actions", "Health Checks", "Cloud VMs"]],
  ["Networking", ["TCP/IP", "DNS", "HTTPS/TLS", "VLANs", "NAT", "VPN", "Tailscale"]],
  ["Cloud & Data", ["Firebase", "Microsoft Azure", "AWS", "PostgreSQL", "MySQL", "MongoDB", "Firestore"]],
  ["Programming", ["Python", "Bash", "JavaScript", "Node.js", "Java", "PHP", "C"]],
  ["Frameworks & AI", ["React", "Flask", "Symfony 7", "OpenCV", "TensorFlow", "YOLOv11"]],
] as const;

const projects = [
  { image: "/manus-storage/fedi-project-autonomous-boat_69519cd9.jpg", type: "AI · Edge Linux · Real-time Monitoring", state: "Internship project", title: "Autonomous Robot Boat Monitoring", byline: "Graines d’Entrepreneurs Tunisie · 2025", problem: "An autonomous robot boat required a reliable way to stream telemetry, support AI navigation decisions, and detect floating waste in real time.", body: "Architected a live monitoring web application, a Python navigation backend, and a YOLOv11 waste-detection pipeline deployed on embedded Linux.", tech: ["React", "Flask", "Firebase", "Python", "YOLOv11", "Docker"], delivery: ["Live telemetry", "Embedded Linux", "AI module"] },
  { image: "/manus-storage/fedi-eap-tls-reliable_c4eb57dd.jpg", type: "Network Security · PKI · Linux", state: "Infrastructure project", title: "802.1X / EAP-TLS Authentication", byline: "Enterprise Network Lab · 2025", problem: "Enterprise access control needs strong identity verification without relying on shared passwords or weak network admission practices.", body: "Built a complete certificate-based 802.1X / EAP-TLS authentication infrastructure across three Linux virtual machines, simulating mutual authentication in an enterprise network.", tech: ["Linux", "EAP-TLS", "802.1X", "PKI", "Virtual Machines"], delivery: ["Mutual authentication", "Password-free access"] },
  { image: "/manus-storage/fedi-cicd-reliable_5af806ca.jpg", type: "DevOps · Containers · Automation", state: "Infrastructure project", title: "CI/CD & Docker Orchestration", byline: "Cloud Deployment Lab · 2025", problem: "Service delivery needs repeatable build, test, and deployment practices with clear health checks and container dependencies.", body: "Automated GitHub Actions workflows for Docker image builds and cloud VM deployment, then managed multi-container environments with Docker Compose.", tech: ["GitHub Actions", "Docker", "Docker Compose", "Cloud VMs"], delivery: ["Build-test-deploy", "Health checks", "Persistent volumes"] },
  { image: "/manus-storage/fedi-secure-network-reliable_5c6d52b4.jpg", type: "Networking · Secure Deployment", state: "Systems project", title: "Secure Network Deployment Infrastructure", byline: "Network Systems Lab · 2025", problem: "Production-ready environments need secure connectivity, segmentation, TLS, and dependable routing between services and networks.", body: "Configured DNS zones, HTTPS/TLS certificates, VLANs, NAT, ACLs, static routing, and a Tailscale VPN across a structured multi-node lab environment.", tech: ["DNS", "TLS", "VLAN", "NAT", "ACL", "Tailscale"], delivery: ["Network segmentation", "Secure VPN", "Inter-VLAN routing"] },
];

const services = [
  ["Linux Systems", "Debian and Ubuntu administration, Bash scripting, monitoring, and inter-service communication."],
  ["Cloud & DevOps", "Docker, Compose, CI/CD, cloud VMs, service dependencies, and health checks."],
  ["Network Security", "TCP/IP, DNS, TLS, VLANs, ACLs, NAT, VPNs, and enterprise access control."],
  ["Databases", "PostgreSQL, MySQL, MongoDB, Firebase Firestore, and live telemetry data."],
  ["Full-Stack", "React, Flask, Symfony, API services, dashboards, and dependable data flows."],
  ["Applied AI", "Python, OpenCV, TensorFlow, YOLOv11, and deployable computer-vision pipelines."],
];

type Certification = {
  name: string;
  provider: "cisco" | "ibm" | "microsoft";
  issuer: string;
  issued: string;
  scope: string;
  pdf?: string;
  preview?: string;
};

const certifications: readonly Certification[] = [
  { name: "CCNA 1", provider: "cisco", issuer: "Cisco Networking Academy", issued: "Jan 2026", scope: "Networking foundations" },
  { name: "CCNA 2", provider: "cisco", issuer: "Cisco Networking Academy", issued: "May 2026", scope: "Switching, routing & wireless" },
  { name: "DevOps & Software Engineering", provider: "ibm", issuer: "IBM Professional Certificate", issued: "Mar 2026", scope: "DevOps engineering", pdf: "/manus-storage/coursera-devops-certificate_dba78de4.pdf", preview: "/manus-storage/coursera-devops-certificate-preview_df0e1e24.png" },
  { name: "DevOps, Cloud & Agile", provider: "ibm", issuer: "IBM Specialisation", issued: "Mar 2026", scope: "Cloud delivery practices" },
  { name: "Azure AI Fundamentals", provider: "microsoft", issuer: "Microsoft · AZ-900", issued: "Nov 2024", scope: "AI fundamentals" },
] as const;

function ProviderMark({ provider }: { provider: Certification["provider"] }) {
  if (provider === "microsoft") return <div className="cert-provider-mark microsoft-mark" aria-label="Microsoft"><i /><i /><i /><i /></div>;
  return <div className={`cert-provider-mark ${provider}-mark`} aria-label={provider === "cisco" ? "Cisco" : "IBM"}><span>{provider === "cisco" ? "CISCO" : "IBM"}</span></div>;
}

function TagList({ items }: { items: readonly string[] }) {
  return <div className="ref-tags">{items.map((tag) => <span key={tag}>{tag}</span>)}</div>;
}

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return <div className="ref-section-title"><span>{eyebrow}</span><h2>{children}</h2></div>;
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [dimMode, setDimMode] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Certification | null>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1900);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get("subject") || "Portfolio enquiry");
    const sender = String(data.get("name") || "");
    const senderEmail = String(data.get("senderEmail") || "");
    const message = String(data.get("message") || "");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${sender}\nEmail: ${senderEmail}\n\n${message}`)}`;
  };

  const closeNav = () => setMobileNav(false);

  return (
    <div className={`reference-portfolio${dimMode ? " dim-mode" : ""}`}>
      <header className="ref-header">
        <a href="#home" className="ref-brand" aria-label="Fedi Nasri home"><span className="brand-name">fedi</span><span className="brand-node" /></a>
        <nav className="ref-nav" aria-label="Primary navigation">
          <a href="#home">Home</a><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#certifications">Certifications</a><a href="#projects">Projects</a><a href="#about">About</a>
        </nav>
        <div className="ref-header-actions">
          <button className="tone-toggle" aria-label="Toggle visual tone" onClick={() => setDimMode((value) => !value)}>{dimMode ? <Sun size={15} /> : <Moon size={15} />}</button>
          <a href="#contact" className="talk-button">Let&apos;s talk <ArrowRight size={15} /></a>
          <button className="ref-menu" type="button" aria-label="Toggle navigation" aria-expanded={mobileNav} onClick={() => setMobileNav((value) => !value)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      {mobileNav && <nav className="ref-mobile-nav" aria-label="Mobile navigation"><a onClick={closeNav} href="#home">Home</a><a onClick={closeNav} href="#experience">Experience</a><a onClick={closeNav} href="#skills">Skills</a><a onClick={closeNav} href="#certifications">Certifications</a><a onClick={closeNav} href="#projects">Projects</a><a onClick={closeNav} href="#about">About</a><a onClick={closeNav} className="ref-mobile-talk" href="#contact">Let&apos;s talk <ArrowRight size={15} /></a></nav>}

      <main>
        <section id="home" className="reference-hero">
          <div className="hero-copy-ref">
            <p className="hello-line"><Sparkles size={13} /> Hello, I&apos;m</p>
            <h1>Fedi<br /><strong>NASRI.</strong></h1>
            <div className="hero-caption"><span>Cloud &amp; Network Engineer</span><i /><small>Tunis, TN</small></div>
            <p className="hero-blurb">Computer Engineering Master&apos;s student specialising in cloud infrastructure, networking, Linux systems, and secure deployment. I build reliable systems from network design to deployed services.</p>
            <button type="button" className="copy-row" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={15} />} <span>{copied ? "Copied to clipboard" : email}</span></button>
            <div className="hero-social-row">
              <a href={`mailto:${email}`} aria-label="Send email"><Mail size={17} /></a>
              <a href={linkedInUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
              <a href={`tel:${phone.replaceAll(" ", "")}`} aria-label="Call"><Phone size={17} /></a>
            </div>
          </div>

          <div className="portrait-zone" aria-label="Portrait of Fedi Nasri">
            <span className="connector c-one" /><span className="connector c-two" /><span className="connector c-three" />
            <span className="node n-one" /><span className="node n-two" /><span className="node n-three" />
            <div className="portrait-glow" />
            <img src="/manus-storage/1759348095958_6c4dcf4b.jpeg" alt="Fedi Nasri" />
          </div>

          <div className="hero-role-stack" aria-label="Professional focus areas">
            <div className="role-card cloud-card"><div className="role-art cloud-art"><i /><span /><span /><span /></div><b>Cloud</b></div>
            <div className="role-card browser-card"><div className="role-art infinity-art"><svg className="devops-logo" viewBox="0 0 240 120" aria-hidden="true"><defs><linearGradient id="devopsBlueInfinity" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e74ff" /><stop offset="48%" stopColor="#4b8cff" /><stop offset="100%" stopColor="#1f5ce8" /></linearGradient></defs><path d="M29 60 C55 22 89 22 120 60 C151 98 185 98 211 60 C185 22 151 22 120 60 C89 98 55 98 29 60" fill="none" stroke="url(#devopsBlueInfinity)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" /></svg></div><b>DevOps</b></div>
            <div className="role-card design-card"><div className="role-art devsecops-art"><svg className="devsecops-shield" viewBox="0 0 160 120" aria-hidden="true"><defs><linearGradient id="devsecopsBorder" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#68a7ff" /><stop offset="55%" stopColor="#2563eb" /><stop offset="100%" stopColor="#173fba" /></linearGradient><linearGradient id="devsecopsLoopLeft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8cc6ff" /><stop offset="100%" stopColor="#2563eb" /></linearGradient><linearGradient id="devsecopsLoopRight" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#173fba" /><stop offset="100%" stopColor="#6faaff" /></linearGradient></defs><path d="M80 10 C108 10 130 18 130 18 C130 64 111 94 80 110 C49 94 30 64 30 18 C30 18 52 10 80 10 Z" fill="#edf4ff" stroke="url(#devsecopsBorder)" strokeWidth="4" /><path d="M80 18 C102 18 122 25 122 25 C122 61 107 86 80 101 C53 86 38 61 38 25 C38 25 58 18 80 18 Z" fill="none" stroke="#bad5ff" strokeWidth="1.5" strokeDasharray="3 4" /><path d="M80 63 C69 48 48 48 48 63 C48 77 67 78 80 63" fill="none" stroke="url(#devsecopsLoopLeft)" strokeWidth="9" strokeLinecap="round" /><path d="M80 63 C91 48 112 48 112 63 C112 77 93 78 80 63" fill="none" stroke="url(#devsecopsLoopRight)" strokeWidth="9" strokeLinecap="round" /><circle cx="80" cy="63" r="12" fill="#fff" stroke="#4d83ee" strokeWidth="2" /><path d="M76 60 A4 4 0 0 1 84 60 L83 69 A3 3 0 1 1 77 69 Z" fill="#2563eb" /><circle cx="80" cy="10" r="3" fill="#89bbff" /><circle cx="130" cy="18" r="3" fill="#89bbff" /><circle cx="30" cy="18" r="3" fill="#89bbff" /></svg></div><b>DevSecOps</b></div>
            <div className="role-card network-card"><div className="role-art network-art"><i /><span /><span /><span /></div><b>Security &amp; Networking</b></div>
          </div>
        </section>

        <section id="about" className="ref-section ref-about">
          <SectionTitle eyebrow="About">A systems-focused engineer<br />connecting every layer of the stack.</SectionTitle>
          <div className="about-ref-grid">
            <div><p>I&apos;m a <b>Computer Engineering Master&apos;s student at the Faculty of Sciences of Bizerte</b>, specialising in networking and cloud computing. My experience spans Linux systems, secure network infrastructure, databases, and deployable AI services.</p><p>I work across the service lifecycle — from reliable network architecture and cloud-aware automation to monitoring applications and real-time data pipelines.</p></div>
            <div><p>I enjoy making infrastructure practical, observable, and secure. My focus is server administration, network supervision, cloud deployment, and database management.</p><div className="hashtag-cloud"><span>#Cloud</span><span>#Networking</span><span>#Linux</span><span>#DevOps</span><span>#Docker</span><span>#Cybersecurity</span><span>#OpenToWork</span></div></div>
          </div>
          <div className="ref-stats"><div><b>02</b><span>Internships completed</span></div><div><b>04</b><span>Infrastructure projects</span></div><div><b>05</b><span>Professional certifications</span></div><div><b>03</b><span>Languages spoken</span></div></div>
        </section>

        <section id="experience" className="ref-section ref-experience">
          <SectionTitle eyebrow="Experience">Two internships,<br />one infrastructure-ready toolkit.</SectionTitle>
          <p className="section-intro">From full-stack application development to embedded AI and Linux deployment — a clear path toward cloud and network engineering.</p>
          <div className="reference-timeline">
            {experience.map((item) => <article className={`reference-job${item.now ? " latest-job" : ""}`} key={`${item.date}-${item.company}`}><span className="timeline-marker" aria-hidden="true" /><div className="job-date">{item.date}</div><div className="job-name"><h3>{item.role}</h3><p>{item.company}</p></div><p className="job-copy">{item.text}</p><TagList items={item.tags} /></article>)}
          </div>
        </section>

        <section id="skills" className="ref-section ref-skills">
          <SectionTitle eyebrow="Toolbox">Skills, sorted by the systems<br />they help keep running.</SectionTitle>
          <div className="skills-ref-grid">{skills.map(([heading, entries]) => <article key={heading}><h3>{heading}</h3><TagList items={entries} /></article>)}</div>
        </section>

        <section id="certifications" className="ref-section ref-certifications">
          <div className="cert-mosaic" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <SectionTitle eyebrow="Credentials & Recognition">Certifications that<br />support the systems I build.</SectionTitle>
          <p className="section-intro">A focused record across network infrastructure, DevOps practices, cloud delivery, and AI fundamentals.</p>
          <div className="certifications-grid">{certifications.map((cert) => <article className={`credential-card${cert.pdf ? " has-pdf" : ""}`} key={cert.name}><div className="credential-card-top"><ProviderMark provider={cert.provider} /><span><i /> Credential</span></div><h3>{cert.name}</h3><p>{cert.issuer}</p>{cert.pdf && <button type="button" className="certificate-view-action" onClick={() => setActiveCertificate(cert)}>View certificate <ArrowRight size={13} /></button>}<div className="credential-meta"><span>{cert.scope}</span><time>{cert.issued}</time></div></article>)}</div>
        </section>

        <section className="full-stack-ref">
          <div className="full-stack-top"><p>Cloud &amp; Infrastructure</p><h2>One engineer,<br />every critical layer.</h2><span>Secure networks, Linux systems, containers, cloud services, real-time monitoring, and data infrastructure — designed to work together.</span></div>
          <div className="service-grid">{services.map(([name, description], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{description}</p></article>)}</div>
        </section>

        <section id="projects" className="ref-section ref-projects">
          <SectionTitle eyebrow="Selected Work">Four systems,<br />built to run reliably.</SectionTitle>
          <p className="section-intro">From real-time AI monitoring to certificate-based access control and automated cloud deployment — each project strengthened a different infrastructure layer.</p>
          <div className="ref-project-list">{projects.map((project, index) => <article className="ref-project" key={project.title}><div className="project-thumb"><img src={project.image} alt={`${project.title} technical illustration`} /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="project-content"><div className="project-class"><span>{project.type}</span><b><i /> {project.state}</b></div><h3>{project.title}</h3><p className="project-byline">{project.byline}</p><div className="project-description"><div><strong>Problem</strong><p>{project.problem}</p></div><div><strong>What it is</strong><p>{project.body}</p></div></div><div className="project-meta"><div><strong>Tech stack</strong><TagList items={project.tech} /></div><div><strong>Delivery</strong><div className="delivery-row">{project.delivery.map((item) => <span key={item}>{item}</span>)}</div></div></div></div></article>)}</div>
        </section>

        <section id="contact" className="ref-contact">
          <div className="contact-ref-copy"><SectionTitle eyebrow="Let&apos;s Talk">Have an infrastructure challenge?<br />Let&apos;s solve it.</SectionTitle><p>Open to internship, graduate, and engineering opportunities in cloud infrastructure, networking, Linux systems, and secure deployment.</p><div className="contact-facts"><div><span>Email</span><a href={`mailto:${email}`}>{email}</a></div><div><span>Phone</span><a href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a></div><div><span>Based in</span><p><MapPin size={16} /> Tunis, Tunisia · open to remote</p></div></div></div>
          <form className="reference-form" onSubmit={sendMessage}><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required name="senderEmail" type="email" placeholder="your.email@domain.com" /></label><label>Subject<input required name="subject" placeholder="Collaboration or internship enquiry" /></label><label>Message<textarea required name="message" placeholder="Briefly describe the opportunity or project." rows={5} /></label><button type="submit">Send message <Send size={17} /></button></form>
        </section>
      </main>
      <footer className="ref-footer"><div className="ref-brand"><span className="brand-name">fedi</span><span className="brand-node" /></div><p>© 2026 Fedi Nasri · Crafted with care in Tunis</p><div><a href={linkedInUrl} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${email}`}>Email</a><a href={`tel:${phone.replaceAll(" ", "")}`}>{phone}</a></div></footer>
      <a className="floating-contact" href="#contact" aria-label="Contact Fedi Nasri"><ChevronDown size={16} /></a>
      {activeCertificate?.pdf && <div className="certificate-viewer-overlay" role="dialog" aria-modal="true" aria-label={`${activeCertificate.name} certificate viewer`} onMouseDown={() => setActiveCertificate(null)}><div className="certificate-viewer" onMouseDown={(event) => event.stopPropagation()}><div className="certificate-viewer-head"><div><span>Credential viewer</span><h2>{activeCertificate.name}</h2></div><button type="button" onClick={() => setActiveCertificate(null)} aria-label="Close certificate viewer"><X size={19} /></button></div><object className="certificate-pdf-object" data={activeCertificate.pdf} type="application/pdf"><a href={activeCertificate.pdf} target="_blank" rel="noreferrer">Open certificate PDF</a></object></div></div>}
    </div>
  );
}
