import React from "react";
import type { PortfolioContent } from "@shared/portfolio";
import type { ContentPath } from "@/lib/editorContent";
import { ImageUp, Pencil } from "lucide-react";
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
  onInsertExperience: (index: number, placement: "above" | "below") => void;
  onAddExperienceTag: (index: number) => void;
  onRemoveExperience: (index: number) => void;
  onRemoveExperienceTag?: (experienceIndex: number, tagIndex: number) => void;
  onUploadAsset: (file: File, category: "portrait" | "focus-visual", focusIndex?: number) => void;
  uploadingAsset: string | null;
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

function FocusVisual({ index, url }: { index: number; url?: string }) {
  if (url) return <img className="focus-replacement-visual" src={url} alt="Custom focus visual" />;
  if (index === 0) return <div className="focus-default-visual cloud-default"><i /><span /><span /><span /></div>;
  if (index === 1) return <div className="focus-default-visual"><svg viewBox="0 0 240 120" aria-hidden="true"><path d="M29 60 C55 22 89 22 120 60 C151 98 185 98 211 60 C185 22 151 22 120 60 C89 98 55 98 29 60" fill="none" stroke="#377cf5" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" /></svg></div>;
  if (index === 2) return <div className="focus-default-visual"><svg viewBox="0 0 160 120" aria-hidden="true"><path d="M80 10 C108 10 130 18 130 18 C130 64 111 94 80 110 C49 94 30 64 30 18 C30 18 52 10 80 10 Z" fill="#edf4ff" stroke="#397cf2" strokeWidth="4" /><path d="M80 63 C69 48 48 48 48 63 C48 77 67 78 80 63 M80 63 C91 48 112 48 112 63 C112 77 93 78 80 63" fill="none" stroke="#397cf2" strokeWidth="9" strokeLinecap="round" /><path d="M76 60 A4 4 0 0 1 84 60 L83 69 A3 3 0 1 1 77 69 Z" fill="#397cf2" /></svg></div>;
  return <div className="focus-default-visual network-default"><i /><span /><span /><span /></div>;
}

