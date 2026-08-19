// @ts-nocheck
import JSZip from "jszip";
import type { PortfolioContent } from "@shared/portfolio";
import { renderFaithfulStaticPortfolio, STATIC_PUBLIC_CSS, STATIC_PUBLIC_JS } from "./staticPublicExport";

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
const text = (value: unknown) => escapeHtml(String(value ?? "").replace(/\*\*|__|_/g, ""));
const isImageUrl = (value: string) => /^(?:https?:|\/|data:image\/)/.test(value) && /(?:\.(?:png|jpe?g|webp|gif|svg)(?:\?|$)|data:image\/)/i.test(value);

function collectImageUrls(value: unknown, found = new Set<string>()) {
  if (typeof value === "string" && isImageUrl(value)) found.add(value);
  else if (Array.isArray(value)) value.forEach((entry) => collectImageUrls(entry, found));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => collectImageUrls(entry, found));
  return found;
}

async function toDataUrl(url: string) {
  if (url.startsWith("data:")) return url;
  try {
    const response = await fetch(url);
    if (!response.ok) return url;
    const blob = await response.blob();
    return await new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => resolve(url); reader.readAsDataURL(blob); });
  } catch { return url; }
}

async function inlineImages(content: PortfolioContent) {
  const source = structuredClone(content) as Record<string, unknown>;
  const urls = [...collectImageUrls(source)];
  const replacements = new Map(await Promise.all(urls.map(async (url) => [url, await toDataUrl(url)] as const)));
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") return replacements.get(value) ?? value;
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, walk(entry)]));
    return value;
  };
  return { content: walk(source) as unknown as PortfolioContent, assetCount: [...replacements.values()].filter((url) => url.startsWith("data:")).length };
}

