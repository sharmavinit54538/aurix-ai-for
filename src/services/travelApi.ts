import { api } from "@/api/client";

export function mapTravelFromBackend(raw: any) {
  return {
    id: raw.id,
    destination: raw.destination || "Destination",
    startDate: raw.startDate || new Date().toISOString(),
    endDate: raw.endDate || new Date().toISOString(),
    purpose: raw.purpose || "Business Trip",
    status: raw.status || "requested",
  };
}

export const travelApi = {
  getRequests: async () => {
    try {
      const data = await api.get<any[]>("/travel");
      return (data || []).map(mapTravelFromBackend);
    } catch {
      return [];
    }
  },
  createRequest: async (payload: any) => {
    return api.post("/travel", payload);
  },
};

export default travelApi;
