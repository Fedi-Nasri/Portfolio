/**
 * Design reminder — Technical Field Notes: warm paper, charcoal ink, signal cobalt,
 * Swiss-editorial hierarchy, and evidence-led product dossiers.
 */
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
} from "lucide-react";

const email = "aladinhabibii@gmail.com";

const experience = [
  {
    date: "Jan 2026 — now",
    role: "Mobile Application Developer Intern",
    company: "GALYLIO AI",
    description:
      "Building Dronia, an AI drone-management platform, with mobile UI, API integration, and real-time drone telemetry.",
    tags: ["Flutter", "FastAPI", "PostgreSQL", "Prisma"],
    current: true,
  },
  {
    date: "Dec 2025",
    role: "Web Developer",
    company: "AlBaraka Enseigne",
    description:
      "Shipped a public catalog and secure content dashboard with JWT authentication, CRUD operations, and media management.",
    tags: ["Next.js", "Tailwind", "Node", "JWT"],
  },
  {
    date: "Jun — Aug 2025",
    role: "iOS Mobile Developer Intern",
    company: "Appaxis Innovations",
    description:
      "Designed native SwiftUI interfaces and consumed Swagger-documented APIs for clear front-to-back communication.",
    tags: ["SwiftUI", "Xcode", "CocoaPods", "Swagger"],
  },
  {
    date: "Jul — Aug 2024",
    role: "Test Automation Intern",
    company: "SAGEMCOM",
    description:
      "Set up reliable automation pipelines for manual test suites with device-level validation and computer vision checks.",
    tags: ["Robot Framework", "Appium", "OpenCV", "Python"],
  },
];

