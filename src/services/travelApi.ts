import apiInstance from "@/api/apiInstance";
import type { TravelRequest, TravelStatus } from "@/lib/hrms/types";

export type { TravelRequest, TravelStatus };

const VALID_STAGES: TravelStatus[] = [
  "draft",
  "manager-review",
  "hr-review",
  "finance-review",
  "approved",
  "rejected",
];

function normalizeTravelStatus(val: unknown): TravelStatus {
  const s = String(val || "draft")
    .toLowerCase()
    .replace(/_/g, "-");
  return VALID_STAGES.includes(s as TravelStatus)
    ? (s as TravelStatus)
    : "draft";
}

export function mapTravelFromBackend(raw: Record<string, any>): TravelRequest {
  const rawType = String(raw.type || "domestic").toLowerCase();
  const historyRaw: any[] = Array.isArray(raw.history) ? raw.history : [];

  return {
    id: String(raw.id || ""),
    employee: String(raw.employee || raw.employee_name || ""),
    type: rawType === "international" ? "international" : "domestic",
    purpose: String(raw.purpose || ""),
    destination: String(raw.destination || ""),
    travelDate: String(raw.travel_date || raw.travelDate || raw.departureDate || ""),
    returnDate: String(raw.return_date || raw.returnDate || ""),
    hotel: raw.hotel || undefined,
    transportation: raw.transportation || undefined,
    budget: Number(raw.budget ?? raw.estimatedCost ?? 0),
    currency: String(raw.currency || "INR"),
    status: normalizeTravelStatus(raw.status),
    history: historyRaw.map((h) => ({
      stage: normalizeTravelStatus(h.stage || h.status),
      at: String(h.at || h.timestamp || new Date().toISOString()),
      note: h.note || undefined,
    })),
    createdAt: String(
      raw.created_at || raw.createdAt || new Date().toISOString(),
    ),
  };
}

export const travelApi = {
  getTravelRequests: async (): Promise<{
    items: TravelRequest[];
    total: number;
  }> => {
    const res = await apiInstance.get("/travel");
    const payload = res.data?.data ?? res.data;
    const rawItems: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    const items = rawItems.map(mapTravelFromBackend);
    return {
      items,
      total: Number(payload?.total ?? items.length),
    };
  },

  createTravelRequest: async (
    payload: Partial<TravelRequest>,
  ): Promise<TravelRequest> => {
    const res = await apiInstance.post("/travel", {
      employee_name: payload.employee,
      employee: payload.employee,
      type: payload.type || "domestic",
      purpose: payload.purpose,
      destination: payload.destination,
      travel_date: payload.travelDate,
      return_date: payload.returnDate,
      hotel: payload.hotel,
      transportation: payload.transportation,
      budget: payload.budget,
      currency: payload.currency || "INR",
    });
    return mapTravelFromBackend(res.data?.data ?? res.data);
  },

  advanceTravelStage: async (
    id: string,
    stage: TravelStatus,
    note?: string,
  ): Promise<TravelRequest> => {
    const res = await apiInstance.post(`/travel/${id}/stage`, {
      stage,
      note,
    });
    return mapTravelFromBackend(res.data?.data ?? res.data);
  },

  getRequests: async (): Promise<TravelRequest[]> => {
    const res = await travelApi.getTravelRequests();
    return res.items;
  },

  createRequest: async (
    payload: Partial<TravelRequest>,
  ): Promise<TravelRequest> => {
    return travelApi.createTravelRequest(payload);
  },
};
