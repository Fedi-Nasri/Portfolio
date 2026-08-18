import { describe, expect, it } from "vitest";
import { duplicateListItem } from "../client/src/lib/editorContent";
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
});
