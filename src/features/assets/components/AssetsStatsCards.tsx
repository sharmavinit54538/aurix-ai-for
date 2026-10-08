import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AssetStats } from "../types";

interface AssetsStatsCardsProps {
  stats: AssetStats;
  isEmployee?: boolean;
  assignedCount?: number;
  activeDevicesCount?: number;
}

export function AssetsStatsCards({
  stats,
  isEmployee = false,
  assignedCount = 0,
  activeDevicesCount = 0,
}: AssetsStatsCardsProps) {
  const cards = isEmployee
    ? [
        { key: "assigned", title: "My Assigned Assets", count: assignedCount },
        { key: "available", title: "Active Devices", count: activeDevicesCount },
      ]
    : [
        { key: "total", title: "Total Assets", count: stats.total },
        { key: "available", title: "Available Assets", count: stats.available },
        { key: "assigned", title: "Assigned Assets", count: stats.assigned },
        { key: "repair", title: "Under Repair", count: stats.repair },
        { key: "lost", title: "Lost Assets", count: stats.lost },
        { key: "expiring", title: "Expiring Warranty", count: stats.expiring },
      ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(card => (
        <Card key={card.key} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground truncate leading-none">
                {card.title}
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl font-semibold font-display tracking-tight leading-none text-foreground">
                {card.count}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
