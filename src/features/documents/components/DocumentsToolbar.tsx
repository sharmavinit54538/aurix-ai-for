import React, { useState } from "react";
import { Search, Upload, Wand2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BackendDocumentItem, DocumentFilters } from "../lib/types";

interface DocumentsToolbarProps {
  filters: DocumentFilters;
  onFilterChange: (partial: Partial<DocumentFilters>) => void;
  onOpenUpload: () => void;
  onOpenGenerator?: () => void;
  canUpload: boolean;
  canGenerate: boolean;
  categoriesLoaded: boolean;
  pendingCount?: number;
  expiringDocs?: BackendDocumentItem[];
  isEmployeeRole: boolean;
}

const TABS: Array<{ id: DocumentFilters["tab"]; label: string }> = [
  { id: "all", label: "All Documents" },
  { id: "Employee Documents", label: "Employee Documents" },
  { id: "Company Documents", label: "Company Documents" },
  { id: "Pending", label: "Pending" },
  { id: "Verified", label: "Verified" },
  { id: "Rejected", label: "Rejected" },
  { id: "Expired", label: "Expired" },
];

export const DocumentsToolbar: React.FC<DocumentsToolbarProps> = ({
  filters,
  onFilterChange,
  onOpenUpload,
  onOpenGenerator,
  canUpload,
  canGenerate,
  categoriesLoaded,
  pendingCount = 0,
  expiringDocs = [],
  isEmployeeRole,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [showAlertsExpanded, setShowAlertsExpanded] = useState(false);

  // Debounced search trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        onFilterChange({ search: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  // Construct independent notifications:
  // 1. Pending review alert (for HR/admin)
  // 2. Expiring / Expired alerts
  const alerts: Array<{ id: string; type: "warning" | "info" | "error"; message: string }> = [];

  if (!isEmployeeRole && pendingCount > 0) {
    alerts.push({
      id: "pending_review_alert",
      type: "info",
      message: `You have ${pendingCount} document${pendingCount === 1 ? "" : "s"} awaiting compliance review and verification.`,
    });
  }

  for (const doc of expiringDocs) {
    alerts.push({
      id: `exp_${doc.id}`,
      type: "warning",
      message: `${doc.employee_name || "Company"}'s ${doc.title || doc.document_type || "document"} is expiring soon on ${doc.expiry_date}.`,
    });
  }

  const displayedAlerts = showAlertsExpanded ? alerts : alerts.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Top Action Buttons */}
      <div className="flex justify-end gap-2">
        {canUpload && (
          <Button
            variant="outline"
            onClick={onOpenUpload}
            disabled={!categoriesLoaded}
            title={!categoriesLoaded ? "Categories loading or failed to load" : undefined}
            className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            aria-label="Upload Document"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        )}
        {canGenerate && onOpenGenerator && (
          <Button
            onClick={onOpenGenerator}
            className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
            aria-label="Generate HR Letter"
          >
            <Wand2 className="h-4 w-4" />
            Generate HR Letter
          </Button>
        )}
      </div>

      {/* Notifications Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2" aria-live="polite">
          {displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs ${
                alert.type === "warning"
                  ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                  : alert.type === "error"
                  ? "border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400"
                  : "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
              }`}
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : alert.type === "error" ? (
                <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              )}
              <span className="flex-1">{alert.message}</span>
            </div>
          ))}

          {alerts.length > 3 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlertsExpanded((prev) => !prev)}
                className="h-6 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showAlertsExpanded ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    View all {alerts.length} alerts <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Document Category Tabs">
          {TABS.map((tab) => {
            const isActive = filters.tab === tab.id;
            return (
              <Button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange({ tab: tab.id, page: 1 })}
                className={`h-8 text-xs cursor-pointer ${
                  isActive
                    ? "bg-gradient-brand text-brand-foreground"
                    : "border-border bg-card/60 hover:bg-accent/60"
                }`}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search documents..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-9 bg-card/60 border-border text-xs"
            aria-label="Search documents"
          />
        </div>
      </div>
    </div>
  );
};
