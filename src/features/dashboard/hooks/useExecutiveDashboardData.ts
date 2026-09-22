import { useEffect, useState, useCallback, useMemo } from "react";
import { apiInstance } from "@/api";

export interface PayrollStatusItem {
  label: string;
  value: string | number;
  color: string;
  bg: string;
}

export interface MonthlyPayrollPoint {
  month: string;
  cost: number;
}

export interface PayrollOverviewData {
  totalCostFormatted: string;
  payrollStatus: PayrollStatusItem[];
  monthlySalaryCostChart: MonthlyPayrollPoint[];
}

export interface DepartmentDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface JobBarItem {
  label: string;
  count: number;
  fullLabel: string;
}

export interface ExecutiveKpiDetails {
  headcount: {
    value: number;
    change: string | null;
    changeType: "up" | "down" | "neutral";
    trend: Array<{ date: string; value: number }>;
    hasTrend: boolean;
    link: string;
  };
  openings: {
    value: number;
    change: string | null;
    changeType: "up" | "down" | "neutral";
    bars: JobBarItem[];
    hasBars: boolean;
    link: string;
  };
  departments: {
    value: number;
    distribution: DepartmentDistributionItem[];
    hasDistribution: boolean;
    link: string;
  };
  payroll: {
    valueFormatted: string;
    rawValue: number;
    history: MonthlyPayrollPoint[];
    hasHistory: boolean;
    statusCounts: { processed: number; pending: number; paid: number };
    link: string;
  };
  assets: {
    value: number;
    assignedCount: number;
    availableCount: number;
    repairCount: number;
    assignedPercent: number;
    availablePercent: number;
    hasStatusData: boolean;
    link: string;
  };
  exits: {
    value: number;
    statusCounts: { pending: number; inProgress: number; completed: number };
    timeline: Array<{ date: string; count: number }>;
    hasTimeline: boolean;
    link: string;
  };
}

export interface DashboardLiveData {
  loading: boolean;
  error: string | null;
  totalEmployees: number;
  totalDepartments: number;
  totalJobs: number;
  totalAssets: number;
  totalExits: number;
  totalPayrollCost: number;
  kpiDetails: ExecutiveKpiDetails;
  kpiCards: Array<{
    id: string;
    label: string;
    value: string | number;
    change: string;
    changeType: "up" | "down" | "neutral";
    accent: string;
    bgAccent: string;
    spark: Array<{ v: number }>;
    link: string;
  }>;
  deptPerformance: Array<{
    name: string;
    headcount: number;
    attendance: number;
    productivity: number;
    openPositions: number;
    color: string;
    bgColor: string;
  }>;
  activityFeed: Array<{
    id: string;
    type: "employee" | "candidate" | "leave" | "asset" | "exit" | "payroll" | "document" | "alert";
    icon: string;
    text: string;
    user: string;
    time: string;
    color: string;
  }>;
  activeJobsList: Array<{
    id: string;
    title: string;
    dept: string;
    applicants: number;
    status: string;
  }>;
  payrollOverview: PayrollOverviewData;
  refetch: () => void;
}

