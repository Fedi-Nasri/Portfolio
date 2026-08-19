import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { DEFAULT_PORTFOLIO_CONTENT, type PortfolioContent } from "../shared/portfolio";
import { portfolioContentVersions, portfolioDrafts, portfolioDraftVersions, type PortfolioDraft } from "../drizzle/schema";
import { getDb } from "./db";

const DIRECT_EDITOR_ID = 1;

export type PortfolioDraftSummary = { key: string; name: string; isPublic: boolean; versionCount: number; updatedAt: Date; latestVersion: number };
export type PortfolioDraftWorkspace = { content: PortfolioContent; source: "draft" | "published" | "seeded"; activeDraftKey: string; activeDraftName: string; activeVersionNumber: number; drafts: PortfolioDraftSummary[]; versions: { number: number; createdAt: Date }[] };

function cloneDefaultContent(): PortfolioContent {
  return structuredClone(DEFAULT_PORTFOLIO_CONTENT);
}

function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<PortfolioContent>;
  return Boolean(
    content.hero &&
    content.about &&
    Array.isArray(content.experience) &&
    Array.isArray(content.skills) &&
    Array.isArray(content.certifications) &&
    Array.isArray(content.projects) &&
    Array.isArray(content.writing),
  );
}

function normalizeContent(content: unknown): PortfolioContent {
  if (!isPortfolioContent(content)) {
    throw new Error("The portfolio content document is incomplete.");
  }
  return content;
}

async function latestLegacyContent(): Promise<{ content: PortfolioContent; source: "draft" | "published" | "seeded" }> {
  const db = await getDb();
  if (!db) return { content: cloneDefaultContent(), source: "seeded" };
  const versions = await db.select().from(portfolioContentVersions)
    .where(eq(portfolioContentVersions.status, "published"))
    .orderBy(desc(portfolioContentVersions.publishedAt), desc(portfolioContentVersions.id))
    .limit(1);
  if (versions[0]) return { content: normalizeContent(versions[0].contentJson), source: "published" };
  const drafts = await db.select().from(portfolioContentVersions)
    .where(eq(portfolioContentVersions.status, "draft"))
    .orderBy(desc(portfolioContentVersions.updatedAt), desc(portfolioContentVersions.id))
    .limit(1);
  return drafts[0] ? { content: normalizeContent(drafts[0].contentJson), source: "draft" } : { content: cloneDefaultContent(), source: "seeded" };
}

async function ensurePortfolioDrafts(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const existing = await db.select({ id: portfolioDrafts.id }).from(portfolioDrafts).limit(1);
  if (existing[0]) return;
  const legacy = await latestLegacyContent();
  const created = await db.insert(portfolioDrafts).values({ draftKey: "main", name: "Main portfolio", isPublic: true, createdBy: DIRECT_EDITOR_ID, updatedBy: DIRECT_EDITOR_ID });
  const draftId = Number(created[0].insertId);
  await db.insert(portfolioDraftVersions).values({ draftId, versionNumber: 1, contentJson: legacy.content, createdBy: DIRECT_EDITOR_ID });
}

async function listDraftSummaries(): Promise<PortfolioDraftSummary[]> {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const drafts = await db.select().from(portfolioDrafts).orderBy(desc(portfolioDrafts.isPublic), desc(portfolioDrafts.updatedAt), desc(portfolioDrafts.id));
  return Promise.all(drafts.map(async (draft) => {
    const versions = await db.select({ versionNumber: portfolioDraftVersions.versionNumber }).from(portfolioDraftVersions).where(eq(portfolioDraftVersions.draftId, draft.id)).orderBy(desc(portfolioDraftVersions.versionNumber));
    return { key: draft.draftKey, name: draft.name, isPublic: draft.isPublic, versionCount: versions.length, latestVersion: versions[0]?.versionNumber ?? 0, updatedAt: draft.updatedAt };
  }));
}

async function getDraftByKey(draftKey: string): Promise<PortfolioDraft> {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const drafts = await db.select().from(portfolioDrafts).where(eq(portfolioDrafts.draftKey, draftKey)).limit(1);
  if (!drafts[0]) throw new Error("This draft no longer exists.");
  return drafts[0];
}

async function getLatestDraftVersion(draftId: number) {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const versions = await db.select().from(portfolioDraftVersions).where(eq(portfolioDraftVersions.draftId, draftId)).orderBy(desc(portfolioDraftVersions.versionNumber), desc(portfolioDraftVersions.id)).limit(1);
  if (!versions[0]) throw new Error("This draft has no saved versions.");
  return versions[0];
}

export async function getEditorPortfolioContent(draftKey?: string): Promise<PortfolioDraftWorkspace> {
  await ensurePortfolioDrafts();
  const drafts = await listDraftSummaries();
  const activeSummary = drafts.find((draft) => draft.key === draftKey) ?? drafts.find((draft) => draft.isPublic) ?? drafts[0];
  if (!activeSummary) throw new Error("No portfolio drafts are available.");
  const activeDraft = await getDraftByKey(activeSummary.key);
  const latest = await getLatestDraftVersion(activeDraft.id);
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const versions = await db.select({ number: portfolioDraftVersions.versionNumber, createdAt: portfolioDraftVersions.createdAt }).from(portfolioDraftVersions).where(eq(portfolioDraftVersions.draftId, activeDraft.id)).orderBy(desc(portfolioDraftVersions.versionNumber));
  return { content: normalizeContent(latest.contentJson), source: activeDraft.isPublic ? "published" : "draft", activeDraftKey: activeDraft.draftKey, activeDraftName: activeDraft.name, activeVersionNumber: latest.versionNumber, drafts, versions };
}

