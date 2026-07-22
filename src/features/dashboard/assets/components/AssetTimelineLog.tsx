import { Package } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { AssetTimelineEvent } from "@/lib/hrms/types";

const EVENT_DOT_STYLES: Record<string, string> = {
  Created: "bg-blue-500 text-white",
  Assigned: "bg-indigo-500 text-white",
  Returned: "bg-emerald-500 text-white",
  Repaired: "bg-amber-500 text-white",
};
const DEFAULT_DOT_STYLE = "bg-rose-500 text-white";

interface AssetTimelineLogProps {
  timeline: AssetTimelineEvent[];
}

export function AssetTimelineLog({ timeline }: AssetTimelineLogProps) {
  return (
    <div className="space-y-2 text-left">
      <Label className="text-xs font-semibold text-muted-foreground">Asset Timeline Audit Logs</Label>
      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3.5">
        {timeline.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No timelines logged for this asset.</p>
        ) : (
          timeline.map((tl, idx) => (
            <div
              key={tl.id}
              className={`flex gap-3 text-xs relative ${
                idx < timeline.length - 1 ? "before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3" : ""
              }`}
            >
              <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${EVENT_DOT_STYLES[tl.event] || DEFAULT_DOT_STYLE}`}>
                <Package className="h-2 w-2" />
              </span>
              <div>
                <p className="font-bold text-foreground capitalize">{tl.event}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  By {tl.performedBy} on {new Date(tl.timestamp).toLocaleString()}
                </p>
                {tl.notes && <p className="text-[10px] text-foreground/80 mt-1">{tl.notes}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
