import { DEFAULT_SECTION_ORDER, PORTFOLIO_SECTION_IDS, type PortfolioContent, type PortfolioSectionId } from "@shared/portfolio";

export type ContentPath = (string | number)[];

export function readAtPath(source: unknown, path: ContentPath): unknown {
  return path.reduce<unknown>((current, segment) => {
    if (current && typeof current === "object") return (current as Record<string, unknown>)[String(segment)];
    return undefined;
  }, source);
}

export function updateAtPath(source: PortfolioContent, path: ContentPath, value: unknown): PortfolioContent {
  const copy = structuredClone(source) as Record<string, unknown>;
  let target: Record<string, unknown> | unknown[] = copy;
  path.slice(0, -1).forEach((segment, index) => {
    const nextSegment = path[index + 1];
    if (target[segment as never] === undefined || target[segment as never] === null) {
      target[segment as never] = (typeof nextSegment === "number" ? [] : {}) as never;
    }
    target = target[segment as never] as Record<string, unknown> | unknown[];
  });
  target[path[path.length - 1] as never] = value as never;
  return copy as PortfolioContent;
}

export function transformList(source: PortfolioContent, path: ContentPath, transform: (items: unknown[]) => unknown[]): PortfolioContent {
  const current = readAtPath(source, path);
  if (!Array.isArray(current)) return source;
  return updateAtPath(source, path, transform(structuredClone(current)));
}

export function duplicateListItem(source: PortfolioContent, path: ContentPath, index: number): PortfolioContent {
  return transformList(source, path, (items) => {
    if (index < 0 || index >= items.length) return items;
    items.splice(index + 1, 0, structuredClone(items[index]));
    return items;
  });
}

export function moveListItem(source: PortfolioContent, path: ContentPath, index: number, direction: -1 | 1): PortfolioContent {
  return transformList(source, path, (items) => {
    const destination = index + direction;
    if (index < 0 || destination < 0 || destination >= items.length) return items;
    [items[index], items[destination]] = [items[destination], items[index]];
    return items;
  });
}

export function removeListItem(source: PortfolioContent, path: ContentPath, index: number): PortfolioContent {
  return transformList(source, path, (items) => {
    if (items.length <= 1 || index < 0 || index >= items.length) return items;
    items.splice(index, 1);
    return items;
  });
}

export function appendAboutTag(source: PortfolioContent, tag = "New tag"): PortfolioContent {
  return updateAtPath(source, ["about", "tags"], [...source.about.tags, tag]);
}

export function appendAboutStat(source: PortfolioContent, stat: PortfolioContent["about"]["stats"][number] = { value: "00", label: "New statistic" }): PortfolioContent {
  return updateAtPath(source, ["about", "stats"], [...source.about.stats, stat]);
}

export function removeAboutTag(source: PortfolioContent, tagIndex: number): PortfolioContent {
  if (tagIndex < 0 || tagIndex >= source.about.tags.length) return source;
  return updateAtPath(source, ["about", "tags"], source.about.tags.filter((_, index) => index !== tagIndex));
}

export function removeAboutStat(source: PortfolioContent, statIndex: number): PortfolioContent {
  if (statIndex < 0 || statIndex >= source.about.stats.length) return source;
  return updateAtPath(source, ["about", "stats"], source.about.stats.filter((_, index) => index !== statIndex));
}

export function createExperienceTemplate(): PortfolioContent["experience"][number] {
  return {
    date: "MONTH — YEAR",
    role: "New experience title",
    company: "Company / organisation",
    text: "Describe the work, outcome, and tools you used in this experience.",
    details: ["Describe a key responsibility, delivery, or measurable outcome."],
    tags: ["New tag"],
  };
}

export function insertExperienceTemplate(source: PortfolioContent, index: number, placement: "above" | "below"): PortfolioContent {
  return transformList(source, ["experience"], (items) => {
    const insertionIndex = Math.max(0, Math.min(placement === "above" ? index : index + 1, items.length));
    items.splice(insertionIndex, 0, createExperienceTemplate());
    return items;
  });
}