export default function FullLivePreview({ content, activeSection, activePath, onSection, onChange, onSelect, onAddTag, onAddStat, onInsertExperience, onAddExperienceTag, onRemoveExperience, onRemoveExperienceTag, onUploadAsset, uploadingAsset }: Props) {
  const edit = (value: string, path: ContentPath, section: PreviewSection, className = "") => <EditableText value={value} path={path} section={section} activeSection={activeSection} activePath={activePath} onSection={onSection} onChange={onChange} onSelect={onSelect} className={className} />;
  return <div className="reference-portfolio live-public-canvas" aria-label="Full editable portfolio preview">
    <header className="ref-header live-public-header"><button type="button" className="ref-brand" onClick={() => onSection("home")} aria-label="Edit Home"><span className="brand-name">fedi</span><span className="brand-node" /></button><nav className="ref-nav" aria-label="Preview section navigation"><button type="button" onClick={() => onSection("home")}>{content.navigation.home}</button><button type="button" onClick={() => onSection("experience")}>{content.navigation.experience}</button><button type="button" onClick={() => onSection("skills")}>{content.navigation.skills}</button><button type="button" onClick={() => onSection("certifications")}>{content.navigation.certifications}</button><button type="button" onClick={() => onSection("projects")}>{content.navigation.projects}</button><button type="button" onClick={() => onSection("writing")}>{content.navigation.writing}</button><button type="button" onClick={() => onSection("about")}>{content.navigation.about}</button></nav><button type="button" className="talk-button" onClick={() => onSection("contact")}>{content.navigation.contact}</button></header>
    <div className="full-live-preview">
    <div className="full-live-preview-top"><span>Live draft preview · public desktop view</span><i /><small>Hover a section, select Edit section, then type directly in the matching public layout.</small></div>

    <SectionFrame id="home" label="Home" activeSection={activeSection} onSection={onSection}>
      <div className="live-home-grid"><div className="live-home-copy"><p>{edit(content.hero.hello, ["hero", "hello"], "home", "live-kicker")}</p><h1>{edit(content.hero.firstName, ["hero", "firstName"], "home")}<br />{edit(content.hero.lastName, ["hero", "lastName"], "home")}</h1><div className="live-hero-caption"><span>{edit(content.hero.role, ["hero", "role"], "home")}</span><i /><small>{edit(content.hero.location, ["hero", "location"], "home")}</small></div><p className="live-copy">{edit(content.hero.blurb, ["hero", "blurb"], "home")}</p><span className="live-contact-chip">{edit(content.hero.email, ["hero", "email"], "home")}</span></div><div className="live-home-visual"><i className="live-portrait-orbit" /><img src={content.hero.portraitUrl} alt="Portfolio portrait" />{activeSection === "home" && <label className="home-asset-upload portrait-asset-upload"><ImageUp size={15} /> {uploadingAsset === "portrait" ? "Uploading…" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" disabled={uploadingAsset !== null} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) onUploadAsset(file, "portrait"); event.currentTarget.value = ""; }} /></label>}<div className="live-focus-grid">{content.hero.focusAreas.map((area, index) => <div className={`live-focus-card focus-card-${index}`} key={`${area}-${index}`}><FocusVisual index={index} url={content.hero.focusVisuals?.[index]} />{activeSection === "home" && <label className="home-asset-upload focus-asset-upload"><ImageUp size={12} /> {uploadingAsset === `focus-${index}` ? "Uploading…" : "Replace SVG / image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" disabled={uploadingAsset !== null} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) onUploadAsset(file, "focus-visual", index); event.currentTarget.value = ""; }} /></label>}<b>{edit(area, ["hero", "focusAreas", index], "home")}</b></div>)}</div></div></div>
    </SectionFrame>

    <SectionFrame id="about" label="About" activeSection={activeSection} onSection={onSection}>
      <div className="live-heading"><p>{edit(content.about.eyebrow, ["about", "eyebrow"], "about")}</p><h2>{edit(content.about.title, ["about", "title"], "about")}</h2></div><div className="live-about-grid"><div>{content.about.paragraphs.slice(0, 2).map((paragraph, index) => <p key={index}>{edit(paragraph, ["about", "paragraphs", index], "about")}</p>)}</div><div><p>{edit(content.about.paragraphs[2] ?? "", ["about", "paragraphs", 2], "about")}</p><div className="live-tags">{content.about.tags.map((tag, index) => <span key={`${tag}-${index}`}>{edit(tag, ["about", "tags", index], "about")}</span>)}</div></div></div><div className="live-stats">{content.about.stats.map((stat, index) => <div key={index}><strong>{edit(stat.value, ["about", "stats", index, "value"], "about")}</strong><span>{edit(stat.label, ["about", "stats", index, "label"], "about")}</span></div>)}</div>
      <div className="live-about-actions" aria-label="About content controls">{activeSection === "about" && <><button type="button" onClick={onAddTag}>+ Add tag</button><button type="button" onClick={onAddStat}>+ Add statistic</button></>}</div>
    </SectionFrame>

    <SectionFrame id="experience" label="Experience" activeSection={activeSection} onSection={onSection}>
      <div className="ref-section-title"><span>{edit(content.experienceSection.eyebrow, ["experienceSection", "eyebrow"], "experience")}</span><h2>{edit(content.experienceSection.title, ["experienceSection", "title"], "experience", "experience-title-edit")}</h2></div><p className="section-intro experience-intro-edit">{edit(content.experienceSection.intro, ["experienceSection", "intro"], "experience")}</p><div className="reference-timeline experience-editor-timeline">{content.experience.map((item, index) => <article className={`reference-job${index === 0 ? " latest-job" : ""}`} key={`${item.role}-${index}`}><span className="timeline-marker" aria-hidden="true" /><div className="job-date">{edit(item.date, ["experience", index, "date"], "experience")}</div><div className="job-name"><h3>{edit(item.role, ["experience", index, "role"], "experience")}</h3><p>{edit(item.company, ["experience", index, "company"], "experience")}</p></div><p className="job-copy">{edit(item.text, ["experience", index, "text"], "experience")}</p><div className="ref-tags experience-tag-list">{item.tags.map((tag, tagIndex) => <div className="experience-tag-control" key={`${tag}-${tagIndex}`}>{edit(tag, ["experience", index, "tags", tagIndex], "experience")}{activeSection === "experience" && <button type="button" className="experience-tag-delete" aria-label={`Delete tag ${tag}`} onClick={() => onRemoveExperienceTag?.(index, tagIndex)}>×</button>}</div>)}</div>{activeSection === "experience" && <div className="experience-editor-actions" aria-label={`Experience ${index + 1} controls`}><button type="button" onClick={() => onInsertExperience(index, "above")}>+ Add above</button><button type="button" onClick={() => onInsertExperience(index, "below")}>+ Add below</button><button type="button" onClick={() => onAddExperienceTag(index)}>+ Add tag</button><button type="button" className="experience-delete-button" onClick={() => onRemoveExperience(index)} disabled={content.experience.length <= 1}>Delete experience</button></div>}</article>)}</div>
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
