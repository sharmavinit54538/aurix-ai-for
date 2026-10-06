import React from "react";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoDatabasePage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Coins className="h-4 w-4" />
              </span>
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase">
                Database Management Hub
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Database Clusters & Slow Query Monitor
            </h1>
            <p className="text-xs text-amber-200/70 max-w-2xl">
              PostgreSQL replication, Redis Sentinel cache, Qdrant vector database, connection pool health, automated backups, and index optimization.
            </p>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Database clusters, replication status, connection pool telemetry, and query logs are not connected to a backend service."
      />
    </div>
  );
}

export default CtoDatabasePage;
