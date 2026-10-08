import React, { useState, useMemo } from "react";
import { Search, Upload, Building2, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentsTable } from "../DocumentsTable";
import type { BackendCategory, DocumentFilters, DocumentItem, PaginationMeta } from "../../lib/types";

interface CompanyDocumentsSectionProps {
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
  onOpenUpload: () => void;
  canUpload: boolean;
  categories: BackendCategory[];
  userRole?: string | null;
}

export const CompanyDocumentsSection: React.FC<CompanyDocumentsSectionProps> = ({
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
  onOpenUpload,
  canUpload,
  categories,
  userRole,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const companyCategories = useMemo(() => {
    return categories.filter((c) => c.is_company || c.group === "Company Documents");
  }, [categories]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchInput, page: 1 });
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Company Knowledge & Policies</h2>
            <p className="text-xs text-muted-foreground">
              Official enterprise handbooks, compliance charters, standard operating procedures, and notices.
            </p>
          </div>
        </div>

        {canUpload && (
          <Button
            onClick={onOpenUpload}
            size="sm"
            className="h-9 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Upload className="h-4 w-4" />
            Upload Company Document
          </Button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/40 border border-border">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] max-w-sm relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search policies, handbooks, SOPs..."
            className="pl-9 h-9 bg-background/50 border-border text-xs"
          />
        </form>

        <div className="flex items-center gap-2">
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(val) =>
              onFilterChange({ categoryId: val === "all" ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger className="h-9 min-w-[180px] text-xs bg-background/50 border-border cursor-pointer">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {companyCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
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
        userRole={userRole}
        onOpenUpload={onOpenUpload}
        canUpload={canUpload}
      />
    </div>
  );
};
