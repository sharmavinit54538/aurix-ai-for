import React from "react";
import { Eye, Download, Trash2, FileText, AlertCircle, RefreshCw } from "lucide-react";
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
  userRole?: string | null;
  currentEmployeeProfileId?: string;
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
  userRole,
  currentEmployeeProfileId,
}) => {
  const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 10)));
  const currentPage = meta.page;

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
              <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="border-border animate-pulse">
                  <TableCell colSpan={7} className="py-4">
                    <div className="h-4 bg-muted/40 rounded w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-rose-500/70" />
                  <p className="font-semibold text-foreground">Failed to load documents.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-3 h-8 text-xs cursor-pointer"
                  >
                    Retry Loading
                  </Button>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  No documents found matching your filters.
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

                return (
                  <TableRow
                    key={doc.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => handleRowKeyDown(e, doc)}
                    onClick={() => onSelectPreview(doc)}
                    className="border-border hover:bg-accent/30 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    aria-label={`View details for ${doc.title}`}
                  >
                    <TableCell className="text-xs font-medium text-foreground max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                        <span className="truncate">{doc.title}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {doc.employeeName || "—"}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {doc.categoryName}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {doc.categoryGroup}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {doc.uploadedAt}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectPreview(doc)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          aria-label={`Preview ${doc.title}`}
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(doc)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          aria-label={`Download ${doc.title}`}
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
                disabled={!meta.has_more && currentPage >= totalPages}
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
