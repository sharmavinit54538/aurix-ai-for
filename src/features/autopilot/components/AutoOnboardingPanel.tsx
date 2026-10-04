import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  FileCheck,
  GraduationCap,
  Laptop,
  Loader2,
  Mail,
  RefreshCw,
  RotateCcw,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { autopilotApi } from "../services/autopilotApi";
import type { AutoOnboardingRun, AutoStepStatus, OnboardingStepId } from "../types";

const STEP_META: Record<
  OnboardingStepId,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  documents: {
    label: "Document Generation",
    icon: FileCheck,
    description: "Generates appointment letter, NDA, and sends e-sign invitations.",
  },
  assets: {
    label: "Asset Allocation",
    icon: Laptop,
    description: "Provisions laptop, access card, and registers hardware serial numbers.",
  },
  accounts: {
    label: "IT Accounts Provisioning",
    icon: Users,
    description: "Creates Google Workspace / Microsoft 365, Slack, and HRMS credentials.",
  },
  welcome_mail: {
    label: "Welcome Communication",
    icon: Mail,
    description: "Dispatches personalized day-one schedule, buddy intro, and office guide.",
  },
  training: {
    label: "Induction Modules",
    icon: GraduationCap,
    description: "Enrolls candidate into compliance, security, and culture onboarding tracks.",
  },
};

const STATUS_ICONS: Record<
  AutoStepStatus,
  { badge: string; icon: React.ComponentType<{ className?: string }> }
> = {
  completed: {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  in_progress: {
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Loader2,
  },
  pending: {
    badge: "bg-muted text-muted-foreground border-border/40",
    icon: Clock,
  },
  failed: {
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: AlertTriangle,
  },
};

export function AutoOnboardingPanel() {
  const [runs, setRuns] = useState<AutoOnboardingRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [retryingStep, setRetryingStep] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    try {
      setError(null);
      const data = await autopilotApi.getOnboardingRuns();
      setRuns(data);
      setBackendUnavailable(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
      } else {
        setError(err?.response?.data?.message || "Failed to load auto-onboarding runs");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRuns();
  }, [fetchRuns]);

  const handleRetryStep = async (runId: string, step: OnboardingStepId) => {
    const key = `${runId}-${step}`;
    try {
      setRetryingStep(key);
      const updated = await autopilotApi.retryOnboardingStep(runId, step);
      setRuns((prev) => prev.map((r) => (r.id === runId ? updated : r)));
      toast.success(`Retrying ${STEP_META[step].label}...`);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        toast.error("Feature unavailable — backend pending");
      } else {
        toast.error(err?.response?.data?.message || "Failed to retry step");
      }
    } finally {
      setRetryingStep(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Auto-Onboarding Pipelines</h3>
            <p className="text-xs text-muted-foreground">
              Automated progression of accepted offers from document generation to Day-One induction.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchRuns()}
          className="rounded-xl h-8 gap-1 text-xs"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>

      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-2xl text-xs">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-xs">Feature unavailable — backend pending</AlertTitle>
          <AlertDescription className="text-xs mt-0.5">
            Auto-onboarding pipeline endpoint (<code>/api/v2/autopilot/onboarding/runs</code>) is pending deployment.
          </AlertDescription>
        </Alert>
      )}

      {error && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xs font-semibold">Failed to load onboarding status</AlertTitle>
          <AlertDescription className="text-xs flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => void fetchRuns()} className="h-7 text-xs rounded-xl">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card className="rounded-2xl p-5 space-y-4">
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ) : runs.length === 0 && !backendUnavailable ? (
        <Card className="rounded-2xl border-dashed border-border/80 p-8 text-center bg-card/20">
          <CardTitle className="text-sm font-semibold">No active onboarding runs</CardTitle>
          <CardDescription className="text-xs mt-1">
            When candidates accept job offers, automated day-one readiness pipelines will initialize here.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <Card key={run.id} className="rounded-2xl border-border bg-card/60 backdrop-blur-sm shadow-2xs overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {run.employeeName}
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {run.role} • {run.department}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Offer Accepted: {new Date(run.offerAcceptedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 ${
                      run.status === "completed"
                        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                        : run.status === "failed"
                        ? "text-rose-600 bg-rose-500/10 border-rose-500/20"
                        : "text-blue-600 bg-blue-500/10 border-blue-500/20"
                    }`}
                  >
                    {run.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>

              {/* Step Timeline */}
              <CardContent className="p-4 space-y-2.5">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {run.steps.map((st) => {
                    const meta = STEP_META[st.step] || {
                      label: st.step,
                      icon: Clock,
                      description: "",
                    };
                    const statusConfig = STATUS_ICONS[st.status] || STATUS_ICONS.pending;
                    const StepIcon = meta.icon;
                    const StatusIcon = statusConfig.icon;
                    const isRetrying = retryingStep === `${run.id}-${st.step}`;

                    return (
                      <div
                        key={st.step}
                        className={`rounded-xl border p-2.5 flex flex-col justify-between text-xs space-y-2 transition-all ${
                          st.status === "completed"
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : st.status === "failed"
                            ? "bg-rose-500/5 border-rose-500/20"
                            : st.status === "in_progress"
                            ? "bg-blue-500/5 border-blue-500/20"
                            : "bg-muted/30 border-border/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <StepIcon className="h-4 w-4 text-primary" />
                          <Badge variant="outline" className={`text-[9px] uppercase px-1.5 py-0 border ${statusConfig.badge}`}>
                            {st.status === "in_progress" ? (
                              <Loader2 className="h-2.5 w-2.5 animate-spin mr-1 inline" />
                            ) : null}
                            {st.status}
                          </Badge>
                        </div>

                        <div>
                          <div className="font-semibold text-[11px] text-foreground">
                            {meta.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                            {st.error ? (
                              <span className="text-destructive font-medium">{st.error}</span>
                            ) : (
                              meta.description
                            )}
                          </div>
                        </div>

                        {st.status === "failed" && st.canRetry !== false && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => void handleRetryStep(run.id, st.step)}
                            disabled={isRetrying}
                            className="rounded-lg h-6 text-[10px] gap-1 w-full cursor-pointer mt-1"
                          >
                            {isRetrying ? (
                              <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            ) : (
                              <RotateCcw className="h-2.5 w-2.5" />
                            )}
                            Retry Step
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
