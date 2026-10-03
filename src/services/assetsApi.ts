import apiInstance from "@/api/apiInstance";
import type { Asset, AssetCategory, AssetStatus } from "@/lib/hrms/types";

export interface BackendAsset {
  id: string;
  tag?: string;
  asset_tag?: string;
  name?: string;
  asset_name?: string;
  category?: string;
  serial?: string;
  serial_number?: string;
  vendor?: string;
  purchase_date?: string;
  purchaseDate?: string;
  warranty_until?: string;
  warrantyUntil?: string;
  status?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  assignedTo?: string;
  assigned_at?: string;
  assignedAt?: string;
  brand?: string;
  model?: string;
  purchase_cost?: number;
  purchaseCost?: number;
  location?: string;
  notes?: string;
  next_maintenance?: string;
  nextMaintenance?: string;
  assignment_history?: any[];
  maintenance_history?: any[];
  timeline?: any[];
}

export function mapAssetFromBackend(raw: BackendAsset | any): Asset {
  return {
    id: String(raw.id || raw._id || ""),
    tag: raw.tag || raw.asset_tag || `AST-${String(raw.id || "").slice(-4)}`,
    name: raw.name || raw.asset_name || "Asset",
    category: (raw.category || "other").toLowerCase() as AssetCategory,
    serial: raw.serial || raw.serial_number || "N/A",
    vendor: raw.vendor || "N/A",
    purchaseDate: raw.purchaseDate || raw.purchase_date || new Date().toISOString().slice(0, 10),
    warrantyUntil: raw.warrantyUntil || raw.warranty_until || new Date(Date.now() + 31536000000).toISOString().slice(0, 10),
    status: (raw.status || "available").toLowerCase() as AssetStatus,
    assignedTo: raw.assignedTo || raw.assigned_to || raw.assigned_to_name || undefined,
    assignedAt: raw.assignedAt || raw.assigned_at || undefined,
    brand: raw.brand || "",
    model: raw.model || "",
    purchaseCost: Number(raw.purchaseCost ?? raw.purchase_cost ?? 0),
    location: raw.location || "",
    notes: raw.notes || "",
    nextMaintenance: raw.nextMaintenance || raw.next_maintenance || undefined,
    assignmentHistory: raw.assignmentHistory || raw.assignment_history || [],
    maintenanceHistory: raw.maintenanceHistory || raw.maintenance_history || [],
    timeline: raw.timeline || [],
  };
}

export const assetsApi = {
  async getAssets(params?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Asset[]; total: number }> {
    const res = await apiInstance.get("/api/v1/assets", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapAssetFromBackend),
      total,
    };
  },

  async getAssetAnalytics(): Promise<any> {
    const res = await apiInstance.get("/api/v1/assets/analytics");
    return res.data?.data ?? res.data;
  },

  async createAsset(payload: Partial<BackendAsset>): Promise<Asset> {
    const res = await apiInstance.post("/api/v1/assets", payload);
    const raw = res.data?.data ?? res.data;
    return mapAssetFromBackend(raw);
  },

  async updateAsset(id: string, payload: Partial<BackendAsset>): Promise<Asset> {
    const res = await apiInstance.put(`/api/v1/assets/${id}`, payload);
    const raw = res.data?.data ?? res.data;
    return mapAssetFromBackend(raw);
  },

  async deleteAsset(id: string): Promise<void> {
    await apiInstance.delete(`/api/v1/assets/${id}`);
  },

  async assignAsset(id: string, employeeName: string): Promise<Asset> {
    const res = await apiInstance.post(`/api/v1/assets/${id}/assign`, {
      assigned_to: employeeName,
    });
    const raw = res.data?.data ?? res.data;
    return mapAssetFromBackend(raw);
  },

  async returnAsset(id: string): Promise<Asset> {
    const res = await apiInstance.post(`/api/v1/assets/${id}/return`);
    const raw = res.data?.data ?? res.data;
    return mapAssetFromBackend(raw);
  },
};
