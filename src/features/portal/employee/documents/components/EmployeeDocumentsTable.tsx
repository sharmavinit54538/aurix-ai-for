import {
  FileText,
  Upload,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmployeeDocument } from "../types";

interface EmployeeDocumentsTableProps {
  isLoadingDocs: boolean;
  documentsCount: number;
  filteredDocuments: EmployeeDocument[];
  onOpenUploadModal: () => void;
  onViewDocument: (doc: EmployeeDocument) => void;
  onDownloadDocument: (doc: EmployeeDocument) => void;
  onOpenReupload: (doc: EmployeeDocument) => void;
  onDeleteDocument: (doc: EmployeeDocument) => void;
}

export function EmployeeDocumentsTable({
  isLoadingDocs,
  documentsCount,
  filteredDocuments,
  onOpenUploadModal,
  onViewDocument,
  onDownloadDocument,
  onOpenReupload,
  onDeleteDocument,
}: EmployeeDocumentsTableProps) {
  const renderStatusBadge = (status: string, expiryDate?: string | null) => {
    const s = status.toUpperCase();
    const now = new Date();
    const in90Days = new Date();
    in90Days.setDate(now.getDate() + 90);
    const isExpiring = expiryDate
      ? (() => {
          const exp = new Date(expiryDate);
          return !isNaN(exp.getTime()) && exp >= now && exp <= in90Days;
        })()
      : false;

    if (s === "VERIFIED" || s === "APPROVED") {
      return (
        <div className="flex flex-col gap-1 items-start">
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </Badge>
          {isExpiring && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
              <Clock className="h-2.5 w-2.5" /> Expiring Soon
            </span>
          )}
        </div>
      );
    }

    if (s === "REJECTED") {
      return (
        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-medium inline-flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending Verification
        </Badge>
        {isExpiring && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
            <Clock className="h-2.5 w-2.5" /> Expiring Soon
          </span>
        )}
      </div>
    );
  };

  if (isLoadingDocs) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        Loading your documents from the backend...
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
        {documentsCount === 0 ? (
          <>
            <h3 className="font-semibold text-base">No documents yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Upload your employment documents to keep your records up to date.
            </p>
            <div className="pt-2">
              <Button
                onClick={onOpenUploadModal}
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                <Upload className="h-3.5 w-3.5" /> Upload Document
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-base">No documents found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No documents match this filter or search query.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="text-xs font-semibold">Document</TableHead>
            <TableHead className="text-xs font-semibold">Category</TableHead>
            <TableHead className="text-xs font-semibold">Type</TableHead>
            <TableHead className="text-xs font-semibold">Uploaded Date</TableHead>
            <TableHead className="text-xs font-semibold">Status</TableHead>
            <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((doc) => {
            const isRejected = doc.status.toUpperCase() === "REJECTED";
            return (
              <TableRow key={doc.id} className="hover:bg-muted/20">
                {/* Document Name & Description */}
                <TableCell className="font-medium text-xs max-w-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-lg bg-blue-500/10 p-2 text-blue-500 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {doc.title || doc.fileName || "Employment Document"}
                      </div>
                      {doc.fileName && (
                        <div className="text-[11px] text-muted-foreground truncate">
                          {doc.fileName}{" "}
                          {doc.fileSize
                            ? `(${((doc.fileSize || 0) / 1024).toFixed(0)} KB)`
                            : ""}
                        </div>
                      )}
                      {doc.expiryDate && (
                        <div className="mt-0.5 text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Expires:{" "}
                          {new Date(doc.expiryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      {isRejected && doc.rejectionReason && (
                        <div className="mt-1 text-[11px] text-rose-400 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                          <span className="font-semibold">Reason:</span>{" "}
                          {doc.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-xs">
                  <Badge variant="outline" className="text-[11px] capitalize bg-background/50">
                    {doc.category || "General"}
                  </Badge>
                </TableCell>

                {/* Type */}
                <TableCell className="text-xs text-muted-foreground">
                  {doc.type || "Document"}
                </TableCell>

                {/* Uploaded Date */}
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {doc.uploadedAt
                    ? new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>

                {/* Status */}
                <TableCell className="text-xs whitespace-nowrap">
                  {renderStatusBadge(doc.status, doc.expiryDate)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      onClick={() => onViewDocument(doc)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title="View Document"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>

                    <Button
                      onClick={() => onDownloadDocument(doc)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      title="Download File"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>

                    {isRejected && (
                      <Button
                        onClick={() => onOpenReupload(doc)}
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Re-upload Revised Document"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Re-upload
                      </Button>
                    )}

                    <Button
                      onClick={() => onDeleteDocument(doc)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400"
                      title="Delete Document"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