export function appendExperienceTag(source: PortfolioContent, experienceIndex: number, tag = "New tag"): PortfolioContent {
  const experience = source.experience[experienceIndex];
  if (!experience) return source;
  return updateAtPath(source, ["experience", experienceIndex, "tags"], [...experience.tags, tag]);
}

export function removeExperienceTag(source: PortfolioContent, experienceIndex: number, tagIndex: number): PortfolioContent {
  const experience = source.experience[experienceIndex];
  if (!experience || tagIndex < 0 || tagIndex >= experience.tags.length) return source;
  return updateAtPath(source, ["experience", experienceIndex, "tags"], experience.tags.filter((_, index) => index !== tagIndex));
}

export function appendExperienceDetail(source: PortfolioContent, experienceIndex: number, detail = "New experience detail"): PortfolioContent {
  const experience = source.experience[experienceIndex];
  if (!experience) return source;
  return updateAtPath(source, ["experience", experienceIndex, "details"], [...(experience.details ?? []), detail]);
}

export function removeExperienceDetail(source: PortfolioContent, experienceIndex: number, detailIndex: number): PortfolioContent {
  const experience = source.experience[experienceIndex];
  const details = experience?.details ?? [];
  if (!experience || detailIndex < 0 || detailIndex >= details.length) return source;
  return updateAtPath(source, ["experience", experienceIndex, "details"], details.filter((_, index) => index !== detailIndex));
}

export function reorderExperienceDetail(source: PortfolioContent, experienceIndex: number, fromIndex: number, toIndex: number): PortfolioContent {
  const experience = source.experience[experienceIndex];
  const details = experience?.details ?? [];
  if (!experience || fromIndex < 0 || toIndex < 0 || fromIndex >= details.length || toIndex >= details.length || fromIndex === toIndex) return source;
  const reordered = [...details];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved!);
  return updateAtPath(source, ["experience", experienceIndex, "details"], reordered);
}

export function createSkillToolbox(): PortfolioContent["skills"][number] {
  return { heading: "New toolbox", entries: ["New tool"] };
}

export function appendSkillToolbox(source: PortfolioContent): PortfolioContent {
  return updateAtPath(source, ["skills"], [...source.skills, createSkillToolbox()]);
}

export function appendSkillTool(source: PortfolioContent, toolboxIndex: number, tool = "New tool"): PortfolioContent {
  const toolbox = source.skills[toolboxIndex];
  if (!toolbox) return source;
  return updateAtPath(source, ["skills", toolboxIndex, "entries"], [...toolbox.entries, tool]);
}

export function removeSkillTool(source: PortfolioContent, toolboxIndex: number, toolIndex: number): PortfolioContent {
  const toolbox = source.skills[toolboxIndex];
  if (!toolbox || toolIndex < 0 || toolIndex >= toolbox.entries.length) return source;
  return updateAtPath(source, ["skills", toolboxIndex, "entries"], toolbox.entries.filter((_, index) => index !== toolIndex));
}

export function removeSkillToolbox(source: PortfolioContent, toolboxIndex: number): PortfolioContent {
  if (source.skills.length <= 1 || toolboxIndex < 0 || toolboxIndex >= source.skills.length) return source;
  return updateAtPath(source, ["skills"], source.skills.filter((_, index) => index !== toolboxIndex));
}

export type ProjectCaseStudyBlock = "problem" | "body" | "realization";

const PROJECT_CASE_STUDY_BLOCKS: ProjectCaseStudyBlock[] = ["problem", "body", "realization"];

function projectBlocks(project: PortfolioContent["projects"][number]): ProjectCaseStudyBlock[] {
  return project.caseStudyBlocks ?? PROJECT_CASE_STUDY_BLOCKS;
}

export function createProjectTemplate(): PortfolioContent["projects"][number] {
  return {
    image: "/manus-storage/fedi-project-autonomous-boat_69519cd9.jpg",
    type: "Project category · platform",
    state: "Draft template",
    title: "New infrastructure project",
    byline: "Organisation or personal project · YEAR",
    problem: "Describe the operational or technical problem this work addressed.",
    body: "Explain what you designed, built, configured, or delivered.",
    realization: "Summarise the outcome, impact, and the system that now works reliably.",
    tech: ["New technology"],
    delivery: ["Project outcome"],
    caseStudyBlocks: [...PROJECT_CASE_STUDY_BLOCKS],
  };
}

