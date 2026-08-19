import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getEditorPortfolioContent, getPublishedPortfolioContent, publishPortfolioContent, savePortfolioDraft } from "./portfolio";
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
    editorContent: publicProcedure.query(() => getEditorPortfolioContent()),
    saveDraft: publicProcedure.input(z.object({ content: z.unknown() })).mutation(({ input }) => savePortfolioDraft(input.content)),
    publish: publicProcedure.input(z.object({ content: z.unknown() })).mutation(({ input }) => publishPortfolioContent(input.content)),
  }),
  assets: router({
    upload: publicProcedure.input(z.object({ fileName: z.string().min(1).max(120), contentType: z.string(), base64: z.string().min(1), category: z.enum(["portrait", "focus-visual", "project-image", "provider-logo", "company-logo", "certificate-pdf"]) })).mutation(({ input }) => uploadPortfolioAsset(input)),
  }),
});

export type AppRouter = typeof appRouter;
