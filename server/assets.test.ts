import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = { user: null, req: { protocol: "https", headers: {} }, res: {} } as TrpcContext;

describe("direct portfolio asset upload validation", () => {
  it("rejects non-image uploads before reaching storage", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.assets.upload({ fileName: "notes.txt", contentType: "text/plain", base64: "aGVsbG8=", category: "portrait" })).rejects.toThrow("Use a JPG, PNG, WebP, GIF, or SVG image.");
  });

  it("accepts the project-image category at the router before shared file validation", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.assets.upload({ fileName: "notes.txt", contentType: "text/plain", base64: "aGVsbG8=", category: "project-image" })).rejects.toThrow("Use a JPG, PNG, WebP, GIF, or SVG image.");
  });

  it("accepts certificate-PDF, provider-logo, and company-logo categories at the router before shared file validation", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.assets.upload({ fileName: "notes.txt", contentType: "text/plain", base64: "aGVsbG8=", category: "certificate-pdf" })).rejects.toThrow("Use a PDF document for a certificate.");
    await expect(caller.assets.upload({ fileName: "notes.txt", contentType: "text/plain", base64: "aGVsbG8=", category: "provider-logo" })).rejects.toThrow("Use a JPG, PNG, WebP, GIF, or SVG image.");
    await expect(caller.assets.upload({ fileName: "notes.txt", contentType: "text/plain", base64: "aGVsbG8=", category: "company-logo" })).rejects.toThrow("Use a JPG, PNG, WebP, GIF, or SVG image.");
  });
});