export function insertProjectTemplate(source: PortfolioContent, index: number, placement: "above" | "below"): PortfolioContent {
  return transformList(source, ["projects"], (items) => {
    const insertionIndex = Math.max(0, Math.min(placement === "above" ? index : index + 1, items.length));
    items.splice(insertionIndex, 0, createProjectTemplate());
    return items;
  });
}

export function appendProjectTech(source: PortfolioContent, projectIndex: number, item = "New technology"): PortfolioContent {
  const project = source.projects[projectIndex];
  if (!project) return source;
  return updateAtPath(source, ["projects", projectIndex, "tech"], [...project.tech, item]);
}

export function removeProjectTech(source: PortfolioContent, projectIndex: number, techIndex: number): PortfolioContent {
  const project = source.projects[projectIndex];
  if (!project || techIndex < 0 || techIndex >= project.tech.length) return source;
  return updateAtPath(source, ["projects", projectIndex, "tech"], project.tech.filter((_, index) => index !== techIndex));
}

export function appendProjectDelivery(source: PortfolioContent, projectIndex: number, item = "Project outcome"): PortfolioContent {
  const project = source.projects[projectIndex];
  if (!project) return source;
  return updateAtPath(source, ["projects", projectIndex, "delivery"], [...project.delivery, item]);
}

export function removeProjectDelivery(source: PortfolioContent, projectIndex: number, deliveryIndex: number): PortfolioContent {
  const project = source.projects[projectIndex];
  if (!project || deliveryIndex < 0 || deliveryIndex >= project.delivery.length) return source;
  return updateAtPath(source, ["projects", projectIndex, "delivery"], project.delivery.filter((_, index) => index !== deliveryIndex));
}

export function addProjectCaseStudyBlock(source: PortfolioContent, projectIndex: number, block: ProjectCaseStudyBlock): PortfolioContent {
  const project = source.projects[projectIndex];
  if (!project) return source;
  const blocks = projectBlocks(project);
  if (blocks.includes(block)) return source;
  return updateAtPath(source, ["projects", projectIndex, "caseStudyBlocks"], PROJECT_CASE_STUDY_BLOCKS.filter((candidate) => blocks.includes(candidate) || candidate === block));
}

export function removeProjectCaseStudyBlock(source: PortfolioContent, projectIndex: number, block: ProjectCaseStudyBlock): PortfolioContent {
  const project = source.projects[projectIndex];
  if (!project) return source;
  return updateAtPath(source, ["projects", projectIndex, "caseStudyBlocks"], projectBlocks(project).filter((candidate) => candidate !== block));
}

export function removeProject(source: PortfolioContent, projectIndex: number): PortfolioContent {
  return removeListItem(source, ["projects"], projectIndex);
}

export function createCertificateTemplate(): PortfolioContent["certifications"][number] {
  return {
    name: "New professional certificate",
    provider: "custom",
    providerLabel: "Provider",
    issuer: "Issuing organisation",
    issued: "Month YEAR",
    scope: "Credential focus area",
    url: "",
  };
}

export function appendCertificate(source: PortfolioContent): PortfolioContent {
  return updateAtPath(source, ["certifications"], [...source.certifications, createCertificateTemplate()]);
}

export function removeCertificate(source: PortfolioContent, certificateIndex: number): PortfolioContent {
  return removeListItem(source, ["certifications"], certificateIndex);
}

export function createWritingArticleTemplate(): PortfolioContent["writing"][number] {
  return {
    title: "New featured article",
    date: "Month DD, YYYY",
    siteName: "Your site or publication",
    category: "Cloud · DevOps · Insight",
    readTime: "4 min read",
    preview: "Introduce the article’s practical takeaway, technical point of view, or field note.",
    body: ["Write the opening paragraph for this featured article.", "Add a second paragraph with the practical detail, result, or lesson for readers."],
    status: "Read article",
    url: "",
  };
}

export function appendWritingArticle(source: PortfolioContent): PortfolioContent {
  return updateAtPath(source, ["writing"], [...source.writing, createWritingArticleTemplate()]);
}

