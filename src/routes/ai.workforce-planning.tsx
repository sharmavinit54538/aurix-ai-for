import { useState, useEffect, useMemo, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Target, UserPlus, Building2, Activity, TrendingUp, Sparkles, RefreshCw, ArrowRight,
} from "lucide-react";
import { AIModulePage, type AIChart, type AIKpi, type AIFeature, type AIRow } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { aiHubApi } from "@/services/aiHub.api";
import { aiInsightsApi } from "@/services/aiInsightsApi";
import { recruitmentApi } from "@/services/recruitmentApi";
import apiInstance from "@/api/apiInstance";
import type { WorkforcePlanningData } from "@/store/aiHub/aiHub.types";
import type { AIInsightsDashboardData } from "@/store/aiInsights/aiInsightsTypes";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/workforce-planning")({
  head: () => ({ meta: [{ title: "AI Workforce Planning — OFC360" }] }),
  component: Page,
});

interface LocalRequirement {
  id: string;
  department: string;
  roleTitle: string;
  headcountNeeded: number;
  currentHeadcount: number;
  plannedQuarter: string;
  priority: string;
  status: string;
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [forecasting, setForecasting] = useState(false);
  const [workforceData, setWorkforceData] = useState<WorkforcePlanningData | null>(null);
  const [insightsData, setInsightsData] = useState<AIInsightsDashboardData | null>(null);
  const [jobsCount, setJobsCount] = useState<number>(0);
  const [totalVacancies, setTotalVacancies] = useState<number>(0);
  const [departmentCount, setDepartmentCount] = useState<number>(0);
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [departmentsList, setDepartmentsList] = useState<string[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Live sync with backend");

  const loadData = useCallback(async () => {
    try {
      const [wfRes, insightsRes, jobsRes, deptRes, empRes] = await Promise.allSettled([
        aiHubApi.getWorkforcePlanning(),
        aiInsightsApi.getDashboard(),
        recruitmentApi.getJobs(),
        apiInstance.get("/departments", { params: { limit: 100 } }),
        apiInstance.get("/employees", { params: { limit: 1 } }),
      ]);

      if (wfRes.status === "fulfilled" && wfRes.value) {
        setWorkforceData(wfRes.value);
      }

      if (insightsRes.status === "fulfilled" && insightsRes.value) {
        setInsightsData(insightsRes.value);
      }

      if (jobsRes.status === "fulfilled" && jobsRes.value) {
        const rawJobs = jobsRes.value;
        const list = Array.isArray(rawJobs)
          ? rawJobs
          : Array.isArray(rawJobs?.data)
          ? rawJobs.data
          : Array.isArray(rawJobs?.items)
          ? rawJobs.items
          : [];
        setJobsCount(list.length);
        const vacancies = list.reduce((acc: number, j: any) => acc + (Number(j.vacancies) || 1), 0);
        setTotalVacancies(vacancies);
      }

      if (deptRes.status === "fulfilled" && deptRes.value) {
        const dData = deptRes.value.data?.data ?? deptRes.value.data;
        const depts = Array.isArray(dData)
          ? dData
          : Array.isArray(dData?.items)
          ? dData.items
          : Array.isArray(dData?.departments)
          ? dData.departments
          : [];
        setDepartmentCount(depts.length || (typeof dData?.total === "number" ? dData.total : 0));
        const names = depts.map((d: any) => d.name || d.title || d.department_name).filter(Boolean);
        if (names.length > 0) {
          setDepartmentsList(names);
        }
      }

      if (empRes.status === "fulfilled" && empRes.value) {
        const eData = empRes.value.data?.data ?? empRes.value.data;
        const totalEmp = typeof eData?.total === "number"
          ? eData.total
          : Array.isArray(eData)
          ? eData.length
          : Array.isArray(eData?.items)
          ? eData.items.length
          : 0;
        setEmployeeCount(totalEmp);
      }

      setLastSyncTime(`Live sync: ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    } catch (err) {
      console.warn("Failed to load workforce planning metrics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Read saved user requirements from localStorage (clean out old mock IDs if present)
  const localReqs: LocalRequirement[] = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("ofc360:workforce_requirements");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(
            (r: any) => !["WFR-101", "WFR-102", "WFR-103", "WFR-104", "WFR-105"].includes(r.id)
          );
          if (clean.length !== parsed.length) {
            localStorage.setItem("ofc360:workforce_requirements", JSON.stringify(clean));
          }
          return clean;
        }
      }
    } catch { /* ignore */ }
    return [];
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    toast.success("Workforce planning metrics updated from database.");
  };

  const handleRunForecast = async () => {
    setForecasting(true);
    try {
      const res = await aiHubApi.forecastWorkforce({ horizonMonths: 12 });
      if (res) {
        setWorkforceData((prev) => ({
          currentHeadcount: prev?.currentHeadcount ?? employeeCount,
          forecast: res,
          budgetEstimates: prev?.budgetEstimates,
          hiringPlan: prev?.hiringPlan,
        }));
        toast.success("AI Workforce Forecast regenerated successfully!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate workforce forecast.");
    } finally {
      setForecasting(false);
    }
  };

  // Real calculations (zero mock numbers)
  const localHeadcountNeeded = localReqs.reduce((acc, r) => acc + (Number(r.headcountNeeded) || 0), 0);
  const plannedHires = totalVacancies || localHeadcountNeeded || insightsData?.recruitment?.openPositions || workforceData?.hiringPlan?.length || 0;
  const currentHeadcount = employeeCount || workforceData?.currentHeadcount || 0;
  const totalDepartments = departmentCount || departmentsList.length || 0;
  const horizonMonths = workforceData?.forecast?.horizonMonths || 12;

  // Real capacity utilization
  const totalDemand = currentHeadcount + plannedHires;
  const capacityUtil = totalDemand > 0
    ? Math.min(100, Math.round((currentHeadcount / totalDemand) * 100))
    : currentHeadcount > 0
    ? 100
    : 0;

  // KPIs (100% Real from backend database, 0 mock)
  const kpis: AIKpi[] = [
    {
      label: "Planned Hires",
      value: plannedHires,
      icon: UserPlus,
      hint: `${jobsCount} active job postings`,
    },
    {
      label: "Capacity Util.",
      value: `${capacityUtil}%`,
      icon: Activity,
      hint: `${currentHeadcount} current employees`,
    },
    {
      label: "Departments",
      value: totalDepartments,
      icon: Building2,
      hint: "Registered functional units",
    },
    {
      label: "Forecast Horizon",
      value: `${horizonMonths} mo`,
      icon: TrendingUp,
      hint: "Target capacity window",
    },
  ];

  // Real Charts
  const charts: AIChart[] = useMemo(() => {
    const list: AIChart[] = [];

    // 1. Headcount Forecast Chart from backend
    if (insightsData?.charts?.headcountForecast && insightsData.charts.headcountForecast.length > 0) {
      list.push({
        type: "area",
        title: "Headcount Forecast",
        description: "AI projection based on current headcount & hiring velocity",
        xKey: "month",
        series: [
          { key: "current", label: "Actual Headcount", color: "oklch(0.7 0.16 200)" },
          { key: "forecast", label: "AI Forecasted", color: "oklch(0.68 0.2 290)" },
        ],
        data: insightsData.charts.headcountForecast as unknown as AIRow[],
      });
    } else if (workforceData?.hiringPlan && workforceData.hiringPlan.length > 0) {
      list.push({
        type: "line",
        title: "Hiring Plan Schedule",
        description: "Scheduled headcount target by month",
        xKey: "targetMonth",
        series: [{ key: "count", label: "Positions Target", color: "oklch(0.68 0.2 290)" }],
        data: workforceData.hiringPlan as unknown as AIRow[],
      });
    }

    // 2. Department Demand vs Capacity from backend or local requisitions
    if (insightsData?.charts?.hiringDemand && insightsData.charts.hiringDemand.length > 0) {
      list.push({
        type: "bar",
        title: "Department Capacity vs. Demand",
        description: "Open positions vs target hiring demand per department",
        xKey: "dept",
        series: [
          { key: "open", label: "Open Positions", color: "oklch(0.78 0.18 70)" },
          { key: "demand", label: "Target Demand", color: "oklch(0.68 0.2 290)" },
        ],
        data: insightsData.charts.hiringDemand as unknown as AIRow[],
      });
    } else if (localReqs.length > 0) {
      // Group real user requisitions by department
      const deptMap: Record<string, { current: number; needed: number }> = {};
      localReqs.forEach((r) => {
        if (!deptMap[r.department]) {
          deptMap[r.department] = { current: r.currentHeadcount || 0, needed: 0 };
        }
        deptMap[r.department].needed += r.headcountNeeded || 0;
      });

      const dataRows = Object.entries(deptMap).map(([d, val]) => ({
        d,
        cap: val.current,
        dem: val.needed,
      }));

      if (dataRows.length > 0) {
        list.push({
          type: "bar",
          title: "Department Headcount Requisitions",
          description: "Current department headcount vs. requisitions needed",
          xKey: "d",
          series: [
            { key: "cap", label: "Current Headcount", color: "oklch(0.7 0.16 200)" },
            { key: "dem", label: "Requisitions Needed", color: "oklch(0.68 0.2 290)" },
          ],
          data: dataRows,
        });
      }
    }

    return list;
  }, [insightsData, workforceData, localReqs]);

  // Features (Real metrics based on live state, no hardcoded values)
  const features: AIFeature[] = [
    {
      title: "Hiring Forecasts",
      description: "Quarter-by-quarter capacity modeling linked to verified job openings and vacancies.",
      icon: UserPlus,
      metric: `${plannedHires} Planned`,
      tone: plannedHires > 0 ? "info" : "ok",
    },
    {
      title: "Department Capacity Planning",
      description: "Real-time visibility into active functional units and staffing requirements.",
      icon: Building2,
      metric: `${totalDepartments} Depts`,
      tone: "info",
    },
    {
      title: "Resource Utilization",
      description: "Ratio of current productive headcount relative to overall staffing demand.",
      icon: Activity,
      metric: `${capacityUtil}%`,
      progress: capacityUtil,
      tone: capacityUtil >= 80 ? "ok" : "warn",
    },
    {
      title: "Future Workforce Needs",
      description: "Predictive modeling and skill requirements projected across rolling forecast window.",
      icon: TrendingUp,
      metric: `${horizonMonths}-mo horizon`,
      tone: "info",
    },
    {
      title: "Workforce Optimization",
      description: "AI suggests internal mobility, redeployments, and department allocations.",
      icon: Sparkles,
      metric: `${localReqs.length} Requisitions`,
      tone: "info",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading workforce planning analytics from backend...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AIModulePage
        icon={Target}
        eyebrow="AI Workforce Planning"
        title="Plan capacity, hiring and utilization with AI"
        description="Model hiring forecasts, department capacity and resource utilization from live backend records."
        lastAnalysis={lastSyncTime}
        kpis={kpis}
        charts={charts}
        features={features}
      >
        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-base font-semibold tracking-tight">
                Department Headcount & Requisition Actions
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage headcount requirements, sync vacancies with recruitment, and run AI forecast simulations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Syncing..." : "Sync DB"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 bg-gradient-brand text-brand-foreground shadow-glow border-none"
                onClick={handleRunForecast}
                disabled={forecasting}
              >
                <Sparkles className={`h-3.5 w-3.5 ${forecasting ? "animate-spin" : ""}`} />
                {forecasting ? "Forecasting..." : "Run AI Forecast"}
              </Button>
              <Button asChild size="sm" className="h-8 text-xs gap-1.5">
                <Link to="/dashboard/recruitment/workforce-planning">
                  Manage Requisitions <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* If there are no charts or requirements, show helpful live status */}
          {charts.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center">
              <Target className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-foreground">No custom forecast charts available yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                All mock data has been removed. Once you create department headcount requisitions or publish job vacancies, real trend and capacity charts will appear here automatically.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Button asChild size="sm" variant="outline" className="text-xs">
                  <Link to="/dashboard/recruitment/workforce-planning">
                    Create Workforce Requirement
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </AIModulePage>
    </div>
  );
}

