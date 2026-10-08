import React from "react";
import { newId } from "@/lib/hrms/types";
import { toast } from "sonner";
import type { ExitCase, ExitTimelineEvent } from "../../types";
import type { useExitModalForms } from "../useExitModalForms";

interface UseResignationActionsProps {
  saveExit: (caseData: ExitCase) => Promise<void> | void;
  allAssets: any[];
  forms: ReturnType<typeof useExitModalForms>;
  authWs: {
    user?: { fullName?: string };
    employees: Array<{
      id: string;
      fullName: string;
      employeeId: string;
      department?: string;
      designation?: string;
      joiningDate?: string;
      managerName?: string;
    }>;
  };
}

export function useResignationActions({
  saveExit,
  allAssets,
  forms,
  authWs,
}: UseResignationActionsProps) {
  const {
    detailCase,
    setDetailCase,
    setCreateOpen,
    setRejectOpen,
    targetCase,
    setTargetCase,
    rejectionReason,
    setRejectionReason,
    empName,
    noticeDays,
    resignDate,
    resignReason,
    setResignReason,
  } = forms;

  // 1. Create Resignation Case
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) {
      toast.error("Please select an employee.");
      return;
    }

    const selectedEmp = authWs.employees.find((x) => x.fullName === empName) || {
      id: newId("emp"),
      fullName: empName,
      employeeId: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      department: "Platform Operations",
      designation: "Associate Member",
      joiningDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      managerName: "",
    };

    const lwd = new Date(new Date(resignDate).getTime() + noticeDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const newCaseId = newId("ex");
    const newCase: ExitCase = {
      id: newCaseId,
      employee: selectedEmp.fullName,
      role: selectedEmp.designation || "Associate Member",
      resignedAt: resignDate,
      noticeDays: noticeDays,
      lastWorkingDay: lwd,
      reason: resignReason,
      stage: "requested",
      checklist: [
        { key: "assets", label: "Asset return checklist", done: false },
        { key: "kt", label: "Knowledge transfer", done: false },
        { key: "manager", label: "Manager approval", done: false },
        { key: "hr", label: "HR approval", done: false },
        { key: "it", label: "IT clearance", done: false },
        { key: "finance", label: "Finance clearance", done: false },
      ],
      documents: [
        { name: "Experience Letter", issued: false },
        { name: "Relieving Letter", issued: false },
        { name: "Final Settlement Letter", issued: false },
        { name: "No Dues Certificate", issued: false },
      ],
      employeeId: selectedEmp.employeeId,
      department: selectedEmp.department,
      designation: selectedEmp.designation,
      joiningDate: selectedEmp.joiningDate,
      managerName: selectedEmp.managerName || "",
      remainingDays: noticeDays,
      managerApprovalStatus: "pending",
      hrApprovalStatus: "pending",
      assignedAssets: allAssets
        .filter(
          (a) =>
            (a.assignedTo && a.assignedTo.toLowerCase() === selectedEmp.fullName.toLowerCase()) ||
            (a.employeeId && a.employeeId === selectedEmp.employeeId) ||
            (a.employee_id && a.employee_id === selectedEmp.id),
        )
        .map((a) => ({
          id: newId("ret"),
          assetId: String(a.id || a.asset_id || a.tag),
          assetName: a.name || a.asset_name || "Assigned Equipment",
          category: (a.category || "laptop") as any,
          serial: a.serial || a.tag || a.serial_number || "N/A",
          status: "pending" as const,
        })),
      clearanceWorkflow: [
        { department: "HR", status: "pending" },
        { department: "IT", status: "pending" },
        { department: "Finance", status: "pending" },
        { department: "Admin", status: "pending" },
        { department: "Manager", status: "pending" },
      ],
      settlementDetails: {
        pendingSalary: 35000,
        leaveEncashment: 8000,
        bonus: 0,
        incentives: 0,
        deductions: 0,
        assetRecovery: 0,
        totalAmount: 43000,
        status: "pending",
      },
      timeline: [
        {
          id: newId("tl"),
          event: "Exit Requested",
          performedBy: selectedEmp.fullName,
          timestamp: new Date().toISOString(),
          notes: "Submitted resignation request.",
        },
      ],
    };

    saveExit(newCase);
    toast.success("Exit Request created successfully. Sent to Manager for approval.");
    setCreateOpen(false);
    setResignReason("");
  };

  // 2. Approve Resignation Request (Manager or HR)
  const handleApproval = (exit: ExitCase, stageType: "manager" | "hr") => {
    const updated: ExitCase = { ...exit };
    const author = authWs.user?.fullName || "HR Admin";

    if (stageType === "manager") {
      updated.managerApprovalStatus = "approved";
      updated.managerComments = "KT plan discussed. Transition approved.";
    } else {
      updated.hrApprovalStatus = "approved";
      updated.hrComments = "Notice period parameters approved.";
    }

    if (
      (updated.managerApprovalStatus === "approved" || updated.managerComments) &&
      (updated.hrApprovalStatus === "approved" || updated.hrComments)
    ) {
      updated.stage = "notice";
    } else {
      updated.stage = "under-review";
    }

    const newTimeline: ExitTimelineEvent = {
      id: newId("tl"),
      event: stageType === "manager" ? "Manager Approved" : "HR Approved",
      performedBy: author,
      timestamp: new Date().toISOString(),
      notes:
        stageType === "manager"
          ? "Manager signed off resignation approval."
          : "HR approved compliance check.",
    };

    updated.timeline = [...(updated.timeline || []), newTimeline];

    updated.checklist = updated.checklist.map((chk) => {
      if (chk.key === stageType) return { ...chk, done: true, doneAt: new Date().toISOString() };
      return chk;
    });

    updated.clearanceWorkflow = updated.clearanceWorkflow?.map((c) => {
      if (c.department.toLowerCase() === stageType) {
        return {
          ...c,
          status: "approved",
          approvedBy: author,
          approvedAt: new Date().toISOString(),
          comments: "Approved resignation.",
        };
      }
      return c;
    });

    saveExit(updated);
    toast.success(`Approved exit request for: ${exit.employee}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 3. Reject Resignation Request
  const handleRejectPrompt = (exit: ExitCase) => {
    setTargetCase(exit);
    setRejectionReason("");
    setRejectOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!targetCase || !rejectionReason.trim()) {
      toast.error("Please supply a rejection reason.");
      return;
    }

    const author = authWs.user?.fullName || "HR Admin";
    const updated: ExitCase = {
      ...targetCase,
      stage: "cancelled",
      rejectionReason: rejectionReason,
      managerApprovalStatus: "rejected",
      hrApprovalStatus: "rejected",
      timeline: [
        ...(targetCase.timeline || []),
        {
          id: newId("tl"),
          event: "Rejected",
          performedBy: author,
          timestamp: new Date().toISOString(),
          notes: `Resignation request cancelled: ${rejectionReason}`,
        },
      ],
    };

    saveExit(updated);
    toast.error(`Resignation request rejected for ${targetCase.employee}`);
    setRejectOpen(false);
    setTargetCase(null);
    if (detailCase?.id === targetCase.id) setDetailCase(updated);
  };

  // 4. Start Clearance Stage
  const handleStartClearance = (exit: ExitCase) => {
    const updated: ExitCase = {
      ...exit,
      stage: "clearance",
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Notice Started",
          performedBy: authWs.user?.fullName || "HR Admin",
          timestamp: new Date().toISOString(),
          notes: "Initiated department clearances checklist.",
        },
      ],
    };
    saveExit(updated);
    toast.info("Clearance process started.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  return {
    handleCreateSubmit,
    handleApproval,
    handleRejectPrompt,
    handleRejectSubmit,
    handleStartClearance,
  };
}
