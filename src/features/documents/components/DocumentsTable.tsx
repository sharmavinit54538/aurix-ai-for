import React from "react";
import { Eye, Download, Trash2, FileText, AlertCircle, RefreshCw, CheckCircle, XCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { canDo } from "../lib/permissions";
import type { DocumentFilters, DocumentItem, PaginationMeta } from "../lib/types";

interface DocumentsTableProps {
  items: DocumentItem[];
  meta: PaginationMeta;
  filters: DocumentFilters;
  isLoading: boolean;
  isError: boolean;
  hasPartialError?: boolean;
  onRetry: () => void;
  onPageChange: (newPage: number) => void;
  onSortChange: (sortBy: DocumentFilters["sortBy"]) => void;
  onSelectPreview: (doc: DocumentItem) => void;
  onSelectDelete: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onVerify?: (doc: DocumentItem) => void;
  onReject?: (doc: DocumentItem) => void;
  onRequestReupload?: (doc: DocumentItem) => void;
  userRole?: string | null;
  currentEmployeeProfileId?: string;
  showVerificationActions?: boolean;
  onOpenUpload?: () => void;
  canUpload?: boolean;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  items,
  meta,
  filters,
  isLoading,
  isError,
  hasPartialError,
  onRetry,
  onPageChange,
  onSortChange,
  onSelectPreview,
  onSelectDelete,
  onDownload,
  onVerify,
  onReject,
  onRequestReupload,
  userRole,
  currentEmployeeProfileId,
  showVerificationActions = false,
  onOpenUpload,
  canUpload,
}) => {
  const isUploadAllowed = canUpload ?? canDo(userRole, "upload");
  const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 10)));
  const currentPage = meta.page;

  const canVerify = canDo(userRole, "verify");
  const canReject = canDo(userRole, "reject");
  const canRequestReupload = canDo(userRole, "requestReupload");

  const handleRowKeyDown = (e: React.KeyboardEvent, doc: DocumentItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectPreview(doc);
    }
  };

  return (
    <div className="space-y-3">
      {/* Partial Error Notification */}
      {hasPartialError && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-600 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Some documents could not be loaded due to a temporary network issue.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-7 text-xs border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead
                onClick={() => onSortChange("title")}
                className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none"
              >
                Document
                {filters.sortBy === "title" && (filters.order === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead
                onClick={() => onSortChange("employee_name")}
                className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none"
              >
                Employee
                {filters.sortBy === "employee_name" && (filters.order === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Type</TableHead>
              <TableHead
                onClick={() => onSortChange("created_at")}
                className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none"
              >
                Uploaded
                {filters.sortBy === "created_at" && (filters.order === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead
                onClick={() => onSortChange("expiry_date")}
                className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none"
              >
                Expiry Date
                {filters.sortBy === "expiry_date" && (filters.order === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="border-border animate-pulse">
                  <TableCell colSpan={8} className="py-4">
                    <div className="h-4 bg-muted/40 rounded w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-rose-500/70" />
                  <p className="font-semibold text-foreground text-sm">Unable to load documents</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Something went wrong while fetching documents. Please try again.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-3 h-8 text-xs cursor-pointer"
                  >
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="font-semibold text-foreground text-sm">No documents found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Documents uploaded by employees or HR will appear here.
                  </p>
                  {isUploadAllowed && onOpenUpload && (
                    <Button
                      size="sm"
                      onClick={onOpenUpload}
                      className="mt-3 h-8 text-xs cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Upload Document
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              items.map((doc) => {
                const isOwn = currentEmployeeProfileId ? doc.employeeId === currentEmployeeProfileId : false;
                const canDeleteThisDoc = canDo(userRole, "delete", {
                  isOwnDocument: isOwn,
                  isVerified: doc.isVerified,
                  source: doc.source,
                });
                // Use composite key for React key and deduplication
                const rowKey = `${doc.source}:${doc.id}`;

                return (
                  <TableRow
                    key={rowKey}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleRowKeyDown(e, doc)}
                    onClick={() => onSelectPreview(doc)}
                    className="border-border hover:bg-accent/30 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    aria-label={`View details for ${doc.title}`}
                  >
                    <TableCell className="text-xs font-medium text-foreground max-w-[220px]">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{doc.title}</p>
                          {doc.documentNumber && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              Doc #: {doc.documentNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                      <div>
                        <p className="font-medium text-foreground truncate">{doc.employeeName || "—"}</p>
                        {doc.employeeCode && (
                          <p className="text-[10px] text-muted-foreground font-mono">{doc.employeeCode}</p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <span className="truncate block max-w-[140px]">{doc.categoryName}</span>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] font-normal border-border/80">
                        {doc.documentType || doc.categoryGroup}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {doc.uploadedAt}
                    </TableCell>

                    <TableCell className="text-xs whitespace-nowrap">
                      {doc.expiryDate ? (
                        <div className="flex items-center gap-1.5">
                          <span>{doc.expiryDate}</span>
                          {doc.isExpired ? (
                            <Badge className="bg-rose-500/15 text-rose-600 border border-rose-500/30 text-[9px] px-1 py-0">
                              Expired
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] px-1 py-0">
                              Valid
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`text-[10px] font-medium border-none shadow-none ${
                          doc.status === "VERIFIED"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : doc.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-500"
                            : doc.status === "REJECTED"
                            ? "bg-rose-500/10 text-rose-500"
                            : "bg-neutral-500/10 text-neutral-500"
                        }`}
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Quick Verification Actions for HR/Admin on Pending docs */}
                        {(showVerificationActions || canVerify) && doc.source === "employee" && doc.status === "PENDING" && onVerify && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVerify(doc)}
                            className="h-7 w-7 p-0 cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                            title="Verify and Approve"
                            aria-label={`Verify ${doc.title}`}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {(showVerificationActions || canReject) && doc.source === "employee" && doc.status === "PENDING" && onReject && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReject(doc)}
                            className="h-7 w-7 p-0 cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                            title="Reject Document"
                            aria-label={`Reject ${doc.title}`}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {canRequestReupload && doc.source === "employee" && onRequestReupload && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRequestReupload(doc)}
                            className="h-7 w-7 p-0 cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                            title="Request Re-upload"
                            aria-label={`Request Re-upload for ${doc.title}`}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectPreview(doc)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          aria-label={`Preview ${doc.title}`}
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(doc)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          aria-label={`Download ${doc.title}`}
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>

                        {canDeleteThisDoc && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelectDelete(doc)}
                            className="h-7 w-7 p-0 cursor-pointer"
                            aria-label={`Delete ${doc.title}`}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Server Pagination Pager */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-[11px] text-muted-foreground">
              Showing {(currentPage - 1) * meta.limit + 1}–
              {Math.min(currentPage * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-7 text-xs cursor-pointer"
                aria-label="Previous page"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-7 text-xs cursor-pointer"
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
