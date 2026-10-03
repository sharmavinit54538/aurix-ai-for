import apiInstance from "@/api/apiInstance";
import type { TravelRequest, TravelStatus } from "@/lib/hrms/types";

export interface BackendTravelRequest {
  id: string;
  tenant_id?: string;
  employee?: string;
  employee_id?: string;
  employee_name?: string;
  type?: "domestic" | "international";
  purpose: string;
  destination: string;
  travel_date: string;
  return_date: string;
  hotel?: string;
  transportation?: string;
  budget: number;
  currency?: string;
  status: string;
  history?: Array<{ stage: string; at: string; note?: string }>;
  created_at: string;
}

export function mapTravelFromBackend(raw: BackendTravelRequest | any): TravelRequest {
  const historyRaw = Array.isArray(raw.history) ? raw.history : [];
  return {
    id: String(raw.id || raw._id || ""),
    employee: raw.employee_name || raw.employee || raw.employee_id || "Unknown",
    type: raw.type === "international" ? "international" : "domestic",
    purpose: raw.purpose || "",
    destination: raw.destination || "",
    travelDate: raw.travel_date ? String(raw.travel_date).slice(0, 10) : (raw.travelDate ? String(raw.travelDate).slice(0, 10) : new Date().toISOString().slice(0, 10)),
    returnDate: raw.return_date ? String(raw.return_date).slice(0, 10) : (raw.returnDate ? String(raw.returnDate).slice(0, 10) : new Date().toISOString().slice(0, 10)),
    hotel: raw.hotel || undefined,
    transportation: raw.transportation || undefined,
    budget: Number(raw.budget || 0),
    currency: raw.currency || "INR",
    status: (raw.status || "draft").toLowerCase() as TravelStatus,
    history: historyRaw.map((h: any) => ({
      stage: (h.stage || "draft").toLowerCase() as TravelStatus,
      at: h.at || new Date().toISOString(),
      note: h.note || undefined,
    })),
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
  };
}

export const travelApi = {
  async getTravelRequests(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: TravelRequest[]; total: number }> {
    const res = await apiInstance.get("/api/v2/travel", { params });
    const rawData = res.data?.data ?? res.data;
    const itemsRaw = rawData?.items ?? (Array.isArray(rawData) ? rawData : []);
    const total = rawData?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapTravelFromBackend),
      total,
    };
  },

  async getTravelRequest(id: string): Promise<TravelRequest> {
    const res = await apiInstance.get(`/api/v2/travel/${id}`);
    const raw = res.data?.data ?? res.data;
    return mapTravelFromBackend(raw);
  },

  async createTravelRequest(payload: {
    employee: string;
    type: "domestic" | "international";
    purpose: string;
    destination: string;
    travelDate: string;
    returnDate: string;
    hotel?: string;
    transportation?: string;
    budget: number;
    currency?: string;
  }): Promise<TravelRequest> {
    const body = {
      employee_name: payload.employee,
      type: payload.type,
      purpose: payload.purpose,
      destination: payload.destination,
      travel_date: payload.travelDate,
      return_date: payload.returnDate,
      hotel: payload.hotel,
      transportation: payload.transportation,
      budget: payload.budget,
      currency: payload.currency || "INR",
      status: "manager-review",
    };
    const res = await apiInstance.post("/api/v2/travel", body);
    const raw = res.data?.data ?? res.data;
    return mapTravelFromBackend(raw);
  },

  async patchTravelRequest(id: string, payload: Partial<BackendTravelRequest>): Promise<TravelRequest> {
    const res = await apiInstance.patch(`/api/v2/travel/${id}`, payload);
    const raw = res.data?.data ?? res.data;
    return mapTravelFromBackend(raw);
  },

  async advanceTravelStage(id: string, stage: TravelStatus, note?: string): Promise<TravelRequest> {
    const res = await apiInstance.post(`/api/v2/travel/${id}/transition`, { stage, note });
    const raw = res.data?.data ?? res.data;
    return mapTravelFromBackend(raw);
  },
};
