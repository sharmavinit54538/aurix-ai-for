import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getErrorMessage, parseListResponse } from "@/api/utils";
import { useAurix } from "@/lib/aurix-store";
import { recruitmentApi } from "@/services/recruitmentApi";
import { EmptyState } from "@/components/hrms/Shared";
import { fmtDate } from "../components/Bits";

type ReqStatus = "pending" | "approved" | "rejected" | "draft" | string;

interface RequisitionRecord {
  id: string;
  title: string;
  department: string;
  headcount: number;
  priority: string;
  status: ReqStatus;
  requestedBy: string;
  reason: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  createdAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  raw?: Record<string, unknown>;
}

const APPROVER_ROLES = new Set(["admin", "hr_admin", "hr", "manager", "hiring_manager", "tenant_admin", "org_admin"]);

function mapRequisition(raw: Record<string, unknown>): RequisitionRecord {
  const creator = raw.requested_by_user as Record<string, unknown> | undefined;
  const requesterName =
    (typeof raw.requested_by === "string" && raw.requested_by) ||
    (typeof raw.requestedBy === "string" && raw.requestedBy) ||
    (creator ? `${creator.first_name ?? ""} ${creator.last_name ?? ""}`.trim() : "") ||
    (typeof raw.created_by === "string" ? raw.created_by : "") ||
    "—";

  return {
    id: String(raw.id ?? raw.requisition_id ?? ""),
    title: String(raw.title ?? raw.role_title ?? "Untitled Requisition"),
    department: String(raw.department ?? "General"),
    headcount: Number(raw.headcount ?? raw.headcount_needed ?? 1) || 1,
    priority: String(raw.priority ?? "normal").toLowerCase(),
    status: String(raw.status ?? "pending").toLowerCase(),
    requestedBy: requesterName,
    reason: String(raw.reason ?? raw.justification ?? ""),
    budgetMin: typeof raw.budget_min === "number" ? raw.budget_min : undefined,
    budgetMax: typeof raw.budget_max === "number" ? raw.budget_max : undefined,
    currency: typeof raw.currency === "string" ? raw.currency : undefined,
    createdAt: typeof raw.created_at === "string" ? raw.created_at : undefined,
    approvedAt: typeof raw.approved_at === "string" ? raw.approved_at : undefined,
    approvedBy: typeof raw.approved_by === "string" ? raw.approved_by : undefined,
    raw,
  };
}

function normalizeStatusBadge(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-600";
    case "rejected":
      return "border-rose-500/30 bg-rose-500/15 text-rose-600";
    default:
      return "border-amber-500/30 bg-amber-500/15 text-amber-700";
  }
}

