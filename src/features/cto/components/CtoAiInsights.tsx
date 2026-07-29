import React from "react";
import { Sparkles, ArrowRight, Zap, ShieldAlert, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AiInsightItem {
  type: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
  action: string;
}

interface CtoAiInsightsProps {
  insights: AiInsightItem[];
}

export function CtoAiInsights({ insights }: CtoAiInsightsProps) {
  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-purple-950/20 to-card/60 p-5 backdrop-blur-xl space-y-4 text-left shadow-lg">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">AI CTO Copilot Recommendations</h3>
            <p className="text-xs text-muted-foreground">Automated infrastructure, cost & performance optimization insights</p>
          </div>
        </div>

        <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-bold uppercase">
          Autonomous AI Engine
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item, idx) => {
          const isHigh = item.severity === "High";
          return (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-4 space-y-3 backdrop-blur-sm transition-all hover:border-violet-500/40 hover:shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-violet-400">{item.type}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold ${
                      isHigh
                        ? "border-rose-500/40 text-rose-400 bg-rose-500/10"
                        : "border-amber-500/40 text-amber-400 bg-amber-500/10"
                    }`}
                  >
                    {item.severity} Impact
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`Applied action: ${item.action}`)}
                className="w-full text-xs font-medium border-violet-500/30 text-violet-300 hover:bg-violet-500/20 cursor-pointer h-8"
              >
                <span>{item.action}</span>
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
