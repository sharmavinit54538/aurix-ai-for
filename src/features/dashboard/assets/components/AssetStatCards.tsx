import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AssetAnalytics } from "../hooks/useAssetsQueries";

interface AssetStatCardsProps {
  stats: AssetAnalytics;
}

const CARD_CONFIG = [
  { key: "total_assets", title: "Total Assets", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "available_assets", title: "Available Assets", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "assigned_assets", title: "Assigned Assets", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { key: "under_repair_assets", title: "Under Repair", color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "lost_assets", title: "Lost Assets", color: "text-rose-500", bg: "bg-rose-500/10" },
  { key: "expiring_warranty_assets", title: "Expiring Warranty", color: "text-purple-500", bg: "bg-purple-500/10" },
] as const;

export function AssetStatCards({ stats }: AssetStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {CARD_CONFIG.map((card) => (
        <Card key={card.key} className="border-border bg-card/40 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground truncate leading-none">
                {card.title}
              </span>
              <span className={`grid h-7 w-7 place-items-center rounded-lg ${card.bg}`}>
                <Package className={`h-3.5 w-3.5 ${card.color}`} />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display tracking-tight leading-none">
                {stats[card.key as keyof AssetAnalytics] ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
