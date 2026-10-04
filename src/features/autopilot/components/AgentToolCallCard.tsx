import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RotateCcw,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
import type { AgentToolCall } from "../types";

interface AgentToolCallCardProps {
  toolCall: AgentToolCall;
  onConfirm: (toolCallId: string) => Promise<void>;
  onCancel: (toolCallId: string) => Promise<void>;
  onUndo?: (actionId: string, reason: string) => Promise<void>;
  disabled?: boolean;
}

const ACTION_LABELS: Record<string, string> = {
  apply_leave: "Apply Leave",
  send_payslip: "Send Payslip",
  generate_document: "Generate HR Document",
  regularize_attendance: "Regularize Attendance",
  submit_expense: "Submit Expense Claim",
  update_profile: "Update Employee Profile",
  trigger_onboarding: "Trigger Onboarding Workflow",
};

export function AgentToolCallCard({
  toolCall,
  onConfirm,
  onCancel,
  onUndo,
  disabled = false,
}: AgentToolCallCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [undoDialogOpen, setUndoDialogOpen] = useState(false);
  const [undoReason, setUndoReason] = useState("");
  const [undoing, setUndoing] = useState(false);

  const actionName = ACTION_LABELS[toolCall.action] || toolCall.action.replace(/_/g, " ");

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await onConfirm(toolCall.id);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await onCancel(toolCall.id);
    } finally {
      setCancelling(false);
    }
  };

  const handleExecuteUndo = async () => {
    if (!onUndo) return;
    try {
      setUndoing(true);
      const actionId = toolCall.result?.undoActionId || toolCall.id;
      await onUndo(actionId, undoReason.trim());
      setUndoDialogOpen(false);
      setUndoReason("");
    } finally {
      setUndoing(false);
    }
  };

  // ── 1) Proposed State (Confirmation Card) ──────────────────────────
  if (toolCall.status === "proposed") {
    return (
      <Card className="rounded-2xl border border-primary/30 bg-primary/5 shadow-sm overflow-hidden my-3">
        <CardHeader className="py-2.5 px-3.5 border-b border-primary/15 bg-primary/10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary/20 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-primary">
              Action Proposal · Requires Confirmation
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-background/60">
            {toolCall.action}
          </Badge>
        </CardHeader>

        <CardContent className="p-3.5 space-y-3 text-xs">
          <div>
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Proposed Action
            </div>
            <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5 text-primary" />
              {actionName}
            </div>
          </div>

          {/* Parameters List */}
          {toolCall.parameters && Object.keys(toolCall.parameters).length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                Parameters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-background/60 rounded-xl p-2.5 border border-border/50">
                {Object.entries(toolCall.parameters).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-[11px] px-1">
                    <span className="font-mono text-muted-foreground">{key}:</span>
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expected Effect */}
          {toolCall.expectedEffect && (
            <div className="flex items-start gap-2 p-2 rounded-xl bg-accent/60 border border-border/60 text-xs">
              <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <div className="text-foreground">
                <span className="font-semibold">Expected effect: </span>
                {toolCall.expectedEffect}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="py-2.5 px-3.5 border-t border-border/40 bg-background/40 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={disabled || confirming || cancelling}
            className="rounded-xl h-8 text-xs gap-1 cursor-pointer"
          >
            {cancelling ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={disabled || confirming || cancelling}
            className="rounded-xl h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            {confirming ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Confirm & Execute
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ── 2) Running State ───────────────────────────────────────────────
  if (toolCall.status === "running") {
    return (
      <Card className="rounded-2xl border border-primary/30 bg-primary/5 shadow-xs overflow-hidden my-3">
        <CardContent className="p-4 flex items-center gap-3 text-xs">
          <div className="p-2 rounded-xl bg-primary/20 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground">
              Executing {actionName}...
            </div>
            <div className="text-muted-foreground text-[11px] mt-0.5">
              The Autopilot HR engine is applying the action with live policy verification.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── 3) Done State ──────────────────────────────────────────────────
  if (toolCall.status === "done") {
    return (
      <>
        <Card className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-xs overflow-hidden my-3">
          <CardHeader className="py-2 px-3.5 border-b border-emerald-500/20 bg-emerald-500/10 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Action Executed Successfully
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              Completed
            </Badge>
          </CardHeader>

          <CardContent className="p-3.5 text-xs space-y-2">
            <div className="text-foreground">
              {toolCall.result?.message || `Successfully executed ${actionName}.`}
            </div>

            {toolCall.result?.recordUrl && (
              <div className="pt-1">
                <a
                  href={toolCall.result.recordUrl}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-semibold text-xs"
                >
                  View created record ({toolCall.result.recordId || "Record"})
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </CardContent>

          {toolCall.result?.canUndo && onUndo && (
            <CardFooter className="py-2 px-3.5 border-t border-emerald-500/15 bg-background/30 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUndoDialogOpen(true)}
                disabled={disabled}
                className="rounded-xl h-7 text-[11px] gap-1 border-muted-foreground/30 hover:bg-accent cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Undo Action
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Undo Confirm Dialog */}
        <Dialog open={undoDialogOpen} onOpenChange={setUndoDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-500" />
                Undo Autonomous Action
              </DialogTitle>
              <DialogDescription className="text-xs">
                Roll back the changes created by <strong>{actionName}</strong>. A reason is required for compliance auditing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label htmlFor="undo-reason" className="text-xs font-semibold">
                  Reason for rollback <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="undo-reason"
                  placeholder="e.g. Employee requested date change (min 5 chars)"
                  value={undoReason}
                  onChange={(e) => setUndoReason(e.target.value)}
                  className="mt-1 rounded-xl text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUndoDialogOpen(false)}
                className="rounded-xl text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleExecuteUndo}
                disabled={undoReason.trim().length < 5 || undoing}
                className="rounded-xl text-xs h-8 gap-1"
              >
                {undoing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                Confirm Undo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ── 4) Failed State ────────────────────────────────────────────────
  if (toolCall.status === "failed") {
    return (
      <Card className="rounded-2xl border border-destructive/30 bg-destructive/5 shadow-xs overflow-hidden my-3">
        <CardHeader className="py-2 px-3.5 border-b border-destructive/20 bg-destructive/10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-1.5 text-destructive font-semibold text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            Action Failed or Cancelled
          </div>
          <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30">
            Failed
          </Badge>
        </CardHeader>

        <CardContent className="p-3.5 text-xs text-foreground space-y-1">
          <div>{toolCall.error || "The action could not be completed or was cancelled."}</div>
        </CardContent>

        <CardFooter className="py-2 px-3.5 border-t border-destructive/15 bg-background/30 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={handleConfirm}
            disabled={disabled || confirming}
            className="rounded-xl h-7 text-[11px] gap-1 cursor-pointer"
          >
            {confirming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            Retry Execution
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}
