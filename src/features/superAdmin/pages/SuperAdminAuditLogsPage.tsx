import React, { useEffect, useState } from "react";
import { FileText, ShieldAlert, AlertTriangle, Info, Search, RefreshCw, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { superAdminApi } from "../superAdminApi";
import type { PlatformAuditLog } from "../types";

export function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState<PlatformAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await superAdminApi.getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.organization.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Platform Audit Logs
            </h1>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              Compliance &amp; Security
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tamper-evident record of administrative events, security actions, and policy modifications.
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by actor, action, or target..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredLogs.map((log) => {
                const isCrit = log.severity === "critical";
                const isWarn = log.severity === "warning";

                return (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{log.actor}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-purple-400">{log.action}</td>
                    <td className="py-3 px-4 text-foreground">{log.resource}</td>
                    <td className="py-3 px-4 text-muted-foreground">{log.organization}</td>
                    <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          isCrit
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : isWarn
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
