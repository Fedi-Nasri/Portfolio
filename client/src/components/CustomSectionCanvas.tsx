import { Copy, GripVertical, Image, Link, Maximize2, PanelRightClose, PanelRightOpen, Plus, Save, Scaling, SquareArrowOutUpRight, Trash2, Type, UserRound, Workflow } from "lucide-react";
import React, { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { getCustomSectionCanvasComponents, type CanvasComponentType, type CanvasLayoutPreset, type CustomPortfolioSection, type CustomSectionCanvasComponent } from "@shared/portfolio";
import "./custom-section-canvas.css";

type Props = { section: CustomPortfolioSection; editable?: boolean; onComponentsChange?: (components: CustomSectionCanvasComponent[]) => void; presets?: CanvasLayoutPreset[]; onPresetsChange?: (presets: CanvasLayoutPreset[]) => void; };
type Guides = { vertical?: number; horizontal?: number; labels: string[] };
const GRID_SIZE = 8;
const EXAMPLE_IMAGE = "/manus-storage/fedi-project-autonomous-boat_69519cd9.jpg";

function defaultComponent(sectionId: string, type: CanvasComponentType, count: number): CustomSectionCanvasComponent {
  const base = { id: `${sectionId}-${type}-${Date.now()}`, type, x: 48 + (count % 3) * 18, y: Math.min(300, 52 + count * 32) };
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
function getBounds(items: CustomSectionCanvasComponent[]) { const x = Math.min(...items.map((item) => item.x)); const y = Math.min(...items.map((item) => item.y)); return { x, y, width: Math.max(...items.map((item) => item.x + item.width)) - x, height: Math.max(...items.map((item) => item.y + item.height)) - y }; }

export function CustomSectionCanvas({ section, editable = false, onComponentsChange, presets = [], onPresetsChange }: Props) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [guides, setGuides] = useState<Guides>({ labels: [] });
  const [presetName, setPresetName] = useState("");
  const components = getCustomSectionCanvasComponents(section);
  const selectedComponents = components.filter((component) => selectedIds.includes(component.id));
  const selected = selectedComponents.length === 1 ? selectedComponents[0] ?? null : null;
  const selectedBounds = selectedComponents.length ? getBounds(selectedComponents) : null;
  const canvasHeight = Math.max(360, section.canvasHeight ?? 420);
  const updateComponents = (next: CustomSectionCanvasComponent[]) => onComponentsChange?.(next);
  const selectComponent = (component: CustomSectionCanvasComponent, additive = false) => setSelectedIds((current) => additive ? (current.includes(component.id) ? current.filter((id) => id !== component.id) : [...current, component.id]) : [component.id]);
  const patchSelected = (patch: Partial<CustomSectionCanvasComponent>) => { if (selected) updateComponents(components.map((component) => component.id === selected.id ? { ...component, ...patch } : component)); };
  const duplicateSelected = () => { if (!selectedComponents.length) return; const stamp = Date.now(); const copies = selectedComponents.map((component, index) => ({ ...component, id: `${section.id}-${component.type}-${stamp}-${index}`, x: component.x + 24, y: component.y + 24 })); updateComponents([...components, ...copies]); setSelectedIds(copies.map((component) => component.id)); };
  const deleteSelected = () => { if (!selectedIds.length) return; updateComponents(components.filter((component) => !selectedIds.includes(component.id))); setSelectedIds([]); setGuides({ labels: [] }); };

  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>, componentId: string) => {
    if (!editable || !canvasRef.current) return;
    event.preventDefault(); event.stopPropagation();
    const clicked = components.find((component) => component.id === componentId); if (!clicked) return;
    const movingIds = selectedIds.includes(componentId) ? selectedIds : [componentId];
    const moving = components.filter((component) => movingIds.includes(component.id)); const bounds = getBounds(moving); const rect = canvasRef.current.getBoundingClientRect(); const startX = event.clientX; const startY = event.clientY;
    setSelectedIds(movingIds);
    const move = (moveEvent: PointerEvent) => {
      let x = snap(Math.max(0, Math.min(rect.width - bounds.width, bounds.x + moveEvent.clientX - startX))); let y = snap(Math.max(0, Math.min(rect.height - bounds.height, bounds.y + moveEvent.clientY - startY)));
      const labels = ["8px grid"]; let vertical: number | undefined; let horizontal: number | undefined;
      const centreX = (rect.width - bounds.width) / 2; const centreY = (rect.height - bounds.height) / 2;
      if (Math.abs(x - centreX) <= GRID_SIZE) { x = snap(centreX); vertical = rect.width / 2; labels.push("canvas centre"); }
      if (Math.abs(y - centreY) <= GRID_SIZE) { y = snap(centreY); horizontal = rect.height / 2; labels.push("canvas middle"); }
      components.filter((component) => !movingIds.includes(component.id)).forEach((component) => {
        if (Math.abs(x - component.x) <= GRID_SIZE) { x = component.x; vertical = x; labels.push("left aligned"); }
        if (Math.abs(y - component.y) <= GRID_SIZE) { y = component.y; horizontal = y; labels.push("top aligned"); }
      });
      x = Math.max(0, Math.min(rect.width - bounds.width, x)); y = Math.max(0, Math.min(rect.height - bounds.height, y)); setGuides({ vertical, horizontal, labels: Array.from(new Set(labels)) });
      updateComponents(components.map((component) => movingIds.includes(component.id) ? { ...component, x: component.x + x - bounds.x, y: component.y + y - bounds.y } : component));
    };
    const end = () => { setGuides({ labels: [] }); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
  };

  const beginResize = (event: ReactPointerEvent<HTMLButtonElement>, componentId: string) => {
    if (!editable || !canvasRef.current) return;
    event.preventDefault(); event.stopPropagation();
    const clicked = components.find((component) => component.id === componentId); if (!clicked) return;
    const resizingIds = selectedIds.includes(componentId) ? selectedIds : [componentId]; const resizing = components.filter((component) => resizingIds.includes(component.id)); const bounds = getBounds(resizing); const rect = canvasRef.current.getBoundingClientRect(); const startX = event.clientX; const startY = event.clientY;
    setSelectedIds(resizingIds);
    const move = (moveEvent: PointerEvent) => {
      const width = snap(Math.max(resizingIds.length > 1 ? 140 : clicked.type === "button" ? 120 : 150, Math.min(rect.width - bounds.x, bounds.width + moveEvent.clientX - startX))); const height = snap(Math.max(resizingIds.length > 1 ? 80 : clicked.type === "button" ? 40 : 70, Math.min(rect.height - bounds.y, bounds.height + moveEvent.clientY - startY)));
      const scaleX = width / bounds.width; const scaleY = height / bounds.height;
      updateComponents(components.map((component) => resizingIds.includes(component.id) ? { ...component, x: Math.round(bounds.x + (component.x - bounds.x) * scaleX), y: Math.round(bounds.y + (component.y - bounds.y) * scaleY), width: Math.max(40, Math.round(component.width * scaleX)), height: Math.max(32, Math.round(component.height * scaleY)) } : component));
    };
    const end = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
  };

  const addComponent = (type: CanvasComponentType) => { const component = defaultComponent(section.id, type, components.length); updateComponents([...components, component]); setSelectedIds([component.id]); };
  const savePreset = () => { const name = presetName.trim(); if (!name || !components.length) return; onPresetsChange?.([...presets, { id: `preset-${Date.now()}`, name, components: structuredClone(components), canvasHeight }]); setPresetName(""); };
  const applyPreset = (preset: CanvasLayoutPreset) => { const stamp = Date.now(); const next = preset.components.map((component, index) => ({ ...structuredClone(component), id: `${section.id}-${component.type}-${stamp}-${index}` })); updateComponents(next); setSelectedIds(next.map((component) => component.id)); };
  const renderBlock = (component: CustomSectionCanvasComponent) => {
    if (component.type === "image") return component.imageUrl ? <img src={component.imageUrl} alt={component.content || "Custom portfolio visual"} /> : <div className="canvas-image-empty"><Image size={24} /> Add image URL</div>;
    if (component.type === "button") return editable ? <span className="canvas-button-block">{component.content || "Action button"}<SquareArrowOutUpRight size={14} /></span> : <a className="canvas-button-block" href={component.href || "#"}>{component.content || "Action button"}<SquareArrowOutUpRight size={14} /></a>;
    if (component.type === "tag-list") return <><b className="canvas-block-kicker">{component.content}</b><div className="canvas-tag-list">{(component.items ?? []).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></>;
    if (component.type === "stat") return <><b className="canvas-stat-value">{component.content}</b><span className="canvas-stat-label">{component.items?.[0] ?? "Statistic"}</span></>;
    if (component.type === "contact-card") return <><b className="canvas-contact-title">{component.content}</b><div className="canvas-contact-items">{(component.items ?? []).map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></>;
    return <div className="canvas-component-content" contentEditable={editable} suppressContentEditableWarning spellCheck={editable} role={editable ? "textbox" : undefined} onFocus={() => editable && selectComponent(component)} onBlur={(event) => { if (editable) updateComponents(components.map((candidate) => candidate.id === component.id ? { ...candidate, content: event.currentTarget.innerText } : candidate)); }}>{component.content}</div>;
  };

  return <div className={`custom-section-canvas-builder${editable ? " is-editing" : ""}`}>
    <div className="custom-section-canvas-toolbar"><div><span>{section.eyebrow}</span><b>{editable ? "Canvas section editor" : "Custom portfolio section"}</b></div>{editable && <button type="button" className="canvas-palette-toggle" onClick={() => setPaletteOpen((open) => !open)}>{paletteOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />} {paletteOpen ? "Hide components" : "Add components"}</button>}</div>
    <div className={`custom-section-canvas-workspace${editable && paletteOpen ? " with-palette" : ""}`}>
      <div ref={canvasRef} className="custom-section-canvas" style={{ height: `${canvasHeight}px` }} onPointerDown={() => { if (editable) { setSelectedIds([]); setGuides({ labels: [] }); } }}>
        <div className="canvas-grid-label">Canvas · 8 px snap grid</div>{guides.vertical !== undefined && <i className="canvas-alignment-guide is-vertical" style={{ left: guides.vertical }} />}{guides.horizontal !== undefined && <i className="canvas-alignment-guide is-horizontal" style={{ top: guides.horizontal }} />}{guides.labels.length > 0 && <div className="canvas-guide-label">Snap: {guides.labels.join(" · ")}</div>}
        {selectedBounds && editable && <div className="canvas-measurement" aria-live="polite">{selectedIds.length > 1 ? `${selectedIds.length} blocks · ` : ""}X {selectedBounds.x}px · Y {selectedBounds.y}px · {selectedBounds.width} × {selectedBounds.height}px</div>}
        {components.map((component) => { const isSelected = editable && selectedIds.includes(component.id); return <article key={component.id} className={`canvas-component canvas-component-${component.type}${isSelected ? " is-selected" : ""}`} style={{ left: component.x, top: component.y, width: component.width, height: component.height }} onClick={(event) => { event.stopPropagation(); if (editable) selectComponent(component, event.shiftKey || event.metaKey || event.ctrlKey); }}>
          {editable && <button type="button" className="canvas-drag-handle" aria-label={`Drag ${component.type} box`} title="Drag to reposition" onPointerDown={(event) => beginDrag(event, component.id)}><GripVertical size={15} /></button>}{renderBlock(component)}
          {isSelected && <>{selectedIds.length > 1 && <span className="canvas-group-count"><Scaling size={11} /> {selectedIds.length}</span>}<div className="canvas-block-actions"><button type="button" aria-label="Duplicate selected blocks" title="Duplicate selected blocks" onPointerDown={(event) => event.stopPropagation()} onClick={duplicateSelected}><Copy size={12} /></button><button type="button" aria-label="Delete selected blocks" title="Delete selected blocks" onPointerDown={(event) => event.stopPropagation()} onClick={deleteSelected}><Trash2 size={12} /></button></div><button type="button" className="canvas-resize-handle" aria-label={`Resize ${selectedIds.length > 1 ? "selected blocks" : componentLabel(component.type)}`} title="Drag to resize" onPointerDown={(event) => beginResize(event, component.id)}><Maximize2 size={13} /></button></>}
        </article>; })}
      </div>
      {editable && <aside className="canvas-component-palette" aria-label="Canvas component library"><span>Component library</span><h3>Add reusable blocks</h3><p>Start with title and text, or reuse visual patterns from the portfolio’s hero, toolbox, statistics, and contact areas.</p><div className="canvas-palette-group"><b>Content</b><button type="button" onClick={() => addComponent("title")}><Type size={15} /><span><b>Title box</b><small>Section heading</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("text")}><Type size={15} /><span><b>Text box</b><small>Paragraph or note</small></span><Plus size={14} /></button></div><div className="canvas-palette-group"><b>Media & action</b><button type="button" onClick={() => addComponent("image")}><Image size={15} /><span><b>Image block</b><small>Visual with editable URL</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("button")}><Link size={15} /><span><b>Action button</b><small>Portfolio call to action</small></span><Plus size={14} /></button></div><div className="canvas-palette-group"><b>Reuse existing site patterns</b><button type="button" onClick={() => addComponent("tag-list")}><Workflow size={15} /><span><b>Tool tags</b><small>Skills & Toolbox style</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("stat")}><Type size={15} /><span><b>Statistic card</b><small>About section style</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("contact-card")}><UserRound size={15} /><span><b>Contact card</b><small>Direct contact style</small></span><Plus size={14} /></button></div><div className="canvas-preset-panel"><b>Reusable layouts</b><label>Preset name<input value={presetName} onChange={(event) => setPresetName(event.target.value)} placeholder="e.g. Project feature" /></label><button type="button" disabled={!presetName.trim() || components.length === 0} onClick={savePreset}><Save size={13} /> Save this layout</button>{presets.length > 0 && <div className="canvas-preset-list">{presets.map((preset) => <button type="button" key={preset.id} onClick={() => applyPreset(preset)}><span>{preset.name}</span><small>{preset.components.length} blocks</small></button>)}</div>}</div>{selected && <div className="canvas-block-inspector"><b>Edit selected {componentLabel(selected.type)}</b>{selected.type === "image" && <><label>Image URL<input value={selected.imageUrl ?? ""} onChange={(event) => patchSelected({ imageUrl: event.target.value })} placeholder="https://…" /></label><label>Alternative text<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label></>}{selected.type === "button" && <><label>Button label<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Button link<input value={selected.href ?? ""} onChange={(event) => patchSelected({ href: event.target.value })} placeholder="https://… or #section" /></label></>}{selected.type === "tag-list" && <><label>Group label<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Tags, comma separated<input value={(selected.items ?? []).join(", ")} onChange={(event) => patchSelected({ items: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label></>}{selected.type === "stat" && <><label>Display value<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Label<input value={selected.items?.[0] ?? ""} onChange={(event) => patchSelected({ items: [event.target.value] })} /></label></>}{selected.type === "contact-card" && <><label>Card title<input value={selected.content} onChange={(event) => patchSelected({ content: event.target.value })} /></label><label>Contact rows<textarea value={(selected.items ?? []).join("\n")} onChange={(event) => patchSelected({ items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} rows={3} /></label></>}</div>}<div className="canvas-palette-tip"><GripVertical size={14} /> Use Shift-click to select multiple blocks. Drag or resize any selected block to move or scale the group; block actions apply to the selection.</div></aside>}
    </div>
  </div>;
}
