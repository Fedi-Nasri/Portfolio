import { trpc } from "@/lib/trpc";
import "./edit-extensions.css";
import { addPortfolioSection, addProjectCaseStudyBlock as addProjectCaseStudyBlockToDraft, appendAboutStat, appendAboutTag, appendCertificate, appendCustomPortfolioSection, appendExperienceDetail as appendExperienceDetailToDraft, appendExperienceTag, appendProjectDelivery, appendProjectTech, appendSkillTool, appendSkillToolbox, appendWritingArticle, duplicateListItem, getPortfolioSectionOrder, insertExperienceTemplate, insertProjectTemplate, moveListItem, movePortfolioSection, readAtPath, removeAboutStat as removeAboutStatAtIndex, removeAboutTag as removeAboutTagAtIndex, removeCertificate, removeExperienceDetail as removeExperienceDetailFromDraft, removeExperienceTag as removeExperienceTagAtIndex, removeListItem, removePortfolioSection, removeProject as removeProjectFromDraft, removeProjectCaseStudyBlock as removeProjectCaseStudyBlockFromDraft, removeProjectDelivery, removeProjectTech, removeSkillTool, removeSkillToolbox, removeWritingArticle, reorderExperienceDetail as reorderExperienceDetailInDraft, togglePortfolioSectionVisibility, updateAtPath, type ContentPath, type ProjectCaseStudyBlock } from "@/lib/editorContent";
import { createDefaultFocusPositions, hydrateExperienceDetails, type PortfolioContent, type PortfolioSectionId } from "@shared/portfolio";
import FullLivePreview, { type PreviewSection } from "./FullLivePreview";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Bold, ChevronDown, Copy, FolderPlus, History, Italic, LayoutTemplate, Loader2, Palette, RotateCcw, Save, Trash2, Type, Underline, Upload, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PathSegment = ContentPath[number];
type SelectionState = { path: ContentPath; start: number; end: number } | null;

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function pathKey(path: PathSegment[]) {
  return path.join(".");
}