function insertBeforeContact(order: string[], sectionId: string): string[] {
  const contactIndex = order.indexOf("contact");
  const insertionIndex = contactIndex >= 0 ? contactIndex : order.length;
  const next = [...order];
  next.splice(insertionIndex, 0, sectionId);
  return next;
}

export function getPortfolioSectionOrder(source: PortfolioContent): string[] {
  if (!source.sectionOrder) return [...DEFAULT_SECTION_ORDER];
  const validIds = new Set<string>([...PORTFOLIO_SECTION_IDS, ...(source.customSections ?? []).map((section) => section.id)]);
  return source.sectionOrder.filter((sectionId, index, order) => validIds.has(sectionId) && order.indexOf(sectionId) === index);
}

export function getHiddenPortfolioSections(source: PortfolioContent): string[] {
  const order = getPortfolioSectionOrder(source);
  return (source.hiddenSections ?? []).filter((sectionId, index, hidden) => order.includes(sectionId) && hidden.indexOf(sectionId) === index);
}

export function isPortfolioSectionHidden(source: PortfolioContent, sectionId: string): boolean {
  return getHiddenPortfolioSections(source).includes(sectionId);
}

export function togglePortfolioSectionVisibility(source: PortfolioContent, sectionId: string): PortfolioContent {
  const order = getPortfolioSectionOrder(source);
  if (!order.includes(sectionId)) return source;
  const hidden = getHiddenPortfolioSections(source);
  return updateAtPath(source, ["hiddenSections"], hidden.includes(sectionId) ? hidden.filter((candidate) => candidate !== sectionId) : [...hidden, sectionId]);
}

export function movePortfolioSection(source: PortfolioContent, sectionId: string, direction: -1 | 1): PortfolioContent {
  const order = getPortfolioSectionOrder(source);
  const index = order.indexOf(sectionId);
  const destination = index + direction;
  if (sectionId === "home" || index < 0 || destination < 1 || destination >= order.length) return source;
  [order[index], order[destination]] = [order[destination]!, order[index]!];
  return updateAtPath(source, ["sectionOrder"], order);
}

export function removePortfolioSection(source: PortfolioContent, sectionId: string): PortfolioContent {
  if (sectionId === "home") return source;
  const order = getPortfolioSectionOrder(source);
  if (!order.includes(sectionId)) return source;
  const next = updateAtPath(source, ["sectionOrder"], order.filter((candidate) => candidate !== sectionId));
  next.hiddenSections = getHiddenPortfolioSections(source).filter((candidate) => candidate !== sectionId);
  if (!sectionId.startsWith("custom-")) return next;
  return { ...next, customSections: (next.customSections ?? []).filter((section) => section.id !== sectionId) };
}

export function addPortfolioSection(source: PortfolioContent, sectionId: PortfolioSectionId): PortfolioContent {
  const order = getPortfolioSectionOrder(source);
  if (order.includes(sectionId)) return source;
  const next = updateAtPath(source, ["sectionOrder"], insertBeforeContact(order, sectionId));
  next.hiddenSections = getHiddenPortfolioSections(source).filter((candidate) => candidate !== sectionId);
  return next;
}

export function createCustomSectionTemplate(id: string): NonNullable<PortfolioContent["customSections"]>[number] {
  return {
    id,
    eyebrow: "New section",
    title: "A new portfolio section",
    body: "Add the context, result, or story you want visitors to see here.",
  };
}

export function appendCustomPortfolioSection(source: PortfolioContent): PortfolioContent {
  const existing = source.customSections ?? [];
  let number = existing.length + 1;
  let id = `custom-${number}`;
  while (existing.some((section) => section.id === id)) {
    number += 1;
    id = `custom-${number}`;
  }
  const customSections = [...existing, createCustomSectionTemplate(id)];
  const sectionOrder = insertBeforeContact(getPortfolioSectionOrder(source), id);
  return { ...source, customSections, sectionOrder };
}

export function removeWritingArticle(source: PortfolioContent, articleIndex: number): PortfolioContent {
  return removeListItem(source, ["writing"], articleIndex);
}
