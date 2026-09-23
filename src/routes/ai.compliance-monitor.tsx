import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Scale,
  FileWarning,
  AlertTriangle,
  ClipboardCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature } from "@/components/aurix/AIModule";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchComplianceDashboard } from "@/store/compliance/complianceThunk";
import {
  selectComplianceLoading,
  selectComplianceError,
  selectComplianceKPIs,
  selectComplianceSummary,
  selectComplianceTrend,
  selectComplianceRisksByCategory,
  selectComplianceLastUpdated,
} from "@/store/compliance/complianceSelectors";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/compliance-monitor")({
  head: () => ({ meta: [{ title: "AI Compliance Monitor — OFC360" }] }),
  component: Page,
});

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  ClipboardCheck,
  Scale,
};

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectComplianceLoading);
  const error = useAppSelector(selectComplianceError);
  const backendKpis = useAppSelector(selectComplianceKPIs);
  const summary = useAppSelector(selectComplianceSummary);
  const complianceTrend = useAppSelector(selectComplianceTrend);
  const risksByCategory = useAppSelector(selectComplianceRisksByCategory);
  const lastUpdated = useAppSelector(selectComplianceLastUpdated);

  useEffect(() => {
    dispatch(fetchComplianceDashboard());
  }, [dispatch]);

  const kpis: AIKpi[] = useMemo(() => {
    if (backendKpis && backendKpis.length > 0) {
      return backendKpis.map((k) => ({
        label: k.label,
        value:
          typeof k.score === "number" &&
          (k.label.includes("Score") || k.label.includes("Readiness"))
            ? `${k.score}%`
            : `${k.score}`,
        trend: k.trend,
        hint: k.hint,
        icon: k.icon && ICON_MAP[k.icon] ? ICON_MAP[k.icon] : ShieldCheck,
        invert: k.invert,
      }));
    }

    if (summary) {
      return [
        {
          label: "Compliance Score",
          value: summary.complianceScore != null ? `${summary.complianceScore}%` : "—",
          icon: ShieldCheck,
        },
        {
          label: "Open Risks",
          value: summary.openRisks != null ? `${summary.openRisks}` : "—",
          icon: AlertTriangle,
          invert: true,
        },
        {
          label: "Missing Docs",
          value: summary.missingDocs != null ? `${summary.missingDocs}` : "—",
          icon: FileWarning,
          invert: true,
        },
        {
          label: "Audit Readiness",
          value: summary.auditReadiness != null ? `${summary.auditReadiness}%` : "—",
          icon: ClipboardCheck,
        },
      ];
    }

    return [
      { label: "Compliance Score", value: "—", icon: ShieldCheck },
      { label: "Open Risks", value: "—", icon: AlertTriangle, invert: true },
      { label: "Missing Docs", value: "—", icon: FileWarning, invert: true },
      { label: "Audit Readiness", value: "—", icon: ClipboardCheck },
    ];
  }, [backendKpis, summary]);

  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    if (complianceTrend && complianceTrend.length > 0) {
      list.push({
        type: "area",
        title: "Compliance Trend",
        xKey: "m",
        series: [{ key: "score", label: "Score" }],
        data: complianceTrend as unknown as Record<string, string | number>[],
      });
    }

    if (risksByCategory && risksByCategory.length > 0) {
      list.push({
        type: "bar",
        title: "Risks by Category",
        xKey: "c",
        series: [{ key: "n", label: "Open risks" }],
        data: risksByCategory as unknown as Record<string, string | number>[],
      });
    }

    return list;
  }, [complianceTrend, risksByCategory]);

  const features: AIFeature[] = useMemo(
    () => [
      {
        title: "Compliance Checks",
        description: "Continuous checks across HR and payroll workflows.",
        icon: ShieldCheck,
        metric: summary?.complianceScore != null ? `${summary.complianceScore}%` : undefined,
        progress: summary?.complianceScore != null ? Number(summary.complianceScore) : undefined,
        tone: "ok",
      },
      {
        title: "Labor Law Monitoring",
        description: "Stay aligned with applicable jurisdiction rules.",
        icon: Scale,
        tone: "info",
      },
      {
        title: "Missing Documents",
        description: "Detect missing or expired employee docs.",
        icon: FileWarning,
        metric: summary?.missingDocs != null ? `${summary.missingDocs}` : undefined,
        tone: "warn",
      },
      {
        title: "Risk Detection",
        description: "Predictive risk scores across compliance domains.",
        icon: AlertTriangle,
        metric: summary?.openRisks != null ? `${summary.openRisks}` : undefined,
        tone: "warn",
      },
      {
        title: "Audit Readiness",
        description: "One-click prep with full evidence trail.",
        icon: ClipboardCheck,
        metric: summary?.auditReadiness != null ? `${summary.auditReadiness}%` : undefined,
        progress: summary?.auditReadiness != null ? Number(summary.auditReadiness) : undefined,
        tone: "ok",
      },
    ],
    [summary],
  );

  if (loading && (!backendKpis || backendKpis.length === 0) && !summary) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <AIModulePage
      icon={ShieldCheck}
      eyebrow="AI Compliance Monitor"
      title="Stay audit-ready, automatically"
      description="Monitor labor law compliance, missing documents, risk and audit readiness."
      lastAnalysis={
        summary?.lastAnalysis ?? (lastUpdated ? "Live DB Sync" : "Live DB Sync")
      }
      kpis={kpis}
      charts={charts}
      features={features}
    >
      {error ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchComplianceDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}
    </AIModulePage>
  );
}
