/**
 * Public portfolio view. All visible content is sourced from the latest published
 * portfolio document while the established visual system remains unchanged.
 */
import React, { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight, Check, ChevronDown, ChevronUp, Copy, Github, Linkedin, Mail, MapPin,
  Menu, Moon, Phone, Sparkles, Sun, X,
} from "lucide-react";
import { DEFAULT_PORTFOLIO_CONTENT, DEFAULT_SECTION_ORDER, hydrateExperienceDetails, type PortfolioContent } from "@shared/portfolio";
import { trpc } from "@/lib/trpc";
import { RichText } from "@/components/RichText";
import { CustomSectionCanvas } from "@/components/CustomSectionCanvas";
import { getPublicMotionConfig } from "@/lib/publicMotion";

type Certification = PortfolioContent["certifications"][number];
type WritingPost = PortfolioContent["writing"][number];

const PROVIDER_LABELS: Record<string, string> = { aws: "aws", azure: "Microsoft Azure", cisco: "CISCO", cloudflare: "Cloudflare", comptia: "CompTIA", coursera: "coursera", docker: "docker", fortinet: "FORTINET", github: "GitHub", gitlab: "GitLab", "google-cloud": "Google Cloud", hashicorp: "HashiCorp", ibm: "IBM", isc2: "ISC2", jenkins: "Jenkins", kodekloud: "KodeKloud", kubernetes: "Kubernetes", "linux-foundation": "Linux Foundation", oracle: "ORACLE", redhat: "Red Hat", terraform: "Terraform" };

function ProviderMark({ cert }: { cert: Certification }) {
  if (cert.providerLogo) return <div className="cert-provider-mark custom-provider-mark" aria-label={cert.providerLabel ?? cert.provider}><img src={cert.providerLogo} alt={`${cert.providerLabel ?? cert.provider} provider logo`} /></div>;
  if (cert.provider === "microsoft") return <div className="cert-provider-mark microsoft-mark" aria-label="Microsoft"><span className="microsoft-squares"><i /><i /><i /><i /></span><b>Microsoft</b></div>;
  if (cert.provider === "custom") return <div className="cert-provider-mark custom-provider-mark" aria-label={cert.providerLabel ?? "Provider"}><span>{cert.providerLabel ?? "Provider"}</span></div>;
  return <div className={`cert-provider-mark ${cert.provider}-mark`} aria-label={PROVIDER_LABELS[cert.provider] ?? cert.provider}><span>{PROVIDER_LABELS[cert.provider] ?? cert.provider}</span></div>;
}

function TagList({ items }: { items: readonly string[] }) {
  return <div className="ref-tags">{items.map((tag) => <span key={tag}>{tag}</span>)}</div>;
}

function Multiline({ value }: { value: string }) {
  return <>{value.split("\n").map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}<RichText value={line} /></span>)}</>;
}

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return <div className="ref-section-title"><span>{eyebrow}</span><h2>{children}</h2></div>;
}

