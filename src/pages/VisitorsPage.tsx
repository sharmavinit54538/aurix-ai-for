import { useMemo, useState, useEffect, useCallback } from "react";
import { UserPlus, LogIn, LogOut as LogOutIcon, CheckCircle2, XCircle, QrCode, RefreshCw, AlertCircle, Download, Search } from "lucide-react";
import { GlassCard, QrTile, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { visitorsApi, createVisitorError } from "@/services/visitorsApi";
import { documentsApi } from "@/features/documents/api/documentsApi";
import type { Visitor, VisitorStatus } from "@/lib/hrms/types";
import { useCurrentRole, isHrAdmin, isManager, isSuperAdmin } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const STATUS_TONE: Record<VisitorStatus, "info" | "success" | "warning" | "danger" | "muted"> = {
  pending: "warning",
  approved: "info",
  "checked-in": "success",
  "checked-out": "muted",
  rejected: "danger",
};

function getStatusTone(status: string): "info" | "success" | "warning" | "danger" | "muted" {
  return STATUS_TONE[status as VisitorStatus] ?? "muted";
}

export function VisitorsPage() {
  const currentRole = useCurrentRole();
  const canManageVisitors = isHrAdmin(currentRole) || isManager(currentRole) || isSuperAdmin(currentRole);

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<VisitorStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState<Visitor | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hostEmployees, setHostEmployees] = useState<Array<{ id: string; fullName: string; employeeId: string }>>([]);
  const [hostEmployeesLoading, setHostEmployeesLoading] = useState(false);
  const [hostEmployeesError, setHostEmployeesError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [visitorLoading, setVisitorLoading] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadVisitors = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    setError(null);
    try {
      const res = await visitorsApi.getVisitors({ page: pageNum, limit: 50 });
      const newItems = res.items;
      setVisitors((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(newItems.length === 50);
      setPage(pageNum);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load visitors";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisitors(1);
  }, [loadVisitors]);

  const loadHostEmployees = useCallback(async () => {
    setHostEmployeesLoading(true);
    setHostEmployeesError(null);
    try {
      const employees = await documentsApi.getEmployees();
      setHostEmployees(employees.map((e) => ({ id: e.id, fullName: e.fullName, employeeId: e.employeeId })));
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load employees";
      setHostEmployeesError(msg);
      toast.error(msg);
    } finally {
      setHostEmployeesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadHostEmployees();
    }
  }, [open, loadHostEmployees]);

  const stats = useMemo(
    () => ({
      total: visitors.length,
      checkedIn: visitors.filter((v) => v.status === "checked-in").length,
      pending: visitors.filter((v) => v.status === "pending").length,
      today: visitors.filter(
        (v) => v.createdAt && new Date(v.createdAt).toDateString() === new Date().toDateString(),
      ).length,
    }),
    [visitors],
  );

  const filtered = useMemo(
    () =>
      visitors
        .filter((v) => (filter === "all" ? true : v.status === filter))
        .filter((v) =>
          query.trim() === ""
            ? true
            : `${v.name} ${v.company ?? ""} ${v.hostEmployee} ${v.purpose}`
                .toLowerCase()
                .includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        }),
    [visitors, filter, query],
  );

  const hourly = useMemo(() => {
    const buckets = Array.from({ length: 24 }, (_, i) => ({ hour: `${i.toString().padStart(2, "0")}:00`, visitors: 0 }));
    visitors.forEach((v) => {
      if (v.checkInAt) {
        const d = new Date(v.checkInAt);
        if (!isNaN(d.getTime())) {
          const h = d.getHours();
          if (h >= 0 && h < 24) buckets[h].visitors += 1;
        }
      }
    });
    return buckets;
  }, [visitors]);

  async function save() {
    setFieldErrors({});
    if (!draftState.name || !draftState.hostEmployeeId || !draftState.purpose) {
      toast.error("Please enter visitor name, host employee, and purpose");
      return;
    }
    if (draftState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftState.email)) {
      setFieldErrors({ email: "Invalid email format" });
      toast.error("Please enter a valid email");
      return;
    }
    if (draftState.expectedDurationMins <= 0) {
      setFieldErrors({ expectedDurationMins: "Duration must be greater than 0" });
      toast.error("Duration must be greater than 0");
      return;
    }

    setSubmitting(true);
    try {
      const created = await visitorsApi.createVisitor({
        name: draftState.name,
        company: draftState.company || undefined,
        email: draftState.email || undefined,
        phone: draftState.phone || undefined,
        photoUrl: draftState.photoUrl || undefined,
        hostEmployeeId: draftState.hostEmployeeId,
        purpose: draftState.purpose,
        expectedDurationMins: draftState.expectedDurationMins,
      });
      setVisitors((prev) => [created, ...prev]);
      setOpen(false);
      setPass(created);
      setDraftState(emptyDraft());
      setFieldErrors({});
      toast.success("Visitor registered successfully");
    } catch (err: any) {
      const { message, fieldErrors } = createVisitorError(err);
      setFieldErrors(fieldErrors);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(id: string) {
    setVisitorLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await visitorsApi.approveVisitor(id);
      setVisitors((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast.success("Visitor approved");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to approve visitor");
    } finally {
      setVisitorLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleReject(id: string) {
    setVisitorLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await visitorsApi.rejectVisitor(id);
      setVisitors((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast.success("Visitor rejected");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject visitor");
    } finally {
      setVisitorLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleCheckIn(id: string) {
    setVisitorLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await visitorsApi.checkInVisitor(id);
      setVisitors((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast.success("Visitor checked in");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to check in visitor");
    } finally {
      setVisitorLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleCheckOut(id: string) {
    setVisitorLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await visitorsApi.checkOutVisitor(id);
      setVisitors((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast.success("Visitor checked out");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to check out visitor");
    } finally {
      setVisitorLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleExport() {
    if (!canManageVisitors) return;
    setLoading(true);
    try {
      const blob = await visitorsApi.exportVisitors();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visitors-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Visitors exported successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to export visitors");
    } finally {
      setLoading(false);
    }
  }

  function emptyDraft() {
    return {
      id: "",
      name: "",
      company: "",
      hostEmployeeId: "",
      purpose: "",
      expectedDurationMins: 30,
      status: "pending" as VisitorStatus,
      passCode: "",
      createdAt: "",
      email: "",
      phone: "",
      photoUrl: "",
    };
  }

  const [draftState, setDraftState] = useState(emptyDraft());

  if (error && visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load visitors</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => loadVisitors(1)} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          {canManageVisitors && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={loading}
              className="gap-2"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => {
              setDraftState(emptyDraft());
              setFieldErrors({});
              setOpen(true);
            }}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" /> New visitor
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitors today" value={stats.today} icon={UserPlus} />
        <StatCard label="Checked-in" value={stats.checkedIn} icon={LogIn} accent="success" />
        <StatCard
          label="Pending approval"
          value={stats.pending}
          icon={CheckCircle2}
          accent="warning"
        />
        <StatCard label="All-time" value={stats.total} icon={UserPlus} accent="muted" />
      </div>

      <GlassCard className="mb-6">
        <div className="mb-2 font-medium">Today's check-ins by hour</div>
        <div className="h-56">
          <ResponsiveContainer>
            <AreaChart data={hourly}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="hour" fontSize={12} interval={2} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Area dataKey="visitors" stroke="#8b5cf6" fill="url(#vg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search visitors…" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All</option>
          {(
            ["pending", "approved", "checked-in", "checked-out", "rejected"] as VisitorStatus[]
          ).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {hasMore && !loading && (
          <Button variant="outline" size="sm" onClick={() => loadVisitors(page + 1, true)} className="gap-1">
            <Search className="h-4 w-4" /> Load more
          </Button>
        )}
      </div>

      {loading && visitors.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading visitors...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No visitors found.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((v) => {
            const isLoading = visitorLoading[v.id];
            return (
              <GlassCard key={v.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{v.name || "—"}</h3>
                      <StatusBadge status={v.status} tone={getStatusTone(v.status)} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {v.company ? `${v.company} · ` : ""}Host: {v.hostEmployee || "—"}
                    </div>
                    <div className="mt-2 text-sm">{v.purpose || "—"}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Duration: {v.expectedDurationMins ? `${v.expectedDurationMins} min` : "—"}
                      {v.checkInAt ? ` · In ${new Date(v.checkInAt).toLocaleTimeString()}` : ""}
                      {v.checkOutAt ? ` · Out ${new Date(v.checkOutAt).toLocaleTimeString()}` : ""}
                      {v.createdAt && !isNaN(new Date(v.createdAt).getTime()) ? ` · ${new Date(v.createdAt).toLocaleDateString()}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPass(v)}
                      aria-label="Show pass"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                    {v.status === "pending" && canManageVisitors ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleApprove(v.id)} disabled={isLoading}>
                          {isLoading ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(v.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    ) : v.status === "approved" && canManageVisitors ? (
                      <Button size="sm" onClick={() => handleCheckIn(v.id)} className="gap-1" disabled={isLoading}>
                        <LogIn className="h-3.5 w-3.5" /> {isLoading ? "Checking in..." : "Check in"}
                      </Button>
                    ) : v.status === "checked-in" && canManageVisitors ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckOut(v.id)}
                        className="gap-1"
                        disabled={isLoading}
                      >
                        <LogOutIcon className="h-3.5 w-3.5" /> {isLoading ? "Checking out..." : "Check out"}
                      </Button>
                    ) : v.status === "pending" && !canManageVisitors ? (
                      <span className="text-xs text-muted-foreground">Awaiting approval</span>
                    ) : v.status === "checked-out" ? (
                      <span className="text-xs text-muted-foreground">Done</span>
                    ) : v.status === "rejected" ? (
                      <span className="text-xs text-rose-500 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* New Visitor Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New visitor</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Visitor name</Label>
              <Input
                value={draftState.name}
                onChange={(e) => setDraftState({ ...draftState, name: e.target.value })}
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-rose-500">{fieldErrors.name}</p>}
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={draftState.company ?? ""}
                onChange={(e) => setDraftState({ ...draftState, company: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={draftState.phone ?? ""}
                onChange={(e) => setDraftState({ ...draftState, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={draftState.email ?? ""}
                onChange={(e) => setDraftState({ ...draftState, email: e.target.value })}
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-rose-500">{fieldErrors.email}</p>}
            </div>
            <div className="col-span-2">
              <Label>Host employee</Label>
              {hostEmployeesLoading ? (
                <Input placeholder="Loading employees…" disabled />
              ) : hostEmployeesError ? (
                <>
                  <Input placeholder="Failed to load employees" disabled />
                  <p className="mt-1 text-xs text-rose-500">{hostEmployeesError}</p>
                </>
              ) : (
                <select
                  value={draftState.hostEmployeeId}
                  onChange={(e) => setDraftState({ ...draftState, hostEmployeeId: e.target.value })}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                  aria-invalid={!!fieldErrors.hostEmployeeId}
                >
                  <option value="">Select host employee</option>
                  {hostEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              )}
              {fieldErrors.hostEmployeeId && <p className="mt-1 text-xs text-rose-500">{fieldErrors.hostEmployeeId}</p>}
            </div>
            <div className="col-span-2">
              <Label>Purpose</Label>
              <Input
                value={draftState.purpose}
                onChange={(e) => setDraftState({ ...draftState, purpose: e.target.value })}
                aria-invalid={!!fieldErrors.purpose}
              />
              {fieldErrors.purpose && <p className="mt-1 text-xs text-rose-500">{fieldErrors.purpose}</p>}
            </div>
            <div>
              <Label>Duration (mins)</Label>
              <Input
                type="number"
                value={draftState.expectedDurationMins}
                onChange={(e) =>
                  setDraftState({ ...draftState, expectedDurationMins: Number(e.target.value) })
                }
                aria-invalid={!!fieldErrors.expectedDurationMins}
              />
              {fieldErrors.expectedDurationMins && <p className="mt-1 text-xs text-rose-500">{fieldErrors.expectedDurationMins}</p>}
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input
                value={draftState.photoUrl ?? ""}
                onChange={(e) => setDraftState({ ...draftState, photoUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={submitting}>
              {submitting ? "Registering..." : "Create pass"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visitor Pass Dialog - Print-only view */}
      <Dialog open={!!pass} onOpenChange={(o) => !o && setPass(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Visitor Pass</DialogTitle>
          </DialogHeader>
          {pass ? (
            <div className="flex flex-col items-center gap-3 text-center print-only" id="visitor-pass-print">
              <div className="text-lg font-semibold">{pass.name}</div>
              <div className="text-xs text-muted-foreground">Host: {pass.hostEmployee || "—"}</div>
              <div className="text-xs text-muted-foreground">Company: {pass.company || "—"}</div>
              <div className="text-xs text-muted-foreground">Purpose: {pass.purpose}</div>
              <QrTile value={`OFC360-VISITOR:${pass.passCode}`} label={pass.passCode || "—"} size={170} />
              <div className="text-xs text-muted-foreground">Pass Code: {pass.passCode || "—"}</div>
              {pass.createdAt && !isNaN(new Date(pass.createdAt).getTime()) && (
                <div className="text-xs text-muted-foreground">Date: {new Date(pass.createdAt).toLocaleDateString()}</div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  Print pass
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          body > *:not(#visitor-pass-print):not(#visitor-pass-print *) {
            display: none !important;
          }
          #visitor-pass-print {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 2rem;
            background: white;
            z-index: 9999;
          }
          .print-only {
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

export default VisitorsPage;