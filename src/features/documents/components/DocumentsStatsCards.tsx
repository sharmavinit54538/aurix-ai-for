import React from "react";
import { Folder, CheckCircle, Clock, XCircle, AlertTriangle, CalendarX, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DocumentSummary } from "../lib/types";

interface DocumentsStatsCardsProps {
  summary: DocumentSummary;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onSelectMetric?: (key: string) => void;
  selectedMetric?: string;
}

const STATS_CONFIG = [
  { key: "total", title: "Total Documents", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Folder },
  { key: "pending", title: "Pending Verification", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
  { key: "verified", title: "Verified", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
  { key: "rejected", title: "Rejected", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: XCircle },
  { key: "expiring", title: "Expiring Soon", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: AlertTriangle },
  { key: "expired", title: "Expired", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: CalendarX },
] as const;

export const DocumentsStatsCards: React.FC<DocumentsStatsCardsProps> = ({
  summary,
  isLoading = false,
  isError = false,
  onRetry,
  onSelectMetric,
  selectedMetric,
}) => {
  if (isError) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Failed to load document statistics.</span>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-7 text-xs border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" aria-label="Document Statistics">
      {STATS_CONFIG.map((card) => {
        const value = summary[card.key as keyof DocumentSummary] ?? 0;
        const Icon = card.icon;
        const isSelected = selectedMetric === card.key;

        return (
          <Card
            key={card.key}
            onClick={() => onSelectMetric?.(card.key)}
            className={`border-border bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-150 ${
              onSelectMetric ? "cursor-pointer hover:border-border/80 hover:bg-card/90" : ""
            } ${isSelected ? "ring-2 ring-primary border-transparent" : ""}`}
          >
            <CardContent className="p-3.5 flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0 border ${card.border}`}
                aria-hidden="true"
              >
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground leading-none">
                  {isLoading ? (
                    <span className="inline-block h-5 w-8 rounded bg-muted animate-pulse" />
                  ) : (
                    value
                  )}
                </p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5 truncate">
                  {card.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
