import React from "react";
import { Minus, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState, type KeyboardEvent, type WheelEvent } from "react";
import type { PortfolioContent } from "@shared/portfolio";
import "./project-image-control-panel.css";

type Project = PortfolioContent["projects"][number];
type Props = { projects: Project[]; onChange: (index: number, key: "imageFocus" | "imageZoom" | "imageAspectRatio" | "imageFrameHeight", value: unknown) => void };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ProjectImageControlPanel({ projects, onChange }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const project = projects[selectedIndex];
  if (!project) return null;
  const zoom = Math.max(1, project.imageZoom ?? 1);
  const focus = project.imageFocus ?? { x: 50, y: 50 };
  const updateZoom = (next: number) => onChange(selectedIndex, "imageZoom", Math.round(clamp(next, 1, 2.5) * 100) / 100);
  const updateFocus = (x: number, y: number) => onChange(selectedIndex, "imageFocus", { x: Math.round(clamp(x, 0, 100) * 10) / 10, y: Math.round(clamp(y, 0, 100) * 10) / 10 });
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const step = event.shiftKey ? 5 : 1;
    if (event.key === "ArrowLeft") { event.preventDefault(); updateFocus(focus.x - step, focus.y); }
    if (event.key === "ArrowRight") { event.preventDefault(); updateFocus(focus.x + step, focus.y); }
    if (event.key === "ArrowUp") { event.preventDefault(); updateFocus(focus.x, focus.y - step); }
    if (event.key === "ArrowDown") { event.preventDefault(); updateFocus(focus.x, focus.y + step); }
    if (event.key === "+" || event.key === "=") { event.preventDefault(); updateZoom(zoom + .05); }
    if (event.key === "-") { event.preventDefault(); updateZoom(zoom - .05); }
  };
  const onWheel = (event: WheelEvent<HTMLElement>) => { event.preventDefault(); updateZoom(zoom + (event.deltaY < 0 ? .05 : -.05)); };
  return <aside className="project-image-control-panel" tabIndex={0} onKeyDown={onKeyDown} onWheel={onWheel} aria-label="Project image controls">
    <div className="project-image-control-title"><SlidersHorizontal size={15} /><span>Project image</span></div>
    <label>Project<select value={selectedIndex} onChange={(event) => setSelectedIndex(Number(event.target.value))}>{projects.map((entry, index) => <option value={index} key={`${entry.title}-${index}`}>{index + 1}. {entry.title}</option>)}</select></label>
    <label>Zoom <span>{Math.round(zoom * 100)}%</span><div className="project-image-stepper"><button type="button" onClick={() => updateZoom(zoom - .05)} aria-label="Zoom out"><Minus size={13} /></button><input type="range" min="1" max="2.5" step="0.05" value={zoom} onChange={(event) => updateZoom(Number(event.target.value))} /><button type="button" onClick={() => updateZoom(zoom + .05)} aria-label="Zoom in"><Plus size={13} /></button></div></label>
    <label>Aspect ratio<select value={project.imageAspectRatio ?? "standard"} onChange={(event) => { const ratio = event.target.value as "portrait" | "square" | "standard" | "widescreen"; const presetHeight = ratio === "portrait" ? 420 : ratio === "square" ? 330 : ratio === "widescreen" ? 205 : 278; onChange(selectedIndex, "imageAspectRatio", ratio); onChange(selectedIndex, "imageFrameHeight", presetHeight); }}><option value="portrait">Portrait · 3:4</option><option value="square">Square · 1:1</option><option value="standard">Standard · 4:3</option><option value="widescreen">Widescreen · 16:9</option></select></label>
    <label>Frame height <span>{project.imageFrameHeight ?? 278}px</span><input type="range" min="180" max="520" step="10" value={project.imageFrameHeight ?? 278} onChange={(event) => onChange(selectedIndex, "imageFrameHeight", Number(event.target.value))} /></label>
    <p>Use the mouse wheel to zoom. Use arrow keys to move the image focus; hold Shift for larger steps.</p>
    <button type="button" className="project-image-reset" onClick={() => { onChange(selectedIndex, "imageFocus", undefined); onChange(selectedIndex, "imageZoom", undefined); onChange(selectedIndex, "imageAspectRatio", undefined); onChange(selectedIndex, "imageFrameHeight", undefined); }}><RotateCcw size={13} /> Reset image settings</button>
  </aside>;
}