export function renderPortfolioHtml(content: any) {
  content.hero.portrait ??= content.hero.portraitUrl;
  content.about.intro ??= (content.about.paragraphs ?? []).join(" ");
  content.about.statistics ??= content.about.stats ?? [];
  content.experience.forEach((entry: any) => { entry.description ??= entry.text; });
  content.toolbox ??= (content.skills ?? []).map((group: any) => ({ title: group.heading, tools: group.entries }));
  content.contact.body ??= content.contact.intro;
  content.contact.email ??= content.hero.email;
  content.contact.phone ??= content.hero.phone;
  const sections = new Set(content.sectionOrder ?? ["home", "about", "experience", "skills", "certifications", "projects", "writing", "contact"]);
  const hidden = new Set(content.hiddenSections ?? []);
  const show = (id: string) => sections.has(id) && !hidden.has(id);
  const hero = content.hero;
  const projectHtml = content.projects.map((project: any, index: number) => `<article class="project ${index % 2 ? "reverse" : ""}"><img src="${escapeHtml(project.image)}" alt="${text(project.title)}" style="object-position:${project.imageFocus?.x ?? 50}% ${project.imageFocus?.y ?? 50}%;transform:scale(${Math.max(1, project.imageZoom ?? 1)});transform-origin:${project.imageFocus?.x ?? 50}% ${project.imageFocus?.y ?? 50}%"><div><small>${text(project.type)} · ${text(project.state)}</small><h3>${text(project.title)}</h3><p>${text(project.byline)}</p><dl><dt>${text(content.projectsSection.problemLabel)}</dt><dd>${text(project.problem)}</dd><dt>${text(content.projectsSection.descriptionLabel)}</dt><dd>${text(project.body)}</dd><dt>${text(content.projectsSection.realizationLabel)}</dt><dd>${text(project.realization)}</dd></dl><p class="tags">${project.tech.map((item: string) => `<span>${text(item)}</span>`).join("")}</p></div></article>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${text(hero.firstName)} ${text(hero.lastName)} — Portfolio</title><style>body{margin:0;font:16px/1.6 Inter,Arial,sans-serif;color:#122342;background:#eff6ff}main{max-width:1120px;margin:24px auto;background:#fff;border-radius:24px;overflow:hidden}section{padding:64px clamp(24px,5vw,64px);border-bottom:1px solid #e7eef7}h1,h2,h3{line-height:1.1;margin:.25em 0}h1{font-size:clamp(42px,7vw,80px)}h2{font-size:clamp(30px,4vw,48px)}.hero{display:grid;grid-template-columns:1fr minmax(240px,420px);gap:42px;align-items:center;background:#f7fbff}.hero img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:50%;border:8px solid white;box-shadow:0 16px 42px #a9c7ed}.eyebrow,small,dt{color:#4e7baa;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.tags span{display:inline-block;margin:4px;padding:4px 9px;border-radius:999px;background:#edf5ff;color:#2862ab;font-size:.78rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}.card{padding:18px;border:1px solid #dce8f7;border-radius:14px}.project{display:grid;grid-template-columns:minmax(220px,31%) 1fr;gap:34px;align-items:start;margin:20px 0;padding:24px;border:1px solid #e1e7e0;border-radius:14px;background:#fcfdfb;overflow:hidden}.project.reverse{grid-template-columns:1fr minmax(220px,31%)}.project.reverse img{order:2}.project img{width:100%;min-width:0;aspect-ratio:4/3;object-fit:cover;border-radius:10px;background:#edf4fb}.project dl{display:grid;gap:4px}.project dt{margin-top:12px}.project dd{margin:0}@media(max-width:700px){main{margin:0;border-radius:0}.hero,.project,.project.reverse{grid-template-columns:1fr}.project.reverse img{order:0}.hero img{max-width:320px;margin:auto}section{padding:44px 24px}}</style></head><body><main>${show("home") ? `<section class="hero"><div><p class="eyebrow">${text(hero.eyebrow)}</p><h1>${text(hero.firstName)} ${text(hero.lastName)}</h1><p><b>${text(hero.role)}</b> · ${text(hero.location)}</p><p>${text(hero.blurb)}</p><p>${text(hero.email)} · ${text(hero.phone)}</p></div><img src="${escapeHtml(hero.portrait)}" alt="${text(hero.firstName)} ${text(hero.lastName)}"></section>` : ""}${show("about") ? `<section><p class="eyebrow">${text(content.about.eyebrow)}</p><h2>${text(content.about.title)}</h2><p>${text(content.about.intro)}</p><div class="grid">${content.about.statistics.map((stat) => `<div class="card"><b>${text(stat.value)}</b><br>${text(stat.label)}</div>`).join("")}</div></section>` : ""}${show("experience") ? `<section><p class="eyebrow">${text(content.experienceSection.eyebrow)}</p><h2>${text(content.experienceSection.title)}</h2>${content.experience.map((entry) => `<article class="card"><small>${text(entry.date)}</small><h3>${text(entry.role)}</h3><p>${text(entry.company)} · ${text(entry.description)}</p></article>`).join("")}</section>` : ""}${show("skills") ? `<section><p class="eyebrow">${text(content.skillsSection.eyebrow)}</p><h2>${text(content.skillsSection.title)}</h2><div class="grid">${content.toolbox.map((box) => `<article class="card"><h3>${text(box.title)}</h3><p class="tags">${box.tools.map((tool) => `<span>${text(tool)}</span>`).join("")}</p></article>`).join("")}</div></section>` : ""}${show("projects") ? `<section><p class="eyebrow">${text(content.projectsSection.eyebrow)}</p><h2>${text(content.projectsSection.title)}</h2>${projectHtml}</section>` : ""}${show("writing") ? `<section><p class="eyebrow">${text(content.writingSection.eyebrow)}</p><h2>${text(content.writingSection.title)}</h2>${content.writing.map((post) => `<article class="card"><small>${text(post.siteName ?? post.category)}</small><h3>${text(post.title)}</h3><p>${text(post.date)} · ${text(post.readTime)}</p></article>`).join("")}</section>` : ""}${show("contact") ? `<section><p class="eyebrow">${text(content.contact.eyebrow)}</p><h2>${text(content.contact.title)}</h2><p>${text(content.contact.body)}</p><p>${text(content.contact.email)} · ${text(content.contact.phone)} · ${text(content.contact.location)}</p></section>` : ""}</main></body></html>`;
}

function download(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1_000); }

export async function downloadPortfolioExport(content: PortfolioContent, format: "html" | "zip") {
  const inlined = await inlineImages(content);
  const html = renderPortfolioHtml(inlined.content);
  if (format === "html") download(new Blob([html], { type: "text/html;charset=utf-8" }), "fedi-nasri-portfolio.html");
  else { const zip = new JSZip(); zip.file("index.html", renderFaithfulStaticPortfolio(inlined.content)); zip.file("styles.css", STATIC_PUBLIC_CSS); zip.file("app.js", STATIC_PUBLIC_JS); zip.file("README.txt", "Open index.html in a modern browser. This static package contains the public portfolio layout, responsive CSS, JavaScript interactions, and embedded image assets from the active draft."); download(await zip.generateAsync({ type: "blob" }), "fedi-nasri-portfolio-static.zip"); }
  return { assetCount: inlined.assetCount };
}
