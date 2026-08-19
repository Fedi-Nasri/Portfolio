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

describe("direct editor save and publish flow", () => {
  it("persists a list-control draft, publishes it publicly, and restores the original document", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const original = (await caller.portfolio.editorContent()).content;
    const changed = duplicateListItem(original, ["writing"], 0);
    changed.hero.hello = "Automated editor flow verification";

    try {
      await caller.portfolio.saveDraft({ content: changed });
      const saved = (await caller.portfolio.editorContent()).content;
      expect(saved.writing).toHaveLength(original.writing.length + 1);
      expect(saved.hero.hello).toBe("Automated editor flow verification");

      await caller.portfolio.publish({ content: changed });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.hero.hello).toBe("Automated editor flow verification");
    } finally {
      await caller.portfolio.saveDraft({ content: original });
      await caller.portfolio.publish({ content: original });
    }
  });

  it("persists and publishes an inserted Selected Work template, then restores the saved portfolio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const original = (await caller.portfolio.editorContent()).content;
    const changed = insertProjectTemplate(original, original.projects.length - 1, "below");
    const projectIndex = changed.projects.length - 1;
    changed.projects[projectIndex]!.title = "Automated Selected Work verification";
    changed.projects[projectIndex]!.caseStudyBlocks = ["problem", "realization"];
    changed.projects[projectIndex]!.tech = ["Verification tech"];
    changed.projects[projectIndex]!.delivery = ["Verification delivery"];

    try {
      await caller.portfolio.saveDraft({ content: changed });
      const saved = (await caller.portfolio.editorContent()).content;
      expect(saved.projects).toHaveLength(original.projects.length + 1);
      expect(saved.projects.at(-1)).toMatchObject({ title: "Automated Selected Work verification", caseStudyBlocks: ["problem", "realization"], tech: ["Verification tech"], delivery: ["Verification delivery"] });

      await caller.portfolio.publish({ content: changed });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.projects.at(-1)?.title).toBe("Automated Selected Work verification");
      expect(publicContent.projects.at(-1)?.caseStudyBlocks).toEqual(["problem", "realization"]);
    } finally {
      await caller.portfolio.saveDraft({ content: original });
      await caller.portfolio.publish({ content: original });
    }
  });

  it("persists and publishes a managed certificate template, then restores the saved portfolio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const original = (await caller.portfolio.editorContent()).content;
    const changed = appendCertificate(original);
    const certificateIndex = changed.certifications.length - 1;
    changed.certifications[certificateIndex] = {
      ...changed.certifications[certificateIndex]!,
      name: "Automated certificate management verification",
      provider: "custom",
      providerLabel: "Verification Institute",
      pdf: "/manus-storage/verification-certificate.pdf",
      url: "https://example.com/credential",
    };

    try {
      await caller.portfolio.saveDraft({ content: changed });
      const saved = (await caller.portfolio.editorContent()).content;
      expect(saved.certifications.at(-1)).toMatchObject({ name: "Automated certificate management verification", provider: "custom", providerLabel: "Verification Institute", pdf: "/manus-storage/verification-certificate.pdf", url: "https://example.com/credential" });

      await caller.portfolio.publish({ content: changed });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.certifications.at(-1)?.name).toBe("Automated certificate management verification");
      expect(publicContent.certifications.at(-1)?.url).toBe("https://example.com/credential");
    } finally {
      await caller.portfolio.saveDraft({ content: original });
      await caller.portfolio.publish({ content: original });
    }
  });

  it("persists and publishes a managed featured article with site metadata and an external link, then restores the saved portfolio", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const original = (await caller.portfolio.editorContent()).content;
    const changed = appendWritingArticle(original);
    const articleIndex = changed.writing.length - 1;
    changed.writing[articleIndex] = {
      ...changed.writing[articleIndex]!,
      title: "Automated Writing management verification",
      siteName: "Verification publication",
      date: "Aug 19, 2026",
      url: "https://example.com/featured-article",
    };

    try {
      await caller.portfolio.saveDraft({ content: changed });
      const saved = (await caller.portfolio.editorContent()).content;
      expect(saved.writing.at(-1)).toMatchObject({ title: "Automated Writing management verification", siteName: "Verification publication", date: "Aug 19, 2026", url: "https://example.com/featured-article" });

      await caller.portfolio.publish({ content: changed });
      const publicContent = await caller.portfolio.publicContent();
      expect(publicContent.writing.at(-1)?.siteName).toBe("Verification publication");
      expect(publicContent.writing.at(-1)?.url).toBe("https://example.com/featured-article");
    } finally {
      await caller.portfolio.saveDraft({ content: original });
      await caller.portfolio.publish({ content: original });
    }
  });
});
