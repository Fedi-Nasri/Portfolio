import { trpc } from "@/lib/trpc";
import type { PortfolioContent } from "@shared/portfolio";
import { toast } from "sonner";
import { Bold, ChevronDown, Italic, Loader2, Palette, Save, Type, Underline, Upload, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type PathSegment = string | number;
type SelectionState = { path: PathSegment[]; start: number; end: number } | null;

function pathKey(path: PathSegment[]) {
  return path.join(".");
}

function displayLabel(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readAtPath(source: unknown, path: PathSegment[]): unknown {
  return path.reduce<unknown>((current, segment) => {
    if (current && typeof current === "object") return (current as Record<string, unknown>)[String(segment)];
    return undefined;
  }, source);
}

function updateAtPath(source: PortfolioContent, path: PathSegment[], value: unknown): PortfolioContent {
  const copy = structuredClone(source) as Record<string, unknown>;
  let target: Record<string, unknown> | unknown[] = copy;
  path.slice(0, -1).forEach((segment) => {
    target = target[segment as never] as Record<string, unknown> | unknown[];
  });
  target[path[path.length - 1] as never] = value as never;
  return copy as PortfolioContent;
}

function OutlineButton({ icon: Icon, label, onClick, disabled = false }: { icon: typeof Bold; label: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className="editor-tool-button" aria-label={label} title={label} onClick={onClick} disabled={disabled}><Icon size={15} /></button>;
}

function ContentTree({ value, path, activePath, onChange, onSelect }: { value: unknown; path: PathSegment[]; activePath: string; onChange: (path: PathSegment[], value: unknown) => void; onSelect: (path: PathSegment[], start: number, end: number) => void }) {
  if (typeof value === "string") {
    const selected = pathKey(path) === activePath;
    return <label className={`editor-text-field${selected ? " is-selected" : ""}`}><span>{displayLabel(String(path[path.length - 1]))}</span><textarea value={value} rows={value.length > 120 ? 5 : 2} onFocus={(event) => onSelect(path, event.currentTarget.selectionStart, event.currentTarget.selectionEnd)} onSelect={(event) => onSelect(path, event.currentTarget.selectionStart, event.currentTarget.selectionEnd)} onChange={(event) => onChange(path, event.target.value)} /></label>;
  }
  if (typeof value === "boolean") {
    return <label className="editor-boolean-field"><input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} /><span>{displayLabel(String(path[path.length - 1]))}</span></label>;
  }
  if (Array.isArray(value)) {
    return <section className="editor-tree-group"><h3>{displayLabel(String(path[path.length - 1]))}</h3>{value.map((item, index) => <div className="editor-array-item" key={`${pathKey(path)}-${index}`}><span className="editor-array-index">{String(index + 1).padStart(2, "0")}</span><ContentTree value={item} path={[...path, index]} activePath={activePath} onChange={onChange} onSelect={onSelect} /></div>)}</section>;
  }
  if (value && typeof value === "object") {
    return <section className="editor-tree-group"><h3>{path.length === 0 ? "Portfolio content" : displayLabel(String(path[path.length - 1]))}</h3>{Object.entries(value as Record<string, unknown>).map(([key, child]) => <ContentTree key={key} value={child} path={[...path, key]} activePath={activePath} onChange={onChange} onSelect={onSelect} />)}</section>;
  }
  return null;
}

function EditorPreview({ content, activePath, onSelect }: { content: PortfolioContent; activePath: string; onSelect: (path: PathSegment[]) => void }) {
  const previewText = (label: string, path: PathSegment[], value: string, className = "") => <button type="button" aria-label={`Edit ${label}`} onClick={() => onSelect(path)} className={`editor-preview-text ${className}${activePath === pathKey(path) ? " is-selected" : ""}`}>{value.replaceAll("\n", " ")}</button>;
  return <div className="editor-preview" aria-label="Editable portfolio preview">
    <div className="editor-preview-top"><span>Live draft preview</span><i /><small>Click any highlighted content to edit</small></div>
    <section className="editor-preview-hero"><div><p>{previewText("Hero greeting", ["hero", "hello"], content.hero.hello)}</p><h1>{previewText("First name", ["hero", "firstName"], content.hero.firstName)}<br />{previewText("Last name", ["hero", "lastName"], content.hero.lastName)}</h1><p>{previewText("Role", ["hero", "role"], content.hero.role)}</p><p>{previewText("Introduction", ["hero", "blurb"], content.hero.blurb)}</p></div><div className="editor-preview-orbit"><span>{content.hero.focusAreas[0]}</span><span>{content.hero.focusAreas[1]}</span><span>{content.hero.focusAreas[2]}</span><span>{content.hero.focusAreas[3]}</span></div></section>
    <section className="editor-preview-section"><p className="editor-preview-eyebrow">{previewText("About eyebrow", ["about", "eyebrow"], content.about.eyebrow)}</p><h2>{previewText("About title", ["about", "title"], content.about.title)}</h2><p>{previewText("About paragraph", ["about", "paragraphs", 0], content.about.paragraphs[0])}</p></section>
    <section className="editor-preview-section editor-preview-projects"><p className="editor-preview-eyebrow">{previewText("Projects eyebrow", ["projectsSection", "eyebrow"], content.projectsSection.eyebrow)}</p><h2>{previewText("Projects title", ["projectsSection", "title"], content.projectsSection.title)}</h2>{content.projects.map((project, index) => <button type="button" key={project.title} onClick={() => onSelect(["projects", index, "title"])} className={`editor-preview-project${activePath === pathKey(["projects", index, "title"]) ? " is-selected" : ""}`}><img src={project.image} alt="" /><span><small>{project.type}</small><strong>{project.title}</strong><em>{project.realization}</em></span></button>)}</section>
  </div>;
}

function EditWorkspace() {
  const editorQuery = trpc.portfolio.editorContent.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const utils = trpc.useUtils();
  const [draft, setDraft] = useState<PortfolioContent | null>(null);
  const [selection, setSelection] = useState<SelectionState>(null);
  const [activePath, setActivePath] = useState("hero.blurb");
  const [publishOpen, setPublishOpen] = useState(false);
  const saveDraft = trpc.portfolio.saveDraft.useMutation({ onSuccess: () => { toast.success("Draft saved"); utils.portfolio.editorContent.invalidate(); } });
  const publish = trpc.portfolio.publish.useMutation({ onSuccess: () => { toast.success("Portfolio published"); setPublishOpen(false); utils.portfolio.publicContent.invalidate(); utils.portfolio.editorContent.invalidate(); } });

  useEffect(() => {
    if (editorQuery.data?.content) setDraft(editorQuery.data.content);
  }, [editorQuery.data]);

  const contentChanged = useMemo(() => Boolean(draft && editorQuery.data && JSON.stringify(draft) !== JSON.stringify(editorQuery.data.content)), [draft, editorQuery.data]);
  const handleChange = (path: PathSegment[], value: unknown) => { if (draft) setDraft(updateAtPath(draft, path, value)); };
  const selectPath = (path: PathSegment[], start = 0, end = 0) => { setActivePath(pathKey(path)); setSelection(start !== end ? { path, start, end } : null); };
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
  if (editorQuery.error) return <div className="editor-state"><h1>Editor unavailable</h1><p>Refresh the page to retry loading the portfolio content.</p><a href="/">Return to the portfolio</a></div>;

  return <div className="editor-shell">
    <header className="editor-topbar"><div><span>Fedi Nasri · direct workspace</span><h1>Portfolio editor</h1></div><div className="editor-topbar-actions"><a className="editor-back-link" href="/">View public site</a><span className={`editor-save-state${contentChanged ? " has-changes" : ""}`}>{contentChanged ? "Unsaved changes" : "Saved draft"}</span><button type="button" className="editor-button secondary" onClick={() => saveDraft.mutate({ content: draft })} disabled={saveDraft.isPending}><Save size={15} /> Save draft</button><button type="button" className="editor-button" onClick={() => setPublishOpen(true)} disabled={publish.isPending}><Upload size={15} /> Publish</button></div></header>
    <div className="editor-workspace"><aside className="editor-inspector"><div className="editor-inspector-heading"><div><span>Content inspector</span><h2>Edit every text field</h2></div><Wand2 size={18} /></div><p>Click in the preview or use these fields. Select words in a text field to reveal formatting controls.</p><div className="editor-tree"><ContentTree value={draft} path={[]} activePath={activePath} onChange={handleChange} onSelect={selectPath} /></div></aside><main className="editor-canvas"><EditorPreview content={draft} activePath={activePath} onSelect={(path) => selectPath(path)} /></main></div>
    {selection && <div className="editor-floating-tools" role="toolbar" aria-label="Selected text formatting"><span><Type size={15} /> Text tools</span><OutlineButton icon={Bold} label="Bold selected text" onClick={() => applyFormat("bold")} /><OutlineButton icon={Italic} label="Italic selected text" onClick={() => applyFormat("italic")} /><OutlineButton icon={Underline} label="Underline selected text" onClick={() => applyFormat("underline")} /><OutlineButton icon={ChevronDown} label="Smaller text token" onClick={() => applyFormat("small")} /><OutlineButton icon={Palette} label="Lead text token" onClick={() => applyFormat("lead")} /><button type="button" onClick={() => applyFormat("clear")}>Clear</button></div>}
    {publishOpen && <div className="editor-confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm portfolio publish"><div><span>Publish portfolio</span><h2>Make this draft live?</h2><p>Your public portfolio will start using this content immediately. The current published version is kept in version history.</p><footer><button type="button" className="editor-button secondary" onClick={() => setPublishOpen(false)}>Cancel</button><button type="button" className="editor-button" onClick={() => publish.mutate({ content: draft })} disabled={publish.isPending}>{publish.isPending ? "Publishing…" : "Publish changes"}</button></footer></div></div>}
  </div>;
}

export default function EditPortfolio() {
  return <EditWorkspace />;
}
