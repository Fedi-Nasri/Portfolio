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

const email = "aladinhabibii@gmail.com";

const experience = [
  { date: "JAN 2026 — NOW", role: "Mobile Application Developer Intern", company: "GALYLIO AI", text: "Building Dronia, an AI drone-management platform with Flutter, API integration, and real-time drone telemetry.", tags: ["Flutter", "FastAPI", "PostgreSQL", "Prisma"], now: true },
  { date: "DEC 2025", role: "Web Developer", company: "AlBaraka Enseigne", text: "Shipped a public catalogue and secure content dashboard with authentication, CRUD operations, and media management.", tags: ["Next.js", "Tailwind", "Node", "JWT"] },
  { date: "JUN — AUG 2025", role: "iOS Mobile Developer Intern", company: "Appaxis Innovations", text: "Designed native SwiftUI interfaces and connected cleanly to Swagger-documented APIs.", tags: ["SwiftUI", "Xcode", "CocoaPods", "Swagger"] },
  { date: "JUL — AUG 2024", role: "Test Automation Intern", company: "SAGEMCOM", text: "Built practical automation pipelines for manual suites with device-level and computer-vision validation.", tags: ["Robot Framework", "Appium", "OpenCV", "Python"] },
  { date: "JUL — AUG 2023", role: "Web Developer Intern", company: "Aluco-LED Enseigne", text: "Delivered responsive marketing interfaces and visual assets for a signage company.", tags: ["HTML", "CSS", "JavaScript", "Bootstrap"] },
  { date: "JUN — AUG 2022", role: "Graphic Designer Intern", company: "Rise-UP", text: "Created visual systems, brand collateral, and social content with the Adobe suite.", tags: ["Photoshop", "Illustrator", "Canva"] },
];