export async function loadPortfolioDraftVersion(draftKey: string, versionNumber: number): Promise<{ content: PortfolioContent; draftKey: string; versionNumber: number }> {
  await ensurePortfolioDrafts();
  const draft = await getDraftByKey(draftKey);
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const versions = await db.select().from(portfolioDraftVersions).where(eq(portfolioDraftVersions.draftId, draft.id)).orderBy(desc(portfolioDraftVersions.versionNumber));
  const version = versions.find((candidate) => candidate.versionNumber === versionNumber);
  if (!version) throw new Error("This draft version no longer exists.");
  return { content: normalizeContent(version.contentJson), draftKey, versionNumber };
}

export async function savePortfolioDraft(content: unknown, draftKey?: string): Promise<{ content: PortfolioContent; versionNumber: number; draftKey: string }> {
  await ensurePortfolioDrafts();
  const nextContent = normalizeContent(content);
  const workspace = await getEditorPortfolioContent(draftKey);
  const draft = await getDraftByKey(workspace.activeDraftKey);
  const latest = await getLatestDraftVersion(draft.id);
  const nextVersion = latest.versionNumber + 1;
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  await db.insert(portfolioDraftVersions).values({ draftId: draft.id, versionNumber: nextVersion, contentJson: nextContent, createdBy: DIRECT_EDITOR_ID });
  await db.update(portfolioDrafts).set({ updatedBy: DIRECT_EDITOR_ID, updatedAt: new Date() }).where(eq(portfolioDrafts.id, draft.id));
  return { content: nextContent, versionNumber: nextVersion, draftKey: draft.draftKey };
}

export async function createPortfolioDraft(name: string, sourceDraftKey?: string): Promise<PortfolioDraftWorkspace> {
  await ensurePortfolioDrafts();
  const source = await getEditorPortfolioContent(sourceDraftKey);
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const created = await db.insert(portfolioDrafts).values({ draftKey: `draft-${randomUUID()}`, name: name.trim() || "Untitled draft", createdBy: DIRECT_EDITOR_ID, updatedBy: DIRECT_EDITOR_ID });
  const draftId = Number(created[0].insertId);
  const inserted = await db.select().from(portfolioDrafts).where(eq(portfolioDrafts.id, draftId)).limit(1);
  const draft = inserted[0];
  if (!draft) throw new Error("The new draft could not be created.");
  await db.insert(portfolioDraftVersions).values({ draftId, versionNumber: 1, contentJson: source.content, createdBy: DIRECT_EDITOR_ID });
  return getEditorPortfolioContent(draft.draftKey);
}

export async function renamePortfolioDraft(draftKey: string, name: string): Promise<void> {
  const draft = await getDraftByKey(draftKey);
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  await db.update(portfolioDrafts).set({ name: name.trim() || draft.name, updatedBy: DIRECT_EDITOR_ID, updatedAt: new Date() }).where(eq(portfolioDrafts.id, draft.id));
}

export async function deletePortfolioDraft(draftKey: string): Promise<void> {
  await ensurePortfolioDrafts();
  const draft = await getDraftByKey(draftKey);
  if (draft.isPublic) throw new Error("Choose another public draft before deleting this one.");
  const summaries = await listDraftSummaries();
  if (summaries.length <= 1) throw new Error("Keep at least one portfolio draft.");
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  await db.delete(portfolioDraftVersions).where(eq(portfolioDraftVersions.draftId, draft.id));
  await db.delete(portfolioDrafts).where(eq(portfolioDrafts.id, draft.id));
}

export async function selectPublicPortfolioDraft(draftKey: string): Promise<void> {
  await ensurePortfolioDrafts();
  const selected = await getDraftByKey(draftKey);
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  await db.update(portfolioDrafts).set({ isPublic: false });
  await db.update(portfolioDrafts).set({ isPublic: true, updatedBy: DIRECT_EDITOR_ID, updatedAt: new Date() }).where(eq(portfolioDrafts.id, selected.id));
}

export async function getPublishedPortfolioContent(): Promise<PortfolioContent> {
  const db = await getDb();
  if (!db) return cloneDefaultContent();
  const publicDraft = await db.select().from(portfolioDrafts).where(eq(portfolioDrafts.isPublic, true)).limit(1);
  if (publicDraft[0]) return normalizeContent((await getLatestDraftVersion(publicDraft[0].id)).contentJson);
  return (await latestLegacyContent()).content;
}

export async function publishPortfolioContent(content: unknown, draftKey?: string): Promise<PortfolioContent> {
  const saved = await savePortfolioDraft(content, draftKey);
  await selectPublicPortfolioDraft(saved.draftKey);
  return saved.content;
}
