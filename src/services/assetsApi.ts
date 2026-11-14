import { api } from "@/api/client";

export function mapAssetFromBackend(raw: any) {
  return {
    id: raw.id,
    name: raw.name || raw.assetName || "Equipment",
    category: raw.category || "Hardware",
    serialNumber: raw.serialNumber || raw.tag || "N/A",
    assignedTo: raw.assignedTo || raw.user || "Unassigned",
    status: raw.status || "available",
  };
}

export const assetsApi = {
  getAssets: async () => {
    try {
      const data = await api.get<any[]>("/assets");
      return (data || []).map(mapAssetFromBackend);
    } catch {
      return [];
    }
  },
  createAsset: async (payload: any) => {
    return api.post("/assets", payload);
  },
  assignAsset: async (assetId: string, employeeId: string) => {
    return api.post(`/assets/${assetId}/assign`, { employeeId });
  },
};

export default assetsApi;
