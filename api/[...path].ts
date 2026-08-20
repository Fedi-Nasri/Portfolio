import { createPortfolioApp } from "../server/_core/app";

// Vercel invokes this Express application for /api/*, including tRPC, storage,
// and any optional OAuth callback. Static files are served separately by Vercel.
export default createPortfolioApp();