function displayLabel(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function OutlineButton({ icon: Icon, label, onClick, disabled = false }: { icon: typeof Bold; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className="editor-tool-button" aria-label={label} title={label} onClick={onClick} disabled={disabled}><Icon size={15} /></button>;
}

function ContentTree({ value, path, activePath, onChange, onSelect, onDuplicate, onMove, onRemove }: { value: unknown; path: PathSegment[]; activePath: string; onChange: (path: PathSegment[], value: unknown) => void; onSelect: (path: PathSegment[], start: number, end: number) => void; onDuplicate: (path: PathSegment[], index: number) => void; onMove: (path: PathSegment[], index: number, direction: -1 | 1) => void; onRemove: (path: PathSegment[], index: number) => void }) {
  if (typeof value === "string") {
    const selected = pathKey(path) === activePath;
    const fieldName = String(path[path.length - 1]);
    const imageField = fieldName === "image" || fieldName === "portraitUrl" || fieldName === "previewImage";
    return <label className={`editor-text-field${selected ? " is-selected" : ""}${imageField ? " editor-image-field" : ""}`}><span>{imageField ? "Image URL" : displayLabel(fieldName)}</span>{imageField && value && <img src={value} alt="Current portfolio asset preview" />}<textarea value={value} rows={imageField ? 2 : value.length > 120 ? 5 : 2} onFocus={(event) => onSelect(path, event.currentTarget.selectionStart, event.currentTarget.selectionEnd)} onSelect={(event) => onSelect(path, event.currentTarget.selectionStart, event.currentTarget.selectionEnd)} onChange={(event) => onChange(path, event.target.value)} /></label>;
  }
  if (typeof value === "boolean") {
    return <label className="editor-boolean-field"><input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} /><span>{displayLabel(String(path[path.length - 1]))}</span></label>;
  }
  if (Array.isArray(value)) {
    return <section className="editor-tree-group"><h3>{displayLabel(String(path[path.length - 1]))}<small>{value.length} items</small></h3>{value.map((item, index) => <div className="editor-array-item" key={`${pathKey(path)}-${index}`}><span className="editor-array-index">{String(index + 1).padStart(2, "0")}</span><div className="editor-array-controls" aria-label={`${displayLabel(String(path[path.length - 1]))} item controls`}><button type="button" aria-label="Move item up" title="Move up" disabled={index === 0} onClick={() => onMove(path, index, -1)}><ArrowUp size={13} /></button><button type="button" aria-label="Move item down" title="Move down" disabled={index === value.length - 1} onClick={() => onMove(path, index, 1)}><ArrowDown size={13} /></button><button type="button" aria-label="Duplicate item" title="Duplicate" onClick={() => onDuplicate(path, index)}><Copy size={13} /></button><button type="button" aria-label="Remove item" title="Remove" disabled={value.length <= 1} onClick={() => onRemove(path, index)}><Trash2 size={13} /></button></div><ContentTree value={item} path={[...path, index]} activePath={activePath} onChange={onChange} onSelect={onSelect} onDuplicate={onDuplicate} onMove={onMove} onRemove={onRemove} /></div>)}</section>;
  }
  if (value && typeof value === "object") {
    return <section className="editor-tree-group"><h3>{path.length === 0 ? "Portfolio content" : displayLabel(String(path[path.length - 1]))}</h3>{Object.entries(value as Record<string, unknown>).map(([key, child]) => <ContentTree key={key} value={child} path={[...path, key]} activePath={activePath} onChange={onChange} onSelect={onSelect} onDuplicate={onDuplicate} onMove={onMove} onRemove={onRemove} />)}</section>;
  }
  return null;
}

function EditorPreview({ content, activePath, onSelect }: { content: PortfolioContent; activePath: string; onSelect: (path: PathSegment[]) => void }) {
  const previewText = (label: string, path: PathSegment[], value: string, className = "") => <button type="button" aria-label={`Edit ${label}`} onClick={() => onSelect(path)} className={`editor-preview-text ${className}${activePath === pathKey(path) ? " is-selected" : ""}`}>{value.replaceAll("\n", " ")}</button>;
  return <div className="editor-preview" aria-label="Editable portfolio preview">
    <div className="editor-preview-top"><span>Live draft preview</span><i /><small>Click any highlighted content to edit</small></div>
    <section className="editor-preview-hero"><div><p>{previewText("Hero greeting", ["hero", "hello"], content.hero.hello)}</p><h1>{previewText("First name", ["hero", "firstName"], content.hero.firstName)}<br />{previewText("Last name", ["hero", "lastName"], content.hero.lastName)}</h1><p>{previewText("Role", ["hero", "role"], content.hero.role)}</p><p>{previewText("Introduction", ["hero", "blurb"], content.hero.blurb)}</p></div><div className="editor-preview-orbit">{content.hero.focusAreas.map((area, index) => <button type="button" key={area} onClick={() => onSelect(["hero", "focusAreas", index])} className={activePath === pathKey(["hero", "focusAreas", index]) ? "is-selected" : ""}>{area}</button>)}</div></section>
    <section className="editor-preview-section"><p className="editor-preview-eyebrow">{previewText("About eyebrow", ["about", "eyebrow"], content.about.eyebrow)}</p><h2>{previewText("About title", ["about", "title"], content.about.title)}</h2><p>{previewText("About paragraph", ["about", "paragraphs", 0], content.about.paragraphs[0])}</p></section>
    <section className="editor-preview-section"><p className="editor-preview-eyebrow">{previewText("Experience eyebrow", ["experienceSection", "eyebrow"], content.experienceSection.eyebrow)}</p><h2>{previewText("Experience title", ["experienceSection", "title"], content.experienceSection.title)}</h2><div className="editor-preview-list">{content.experience.map((item, index) => <button type="button" key={`${item.role}-${index}`} onClick={() => onSelect(["experience", index, "role"])} className={activePath === pathKey(["experience", index, "role"]) ? "is-selected" : ""}><small>{item.date}</small><strong>{item.role}</strong><span>{item.company}</span></button>)}</div></section>
    <section className="editor-preview-section editor-preview-projects"><p className="editor-preview-eyebrow">{previewText("Projects eyebrow", ["projectsSection", "eyebrow"], content.projectsSection.eyebrow)}</p><h2>{previewText("Projects title", ["projectsSection", "title"], content.projectsSection.title)}</h2>{content.projects.map((project, index) => <button type="button" key={project.title} onClick={() => onSelect(["projects", index, "title"])} className={`editor-preview-project${activePath === pathKey(["projects", index, "title"]) ? " is-selected" : ""}`}><img src={project.image} alt="" /><span><small>{project.type}</small><strong>{project.title}</strong><em>{project.realization}</em></span></button>)}</section>
    <section className="editor-preview-section"><p className="editor-preview-eyebrow">{previewText("Writing eyebrow", ["writingSection", "eyebrow"], content.writingSection.eyebrow)}</p><h2>{previewText("Writing title", ["writingSection", "title"], content.writingSection.title)}</h2><div className="editor-preview-list">{content.writing.map((post, index) => <button type="button" key={`${post.title}-${index}`} onClick={() => onSelect(["writing", index, "title"])} className={activePath === pathKey(["writing", index, "title"]) ? "is-selected" : ""}><small>{post.date}</small><strong>{post.title}</strong><span>{post.category}</span></button>)}</div></section>
  </div>;
}

function EditWorkspace() {
  const [activeDraftKey, setActiveDraftKey] = useState<string | undefined>(undefined);
  const [loadedVersionNumber, setLoadedVersionNumber] = useState<number | null>(null);
  const editorQuery = trpc.portfolio.editorContent.useQuery(activeDraftKey ? { draftKey: activeDraftKey } : undefined, { retry: false, refetchOnWindowFocus: false });
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState<PortfolioContent | null>(null);
  const [selection, setSelection] = useState<SelectionState>(null);
  const [activePath, setActivePath] = useState("");
  const [activeSection, setActiveSection] = useState<PreviewSection | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);
  const saveDraft = trpc.portfolio.saveDraft.useMutation({ onSuccess: (saved) => { setLoadedVersionNumber(saved.versionNumber); toast.success(`Draft saved as version ${saved.versionNumber}`); utils.portfolio.editorContent.invalidate(); } });
  const publish = trpc.portfolio.publish.useMutation({ onSuccess: () => { toast.success("Selected draft is now public"); setPublishOpen(false); utils.portfolio.publicContent.invalidate(); utils.portfolio.editorContent.invalidate(); } });
  const createDraft = trpc.portfolio.createDraft.useMutation({ onSuccess: (workspace) => { setActiveDraftKey(workspace.activeDraftKey); setLoadedVersionNumber(workspace.activeVersionNumber); setDraft(hydrateExperienceDetails(workspace.content)); toast.success("New draft created from the current draft"); utils.portfolio.editorContent.invalidate(); } });
  const renameDraft = trpc.portfolio.renameDraft.useMutation({ onSuccess: () => { toast.success("Draft name updated"); utils.portfolio.editorContent.invalidate(); } });
  const deleteDraft = trpc.portfolio.deleteDraft.useMutation({ onSuccess: () => { setActiveDraftKey(undefined); setLoadedVersionNumber(null); toast.success("Draft deleted"); utils.portfolio.editorContent.invalidate(); } });
  const selectPublicDraft = trpc.portfolio.selectPublicDraft.useMutation({ onSuccess: () => { toast.success("Selected draft will be shown publicly"); utils.portfolio.publicContent.invalidate(); utils.portfolio.editorContent.invalidate(); } });
  const loadDraftVersion = trpc.portfolio.loadDraftVersion.useMutation({ onSuccess: (version) => { setDraft(hydrateExperienceDetails(version.content)); setLoadedVersionNumber(version.versionNumber); toast.success(`Loaded version ${version.versionNumber} into the editor`); } });
  const uploadAsset = trpc.assets.upload.useMutation();

  useEffect(() => {
    if (!editorQuery.data?.content) return;
    setDraft(hydrateExperienceDetails(editorQuery.data.content));
    setActiveDraftKey(editorQuery.data.activeDraftKey);
    setLoadedVersionNumber(editorQuery.data.activeVersionNumber);
  }, [editorQuery.data]);

  const contentChanged = useMemo(() => Boolean(draft && editorQuery.data && JSON.stringify(draft) !== JSON.stringify(hydrateExperienceDetails(editorQuery.data.content))), [draft, editorQuery.data]);
  const handleChange = (path: PathSegment[], value: unknown) => { if (draft) setDraft(updateAtPath(draft, path, value)); };
  const duplicateItem = (path: PathSegment[], index: number) => { if (draft) setDraft(duplicateListItem(draft, path, index)); toast.success("Item duplicated in this draft"); };
  const moveItem = (path: PathSegment[], index: number, direction: -1 | 1) => { if (draft) setDraft(moveListItem(draft, path, index, direction)); };
  const removeItem = (path: PathSegment[], index: number) => { if (draft) setDraft(removeListItem(draft, path, index)); toast.message("Item removed from this draft. Reset to undo it."); };
  const addAboutTag = () => { if (!draft) return; setDraft(appendAboutTag(draft)); setActiveSection("about"); toast.success("New editable tag added"); };
  const addAboutStat = () => { if (!draft) return; setDraft(appendAboutStat(draft)); setActiveSection("about"); toast.success("New editable statistic added"); };
  const deleteAboutTag = (index: number) => { if (!draft) return; setDraft(removeAboutTagAtIndex(draft, index)); setActiveSection("about"); setActivePath(""); toast.message("About tag removed from this draft. Reset to undo it."); };
  const deleteAboutStat = (index: number) => { if (!draft) return; setDraft(removeAboutStatAtIndex(draft, index)); setActiveSection("about"); setActivePath(""); toast.message("Statistic removed from this draft. Reset to undo it."); };
  const insertExperience = (index: number, placement: "above" | "below") => { if (!draft) return; const insertionIndex = placement === "above" ? index : index + 1; setDraft(insertExperienceTemplate(draft, index, placement)); setActiveSection("experience"); setActivePath(`experience.${insertionIndex}.role`); toast.success("Editable experience template added"); };
  const addExperienceTag = (index: number) => { if (!draft) return; const tagIndex = draft.experience[index]?.tags.length ?? 0; setDraft(appendExperienceTag(draft, index)); setActiveSection("experience"); setActivePath(`experience.${index}.tags.${tagIndex}`); toast.success("New editable experience tag added"); };
  const addExperienceDetail = (index: number) => { if (!draft) return; const detailIndex = draft.experience[index]?.details?.length ?? 0; setDraft(appendExperienceDetailToDraft(draft, index)); setActiveSection("experience"); setActivePath(`experience.${index}.details.${detailIndex}`); toast.success("New editable experience detail added"); };
  const removeExperience = (index: number) => { if (!draft) return; if (draft.experience.length <= 1) { toast.message("Keep at least one experience entry in the timeline."); return; } setDraft(removeListItem(draft, ["experience"], index)); setActiveSection("experience"); setActivePath(""); toast.message("Experience removed from this draft. Reset to undo it."); };
  const removeExperienceTag = (experienceIndex: number, tagIndex: number) => { if (!draft) return; setDraft(removeExperienceTagAtIndex(draft, experienceIndex, tagIndex)); setActiveSection("experience"); setActivePath(""); toast.message("Tag removed from this draft. Reset to undo it."); };
  const removeExperienceDetail = (experienceIndex: number, detailIndex: number) => { if (!draft) return; setDraft(removeExperienceDetailFromDraft(draft, experienceIndex, detailIndex)); setActiveSection("experience"); setActivePath(""); toast.message("Experience detail removed from this draft. Reset to undo it."); };
  const reorderExperienceDetail = (experienceIndex: number, fromIndex: number, toIndex: number) => { if (!draft) return; setDraft(reorderExperienceDetailInDraft(draft, experienceIndex, fromIndex, toIndex)); setActiveSection("experience"); setActivePath(`experience.${experienceIndex}.details.${toIndex}`); };
  const addSkillToolbox = () => { if (!draft) return; const index = draft.skills.length; setDraft(appendSkillToolbox(draft)); setActiveSection("skills"); setActivePath(`skills.${index}.heading`); toast.success("New editable toolbox added"); };
  const addSkillTool = (toolboxIndex: number) => { if (!draft) return; const toolIndex = draft.skills[toolboxIndex]?.entries.length ?? 0; setDraft(appendSkillTool(draft, toolboxIndex)); setActiveSection("skills"); setActivePath(`skills.${toolboxIndex}.entries.${toolIndex}`); toast.success("New editable tool added"); };
  const deleteSkillTool = (toolboxIndex: number, toolIndex: number) => { if (!draft) return; setDraft(removeSkillTool(draft, toolboxIndex, toolIndex)); setActiveSection("skills"); setActivePath(""); toast.message("Tool removed from this draft. Reset to undo it."); };
  const deleteSkillToolbox = (toolboxIndex: number) => { if (!draft) return; if (draft.skills.length <= 1) { toast.message("Keep at least one toolbox category."); return; } setDraft(removeSkillToolbox(draft, toolboxIndex)); setActiveSection("skills"); setActivePath(""); toast.message("Toolbox removed from this draft. Reset to undo it."); };
  const insertProject = (index: number, placement: "above" | "below") => { if (!draft) return; const insertionIndex = placement === "above" ? index : index + 1; setDraft(insertProjectTemplate(draft, index, placement)); setActiveSection("projects"); setActivePath(`projects.${insertionIndex}.title`); toast.success("Editable project template added"); };
  const addProject = () => { if (!draft) return; insertProject(draft.projects.length - 1, "below"); };
  const moveProject = (index: number, direction: -1 | 1) => { if (!draft) return; setDraft(moveListItem(draft, ["projects"], index, direction)); setActiveSection("projects"); setActivePath(`projects.${Math.max(0, Math.min(draft.projects.length - 1, index + direction))}.title`); };
  const deleteProject = (index: number) => { if (!draft) return; if (draft.projects.length <= 1) { toast.message("Keep at least one Selected Work project."); return; } setDraft(removeProjectFromDraft(draft, index)); setActiveSection("projects"); setActivePath(""); toast.message("Project removed from this draft. Reset to undo it."); };
  const addProjectTech = (projectIndex: number) => { if (!draft) return; const techIndex = draft.projects[projectIndex]?.tech.length ?? 0; setDraft(appendProjectTech(draft, projectIndex)); setActiveSection("projects"); setActivePath(`projects.${projectIndex}.tech.${techIndex}`); toast.success("New editable tech item added"); };
  const deleteProjectTech = (projectIndex: number, techIndex: number) => { if (!draft) return; setDraft(removeProjectTech(draft, projectIndex, techIndex)); setActiveSection("projects"); setActivePath(""); toast.message("Tech item removed from this draft. Reset to undo it."); };
  const addProjectDelivery = (projectIndex: number) => { if (!draft) return; const deliveryIndex = draft.projects[projectIndex]?.delivery.length ?? 0; setDraft(appendProjectDelivery(draft, projectIndex)); setActiveSection("projects"); setActivePath(`projects.${projectIndex}.delivery.${deliveryIndex}`); toast.success("New editable delivery item added"); };
  const deleteProjectDelivery = (projectIndex: number, deliveryIndex: number) => { if (!draft) return; setDraft(removeProjectDelivery(draft, projectIndex, deliveryIndex)); setActiveSection("projects"); setActivePath(""); toast.message("Delivery item removed from this draft. Reset to undo it."); };
  const addProjectCaseStudyBlock = (projectIndex: number, block: ProjectCaseStudyBlock) => { if (!draft) return; setDraft(addProjectCaseStudyBlockToDraft(draft, projectIndex, block)); setActiveSection("projects"); setActivePath(`projects.${projectIndex}.${block}`); toast.success("Case-study block added"); };
  const deleteProjectCaseStudyBlock = (projectIndex: number, block: ProjectCaseStudyBlock) => { if (!draft) return; setDraft(removeProjectCaseStudyBlockFromDraft(draft, projectIndex, block)); setActiveSection("projects"); setActivePath(""); toast.message("Case-study block removed from this draft. Reset to undo it."); };
  const addCertificate = () => { if (!draft) return; const certificateIndex = draft.certifications.length; setDraft(appendCertificate(draft)); setActiveSection("certifications"); setActivePath(`certifications.${certificateIndex}.name`); toast.success("Editable certificate template added"); };
  const deleteCertificate = (certificateIndex: number) => { if (!draft) return; if (draft.certifications.length <= 1) { toast.message("Keep at least one certificate."); return; } setDraft(removeCertificate(draft, certificateIndex)); setActiveSection("certifications"); setActivePath(""); toast.message("Certificate removed from this draft. Reset to undo it."); };
  const handleAssetUpload = async (file: File, category: "portrait" | "focus-visual", focusIndex?: number) => {
    if (!draft) return;
    const target = category === "portrait" ? "portrait" : `focus-${focusIndex}`;
    try {
      setUploadingAsset(target);
      const uploaded = await uploadAsset.mutateAsync({ fileName: file.name, contentType: file.type, base64: await fileToBase64(file), category });
      if (category === "portrait") setDraft(updateAtPath(draft, ["hero", "portraitUrl"], uploaded.url));
      else if (typeof focusIndex === "number") setDraft(updateAtPath(draft, ["hero", "focusVisuals", focusIndex], uploaded.url));
      toast.success(category === "portrait" ? "Portrait uploaded to this draft" : "Focus visual uploaded to this draft");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed. Try another image.");
    } finally {
      setUploadingAsset(null);
    }
  };
  const handleProjectImageUpload = async (file: File, projectIndex: number) => {
    if (!draft) return;
    try {
      setUploadingAsset(`project-${projectIndex}`);
      const uploaded = await uploadAsset.mutateAsync({ fileName: file.name, contentType: file.type, base64: await fileToBase64(file), category: "project-image" });
      setDraft(updateAtPath(draft, ["projects", projectIndex, "image"], uploaded.url));
      toast.success("Project image uploaded to this draft");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed. Try another image.");
    } finally {
      setUploadingAsset(null);
    }
  };
  const handleExperienceLogoUpload = async (file: File, experienceIndex: number) => {
    if (!draft) return;
    try {
      setUploadingAsset(`experience-logo-${experienceIndex}`);
      const uploaded = await uploadAsset.mutateAsync({ fileName: file.name, contentType: file.type, base64: await fileToBase64(file), category: "company-logo" });
      setDraft(updateAtPath(draft, ["experience", experienceIndex, "companyLogo"], uploaded.url));
      toast.success("Company logo uploaded to this draft");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logo upload failed. Try another image.");
    } finally {
      setUploadingAsset(null);
    }
  };
  const clearExperienceLogo = (experienceIndex: number) => { if (!draft) return; setDraft(updateAtPath(draft, ["experience", experienceIndex, "companyLogo"], undefined)); setActiveSection("experience"); toast.message("Company logo removed from this draft. Reset to undo it."); };
  const handleCertificatePdfUpload = async (file: File, certificateIndex: number) => {
    if (!draft) return;
    try {
      setUploadingAsset(`certificate-pdf-${certificateIndex}`);
      const uploaded = await uploadAsset.mutateAsync({ fileName: file.name, contentType: file.type, base64: await fileToBase64(file), category: "certificate-pdf" });
      setDraft(updateAtPath(draft, ["certifications", certificateIndex, "pdf"], uploaded.url));
      toast.success("Certificate PDF uploaded to this draft");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF upload failed. Try another PDF.");
    } finally {
      setUploadingAsset(null);
    }
  };
  const handleProviderLogoUpload = async (file: File, certificateIndex: number) => {
    if (!draft) return;
    try {
      setUploadingAsset(`provider-logo-${certificateIndex}`);
      const uploaded = await uploadAsset.mutateAsync({ fileName: file.name, contentType: file.type, base64: await fileToBase64(file), category: "provider-logo" });
      setDraft(updateAtPath(draft, ["certifications", certificateIndex, "providerLogo"], uploaded.url));
      toast.success("Provider logo uploaded to this draft");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logo upload failed. Try another image.");
    } finally {
      setUploadingAsset(null);
    }
  };
  const removeCertificatePdf = (certificateIndex: number) => { if (!draft) return; setDraft(updateAtPath(draft, ["certifications", certificateIndex, "pdf"], undefined)); setActiveSection("certifications"); toast.message("Certificate PDF removed from this draft. Reset to undo it."); };
  const clearCertificateLink = (certificateIndex: number) => { if (!draft) return; setDraft(updateAtPath(draft, ["certifications", certificateIndex, "url"], "")); setActiveSection("certifications"); toast.message("Certificate link cleared from this draft. Reset to undo it."); };
  const addWritingArticle = () => { if (!draft) return; const articleIndex = draft.writing.length; setDraft(appendWritingArticle(draft)); setActiveSection("writing"); setActivePath(`writing.${articleIndex}.title`); toast.success("Editable featured article added"); };
  const deleteWritingArticle = (articleIndex: number) => { if (!draft) return; if (draft.writing.length <= 1) { toast.message("Keep at least one Writing & Insights article."); return; } setDraft(removeWritingArticle(draft, articleIndex)); setActiveSection("writing"); setActivePath(""); toast.message("Article removed from this draft. Reset to undo it."); };
  const moveWritingArticle = (articleIndex: number, direction: -1 | 1) => { if (!draft) return; setDraft(moveListItem(draft, ["writing"], articleIndex, direction)); setActiveSection("writing"); setActivePath(`writing.${Math.max(0, Math.min(draft.writing.length - 1, articleIndex + direction))}.title`); };
  const clearWritingLink = (articleIndex: number) => { if (!draft) return; setDraft(updateAtPath(draft, ["writing", articleIndex, "url"], "")); setActiveSection("writing"); toast.message("Article link cleared from this draft. Reset to undo it."); };
  const resetFocusPositions = () => { if (!draft) return; setDraft(updateAtPath(draft, ["hero", "focusPositions"], createDefaultFocusPositions())); setActiveSection("home"); setActivePath(""); toast.success("Home focus-card layout reset"); };
  const addSection = (sectionId: PortfolioSectionId) => { if (!draft) return; setDraft(addPortfolioSection(draft, sectionId)); toast.success(`${displayLabel(sectionId)} section added to this draft`); };
  const addCustomSection = () => { if (!draft) return; const next = appendCustomPortfolioSection(draft); setDraft(next); setActiveSection("custom"); setActivePath(`customSections.${(next.customSections?.length ?? 1) - 1}.title`); toast.success("New editable section template added"); };
  const moveSection = (sectionId: string, direction: -1 | 1) => { if (!draft) return; const before = getPortfolioSectionOrder(draft); const next = movePortfolioSection(draft, sectionId, direction); if (next === draft) { toast.message("Home stays at the top of the portfolio."); return; } setDraft(next); toast.success("Section order updated in this draft"); };
  const deleteSection = (sectionId: string) => { if (!draft) return; if (sectionId === "home") { toast.message("Keep Home as the opening portfolio section."); return; } setDraft(removePortfolioSection(draft, sectionId)); if (activeSection === sectionId) setActiveSection(null); toast.message("Section removed from this draft. Reset to undo it."); };
  const toggleSectionVisibility = (sectionId: string) => { if (!draft) return; const willShow = draft.hiddenSections?.includes(sectionId); setDraft(togglePortfolioSectionVisibility(draft, sectionId)); toast.success(willShow ? "Section restored to the public portfolio" : "Section hidden from the public portfolio"); };
  const resetToSaved = () => { if (!editorQuery.data?.content) return; setDraft(hydrateExperienceDetails(editorQuery.data.content)); setSelection(null); toast.success("Draft reset to the last saved version"); };
  const createNewDraft = () => { const name = `Draft ${(editorQuery.data?.drafts.length ?? 0) + 1}`; createDraft.mutate({ name, sourceDraftKey: activeDraftKey }); };
  const requestRenameDraft = () => { if (!editorQuery.data) return; const name = window.prompt("Draft name", editorQuery.data.activeDraftName); if (name?.trim()) renameDraft.mutate({ draftKey: editorQuery.data.activeDraftKey, name }); };
  const requestDeleteDraft = () => { if (!editorQuery.data) return; if (window.confirm(`Delete “${editorQuery.data.activeDraftName}” and all of its versions?`)) deleteDraft.mutate({ draftKey: editorQuery.data.activeDraftKey }); };
  const selectPath = (path: PathSegment[], start = 0, end = 0) => { setActivePath(pathKey(path)); setSelection(start !== end ? { path, start, end } : null); };
  const selectPreviewPath = (path: ContentPath) => selectPath(path);
  const applyFormat = (kind: "bold" | "italic" | "underline" | "small" | "lead" | "clear") => {
    if (!draft || !selection || selection.start === selection.end) { toast.message("Select text inside a field first."); return; }
    const current = readAtPath(draft, selection.path);
    if (typeof current !== "string") return;
    const selected = current.slice(selection.start, selection.end);
    const token = kind === "bold" ? `**${selected}**` : kind === "italic" ? `_${selected}_` : kind === "underline" ? `__${selected}__` : kind === "small" ? `[[size:small]]${selected}[[/size]]` : kind === "lead" ? `[[size:lead]]${selected}[[/size]]` : selected.replace(/\*\*|__|_|\[\[size:(small|lead)\]\]|\[\[\/size\]\]/g, "");
    handleChange(selection.path, `${current.slice(0, selection.start)}${token}${current.slice(selection.end)}`);
    toast.success("Formatting applied to the draft");
  };

  if (editorQuery.isLoading || !draft) return <div className="editor-state"><Loader2 className="animate-spin" size={22} /> Preparing your editor…</div>;
  if (editorQuery.error || !editorQuery.data) return <div className="editor-state"><h1>Editor unavailable</h1><p>Refresh the page to retry loading the portfolio content.</p><a href="/">Return to the portfolio</a></div>;
  const workspace = editorQuery.data;
  const activeDraftSummary = workspace.drafts.find((item) => item.key === workspace.activeDraftKey);

  return <div className="editor-shell">
    <header className="editor-topbar"><div><span>Fedi Nasri · direct workspace</span><h1>Portfolio editor</h1></div><div className="editor-topbar-actions"><a className="editor-back-link" href="/">View public site</a><span className={`editor-save-state${contentChanged ? " has-changes" : ""}`}>{contentChanged ? "Unsaved changes" : `Draft v${loadedVersionNumber ?? workspace.activeVersionNumber}`}</span>{contentChanged && <button type="button" className="editor-reset" onClick={resetToSaved}><RotateCcw size={14} /> Reset</button>}<button type="button" className="editor-button secondary" onClick={() => saveDraft.mutate({ content: draft, draftKey: activeDraftKey })} disabled={saveDraft.isPending}><Save size={15} /> Save version</button><button type="button" className="editor-button" onClick={() => setPublishOpen(true)} disabled={publish.isPending}><Upload size={15} /> Publish</button></div></header>
    <div className="editor-workspace inspector-free multi-draft-workspace"><aside className="draft-sidebar" aria-label="Portfolio drafts"><div className="draft-sidebar-head"><div><span>Draft library</span><h2>{workspace.activeDraftName}</h2></div><button type="button" className="draft-create" onClick={createNewDraft} disabled={createDraft.isPending}><FolderPlus size={15} /> New draft</button></div><div className="draft-list">{workspace.drafts.map((item) => <article className={`draft-list-item${item.key === workspace.activeDraftKey ? " is-active" : ""}`} key={item.key}><button type="button" className="draft-load" onClick={() => setActiveDraftKey(item.key)}><span><b>{item.name}</b><small>v{item.latestVersion} · {item.versionCount} version{item.versionCount === 1 ? "" : "s"}</small></span>{item.isPublic && <i>Public</i>}</button></article>)}</div><div className="draft-sidebar-actions"><button type="button" onClick={requestRenameDraft} disabled={renameDraft.isPending}><LayoutTemplate size={14} /> Rename draft</button><button type="button" onClick={() => selectPublicDraft.mutate({ draftKey: workspace.activeDraftKey })} disabled={activeDraftSummary?.isPublic || selectPublicDraft.isPending}><Upload size={14} /> {activeDraftSummary?.isPublic ? "Public draft" : "Set as public"}</button><button type="button" className="draft-delete" onClick={requestDeleteDraft} disabled={activeDraftSummary?.isPublic || deleteDraft.isPending}><Trash2 size={14} /> Delete draft</button></div><div className="draft-version-history"><div><History size={14} /><span>Version history</span></div>{workspace.versions.map((version) => <button type="button" key={version.number} className={loadedVersionNumber === version.number ? "is-loaded" : ""} onClick={() => loadDraftVersion.mutate({ draftKey: workspace.activeDraftKey, versionNumber: version.number })}>Version {version.number}<small>{new Date(version.createdAt).toLocaleString()}</small></button>)}</div></aside><main className="editor-canvas full-preview-canvas"><FullLivePreview content={draft} activeSection={activeSection} activePath={activePath} onSection={setActiveSection} onChange={handleChange} onSelect={selectPreviewPath} onAddTag={addAboutTag} onAddStat={addAboutStat} onRemoveAboutTag={deleteAboutTag} onRemoveAboutStat={deleteAboutStat} onInsertExperience={insertExperience} onAddExperienceTag={addExperienceTag} onRemoveExperience={removeExperience} onRemoveExperienceTag={removeExperienceTag} onAddExperienceDetail={addExperienceDetail} onRemoveExperienceDetail={removeExperienceDetail} onMoveExperienceDetail={reorderExperienceDetail} onUploadExperienceLogo={handleExperienceLogoUpload} onClearExperienceLogo={clearExperienceLogo} onAddSkillToolbox={addSkillToolbox} onAddSkillTool={addSkillTool} onRemoveSkillTool={deleteSkillTool} onRemoveSkillToolbox={deleteSkillToolbox} onAddCertificate={addCertificate} onRemoveCertificate={deleteCertificate} onUploadCertificatePdf={handleCertificatePdfUpload} onUploadProviderLogo={handleProviderLogoUpload} onRemoveCertificatePdf={removeCertificatePdf} onClearCertificateLink={clearCertificateLink} onAddProject={addProject} onInsertProject={insertProject} onMoveProject={moveProject} onRemoveProject={deleteProject} onAddProjectTech={addProjectTech} onRemoveProjectTech={deleteProjectTech} onAddProjectDelivery={addProjectDelivery} onRemoveProjectDelivery={deleteProjectDelivery} onAddProjectCaseStudyBlock={addProjectCaseStudyBlock} onRemoveProjectCaseStudyBlock={deleteProjectCaseStudyBlock} onUploadProjectImage={handleProjectImageUpload} onAddWritingArticle={addWritingArticle} onRemoveWritingArticle={deleteWritingArticle} onMoveWritingArticle={moveWritingArticle} onClearWritingLink={clearWritingLink} onAddSection={addSection} onAddCustomSection={addCustomSection} onMoveSection={moveSection} onRemoveSection={deleteSection} onToggleSectionVisibility={toggleSectionVisibility} onResetFocusPositions={resetFocusPositions} onUploadAsset={handleAssetUpload} uploadingAsset={uploadingAsset} /></main></div>
    {selection && <div className="editor-floating-tools" role="toolbar" aria-label="Selected text formatting"><span><Type size={15} /> Text tools</span><OutlineButton icon={Bold} label="Bold selected text" onClick={() => applyFormat("bold")} /><OutlineButton icon={Italic} label="Italic selected text" onClick={() => applyFormat("italic")} /><OutlineButton icon={Underline} label="Underline selected text" onClick={() => applyFormat("underline")} /><OutlineButton icon={ChevronDown} label="Smaller text token" onClick={() => applyFormat("small")} /><OutlineButton icon={Palette} label="Lead text token" onClick={() => applyFormat("lead")} /><button type="button" onClick={() => applyFormat("clear")}>Clear</button></div>}
    {publishOpen && <div className="editor-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm portfolio publish"><div><span>Publish portfolio</span><h2>Make this draft live?</h2><p>Version {loadedVersionNumber ?? workspace.activeVersionNumber} of “{workspace.activeDraftName}” will become the public portfolio. Other drafts and version history stay available in the draft library.</p><footer><button type="button" className="editor-button secondary" onClick={() => setPublishOpen(false)}>Cancel</button><button type="button" className="editor-button" onClick={() => publish.mutate({ content: draft, draftKey: activeDraftKey })} disabled={publish.isPending}>{publish.isPending ? "Publishing…" : "Publish changes"}</button></footer></div></div>}
  </div>;
}

export default function EditPortfolio() {
  return <EditWorkspace />;
}
