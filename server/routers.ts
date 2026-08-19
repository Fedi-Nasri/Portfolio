import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createPortfolioDraft, deletePortfolioDraft, getEditorPortfolioContent, getPublishedPortfolioContent, loadPortfolioDraftVersion, publishPortfolioContent, renamePortfolioDraft, restorePortfolioDraftVersion, savePortfolioDraft, selectPublicPortfolioDraft, updatePortfolioDraftVersionNote } from "./portfolio";
import { uploadPortfolioAsset } from "./assets";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  portfolio: router({
    publicContent: publicProcedure.query(() => getPublishedPortfolioContent()),
    editorContent: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64).optional() }).optional()).query(({ input }) => getEditorPortfolioContent(input?.draftKey)),
    saveDraft: publicProcedure.input(z.object({ content: z.unknown(), draftKey: z.string().min(1).max(64).optional(), note: z.string().trim().max(500).optional() })).mutation(({ input }) => savePortfolioDraft(input.content, input.draftKey, input.note)),
    publish: publicProcedure.input(z.object({ content: z.unknown(), draftKey: z.string().min(1).max(64).optional(), note: z.string().trim().max(500).optional() })).mutation(({ input }) => publishPortfolioContent(input.content, input.draftKey, input.note)),
    createDraft: publicProcedure.input(z.object({ name: z.string().trim().min(1).max(120), sourceDraftKey: z.string().min(1).max(64).optional() })).mutation(({ input }) => createPortfolioDraft(input.name, input.sourceDraftKey)),
    renameDraft: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64), name: z.string().trim().min(1).max(120) })).mutation(({ input }) => renamePortfolioDraft(input.draftKey, input.name)),
    deleteDraft: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64) })).mutation(({ input }) => deletePortfolioDraft(input.draftKey)),
    selectPublicDraft: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64) })).mutation(({ input }) => selectPublicPortfolioDraft(input.draftKey)),
    loadDraftVersion: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64), versionNumber: z.number().int().min(1) })).mutation(({ input }) => loadPortfolioDraftVersion(input.draftKey, input.versionNumber)),
    restoreDraftVersion: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64), versionNumber: z.number().int().min(1), note: z.string().trim().max(500).optional() })).mutation(({ input }) => restorePortfolioDraftVersion(input.draftKey, input.versionNumber, input.note)),
    updateDraftVersionNote: publicProcedure.input(z.object({ draftKey: z.string().min(1).max(64), versionNumber: z.number().int().min(1), note: z.string().trim().max(500).optional() })).mutation(({ input }) => updatePortfolioDraftVersionNote(input.draftKey, input.versionNumber, input.note)),
  }),
  assets: router({
    upload: publicProcedure.input(z.object({ fileName: z.string().min(1).max(120), contentType: z.string(), base64: z.string().min(1), category: z.enum(["portrait", "focus-visual", "project-image", "provider-logo", "company-logo", "certificate-pdf"]) })).mutation(({ input }) => uploadPortfolioAsset(input)),
  }),
});

export type AppRouter = typeof appRouter;
