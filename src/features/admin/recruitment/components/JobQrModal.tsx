import { useEffect, useState, useCallback, useRef } from "react";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  RefreshCw,
  AlertCircle,
  Scan,
  FileCode,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/utils";
import { recruitmentApi } from "@/services/recruitmentApi";

interface JobQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle?: string;
}

function buildPublicApplyUrl(rawUrl?: string | null, ukey?: string | null): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (rawUrl && /^https?:\/\//i.test(rawUrl)) return rawUrl;
  if (rawUrl && rawUrl.startsWith("/")) return `${origin}${rawUrl}`;
  if (ukey) return `${origin}/jobs/apply/${ukey}`;
  return "";
}

export function JobQrModal({
  open,
  onOpenChange,
  jobId,
  jobTitle = "Job Opening",
}: JobQrModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [svgMarkup, setSvgMarkup] = useState<string>("");
  const [applyUrl, setApplyUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeObjectUrl();
    };
  }, [revokeObjectUrl]);

  const fetchBackendQr = useCallback(async () => {
    if (!jobId) {
      setError("Missing Job ID for QR generation.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    revokeObjectUrl();
    setQrImageUrl("");
    setSvgMarkup("");

    try {
      const [qrRes, linkRes] = await Promise.allSettled([
        recruitmentApi.getJobQr(jobId),
        recruitmentApi.getSourcingLink(jobId),
      ]);

      if (qrRes.status === "rejected") {
        throw qrRes.reason;
      }

      const qrPayload = (qrRes.value || {}) as Record<string, unknown>;
      const linkPayload =
        linkRes.status === "fulfilled"
          ? ((linkRes.value || {}) as Record<string, unknown>)
          : {};

      const resolvedUrl = buildPublicApplyUrl(
        (linkPayload.sourcing_link ??
          linkPayload.apply_url ??
          linkPayload.url ??
          qrPayload.apply_url ??
          qrPayload.url) as string | undefined,
        (linkPayload.unique_key ?? linkPayload.ukey ?? qrPayload.ukey) as string | undefined,
      );
      setApplyUrl(resolvedUrl || `${window.location.origin}/jobs/apply/${jobId}`);

      if (typeof qrPayload.objectUrl === "string" && qrPayload.objectUrl) {
        objectUrlRef.current = qrPayload.objectUrl;
        setQrImageUrl(qrPayload.objectUrl);
      } else if (typeof qrPayload.qr_data_url === "string" || typeof qrPayload.data_url === "string") {
        setQrImageUrl(String(qrPayload.qr_data_url ?? qrPayload.data_url));
      } else if (typeof qrPayload.qr_url === "string" || typeof qrPayload.image_url === "string") {
        setQrImageUrl(String(qrPayload.qr_url ?? qrPayload.image_url));
      } else if (typeof qrPayload.qr_base64 === "string" || typeof qrPayload.qr_code === "string") {
        const rawCode = String(qrPayload.qr_base64 ?? qrPayload.qr_code);
        if (rawCode.trim().startsWith("<svg")) {
          setSvgMarkup(rawCode);
          const blob = new Blob([rawCode], { type: "image/svg+xml" });
          const blobUrl = URL.createObjectURL(blob);
          objectUrlRef.current = blobUrl;
          setQrImageUrl(blobUrl);
        } else {
          setQrImageUrl(
            rawCode.startsWith("data:") ? rawCode : `data:image/png;base64,${rawCode}`,
          );
        }
      } else if (typeof qrPayload.qr_svg === "string") {
        setSvgMarkup(qrPayload.qr_svg);
        const blob = new Blob([qrPayload.qr_svg], { type: "image/svg+xml" });
        const blobUrl = URL.createObjectURL(blob);
        objectUrlRef.current = blobUrl;
        setQrImageUrl(blobUrl);
      } else {
        throw new Error("Backend returned an unrecognized QR payload format.");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load job QR code from backend."));
    } finally {
      setLoading(false);
    }
  }, [jobId, revokeObjectUrl]);

  useEffect(() => {
    if (open) {
      void fetchBackendQr();
    }
  }, [open, fetchBackendQr]);

  const handleCopyLink = async () => {
    if (!applyUrl) return;
    try {
      await navigator.clipboard.writeText(applyUrl);
      setCopied(true);
      toast.success("Job link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleDownloadImage = () => {
    if (!qrImageUrl) return;
    const link = document.createElement("a");
    link.href = qrImageUrl;
    const safeTitle = jobTitle.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    link.download = `qr_${safeTitle || "job"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR image downloaded!");
  };

  const handleDownloadSvg = () => {
    if (!svgMarkup) {
      handleDownloadImage();
      return;
    }
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = jobTitle.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    link.download = `qr_${safeTitle || "job"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("SVG QR code downloaded!");
  };

  const handlePrint = () => {
    if (!qrImageUrl) return;
    const printWin = window.open("", "_blank", "width=600,height=650");
    if (!printWin) {
      toast.error("Pop-up blocked. Please allow pop-ups to print.");
      return;
    }
    const doc = printWin.document;
    doc.open();
    const html = doc.createElement("html");
    const head = doc.createElement("head");
    const titleEl = doc.createElement("title");
    titleEl.textContent = `QR Poster - ${jobTitle}`;
    head.appendChild(titleEl);
    const body = doc.createElement("body");
    body.style.fontFamily = "system-ui, sans-serif";
    body.style.display = "flex";
    body.style.flexDirection = "column";
    body.style.alignItems = "center";
    body.style.justifyContent = "center";
    body.style.minHeight = "100vh";
    body.style.textAlign = "center";
    const h1 = doc.createElement("h1");
    h1.textContent = jobTitle;
    const p = doc.createElement("p");
    p.textContent = "Scan with your mobile phone camera to apply.";
    const img = doc.createElement("img");
    img.src = qrImageUrl;
    img.style.width = "260px";
    img.style.height = "260px";
    const urlDiv = doc.createElement("div");
    urlDiv.style.marginTop = "16px";
    urlDiv.style.fontSize = "12px";
    urlDiv.style.color = "#475569";
    urlDiv.textContent = applyUrl;
    body.append(h1, p, img, urlDiv);
    html.append(head, body);
    doc.appendChild(html);
    doc.close();
    setTimeout(() => {
      printWin.print();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="backdrop-blur-md bg-black/85"
        className="w-[calc(100vw-1.5rem)] max-w-[360px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 gap-0 space-y-2.5 sm:space-y-3 rounded-2xl bg-card border border-border shadow-2xl text-left box-border"
      >
        <DialogHeader className="space-y-0 text-left w-full min-w-0">
          <div className="flex items-center gap-2.5 pr-6 w-full min-w-0">
            <span className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <QrCode className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </span>
            <div className="min-w-0 flex-1 overflow-hidden">
              <DialogTitle className="text-sm sm:text-base font-semibold text-foreground leading-tight tracking-tight truncate block">
                Job QR Code
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-normal truncate block">
                Share or print this backend-generated QR code for instant application.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {jobTitle && (
          <div className="w-full min-w-0 flex items-center justify-between rounded-xl bg-muted/60 border border-border px-2.5 py-1.5 gap-2 overflow-hidden">
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-[9px] uppercase font-semibold tracking-wider text-muted-foreground/80 block leading-tight">
                Target Role
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground truncate block leading-tight">
                {jobTitle}
              </span>
            </div>
            <span className="shrink-0 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/25 whitespace-nowrap">
              Public Link
            </span>
          </div>
        )}

        <div className="w-full min-w-0 pt-0.5 pb-0 flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-2">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs font-medium text-muted-foreground">
                Fetching QR code...
              </p>
            </div>
          ) : error ? (
            <div role="alert" className="flex flex-col items-center justify-center py-5 space-y-2 text-center w-full min-w-0">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void fetchBackendQr()}
                className="text-xs gap-1.5 h-8"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full min-w-0">
              <div className="rounded-xl bg-white shadow-md border border-slate-200/80 inline-flex items-center justify-center aspect-square p-2.5 sm:p-3 w-36 h-36 sm:w-40 sm:h-40">
                <img
                  src={qrImageUrl}
                  alt={`QR code for ${jobTitle} job application`}
                  className="w-full h-full object-contain block"
                />
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-foreground/90">
                <Scan className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Scan with phone camera to apply</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full min-w-0 flex items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-muted/60 px-2.5 py-1.5 overflow-hidden">
          <span
            className="flex-1 min-w-0 font-mono text-[10px] sm:text-[11px] text-muted-foreground select-all truncate block overflow-hidden"
            title={applyUrl}
          >
            {applyUrl || "—"}
          </span>
          <Button
            size="sm"
            variant={copied ? "default" : "secondary"}
            disabled={!applyUrl}
            onClick={handleCopyLink}
            aria-label={copied ? "Link copied" : "Copy job application link"}
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full min-w-0 pt-0.5">
          <Button
            size="sm"
            variant="outline"
            className="h-8 sm:h-9 text-xs gap-1"
            onClick={handleDownloadImage}
            disabled={loading || !!error || !qrImageUrl}
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>Image</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 sm:h-9 text-xs gap-1"
            onClick={handleDownloadSvg}
            disabled={loading || !!error || !qrImageUrl}
          >
            <FileCode className="h-3.5 w-3.5 shrink-0" />
            <span>SVG</span>
          </Button>

          <Button
            size="sm"
            variant="default"
            className="h-8 sm:h-9 text-xs font-semibold gap-1"
            onClick={handlePrint}
            disabled={loading || !!error || !qrImageUrl}
          >
            <Printer className="h-3.5 w-3.5 shrink-0" />
            <span>Print</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
