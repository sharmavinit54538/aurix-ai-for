import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { superAdminApi } from "../superAdminApi";
import type { PlatformSystemActivity } from "../types";

export function SuperAdminActivityPage() {
  const [activities, setActivities] = useState<PlatformSystemActivity[]>([]);

  const loadData = async () => {
    try {
      const data = await superAdminApi.getSystemActivity();
      setActivities(data);
    } catch (err) {
      console.error("Failed to load activity data", err);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      <div className="rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl divide-y divide-border/40">
        {activities.map((act) => (
          <div key={act.id} className="p-4 flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-400 mt-0.5 shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-foreground">{act.action}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span className="text-foreground font-medium">{act.user}</span>
                  <span>•</span>
                  <span>{act.organization}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">IP: {act.ipAddress}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{act.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
