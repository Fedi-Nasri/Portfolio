import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("direct portfolio editor access", () => {
  it("loads an editable portfolio document without a signed-in user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.portfolio.editorContent()).resolves.toMatchObject({
      content: { hero: { firstName: "Fedi" } },
    });
  });
});
