import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: { protocol: "https", headers: {} }, res: {} } as TrpcContext;

describe("direct portfolio asset upload validation", () => {
  it("rejects non-image uploads before reaching storage", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.assets.upload({ fileName: "notes.txt", contentType: "text/plain", base64: "aGVsbG8=", category: "portrait" })).rejects.toThrow("Use a JPG, PNG, WebP, GIF, or SVG image.");
  });
});