const skills = [
  ["Mobile", ["Flutter", "React Native", "SwiftUI", "iOS", "Android", "CocoaPods", "Xcode"]],
  ["Frontend", ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS"]],
  ["Backend", ["FastAPI", "NestJS", "Spring Boot", "Node.js", "PHP", "REST APIs", "Swagger"]],
  ["Data & Infra", ["PostgreSQL", "Prisma ORM", "MySQL", "Firebase", "JWT Auth", "Git"]],
  ["AI & Systems", ["Computer Vision", "OpenCV", "Python", "C++", "Java", "Arduino"]],
  ["QA & Design", ["Robot Framework", "Appium", "ADB", "Figma", "Photoshop", "Illustrator", "Jira"]],
] as const;

const projects = [
  { image: "/manus-storage/ala-project-agri_e0df7983.jpg", type: "Mobile · AI · Agronomy", state: "In development", title: "DronIA — Precision Agronomy", byline: "GALYLIO AI · Final-Year Project · 2026", problem: "Agronomists juggle separate tools for drones, imagery, crop diagnostics, and field follow-up. The loop needed one mobile-first product.", body: "A cross-platform Flutter app for AI-assisted precision agriculture: fleet management, missions, live telemetry, remote sensing, crop disease detection, and an in-app assistant.", tech: ["Flutter", "FastAPI", "MongoDB", "YOLO11s", "Docker"], delivery: ["Cloud backend", "iOS beta", "Android beta"] },
  { image: "/manus-storage/ala-project-commerce_45885a06.jpg", type: "Mobile · E-commerce · Pharmacy", state: "Built", title: "ParaHouse", byline: "Online Parapharmacie · French Market", problem: "A local parapharmacie needed an everyday mobile storefront for simple browsing, orders, and customer tracking.", body: "A French-language Flutter shopping app with catalogue browsing, category filtering, search, cart, account, and checkout experiences.", tech: ["Flutter", "Dart", "REST API", "Provider"], delivery: ["Play Store-ready", "App Store-ready"] },
  { image: "/manus-storage/ala-technical-hero_a9a34cd5.jpg", type: "Mobile · Marketplace · Rebuild", state: "Shipped", title: "1111.tn — Smart Price Comparator", byline: "Frontend Rebuild + Notifications Backend · 2026", problem: "The existing price-comparison app required a complete Flutter UI renewal and a notifications backend before its Play Store release.", body: "Rebuilt navigation, screens, product browsing, and performance while designing and delivering the Python notifications backend.", tech: ["Flutter", "Dart", "Python", "FCM Push", "REST API"], delivery: ["Google Play released", "Release pipeline"] },
  { image: "/manus-storage/ala-project-commerce_45885a06.jpg", type: "Web + Mobile · Storefront", state: "Shipped", title: "Watt Spot", byline: "Electrical Supplies & Lighting · 2026", problem: "A lighting business needed a connected client storefront, mobile companion, live inventory, and one source of truth.", body: "React web app and companion Flutter app sharing Supabase for catalogue, media, notifications, and admin workflows.", tech: ["React", "Flutter", "Supabase", "PostgreSQL"], delivery: ["Web deployed", "Mobile built", "Supabase hosted"] },
];

const services = [
  ["Frontend", "Next.js, React, Tailwind. Responsive, accessible, pixel-perfect UI."],
  ["Backend", "FastAPI, NestJS, Spring Boot, Node. REST APIs, auth, and jobs."],
  ["Mobile", "Flutter, React Native, SwiftUI. From design to in-store binary."],
  ["Release", "Certificates, store listings, App Store Connect, and Play Console."],
  ["Deployment", "Vercel, Railway, Supabase, Docker, and CI/CD pipelines."],
  ["Testing & QA", "Robot Framework, Appium, OpenCV, and real-device automation."],
];

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
        <a href="#home" className="ref-brand" aria-label="Ala Din Habibi home">ala<span>.</span></a>
        <nav className="ref-nav" aria-label="Primary navigation">
          <a href="#home">Home</a><a href="#experience">Experience</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#about">About</a>
        </nav>
        <div className="ref-header-actions">
          <button className="tone-toggle" aria-label="Toggle visual tone" onClick={() => setDimMode((value) => !value)}>{dimMode ? <Sun size={15} /> : <Moon size={15} />}</button>
          <a href="#contact" className="talk-button">Let&apos;s talk <ArrowRight size={15} /></a>
          <button className="ref-menu" type="button" aria-label="Toggle navigation" aria-expanded={mobileNav} onClick={() => setMobileNav((value) => !value)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      {mobileNav && <nav className="ref-mobile-nav" aria-label="Mobile navigation"><a onClick={closeNav} href="#home">Home</a><a onClick={closeNav} href="#experience">Experience</a><a onClick={closeNav} href="#skills">Skills</a><a onClick={closeNav} href="#projects">Projects</a><a onClick={closeNav} href="#about">About</a><a onClick={closeNav} className="ref-mobile-talk" href="#contact">Let&apos;s talk <ArrowRight size={15} /></a></nav>}

      <main>
        <section id="home" className="reference-hero">
          <div className="hero-copy-ref">
            <p className="hello-line"><Sparkles size={13} /> Hello, I&apos;m</p>
            <h1>Ala Din<br /><strong>HABIBI.</strong></h1>
            <div className="hero-caption"><span>Full-Stack Developer</span><i /><small>Tunis, TN</small></div>
            <p className="hero-blurb">Mobile &amp; full-stack engineer building cross-platform apps with Flutter, React Native, Next.js and Node. Currently shipping a drone-management platform at GALYLIO AI.</p>
            <button type="button" className="copy-row" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={15} />} <span>{copied ? "Copied to clipboard" : email}</span></button>
            <div className="hero-social-row">
              <a href={`mailto:${email}`} aria-label="Send email"><Mail size={15} /></a>
              <a href="https://www.linkedin.com/in/ala-din-habibi-bb2058282" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
              <a href="tel:+21695836148" aria-label="Call"><Phone size={15} /></a>
            </div>
          </div>

          <div className="portrait-zone" aria-label="Portrait of Ala Din Habibi">
            <span className="connector c-one" /><span className="connector c-two" /><span className="connector c-three" />
            <span className="node n-one" /><span className="node n-two" /><span className="node n-three" />
            <div className="portrait-glow" />
            <img src="/manus-storage/ala-reference-portrait_97ac7701.webp" alt="Ala Din Habibi" />
          </div>

          <div className="hero-role-stack" aria-label="Roles">
            <div className="role-card phone-card"><div className="role-art phones"><span /><span /><span /></div><b>Mobile Developer</b></div>
            <div className="role-card design-card"><div className="role-art mark-shape"><i /><i /><i /></div><b>UI / UX Designer</b></div>
            <div className="role-card browser-card"><div className="role-art browser-art"><i /><span /><span /><span /></div><b>Full-Stack Developer</b></div>
          </div>
        </section>

        <section id="about" className="ref-section ref-about">
          <SectionTitle eyebrow="About">A passionate engineer<br />chasing every layer of the stack.</SectionTitle>
          <div className="about-ref-grid">
            <div><p>I&apos;m a <b>Mobile Software Engineering student at ESPRIT</b>, graduating July 2026, with hands-on experience across mobile, web, and cloud. I enjoy exploring every facet of technology — from systems architecture to pixel-perfect interfaces.</p><p>Right now I&apos;m building the mobile app for <b>Dronia</b>, an AI-driven drone-management platform at GALYLIO AI, focused on real-time data interfaces and dependable API integration.</p></div>
            <div><p>I turn rough ideas into shipped products and pick up the right tools fast. Open to opportunities and collaborations.</p><div className="hashtag-cloud"><span>#Mobile</span><span>#FullStack</span><span>#Flutter</span><span>#ReactNative</span><span>#NextJS</span><span>#NodeJS</span><span>#OpenToWork</span></div></div>
          </div>
          <div className="ref-stats"><div><b>04+</b><span>Years of coding</span></div><div><b>06</b><span>Internships shipped</span></div><div><b>30+</b><span>Technologies in toolbox</span></div><div><b>04</b><span>Platforms delivered</span></div></div>
        </section>

        <section id="experience" className="ref-section ref-experience">
          <SectionTitle eyebrow="Experience">Six internships,<br />one growing toolbox.</SectionTitle>
          <p className="section-intro">From pixel-pushing in 2022 to shipping AI-powered mobile apps in 2026 — a steady climb through the stack.</p>
          <div className="reference-timeline">
            {experience.map((item) => <article className="reference-job" key={`${item.date}-${item.company}`}><div className="job-date">{item.now && <i />} {item.date}</div><div className="job-name"><h3>{item.role}</h3><p>{item.company}</p></div><p className="job-copy">{item.text}</p><TagList items={item.tags} /></article>)}
          </div>
        </section>

        <section id="skills" className="ref-section ref-skills">
          <SectionTitle eyebrow="Toolbox">Skills, sorted by where<br />they actually live.</SectionTitle>
          <div className="skills-ref-grid">{skills.map(([heading, entries]) => <article key={heading}><h3>{heading}</h3><TagList items={entries} /></article>)}</div>
        </section>

        <section className="full-stack-ref">
          <div className="full-stack-top"><p>Full-Stack</p><h2>One developer,<br />every layer of delivery.</h2><span>Design, build, ship and maintain — across mobile and web, front-end to back-end, store submission to cloud deployment.</span></div>
          <div className="service-grid">{services.map(([name, description], index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{description}</p></article>)}</div>
        </section>

        <section id="projects" className="ref-section ref-projects">
          <SectionTitle eyebrow="Selected Work">Nine case studies,<br />shipped end-to-end.</SectionTitle>
          <p className="section-intro">From design and frontend to backend, deployment, and release — each project below was taken from idea to product.</p>
          <div className="ref-project-list">{projects.map((project, index) => <article className="ref-project" key={project.title}><div className="project-thumb"><img src={project.image} alt="" /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="project-content"><div className="project-class"><span>{project.type}</span><b><i /> {project.state}</b></div><h3>{project.title}</h3><p className="project-byline">{project.byline}</p><div className="project-description"><div><strong>Problem</strong><p>{project.problem}</p></div><div><strong>What it is</strong><p>{project.body}</p></div></div><div className="project-meta"><div><strong>Tech stack</strong><TagList items={project.tech} /></div><div><strong>Delivery</strong><div className="delivery-row">{project.delivery.map((item) => <span key={item}>{item}</span>)}</div></div></div></div></article>)}</div>
        </section>

        <section id="contact" className="ref-contact">
          <div className="contact-ref-copy"><SectionTitle eyebrow="Let&apos;s Talk">Have a project in mind?<br />Let&apos;s build it.</SectionTitle><p>Open to internships, freelance gigs, and full-time roles starting July 2026. Reply within 24 hours, usually faster.</p><div className="contact-facts"><div><span>Email</span><a href={`mailto:${email}`}>{email}</a></div><div><span>Phone</span><a href="tel:+21695836148">+216 95 836 148</a></div><div><span>Based in</span><p><MapPin size={15} /> Tunis, Tunisia · open to remote</p></div></div></div>
          <form className="reference-form" onSubmit={sendMessage}><label>Name<input required name="name" placeholder="Jane Doe" /></label><label>Email<input required name="senderEmail" type="email" placeholder="jane@company.com" /></label><label>Subject<input required name="subject" placeholder="Internship opportunity" /></label><label>Message<textarea required name="message" placeholder="Tell me about your project…" rows={5} /></label><button type="submit">Send message <Send size={15} /></button></form>
        </section>
      </main>
      <footer className="ref-footer"><div className="ref-brand">ala<span>.</span></div><p>© 2026 Ala Din Habibi · Crafted with care in Tunis</p><div><a href="https://www.linkedin.com/in/ala-din-habibi-bb2058282" target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${email}`}>Email</a><a href="tel:+21695836148">+216 95 836 148</a></div></footer>
      <a className="floating-contact" href="#contact" aria-label="Contact Ala Din Habibi"><ChevronDown size={16} /></a>
    </div>
  );
}