export function RequisitionsPage() {
  const navigate = useNavigate();
  const { user } = useAurix();
  const normalizedRole = String(user?.role || "").toLowerCase();
  const canApprove = APPROVER_ROLES.has(normalizedRole);

  const [items, setItems] = useState<RequisitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formHeadcount, setFormHeadcount] = useState("1");
  const [formPriority, setFormPriority] = useState("high");
  const [formReason, setFormReason] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<RequisitionRecord | null>(null);

  const loadRequisitions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await recruitmentApi.getRequisitions();
      const parsed = parseListResponse<Record<string, unknown>>(raw);
      setItems(parsed.items.map(mapRequisition).filter((r) => Boolean(r.id)));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load requisitions"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequisitions();
  }, [loadRequisitions]);

  const counts = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((r) => r.status === "pending" || r.status === "submitted").length,
      approved: items.filter((r) => r.status === "approved").length,
      rejected: items.filter((r) => r.status === "rejected").length,
    }),
    [items],
  );

  const list = useMemo(
    () =>
      items.filter((r) => {
        if (filter === "all") return true;
        if (filter === "pending") return r.status === "pending" || r.status === "submitted";
        return r.status === filter;
      }),
    [items, filter],
  );

  async function handleViewDetails(id: string) {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailItem(null);
    try {
      const raw = await recruitmentApi.getRequisitionById(id);
      setDetailItem(mapRequisition((raw || {}) as Record<string, unknown>));
    } catch (err) {
      setDetailError(getErrorMessage(err, "Failed to load requisition details"));
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleApprove(req: RequisitionRecord) {
    if (!canApprove) {
      toast.error("You do not have permission to approve requisitions.");
      return;
    }
    setApprovingId(req.id);
    try {
      await recruitmentApi.approveRequisition(req.id);
      toast.success(`Requisition "${req.title}" approved.`);
      await loadRequisitions();
      if (detailItem?.id === req.id) {
        await handleViewDetails(req.id);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to approve requisition"));
    } finally {
      setApprovingId(null);
    }
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const headcount = Number(formHeadcount);
    if (!formTitle.trim() || !formDept.trim() || !formReason.trim()) {
      toast.error("Role title, department, and justification are required.");
      return;
    }
    if (!Number.isFinite(headcount) || headcount < 1) {
      toast.error("Headcount must be at least 1.");
      return;
    }

    setCreating(true);
    try {
      await recruitmentApi.createRequisition({
        title: formTitle.trim(),
        department: formDept.trim(),
        headcount,
        priority: formPriority,
        reason: formReason.trim(),
        justification: formReason.trim(),
      });
      toast.success(`Requisition "${formTitle.trim()}" created.`);
      setCreateOpen(false);
      setFormTitle("");
      setFormDept("");
      setFormHeadcount("1");
      setFormPriority("high");
      setFormReason("");
      await loadRequisitions();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create requisition"));
    } finally {
      setCreating(false);
    }
  }

  function handleConvertToJob(req: RequisitionRecord) {
    navigate({
      to: "/dashboard/recruitment/jobs/new",
      search: {
        title: req.title,
        department: req.department,
        vacancies: req.headcount,
      } as Record<string, unknown>,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Requisitions"
        description="Department headcount requests and budget approvals synced with the backend"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadRequisitions()} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-brand text-brand-foreground shadow-glow"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Requisition
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { k: "Total Requisitions", v: counts.total },
          { k: "Pending Approval", v: counts.pending },
          { k: "Approved", v: counts.approved },
          { k: "Rejected", v: counts.rejected },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.k}</div>
            <div className="mt-1.5 font-display text-2xl font-semibold">{s.v}</div>
          </div>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => void loadRequisitions()}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {[
          { k: "all", label: "All" },
          { k: "pending", label: "Pending" },
          { k: "approved", label: "Approved" },
          { k: "rejected", label: "Rejected" },
        ].map((f) => (
          <Button
            key={f.k}
            size="sm"
            variant={filter === f.k ? "default" : "outline"}
            onClick={() => setFilter(f.k)}
            className="text-xs"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/60 p-10 text-center text-sm text-muted-foreground">
          Loading requisitions...
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No requisitions found"
          description={
            filter === "all"
              ? "Submit a headcount requisition to initiate recruitment approval."
              : "No requisitions match the selected status filter."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {list.map((r) => {
            const isPending = r.status === "pending" || r.status === "submitted" || r.status === "draft";
            const isApproved = r.status === "approved";
            return (
              <div
                key={r.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all hover:shadow-elegant"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-muted-foreground">{r.id}</div>
                      <h3 className="mt-0.5 truncate font-display text-base font-semibold">{r.title}</h3>
                      <div className="text-xs text-muted-foreground">
                        {r.department} · Headcount: {r.headcount} · Priority: {r.priority}
                      </div>
                    </div>
                    <Badge variant="outline" className={`capitalize text-[11px] ${normalizeStatusBadge(r.status)}`}>
                      {r.status}
                    </Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                    {r.reason || "No justification provided."}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">
                    Requested by {r.requestedBy}
                    {r.createdAt ? ` · ${fmtDate(r.createdAt)}` : ""}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 px-2 text-xs"
                      onClick={() => void handleViewDetails(r.id)}
                    >
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                    {isPending && canApprove && (
                      <Button
                        size="sm"
                        className="h-7 gap-1 bg-emerald-600 px-2.5 text-xs text-white hover:bg-emerald-700"
                        disabled={approvingId === r.id}
                        onClick={() => void handleApprove(r)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {approvingId === r.id ? "Approving..." : "Approve"}
                      </Button>
                    )}
                    {isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 px-2.5 text-xs"
                        onClick={() => handleConvertToJob(r)}
                      >
                        <Briefcase className="h-3 w-3" />
                        Create Job
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Requisition Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>New Job Requisition</DialogTitle>
              <DialogDescription>
                Request approval to open a new role requisition.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3 text-xs">
              <div>
                <Label htmlFor="req-title">Role Title *</Label>
                <Input
                  id="req-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="req-dept">Department *</Label>
                  <Input
                    id="req-dept"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="e.g. Engineering"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="req-headcount">Headcount *</Label>
                  <Input
                    id="req-headcount"
                    type="number"
                    min={1}
                    max={100}
                    value={formHeadcount}
                    onChange={(e) => setFormHeadcount(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={formPriority} onValueChange={setFormPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="req-reason">Business Justification *</Label>
                <Textarea
                  id="req-reason"
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Explain the hiring need, project impact, or team gap..."
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Submitting..." : "Submit Requisition"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Requisition Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailItem?.title || "Requisition Details"}</DialogTitle>
            <DialogDescription>
              {detailItem ? `${detailItem.department} · Headcount ${detailItem.headcount}` : "Loading record..."}
            </DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading requisition details...</div>
          ) : detailError ? (
            <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {detailError}
            </div>
          ) : detailItem ? (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-0.5 font-semibold capitalize">{detailItem.status}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority</span>
                  <div className="mt-0.5 font-semibold capitalize">{detailItem.priority}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Requested By</span>
                  <div className="mt-0.5 font-semibold">{detailItem.requestedBy}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Created At</span>
                  <div className="mt-0.5 font-semibold">
                    {detailItem.createdAt ? fmtDate(detailItem.createdAt) : "—"}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Justification</div>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {detailItem.reason || "No justification recorded."}
                </p>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            {detailItem &&
              (detailItem.status === "pending" || detailItem.status === "submitted") &&
              canApprove && (
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={approvingId === detailItem.id}
                  onClick={() => void handleApprove(detailItem)}
                >
                  {approvingId === detailItem.id ? "Approving..." : "Approve Requisition"}
                </Button>
              )}
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
