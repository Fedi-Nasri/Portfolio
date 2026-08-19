import React, { useState } from "react";
import { Download, FileArchive, FileCode2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioContent } from "@shared/portfolio";
import { downloadPortfolioExport } from "@/lib/portfolioExport";
import "./portfolio-export-actions.css";

export function PortfolioExportActions({ content }: { content: PortfolioContent }) {
  const [exporting, setExporting] = useState<"html" | "zip" | null>(null);
  const runExport = async (format: "html" | "zip") => {
    setExporting(format);
    try { const result = await downloadPortfolioExport(content, format); toast.success(`${format === "html" ? "HTML" : "ZIP"} export downloaded${result.assetCount ? ` with ${result.assetCount} embedded image${result.assetCount === 1 ? "" : "s"}` : ""}`); }
    catch { toast.error("Export could not be created. Please try again."); }
    finally { setExporting(null); }
  };
  return <aside className="portfolio-export-actions" aria-label="Portfolio export"><span><Download size={14} /> Export portfolio</span><button type="button" onClick={() => runExport("html")} disabled={exporting !== null}><FileCode2 size={14} /> {exporting === "html" ? <Loader2 className="spin" size={14} /> : "HTML"}</button><button type="button" onClick={() => runExport("zip")} disabled={exporting !== null}><FileArchive size={14} /> {exporting === "zip" ? <Loader2 className="spin" size={14} /> : "ZIP"}</button></aside>;
}