export default function Home() {
  const { data: publishedContent } = trpc.portfolio.publicContent.useQuery();
  const content = hydrateExperienceDetails(publishedContent ?? DEFAULT_PORTFOLIO_CONTENT);
  const { hero, navigation } = content;
  const sectionOrder = content.sectionOrder ?? DEFAULT_SECTION_ORDER;
  const hiddenSections = new Set(content.hiddenSections ?? []);
  const hasSection = (sectionId: string) => sectionOrder.includes(sectionId) && !hiddenSections.has(sectionId);
  const firstVisibleSection = sectionOrder.find(hasSection);
  const sectionStyle = (sectionId: string): CSSProperties => ({ order: Math.max(0, sectionOrder.indexOf(sectionId) + 1), display: hasSection(sectionId) ? undefined : "none" });
  const focusPositions = hero.focusPositions ?? [{ x: 4, y: 6 }, { x: 47, y: 22 }, { x: 47, y: 66 }, { x: 6, y: 66 }];
  const projectFrameCss = content.projects.map((project, index) => { const ratio = project.imageAspectRatio === "portrait" ? "3 / 4" : project.imageAspectRatio === "square" ? "1 / 1" : project.imageAspectRatio === "widescreen" ? "16 / 9" : "4 / 3"; return `.ref-project-list .ref-project:nth-child(${index + 1}) .project-thumb{aspect-ratio:${ratio};height:${project.imageFrameHeight ?? 278}px}`; }).join("");
  const [copied, setCopied] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [dimMode, setDimMode] = useState(false);
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  const [activeCertificate, setActiveCertificate] = useState<Certification | null>(null);
  const [activeArticle, setActiveArticle] = useState<WritingPost | null>(null);
  const [expandedExperienceIndex, setExpandedExperienceIndex] = useState<number | null>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = portfolioRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const config = getPublicMotionConfig(prefersReducedMotion);
    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>(config.revealSelector));

    root.classList.add(config.rootClass);
    revealTargets.forEach((target) => {
      target.dataset.motionReveal = "pending";
    });

    if (!config.enabled) {
      root.classList.add(config.reducedClass);
      revealTargets.forEach((target) => {
        target.dataset.revealed = "true";
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => {
        target.dataset.revealed = "true";
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        target.dataset.revealed = "true";
        observer.unobserve(target);
      });
    }, config.observerOptions);

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(hero.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1900);
    } catch {
      window.location.href = `mailto:${hero.email}`;
    }
  };

  const closeNav = () => setMobileNav(false);

  return (
    <div ref={portfolioRef} className={`reference-portfolio public-motion${dimMode ? " dim-mode" : ""}`}>
      <style>{projectFrameCss}</style>
      <header className="ref-header">
        <a href={firstVisibleSection ? `#${firstVisibleSection}` : "#"} className="ref-brand" aria-label={`${hero.firstName} ${hero.lastName} portfolio`}><span className="brand-name">fedi</span><span className="brand-node" /></a>
        <nav className="ref-nav" aria-label="Primary navigation">
          {hasSection("home") && <a href="#home">{navigation.home}</a>}{hasSection("experience") && <a href="#experience">{navigation.experience}</a>}{hasSection("skills") && <a href="#skills">{navigation.skills}</a>}{hasSection("certifications") && <a href="#certifications">{navigation.certifications}</a>}{hasSection("projects") && <a href="#projects">{navigation.projects}</a>}{hasSection("writing") && <a href="#writing">{navigation.writing}</a>}{hasSection("about") && <a href="#about">{navigation.about}</a>}
        </nav>
        <div className="ref-header-actions">
          <button className="tone-toggle" aria-label="Toggle visual tone" onClick={() => setDimMode((value) => !value)}>{dimMode ? <Sun size={15} /> : <Moon size={15} />}</button>
          {hasSection("contact") && <a href="#contact" className="talk-button">{navigation.contact} <ArrowRight size={15} /></a>}
          <button className="ref-menu" type="button" aria-label="Toggle navigation" aria-expanded={mobileNav} onClick={() => setMobileNav((value) => !value)}>{mobileNav ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      {mobileNav && <nav className="ref-mobile-nav" aria-label="Mobile navigation">{hasSection("home") && <a onClick={closeNav} href="#home">{navigation.home}</a>}{hasSection("experience") && <a onClick={closeNav} href="#experience">{navigation.experience}</a>}{hasSection("skills") && <a onClick={closeNav} href="#skills">{navigation.skills}</a>}{hasSection("certifications") && <a onClick={closeNav} href="#certifications">{navigation.certifications}</a>}{hasSection("projects") && <a onClick={closeNav} href="#projects">{navigation.projects}</a>}{hasSection("writing") && <a onClick={closeNav} href="#writing">{navigation.writing}</a>}{hasSection("about") && <a onClick={closeNav} href="#about">{navigation.about}</a>}{hasSection("contact") && <a onClick={closeNav} className="ref-mobile-talk" href="#contact">{navigation.contact} <ArrowRight size={15} /></a>}</nav>}

      <main className="public-section-order">
        <section id="home" className="reference-hero hero-wide-layout" style={sectionStyle("home")}>
          <div className="hero-copy-ref">
            <p className="hello-line"><Sparkles size={13} /> {hero.hello}</p>
            <h1><RichText value={hero.firstName} /><br /><strong><RichText value={hero.lastName} /></strong></h1>
            <div className="hero-caption"><span><RichText value={hero.role} /></span><i /><small><RichText value={hero.location} /></small></div>
            <p className="hero-blurb"><RichText value={hero.blurb} /></p>
            <button type="button" className="copy-row" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={15} />} <span>{copied ? "Copied to clipboard" : hero.email}</span></button>
            <div className="hero-social-row">
              <a href={`mailto:${hero.email}`} aria-label="Send email"><Mail size={17} /></a>
              <a href={hero.linkedInUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href={hero.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
              <a href={`tel:${hero.phone.replaceAll(" ", "")}`} aria-label="Call"><Phone size={17} /></a>
            </div>
          </div>

          <div className="portrait-zone" aria-label={`Portrait of ${hero.firstName} ${hero.lastName}`}>
            <span className="connector c-one" /><span className="connector c-two" /><span className="connector c-three" />
            <span className="node n-one" /><span className="node n-two" /><span className="node n-three" />
            <div className="portrait-glow" />
            <img src={hero.portraitUrl} alt={`${hero.firstName} ${hero.lastName}`} />
          </div>

          <div className="hero-floating-labels" aria-label="Professional focus areas">
            {hero.focusAreas.map((area, index) => <span className={`floating-specialty floating-specialty-${index + 1}`} key={`${area}-${index}`}><b>{area}</b></span>)}
          </div>

          <div className="hero-role-stack role-featured-layout" aria-label="Professional focus areas">
            <div style={{ "--focus-x": `${focusPositions[0]?.x ?? 4}%`, "--focus-y": `${focusPositions[0]?.y ?? 6}%` } as CSSProperties} className={`role-card cloud-card${activeFocusIndex === 0 ? " is-featured" : ""}`}><div className="role-art cloud-art">{hero.focusVisuals?.[0] ? <img className="role-custom-visual" src={hero.focusVisuals[0]} alt="Cloud focus visual" /> : <><i /><span /><span /><span /></>}</div><b>{hero.focusAreas[0] ?? "Cloud"}</b></div>
            <div style={{ "--focus-x": `${focusPositions[1]?.x ?? 47}%`, "--focus-y": `${focusPositions[1]?.y ?? 22}%` } as CSSProperties} className={`role-card browser-card${activeFocusIndex === 1 ? " is-featured" : ""}`}><div className="role-art infinity-art">{hero.focusVisuals?.[1] ? <img className="role-custom-visual" src={hero.focusVisuals[1]} alt="DevOps focus visual" /> : <svg className="devops-logo" viewBox="0 0 240 120" aria-hidden="true"><defs><linearGradient id="devopsBlueInfinity" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e74ff" /><stop offset="48%" stopColor="#4b8cff" /><stop offset="100%" stopColor="#1f5ce8" /></linearGradient></defs><path d="M29 60 C55 22 89 22 120 60 C151 98 185 98 211 60 C185 22 151 22 120 60 C89 98 55 98 29 60" fill="none" stroke="url(#devopsBlueInfinity)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" /></svg>}</div><b>{hero.focusAreas[1] ?? "DevOps"}</b></div>
            <div style={{ "--focus-x": `${focusPositions[2]?.x ?? 47}%`, "--focus-y": `${focusPositions[2]?.y ?? 66}%` } as CSSProperties} className={`role-card design-card${activeFocusIndex === 2 ? " is-featured" : ""}`}><div className="role-art devsecops-art">{hero.focusVisuals?.[2] ? <img className="role-custom-visual" src={hero.focusVisuals[2]} alt="DevSecOps focus visual" /> : <svg className="devsecops-shield" viewBox="0 0 160 120" aria-hidden="true"><defs><linearGradient id="devsecopsBorder" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#68a7ff" /><stop offset="55%" stopColor="#2563eb" /><stop offset="100%" stopColor="#173fba" /></linearGradient><linearGradient id="devsecopsLoopLeft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8cc6ff" /><stop offset="100%" stopColor="#2563eb" /></linearGradient><linearGradient id="devsecopsLoopRight" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#173fba" /><stop offset="100%" stopColor="#6faaff" /></linearGradient></defs><path d="M80 10 C108 10 130 18 130 18 C130 64 111 94 80 110 C49 94 30 64 30 18 C30 18 52 10 80 10 Z" fill="#edf4ff" stroke="url(#devsecopsBorder)" strokeWidth="4" /><path d="M80 18 C102 18 122 25 122 25 C122 61 107 86 80 101 C53 86 38 61 38 25 C38 25 58 18 80 18 Z" fill="none" stroke="#bad5ff" strokeWidth="1.5" strokeDasharray="3 4" /><path d="M80 63 C69 48 48 48 48 63 C48 77 67 78 80 63" fill="none" stroke="url(#devsecopsLoopLeft)" strokeWidth="9" strokeLinecap="round" /><path d="M80 63 C91 48 112 48 112 63 C112 77 93 78 80 63" fill="none" stroke="url(#devsecopsLoopRight)" strokeWidth="9" strokeLinecap="round" /><circle cx="80" cy="63" r="12" fill="#fff" stroke="#4d83ee" strokeWidth="2" /><path d="M76 60 A4 4 0 0 1 84 60 L83 69 A3 3 0 1 1 77 69 Z" fill="#2563eb" /><circle cx="80" cy="10" r="3" fill="#89bbff" /><circle cx="130" cy="18" r="3" fill="#89bbff" /><circle cx="30" cy="18" r="3" fill="#89bbff" /></svg>}</div><b>{hero.focusAreas[2] ?? "DevSecOps"}</b></div>
            <div style={{ "--focus-x": `${focusPositions[3]?.x ?? 6}%`, "--focus-y": `${focusPositions[3]?.y ?? 66}%` } as CSSProperties} className={`role-card network-card${activeFocusIndex === 3 ? " is-featured" : ""}`}><div className="role-art network-art">{hero.focusVisuals?.[3] ? <img className="role-custom-visual" src={hero.focusVisuals[3]} alt="Security and Networking focus visual" /> : <><i /><span /><span /><span /></>}</div><b>{hero.focusAreas[3] ?? "Security & Networking"}</b></div>
            <div className="focus-role-rail" role="tablist" aria-label="Select professional focus area">{hero.focusAreas.map((area, index) => <button type="button" role="tab" key={`${area}-${index}`} aria-selected={activeFocusIndex === index} className={activeFocusIndex === index ? "is-active" : ""} onClick={() => setActiveFocusIndex(index)}><span>0{index + 1}</span><b>{area}</b></button>)}</div>
          </div>
        </section>

        <section id="about" className="ref-section ref-about" style={sectionStyle("about")}>
          <SectionTitle eyebrow={content.about.eyebrow}><Multiline value={content.about.title} /></SectionTitle>
          <div className="about-ref-grid"><div><p><RichText value={content.about.paragraphs[0]} /></p><p><RichText value={content.about.paragraphs[1]} /></p></div><div><p><RichText value={content.about.paragraphs[2]} /></p><div className="hashtag-cloud">{content.about.tags.map((tag) => <span key={tag}><RichText value={tag} /></span>)}</div></div></div>
          <div className="ref-stats">{content.about.stats.map((stat) => <div key={`${stat.value}-${stat.label}`}><b><RichText value={stat.value} /></b><span><RichText value={stat.label} /></span></div>)}</div>
        </section>

        <section id="experience" className="ref-section ref-experience" style={sectionStyle("experience")}>
          <SectionTitle eyebrow={content.experienceSection.eyebrow}><Multiline value={content.experienceSection.title} /></SectionTitle><p className="section-intro"><RichText value={content.experienceSection.intro} /></p>
          <div className="reference-timeline">{content.experience.map((item, index) => { const details = item.details ?? []; const expanded = expandedExperienceIndex === index; return <article className={`reference-job${index === 0 ? " latest-job" : ""}${expanded ? " is-expanded" : ""}`} key={`${item.date}-${item.company}`}><span className="timeline-marker" aria-hidden="true" /><div className="job-date"><RichText value={item.date} /></div><div className="job-name experience-company-heading">{item.companyLogo && <img className="experience-company-logo" src={item.companyLogo} alt={`${item.company} logo`} />}<div><h3><RichText value={item.role} /></h3><p><RichText value={item.company} /></p></div></div><p className={`job-copy${expanded ? " is-hidden" : ""}`}><RichText value={item.text} /></p>{details.length > 0 && <button type="button" className="experience-detail-toggle" aria-expanded={expanded} aria-controls={`experience-details-${index}`} onClick={() => setExpandedExperienceIndex((current) => current === index ? null : index)}><span className="experience-detail-toggle-icon">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span><span>{expanded ? "Close details" : "See details"}</span></button>}<div className={`experience-details${expanded ? " is-expanded" : ""}`} id={`experience-details-${index}`} aria-hidden={!expanded}><div className="experience-details-inner"><ul>{details.map((detail, detailIndex) => <li key={`${detail}-${detailIndex}`}><RichText value={detail} /></li>)}</ul></div></div><div className="ref-tags experience-tag-list"><TagList items={item.tags} /></div></article>; })}</div>
        </section>

        <section id="skills" className="ref-section ref-skills" style={sectionStyle("skills")}><SectionTitle eyebrow={content.skillsSection.eyebrow}><Multiline value={content.skillsSection.title} /></SectionTitle><div className="skills-ref-grid">{content.skills.map((skill) => <article key={skill.heading}><h3><RichText value={skill.heading} /></h3><TagList items={skill.entries} /></article>)}</div></section>

        <section id="certifications" className="ref-section ref-certifications" style={sectionStyle("certifications")}><div className="cert-mosaic" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><SectionTitle eyebrow={content.credentialsSection.eyebrow}><Multiline value={content.credentialsSection.title} /></SectionTitle><p className="section-intro"><RichText value={content.credentialsSection.intro} /></p><div className="certifications-grid">{content.certifications.map((cert) => <article className={`credential-card${cert.pdf ? " has-pdf" : ""}`} key={cert.name}><div className="credential-card-top"><ProviderMark cert={cert} /><span><i /> Credential</span></div><h3><RichText value={cert.name} /></h3><p><RichText value={cert.issuer} /></p>{cert.pdf && <button type="button" className="certificate-view-action" onClick={() => setActiveCertificate(cert)}>View certificate <ArrowRight size={13} /></button>}<div className="credential-meta"><span><RichText value={cert.scope} /></span><time><RichText value={cert.issued} /></time>{cert.url && <a className="credential-link" href={cert.url} target="_blank" rel="noreferrer">Credential link <ArrowRight size={12} /></a>}</div></article>)}</div></section>

        <section id="capabilities" className="full-stack-ref" style={sectionStyle("capabilities")}><div className="full-stack-top"><p><RichText value={content.capabilities.eyebrow} /></p><h2><Multiline value={content.capabilities.title} /></h2><span><RichText value={content.capabilities.description} /></span></div><div className="service-grid">{content.capabilities.services.map((service, index) => <article key={service.name}><span>0{index + 1}</span><h3><RichText value={service.name} /></h3><p><RichText value={service.description} /></p></article>)}</div></section>

        <section id="projects" className="ref-section ref-projects" style={sectionStyle("projects")}><SectionTitle eyebrow={content.projectsSection.eyebrow}><Multiline value={content.projectsSection.title} /></SectionTitle><p className="section-intro"><RichText value={content.projectsSection.intro} /></p><div className="ref-project-list">{content.projects.map((project, index) => { const visibleBlocks = project.caseStudyBlocks ?? ["problem", "body", "realization"]; const imageFocus = project.imageFocus ?? { x: 50, y: 50 }; const imageZoom = Math.max(1, project.imageZoom ?? 1); return <article className={`ref-project${index % 2 === 1 ? " project-layout-reversed" : ""}`} key={project.title}><div className="project-thumb"><img src={project.image} alt={`${project.title} technical illustration`} style={{ objectPosition: `${imageFocus.x}% ${imageFocus.y}%`, transform:`scale(${imageZoom})`, transformOrigin:`${imageFocus.x}% ${imageFocus.y}%` }} /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="project-content"><div className="project-class"><span><RichText value={project.type} /></span><b><i /> <RichText value={project.state} /></b></div><h3><RichText value={project.title} /></h3><p className="project-byline"><RichText value={project.byline} /></p><div className="project-description">{visibleBlocks.includes("problem") && <div><strong><RichText value={content.projectsSection.problemLabel} /></strong><p><RichText value={project.problem} /></p></div>}{visibleBlocks.includes("body") && <div><strong><RichText value={content.projectsSection.descriptionLabel} /></strong><p><RichText value={project.body} /></p></div>}{visibleBlocks.includes("realization") && <div className="project-realization"><strong><RichText value={content.projectsSection.realizationLabel} /></strong><p><RichText value={project.realization} /></p></div>}</div><div className="project-meta"><div><strong><RichText value={content.projectsSection.techLabel} /></strong><TagList items={project.tech} /></div><div><strong><RichText value={content.projectsSection.deliveryLabel} /></strong><div className="delivery-row">{project.delivery.map((item) => <span key={item}><RichText value={item} /></span>)}</div></div></div></div></article>; })}</div></section>

        <section id="writing" className="ref-section ref-writing" style={sectionStyle("writing")}><SectionTitle eyebrow={content.writingSection.eyebrow}><Multiline value={content.writingSection.title} /></SectionTitle><p className="section-intro"><RichText value={content.writingSection.intro} /></p><div className="writing-grid">{content.writing.map((post) => <article className={`writing-card${post.body.length === 0 ? " future-writing" : ""}`} key={post.title}><div className="writing-card-main"><span className="writing-site-name"><RichText value={post.siteName ?? post.category} /></span><h3><RichText value={post.title} /></h3><time className="writing-post-date"><RichText value={post.date} /></time></div><div className="writing-card-meta"><span className="writing-category"><RichText value={post.category} /></span><small><RichText value={post.readTime} /></small>{post.url ? <a className="writing-read" href={post.url} target="_blank" rel="noreferrer" aria-label={`Open ${post.title}`}><ArrowRight size={16} /></a> : post.body.length > 0 ? <button type="button" className="writing-read" aria-label={`Read ${post.title}`} onClick={() => setActiveArticle(post)}><ArrowRight size={16} /></button> : <span className="writing-link-slot"><RichText value={post.status} /></span>}</div></article>)}</div></section>

        <section id="contact" className="ref-contact contact-card-refinement" style={sectionStyle("contact")}><div className="contact-ref-copy"><SectionTitle eyebrow={content.contact.eyebrow}><Multiline value={content.contact.title} /></SectionTitle><p><RichText value={content.contact.intro} /></p></div><aside className="contact-direct-card" aria-label="Direct contact details"><div className="contact-facts"><div><span>Email</span><a href={`mailto:${hero.email}`}><RichText value={hero.email} /></a></div><div><span>Phone</span><a href={`tel:${hero.phone.replaceAll(" ", "")}`}><RichText value={hero.phone} /></a></div><div><span>Based in</span><p><MapPin size={16} /> <RichText value={content.contact.location} /></p></div></div><div className="contact-direct-actions"><a href={hero.linkedInUrl} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a><a href={hero.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a></div></aside></section>{content.customSections?.map((section) => <section id={section.id} className="ref-section public-custom-section" style={sectionStyle(section.id)} key={section.id}><CustomSectionCanvas section={section} /></section>)}
      </main>
      <footer className="ref-footer"><div className="ref-brand"><span className="brand-name">fedi</span><span className="brand-node" /></div><p><RichText value={content.footer} /></p><div><a href={hero.linkedInUrl} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${hero.email}`}>Email</a><a href={`tel:${hero.phone.replaceAll(" ", "")}`}><RichText value={hero.phone} /></a></div></footer>
      {hasSection("contact") && <a className="floating-contact" href="#contact" aria-label={`Contact ${hero.firstName} ${hero.lastName}`}><ChevronDown size={16} /></a>}
      {activeCertificate?.pdf && <div className="certificate-viewer-overlay" role="dialog" aria-modal="true" aria-label={`${activeCertificate.name} certificate viewer`} onMouseDown={() => setActiveCertificate(null)}><div className="certificate-viewer" onMouseDown={(event) => event.stopPropagation()}><div className="certificate-viewer-head"><div><span>Credential viewer</span><h2>{activeCertificate.name}</h2></div><button type="button" onClick={() => setActiveCertificate(null)} aria-label="Close certificate viewer"><X size={19} /></button></div><object className="certificate-pdf-object" data={activeCertificate.pdf} type="application/pdf"><a href={activeCertificate.pdf} target="_blank" rel="noreferrer">Open certificate PDF</a></object></div></div>}
      {activeArticle && <div className="article-reader-overlay" role="dialog" aria-modal="true" aria-label={`${activeArticle.title} article`} onMouseDown={() => setActiveArticle(null)}><article className="article-reader" onMouseDown={(event) => event.stopPropagation()}><div className="article-reader-head"><span>{activeArticle.category}</span><button type="button" onClick={() => setActiveArticle(null)} aria-label="Close article"><X size={19} /></button></div><h2>{activeArticle.title}</h2><div className="article-reader-meta"><span>{hero.firstName} {hero.lastName.replace(".", "")}</span><i /> <span>{activeArticle.readTime}</span></div><div className="article-reader-copy">{activeArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article></div>}
    </div>
  );
}
