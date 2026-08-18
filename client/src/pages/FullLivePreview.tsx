import React from "react";
import type { PortfolioContent } from "@shared/portfolio";
import type { ContentPath } from "@/lib/editorContent";
import { Pencil } from "lucide-react";
import "./full-live-preview.css";

export type PreviewSection = "home" | "about" | "experience" | "skills" | "certifications" | "capabilities" | "projects" | "writing" | "contact" | "footer";

type Props = {
  content: PortfolioContent;
  activeSection: PreviewSection | null;
  activePath: string;
  onSection: (section: PreviewSection) => void;
  onChange: (path: ContentPath, value: string) => void;
  onSelect: (path: ContentPath) => void;
  onAddTag: () => void;
  onAddStat: () => void;
};

export function EditableText({ value, path, section, activeSection, activePath, onSection, onChange, onSelect, className = "" }: { value: string; path: ContentPath; section: PreviewSection; activeSection: PreviewSection | null; activePath: string; onSection: (section: PreviewSection) => void; onChange: (path: ContentPath, value: string) => void; onSelect: (path: ContentPath) => void; className?: string }) {
  const editable = activeSection === section;
  const selected = activePath === path.join(".");
  return <span
    className={`live-editable-text ${editable ? "is-editable" : ""} ${selected ? "is-selected" : ""} ${className}`}
    contentEditable={editable}
    suppressContentEditableWarning
    spellCheck={editable}
    role={editable ? "textbox" : undefined}
    tabIndex={editable ? 0 : -1}
    onClick={() => { if (!editable) onSection(section); onSelect(path); }}
    onFocus={() => onSelect(path)}
    onBlur={(event) => onChange(path, event.currentTarget.innerText)}
  >{value}</span>;
}

function SectionFrame({ id, label, activeSection, onSection, children }: { id: PreviewSection; label: string; activeSection: PreviewSection | null; onSection: (section: PreviewSection) => void; children: React.ReactNode }) {
  const active = activeSection === id;
  return <section className={`live-preview-section section-${id}${active ? " is-active" : ""}`}>
    <div className="live-section-hoverbar"><span>{label}</span><button type="button" onClick={() => onSection(id)}><Pencil size={13} /> {active ? "Editing section" : "Edit section"}</button></div>
    {children}
  </section>;
}

