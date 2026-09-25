import React, { useEffect, useState } from "react";
import { Activity, Clock, Shield, Globe, RefreshCw, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { superAdminApi } from "../superAdminApi";
import type { PlatformSystemActivity } from "../types";

export function SuperAdminActivityPage() {
  const [activities, setActivities] = useState<PlatformSystemActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getSystemActivity();
      setActivities(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              System Activity
            </h1>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              Live Stream
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time feed of events and user actions across all tenant organizations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

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
