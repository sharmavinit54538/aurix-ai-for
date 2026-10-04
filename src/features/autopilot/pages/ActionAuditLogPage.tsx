import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Lock,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  User,
  X,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuditLog } from "../hooks/useAuditLog";
import type { AuditDecision, AuditLogEntry, AuditStatus } from "../types";

const DECISION_BADGES: Record<AuditDecision, { label: string; color: string }> = {
  auto_approved: {
    label: "Auto Approved",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  auto_rejected: {
    label: "Auto Rejected",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  escalated: {
    label: "Escalated",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  executed_task: {
    label: "Executed Task",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

const STATUS_BADGES: Record<AuditStatus, { label: string; color: string }> = {
  active: {
    label: "Active",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  undone: {
    label: "Undone",
    color: "bg-muted text-muted-foreground border-border",
  },
  overridden: {
    label: "Overridden",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
};

export default function ActionAuditLogPage() {
  const {
    items,
    total,
    page,
    limit,
    loading,
    error,
    backendUnavailable,
    filterWorkflow,
    filterDecision,
    searchQuery,
    selectedEntry,
    setSelectedEntry,
    setPage,
    setFilterWorkflow,
    setFilterDecision,
    setSearchQuery,
    refetch,
    undoAction,
    overrideAction,
    exportCsv,
  } = useAuditLog();

  // Detail modal mode: detail | undo | override
  const [detailViewMode, setDetailViewMode] = useState<"detail" | "undo" | "override">("detail");
  const [undoReason, setUndoReason] = useState("");
  const [undoing, setUndoing] = useState(false);

  const [newDecision, setNewDecision] = useState<string>("auto_rejected");
  const [overrideReason, setOverrideReason] = useState("");
  const [overriding, setOverriding] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleOpenEntry = (entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    setDetailViewMode("detail");
    setUndoReason("");
    setOverrideReason("");
    setNewDecision("auto_rejected");
  };

  const handleConfirmUndo = async () => {
    if (!selectedEntry || !undoReason.trim()) return;
    setUndoing(true);
    try {
      const ok = await undoAction(selectedEntry.id, undoReason.trim());
      if (ok) {
        setDetailViewMode("detail");
        setUndoReason("");
      }
    } finally {
      setUndoing(false);
    }
  };

  const handleConfirmOverride = async () => {
    if (!selectedEntry || overrideReason.trim().length < 10) return;
    setOverriding(true);
    try {
      const ok = await overrideAction(selectedEntry.id, newDecision, overrideReason.trim());
      if (ok) {
        setDetailViewMode("detail");
        setOverrideReason("");
      }
    } finally {
      setOverriding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Inline Error with Retry ──────────────────────────────────── */}
      {error && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">Error Loading Audit Log</AlertTitle>
          <AlertDescription className="text-xs mt-1 flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="h-7 text-xs rounded-lg"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Filter Toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search subject, policy, or rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background/80"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Select value={filterWorkflow} onValueChange={setFilterWorkflow}>
            <SelectTrigger className="h-9 w-40 rounded-xl text-xs bg-background/80">
              <SelectValue placeholder="All Workflows" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Workflows</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="regularization">Attendance</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="payroll_run">Payroll</SelectItem>
              <SelectItem value="recruitment_screening">Screening</SelectItem>
              <SelectItem value="document_generation">Documents</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDecision} onValueChange={setFilterDecision}>
            <SelectTrigger className="h-9 w-36 rounded-xl text-xs bg-background/80">
              <SelectValue placeholder="All Decisions" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Decisions</SelectItem>
              <SelectItem value="auto_approved">Auto Approved</SelectItem>
              <SelectItem value="auto_rejected">Auto Rejected</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="executed_task">Executed Task</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            className="rounded-xl h-9 gap-1.5 text-xs bg-background/80 shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* ── Audit Table Card ────────────────────────────────────────── */}
      <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border/60">
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Workflow</TableHead>
                <TableHead className="text-xs font-semibold">Subject</TableHead>
                <TableHead className="text-xs font-semibold">Decision</TableHead>
                <TableHead className="text-xs font-semibold">Confidence</TableHead>
                <TableHead className="text-xs font-semibold">Policy / Rule Cited</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8}>
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 rounded-2xl bg-muted/60 text-muted-foreground">
                        <History className="h-6 w-6" />
                      </div>
                      <span className="font-semibold text-sm">No Audit Logs Found</span>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        No AI actions match the active search or filter criteria.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((entry) => {
                  const dec = DECISION_BADGES[entry.decision] || {
                    label: entry.decision,
                    color: "bg-muted text-muted-foreground",
                  };
                  const st = STATUS_BADGES[entry.status] || {
                    label: entry.status,
                    color: "bg-muted text-muted-foreground",
                  };

                  return (
                    <TableRow
                      key={entry.id}
                      className="cursor-pointer hover:bg-accent/40 border-border/40 transition-colors"
                      onClick={() => handleOpenEntry(entry)}
                    >
                      <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                          {entry.workflow}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium max-w-[220px] truncate">
                        {entry.subject}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${dec.color}`}>
                          {dec.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs font-semibold">
                          {entry.confidence}%
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate font-mono text-[11px]">
                        {entry.ruleName || entry.policyClause}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${st.color}`}>
                          {st.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEntry(entry);
                          }}
                          className="h-7 w-7 p-0 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* ── Server-Side Pagination Controls ─────────────────────────── */}
        <CardFooter className="py-3 px-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {items.length} of {total} total entries
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="h-8 rounded-lg gap-1 text-xs px-2.5"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="text-xs font-mono px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="h-8 rounded-lg gap-1 text-xs px-2.5"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* ── Row Detail & Action Dialog ───────────────────────────────── */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-[620px] rounded-2xl max-h-[85vh] overflow-y-auto">
          {selectedEntry && (
            <>
              {detailViewMode === "detail" && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider mb-1">
                      <Bot className="h-4 w-4" />
                      <span>Audit Entry #{selectedEntry.id}</span>
                    </div>
                    <DialogTitle className="text-lg font-semibold">
                      {selectedEntry.subject}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Executed on {new Date(selectedEntry.timestamp).toLocaleString("en-IN")} via {selectedEntry.workflow} workflow engine.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 my-2 text-xs">
                    {/* Decision summary bar */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/40 border border-border/60">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-mono">Decision</span>
                        <span className="font-semibold text-foreground">{selectedEntry.decision}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-mono">Confidence</span>
                        <span className="font-semibold font-mono text-primary">{selectedEntry.confidence}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-mono">Audit Status</span>
                        <span className="font-semibold">{selectedEntry.status}</span>
                      </div>
                    </div>

                    {/* Full Reasoning */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">AI Reasoning & Evidence</Label>
                      <div className="p-3 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed">
                        {selectedEntry.fullReasoning || "No extended reasoning captured."}
                      </div>
                    </div>

                    {/* Policy & Rule Cited */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Policy Clause & Rule Basis</Label>
                      <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs space-y-1 font-mono">
                        <div>Clause: {selectedEntry.policyClause}</div>
                        {selectedEntry.ruleName && <div>Rule Name: {selectedEntry.ruleName}</div>}
                      </div>
                    </div>

                    {/* Override metadata if exists */}
                    {selectedEntry.overrideBy && (
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-950 dark:text-purple-200 space-y-1">
                        <span className="font-semibold text-xs flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          Human Override Recorded
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          Overridden by {selectedEntry.overrideBy.name} on{" "}
                          {selectedEntry.overrideAt ? new Date(selectedEntry.overrideAt).toLocaleString("en-IN") : "N/A"}.
                        </p>
                        <p className="text-[11px] italic">Reason: "{selectedEntry.overrideReason}"</p>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="gap-2 sm:gap-2 border-t border-border pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedEntry(null)}
                      className="rounded-xl h-9 text-xs"
                    >
                      Close
                    </Button>

                    {selectedEntry.canUndo && selectedEntry.status === "active" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDetailViewMode("undo")}
                        className="rounded-xl h-9 text-xs gap-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Undo Action
                      </Button>
                    )}

                    {selectedEntry.canOverride && (
                      <Button
                        type="button"
                        onClick={() => setDetailViewMode("override")}
                        className="rounded-xl h-9 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Override Decision
                      </Button>
                    )}
                  </DialogFooter>
                </>
              )}

              {detailViewMode === "undo" && (
                <>
                  <DialogHeader>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-center text-base font-semibold">Undo AI Action</DialogTitle>
                    <DialogDescription className="text-center text-xs text-muted-foreground">
                      Reversing this action will rollback the automated record and restore previous state for #{selectedEntry.id}.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2 my-2 text-xs">
                    <Label className="text-xs font-medium text-foreground">Reason for Reversal</Label>
                    <Textarea
                      placeholder="e.g. Action executed on obsolete employee balance or erroneous slip..."
                      value={undoReason}
                      onChange={(e) => setUndoReason(e.target.value)}
                      rows={3}
                      className="rounded-xl text-xs"
                    />
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0 border-t border-border pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDetailViewMode("detail")}
                      className="rounded-xl h-9 text-xs"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void handleConfirmUndo()}
                      disabled={!undoReason.trim() || undoing}
                      className="rounded-xl h-9 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      {undoing ? "Reversing..." : "Confirm Undo"}
                    </Button>
                  </DialogFooter>
                </>
              )}

              {detailViewMode === "override" && (
                <>
                  <DialogHeader>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <DialogTitle className="text-center text-base font-semibold">Override Decision</DialogTitle>
                    <DialogDescription className="text-center text-xs text-muted-foreground">
                      Replace the AI's autonomous verdict with an authoritative human decision.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 my-2 text-xs">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">New Decision Verdict</Label>
                      <Select value={newDecision} onValueChange={setNewDecision}>
                        <SelectTrigger className="rounded-xl text-xs h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-xs">
                          <SelectItem value="auto_approved">Approve & Release</SelectItem>
                          <SelectItem value="auto_rejected">Reject & Cancel</SelectItem>
                          <SelectItem value="escalated">Escalate to Executive Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <Label className="text-xs font-medium text-foreground">Justification Reason</Label>
                        <span className={`text-[10px] font-mono ${overrideReason.trim().length >= 10 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                          {overrideReason.trim().length} / min 10 chars
                        </span>
                      </div>
                      <Textarea
                        placeholder="Detailed rationale for overriding the autonomous policy engine..."
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        rows={3}
                        className="rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0 border-t border-border pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDetailViewMode("detail")}
                      className="rounded-xl h-9 text-xs"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void handleConfirmOverride()}
                      disabled={overrideReason.trim().length < 10 || overriding}
                      className="rounded-xl h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {overriding ? "Recording..." : "Apply Override"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
