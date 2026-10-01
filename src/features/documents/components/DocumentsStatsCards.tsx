import React from "react";
import { Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DocumentSummary } from "../lib/types";

interface DocumentsStatsCardsProps {
  summary: DocumentSummary;
  isLoading?: boolean;
}

const STATS_CONFIG = [
  { key: "total", title: "Total Documents", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "verified", title: "Verified Documents", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "pending", title: "Pending Verification", color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "rejected", title: "Rejected Documents", color: "text-rose-500", bg: "bg-rose-500/10" },
  { key: "expiring", title: "Expiring Soon", color: "text-purple-500", bg: "bg-purple-500/10" },
] as const;

export const DocumentsStatsCards: React.FC<DocumentsStatsCardsProps> = ({
  summary,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3" aria-label="Document Statistics">
      {STATS_CONFIG.map((card) => {
        const value = summary[card.key as keyof DocumentSummary] ?? 0;
        return (
          <Card
            key={card.key}
            className="border-border bg-card/60 backdrop-blur-sm shadow-sm"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}
                aria-hidden="true"
              >
                <Folder className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground leading-none">
                  {isLoading ? (
                    <span className="inline-block h-5 w-8 rounded bg-muted animate-pulse" />
                  ) : (
                    value
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
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