export default function FullLivePreview({ content, activeSection, activePath, onSection, onChange, onSelect, onAddTag, onAddStat }: Props) {
  const edit = (value: string, path: ContentPath, section: PreviewSection, className = "") => <EditableText value={value} path={path} section={section} activeSection={activeSection} activePath={activePath} onSection={onSection} onChange={onChange} onSelect={onSelect} className={className} />;
  return <div className="reference-portfolio live-public-canvas" aria-label="Full editable portfolio preview">
    <header className="ref-header live-public-header"><button type="button" className="ref-brand" onClick={() => onSection("home")} aria-label="Edit Home"><span className="brand-name">fedi</span><span className="brand-node" /></button><nav className="ref-nav" aria-label="Preview section navigation"><button type="button" onClick={() => onSection("home")}>{content.navigation.home}</button><button type="button" onClick={() => onSection("experience")}>{content.navigation.experience}</button><button type="button" onClick={() => onSection("skills")}>{content.navigation.skills}</button><button type="button" onClick={() => onSection("certifications")}>{content.navigation.certifications}</button><button type="button" onClick={() => onSection("projects")}>{content.navigation.projects}</button><button type="button" onClick={() => onSection("writing")}>{content.navigation.writing}</button><button type="button" onClick={() => onSection("about")}>{content.navigation.about}</button></nav><button type="button" className="talk-button" onClick={() => onSection("contact")}>{content.navigation.contact}</button></header>
    <div className="full-live-preview">
    <div className="full-live-preview-top"><span>Live draft preview · public desktop view</span><i /><small>Hover a section, select Edit section, then type directly in the matching public layout.</small></div>

    <SectionFrame id="home" label="Home" activeSection={activeSection} onSection={onSection}>
      <div className="live-home-grid"><div className="live-home-copy"><p>{edit(content.hero.hello, ["hero", "hello"], "home", "live-kicker")}</p><h1>{edit(content.hero.firstName, ["hero", "firstName"], "home")}<br />{edit(content.hero.lastName, ["hero", "lastName"], "home")}</h1><div className="live-hero-caption"><span>{edit(content.hero.role, ["hero", "role"], "home")}</span><i /><small>{edit(content.hero.location, ["hero", "location"], "home")}</small></div><p className="live-copy">{edit(content.hero.blurb, ["hero", "blurb"], "home")}</p><span className="live-contact-chip">{edit(content.hero.email, ["hero", "email"], "home")}</span></div><div className="live-home-visual"><i className="live-portrait-orbit" /><img src={content.hero.portraitUrl} alt="Portfolio portrait" /><div className="live-focus-grid">{content.hero.focusAreas.map((area, index) => <div key={`${area}-${index}`}>{edit(area, ["hero", "focusAreas", index], "home")}</div>)}</div></div></div>
    </SectionFrame>

    <SectionFrame id="about" label="About" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.about.eyebrow, ["about", "eyebrow"], "about")}</p><h2>{edit(content.about.title, ["about", "title"], "about")}</h2></div><div className="live-about-grid"><div>{content.about.paragraphs.slice(0, 2).map((paragraph, index) => <p key={index}>{edit(paragraph, ["about", "paragraphs", index], "about")}</p>)}</div><div><p>{edit(content.about.paragraphs[2] ?? "", ["about", "paragraphs", 2], "about")}</p><div className="live-tags">{content.about.tags.map((tag, index) => <span key={`${tag}-${index}`}>{edit(tag, ["about", "tags", index], "about")}</span>)}</div></div></div><div className="live-stats">{content.about.stats.map((stat, index) => <div key={index}><strong>{edit(stat.value, ["about", "stats", index, "value"], "about")}</strong><span>{edit(stat.label, ["about", "stats", index, "label"], "about")}</span></div>)}</div>
      <div className="live-about-actions" aria-label="About content controls">{activeSection === "about" && <><button type="button" onClick={onAddTag}>+ Add tag</button><button type="button" onClick={onAddStat}>+ Add statistic</button></>}</div>
    </SectionFrame>

    <SectionFrame id="experience" label="Experience" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.experienceSection.eyebrow, ["experienceSection", "eyebrow"], "experience")}</p><h2>{edit(content.experienceSection.title, ["experienceSection", "title"], "experience")}</h2><span>{edit(content.experienceSection.intro, ["experienceSection", "intro"], "experience")}</span></div><div className="live-timeline">{content.experience.map((item, index) => <article key={`${item.role}-${index}`}><small>{edit(item.date, ["experience", index, "date"], "experience")}</small><div><h3>{edit(item.role, ["experience", index, "role"], "experience")}</h3><p>{edit(item.company, ["experience", index, "company"], "experience")}</p><span>{edit(item.text, ["experience", index, "text"], "experience")}</span><div className="live-tags">{item.tags.map((tag, tagIndex) => <em key={`${tag}-${tagIndex}`}>{edit(tag, ["experience", index, "tags", tagIndex], "experience")}</em>)}</div></div></article>)}</div>
    </SectionFrame>

    <SectionFrame id="skills" label="Skills & Toolbox" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.skillsSection.eyebrow, ["skillsSection", "eyebrow"], "skills")}</p><h2>{edit(content.skillsSection.title, ["skillsSection", "title"], "skills")}</h2></div><div className="live-skill-grid">{content.skills.map((skill, index) => <article key={`${skill.heading}-${index}`}><h3>{edit(skill.heading, ["skills", index, "heading"], "skills")}</h3><div className="live-tags">{skill.entries.map((entry, entryIndex) => <span key={`${entry}-${entryIndex}`}>{edit(entry, ["skills", index, "entries", entryIndex], "skills")}</span>)}</div></article>)}</div>
    </SectionFrame>

    <SectionFrame id="certifications" label="Certifications" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.credentialsSection.eyebrow, ["credentialsSection", "eyebrow"], "certifications")}</p><h2>{edit(content.credentialsSection.title, ["credentialsSection", "title"], "certifications")}</h2><span>{edit(content.credentialsSection.intro, ["credentialsSection", "intro"], "certifications")}</span></div><div className="live-cert-grid">{content.certifications.map((cert, index) => <article key={`${cert.name}-${index}`}><small>{edit(cert.provider, ["certifications", index, "provider"], "certifications")}</small><h3>{edit(cert.name, ["certifications", index, "name"], "certifications")}</h3><p>{edit(cert.issuer, ["certifications", index, "issuer"], "certifications")}</p><span>{edit(cert.scope, ["certifications", index, "scope"], "certifications")}</span><time>{edit(cert.issued, ["certifications", index, "issued"], "certifications")}</time></article>)}</div>
    </SectionFrame>

    <SectionFrame id="capabilities" label="Capabilities" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.capabilities.eyebrow, ["capabilities", "eyebrow"], "capabilities")}</p><h2>{edit(content.capabilities.title, ["capabilities", "title"], "capabilities")}</h2><span>{edit(content.capabilities.description, ["capabilities", "description"], "capabilities")}</span></div><div className="live-service-grid">{content.capabilities.services.map((service, index) => <article key={`${service.name}-${index}`}><b>0{index + 1}</b><h3>{edit(service.name, ["capabilities", "services", index, "name"], "capabilities")}</h3><p>{edit(service.description, ["capabilities", "services", index, "description"], "capabilities")}</p></article>)}</div>
    </SectionFrame>

    <SectionFrame id="projects" label="Selected Work" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.projectsSection.eyebrow, ["projectsSection", "eyebrow"], "projects")}</p><h2>{edit(content.projectsSection.title, ["projectsSection", "title"], "projects")}</h2><span>{edit(content.projectsSection.intro, ["projectsSection", "intro"], "projects")}</span></div><div className="live-project-list">{content.projects.map((project, index) => <article key={`${project.title}-${index}`}><img src={project.image} alt="" /><div><small>{edit(project.type, ["projects", index, "type"], "projects")}</small><h3>{edit(project.title, ["projects", index, "title"], "projects")}</h3><p>{edit(project.byline, ["projects", index, "byline"], "projects")}</p><div className="live-project-copy"><span><b>{edit(content.projectsSection.problemLabel, ["projectsSection", "problemLabel"], "projects")}</b>{edit(project.problem, ["projects", index, "problem"], "projects")}</span><span><b>{edit(content.projectsSection.descriptionLabel, ["projectsSection", "descriptionLabel"], "projects")}</b>{edit(project.body, ["projects", index, "body"], "projects")}</span><span><b>{edit(content.projectsSection.realizationLabel, ["projectsSection", "realizationLabel"], "projects")}</b>{edit(project.realization, ["projects", index, "realization"], "projects")}</span></div></div></article>)}</div>
    </SectionFrame>

    <SectionFrame id="writing" label="Writing & Insights" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.writingSection.eyebrow, ["writingSection", "eyebrow"], "writing")}</p><h2>{edit(content.writingSection.title, ["writingSection", "title"], "writing")}</h2><span>{edit(content.writingSection.intro, ["writingSection", "intro"], "writing")}</span></div><div className="live-writing-list">{content.writing.map((post, index) => <article key={`${post.title}-${index}`}><small>{edit(post.date, ["writing", index, "date"], "writing")}</small><h3>{edit(post.title, ["writing", index, "title"], "writing")}</h3><p>{edit(post.preview, ["writing", index, "preview"], "writing")}</p><span>{edit(post.category, ["writing", index, "category"], "writing")} · {edit(post.readTime, ["writing", index, "readTime"], "writing")}</span></article>)}</div>
    </SectionFrame>

    <SectionFrame id="contact" label="Contact" activeSection={activeSection} onSection={onSection}>
      <div className="live-contact"><div className="live-heading"><p>{edit(content.contact.eyebrow, ["contact", "eyebrow"], "contact")}</p><h2>{edit(content.contact.title, ["contact", "title"], "contact")}</h2><span>{edit(content.contact.intro, ["contact", "intro"], "contact")}</span></div><div><p><b>Email</b>{edit(content.hero.email, ["hero", "email"], "contact")}</p><p><b>Phone</b>{edit(content.hero.phone, ["hero", "phone"], "contact")}</p><p><b>Based in</b>{edit(content.contact.location, ["contact", "location"], "contact")}</p><button type="button" className="live-contact-button">{edit(content.contact.submitLabel, ["contact", "submitLabel"], "contact")}</button></div></div>
    </SectionFrame>

    <SectionFrame id="footer" label="Footer" activeSection={activeSection} onSection={onSection}>
      <footer className="live-footer"><span>fedi</span><p>{edit(content.footer, ["footer"], "footer")}</p><small>{edit(content.hero.linkedInUrl, ["hero", "linkedInUrl"], "footer")}</small></footer>
    </SectionFrame>
    </div></div>;
}
