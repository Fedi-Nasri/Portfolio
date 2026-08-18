import { desc, eq } from "drizzle-orm";
import { DEFAULT_PORTFOLIO_CONTENT, type PortfolioContent } from "../shared/portfolio";
import { portfolioContentVersions } from "../drizzle/schema";
import { getDb } from "./db";

const DIRECT_EDITOR_ID = 1;

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

export async function getPublishedPortfolioContent(): Promise<PortfolioContent> {
  const db = await getDb();
  if (!db) return cloneDefaultContent();
  const versions = await db.select().from(portfolioContentVersions)
    .where(eq(portfolioContentVersions.status, "published"))
    .orderBy(desc(portfolioContentVersions.publishedAt), desc(portfolioContentVersions.id))
    .limit(1);
  return versions[0] ? normalizeContent(versions[0].contentJson) : cloneDefaultContent();
}

export async function getEditorPortfolioContent(): Promise<{ content: PortfolioContent; source: "draft" | "published" | "seeded" }> {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const draft = await db.select().from(portfolioContentVersions)
    .where(eq(portfolioContentVersions.status, "draft"))
    .orderBy(desc(portfolioContentVersions.updatedAt), desc(portfolioContentVersions.id))
    .limit(1);
  if (draft[0]) return { content: normalizeContent(draft[0].contentJson), source: "draft" };
  const published = await db.select().from(portfolioContentVersions)
    .where(eq(portfolioContentVersions.status, "published"))
    .orderBy(desc(portfolioContentVersions.publishedAt), desc(portfolioContentVersions.id))
    .limit(1);
  if (published[0]) return { content: normalizeContent(published[0].contentJson), source: "published" };
  const initialContent = cloneDefaultContent();
  await db.insert(portfolioContentVersions).values([
    { status: "draft", contentJson: initialContent, createdBy: DIRECT_EDITOR_ID, updatedBy: DIRECT_EDITOR_ID },
    { status: "published", contentJson: initialContent, createdBy: DIRECT_EDITOR_ID, updatedBy: DIRECT_EDITOR_ID, publishedAt: new Date() },
  ]);
  return { content: initialContent, source: "seeded" };
}

export async function savePortfolioDraft(content: unknown): Promise<PortfolioContent> {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const nextContent = normalizeContent(content);
  const draft = await db.select({ id: portfolioContentVersions.id }).from(portfolioContentVersions)
    .where(eq(portfolioContentVersions.status, "draft"))
    .orderBy(desc(portfolioContentVersions.updatedAt), desc(portfolioContentVersions.id))
    .limit(1);
  if (draft[0]) {
    await db.update(portfolioContentVersions).set({ contentJson: nextContent, updatedBy: DIRECT_EDITOR_ID }).where(eq(portfolioContentVersions.id, draft[0].id));
  } else {
    await db.insert(portfolioContentVersions).values({ status: "draft", contentJson: nextContent, createdBy: DIRECT_EDITOR_ID, updatedBy: DIRECT_EDITOR_ID });
  }
  return nextContent;
}

export async function publishPortfolioContent(content: unknown): Promise<PortfolioContent> {
  const db = await getDb();
  if (!db) throw new Error("The database is unavailable.");
  const nextContent = await savePortfolioDraft(content);
  await db.insert(portfolioContentVersions).values({ status: "published", contentJson: nextContent, createdBy: DIRECT_EDITOR_ID, updatedBy: DIRECT_EDITOR_ID, publishedAt: new Date() });
  return nextContent;
}
