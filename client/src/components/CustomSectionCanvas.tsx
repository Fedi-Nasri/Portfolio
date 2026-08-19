import { Copy, GripVertical, Image, Link, Maximize2, PanelRightClose, PanelRightOpen, Plus, SquareArrowOutUpRight, Trash2, Type, UserRound, Workflow } from "lucide-react";
import React, { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { getCustomSectionCanvasComponents, type CanvasComponentType, type CustomPortfolioSection, type CustomSectionCanvasComponent } from "@shared/portfolio";
import "./custom-section-canvas.css";

type Props = {
  section: CustomPortfolioSection;
  editable?: boolean;
  onComponentsChange?: (components: CustomSectionCanvasComponent[]) => void;
};

type Guides = { vertical?: number; horizontal?: number; labels: string[] };
const GRID_SIZE = 8;
const EXAMPLE_IMAGE = "/manus-storage/fedi-project-autonomous-boat_69519cd9.jpg";

function defaultComponent(sectionId: string, type: CanvasComponentType, count: number) {
  const y = Math.min(300, 52 + count * 32);
  const base = {
    id: `${sectionId}-${type}-${Date.now()}`,
    type,
    x: 48 + (count % 3) * 18,
    y,
  };
  if (type === "title") return { ...base, content: "New title", width: 420, height: 88 };
  if (type === "text") return { ...base, content: "Add a text block with context, a key result, or a call to action.", width: 460, height: 112 };
  if (type === "image") return { ...base, content: "Portfolio image", imageUrl: EXAMPLE_IMAGE, width: 300, height: 200 };
  if (type === "button") return { ...base, content: "Explore the work", href: "#projects", width: 190, height: 52 };
  if (type === "tag-list") return { ...base, content: "Toolbox", items: ["Cloud", "DevOps", "Networking"], width: 420, height: 104 };
  if (type === "stat") return { ...base, content: "04", items: ["Infrastructure projects"], width: 205, height: 130 };
  return { ...base, content: "Direct contact", items: ["fedinasri.fsb@gmail.com", "+216 95730139", "Tunis, Tunisia"], width: 350, height: 185 };
}

function snap(value: number) { return Math.round(value / GRID_SIZE) * GRID_SIZE; }
function componentLabel(type: CanvasComponentType) { return ({ title: "Title box", text: "Text box", image: "Image", button: "Action button", "tag-list": "Tool tags", stat: "Statistic card", "contact-card": "Contact card" } satisfies Record<CanvasComponentType, string>)[type]; }

export function CustomSectionCanvas({ section, editable = false, onComponentsChange }: Props) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [guides, setGuides] = useState<Guides>({ labels: [] });
  const components = getCustomSectionCanvasComponents(section);
  const selected = components.find((component) => component.id === selectedId) ?? null;
  const canvasHeight = Math.max(360, section.canvasHeight ?? 420);

  const updateComponents = (next: typeof components) => onComponentsChange?.(next);
  const selectComponent = (component: typeof components[number]) => setSelectedId(component.id);
  const patchSelected = (patch: Partial<CustomSectionCanvasComponent>) => { if (selected) updateComponents(components.map((component) => component.id === selected.id ? { ...component, ...patch } : component)); };
  const duplicateSelected = () => { if (!selected) return; const copy = { ...selected, id: `${section.id}-${selected.type}-${Date.now()}-copy`, x: selected.x + 24, y: selected.y + 24 }; updateComponents([...components, copy]); setSelectedId(copy.id); };
  const deleteSelected = () => { if (!selected) return; updateComponents(components.filter((component) => component.id !== selected.id)); setSelectedId(null); setGuides({ labels: [] }); };
  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>, componentId: string) => {
    if (!editable || !canvasRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const canvas = canvasRef.current;
    const component = components.find((candidate) => candidate.id === componentId);
    if (!component) return;
    const rect = canvas.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    setSelectedId(componentId);
    const move = (moveEvent: PointerEvent) => {
      let nextX = snap(Math.max(0, Math.min(rect.width - component.width, component.x + moveEvent.clientX - startX)));
      let nextY = snap(Math.max(0, Math.min(rect.height - component.height, component.y + moveEvent.clientY - startY)));
      const labels = ["8px grid"];
      const centerX = (rect.width - component.width) / 2;
      const centerY = (rect.height - component.height) / 2;
      let vertical: number | undefined;
      let horizontal: number | undefined;
      if (Math.abs(nextX - centerX) <= GRID_SIZE) { nextX = snap(centerX); vertical = rect.width / 2; labels.push("canvas centre"); }
      if (Math.abs(nextY - centerY) <= GRID_SIZE) { nextY = snap(centerY); horizontal = rect.height / 2; labels.push("canvas middle"); }
      components.filter((candidate) => candidate.id !== componentId).forEach((candidate) => {
        const candidateCenterX = candidate.x + candidate.width / 2;
        const candidateCenterY = candidate.y + candidate.height / 2;
        if (Math.abs(nextX - candidate.x) <= GRID_SIZE) { nextX = candidate.x; vertical = candidate.x; labels.push("left aligned"); }
        else if (Math.abs(nextX + component.width - (candidate.x + candidate.width)) <= GRID_SIZE) { nextX = candidate.x + candidate.width - component.width; vertical = candidate.x + candidate.width; labels.push("right aligned"); }
        else if (Math.abs(nextX + component.width / 2 - candidateCenterX) <= GRID_SIZE) { nextX = candidateCenterX - component.width / 2; vertical = candidateCenterX; labels.push("centre aligned"); }
        if (Math.abs(nextY - candidate.y) <= GRID_SIZE) { nextY = candidate.y; horizontal = candidate.y; labels.push("top aligned"); }
        else if (Math.abs(nextY + component.height - (candidate.y + candidate.height)) <= GRID_SIZE) { nextY = candidate.y + candidate.height - component.height; horizontal = candidate.y + candidate.height; labels.push("bottom aligned"); }
        else if (Math.abs(nextY + component.height / 2 - candidateCenterY) <= GRID_SIZE) { nextY = candidateCenterY - component.height / 2; horizontal = candidateCenterY; labels.push("middle aligned"); }
      });
      nextX = Math.round(Math.max(0, Math.min(rect.width - component.width, nextX)));
      nextY = Math.round(Math.max(0, Math.min(rect.height - component.height, nextY)));
      setGuides({ vertical, horizontal, labels: Array.from(new Set(labels)) });
      updateComponents(components.map((candidate) => candidate.id === componentId ? { ...candidate, x: nextX, y: nextY } : candidate));
    };
    const end = () => { setGuides({ labels: [] }); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  const beginResize = (event: ReactPointerEvent<HTMLButtonElement>, componentId: string) => {
    if (!editable || !canvasRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const canvas = canvasRef.current;
    const component = components.find((candidate) => candidate.id === componentId);
    if (!component) return;
    const rect = canvas.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const minimumWidth = component.type === "title" ? 180 : component.type === "button" ? 120 : 150;
    const minimumHeight = component.type === "title" ? 58 : component.type === "button" ? 40 : 70;
    setSelectedId(componentId);
    const move = (moveEvent: PointerEvent) => {
      const width = snap(Math.max(minimumWidth, Math.min(rect.width - component.x, component.width + moveEvent.clientX - startX)));
      const height = snap(Math.max(minimumHeight, Math.min(rect.height - component.y, component.height + moveEvent.clientY - startY)));
      updateComponents(components.map((candidate) => candidate.id === componentId ? { ...candidate, width, height } : candidate));
    };
    const end = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  const addComponent = (type: CanvasComponentType) => {
    const component = defaultComponent(section.id, type, components.length);
    updateComponents([...components, component]);
    setSelectedId(component.id);
  };

  const renderBlock = (component: CustomSectionCanvasComponent) => {
    const content = component.content;
    if (component.type === "image") return component.imageUrl ? <img src={component.imageUrl} alt={content || "Custom portfolio visual"} /> : <div className="canvas-image-empty"><Image size={24} /> Add image URL</div>;
    if (component.type === "button") return editable ? <span className="canvas-button-block">{content || "Action button"}<SquareArrowOutUpRight size={14} /></span> : <a className="canvas-button-block" href={component.href || "#"}>{content || "Action button"}<SquareArrowOutUpRight size={14} /></a>;
    if (component.type === "tag-list") return <><b className="canvas-block-kicker">{content}</b><div className="canvas-tag-list">{(component.items ?? []).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></>;
    if (component.type === "stat") return <><b className="canvas-stat-value">{content}</b><span className="canvas-stat-label">{component.items?.[0] ?? "Statistic"}</span></>;
    if (component.type === "contact-card") return <><b className="canvas-contact-title">{content}</b><div className="canvas-contact-items">{(component.items ?? []).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></>;
    return <div className="canvas-component-content" contentEditable={editable} suppressContentEditableWarning spellCheck={editable} role={editable ? "textbox" : undefined} aria-label={`${component.type === "title" ? "Title" : "Text"} box`} onFocus={() => editable && selectComponent(component)} onBlur={(event) => { if (editable) updateComponents(components.map((candidate) => candidate.id === component.id ? { ...candidate, content: event.currentTarget.innerText } : candidate)); }}>{content}</div>;
  };

  return <div className={`custom-section-canvas-builder${editable ? " is-editing" : ""}`}>
    <div className="custom-section-canvas-toolbar"><div><span>{section.eyebrow}</span><b>{editable ? "Canvas section editor" : "Custom portfolio section"}</b></div>{editable && <button type="button" className="canvas-palette-toggle" onClick={() => setPaletteOpen((open) => !open)}>{paletteOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />} {paletteOpen ? "Hide components" : "Add components"}</button>}</div>
    <div className={`custom-section-canvas-workspace${editable && paletteOpen ? " with-palette" : ""}`}>
      <div ref={canvasRef} className="custom-section-canvas" style={{ height: `${canvasHeight}px` }} onPointerDown={() => { if (editable) { setSelectedId(null); setGuides({ labels: [] }); } }}>
        <div className="canvas-grid-label">Canvas · 1 px grid</div>
        {guides.vertical !== undefined && <i className="canvas-alignment-guide is-vertical" style={{ left: guides.vertical }} />}{guides.horizontal !== undefined && <i className="canvas-alignment-guide is-horizontal" style={{ top: guides.horizontal }} />}
        {guides.labels.length > 0 && <div className="canvas-guide-label">Snap: {guides.labels.join(" · ")}</div>}
        {selected && editable && <div className="canvas-measurement" aria-live="polite">X {selected.x}px · Y {selected.y}px · {selected.width} × {selected.height}px</div>}
        {components.map((component) => {
          const isSelected = editable && selectedId === component.id;
          return <article key={component.id} className={`canvas-component canvas-component-${component.type}${isSelected ? " is-selected" : ""}`} style={{ left: component.x, top: component.y, width: component.width, height: component.height }} onClick={(event) => { event.stopPropagation(); if (editable) selectComponent(component); }}>
            {editable && <button type="button" className="canvas-drag-handle" aria-label={`Drag ${component.type} box`} title="Drag to reposition" onPointerDown={(event) => beginDrag(event, component.id)}><GripVertical size={15} /></button>}
            {renderBlock(component)}
            {isSelected && <><div className="canvas-block-actions"><button type="button" aria-label={`Duplicate ${componentLabel(component.type)}`} title="Duplicate block" onClick={duplicateSelected}><Copy size={12} /></button><button type="button" aria-label={`Delete ${componentLabel(component.type)}`} title="Delete block" onClick={deleteSelected}><Trash2 size={12} /></button></div><button type="button" className="canvas-resize-handle" aria-label={`Resize ${component.type} box`} title="Drag to resize" onPointerDown={(event) => beginResize(event, component.id)}><Maximize2 size={13} /></button></>}
          </article>;
        })}
      </div>
      {editable && <aside className="canvas-component-palette" aria-label="Canvas component library"><span>Component library</span><h3>Add reusable blocks</h3><p>Start with title and text, or reuse visual patterns from the portfolio’s hero, toolbox, statistics, and contact areas.</p><div className="canvas-palette-group"><b>Content</b><button type="button" onClick={() => addComponent("title")}><Type size={15} /><span><b>Title box</b><small>Section heading</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("text")}><Type size={15} /><span><b>Text box</b><small>Paragraph or note</small></span><Plus size={14} /></button></div><div className="canvas-palette-group"><b>Media & action</b><button type="button" onClick={() => addComponent("image")}><Image size={15} /><span><b>Image block</b><small>Visual with editable URL</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("button")}><Link size={15} /><span><b>Action button</b><small>Portfolio call to action</small></span><Plus size={14} /></button></div><div className="canvas-palette-group"><b>Reuse existing site patterns</b><button type="button" onClick={() => addComponent("tag-list")}><Workflow size={15} /><span><b>Tool tags</b><small>Skills & Toolbox style</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("stat")}><Type size={15} /><span><b>Statistic card</b><small>About section style</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("contact-card")}><UserRound size={15} /><span><b>Contact card</b><small>Direct contact style</small></span><Plus size={14} /></button></div>{selected && <div className="canvas-block-inspector"><b>Edit selected {componentLabel(selected.type)}</b>{selected.type === "image" && <><label>Image URL<input value={selected.imageUrl ?? ""} onChange={(event) => patchSelected({ imageUrl: event.target.value })} placeholder="https://…" /></label><label>Alternative text<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label></>}{selected.type === "button" && <><label>Button label<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Button link<input value={selected.href ?? ""} onChange={(event) => patchSelected({ href: event.target.value })} placeholder="https://… or #section" /></label></>}{selected.type === "tag-list" && <><label>Group label<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Tags, comma separated<input value={(selected.items ?? []).join(", ")} onChange={(event) => patchSelected({ items: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label></>}{selected.type === "stat" && <><label>Display value<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Label<input value={selected.items?.[0] ?? ""} onChange={(event) => patchSelected({ items: [event.target.value] })} /></label></>}{selected.type === "contact-card" && <><label>Card title<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Contact rows<textarea value={(selected.items ?? []).join("\n")} onChange={(event) => patchSelected({ items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} rows={3} /></label></>}</div>}<div className="canvas-palette-tip"><GripVertical size={14} /> Drag with the handle. Blocks snap to the 8px grid and reveal alignment helpers. Select a block to resize, duplicate, or delete it.</div></aside>}
    </div>
  </div>;
}
