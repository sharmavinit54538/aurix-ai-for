import apiInstance from "@/api/apiInstance";
import type {
  ShiftItem,
  ShiftCreatePayload,
  ShiftUpdatePayload,
  ShiftOption,
  ShiftAssignPayload,
  ShiftAssignResult,
  ShiftOption as ShiftOptionType,
  ShiftChangeRequest,
  ShiftChangeRequestPayload,
  ShiftListResponse,
  ShiftEmployeesResponse,
  MyScheduleData,
  ListChangeRequestsParams,
  CreateChangeRequestPayload,
  ApproveChangeRequestPayload,
  RejectChangeRequestPayload,
} from "./types";

function unwrapData<T>(res: any): T {
  const payload = res.data?.data ?? res.data;
  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success === false) {
      throw new Error(payload.message || "API request failed");
    }
    return payload.data as T;
  }
  return payload as T;
}

export const getShifts = async (
  params?: Record<string, unknown>,
): Promise<ShiftListResponse> => {
  const res = await apiInstance.get("/api/v1/attendance/shifts", { params });
  return unwrapData<ShiftListResponse>(res);
};

export const getShiftOptions = async (): Promise<ShiftOption[]> => {
  const res = await apiInstance.get("/api/v1/attendance/shifts/options");
  const data = unwrapData<{ options: ShiftOption[] }>(res);
  return data.options ?? [];
};

export const createShift = async (
  data: ShiftCreatePayload,
): Promise<ShiftItem> => {
  const res = await apiInstance.post("/api/v1/attendance/shifts", data);
  return unwrapData<ShiftItem>(res);
};

export const updateShift = async (
  id: string,
  data: ShiftUpdatePayload,
): Promise<ShiftItem> => {
  const res = await apiInstance.put(`/api/v1/attendance/shifts/${id}`, data);
  return unwrapData<ShiftItem>(res);
};

export const deleteShift = async (
  id: string,
  reassignTo?: string,
): Promise<{ success: boolean; reassigned?: boolean }> => {
  const res = await apiInstance.delete(`/api/v1/attendance/shifts/${id}`, {
    data: reassignTo ? { reassign_to: reassignTo } : undefined,
  });
  return unwrapData<{ success: boolean; reassigned?: boolean }>(res);
};

export const assignShift = async (
  shiftId: string,
  payload: ShiftAssignPayload,
): Promise<ShiftAssignResult> => {
  const res = await apiInstance.post(`/api/v1/attendance/shifts/${shiftId}/assign`, payload);
  return unwrapData<ShiftAssignResult>(res);
};

export const getShiftEmployees = async (
  shiftId: string,
  params?: Record<string, unknown>,
): Promise<ShiftEmployeesResponse> => {
  const res = await apiInstance.get(`/api/v1/attendance/shifts/${shiftId}/employees`, { params });
  return unwrapData<ShiftEmployeesResponse>(res);
};

export const getMySchedule = async (
  params?: Record<string, unknown>,
): Promise<MyScheduleData> => {
  const res = await apiInstance.get("/api/v1/attendance/shifts/me/schedule", { params });
  return unwrapData<MyScheduleData>(res);
};

export const getMyChangeRequests = async (): Promise<ShiftChangeRequest[]> => {
  const res = await apiInstance.get("/api/v1/attendance/shifts/change-requests/my");
  const data = unwrapData<{ items: ShiftChangeRequest[] }>(res);
  return data.items ?? [];
};

export const createChangeRequest = async (
  payload: ShiftChangeRequestPayload,
): Promise<ShiftChangeRequest> => {
  const res = await apiInstance.post("/api/v1/attendance/shifts/change-requests", payload);
  return unwrapData<ShiftChangeRequest>(res);
};

export const listChangeRequests = async (
  params?: ListChangeRequestsParams,
): Promise<{ items: ShiftChangeRequest[]; total: number; page: number; limit: number }> => {
  const res = await apiInstance.get("/api/v1/attendance/shifts/change-requests", { params });
  return unwrapData<{ items: ShiftChangeRequest[]; total: number; page: number; limit: number }>(res);
};

export const approveChangeRequest = async (
  id: string,
  payload?: ApproveChangeRequestPayload,
): Promise<ShiftChangeRequest> => {
  const res = await apiInstance.post(`/api/v1/attendance/shifts/change-requests/${id}/approve`, payload);
  return unwrapData<ShiftChangeRequest>(res);
};

export const rejectChangeRequest = async (
  id: string,
  payload: RejectChangeRequestPayload,
): Promise<ShiftChangeRequest> => {
  const res = await apiInstance.post(`/api/v1/attendance/shifts/change-requests/${id}/reject`, payload);
  return unwrapData<ShiftChangeRequest>(res);
};

export const cancelChangeRequest = async (
  id: string,
): Promise<ShiftChangeRequest> => {
  const res = await apiInstance.post(`/api/v1/attendance/shifts/change-requests/${id}/cancel`, {});
  return unwrapData<ShiftChangeRequest>(res);
};

export const shiftsApi = {
  getShifts,
  getShiftOptions,
  createShift,
  updateShift,
  deleteShift,
  assignShift,
  getShiftEmployees,
  getMySchedule,
  getMyChangeRequests,
  createChangeRequest,
  listChangeRequests,
  approveChangeRequest,
  rejectChangeRequest,
  cancelChangeRequest,
};

export default shiftsApi;