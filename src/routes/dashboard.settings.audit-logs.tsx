import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, RefreshCw, ScrollText, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAuditLogs, selectSettingsLoading } from "@/store/settings/settingsSelectors";
import { fetchAuditLogs } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — Aurix" }] }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const dispatch = useAppDispatch();
  const auditData = useAppSelector(selectAuditLogs);
  const loading = useAppSelector(selectSettingsLoading);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAuditLogs({ page, limit: 10, search, module: moduleFilter }));
  }, [dispatch, page, search, moduleFilter]);

  const handleExport = () => {
    toast.success("Audit log export started. File will download shortly.");
  };

  const logs = auditData?.items || [];
  const total = auditData?.total || 0;
  const pages = auditData?.pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Audit Trail & Activity Logs</h2>
          <p className="text-xs text-muted-foreground">Trace every admin action, security event, and system modification in real time.</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user, action, or details..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Select
            value={moduleFilter}
            onValueChange={(val) => {
              setModuleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Filter by Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="Settings">Settings</SelectItem>
              <SelectItem value="Employees">Employees</SelectItem>
              <SelectItem value="Payroll">Payroll</SelectItem>
              <SelectItem value="Leaves">Leaves</SelectItem>
              <SelectItem value="Roles & Permissions">Roles & Permissions</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(fetchAuditLogs({ page, limit: 10, search, module: moduleFilter }))}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {loading && logs.length === 0 ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            <ScrollText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50 stroke-1" />
            No audit logs found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border/60 uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2.5 text-left">Timestamp</th>
                  <th className="text-left">User</th>
                  <th className="text-left">Action</th>
                  <th className="text-left">Module</th>
                  <th className="text-left">IP Address</th>
                  <th className="text-left">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                    <td className="py-3 font-mono text-muted-foreground">{log.timestamp}</td>
                    <td>
                      <div className="font-medium text-foreground">{log.user}</div>
                      <div className="text-[10px] text-muted-foreground">{log.role}</div>
                    </td>
                    <td>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {log.action}
                      </Badge>
                    </td>
                    <td>
                      <span className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="font-mono text-muted-foreground">{log.ip}</td>
                    <td className="max-w-xs truncate text-muted-foreground">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{logs.length}</span> of{" "}
            <span className="font-medium text-foreground">{total}</span> log entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span>
              Page {page} of {pages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
