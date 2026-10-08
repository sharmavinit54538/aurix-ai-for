import { useState, useMemo } from "react";
import type {
  ExitCase,
  ExitStats,
  ExitAlert,
  AttritionChartPoint,
  MonthlyTrendPoint,
} from "../types";

export function useExitFilters(exits: ExitCase[]) {
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Metrics
  const stats = useMemo<ExitStats>(() => {
    const total = exits.length;
    const approvals = exits.filter(
      (e) => e.stage === "requested" || e.stage === "under-review",
    ).length;
    const notice = exits.filter((e) => e.stage === "notice" || e.stage === "clearance").length;

    const clearance = exits.filter((e) => {
      if (e.stage !== "clearance") return false;
      const allDone = e.checklist.every((c) => c.done);
      return !allDone;
    }).length;

    const settlement = exits.filter((e) => {
      return (
        e.stage === "settlement" || (e.settlementDetails && e.settlementDetails.status !== "paid")
      );
    }).length;

    const completed = exits.filter((e) => e.stage === "completed" || e.stage === "settled").length;

    return { total, approvals, notice, clearance, settlement, completed };
  }, [exits]);

  // Notifications
  const alertsList = useMemo<ExitAlert[]>(() => {
    const alerts: ExitAlert[] = [];

    exits.forEach((e) => {
      if (e.stage === "requested") {
        alerts.push({
          id: `app_${e.id}`,
          type: "warning",
          message: `Approval required: ${e.employee} submitted resignation request.`,
          exitCase: e,
        });
      }
      if (e.stage === "clearance") {
        const missingAssets = (e.assignedAssets || []).filter((a) => a.status === "pending").length;
        if (missingAssets > 0) {
          alerts.push({
            id: `ast_${e.id}`,
            type: "error",
            message: `Asset return pending: ${e.employee} has ${missingAssets} hardware devices un-returned.`,
            exitCase: e,
          });
        }
      }
      if (e.stage === "notice" && e.remainingDays && e.remainingDays <= 15) {
        alerts.push({
          id: `not_${e.id}`,
          type: "warning",
          message: `Notice period ending soon for ${e.employee} (${e.remainingDays} days left).`,
          exitCase: e,
        });
      }
    });

    return alerts;
  }, [exits]);

  // Filter Table
  const filteredExits = useMemo(() => {
    return exits.filter((e) => {
      const matchQ =
        !q ||
        e.employee.toLowerCase().includes(q.toLowerCase()) ||
        (e.employeeId && e.employeeId.toLowerCase().includes(q.toLowerCase())) ||
        e.role.toLowerCase().includes(q.toLowerCase()) ||
        (e.department && e.department.toLowerCase().includes(q.toLowerCase()));

      let matchStage = true;
      if (activeFilter !== "all") {
        if (activeFilter === "requested") {
          matchStage = e.stage === "requested";
        } else if (activeFilter === "under-review") {
          matchStage = e.stage === "under-review" || e.stage === "manager" || e.stage === "hr";
        } else if (activeFilter === "approved") {
          matchStage = e.stage === "approved";
        } else if (activeFilter === "notice") {
          matchStage = e.stage === "notice";
        } else if (activeFilter === "clearance") {
          matchStage = e.stage === "clearance" || e.stage === "assets" || e.stage === "it";
        } else if (activeFilter === "settlement") {
          matchStage = e.stage === "settlement" || e.stage === "finance";
        } else if (activeFilter === "completed") {
          matchStage = e.stage === "completed" || e.stage === "settled";
        } else if (activeFilter === "cancelled") {
          matchStage = e.stage === "cancelled";
        }
      }

      return matchQ && matchStage;
    });
  }, [exits, q, activeFilter]);

  // Paginated items
  const paginatedExits = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredExits.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredExits, currentPage]);

  const totalPages = Math.ceil(filteredExits.length / itemsPerPage);

  // Recharts Department-wise attrition counts
  const attritionChartData = useMemo<AttritionChartPoint[]>(() => {
    const counts: Record<string, number> = {};
    exits.forEach((e) => {
      const dept = e.department || "Operations";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({
      department: k,
      "Exit Count": counts[k],
    }));
  }, [exits]);

  // Monthly exit trends computed from actual exit records
  const monthlyExitTrends = useMemo<MonthlyTrendPoint[]>(() => {
    if (exits.length === 0) return [];
    const counts: Record<string, number> = {};
    exits.forEach((e) => {
      const dateStr = e.resignedAt || e.lastWorkingDay;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [exits]);

  return {
    q,
    setQ,
    activeFilter,
    setActiveFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    stats,
    alertsList,
    filteredExits,
    paginatedExits,
    totalPages,
    attritionChartData,
    monthlyExitTrends,
  };
}
