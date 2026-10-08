import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ActiveTab, SummaryMetrics } from "../types";

interface EmployeeDocumentsTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalDocs: number;
  salarySlipsCount: number;
  provisionSlipsCount: number;
  summaryMetrics: SummaryMetrics;
  filteredDocsCount: number;
  filteredSalarySlipsCount: number;
  filteredProvisionSlipsCount: number;
}

export function EmployeeDocumentsTabs({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  totalDocs,
  salarySlipsCount,
  provisionSlipsCount,
  summaryMetrics,
  filteredDocsCount,
  filteredSalarySlipsCount,
  filteredProvisionSlipsCount,
}: EmployeeDocumentsTabsProps) {
  const tabs: { id: ActiveTab; label: string; count?: number }[] = [
    { id: "all", label: "All My Documents", count: totalDocs },
    { id: "employment", label: "Employment" },
    { id: "salary-slips", label: "Salary Slips", count: salarySlipsCount },
    { id: "provision-slips", label: "Provision Slips", count: provisionSlipsCount },
    { id: "pending", label: "Pending", count: summaryMetrics.pending },
    { id: "verified", label: "Verified", count: summaryMetrics.verified },
    { id: "rejected", label: "Rejected", count: summaryMetrics.rejected },
  ];

  return (
    <div>
      {/* Navigation Tabs Header */}
      <div className="border-b border-border px-4 pt-3 pb-0">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {tab.label} {tab.count !== undefined ? `(${tab.count})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "salary-slips"
                ? "Search salary slips by month or number..."
                : activeTab === "provision-slips"
                  ? "Search provision slips by month or number..."
                  : "Search document name, category, type..."
            }
            className="pl-9 text-xs bg-background/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="text-xs text-muted-foreground self-end sm:self-center">
          {activeTab === "salary-slips" ? (
            <span>Showing {filteredSalarySlipsCount} salary slips</span>
          ) : activeTab === "provision-slips" ? (
            <span>Showing {filteredProvisionSlipsCount} provision slips</span>
          ) : (
            <span>Showing {filteredDocsCount} personal documents</span>
          )}
        </div>
      </div>
    </div>
  );
}
