import { put } from "@vercel/blob";
import { portfolioMediaAssets } from "../drizzle/schema";
import { getDb } from "./db";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const PDF_CONTENT_TYPE = "application/pdf";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 12 * 1024 * 1024;
export type PortfolioAssetCategory = "portrait" | "focus-visual" | "project-image" | "canvas-image" | "provider-logo" | "company-logo" | "certificate-pdf";

export async function uploadPortfolioAsset(input: { fileName: string; contentType: string; base64: string; category: PortfolioAssetCategory }) {
  const isCertificatePdf = input.category === "certificate-pdf";
  if (isCertificatePdf && input.contentType !== PDF_CONTENT_TYPE) throw new Error("Use a PDF document for a certificate.");
  if (!isCertificatePdf && !ACCEPTED_IMAGE_TYPES.has(input.contentType)) throw new Error("Use a JPG, PNG, WebP, GIF, or SVG image.");
  const data = Buffer.from(input.base64, "base64");
  const maximumBytes = isCertificatePdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (!data.length || data.length > maximumBytes) throw new Error(isCertificatePdf ? "Certificate PDFs must be smaller than 12 MB." : "Images must be smaller than 5 MB.");
  const extension = isCertificatePdf ? "pdf" : input.contentType === "image/svg+xml" ? "svg" : input.contentType.split("/")[1] ?? "png";
  const safeName = input.fileName.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 48) || (isCertificatePdf ? "certificate" : "portfolio-image");
  const db = await getDb();
  if (!db) throw new Error("Database metadata storage is unavailable. Configure a PostgreSQL DATABASE_URL before uploading media.");
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Vercel Blob is not configured. Connect the Blob store and add BLOB_READ_WRITE_TOKEN.");

  const blob = await put(`portfolio-editor/${input.category}/${safeName}.${extension}`, data, {
    access: "public",
    addRandomSuffix: true,
    contentType: input.contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const inserted = await db
    .insert(portfolioMediaAssets)
    .values({
      storageKey: blob.pathname,
      url: blob.url,
      fileName: input.fileName.slice(0, 255),
      contentType: input.contentType,
      category: input.category,
      sizeBytes: data.length,
    })
    .returning({ id: portfolioMediaAssets.id });

  return { id: inserted[0]?.id, key: blob.pathname, url: blob.url };
}

export const uploadPortfolioImage = uploadPortfolioAsset;
