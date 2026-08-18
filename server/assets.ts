import { storagePut } from "./storage";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadPortfolioImage(input: { fileName: string; contentType: string; base64: string; category: "portrait" | "focus-visual" }) {
  if (!ACCEPTED_IMAGE_TYPES.has(input.contentType)) throw new Error("Use a JPG, PNG, WebP, GIF, or SVG image.");
  const data = Buffer.from(input.base64, "base64");
  if (!data.length || data.length > MAX_IMAGE_BYTES) throw new Error("Images must be smaller than 5 MB.");
  const extension = input.contentType === "image/svg+xml" ? "svg" : input.contentType.split("/")[1] ?? "png";
  const safeName = input.fileName.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 48) || "portfolio-image";
  return storagePut(`portfolio-editor/${input.category}/${safeName}.${extension}`, data, input.contentType);
}
