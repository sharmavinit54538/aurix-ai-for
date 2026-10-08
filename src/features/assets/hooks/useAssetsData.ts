import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/api";
import type { Asset, AssetStats, AssetAlert } from "../types";

export function useAssetsData(
  q: string,
  statusFilter: string,
  onSelectScanAsset?: (asset: Asset) => void
) {
  const navigate = useNavigate();

  // Queries
  const { data: listData, isLoading } = useQuery({
    queryKey: ["assets", q, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      params.set("limit", "100");
      return api.get<any>(`assets?${params.toString()}`);
    },
  });

  const { data: analyticsData } = useQuery<any>({
    queryKey: ["assets-analytics"],
    queryFn: () => api.get<any>("assets/analytics"),
  });

  const assets: Asset[] = useMemo(() => {
    const raw =
      listData?.data?.items ??
      listData?.data ??
      listData?.items ??
      (Array.isArray(listData) ? listData : []);
    const items = Array.isArray(raw) ? raw : [];
    return items.map((a: any) => ({
      id: a.id || a._id || "",
      tag: a.tag || a.asset_tag || `AST-${String(a.id || "").slice(-4)}`,
      name: a.name || a.asset_name || "Unnamed Asset",
      category: a.category || "other",
      serial: a.serial || a.serial_number || "N/A",
      vendor: a.vendor || "N/A",
      purchaseDate: a.purchaseDate || a.purchase_date || "",
      warrantyUntil: a.warrantyUntil || a.warranty_until || "",
      status: a.status || "available",
      assignedTo: a.assignedTo || a.assigned_to || a.assigned_to_name || a.assigned_employee_name || "",
      assignedToId:
        a.assignedToId ||
        a.assigned_to_id ||
        a.assigned_employee_id ||
        a.employeeId ||
        a.employee_id ||
        a.userId ||
        a.user_id ||
        "",
      assignedAt: a.assignedAt || a.assigned_at || "",
      brand: a.brand || "",
      model: a.model || "",
      purchaseCost: Number(a.purchaseCost ?? a.purchase_cost ?? 0),
      location: a.location || "",
      notes: a.notes || "",
      nextMaintenance: a.nextMaintenance || a.next_maintenance || "",
      assignmentHistory: a.assignmentHistory || a.assignment_history || [],
      maintenanceHistory: a.maintenanceHistory || a.maintenance_history || [],
      timeline: a.timeline || [],
    }));
  }, [listData]);

  const apiStats = analyticsData?.data ?? analyticsData;

  // Deep Link QR Scan Effect
  const currentPathname = useRouterState({ select: (s) => s.location.pathname });
  const searchParams = useRouterState({ select: (s) => s.location.search }) as unknown as Record<string, string>;

  useEffect(() => {
    if (searchParams && searchParams.scan && assets.length > 0) {
      const matched = assets.find(a => a.id === searchParams.scan || a.tag === searchParams.scan);
      if (matched) {
        onSelectScanAsset?.(matched);
        toast.success(`Scanned QR Code for asset: ${matched.tag} (${matched.name})`);
        navigate({ to: currentPathname as any, search: {} as any, replace: true });
      }
    }
  }, [searchParams, assets, navigate, currentPathname, onSelectScanAsset]);

  // Global inventory stats
  const stats: AssetStats = useMemo(() => {
    const getStat = (val: any, fallbackCalc: () => number) => {
      if (val !== undefined && val !== null) {
        return Number(val);
      }
      return fallbackCalc();
    };

    const total = getStat(apiStats?.total_assets, () => assets.length);
    const available = getStat(
      apiStats?.available_assets,
      () => assets.filter(a => a.status === "available").length
    );
    const assigned = getStat(
      apiStats?.assigned_assets,
      () => assets.filter(a => a.status === "assigned").length
    );
    const repair = getStat(
      apiStats?.under_repair_assets,
      () => assets.filter(a => a.status === "under-repair").length
    );
    const lost = getStat(
      apiStats?.lost_assets,
      () => assets.filter(a => a.status === "lost").length
    );
    const expiring = getStat(
      apiStats?.expiring_warranty_assets,
      () => assets.filter(a => {
        if (!a.warrantyUntil) return false;
        const diff = new Date(a.warrantyUntil).getTime() - Date.now();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
      }).length
    );

    return { total, available, assigned, repair, lost, expiring };
  }, [apiStats, assets]);

  // Notifications and alerts
  const notifications: AssetAlert[] = useMemo(() => {
    const alerts: AssetAlert[] = [];
    const now = Date.now();
    const thirtyDaysLimit = now + 30 * 24 * 60 * 60 * 1000;

    assets.forEach(a => {
      if (a.warrantyUntil) {
        const wTime = new Date(a.warrantyUntil).getTime();
        if (wTime > 0 && wTime < now) {
          alerts.push({
            id: `war_exp_${a.id}`,
            type: "error",
            message: `Warranty expired for ${a.tag} (${a.name}) on ${a.warrantyUntil}.`,
            asset: a,
          });
        } else if (wTime >= now && wTime <= thirtyDaysLimit) {
          alerts.push({
            id: `war_soon_${a.id}`,
            type: "warning",
            message: `Warranty expiring soon for ${a.tag} on ${a.warrantyUntil}.`,
            asset: a,
          });
        }
      }
      if (a.status === "lost") {
        alerts.push({
          id: `lost_${a.id}`,
          type: "error",
          message: `Audit flagged: Asset ${a.tag} is lost. Pending replacement.`,
          asset: a,
        });
      }
      if (a.status === "under-repair") {
        alerts.push({
          id: `rep_${a.id}`,
          type: "info",
          message: `${a.tag} is currently in repair at vendor.`,
          asset: a,
        });
      }
    });

    return alerts;
  }, [assets]);

  const categoryChartData = useMemo(() => {
    return apiStats?.category_distribution || [];
  }, [apiStats]);

  const repairCostChartData = useMemo(() => {
    return apiStats?.repair_costs_by_category || [];
  }, [apiStats]);

  return {
    assets,
    isLoading,
    stats,
    notifications,
    categoryChartData,
    repairCostChartData,
    searchParams,
  };
}
