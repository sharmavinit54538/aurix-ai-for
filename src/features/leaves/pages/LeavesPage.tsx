import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Plus, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/use-current-role";
import { api } from "@/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import type { LeaveBalance, LeaveRequest, LeaveCapabilities } from "../types";
import { mapLeave, mapBalance, statusBadgeClass } from "../mappers";
import { BalanceCards } from "../components/BalanceCards";
import { HistoryTable } from "../components/HistoryTable";
import { ApprovalsList } from "../components/ApprovalsList";
import { AllBalancesPanel } from "../components/AllBalancesPanel";
import { ApplyLeaveDialog } from "../components/ApplyLeaveDialog";
import { RejectDialog } from "../components/RejectDialog";
import { ApproveDialog } from "../components/ApproveDialog";
import { CancelLeaveDialog } from "../components/CancelLeaveDialog";
import { cn } from "@/lib/utils";
import { usePoller } from "@/hooks/usePoller";

export function LeavesPage() {
  const ws = useAurix();
  const currentRole = useCurrentRole();
  const isHrAdmin = currentRole === "hr_admin";
  const isManager = currentRole === "manager";
  const isSuperAdminRole = currentRole === "super_admin";

  // State to track whether super_admin is allowed by backend to review leaves
  const [superAdminReviewAllowed, setSuperAdminReviewAllowed] = useState(false);

  // Profile existence state (e.g. 404 Employee profile not found)
  const [noEmployeeProfile, setNoEmployeeProfile] = useState(false);

  // Tab routing: 'my-leaves' | 'approvals' | 'employee-balances'
  const [activeTab, setActiveTab] = useState<string>("my-leaves");

  // Balances & History of logged-in employee
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balancesError, setBalancesError] = useState(false);

  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);

  // Toast tracking refs to ensure toast fires once per error, not on every re-render/poll
  const hasShownBalanceToastRef = useRef(false);
  const hasShownHistoryToastRef = useRef(false);

  // Approvals queue
  const [approvals, setApprovals] = useState<LeaveRequest[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Dialog states
  const [applyOpen, setApplyOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<LeaveRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<LeaveRequest | null>(null);
  const [cancelTarget, setCancelTarget] = useState<LeaveRequest | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Check if super_admin has review permissions from backend
  useEffect(() => {
    if (!isSuperAdminRole) return;

    let isMounted = true;
    const checkSuperAdminPermissions = async () => {
      try {
        const res = await api.get<any>("/leaves/pending", {
          headers: { "x-skip-cache": "true" },
        });
        if (isMounted && res?.success !== false) {
          setSuperAdminReviewAllowed(true);
        }
      } catch {
        if (isMounted) {
          setSuperAdminReviewAllowed(false);
        }
      }
    };

    void checkSuperAdminPermissions();
    return () => {
      isMounted = false;
    };
  }, [isSuperAdminRole]);

  // Derive all role capabilities in a single capabilities object
  const capabilities = useMemo<LeaveCapabilities>(() => {
    const superAllowed =
      Boolean((ws.user as any)?.can_review_leaves) ||
      Boolean((ws.user as any)?.can_review) ||
      superAdminReviewAllowed;

    const canReview = isHrAdmin || isManager || (isSuperAdminRole && superAllowed);
    const canViewAllBalances = isHrAdmin;
    const canApply = !noEmployeeProfile && !isSuperAdminRole;

    return {
      canReview,
      canViewAllBalances,
      canApply,
    };
  }, [isHrAdmin, isManager, isSuperAdminRole, ws.user, superAdminReviewAllowed, noEmployeeProfile]);

  // Reset activeTab to "my-leaves" if the current tab is no longer allowed
  useEffect(() => {
    if (activeTab === "approvals" && !capabilities.canReview) {
      setActiveTab("my-leaves");
    } else if (activeTab === "employee-balances" && !capabilities.canViewAllBalances) {
      setActiveTab("my-leaves");
    }
  }, [activeTab, capabilities.canReview, capabilities.canViewAllBalances]);

  // Load balances of logged-in employee
  const loadBalances = useCallback(async () => {
    setBalancesLoading(true);
    setBalancesError(false);

    try {
      const res = await api.get<any>("/leaves/balances", {
        headers: { "x-skip-cache": "true" },
      });
      if (res?.success && res.data) {
        const data = Array.isArray(res.data) ? res.data : [];
        setBalances(data.map(mapBalance));
      } else if (Array.isArray(res)) {
        setBalances(res.map(mapBalance));
      } else {
        setBalances([]);
      }
    } catch (err: any) {
      console.error("Error loading leave balances", err);
      const isProfileNotFound =
        err?.status === 404 ||
        err?.data?.message?.toLowerCase?.()?.includes("employee profile not found") ||
        err?.message?.toLowerCase?.()?.includes("employee profile not found");

      if (isProfileNotFound) {
        setNoEmployeeProfile(true);
      } else {
        setBalancesError(true);
        if (!hasShownBalanceToastRef.current) {
          hasShownBalanceToastRef.current = true;
          toast.error(err?.data?.message || err?.message || "Failed to load leave balances.");
        }
      }
    } finally {
      setBalancesLoading(false);
    }
  }, []);

  // Load history of logged-in employee
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(false);

    try {
      const res = await api.get<any>("/leaves/history", {
        headers: { "x-skip-cache": "true" },
      });
      if (res?.success && res.data) {
        const data = Array.isArray(res.data) ? res.data : [];
        setHistory(data.map(mapLeave));
      } else if (Array.isArray(res)) {
        setHistory(res.map(mapLeave));
      } else {
        setHistory([]);
      }
    } catch (err: any) {
      console.error("Error loading leave history", err);
      const isProfileNotFound =
        err?.status === 404 ||
        err?.data?.message?.toLowerCase?.()?.includes("employee profile not found") ||
        err?.message?.toLowerCase?.()?.includes("employee profile not found");

      if (isProfileNotFound) {
        setNoEmployeeProfile(true);
      } else {
        setHistoryError(true);
        if (!hasShownHistoryToastRef.current) {
          hasShownHistoryToastRef.current = true;
          toast.error(err?.data?.message || err?.message || "Failed to load leave history.");
        }
      }
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Load pending approvals for reviewers
  const loadPendingApprovals = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await api.get<any>("/leaves/pending", {
        headers: { "x-skip-cache": "true" },
      });
      if (!res?.success && res?.success !== undefined) {
        throw new Error(res?.message || "Failed to load pending leave requests.");
      }

      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setApprovals(data.map(mapLeave));
    } catch (err: any) {
      console.error("Error loading pending leaves", err);
      toast.error(err?.data?.message || err?.message || "Failed to load pending leave requests.");
    } finally {
      setPendingLoading(false);
    }
  }, []);

  // Self-service data fetch on tab switch or mount
  useEffect(() => {
    if (activeTab === "my-leaves") {
      void loadBalances();
      void loadHistory();
    }
  }, [activeTab, loadBalances, loadHistory]);

  // Initial load for reviewers
  useEffect(() => {
    if (capabilities.canReview) {
      void loadPendingApprovals();
    }
  }, [capabilities.canReview, loadPendingApprovals]);

  // Review queue 30s self-scheduling polling with backoff & visibility pause
  usePoller(
    useCallback(async () => {
      await loadPendingApprovals();
    }, [loadPendingApprovals]),
    {
      intervalMs: 30_000,
      enabled: Boolean(capabilities.canReview && activeTab === "approvals"),
    },
  );

  // Approve action confirmed
  const handleApproveConfirm = async (id: string) => {
    if (actionLoadingId) return; // Prevent double-click
    setActionLoadingId(id);

    try {
      const res = await api.post<any>(`/leaves/${id}/review`, { status: "APPROVED" });
      if (res?.success !== false) {
        toast.success("Leave request approved.");
        // Optimistic removal from list only after success
        setApprovals((prev) => prev.filter((item) => item.id !== id));
        setApproveTarget(null);
      } else {
        throw new Error(res?.message || "Failed to approve leave request.");
      }
    } catch (err: any) {
      console.error("Error approving leave request", err);
      toast.error(err?.data?.message || err?.message || "Failed to approve leave request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject action confirmed
  const handleRejectConfirm = async (id: string, reason: string) => {
    if (actionLoadingId) return; // Prevent double-click
    setActionLoadingId(id);

    try {
      const res = await api.post<any>(`/leaves/${id}/review`, {
        status: "REJECTED",
        rejection_reason: reason,
      });
      if (res?.success !== false) {
        toast.success("Leave request rejected.");
        // Optimistic removal from list only after success
        setApprovals((prev) => prev.filter((item) => item.id !== id));
        setRejectTarget(null);
      } else {
        throw new Error(res?.message || "Failed to reject leave request.");
      }
    } catch (err: any) {
      console.error("Error rejecting leave request", err);
      toast.error(err?.data?.message || err?.message || "Failed to reject leave request.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Cancel action confirmed
  const handleCancelConfirm = async (id: string) => {
    if (cancellingId) return;
    setCancellingId(id);

    try {
      const res = await api.post<any>(`/leaves/${id}/cancel`);
      if (res?.success !== false) {
        toast.success("Leave request cancelled successfully.");
        setCancelTarget(null);
        void loadBalances();
        void loadHistory();
      } else {
        throw new Error(res?.message || "Failed to cancel leave request.");
      }
    } catch (err: any) {
      console.error("Error cancelling leave request", err);
      toast.error(err?.data?.message || err?.message || "Failed to cancel leave request.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      {/* Informational banner when employee profile is not found (Rule 10) */}
      {noEmployeeProfile && (
        <div className="mb-6 rounded-xl border border-border bg-muted p-4 text-foreground flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <h4 className="font-semibold text-sm text-foreground">Employee Profile Not Found</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your account does not have an active employee profile associated with it. Personal leave filing is unavailable.
            </p>
          </div>
        </div>
      )}

      {/* Top action bar: Apply for Leave uses default Button variant (Rule 1) */}
      {capabilities.canApply && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setApplyOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Apply for Leave
          </Button>
        </div>
      )}

      {/* Tab controls derived from unified capabilities object (Rule 12) */}
      {(capabilities.canReview || capabilities.canViewAllBalances) && (
        <div className="mb-6 flex border border-border bg-muted p-1 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab("my-leaves")}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
              activeTab === "my-leaves"
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            My Leaves
          </button>

          {capabilities.canReview && (
            <button
              onClick={() => setActiveTab("approvals")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === "approvals"
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Review Requests
              {approvals.length > 0 && (
                <Badge
                  variant="outline"
                  className={cn("ml-2 border", statusBadgeClass("pending"))}
                >
                  {approvals.length}
                </Badge>
              )}
            </button>
          )}

          {capabilities.canViewAllBalances && (
            <button
              onClick={() => setActiveTab("employee-balances")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === "employee-balances"
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Balances
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Tab 1: My Leaves (Personal balances & history) */}
        {activeTab === "my-leaves" && (
          <motion.div
            key="my-leaves"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <BalanceCards
              balances={balances}
              loading={balancesLoading}
              error={balancesError}
              onRetry={loadBalances}
            />

            <HistoryTable
              history={history}
              loading={historyLoading}
              error={historyError}
              onRetry={loadHistory}
              onCancelRequest={(leave) => setCancelTarget(leave)}
              cancellingId={cancellingId}
            />
          </motion.div>
        )}

        {/* Tab 2: Approvals (Review team requests) */}
        {activeTab === "approvals" && capabilities.canReview && (
          <motion.div
            key="approvals"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <ApprovalsList
              approvals={approvals}
              loading={pendingLoading}
              onRefresh={loadPendingApprovals}
              onApproveClick={(leave) => setApproveTarget(leave)}
              onRejectClick={(leave) => setRejectTarget(leave)}
              actionLoadingId={actionLoadingId}
            />
          </motion.div>
        )}

        {/* Tab 3: Organizational Employee Balances (HR Admin only) */}
        {activeTab === "employee-balances" && capabilities.canViewAllBalances && (
          <motion.div
            key="employee-balances"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <AllBalancesPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apply Leave Modal */}
      <ApplyLeaveDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        balances={balances}
        isHrAdmin={isHrAdmin}
        onSuccess={() => {
          void loadBalances();
          void loadHistory();
        }}
      />

      {/* Approve Confirm Dialog (Rule 1 & 2) */}
      <ApproveDialog
        open={Boolean(approveTarget)}
        onOpenChange={(open) => {
          if (!open) setApproveTarget(null);
        }}
        targetLeave={approveTarget}
        onConfirm={handleApproveConfirm}
        loading={Boolean(actionLoadingId)}
      />

      {/* Reject Reason Dialog (Rule 6) */}
      <RejectDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open) setRejectTarget(null);
        }}
        targetLeave={rejectTarget}
        onConfirm={handleRejectConfirm}
        loading={Boolean(actionLoadingId)}
      />

      {/* Cancel Leave Confirm Dialog (Rule 6) */}
      <CancelLeaveDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        targetLeave={cancelTarget}
        onConfirm={handleCancelConfirm}
        loading={Boolean(cancellingId)}
      />
    </>
  );
}

export default LeavesPage;
