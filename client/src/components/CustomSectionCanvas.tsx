import { GripVertical, Maximize2, PanelRightClose, PanelRightOpen, Plus, Type } from "lucide-react";
import React, { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { getCustomSectionCanvasComponents, type CanvasComponentType, type CustomPortfolioSection } from "@shared/portfolio";
import "./custom-section-canvas.css";

type Props = {
  section: CustomPortfolioSection;
  editable?: boolean;
  onComponentsChange?: (components: ReturnType<typeof getCustomSectionCanvasComponents>) => void;
};

type Measurement = { x: number; y: number; width: number; height: number };

function defaultComponent(sectionId: string, type: CanvasComponentType, count: number) {
  const y = Math.min(300, 52 + count * 34);
  return {
    id: `${sectionId}-${type}-${Date.now()}`,
    type,
    content: type === "title" ? "New title" : "Add a text block with context, a key result, or a call to action.",
    x: 48 + (count % 3) * 18,
    y,
    width: type === "title" ? 420 : 460,
    height: type === "title" ? 88 : 112,
  };
}

export function CustomSectionCanvas({ section, editable = false, onComponentsChange }: Props) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const components = getCustomSectionCanvasComponents(section);
  const selected = components.find((component) => component.id === selectedId) ?? null;
  const canvasHeight = Math.max(360, section.canvasHeight ?? 420);

  const updateComponents = (next: typeof components) => onComponentsChange?.(next);
  const selectComponent = (component: typeof components[number]) => setSelectedId(component.id);
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
      const nextX = Math.round(Math.max(0, Math.min(rect.width - component.width, component.x + moveEvent.clientX - startX)));
      const nextY = Math.round(Math.max(0, Math.min(rect.height - component.height, component.y + moveEvent.clientY - startY)));
      updateComponents(components.map((candidate) => candidate.id === componentId ? { ...candidate, x: nextX, y: nextY } : candidate));
    };
    const end = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
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
    const minimumWidth = component.type === "title" ? 180 : 150;
    const minimumHeight = component.type === "title" ? 58 : 70;
    setSelectedId(componentId);
    const move = (moveEvent: PointerEvent) => {
      const width = Math.round(Math.max(minimumWidth, Math.min(rect.width - component.x, component.width + moveEvent.clientX - startX)));
      const height = Math.round(Math.max(minimumHeight, Math.min(rect.height - component.y, component.height + moveEvent.clientY - startY)));
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

  return <div className={`custom-section-canvas-builder${editable ? " is-editing" : ""}`}>
    <div className="custom-section-canvas-toolbar"><div><span>{section.eyebrow}</span><b>{editable ? "Canvas section editor" : "Custom portfolio section"}</b></div>{editable && <button type="button" className="canvas-palette-toggle" onClick={() => setPaletteOpen((open) => !open)}>{paletteOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />} {paletteOpen ? "Hide components" : "Add components"}</button>}</div>
    <div className={`custom-section-canvas-workspace${editable && paletteOpen ? " with-palette" : ""}`}>
      <div ref={canvasRef} className="custom-section-canvas" style={{ height: `${canvasHeight}px` }} onPointerDown={() => editable && setSelectedId(null)}>
        <div className="canvas-grid-label">Canvas · 1 px grid</div>
        {selected && editable && <div className="canvas-measurement" aria-live="polite">X {selected.x}px · Y {selected.y}px · {selected.width} × {selected.height}px</div>}
        {components.map((component) => {
          const isSelected = editable && selectedId === component.id;
          return <article key={component.id} className={`canvas-component canvas-component-${component.type}${isSelected ? " is-selected" : ""}`} style={{ left: component.x, top: component.y, width: component.width, height: component.height }} onClick={(event) => { event.stopPropagation(); if (editable) selectComponent(component); }}>
            {editable && <button type="button" className="canvas-drag-handle" aria-label={`Drag ${component.type} box`} title="Drag to reposition" onPointerDown={(event) => beginDrag(event, component.id)}><GripVertical size={15} /></button>}
            <div className="canvas-component-content" contentEditable={editable} suppressContentEditableWarning spellCheck={editable} role={editable ? "textbox" : undefined} aria-label={`${component.type === "title" ? "Title" : "Text"} box`} onFocus={() => editable && selectComponent(component)} onBlur={(event) => { if (!editable) return; updateComponents(components.map((candidate) => candidate.id === component.id ? { ...candidate, content: event.currentTarget.innerText } : candidate)); }}>{component.content}</div>
            {isSelected && <button type="button" className="canvas-resize-handle" aria-label={`Resize ${component.type} box`} title="Drag to resize" onPointerDown={(event) => beginResize(event, component.id)}><Maximize2 size={13} /></button>}
          </article>;
        })}
      </div>
      {editable && <aside className="canvas-component-palette" aria-label="Canvas component library"><span>Component library</span><h3>Add reusable blocks</h3><p>Use the same title and text styles already used in your portfolio, then place and resize them on the canvas.</p><button type="button" onClick={() => addComponent("title")}><Type size={15} /><span><b>Title box</b><small>Section heading</small></span><Plus size={14} /></button><button type="button" onClick={() => addComponent("text")}><Type size={15} /><span><b>Text box</b><small>Paragraph or note</small></span><Plus size={14} /></button><div className="canvas-palette-tip"><GripVertical size={14} /> Drag with the handle. Select a box to resize it and view its pixel measurements.</div></aside>}
    </div>
  </div>;
}