const disciplines = [
  {
    number: "01",
    title: "Mobile systems",
    items: ["Flutter", "React Native", "SwiftUI", "iOS", "Android", "Xcode"],
  },
  {
    number: "02",
    title: "Web interfaces",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5", "CSS"],
  },
  {
    number: "03",
    title: "Backend & data",
    items: ["FastAPI", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Firebase"],
  },
  {
    number: "04",
    title: "AI, QA & design",
    items: ["Python", "OpenCV", "Appium", "Figma", "Photoshop", "Illustrator"],
  },
];

const projects = [
  {
    number: "CASE / 01",
    eyebrow: "Mobile · AI · Agronomy",
    status: "In development",
    title: "DronIA — Precision Agronomy",
    subline: "GALYLIO AI · Final-year project · 2026",
    image: "/manus-storage/ala-project-agri_e0df7983.jpg",
    problem:
      "Agronomists routinely switch between drone tooling, satellite imagery, crop diagnostics, and field follow-up. The loop needed one mobile-first operating surface.",
    solution:
      "A cross-platform Flutter app for AI-assisted precision agriculture: fleet management, mission planning, telemetry, Sentinel-2 sensing, disease detection, and an in-app assistant.",
    stack: ["Flutter", "FastAPI", "MongoDB", "YOLO11s", "Docker"],
    outcomes: ["Cloud backend", "iOS beta", "Android beta"],
    kind: "image" as const,
  },
  {
    number: "CASE / 02",
    eyebrow: "Mobile · Commerce · Pharmacy",
    status: "Built",
    title: "ParaHouse",
    subline: "Online parapharmacie · French market",
    image: "/manus-storage/ala-project-commerce_45885a06.jpg",
    problem:
      "A local parapharmacie wanted a dedicated commerce journey that made browsing, orders, and tracking feel quick enough for everyday purchasing.",
    solution:
      "A Flutter storefront with a French-language catalog, search, cart, account flow, and secure checkout journey designed for low-friction use.",
    stack: ["Flutter", "Dart", "REST API", "Provider"],
    outcomes: ["Play Store-ready", "App Store-ready"],
    kind: "image" as const,
  },
  {
    number: "CASE / 03",
    eyebrow: "Web + Mobile · Storefront · Supabase",
    status: "Shipped",
    title: "Watt Spot",
    subline: "Electrical supplies & lighting · 2026",
    problem:
      "A lighting business needed one source of truth across a client storefront, admin workflows, inventory, and mobile operations.",
    solution:
      "A React web application and Flutter companion app sharing a Supabase Postgres backbone for live catalog data, images, notifications, and dashboard control.",
    stack: ["React", "Flutter", "Supabase", "PostgreSQL", "Push notifications"],
    outcomes: ["Web deployed", "Mobile built", "Supabase hosted"],
    kind: "diagram" as const,
  },
];

function SectionLabel({ children }: { children: string }) {
  return <p className="section-label">{children}</p>;
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="tag-list" aria-label="Technologies used">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  if (project.kind === "image") {
    return (
      <div className="project-image-wrap">
        <img src={project.image} alt="" className="project-image" />
        <span className="image-index">{project.number}</span>
      </div>
    );
  }

  return (
    <div className="systems-visual" aria-hidden="true">
      <span className="systems-label top">CLIENT WEB</span>
      <span className="systems-label bottom">MOBILE APP</span>
      <span className="systems-label right">SUPABASE</span>
      <div className="system-node browser-node">
        <span />
        <span />
        <span />
      </div>
      <div className="system-node phone-node">
        <span />
        <span />
        <span />
      </div>
      <div className="system-node data-node">
        <span />
        <span />
        <span />
      </div>
      <svg viewBox="0 0 500 360" fill="none" preserveAspectRatio="none">
        <path d="M158 120C212 120 211 180 260 180C310 180 314 105 360 105" />
        <path d="M158 235C215 235 211 185 260 185C310 185 315 250 360 250" />
        <circle cx="158" cy="120" r="4" />
        <circle cx="158" cy="235" r="4" />
        <circle cx="360" cy="105" r="4" />
        <circle cx="360" cy="250" r="4" />
      </svg>
      <span className="image-index">{project.number}</span>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="portfolio-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Ala Din Habibi home">
          <img src="/manus-storage/ala-logo_c1c8eb26.png" alt="" className="brand-mark" />
          <span>ala<span className="brand-dot">.</span></span>
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#toolbox">Toolbox</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-contact" href="#contact">
          Let&apos;s talk <ArrowUpRight size={16} strokeWidth={2.2} />
        </a>
        <button className="menu-button" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <Menu size={20} />
        </button>
      </header>
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work <ArrowDownRight size={17} /></a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience <ArrowDownRight size={17} /></a>
          <a href="#toolbox" onClick={() => setMenuOpen(false)}>Toolbox <ArrowDownRight size={17} /></a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About <ArrowDownRight size={17} /></a>
          <a className="mobile-menu-contact" href="#contact" onClick={() => setMenuOpen(false)}>Let&apos;s talk <ArrowUpRight size={17} /></a>
        </nav>
      )}

      <main>
        <section className="hero section-rule" id="home">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="pulse-dot" /> Available for opportunities from July 2026
            </div>
            <h1>
              I make the <em>moving parts</em>
              <br />of digital products move together.
            </h1>
            <p className="hero-intro">
              I&apos;m <strong>Ala Din Habibi</strong>, a mobile and full-stack engineer in Tunis. I design, build, and ship cross-platform products from the first interface through to a working release.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#work">
                Browse selected work <ArrowDownRight size={18} />
              </a>
              <button className="email-copy" type="button" onClick={copyEmail}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Email copied" : "Copy email"}
              </button>
            </div>
            <div className="hero-meta">
              <span><MapPin size={15} /> Tunis, Tunisia</span>
              <span>Open to remote</span>
              <span>Mobile · Web · AI</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art-frame">
              <img src="/manus-storage/ala-technical-hero_a9a34cd5.jpg" alt="Abstract engineering composition in cobalt and ivory" />
              <span className="art-note note-one">INTERFACE / SYSTEM / RELEASE</span>
              <span className="art-note note-two">EST. 2022</span>
              <span className="art-orbit orbit-one" />
              <span className="art-orbit orbit-two" />
            </div>
            <div className="role-stamp role-mobile">Mobile engineer</div>
            <div className="role-stamp role-fullstack">Full-stack builder</div>
          </div>
        </section>

        <section className="intro-strip" aria-label="Portfolio introduction">
          <p>Working across <strong>mobile, web, backend, and delivery</strong> so an idea stays coherent from its first screen to its final release.</p>
          <span className="strip-code">FIELD NOTES / 2026</span>
        </section>

        <section className="about-section section-rule" id="about">
          <aside className="side-rail"><SectionLabel>01 / About</SectionLabel></aside>
          <div className="about-main">
            <h2>From interface sketch <br />to <em>signed release.</em></h2>
            <div className="about-columns">
              <div>
                <p className="lead-copy">I&apos;m a Mobile Software Engineering student at ESPRIT, graduating in July 2026. I enjoy projects that require both a clear product eye and a practical engineering mindset.</p>
                <p>At GALYLIO AI, I&apos;m building the mobile app for Dronia, an AI-driven drone-management platform. My work centres on real-time data interfaces and well-structured API integration.</p>
              </div>
              <div className="about-note">
                <span className="note-marker">A</span>
                <p>I learn quickly, make systems legible, and stay close to the implementation details. I&apos;m open to internship, freelance, and full-time opportunities.</p>
                <div className="hashtag-row">
                  <span>#Flutter</span><span>#ReactNative</span><span>#NextJS</span><span>#OpenToWork</span>
                </div>
              </div>
            </div>
            <div className="stats-row">
              <div><strong>06</strong><span>Internships &amp; roles</span></div>
              <div><strong>04</strong><span>Platforms shipped across</span></div>
              <div><strong>∞</strong><span>Curiosity for the stack</span></div>
            </div>
          </div>
        </section>

        <section className="work-section section-rule" id="work">
          <aside className="side-rail"><SectionLabel>02 / Selected work</SectionLabel></aside>
          <div className="work-main">
            <div className="section-heading">
              <div>
                <p className="eyebrow">A focused selection</p>
                <h2>Builds with <em>real stakes.</em></h2>
              </div>
              <p>Three systems, each owned across more than one layer of delivery.</p>
            </div>
            <div className="project-list">
              {projects.map((project) => (
                <article className="project-dossier" key={project.title}>
                  <ProjectVisual project={project} />
                  <div className="project-copy">
                    <div className="project-topline">
                      <span>{project.eyebrow}</span>
                      <span className="status"><i /> {project.status}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p className="project-subline">{project.subline}</p>
                    <div className="project-brief">
                      <div><span>Challenge</span><p>{project.problem}</p></div>
                      <div><span>Build</span><p>{project.solution}</p></div>
                    </div>
                    <div className="project-footer">
                      <TagList items={project.stack} />
                      <div className="outcome-list">
                        {project.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience-section section-rule" id="experience">
          <aside className="side-rail"><SectionLabel>03 / Experience</SectionLabel></aside>
          <div className="experience-main">
            <div className="section-heading compact-heading">
              <div><p className="eyebrow">The progression</p><h2>Each role added <em>another layer.</em></h2></div>
              <p>From visual design foundations to AI-powered mobile systems.</p>
            </div>
            <ol className="timeline">
              {experience.map((item) => (
                <li key={`${item.company}-${item.date}`} className={item.current ? "is-current" : ""}>
                  <div className="timeline-date"><span className="timeline-dot" />{item.date}</div>
                  <div className="timeline-role"><h3>{item.role}</h3><p>{item.company}</p></div>
                  <p className="timeline-description">{item.description}</p>
                  <TagList items={item.tags} />
                </li>
              ))}
            </ol>
            <p className="experience-close">Also: web development at <strong>Aluco-LED Enseigne</strong> and visual identity work at <strong>Rise-UP</strong>, building a wider understanding of product, presentation, and production.</p>
          </div>
        </section>

        <section className="toolbox-section section-rule" id="toolbox">
          <aside className="side-rail"><SectionLabel>04 / Toolbox</SectionLabel></aside>
          <div className="toolbox-main">
            <div className="section-heading compact-heading">
              <div><p className="eyebrow">Where the skills live</p><h2>A practical <em>working set.</em></h2></div>
              <p>Tools are useful when they help the next decision become easier.</p>
            </div>
            <div className="discipline-grid">
              {disciplines.map((discipline) => (
                <article className="discipline" key={discipline.number}>
                  <span className="discipline-number">{discipline.number}</span>
                  <h3>{discipline.title}</h3>
                  <ul>{discipline.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="capability-banner">
              <span>FULL-STACK DELIVERY</span>
              <p>Design <i>→</i> Build <i>→</i> Deploy <i>→</i> Maintain</p>
              <span className="banner-end">ONE OWNER, MANY LAYERS</span>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-gridline" aria-hidden="true" />
          <div className="contact-copy">
            <SectionLabel>05 / Contact</SectionLabel>
            <h2>Have a product with <em>moving parts?</em></h2>
            <p>Tell me where it needs to go. I&apos;m open to internships, freelance work, and full-time roles starting in July 2026.</p>
            <div className="contact-details">
              <a href={`mailto:${email}`}><Mail size={17} /> {email}</a>
              <a href="tel:+21695836148"><Phone size={17} /> +216 95 836 148</a>
              <a href="https://www.linkedin.com/in/ala-din-habibi-bb2058282" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <div className="contact-card">
            <span className="contact-card-code">OPEN CHANNEL / 01</span>
            <h3>Let&apos;s make it useful.</h3>
            <p>A concise note is enough to start. I normally reply within 24 hours.</p>
            <a className="button-primary contact-button" href={`mailto:${email}?subject=Portfolio%20enquiry`}>
              Write an email <ArrowUpRight size={18} />
            </a>
            <div className="contact-card-mark"><img src="/manus-storage/ala-logo_c1c8eb26.png" alt="" /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><img src="/manus-storage/ala-logo_c1c8eb26.png" alt="" className="brand-mark" /><span>ala<span className="brand-dot">.</span></span></a>
        <p>© 2026 Ala Din Habibi · Crafted in Tunis</p>
        <a href="#home">Back to top <ArrowUpRight size={15} /></a>
      </footer>
    </div>
  );
}