export function formatIndianCurrency(amount: number): string {
  if (amount == null || isNaN(amount) || amount === 0) return "₹0";
  if (Math.abs(amount) >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    const lk = amount / 100000;
    return `₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(2)} L`;
  }
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

const DEPT_CHART_COLORS = [
  "#8b5cf6", // Violet
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

export function useExecutiveDashboardData(): DashboardLiveData {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalExits, setTotalExits] = useState(0);
  const [totalPayrollCost, setTotalPayrollCost] = useState(0);

  // Authentic detailed metric states
  const [headcountTrend, setHeadcountTrend] = useState<Array<{ date: string; value: number }>>([]);
  const [headcountChange, setHeadcountChange] = useState<string | null>(null);
  const [headcountChangeType, setHeadcountChangeType] = useState<"up" | "down" | "neutral">("neutral");

  const [jobsBars, setJobsBars] = useState<JobBarItem[]>([]);
  const [deptDistribution, setDeptDistribution] = useState<DepartmentDistributionItem[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<MonthlyPayrollPoint[]>([]);
  const [payrollStatusCounts, setPayrollStatusCounts] = useState({ processed: 0, pending: 0, paid: 0 });

  const [assetStatusCounts, setAssetStatusCounts] = useState({
    assigned: 0,
    available: 0,
    repair: 0,
    assignedPercent: 0,
    availablePercent: 0,
  });

  const [exitStatusCounts, setExitStatusCounts] = useState({ pending: 0, inProgress: 0, completed: 0 });
  const [exitTimeline, setExitTimeline] = useState<Array<{ date: string; count: number }>>([]);

  const [deptPerformance, setDeptPerformance] = useState<DashboardLiveData["deptPerformance"]>([]);
  const [activityFeed, setActivityFeed] = useState<DashboardLiveData["activityFeed"]>([]);
  const [activeJobsList, setActiveJobsList] = useState<DashboardLiveData["activeJobsList"]>([]);
  const [payrollOverview, setPayrollOverview] = useState<PayrollOverviewData>({
    totalCostFormatted: "₹0",
    payrollStatus: [
      { label: "Processed", value: 0, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { label: "Pending Approval", value: 0, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "Disbursed / Paid", value: 0, color: "text-blue-500", bg: "bg-blue-500/10" },
    ],
    monthlySalaryCostChart: [],
  });

  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        deptsRes,
        hierRes,
        jobsRes,
        assetsRes,
        exitsRes,
        internalRes,
        payrollStructuresRes,
        payrollDashboardRes,
      ] = await Promise.allSettled([
        apiInstance.get("/departments", { params: { limit: 100 } }),
        apiInstance.get("/hierarchy"),
        apiInstance.get("/jobs", { params: { limit: 100 } }),
        apiInstance.get("/assets", { params: { limit: 100 } }),
        apiInstance.get("/exits", { params: { limit: 100 } }),
        apiInstance.get("/internal/dashboard"),
        apiInstance.get("/payroll/salary-structures"),
        apiInstance.get("/payroll/dashboard"),
      ]);

      // 1. Departments
      let deptsList: any[] = [];
      if (deptsRes.status === "fulfilled" && deptsRes.value.data?.data) {
        const rawDepts = deptsRes.value.data.data.items ?? deptsRes.value.data.data;
        deptsList = Array.isArray(rawDepts) ? rawDepts : [];
        setTotalDepartments(deptsList.length);

        // Real department employee distribution
        const validDeptDist: DepartmentDistributionItem[] = [];
        let sumHeadcount = 0;

        deptsList.forEach((d: any) => {
          const count = Number(d.employee_count ?? d.currentEmployeeCount ?? 0);
          if (count > 0) {
            sumHeadcount += count;
          }
        });

        deptsList.forEach((d: any, idx: number) => {
          const count = Number(d.employee_count ?? d.currentEmployeeCount ?? 0);
          if (count > 0) {
            validDeptDist.push({
              name: d.department_name ?? d.name ?? `Dept #${idx + 1}`,
              count,
              percentage: sumHeadcount > 0 ? Math.round((count / sumHeadcount) * 100) : 0,
              color: DEPT_CHART_COLORS[idx % DEPT_CHART_COLORS.length],
            });
          }
        });
        setDeptDistribution(validDeptDist);

        const mappedDepts = deptsList.slice(0, 6).map((d: any, idx: number) => ({
          name: d.department_name ?? d.name ?? `Dept #${idx + 1}`,
          headcount: Number(d.employee_count ?? d.currentEmployeeCount ?? 0),
          attendance: Number(d.attendance_rate ?? d.attendance ?? 0),
          productivity: Number(d.productivity_rate ?? d.productivity ?? 0),
          openPositions: Number(d.open_positions ?? 0),
          color: DEPT_CHART_COLORS[idx % DEPT_CHART_COLORS.length],
          bgColor: "bg-slate-800/40",
        }));
        setDeptPerformance(mappedDepts);
      } else {
        setTotalDepartments(0);
        setDeptDistribution([]);
      }

      // 2. Hierarchy / Employees
      let empCount = 0;
      if (hierRes.status === "fulfilled" && hierRes.value.data?.data) {
        const hierData = hierRes.value.data.data;
        empCount = Array.isArray(hierData)
          ? hierData.length
          : (hierData.total_nodes ?? hierData.nodes?.length ?? deptsList.reduce((acc, d) => acc + (Number(d.employee_count) || 0), 0) ?? 0);

        // Check if real historical headcount data exists in hierarchy payload
        const rawHistory = hierData.history ?? hierData.monthly_trend ?? hierData.trend ?? [];
        if (Array.isArray(rawHistory) && rawHistory.length > 0) {
          setHeadcountTrend(
            rawHistory.map((item: any) => ({
              date: String(item.month ?? item.date ?? item.period ?? ""),
              value: Number(item.headcount ?? item.count ?? item.value ?? 0),
            })).filter((pt: any) => Boolean(pt.date))
          );
        } else {
          setHeadcountTrend([]);
        }

        // Real percentage change only if supplied by backend
        const rawChange = hierData.growth_mom ?? hierData.change_percentage ?? hierData.change;
        if (rawChange != null && rawChange !== "") {
          const num = Number(rawChange);
          if (!isNaN(num)) {
            setHeadcountChange(`${num >= 0 ? "+" : ""}${num}%`);
            setHeadcountChangeType(num > 0 ? "up" : num < 0 ? "down" : "neutral");
          } else {
            setHeadcountChange(String(rawChange));
            setHeadcountChangeType("neutral");
          }
        } else {
          setHeadcountChange(null);
          setHeadcountChangeType("neutral");
        }
      } else {
        const fallbackCount = deptsList.reduce((acc, d) => acc + (Number(d.employee_count) || 0), 0);
        empCount = fallbackCount || 0;
        setHeadcountTrend([]);
        setHeadcountChange(null);
      }
      setTotalEmployees(empCount);

      // 3. Jobs / Active Openings
      if (jobsRes.status === "fulfilled" && jobsRes.value.data?.data) {
        const rawJobs = jobsRes.value.data.data.items ?? jobsRes.value.data.data;
        const jobsList = Array.isArray(rawJobs) ? rawJobs : [];
        
        // Real active/open jobs
        const openJobs = jobsList.filter((j: any) => {
          const st = String(j.status ?? "").toLowerCase();
          return !st || st === "open" || st === "active" || st === "published";
        });
        const activeCount = openJobs.length > 0 ? openJobs.length : jobsList.length;
        setTotalJobs(activeCount);

        // Group real jobs by department for authentic vertical bar chart
        const deptJobMap = new Map<string, number>();
        (openJobs.length > 0 ? openJobs : jobsList).forEach((j: any) => {
          const dept = String(j.department ?? j.department_name ?? "General").trim();
          deptJobMap.set(dept, (deptJobMap.get(dept) || 0) + 1);
        });

        if (deptJobMap.size > 0) {
          const bars: JobBarItem[] = Array.from(deptJobMap.entries())
            .slice(0, 6)
            .map(([fullLabel, count]) => ({
              label: fullLabel.length > 8 ? `${fullLabel.slice(0, 7)}…` : fullLabel,
              fullLabel,
              count,
            }));
          setJobsBars(bars);
        } else {
          setJobsBars([]);
        }

        const mappedJobs = jobsList.slice(0, 5).map((j: any) => ({
          id: String(j.id ?? ""),
          title: j.title ?? j.job_title ?? "Job Opening",
          dept: j.department ?? j.department_name ?? "General",
          applicants: Number(j.applicant_count ?? j.applications_count ?? 0),
          status: j.status ?? "OPEN",
        }));
        setActiveJobsList(mappedJobs);
      } else {
        setTotalJobs(0);
        setJobsBars([]);
        setActiveJobsList([]);
      }

      // 4. Assets Tracked
      if (assetsRes.status === "fulfilled" && assetsRes.value.data?.data) {
        const rawAssets = assetsRes.value.data.data.items ?? assetsRes.value.data.data;
        const assetsList = Array.isArray(rawAssets) ? rawAssets : [];
        const total = assetsList.length;
        setTotalAssets(total);

        // Real Assigned vs Available vs Under Repair status breakdown
        let assigned = 0;
        let available = 0;
        let repair = 0;

        assetsList.forEach((a: any) => {
          const st = String(a.status ?? "").toLowerCase().trim();
          if (st === "assigned" || st === "in_use" || a.assigned_to || a.assignedTo) {
            assigned++;
          } else if (st === "available" || st === "in_stock" || st === "unassigned") {
            available++;
          } else if (st === "under-repair" || st === "repair" || st === "maintenance") {
            repair++;
          }
        });

        const assignedPercent = total > 0 ? Math.round((assigned / total) * 100) : 0;
        const availablePercent = total > 0 ? Math.round((available / total) * 100) : 0;

        setAssetStatusCounts({
          assigned,
          available,
          repair,
          assignedPercent,
          availablePercent,
        });
      } else {
        setTotalAssets(0);
        setAssetStatusCounts({
          assigned: 0,
          available: 0,
          repair: 0,
          assignedPercent: 0,
          availablePercent: 0,
        });
      }

      // 5. Exits & Offboarding
      if (exitsRes.status === "fulfilled" && exitsRes.value.data?.data) {
        const rawExits = exitsRes.value.data.data.items ?? exitsRes.value.data.data;
        const exitsList = Array.isArray(rawExits) ? rawExits : [];
        setTotalExits(exitsList.length);

        let pending = 0;
        let inProgress = 0;
        let completed = 0;
        const timelineMap = new Map<string, number>();

        exitsList.forEach((x: any) => {
          const st = String(x.status ?? "").toUpperCase().trim();
          if (st === "PENDING" || st === "INITIATED" || st === "NEW") {
            pending++;
          } else if (st === "IN_PROGRESS" || st === "PROCESSING" || st === "CLEARANCE") {
            inProgress++;
          } else if (st === "COMPLETED" || st === "APPROVED" || st === "SETTLED" || st === "CLOSED") {
            completed++;
          } else {
            pending++;
          }

          // Extract date for timeline if available
          const rawDate = x.exit_date ?? x.created_at ?? x.resignation_date;
          if (rawDate) {
            const dateStr = String(rawDate).split("T")[0];
            const monthLabel = new Date(dateStr).toLocaleDateString("en-US", { month: "short" });
            if (monthLabel && monthLabel !== "Invalid Date") {
              timelineMap.set(monthLabel, (timelineMap.get(monthLabel) || 0) + 1);
            }
          }
        });

        setExitStatusCounts({ pending, inProgress, completed });

        if (timelineMap.size > 1) {
          setExitTimeline(
            Array.from(timelineMap.entries()).map(([date, count]) => ({
              date,
              count,
            }))
          );
        } else {
          setExitTimeline([]);
        }
      } else {
        setTotalExits(0);
        setExitStatusCounts({ pending: 0, inProgress: 0, completed: 0 });
        setExitTimeline([]);
      }

      // 6. Internal Dashboard / Activity Feed
      if (internalRes.status === "fulfilled" && internalRes.value.data?.data) {
        const internalData = internalRes.value.data.data;
        const rawAnnouncements = internalData.pinned_announcements ?? internalData.recent_announcements ?? [];
        const rawNews = internalData.news_articles ?? [];
        const announcements = Array.isArray(rawAnnouncements) ? rawAnnouncements : [];
        const news = Array.isArray(rawNews) ? rawNews : [];

        const feed: DashboardLiveData["activityFeed"] = [];
        announcements.slice(0, 3).forEach((a: any, idx: number) => {
          feed.push({
            id: String(a.id ?? `ann_${idx}`),
            type: "alert",
            icon: "Megaphone",
            text: a.title ?? "New Announcement",
            user: a.author_name ?? "HR Team",
            time: "Recently",
            color: "text-amber-500 bg-amber-500/10",
          });
        });
        news.slice(0, 3).forEach((n: any, idx: number) => {
          feed.push({
            id: String(n.id ?? `news_${idx}`),
            type: "document",
            icon: "FileText",
            text: n.title ?? "Company News",
            user: n.author_name ?? "Executive Office",
            time: "Today",
            color: "text-blue-500 bg-blue-500/10",
          });
        });
        if (feed.length > 0) setActivityFeed(feed);
      }

      // 7. Payroll Overview
      let calculatedGrossSum = 0;
      if (payrollStructuresRes.status === "fulfilled" && payrollStructuresRes.value.data?.data) {
        const rawStruct = payrollStructuresRes.value.data.data.items ?? payrollStructuresRes.value.data.data;
        const structItems = Array.isArray(rawStruct) ? rawStruct : [];
        calculatedGrossSum = structItems.reduce(
          (acc: number, item: any) =>
            acc + Number(item.gross_salary ?? item.base_salary ?? item.annual_ctc ?? 0),
          0
        );
      }

      let summaryData: any = null;
      let rawRecentRuns: any[] = [];
      if (payrollDashboardRes.status === "fulfilled" && payrollDashboardRes.value.data?.data) {
        summaryData = payrollDashboardRes.value.data.data.summary ?? payrollDashboardRes.value.data.data;
        rawRecentRuns = payrollDashboardRes.value.data.data.recentRuns ?? payrollDashboardRes.value.data.data.recent_runs ?? [];
      }

      const totalGross = Number(summaryData?.total_gross ?? calculatedGrossSum ?? 0);
      setTotalPayrollCost(totalGross);

      const formattedCost = formatIndianCurrency(totalGross);
      const processedCount = Number(summaryData?.processed_count ?? 0);
      const paidCount = Number(summaryData?.paid_count ?? 0);
      const pendingCount = Number(summaryData?.pending_count ?? 0);

      setPayrollStatusCounts({
        processed: processedCount,
        pending: pendingCount,
        paid: paidCount,
      });

      // ONLY use authentic recentRuns from backend — NO fabricated monthly values
      const realPayrollHistory: MonthlyPayrollPoint[] = [];
      if (Array.isArray(rawRecentRuns) && rawRecentRuns.length > 0) {
        rawRecentRuns.forEach((run: any) => {
          const month = run.periodName ?? run.period_name ?? (run.runDate ? new Date(run.runDate).toLocaleDateString("en-US", { month: "short" }) : "Run");
          const cost = Number(run.grossPayroll ?? run.gross_payroll ?? 0);
          if (month && cost > 0) {
            realPayrollHistory.push({ month, cost });
          }
        });
      }
      setPayrollHistory(realPayrollHistory);

      setPayrollOverview({
        totalCostFormatted: formattedCost,
        payrollStatus: [
          { label: "Processed", value: processedCount, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Approval", value: pendingCount, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Disbursed / Paid", value: paidCount, color: "text-blue-500", bg: "bg-blue-500/10" },
        ],
        monthlySalaryCostChart: realPayrollHistory,
      });
    } catch (err: any) {
      console.error("Error fetching executive dashboard live data:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  // Structured KPI details strictly from real backend responses
  const kpiDetails: ExecutiveKpiDetails = useMemo(
    () => ({
      headcount: {
        value: totalEmployees,
        change: headcountChange,
        changeType: headcountChangeType,
        trend: headcountTrend,
        hasTrend: headcountTrend.length > 1,
        link: "/dashboard/employees",
      },
      openings: {
        value: totalJobs,
        change: null,
        changeType: "neutral",
        bars: jobsBars,
        hasBars: jobsBars.length > 0,
        link: "/dashboard/recruitment/jobs",
      },
      departments: {
        value: totalDepartments,
        distribution: deptDistribution,
        hasDistribution: deptDistribution.length > 0,
        link: "/dashboard/departments",
      },
      payroll: {
        valueFormatted: formatIndianCurrency(totalPayrollCost),
        rawValue: totalPayrollCost,
        history: payrollHistory,
        hasHistory: payrollHistory.length > 1,
        statusCounts: payrollStatusCounts,
        link: "/dashboard/payroll",
      },
      assets: {
        value: totalAssets,
        assignedCount: assetStatusCounts.assigned,
        availableCount: assetStatusCounts.available,
        repairCount: assetStatusCounts.repair,
        assignedPercent: assetStatusCounts.assignedPercent,
        availablePercent: assetStatusCounts.availablePercent,
        hasStatusData: totalAssets > 0 && (assetStatusCounts.assigned > 0 || assetStatusCounts.available > 0),
        link: "/dashboard/assets",
      },
      exits: {
        value: totalExits,
        statusCounts: exitStatusCounts,
        timeline: exitTimeline,
        hasTimeline: exitTimeline.length > 1,
        link: "/dashboard/exit",
      },
    }),
    [
      totalEmployees,
      headcountChange,
      headcountChangeType,
      headcountTrend,
      totalJobs,
      jobsBars,
      totalDepartments,
      deptDistribution,
      totalPayrollCost,
      payrollHistory,
      payrollStatusCounts,
      totalAssets,
      assetStatusCounts,
      totalExits,
      exitStatusCounts,
      exitTimeline,
    ]
  );

  // Backward compatible kpiCards with authentic values (no fake fallbacks)
  const kpiCards: DashboardLiveData["kpiCards"] = useMemo(
    () => [
      {
        id: "total_emp",
        label: "Total Headcount",
        value: totalEmployees,
        change: headcountChange || "",
        changeType: headcountChangeType,
        accent: "text-emerald-500",
        bgAccent: "bg-emerald-500/10",
        spark: headcountTrend.map((pt) => ({ v: pt.value })),
        link: "/dashboard/employees",
      },
      {
        id: "active_jobs",
        label: "Active Openings",
        value: totalJobs,
        change: "",
        changeType: "neutral",
        accent: "text-blue-500",
        bgAccent: "bg-blue-500/10",
        spark: jobsBars.map((b) => ({ v: b.count })),
        link: "/dashboard/recruitment/jobs",
      },
      {
        id: "departments",
        label: "Departments",
        value: totalDepartments,
        change: "",
        changeType: "neutral",
        accent: "text-violet-500",
        bgAccent: "bg-violet-500/10",
        spark: deptDistribution.map((d) => ({ v: d.count })),
        link: "/dashboard/departments",
      },
      {
        id: "payroll_cost",
        label: "Monthly Payroll Cost",
        value: formatIndianCurrency(totalPayrollCost),
        change: "",
        changeType: "neutral",
        accent: "text-amber-500",
        bgAccent: "bg-amber-500/10",
        spark: payrollHistory.map((p) => ({ v: p.cost })),
        link: "/dashboard/payroll",
      },
      {
        id: "asset_count",
        label: "Assets Tracked",
        value: totalAssets,
        change: assetStatusCounts.assignedPercent > 0 ? `${assetStatusCounts.assignedPercent}% Assigned` : "",
        changeType: "neutral",
        accent: "text-cyan-500",
        bgAccent: "bg-cyan-500/10",
        spark: [],
        link: "/dashboard/assets",
      },
      {
        id: "exit_requests",
        label: "Offboarding & Exits",
        value: totalExits,
        change: exitStatusCounts.pending > 0 ? `${exitStatusCounts.pending} Pending` : "",
        changeType: exitStatusCounts.pending > 0 ? "down" : "neutral",
        accent: "text-rose-500",
        bgAccent: "bg-rose-500/10",
        spark: exitTimeline.map((t) => ({ v: t.count })),
        link: "/dashboard/exit",
      },
    ],
    [
      totalEmployees,
      headcountChange,
      headcountChangeType,
      headcountTrend,
      totalJobs,
      jobsBars,
      totalDepartments,
      deptDistribution,
      totalPayrollCost,
      payrollHistory,
      totalAssets,
      assetStatusCounts,
      totalExits,
      exitStatusCounts,
      exitTimeline,
    ]
  );

  return {
    loading,
    error,
    totalEmployees,
    totalDepartments,
    totalJobs,
    totalAssets,
    totalExits,
    totalPayrollCost,
    kpiDetails,
    kpiCards,
    deptPerformance,
    activityFeed,
    activeJobsList,
    payrollOverview,
    refetch: fetchAllDashboardData,
  };
}
