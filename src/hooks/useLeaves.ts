import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyLeaveBalances,
  applyLeave,
  getMyLeaveHistory,
  getPendingApprovals,
  getCompanyEmployees,
  getEmployeeLeaveBalances,
  getAllLeaveRequests,
  approveLeave,
  rejectLeave,
  cancelLeave,
  LeaveBalance,
  LeaveRequest,
  LeaveRequestCreate,
  LeaveRequestExtended,
  LeaveEmployee,
  LeaveAllRequestsParams,
} from "@/services/leavesApi";

// Query Keys
export const leavesKeys = {
  all: ["leaves"] as const,
  balances: () => [...leavesKeys.all, "balances"] as const,
  history: (page: number, limit: number) => [...leavesKeys.all, "history", { page, limit }] as const,
  pending: () => [...leavesKeys.all, "pending"] as const,
  employees: (query?: string, page?: number, limit?: number) => [...leavesKeys.all, "employees", { query, page, limit }] as const,
  employeeBalances: (employeeId: string) => [...leavesKeys.all, "employeeBalances", employeeId] as const,
  allRequests: (params: LeaveAllRequestsParams) => [...leavesKeys.all, "allRequests", params] as const,
};

// ─────────────────────────────────────────────────────────────
// My Leave Balances
// ─────────────────────────────────────────────────────────────

export function useMyLeaveBalances() {
  return useQuery({
    queryKey: leavesKeys.balances(),
    queryFn: getMyLeaveBalances,
    staleTime: 30_000,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────
// Apply Leave
// ─────────────────────────────────────────────────────────────

export function useApplyLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LeaveRequestCreate) => applyLeave(payload),
    onSuccess: () => {
      toast.success("Leave request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: leavesKeys.balances() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.history(1, 20) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to apply leave. Ensure you have sufficient balance.");
    },
  });
}

// ─────────────────────────────────────────────────────────────
// My Leave History
// ─────────────────────────────────────────────────────────────

export function useMyLeaveHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: leavesKeys.history(page, limit),
    queryFn: () => getMyLeaveHistory(page, limit),
    staleTime: 30_000,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
}

// ─────────────────────────────────────────────────────────────
// Pending Approvals
// ─────────────────────────────────────────────────────────────

export function usePendingApprovals(enabled = true) {
  return useQuery({
    queryKey: leavesKeys.pending(),
    queryFn: getPendingApprovals,
    enabled,
    staleTime: 30_000,
    retry: 1,
    refetchInterval: enabled ? 30_000 : false,
  });
}

// ─────────────────────────────────────────────────────────────
// Company Employees
// ─────────────────────────────────────────────────────────────

export function useCompanyEmployees(query?: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: leavesKeys.employees(query, page, limit),
    queryFn: () => getCompanyEmployees(query, page, limit),
    enabled: query !== undefined || true,
    staleTime: 60_000,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
}

// ─────────────────────────────────────────────────────────────
// Employee Leave Balances
// ─────────────────────────────────────────────────────────────

export function useEmployeeLeaveBalances(employeeId: string | null) {
  return useQuery({
    queryKey: employeeId ? leavesKeys.employeeBalances(employeeId) : ["leaves", "employeeBalances", "null"],
    queryFn: () => getEmployeeLeaveBalances(employeeId!),
    enabled: !!employeeId,
    staleTime: 30_000,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────
// All Leave Requests
// ─────────────────────────────────────────────────────────────

export function useAllLeaveRequests(params: LeaveAllRequestsParams = {}) {
  return useQuery({
    queryKey: leavesKeys.allRequests(params),
    queryFn: () => getAllLeaveRequests(params),
    staleTime: 30_000,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
}

// ─────────────────────────────────────────────────────────────
// Approve Leave
// ─────────────────────────────────────────────────────────────

export function useApproveLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveId: string) => approveLeave(leaveId),
    onSuccess: () => {
      toast.success("Leave request approved.");
      queryClient.invalidateQueries({ queryKey: leavesKeys.pending() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.allRequests({}) });
      queryClient.invalidateQueries({ queryKey: leavesKeys.balances() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.history(1, 20) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve leave request.");
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Reject Leave
// ─────────────────────────────────────────────────────────────

export function useRejectLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leaveId, rejectionReason }: { leaveId: string; rejectionReason: string }) =>
      rejectLeave(leaveId, rejectionReason),
    onSuccess: () => {
      toast.success("Leave request rejected.");
      queryClient.invalidateQueries({ queryKey: leavesKeys.pending() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.allRequests({}) });
      queryClient.invalidateQueries({ queryKey: leavesKeys.balances() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.history(1, 20) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject leave request.");
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Cancel Leave
// ─────────────────────────────────────────────────────────────

export function useCancelLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaveId: string) => cancelLeave(leaveId),
    onSuccess: () => {
      toast.success("Leave request cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: leavesKeys.balances() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.history(1, 20) });
      queryClient.invalidateQueries({ queryKey: leavesKeys.pending() });
      queryClient.invalidateQueries({ queryKey: leavesKeys.allRequests({}) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel leave request.");
    },
  });
}