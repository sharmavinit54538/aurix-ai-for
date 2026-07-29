import React from "react";
import { Coins, Zap, Clock, ListTodo, Archive, History, HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CtoDatabasePage() {
  const dbs = [
    { name: "PostgreSQL Primary (aurix_prod)", engine: "PostgreSQL 16.2", conn: "142 / 500", size: "14.2 GB", status: "Healthy" },
    { name: "Redis Cache Cluster (aurix_cache)", engine: "Redis 7.2 (Sentinel)", conn: "84 / 1000", size: "2.4 GB", status: "Healthy" },
    { name: "Qdrant Vector DB (aurix_vectors)", engine: "Qdrant 1.8", conn: "24 / 200", size: "6.8 GB", status: "Healthy" },
  ];

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

      <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
            <tr>
              <th className="p-3">Database Instance</th>
              <th className="p-3">Engine Version</th>
              <th className="p-3">Active Connections</th>
              <th className="p-3">Data Size</th>
              <th className="p-3">Health Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {dbs.map((d, idx) => (
              <tr key={idx} className="hover:bg-accent/20 transition-colors">
                <td className="p-3 font-bold text-foreground">{d.name}</td>
                <td className="p-3 text-muted-foreground">{d.engine}</td>
                <td className="p-3 font-mono text-indigo-400">{d.conn}</td>
                <td className="p-3 font-mono text-amber-400">{d.size}</td>
                <td className="p-3">
                  <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{d.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CtoDatabasePage;
