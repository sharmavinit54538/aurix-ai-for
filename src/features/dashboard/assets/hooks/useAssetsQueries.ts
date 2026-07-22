import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { Asset } from "@/lib/hrms/types";

export interface AssetAnalytics {
  total_assets: number;
  available_assets: number;
  assigned_assets: number;
  under_repair_assets: number;
  lost_assets: number;
  expiring_warranty_assets: number;
  category_distribution?: { name: string; value: number }[];
  repair_costs_by_category?: { category: string; "Total Repair Cost ($)": number }[];
}

const EMPTY_ANALYTICS: AssetAnalytics = {
  total_assets: 0,
  available_assets: 0,
  assigned_assets: 0,
  under_repair_assets: 0,
  lost_assets: 0,
  expiring_warranty_assets: 0,
};

/** Fetches the filtered asset list from the API. */
export function useAssetsList(q: string, statusFilter: string) {
  return useQuery({
    queryKey: ["assets", q, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      params.set("limit", "100");
      return api.get(`assets?${params.toString()}`);
    },
  });
}

/** Fetches aggregate asset analytics (counts, category & repair-cost breakdowns). */
export function useAssetsAnalytics() {
  return useQuery({
    queryKey: ["assets-analytics"],
    queryFn: () => api.get("assets/analytics"),
  });
}

export function extractAssets(listData: any): Asset[] {
  return listData?.data?.items || [];
}

export function extractAnalytics(analyticsData: any): AssetAnalytics {
  return analyticsData?.data || EMPTY_ANALYTICS;
}
