import { useEffect, useRef, useState, useCallback } from "react";
import {
  Download,
  Maximize2,
  Minimize2,
  Printer,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { PayslipHistoryItem } from "@/services/payrollApi";

interface PayslipPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: PayslipHistoryItem | null;
  isLoading: boolean;
  onDownload: () => void;
  _onPrint?: () => void;
}

export function PayslipPreviewDialog({
  isOpen,
  onClose,
  payslip,
  isLoading,
  onDownload,
  _onPrint,
}: PayslipPreviewDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPdf = useCallback(async () => {
    if (!payslip?.runId || !payslip?.employeeId) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setPdfError(null);
    setPdfBlobUrl(null);

    try {
      const res = await fetch(
        `/api/v2/payroll/runs/${payslip.runId}/employees/${payslip.employeeId}/payslip/download`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          setPdfError("Payslip PDF not found. The payslip may not have been generated yet.");
        } else if (res.status === 401 || res.status === 403) {
          setPdfError("You are not authorized to view this payslip.");
        } else {
          setPdfError(`Failed to load payslip (${res.status}).`);
        }
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/pdf")) {
        setPdfError("Invalid response: Expected PDF document.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setPdfError("Network error while loading payslip PDF.");
    }
  }, [payslip]);

  useEffect(() => {
    if (isOpen && payslip) {
      fetchPdf();
    } else {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    }
    return () => {
      abortControllerRef.current?.abort();
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [isOpen, payslip, fetchPdf, pdfBlobUrl]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleFitWidth = () => setScale(1);
  const handleFitPage = () => setScale(0.75);
  const handleRotate = (direction: "cw" | "ccw") => {
    iframeRef.current?.contentWindow?.postMessage({ type: "rotate", direction }, "*");
  };

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  };

  const handleDownload = () => {
    onDownload();
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 m-0 overflow-hidden">
        <DialogHeader className="flex items-center justify-between p-3 border-b border-border bg-background sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <DialogTitle className="text-sm font-semibold text-foreground truncate">
              {payslip?.periodName ? `Payslip - ${payslip.periodName}` : "Payslip Preview"}
            </DialogTitle>
            {payslip && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                {payslip.employeeName && (
                  <span className="font-medium text-foreground">{payslip.employeeName}</span>
                )}
                {payslip.employeeId && (
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                    {payslip.employeeId}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                    className="h-8 w-8"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom Out</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFitWidth}
                    className="h-8 w-8"
                    aria-label="Fit to width"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Fit to Width</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFitPage}
                    className="h-8 w-8"
                    aria-label="Fit to page"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Fit to Page</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={scale >= 3}
                    className="h-8 w-8"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom In</TooltipContent>
              </Tooltip>

              <span className="text-xs font-mono text-muted-foreground w-16 text-center">
                {Math.round(scale * 100)}%
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRotate("ccw")}
                    className="h-8 w-8"
                    aria-label="Rotate counter-clockwise"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Rotate Left</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRotate("cw")}
                    className="h-8 w-8"
                    aria-label="Rotate clockwise"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Rotate Right</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrint}
                    disabled={isLoading || !pdfBlobUrl}
                    className="h-8 w-8"
                    aria-label="Print payslip"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Print</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                    disabled={isLoading || !pdfBlobUrl}
                    className="h-8 w-8"
                    aria-label="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Download PDF</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFullscreenToggle}
                    className="h-8 w-8"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                    aria-label="Close preview"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Close</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogHeader>

        <div
          className={`relative w-full h-[calc(100vh-140px)] ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}
          style={{ height: isFullscreen ? "100vh" : "calc(100vh - 140px)" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="space-y-3 text-center">
                <svg
                  className="animate-spin h-10 w-10 text-primary mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm text-muted-foreground">Loading payslip PDF...</p>
              </div>
            </div>
          ) : pdfError ? (
            <div className="flex items-center justify-center h-full p-6 text-center">
              <div className="max-w-md">
                <svg
                  className="h-12 w-12 text-destructive mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Payslip</h3>
                <p className="text-sm text-muted-foreground mb-4">{pdfError}</p>
                <Button variant="outline" size="sm" onClick={fetchPdf} className="gap-1.5">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </Button>
              </div>
            </div>
          ) : pdfBlobUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfBlobUrl}
              className="w-full h-full border-0"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                width: `${100 / scale}%`,
              }}
              title={`Payslip - ${payslip?.periodName || "Preview"}`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No payslip data available.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PayslipPreviewDialog;