import { Download, MessageSquare, RefreshCw, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { DocumentsSection } from "../components/sections/DocumentsSection";
import { InsightsSidebar } from "../components/sections/InsightsSidebar";
import { KpiOverviewSection } from "../components/sections/KpiOverviewSection";
import { PayrollSection } from "../components/sections/PayrollSection";
import { PerformanceSection } from "../components/sections/PerformanceSection";
import { RecruitmentSection } from "../components/sections/RecruitmentSection";
import { SatisfactionTrendSection } from "../components/sections/SatisfactionTrendSection";
import { WorkforceAnalyticsSection } from "../components/sections/WorkforceAnalyticsSection";
import { WorkforcePlanningSection } from "../components/sections/WorkforcePlanningSection";
import { ErrorBanner } from "../components/shared/ErrorBanner";
import { HeroBanner } from "../components/shared/HeroBanner";
import { LoadingSkeletonView } from "../components/shared/LoadingSkeletonView";
import { useAIInsights } from "../hooks/useAIInsights";

export function AIInsightsPage() {
  const {
    loading,
    error,
    summary,
    kpis,
    attrition,
    burnout,
    attendance,
    recruitment,
    candidates,
    topPerformers,
    supportPerformers,
    skillGap,
    payroll,
    payrollAlerts,
    payrollTrend,
    headcountForecast,
    hiringDemand,
    satisfactionTrend,
    alerts,
    recommendations,
    documents,
    hasData,
    refresh,
  } = useAIInsights();

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="AI-powered workforce intelligence and automation for your organization."
        actions={
          <>
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI
            </Button>
            <Button onClick={refresh} disabled={loading}>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </>
        }
      />

      {error ? <ErrorBanner message={error} onRetry={refresh} /> : null}

      {loading && !hasData ? (
        <LoadingSkeletonView />
      ) : (
        <>
          <HeroBanner summary={summary} />
          <KpiOverviewSection kpis={kpis} />

          <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <WorkforceAnalyticsSection attrition={attrition} burnout={burnout} attendance={attendance} />
              <RecruitmentSection recruitment={recruitment} candidates={candidates} />
              <PerformanceSection
                topPerformers={topPerformers}
                supportPerformers={supportPerformers}
                skillGap={skillGap}
              />
              <PayrollSection payroll={payroll} payrollAlerts={payrollAlerts} payrollTrend={payrollTrend} />
              <WorkforcePlanningSection headcountForecast={headcountForecast} hiringDemand={hiringDemand} />
              <DocumentsSection documents={documents} />
              <SatisfactionTrendSection satisfactionTrend={satisfactionTrend} />
            </div>

            <InsightsSidebar recommendations={recommendations} alerts={alerts} />
          </div>
        </>
      )}
    </>
  );
}

export default AIInsightsPage;
