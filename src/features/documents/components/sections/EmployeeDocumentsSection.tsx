import React, { useState, useMemo } from "react";
import { Search, Filter, Upload, X, RefreshCw, UserCheck, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentsTable } from "../DocumentsTable";
import { STANDARD_DOCUMENT_TYPES } from "../../lib/categoryMap";
import type { BackendCategory, DocumentFilters, DocumentItem, PaginationMeta } from "../../lib/types";

interface EmployeeDocumentsSectionProps {
  items: DocumentItem[];
  meta: PaginationMeta;
  filters: DocumentFilters;
  isLoading: boolean;
  isError: boolean;
  hasPartialError?: boolean;
  onRetry: () => void;
  onFilterChange: (partial: Partial<DocumentFilters>) => void;
  onSortChange: (sortBy: DocumentFilters["sortBy"]) => void;
  onSelectPreview: (doc: DocumentItem) => void;
  onSelectDelete: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onVerify?: (doc: DocumentItem) => void;
  onReject?: (doc: DocumentItem) => void;
  onRequestReupload?: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  canUpload: boolean;
  categories: BackendCategory[];
  employees: Array<{ id: string; fullName: string; employeeId: string }>;
  userRole?: string | null;
  currentEmployeeProfileId?: string;
}

export const EmployeeDocumentsSection: React.FC<EmployeeDocumentsSectionProps> = ({
  items,
  meta,
  filters,
  isLoading,
  isError,
  hasPartialError,
  onRetry,
  onFilterChange,
  onSortChange,
  onSelectPreview,
  onSelectDelete,
  onDownload,
  onVerify,
  onReject,
  onRequestReupload,
  onOpenUpload,
  canUpload,
  categories,
  employees,
  userRole,
  currentEmployeeProfileId,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchInput, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onFilterChange({
      search: "",
      employeeId: undefined,
      categoryId: undefined,
      documentType: undefined,
      status: undefined,
      page: 1,
    });
  };

  const employeeCategories = useMemo(() => {
    return categories.filter((c) => !c.is_company);
  }, [categories]);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.employeeId ||
    filters.categoryId ||
    filters.documentType ||
    filters.status
  );

  return (
    <div className="space-y-4">
      {/* Filters & Actions Bar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] max-w-md relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search document title, number, or employee..."
              className="pl-9 h-9 bg-background/50 border-border text-xs"
            />
          </form>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}

            {canUpload && (
              <Button
                onClick={onOpenUpload}
                size="sm"
                className="h-9 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
          {/* Employee Filter */}
          {employees.length > 0 && userRole !== "employee" && (
            <Select
              value={filters.employeeId || "all"}
              onValueChange={(val) =>
                onFilterChange({ employeeId: val === "all" ? undefined : val, page: 1 })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Category Filter */}
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(val) =>
              onFilterChange({ categoryId: val === "all" ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {employeeCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Document Type Filter */}
          <Select
            value={filters.documentType || "all"}
            onValueChange={(val) =>
              onFilterChange({ documentType: val === "all" ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
              <SelectValue placeholder="All Document Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Document Types</SelectItem>
              {STANDARD_DOCUMENT_TYPES.filter((s) => !s.isCompany).map((s) => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status || "all"}
            onValueChange={(val) =>
              onFilterChange({ status: val === "all" ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="VERIFIED">Verified</SelectItem>
              <SelectItem value="PENDING">Pending Review</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <DocumentsTable
        items={items}
        meta={meta}
        filters={filters}
        isLoading={isLoading}
        isError={isError}
        hasPartialError={hasPartialError}
        onRetry={onRetry}
        onPageChange={(page) => onFilterChange({ page })}
        onSortChange={onSortChange}
        onSelectPreview={onSelectPreview}
        onSelectDelete={onSelectDelete}
        onDownload={onDownload}
        onVerify={onVerify}
        onReject={onReject}
        onRequestReupload={onRequestReupload}
        userRole={userRole}
        currentEmployeeProfileId={currentEmployeeProfileId}
        showVerificationActions={true}
        onOpenUpload={onOpenUpload}
        canUpload={canUpload}
      />
    </div>
  );
};
