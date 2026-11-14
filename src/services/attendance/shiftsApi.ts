import apiInstance from "@/api/apiInstance";
import type { ShiftItem, ShiftChangeRequest } from "./types";

export const getShifts = async (
  params?: Record<string, unknown>,
): Promise<{ items: ShiftItem[]; total: number }> => {
  const res = await apiInstance.get("/attendance/shifts", { params });
  const d = res.data?.data ?? res.data;
  const items: ShiftItem[] = Array.isArray(d)
    ? d
    : Array.isArray(d?.items)
      ? d.items
      : [];
  return {
    items,
    total: Number(d?.total ?? items.length),
  };
};

export const getShiftOptions = async (): Promise<ShiftItem[]> => {
  const res = await getShifts();
  return res.items;
};

export const createShift = async (
  data: Partial<ShiftItem>,
): Promise<ShiftItem> => {
  const res = await apiInstance.post("/attendance/shifts", data);
  return res.data?.data ?? res.data;
};

export const updateShift = async (
  id: string,
  data: Partial<ShiftItem>,
): Promise<ShiftItem> => {
  const res = await apiInstance.put(`/attendance/shifts/${id}`, data);
  return res.data?.data ?? res.data;
};

export const deleteShift = async (
  id: string,
): Promise<{ success: boolean }> => {
  const res = await apiInstance.delete(`/attendance/shifts/${id}`);
  return res.data?.data ?? res.data ?? { success: true };
};

export const assignShift = async (payload: unknown) => {
  const res = await apiInstance.post("/attendance/shifts/assign", payload);
  return res.data?.data ?? res.data;
};

export const getShiftEmployees = async (shiftId: string): Promise<any[]> => {
  const res = await apiInstance.get(`/attendance/shifts/${shiftId}/employees`);
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const getMySchedule = async (
  params?: Record<string, unknown>,
): Promise<any> => {
  const res = await apiInstance.get("/attendance/shifts/my-schedule", {
    params,
  });
  return res.data?.data ?? res.data ?? null;
};

export const getMyChangeRequests = async (): Promise<ShiftChangeRequest[]> => {
  const res = await apiInstance.get("/attendance/shifts/change-requests/my");
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const createChangeRequest = async (
  payload: Partial<ShiftChangeRequest>,
): Promise<ShiftChangeRequest> => {
  const res = await apiInstance.post(
    "/attendance/shifts/change-requests",
    payload,
  );
  return res.data?.data ?? res.data;
};

export const listChangeRequests = async (
  params?: Record<string, unknown>,
): Promise<ShiftChangeRequest[]> => {
  const res = await apiInstance.get("/attendance/shifts/change-requests", {
    params,
  });
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const approveChangeRequest = async (
  id: string,
  comment?: string,
): Promise<{ success: boolean }> => {
  const res = await apiInstance.post(
    `/attendance/shifts/change-requests/${id}/approve`,
    { comment },
  );
  return res.data?.data ?? res.data ?? { success: true };
};

export const rejectChangeRequest = async (
  id: string,
  comment?: string,
): Promise<{ success: boolean }> => {
  const res = await apiInstance.post(
    `/attendance/shifts/change-requests/${id}/reject`,
    { comment },
  );
  return res.data?.data ?? res.data ?? { success: true };
};

export const cancelChangeRequest = async (
  id: string,
): Promise<{ success: boolean }> => {
  const res = await apiInstance.post(
    `/attendance/shifts/change-requests/${id}/cancel`,
    {},
  );
  return res.data?.data ?? res.data ?? { success: true };
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
