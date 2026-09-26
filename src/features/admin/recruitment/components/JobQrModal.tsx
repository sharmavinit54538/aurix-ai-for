import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  RefreshCw,
  AlertCircle,
  FileCode,
  Scan,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getJobApplicationUrl } from "@/lib/publicUrl";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

interface JobQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle?: string;
}

export function JobQrModal({
  open,
  onOpenChange,
  jobId,
  jobTitle = "Job Opening",
}: JobQrModalProps) {
  const { company } = useAurix();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pngDataUrl, setPngDataUrl] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Single source of truth for the job application URL
  const applyUrl = getJobApplicationUrl(jobId);

  // Generate safe filename for downloads
  const safeSlug = (jobTitle || "job")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const pngFilename = `${safeSlug || "job"}-${jobId}-qr.png`;
  const svgFilename = `${safeSlug || "job"}-${jobId}-qr.svg`;

  const generateQr = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Generate high-resolution PNG data URL for sharp display & download
      const pngUrl = await QRCode.toDataURL(applyUrl, {
        width: 600,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#090d16",
          light: "#ffffff",
        },
      });

      // 2. Generate crisp standalone SVG for vector download
      const svg = await QRCode.toString(applyUrl, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#090d16",
          light: "#ffffff",
        },
      });

      setPngDataUrl(pngUrl);
      setSvgString(svg);
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("QR Code Generation Error:", err);
      }
      setError("Unable to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [applyUrl, jobId]);

  useEffect(() => {
    if (open) {
      setCopied(false);
      generateQr();
    }
  }, [open, generateQr]);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(applyUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = applyUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Job application link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link. Please copy it manually.");
    }
  };

  const handleDownloadPng = () => {
    if (!pngDataUrl || typeof window === "undefined") return;
    try {
      const link = document.createElement("a");
      link.href = pngDataUrl;
      link.download = pngFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded as PNG!");
    } catch {
      toast.error("Failed to download PNG.");
    }
  };

  const handleDownloadSvg = () => {
    if (!svgString || typeof window === "undefined") return;
    try {
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = svgFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded as SVG!");
    } catch {
      toast.error("Failed to download SVG.");
    }
  };

  const handlePrint = () => {
    if (!pngDataUrl || typeof window === "undefined") return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups to print the QR code.");
      return;
    }

    const companyLogo = company?.logoDataUrl;
    const companyName = company?.name || "Careers";

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job QR Code - ${jobTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 30px 20px;
      text-align: center;
    }
    .print-card {
      border: 2px solid #e2e8f0;
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    }
    .company-logo {
      max-height: 48px;
      max-width: 180px;
      object-fit: contain;
      margin-bottom: 16px;
    }
    .company-name {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .job-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 24px;
    }
    .qr-frame {
      background: #ffffff;
      padding: 16px;
      border-radius: 20px;
      border: 1.5px solid #cbd5e1;
      display: inline-block;
      margin-bottom: 20px;
    }
    .qr-frame img {
      display: block;
      width: 240px;
      height: 240px;
    }
    .scan-badge {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .apply-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #475569;
      word-break: break-all;
      background: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      width: 100%;
    }
    @media print {
      body {
        min-height: auto;
        padding: 0;
      }
      .print-card {
        border: none;
        box-shadow: none;
        padding: 10px 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-card">
    ${companyLogo ? `<img src="${companyLogo}" alt="${companyName} Logo" class="company-logo" />` : `<div class="company-name">${companyName}</div>`}
    <h1 class="job-title">${jobTitle}</h1>
    <div class="qr-frame">
      <img src="${pngDataUrl}" alt="QR code for ${jobTitle} application" />
    </div>
    <div class="scan-badge">Scan to apply</div>
    <div class="apply-url">${applyUrl}</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.close();
      }, 350);
    };
  </script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] w-[calc(100vw-32px)] bg-card border border-border shadow-2xl p-6 rounded-2xl sm:rounded-3xl gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="space-y-1 text-left pb-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <QrCode className="h-4.5 w-4.5" />
            </span>
            <div>
              <DialogTitle className="text-base font-bold text-foreground leading-tight tracking-tight">
                Generate Job QR Code
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                Share or print this QR code for instant mobile job application.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Position Context Pill */}
        {jobTitle && (
          <div className="mt-1 mb-3 flex items-center justify-between rounded-xl bg-muted/60 border border-border px-3.5 py-2">
            <div className="min-w-0 flex-1 pr-2">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground/80 block">
                Target Role
              </span>
              <span className="text-xs font-bold text-foreground truncate block">
                {jobTitle}
              </span>
            </div>
            <span className="shrink-0 text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/25">
              Public Link
            </span>
          </div>
        )}

        {/* QR Showcase Area */}
        <div className="py-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs font-medium text-muted-foreground">Generating QR code...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
              <Button size="sm" variant="outline" onClick={generateQr} className="text-xs gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full space-y-3.5">
              {/* White QR Frame with subtle shadow and border */}
              <div className="relative rounded-2xl bg-white p-3.5 shadow-xl border border-slate-200/90 transition-transform duration-200 hover:scale-[1.01]">
                <img
                  src={pngDataUrl}
                  alt={`QR code for ${jobTitle} job application`}
                  aria-label={`QR code for ${jobTitle} job application`}
                  className="w-44 h-44 rounded-lg object-contain block"
                />
              </div>

              {/* Scan Subtitle */}
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground/90">
                <Scan className="h-3.5 w-3.5 text-primary" />
                <span>Scan with phone camera to apply</span>
              </div>

              {/* URL Display + Copy Button */}
              <div className="w-full">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/60 p-1.5 transition-colors focus-within:border-primary/50">
                  <span
                    className="flex-1 truncate font-mono text-[11px] text-muted-foreground select-all px-2"
                    title={applyUrl}
                  >
                    {applyUrl}
                  </span>
                  <Button
                    size="sm"
                    variant={copied ? "default" : "secondary"}
                    className={`h-7 px-3 text-xs shrink-0 font-medium transition-all ${
                      copied
                        ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                        : "hover:bg-accent"
                    }`}
                    onClick={handleCopyLink}
                    aria-label={copied ? "Link copied" : "Copy job application link"}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3.5 w-3.5" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: Clean 3-button grid */}
        <div className="mt-3 pt-3.5 border-t border-border grid grid-cols-3 gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs gap-1.5 h-9 font-medium"
            onClick={handleDownloadPng}
            disabled={loading || !!error}
            aria-label="Download QR code as PNG image"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs gap-1.5 h-9 font-medium"
            onClick={handleDownloadSvg}
            disabled={loading || !!error}
            aria-label="Download QR code as SVG vector"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Download SVG</span>
          </Button>

          <Button
            size="sm"
            variant="default"
            className="w-full text-xs gap-1.5 h-9 font-semibold"
            onClick={handlePrint}
            disabled={loading || !!error}
            aria-label="Print QR code"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
