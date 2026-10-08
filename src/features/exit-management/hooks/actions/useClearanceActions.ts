import { newId } from "@/lib/hrms/types";
import { toast } from "sonner";
import type { ExitCase } from "../../types";
import type { useExitModalForms } from "../useExitModalForms";

import type { Workspace } from "@/lib/aurix-store";

interface UseClearanceActionsProps {
  saveExit: (caseData: ExitCase) => Promise<void> | void;
  forms: ReturnType<typeof useExitModalForms>;
  authWs: Workspace;
}

export function useClearanceActions({ saveExit, forms, authWs }: UseClearanceActionsProps) {
  const { detailCase, setDetailCase } = forms;

  // 5. Asset Clearances
  const handleAssetReturnStatus = (
    exit: ExitCase,
    recordId: string,
    status: "returned" | "damaged" | "missing",
    remarks: string,
  ) => {
    const assetsCopy = exit.assignedAssets || [];
    const updatedAssets = assetsCopy.map((ast) => {
      if (ast.id === recordId) {
        return {
          ...ast,
          status,
          remarks,
          returnDate: status === "returned" ? new Date().toISOString().split("T")[0] : undefined,
        };
      }
      return ast;
    });

    const allReturned = updatedAssets.every((a) => a.status === "returned");

    let updatedChecklist = exit.checklist.map((c) => {
      if (c.key === "assets")
        return {
          ...c,
          done: allReturned,
          doneAt: allReturned ? new Date().toISOString() : undefined,
        };
      return c;
    });

    let updatedTimeline = exit.timeline || [];
    if (allReturned && !exit.checklist.find((c) => c.key === "assets")?.done) {
      updatedTimeline = [
        ...updatedTimeline,
        {
          id: newId("tl"),
          event: "Asset Returned",
          performedBy: authWs.user?.fullName || "IT Admin",
          timestamp: new Date().toISOString(),
          notes: "All 3 assigned hardware devices returned to vault.",
        },
      ];
    }

    let updatedClearance = exit.clearanceWorkflow || [];
    if (allReturned) {
      updatedClearance = updatedClearance.map((c) => {
        if (c.department === "IT") {
          return {
            ...c,
            status: "approved" as const,
            approvedBy: "IT Support",
            approvedAt: new Date().toISOString(),
            comments: "Assets returned clean.",
          };
        }
        return c;
      });
      updatedChecklist = updatedChecklist.map((chk) => {
        if (chk.key === "it") return { ...chk, done: true, doneAt: new Date().toISOString() };
        return chk;
      });
    }

    const updated: ExitCase = {
      ...exit,
      assignedAssets: updatedAssets,
      checklist: updatedChecklist,
      clearanceWorkflow: updatedClearance,
      timeline: updatedTimeline,
    };

    saveExit(updated);
    toast.success(`Asset status updated: ${status}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 6. Department Clearance Action
  const handleDeptClearanceStatus = (
    exit: ExitCase,
    dept: "HR" | "IT" | "Finance" | "Admin" | "Manager",
    status: "approved" | "rejected",
    comments: string,
  ) => {
    const clearanceCopy = exit.clearanceWorkflow || [];
    const updatedClearance = clearanceCopy.map((c) => {
      if (c.department === dept) {
        return {
          ...c,
          status,
          approvedBy: authWs.user?.fullName || "HR Admin",
          approvedAt: new Date().toISOString(),
          comments,
        };
      }
      return c;
    });

    const chkKey = dept.toLowerCase() as any;
    const updatedChecklist = exit.checklist.map((c) => {
      if (c.key === chkKey)
        return {
          ...c,
          done: status === "approved",
          doneAt: status === "approved" ? new Date().toISOString() : undefined,
        };
      return c;
    });

    const allApproved = updatedClearance.every((c) => c.status === "approved");
    let updatedTimeline = exit.timeline || [];
    let nextStage = exit.stage;

    if (allApproved && exit.stage === "clearance") {
      nextStage = "settlement";
      updatedTimeline = [
        ...updatedTimeline,
        {
          id: newId("tl"),
          event: "Clearance Completed",
          performedBy: authWs.user?.fullName || "HR Admin",
          timestamp: new Date().toISOString(),
          notes: "All 5 departments signed off clearance certifications.",
        },
      ];
    }

    const updated: ExitCase = {
      ...exit,
      stage: nextStage,
      clearanceWorkflow: updatedClearance,
      checklist: updatedChecklist,
      timeline: updatedTimeline,
    };

    saveExit(updated);
    toast.success(`${dept} Clearance status set to: ${status}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  return {
    handleAssetReturnStatus,
    handleDeptClearanceStatus,
  };
}
