import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
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
} from "@/services/attendance/shiftsApi";
import type {
  Shift,
  ShiftCreatePayload,
  ShiftAssignPayload,
  ShiftOption,
  ShiftAssignResult,
  ShiftChangeRequest,
  MyScheduleData,
  ShiftListResponse,
  ShiftEmployeesResponse,
  ListChangeRequestsParams,
  CreateChangeRequestPayload,
  ApproveChangeRequestPayload,
  RejectChangeRequestPayload,
} from "@/services/attendance/types";

export const shiftKeys = {
  all: ["shifts"] as const,
  lists: () => [...shiftKeys.all, "list"] as const,
  list: (params?: Parameters<typeof getShifts>[0]) => [...shiftKeys.lists(), params] as const,
  options: () => [...shiftKeys.all, "options"] as const,
  employees: (shiftId: string, params?: Parameters<typeof getShiftEmployees>[1]) =>
    [...shiftKeys.all, "employees", shiftId, params] as const,
  mySchedule: (params?: Parameters<typeof getMySchedule>[0]) =>
    [...shiftKeys.all, "my-schedule", params] as const,
  myChangeRequests: () => [...shiftKeys.all, "my-change-requests"] as const,
  changeRequests: (params?: ListChangeRequestsParams) =>
    [...shiftKeys.all, "change-requests", params] as const,
};

export function useShiftsQuery(
  params?: Parameters<typeof getShifts>[0],
  options?: UseQueryOptions<ShiftListResponse, Error, ShiftListResponse>
) {
  return useQuery({
    queryKey: shiftKeys.list(params),
    queryFn: () => getShifts(params),
    ...options,
  });
}

export function useShiftOptionsQuery(
  options?: UseQueryOptions<ShiftOption[], Error, ShiftOption[]>
) {
  return useQuery({
    queryKey: shiftKeys.options(),
    queryFn: getShiftOptions,
    ...options,
  });
}

export function useCreateShift(
  options?: UseMutationOptions<Shift, Error, ShiftCreatePayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.options() });
    },
    ...options,
  });
}

export function useUpdateShift(
  options?: UseMutationOptions<Shift, Error, { id: string; data: Partial<ShiftCreatePayload> }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.options() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.mySchedule() });
    },
    ...options,
  });
}

export function useDeleteShift(
  options?: UseMutationOptions<{ success: boolean; reassigned?: boolean }, Error, { id: string; reassignTo?: string }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reassignTo }) => deleteShift(id, reassignTo ? { reassignTo } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.options() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.mySchedule() });
    },
    ...options,
  });
}

export function useAssignShift(
  options?: UseMutationOptions<ShiftAssignResult, Error, { shiftId: string; payload: ShiftAssignPayload }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ shiftId, payload }) => assignShift(shiftId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.mySchedule() });
    },
    ...options,
  });
}

export function useShiftEmployeesQuery(
  shiftId: string,
  params?: Parameters<typeof getShiftEmployees>[1],
  options?: UseQueryOptions<ShiftEmployeesResponse, Error, ShiftEmployeesResponse>
) {
  return useQuery({
    queryKey: shiftKeys.employees(shiftId, params),
    queryFn: () => getShiftEmployees(shiftId, params),
    enabled: !!shiftId,
    ...options,
  });
}

export function useMyScheduleQuery(
  params?: Parameters<typeof getMySchedule>[0],
  options?: UseQueryOptions<MyScheduleData, Error, MyScheduleData>
) {
  return useQuery({
    queryKey: shiftKeys.mySchedule(params),
    queryFn: () => getMySchedule(params),
    ...options,
  });
}

export function useMyChangeRequestsQuery(
  options?: UseQueryOptions<ShiftChangeRequest[], Error, ShiftChangeRequest[]>
) {
  return useQuery({
    queryKey: shiftKeys.myChangeRequests(),
    queryFn: getMyChangeRequests,
    ...options,
  });
}

export function useCreateChangeRequest(
  options?: UseMutationOptions<ShiftChangeRequest, Error, CreateChangeRequestPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChangeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.myChangeRequests() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.mySchedule() });
    },
    ...options,
  });
}

export function useChangeRequestsAdminQuery(
  params?: ListChangeRequestsParams,
  options?: UseQueryOptions<
    { items: ShiftChangeRequest[]; total: number; page: number; limit: number },
    Error,
    { items: ShiftChangeRequest[]; total: number; page: number; limit: number }
  >
) {
  return useQuery({
    queryKey: shiftKeys.changeRequests(params),
    queryFn: () => listChangeRequests(params),
    ...options,
  });
}

export function useReviewChangeRequest(
  options?: UseMutationOptions<ShiftChangeRequest, Error, { id: string; action: "approve" | "reject" | "cancel"; note?: string }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action, note }) => {
      switch (action) {
        case "approve":
          return approveChangeRequest(id, note ? { note } : undefined);
        case "reject":
          return rejectChangeRequest(id, { note: note ?? "" });
        case "cancel":
          return cancelChangeRequest(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.changeRequests() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.myChangeRequests() });
      queryClient.invalidateQueries({ queryKey: shiftKeys.mySchedule() });
    },
    ...options,
  });
}