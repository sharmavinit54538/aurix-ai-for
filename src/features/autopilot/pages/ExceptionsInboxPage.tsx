import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Inbox,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  User,
  UserCheck,
  UserX,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { useExceptionsInbox } from "../hooks/useExceptionsInbox";
import type { AutopilotException, ExceptionUrgency } from "../types";

const URGENCY_BADGES: Record<ExceptionUrgency, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  high: { label: "High", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  critical: { label: "Critical", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" },
};

export default function ExceptionsInboxPage() {
  const {
    exceptions,
    total,
    loading,
    error,
    backendUnavailable,
    filterWorkflow,
    filterUrgency,
    searchQuery,
    setFilterWorkflow,
    setFilterUrgency,
    setSearchQuery,
    refetch,
    submitDecision,
  } = useExceptionsInbox();

  // Reject Dialog state
  const [rejectItem, setRejectItem] = useState<AutopilotException | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  // Reassign Dialog state
  const [reassignItem, setReassignItem] = useState<AutopilotException | null>(null);
  const [reassignTarget, setReassignTarget] = useState("");
  const [reassignReason, setReassignReason] = useState("");
  const [submittingReassign, setSubmittingReassign] = useState(false);

  const handleApprove = async (item: AutopilotException) => {
    await submitDecision(item.id, {
      decision: "approve",
      reason: "Manual exception approval granted by manager.",
    });
  };

  const handleConfirmReject = async () => {
    if (!rejectItem || rejectReason.trim().length < 10) return;
    setSubmittingReject(true);
    try {
      await submitDecision(rejectItem.id, {
        decision: "reject",
        reason: rejectReason.trim(),
      });
      setRejectItem(null);
      setRejectReason("");
    } finally {
      setSubmittingReject(false);
    }
  };

  const handleConfirmReassign = async () => {
    if (!reassignItem || !reassignTarget) return;
    setSubmittingReassign(true);
    try {
      await submitDecision(reassignItem.id, {
        decision: "reassign",
        reason: reassignReason.trim() || "Reassigned for specialized departmental review.",
        reassignedToUserId: reassignTarget,
      });
      setReassignItem(null);
      setReassignTarget("");
      setReassignReason("");
    } finally {
      setSubmittingReassign(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Inbox className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Exceptions Inbox</h1>
            <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider ml-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">
              {total} Pending
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Triage requests that could not be auto-resolved due to policy edge-cases, missing criteria, or low AI confidence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="rounded-xl h-9 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              The Autopilot Exceptions Inbox API (<code>/api/v2/autopilot/exceptions</code>) is awaiting deployment.
              Real exceptions will appear automatically once the service is live.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/AUTOPILOT_BACKEND_CONTRACT.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Inline Error with Retry ──────────────────────────────────── */}
      {error && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">Error Loading Exceptions</AlertTitle>
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

      {/* ── Filter & Search Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by requester, subject, or ID..."
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
              <SelectItem value="leave">Leave Requests</SelectItem>
              <SelectItem value="expense">Expense Claims</SelectItem>
              <SelectItem value="regularization">Attendance</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="payroll_run">Payroll</SelectItem>
              <SelectItem value="recruitment_screening">Screening</SelectItem>
              <SelectItem value="document_generation">Documents</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="h-9 w-36 rounded-xl text-xs bg-background/80">
              <SelectValue placeholder="All Urgencies" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Exceptions List or Skeleton / Empty State ───────────────── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : exceptions.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border bg-card/30 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-base font-semibold">Zero Exceptions Pending</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Autopilot HR is operating smoothly within defined policy rules. Any request requiring human judgment will be queued here.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-4">
          {exceptions.map((item) => (
            <ExceptionCard
              key={item.id}
              exception={item}
              onApprove={() => handleApprove(item)}
              onReject={() => setRejectItem(item)}
              onReassign={() => setReassignItem(item)}
            />
          ))}
        </div>
      )}

      {/* ── Reject Reason Confirmation Dialog ────────────────────────── */}
      <Dialog open={!!rejectItem} onOpenChange={(open) => !open && setRejectItem(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-2">
              <XCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold">
              Reject Request
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Provide a clear reason for the rejection. This feedback will be sent directly to the requester and recorded in the audit trail.
            </DialogDescription>
          </DialogHeader>

          {rejectItem && (
            <div className="my-2 space-y-3">
              <div className="p-3 rounded-xl bg-muted/40 text-xs border border-border/60">
                <span className="font-semibold text-foreground">{rejectItem.subject}</span>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Requested by {rejectItem.requester.name} ({rejectItem.requester.department})
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-xs text-foreground font-medium">Rejection Reason</Label>
                  <span className={`text-[10px] font-mono ${rejectReason.trim().length >= 10 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                    {rejectReason.trim().length} / min 10 chars
                  </span>
                </div>
                <Textarea
                  placeholder="e.g. Please submit with supporting documentation before re-applying..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectItem(null)}
              className="rounded-xl h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleConfirmReject()}
              disabled={rejectReason.trim().length < 10 || submittingReject}
              className="rounded-xl h-9 text-xs"
            >
              {submittingReject ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reassign Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!reassignItem} onOpenChange={(open) => !open && setReassignItem(null)}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold">
              Reassign Exception
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Transfer this exception to another reviewer or department head for specialized evaluation.
            </DialogDescription>
          </DialogHeader>

          {reassignItem && (
            <div className="my-2 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground font-medium">Assign To</Label>
                <Select value={reassignTarget} onValueChange={setReassignTarget}>
                  <SelectTrigger className="rounded-xl text-xs h-9">
                    <SelectValue placeholder="Select reviewer..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="usr-finance-lead">Finance Lead (Expense & Compliance)</SelectItem>
                    <SelectItem value="usr-hr-director">HR Operations Director</SelectItem>
                    <SelectItem value="usr-department-head">Direct Department Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-foreground font-medium">Note for Reviewer (Optional)</Label>
                <Textarea
                  placeholder="Context on why this is being escalated..."
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  rows={2}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReassignItem(null)}
              className="rounded-xl h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleConfirmReassign()}
              disabled={!reassignTarget || submittingReassign}
              className="rounded-xl h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submittingReassign ? "Reassigning..." : "Confirm Reassignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ExceptionCardProps {
  exception: AutopilotException;
  onApprove: () => void;
  onReject: () => void;
  onReassign: () => void;
}

function ExceptionCard({ exception, onApprove, onReject, onReassign }: ExceptionCardProps) {
  const urgencyInfo = URGENCY_BADGES[exception.urgency];

  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm shadow-2xs hover:shadow-sm transition-all overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-xl border border-border">
              <AvatarImage src={exception.requester.avatarUrl} />
              <AvatarFallback className="rounded-xl text-xs font-semibold bg-primary/10 text-primary">
                {exception.requester.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  {exception.subject}
                </CardTitle>
                <Badge variant="outline" className={`text-[10px] px-2 py-0.2 rounded-full ${urgencyInfo.color}`}>
                  {urgencyInfo.label} Urgency
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Requested by <span className="font-medium text-foreground">{exception.requester.name}</span> • {exception.requester.department}
                {exception.requester.designation && ` • ${exception.requester.designation}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onReassign}
              className="rounded-xl h-8 text-xs gap-1.5"
            >
              <Users className="h-3 w-3" />
              Reassign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="rounded-xl h-8 text-xs gap-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
            >
              <X className="h-3 w-3" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={onApprove}
              className="rounded-xl h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-3 w-3" />
              Approve
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3 pb-3 text-xs space-y-2.5">
        {/* Escalation reason callout */}
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-950 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1 flex-1">
              <span className="font-semibold text-xs text-amber-900 dark:text-amber-300">
                Escalation Trigger:
              </span>
              <p className="text-[11px] text-muted-foreground text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                {exception.escalationReason}
              </p>
            </div>
          </div>
        </div>

        {/* AI Suggestion + Cited Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded-xl border border-border/60 bg-background/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-primary" />
              AI Recommended Decision:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-primary">
                {exception.suggestedDecision}
              </span>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {exception.confidence}% Confidence
              </Badge>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-border/60 bg-background/50 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              Cited Policy Clause:
            </span>
            <span className="font-mono text-[11px] font-medium text-foreground truncate max-w-[240px]">
              {exception.policyClause}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="py-2.5 px-4 border-t border-border/30 bg-muted/20 text-[10px] text-muted-foreground flex justify-between items-center">
        <span>Request ID: <code className="font-mono">{exception.requestId || exception.id}</code></span>
        <span>Received: {new Date(exception.createdAt).toLocaleString("en-IN")}</span>
      </CardFooter>
    </Card>
  );
}
