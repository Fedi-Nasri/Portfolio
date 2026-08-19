import { describe, expect, it } from "vitest";
import { appendCertificate, appendWritingArticle, duplicateListItem, insertProjectTemplate } from "../client/src/lib/editorContent";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

async function createIsolatedDraft(caller: ReturnType<typeof appRouter.createCaller>, name: string) {
  const workspace = await caller.portfolio.editorContent();
  const publicDraftKey = workspace.drafts.find((draft) => draft.isPublic)?.key ?? workspace.activeDraftKey;
  const created = await caller.portfolio.createDraft({ name, sourceDraftKey: workspace.activeDraftKey });
  return { draftKey: created.activeDraftKey, original: created.content, publicDraftKey };
}

async function removeIsolatedDraft(caller: ReturnType<typeof appRouter.createCaller>, draftKey: string, publicDraftKey: string) {
  await caller.portfolio.selectPublicDraft({ draftKey: publicDraftKey });
  const workspace = await caller.portfolio.editorContent();
  const isolated = workspace.drafts.find((draft) => draft.key === draftKey);
  if (isolated && !isolated.isPublic) await caller.portfolio.deleteDraft({ draftKey });
}

describe("direct editor save and publish flow", () => {
  it("creates named drafts with version history, supports public selection, and deletes non-public drafts safely", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const originalWorkspace = await caller.portfolio.editorContent();
    const originalPublicKey = originalWorkspace.drafts.find((draft) => draft.isPublic)?.key ?? originalWorkspace.activeDraftKey;
    const draftName = `Automated draft ${Date.now()}`;
    const created = await caller.portfolio.createDraft({ name: draftName, sourceDraftKey: originalWorkspace.activeDraftKey });
    const draftKey = created.activeDraftKey;
    const changed = structuredClone(created.content);
    changed.hero.hello = "Automated multi-draft verification";

    try {
      const saved = await caller.portfolio.saveDraft({ draftKey, content: changed, note: "Added automatic multi-draft label" });
      expect(saved.versionNumber).toBe(2);

      const workspace = await caller.portfolio.editorContent({ draftKey });
      expect(workspace.activeDraftName).toBe(draftName);
      expect(workspace.versions.map((version) => version.number)).toEqual([2, 1]);
      expect(workspace.versions[0]?.note).toBe("Added automatic multi-draft label");

      const firstVersion = await caller.portfolio.loadDraftVersion({ draftKey, versionNumber: 1 });
      expect(firstVersion.content.hero.hello).toBe(created.content.hero.hello);

      await caller.portfolio.updateDraftVersionNote({ draftKey, versionNumber: 1, note: "Baseline before automation" });
      expect((await caller.portfolio.editorContent({ draftKey })).versions.find((version) => version.number === 1)?.note).toBe("Baseline before automation");

      await caller.portfolio.selectPublicDraft({ draftKey });
      expect((await caller.portfolio.publicContent()).hero.hello).toBe("Automated multi-draft verification");

      const restored = await caller.portfolio.restoreDraftVersion({ draftKey, versionNumber: 1 });
      expect(restored).toMatchObject({ draftKey, versionNumber: 3, restoredFromVersion: 1 });
      expect(restored.content.hero.hello).toBe(created.content.hero.hello);
      const restoredWorkspace = await caller.portfolio.editorContent({ draftKey });
      expect(restoredWorkspace.versions.map((version) => version.number)).toEqual([3, 2, 1]);
      expect(restoredWorkspace.versions[0]?.note).toBe("Restored from version 1");
      expect(restoredWorkspace.versions.find((version) => version.number === 1)?.note).toBe("Baseline before automation");
      expect((await caller.portfolio.loadDraftVersion({ draftKey, versionNumber: 2 })).content.hero.hello).toBe("Automated multi-draft verification");

      await caller.portfolio.selectPublicDraft({ draftKey: originalPublicKey });
      await caller.portfolio.deleteDraft({ draftKey });
      expect((await caller.portfolio.editorContent()).drafts.some((draft) => draft.key === draftKey)).toBe(false);
    } finally {
      const current = await caller.portfolio.editorContent();
      if (current.drafts.some((draft) => draft.key === draftKey && !draft.isPublic)) await caller.portfolio.deleteDraft({ draftKey });
      await caller.portfolio.selectPublicDraft({ draftKey: originalPublicKey });
    }
  });

  it("persists a list-control draft, publishes it publicly, and restores the original document", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const { draftKey, original, publicDraftKey } = await createIsolatedDraft(caller, `List control test ${Date.now()}`);
    const changed = duplicateListItem(original, ["writing"], 0);
    changed.hero.hello = "Automated editor flow verification";

    try {
      await caller.portfolio.saveDraft({ content: changed, draftKey });
      const saved = (await caller.portfolio.editorContent({ draftKey })).content;
      expect(saved.writing).toHaveLength(original.writing.length + 1);
      expect(saved.hero.hello).toBe("Automated editor flow verification");

      await caller.portfolio.publish({ content: changed, draftKey });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.hero.hello).toBe("Automated editor flow verification");
    } finally {
      await removeIsolatedDraft(caller, draftKey, publicDraftKey);
    }
  });

  it("persists and publishes an inserted Selected Work template, then restores the saved portfolio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const { draftKey, original, publicDraftKey } = await createIsolatedDraft(caller, `Project test ${Date.now()}`);
    const changed = insertProjectTemplate(original, original.projects.length - 1, "below");
    const projectIndex = changed.projects.length - 1;
    changed.projects[projectIndex]!.title = "Automated Selected Work verification";
    changed.projects[projectIndex]!.caseStudyBlocks = ["problem", "realization"];
    changed.projects[projectIndex]!.tech = ["Verification tech"];
    changed.projects[projectIndex]!.delivery = ["Verification delivery"];

    try {
      await caller.portfolio.saveDraft({ content: changed, draftKey });
      const saved = (await caller.portfolio.editorContent({ draftKey })).content;
      expect(saved.projects).toHaveLength(original.projects.length + 1);
      expect(saved.projects.at(-1)).toMatchObject({ title: "Automated Selected Work verification", caseStudyBlocks: ["problem", "realization"], tech: ["Verification tech"], delivery: ["Verification delivery"] });

      await caller.portfolio.publish({ content: changed, draftKey });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.projects.at(-1)?.title).toBe("Automated Selected Work verification");
      expect(publicContent.projects.at(-1)?.caseStudyBlocks).toEqual(["problem", "realization"]);
    } finally {
      await removeIsolatedDraft(caller, draftKey, publicDraftKey);
    }
  });

  it("persists and publishes a managed certificate template, then restores the saved portfolio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const { draftKey, original, publicDraftKey } = await createIsolatedDraft(caller, `Certificate test ${Date.now()}`);
    const changed = appendCertificate(original);
    const certificateIndex = changed.certifications.length - 1;
    changed.certifications[certificateIndex] = { ...changed.certifications[certificateIndex]!, name: "Automated certificate management verification", provider: "custom", providerLabel: "Verification Institute", pdf: "/manus-storage/verification-certificate.pdf", url: "https://example.com/credential" };
    try {
      await caller.portfolio.saveDraft({ content: changed, draftKey });
      const saved = (await caller.portfolio.editorContent({ draftKey })).content;
      expect(saved.certifications.at(-1)).toMatchObject({ name: "Automated certificate management verification", provider: "custom", providerLabel: "Verification Institute", pdf: "/manus-storage/verification-certificate.pdf", url: "https://example.com/credential" });
      await caller.portfolio.publish({ content: changed, draftKey });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.certifications.at(-1)?.name).toBe("Automated certificate management verification");
      expect(publicContent.certifications.at(-1)?.url).toBe("https://example.com/credential");
    } finally { await removeIsolatedDraft(caller, draftKey, publicDraftKey); }
  });

  it("persists and publishes a managed featured article with site metadata and an external link, then restores the saved portfolio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const { draftKey, original, publicDraftKey } = await createIsolatedDraft(caller, `Writing test ${Date.now()}`);
    const changed = appendWritingArticle(original);
    const articleIndex = changed.writing.length - 1;
    changed.writing[articleIndex] = { ...changed.writing[articleIndex]!, title: "Automated Writing management verification", siteName: "Verification publication", date: "Aug 19, 2026", url: "https://example.com/featured-article" };
    try {
      await caller.portfolio.saveDraft({ content: changed, draftKey });
      const saved = (await caller.portfolio.editorContent({ draftKey })).content;
      expect(saved.writing.at(-1)).toMatchObject({ title: "Automated Writing management verification", siteName: "Verification publication", date: "Aug 19, 2026", url: "https://example.com/featured-article" });
      await caller.portfolio.publish({ content: changed, draftKey });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.writing.at(-1)?.siteName).toBe("Verification publication");
      expect(publicContent.writing.at(-1)?.url).toBe("https://example.com/featured-article");
    } finally { await removeIsolatedDraft(caller, draftKey, publicDraftKey); }
  });
});
