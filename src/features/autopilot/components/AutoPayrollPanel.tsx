import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Banknote,
  Calculator,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Loader2,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserCheck,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { autopilotApi } from "../services/autopilotApi";
import type { AutoPayrollRunStatus, AutoPayrollStage, PayrollStageId } from "../types";
import { parseApiError } from "@/api/utils";

const STAGE_META: Record<
  PayrollStageId,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  attendance_sync: {
    label: "Attendance Sync",
    icon: CalendarCheck,
    description: "Syncs biometrics, leaves, regularization, and worked days.",
  },
  variable_inputs: {
    label: "Variable Inputs",
    icon: Zap,
    description: "Ingests overtime hours, incentive bonuses, and arrears.",
  },
  calculation: {
    label: "Gross-to-Net Computation",
    icon: Calculator,
    description: "Applies tax slabs, PF, ESI, professional tax, and net payable.",
  },
  validation: {
    label: "Compliance Validation",
    icon: ShieldCheck,
    description: "Verifies minimum wage statutory caps and negative net salary checks.",
  },
  anomaly_check: {
    label: "AI Anomaly Detection",
    icon: AlertTriangle,
    description: "Audits for salary spikes, ghost employees, and unexpected variances.",
  },
};

export function AutoPayrollPanel() {
  const [payrollStatus, setPayrollStatus] = useState<AutoPayrollRunStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const data = await autopilotApi.getPayrollRunStatus();
      setPayrollStatus(data);
      setBackendUnavailable(false);
    } catch (err: unknown) {
      const { status, message } = parseApiError(err, "Failed to load Autopilot payroll status");
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  return (
    <Card className="rounded-3xl border-primary/20 bg-card/70 backdrop-blur-xl shadow-sm overflow-hidden my-4">
      {/* ── Card Header ────────────────────────────────────────────── */}
      <CardHeader className="py-3.5 px-5 border-b border-border/40 bg-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Autopilot Payroll Pre-Flight Run
                </CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider bg-background/60">
                  {payrollStatus?.payrollCycle || "—"}
                </Badge>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Autonomous pipeline executes attendance reconciliation, calculations, and statutory audits.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchStatus()}
              className="rounded-xl h-8 gap-1 text-xs cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
            {payrollStatus?.canReviewAndApprove && (
              <Button
                size="sm"
                asChild
                className="rounded-xl h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs font-semibold"
              >
                <Link to={payrollStatus.approvalRoute || "/dashboard/payroll"}>
                  <UserCheck className="h-3.5 w-3.5" />
                  Review and Approve
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* ── Maker-Checker Mandatory Human Boundary Notice ────────────── */}
      <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <Lock className="h-4 w-4 text-amber-500 shrink-0" />
        <div className="leading-snug">
          <span className="font-bold">Maker-Checker Invariant: </span>
          The AI performs multi-stage pre-checks, calculation, and anomaly detection only. The AI is strictly barred from approving its own payroll run. Final sign-off requires human verification.
        </div>
      </div>

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <div className="p-4">
          <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-2xl text-xs">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-semibold text-xs">Feature unavailable — backend pending</AlertTitle>
            <AlertDescription className="text-xs mt-0.5">
              Autopilot payroll pipeline status endpoint (<code>/api/v2/autopilot/payroll/status</code>) is pending deployment.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* ── Inline Error ─────────────────────────────────────────────── */}
      {error && !backendUnavailable && (
        <div className="p-4">
          <Alert variant="destructive" className="rounded-2xl text-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs font-semibold">Failed to load payroll run status</AlertTitle>
            <AlertDescription className="text-xs flex items-center justify-between">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={() => void fetchStatus()} className="h-7 text-xs rounded-xl">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* ── Stages Grid ──────────────────────────────────────────────── */}
      <CardContent className="p-5">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-xl border border-border/60 space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
        ) : !payrollStatus && !backendUnavailable ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No active payroll run in progress.
          </div>
        ) : payrollStatus ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {payrollStatus.stages.map((st) => {
                const stageKey = (st.stage || st.id || "attendance_sync") as PayrollStageId;
                const meta = STAGE_META[stageKey] || {
                  label: st.label || st.name || String(stageKey),
                  icon: Layers,
                  description: "",
                };
                const StageIcon = meta.icon;
                const isDone = st.status === "completed";
                const isRunning = st.status === "in_progress";
                const isFailed = st.status === "failed";

                return (
                  <div
                    key={st.stage}
                    className={`rounded-2xl border p-3 flex flex-col justify-between text-xs space-y-2.5 transition-all ${
                      isDone
                        ? "bg-emerald-500/5 border-emerald-500/25"
                        : isRunning
                        ? "bg-blue-500/5 border-blue-500/25"
                        : isFailed
                        ? "bg-rose-500/5 border-rose-500/25"
                        : "bg-muted/20 border-border/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 rounded-lg bg-background/80 border border-border/40 text-foreground">
                        <StageIcon className="h-4 w-4 text-primary" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase font-mono px-1.5 py-0 ${
                          isDone
                            ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                            : isRunning
                            ? "text-blue-600 bg-blue-500/10 border-blue-500/20"
                            : isFailed
                            ? "text-rose-600 bg-rose-500/10 border-rose-500/20"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isRunning && <Loader2 className="h-2.5 w-2.5 animate-spin mr-1 inline" />}
                        {st.status.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div>
                      <div className="font-semibold text-xs text-foreground">
                        {meta.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {st.summary || meta.description}
                      </div>
                    </div>

                    {st.anomaliesFound !== undefined && st.anomaliesFound > 0 && (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {st.anomaliesFound} anomalies flagged
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="py-3 px-5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-primary" />
          <span>Status: {payrollStatus?.status ? payrollStatus.status.replace(/_/g, " ").toUpperCase() : "AWAITING RUN"}</span>
        </div>

        {payrollStatus?.canReviewAndApprove && (
          <Button
            size="sm"
            asChild
            className="rounded-xl h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs font-semibold self-end sm:self-auto"
          >
            <Link to={payrollStatus.approvalRoute || "/dashboard/payroll"}>
              Review and Approve
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
