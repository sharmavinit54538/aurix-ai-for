import { api } from "@/api/client";

export function createVisitorError(msg: string) {
  return new Error(`[Visitor Error] ${msg}`);
}

export function mapVisitorFromBackend(raw: any) {
  return {
    id: raw.id,
    visitorName: raw.visitorName || raw.name || "Guest",
    hostName: raw.hostName || raw.host || "Employee",
    checkInTime: raw.checkInTime || raw.visitDate || new Date().toISOString(),
    status: raw.status || "expected",
  };
}

export const visitorsApi = {
  getVisitors: async () => {
    try {
      const data = await api.get<any[]>("/visitors");
      return (data || []).map(mapVisitorFromBackend);
    } catch {
      return [];
    }
  },
  registerVisitor: async (payload: any) => {
    return api.post("/visitors", payload);
  },
  checkInVisitor: async (id: string) => {
    return api.post(`/visitors/${id}/check-in`);
  },
};

export default visitorsApi;
