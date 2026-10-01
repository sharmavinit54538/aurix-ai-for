import React from "react";
import {
  Folder,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  User,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { canDo } from "../lib/permissions";
import { useDocumentPreview } from "../hooks/useDocumentPreview";
import type { DocumentItem } from "../lib/types";

interface DocumentPreviewSheetProps {
  doc: DocumentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (doc: DocumentItem) => void;
  onRejectPrompt: (doc: DocumentItem) => void;
  onRequestReuploadPrompt: (doc: DocumentItem) => void;
  isVerifying: boolean;
  userRole?: string | null;
}

export const DocumentPreviewSheet: React.FC<DocumentPreviewSheetProps> = ({
  doc,
  open,
  onOpenChange,
  onVerify,
  onRejectPrompt,
  onRequestReuploadPrompt,
  isVerifying,
  userRole,
}) => {
  const { blobUrl, mimeType, isLoading, error, retry, download } = useDocumentPreview(open ? doc : null);

  if (!doc) return null;

  const isCompany = doc.source === "company";
  const canVerify = canDo(userRole, "verify");
  const canReject = canDo(userRole, "reject");
  const canRequestReupload = canDo(userRole, "requestReupload");

  const isImage =
    mimeType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp"].includes(doc.fileType);

  const isDocx = doc.fileType === "docx" || doc.fileType === "doc";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl [&>button.absolute]:hidden">
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/80 bg-card/40 backdrop-blur-md shrink-0 text-left space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-full border-border/80 bg-background/60 text-foreground/85 shadow-xs"
              >
                <Folder className="h-3 w-3 text-indigo-400 shrink-0" />
                {doc.categoryGroup}
              </Badge>
              {isCompany && (
                <Badge
                  variant="outline"
                  className="px-2 py-0.5 text-[10px] text-muted-foreground border-border"
                >
                  Company Document
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {doc.status === "VERIFIED" && (
                <Badge className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  Verified & Approved
                </Badge>
              )}
              {doc.status === "PENDING" && (
                <Badge className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  Pending Review
                </Badge>
              )}
              {doc.status === "REJECTED" && (
                <Badge className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  Rejected
                </Badge>
              )}
              {doc.status === "Published" && (
                <Badge className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-neutral-500/15 text-neutral-400 border border-neutral-500/30 shadow-xs">
                  Published
                </Badge>
              )}
              {doc.status === "Expired" && (
                <Badge className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-neutral-500/15 text-neutral-400 border border-neutral-500/30 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                  Expired
                </Badge>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-7 w-7 rounded-lg border border-border/80 bg-background/60 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 text-muted-foreground inline-flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 shadow-xs shrink-0"
                aria-label="Close document preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <SheetTitle className="font-display text-lg font-bold text-foreground truncate text-left tracking-tight mt-1 flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
            <span className="truncate">{doc.title}</span>
          </SheetTitle>

          <SheetDescription className="text-xs text-muted-foreground text-left mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1 font-medium text-foreground/85">
              <span className="text-muted-foreground font-normal">Type:</span> {doc.categoryName}
            </span>
            <span className="text-border/80">•</span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground/70" />
              Uploaded by <span className="text-foreground/80 font-medium">{doc.uploadedByName}</span>
            </span>
            <span className="text-border/80">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground/70" />
              {doc.uploadedAt}
            </span>
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        <ScrollArea className="flex-1 p-5 min-h-0">
          <div className="space-y-6">
            {/* Inline Preview Window */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Inline Verification View</Label>
              <div className="overflow-hidden rounded-2xl border border-border bg-card/60 min-h-[440px] relative flex flex-col items-center justify-center p-1">
                {isLoading ? (
                  <div className="w-full h-[440px] flex flex-col items-center justify-center p-6 text-center gap-3">
                    <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                    <p className="text-xs font-semibold text-foreground">Loading document preview...</p>
                    <p className="text-[11px] text-muted-foreground">Fetching file securely with authentication...</p>
                  </div>
                ) : error ? (
                  <div className="w-full h-[400px] flex flex-col items-center justify-center p-6 text-center gap-3">
                    <AlertCircle className="h-8 w-8 text-rose-500" />
                    <p className="text-sm font-bold text-foreground">Preview Unavailable</p>
                    <p className="text-xs text-muted-foreground max-w-sm">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retry}
                      className="mt-2 h-8 text-xs cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry Loading
                    </Button>
                  </div>
                ) : isDocx ? (
                  <div className="w-full h-[400px] flex flex-col items-center justify-center p-6 text-center gap-3 bg-card/90">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-1">
                      <FileText className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-bold text-foreground">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Inline preview is not available for Word (.docx/.doc) documents. Download the file to view.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={download}
                      className="h-8 text-xs gap-1.5 mt-2 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Download to View
                    </Button>
                  </div>
                ) : blobUrl ? (
                  isImage ? (
                    <div className="w-full h-full min-h-[440px] relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black/40 p-3">
                      <img
                        src={blobUrl}
                        alt={doc.title}
                        className="w-full max-h-[480px] object-contain rounded-lg shadow-lg"
                      />
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={download}
                          className="h-8 text-xs font-medium border-border bg-background/60 hover:bg-accent gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5 text-muted-foreground" /> Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-[520px] relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-background border border-border shadow-inner">
                      <iframe
                        src={blobUrl}
                        className="w-full h-full rounded-xl border-0"
                        title={doc.title}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-[400px] flex flex-col items-center justify-center p-6 bg-card/90 text-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-bold text-foreground">{doc.title}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={download}
                      className="h-8 text-xs gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" /> Fetch & Download File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Remarks */}
            {doc.status === "REJECTED" && doc.rejectionReason && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Rejection Compliance Remarks:
                </div>
                <p className="leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left">
                  "{doc.rejectionReason}"
                </p>
              </div>
            )}

            {/* Document Details Table */}
            <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Document Details
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Employee Owner</span>
                  <strong className="text-foreground mt-0.5 block">{doc.employeeName || "Company-wide"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Verification Type</span>
                  <strong className="text-foreground mt-0.5 block">{doc.categoryName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">File Size</span>
                  <strong className="text-foreground mt-0.5 block">{doc.fileSize}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Expiry Date</span>
                  <strong className="text-foreground mt-0.5 block">{doc.expiryDate || "No expiration date"}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[10px]">Internal Description</span>
                  <p className="text-foreground mt-0.5 leading-relaxed">
                    {doc.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Real Verification Audit Timeline (Only for employee docs) */}
            {!isCompany && (
              <div className="space-y-2 text-left">
                <Label className="text-xs font-semibold text-muted-foreground">Verification Audit Timeline</Label>
                <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
                  <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0">
                      <CheckCircle className="h-2.5 w-2.5" />
                    </span>
                    <div>
                      <p className="font-bold text-foreground">Uploaded & Submitted</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        By {doc.uploadedByName} on {doc.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs">
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${
                        doc.status === "PENDING"
                          ? "bg-amber-500 text-white"
                          : doc.status === "VERIFIED"
                          ? "bg-emerald-500 text-white"
                          : doc.status === "REJECTED"
                          ? "bg-rose-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {doc.status === "VERIFIED" ? (
                        <CheckCircle className="h-2.5 w-2.5" />
                      ) : doc.status === "REJECTED" ? (
                        <XCircle className="h-2.5 w-2.5" />
                      ) : (
                        <Clock className="h-2.5 w-2.5" />
                      )}
                    </span>
                    <div>
                      <p className="font-bold text-foreground">
                        {doc.status === "VERIFIED"
                          ? "Compliance Verified & Approved"
                          : doc.status === "REJECTED"
                          ? "Compliance Review Rejected"
                          : "Pending Compliance Review"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {doc.verifiedBy
                          ? `Reviewed by ${doc.verifiedBy} ${doc.verifiedAt ? `on ${doc.verifiedAt}` : ""}`
                          : doc.status === "PENDING"
                          ? "Awaiting review from Human Resources"
                          : doc.rejectionReason
                          ? `Rejected: ${doc.rejectionReason}`
                          : "Decision pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/80 bg-card/60 backdrop-blur-md shrink-0 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={download}
            className="h-9 px-3.5 text-xs font-medium rounded-xl border border-border/70 bg-card/60 hover:bg-accent/80 hover:border-border text-foreground gap-2 cursor-pointer transition-all duration-150 shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Download</span>
          </Button>

          {/* Verification Decisions (Only for employee docs in PENDING status for Admin/HR) */}
          {!isCompany && doc.status === "PENDING" && canVerify && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {canRequestReupload && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onRequestReuploadPrompt(doc)}
                  className="h-9 px-3 text-xs font-medium rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Request Re-upload</span>
                </Button>
              )}

              {canReject && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onRejectPrompt(doc)}
                  className="h-9 px-3 text-xs font-medium rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 gap-1.5 cursor-pointer shadow-xs"
                >
                  <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span>Reject</span>
                </Button>
              )}

              <Button
                type="button"
                disabled={isVerifying}
                onClick={() => onVerify(doc)}
                className="h-9 px-4 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-2 cursor-pointer shadow-md shadow-emerald-950/30 border border-emerald-400/20 transition-all duration-150"
              >
                <CheckCircle className={`h-3.5 w-3.5 shrink-0 ${isVerifying ? "animate-spin" : ""}`} />
                <span>{isVerifying ? "Verifying..." : "Verify & Approve"}</span>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
