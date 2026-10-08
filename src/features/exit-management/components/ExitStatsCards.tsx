import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { STATS_CARDS } from "../constants";
import type { ExitStats } from "../types";

interface ExitStatsCardsProps {
  stats: ExitStats;
}

export function ExitStatsCards({ stats }: ExitStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {STATS_CARDS.map((card) => {
        const count = stats[card.key as keyof typeof stats];
        return (
          <Card key={card.key} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground truncate leading-none">
                  {card.title}
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <LogOut className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-2xl font-semibold font-display tracking-tight leading-none text-foreground">
                  {count}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
