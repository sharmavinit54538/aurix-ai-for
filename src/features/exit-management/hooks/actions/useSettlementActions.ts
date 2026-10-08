import { newId } from "@/lib/hrms/types";
import { toast } from "sonner";
import type {
  ExitCase,
  ExitSettlementDetails,
  ExitInterviewDetails,
} from "../../types";
import { getExitDocumentPreviewText } from "../../utils/documentTemplates";
import type { useExitModalForms } from "../useExitModalForms";

interface UseSettlementActionsProps {
  saveExit: (caseData: ExitCase) => Promise<void> | void;
  forms: ReturnType<typeof useExitModalForms>;
  authWs: {
    user?: { fullName?: string };
  };
}

export function useSettlementActions({ saveExit, forms, authWs }: UseSettlementActionsProps) {
  const {
    detailCase,
    setDetailCase,
    setDeactivateOpen,
    setPreviewDocText,
    targetCase,
    setTargetCase,
    settleSalary,
    settleLeave,
    settleBonus,
    settleIncentive,
    settleDeduction,
    settleRecovery,
    intRating,
    intReason,
    intMgrFeedback,
    intCompFeedback,
    intSuggestions,
  } = forms;

  // 7. Settlement Calculations Upsert
  const handleUpdateSettlement = (exit: ExitCase) => {
    const salaryVal = parseFloat(settleSalary) || 0;
    const leaveVal = parseFloat(settleLeave) || 0;
    const bonusVal = parseFloat(settleBonus) || 0;
    const incentiveVal = parseFloat(settleIncentive) || 0;
    const deductionVal = parseFloat(settleDeduction) || 0;
    const recoveryVal = parseFloat(settleRecovery) || 0;

    const total = salaryVal + leaveVal + bonusVal + incentiveVal - deductionVal - recoveryVal;

    const settlement: ExitSettlementDetails = {
      pendingSalary: salaryVal,
      leaveEncashment: leaveVal,
      bonus: bonusVal,
      incentives: incentiveVal,
      deductions: deductionVal,
      assetRecovery: recoveryVal,
      totalAmount: total,
      status: "approved",
    };

    const updatedChecklist = exit.checklist.map((c) => {
      if (c.key === "finance") return { ...c, done: true, doneAt: new Date().toISOString() };
      return c;
    });

    const updated: ExitCase = {
      ...exit,
      settlementDetails: settlement,
      checklist: updatedChecklist,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Settlement Completed",
          performedBy: authWs.user?.fullName || "Finance Ops",
          timestamp: new Date().toISOString(),
          notes: `Settlement values audited: total $${total} calculated.`,
        },
      ],
    };

    saveExit(updated);
    toast.success("Final settlement calculations saved.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 8. Pay Final Settlement
  const handlePaySettlement = (exit: ExitCase) => {
    if (!exit.settlementDetails) return;

    const updatedSettlement: ExitSettlementDetails = {
      ...exit.settlementDetails,
      status: "paid",
    };

    const updated: ExitCase = {
      ...exit,
      settlementDetails: updatedSettlement,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Settlement Completed",
          performedBy: authWs.user?.fullName || "Finance Partner",
          timestamp: new Date().toISOString(),
          notes: "Wire transfer processed. Final dues paid.",
        },
      ],
    };

    saveExit(updated);
    toast.success("Final settlement paid out to employee's bank account.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 9. Generate Document
  const handleGenerateDoc = (exit: ExitCase, docName: string) => {
    const updatedDocs = exit.documents.map((d) => {
      if (d.name === docName) return { ...d, issued: true };
      return d;
    });

    const updated: ExitCase = {
      ...exit,
      documents: updatedDocs,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Documents Generated",
          performedBy: authWs.user?.fullName || "HR Partner",
          timestamp: new Date().toISOString(),
          notes: `Generated document: ${docName}`,
        },
      ],
    };

    saveExit(updated);
    toast.success(`Generated official document: ${docName}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  const handlePreviewLetter = (exit: ExitCase, docName: string) => {
    const text = getExitDocumentPreviewText(exit, docName);
    setPreviewDocText(text);
  };

  // 10. Deactivate Employee on Exit Completion
  const handleDeactivatePrompt = (exit: ExitCase) => {
    setTargetCase(exit);
    setDeactivateOpen(true);
  };

  const handleDeactivateConfirm = () => {
    if (!targetCase) return;

    const updated: ExitCase = {
      ...targetCase,
      stage: "completed",
      remainingDays: 0,
      timeline: [
        ...(targetCase.timeline || []),
        {
          id: newId("tl"),
          event: "Employee Deactivated",
          performedBy: authWs.user?.fullName || "HR Admin",
          timestamp: new Date().toISOString(),
          notes: "Revoked SSO login, de-activated credentials, archived profile.",
        },
      ],
    };

    saveExit(updated);
    toast.success("Employee de-activated. Login credentials revoked and profile archived.");
    setDeactivateOpen(false);
    setTargetCase(null);
    if (detailCase?.id === targetCase.id) setDetailCase(updated);
  };

  // 11. Exit Interview
  const handleSaveInterview = (exit: ExitCase) => {
    const interview: ExitInterviewDetails = {
      reason: intReason || exit.reason,
      rating: intRating,
      managerFeedback: intMgrFeedback,
      companyFeedback: intCompFeedback,
      suggestions: intSuggestions,
    };

    const updated: ExitCase = {
      ...exit,
      interviewDetails: interview,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Notice Started",
          performedBy: authWs.user?.fullName || "HR Partner",
          timestamp: new Date().toISOString(),
          notes: "Recorded exit interview questionnaire responses.",
        },
      ],
    };

    saveExit(updated);
    toast.success("Exit interview answers saved.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  return {
    handleUpdateSettlement,
    handlePaySettlement,
    handleGenerateDoc,
    handlePreviewLetter,
    handleDeactivatePrompt,
    handleDeactivateConfirm,
    handleSaveInterview,
  };
}
