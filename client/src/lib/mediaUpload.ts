/**
 * The editor currently transports files through a Base64 tRPC payload. Keep
 * ordinary images untouched, but re-encode oversized raster images before
 * sending them so Vercel's request-size limit is not reached before Blob.
 */
export const INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES = 2_400_000;

const PREPARED_IMAGE_TYPE = "image/webp";
const PREPARED_IMAGE_QUALITY = 0.82;

export function needsInlineImagePreparation(file: Pick<File, "size" | "type">) {
  return file.type.startsWith("image/") && file.type !== "image/svg+xml" && file.size > INLINE_IMAGE_PREPARATION_THRESHOLD_BYTES;
}

export function preparedImageFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^/.]+$/, "") || "portfolio-image";
  return `${baseName}-upload.webp`;
}

function loadImage(sourceUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The selected image could not be prepared for upload."));
    image.src = sourceUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, PREPARED_IMAGE_TYPE, PREPARED_IMAGE_QUALITY));
}

/**
 * Preserves the original pixel dimensions and all edges. It returns the input
 * file whenever it is already below the safe transport threshold, cannot be
 * prepared in the browser, or compression would not reduce its byte size.
 */
export async function prepareImageForInlineUpload(file: File): Promise<File> {
  if (!needsInlineImagePreparation(file) || typeof document === "undefined" || typeof URL === "undefined") return file;

  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(sourceUrl);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) return file;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(image, 0, 0, width, height);

    const prepared = await canvasToBlob(canvas);
    if (!prepared || prepared.size >= file.size) return file;
    return new File([prepared], preparedImageFileName(file.name), { type: PREPARED_IMAGE_TYPE, lastModified: file.lastModified });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
