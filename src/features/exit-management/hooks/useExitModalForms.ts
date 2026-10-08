import { useState } from "react";
import type { ExitCase } from "../types";

export function useExitModalForms() {
  // Modals & Panels
  const [detailCase, setDetailCase] = useState<ExitCase | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [previewDocText, setPreviewDocText] = useState<string | null>(null);

  // Targets
  const [targetCase, setTargetCase] = useState<ExitCase | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Create Request Form State
  const [empName, setEmpName] = useState("");
  const [noticeDays, setNoticeDays] = useState(30);
  const [resignDate, setResignDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [resignReason, setResignReason] = useState("");

  // Settlement Form Editing State
  const [settleSalary, setSettleSalary] = useState("0");
  const [settleLeave, setSettleLeave] = useState("0");
  const [settleBonus, setSettleBonus] = useState("0");
  const [settleIncentive, setSettleIncentive] = useState("0");
  const [settleDeduction, setSettleDeduction] = useState("0");
  const [settleRecovery, setSettleRecovery] = useState("0");

  // Interview Form State
  const [intRating, setIntRating] = useState(4);
  const [intReason, setIntReason] = useState("");
  const [intMgrFeedback, setIntMgrFeedback] = useState("");
  const [intCompFeedback, setIntCompFeedback] = useState("");
  const [intSuggestions, setIntSuggestions] = useState("");

  const openDetailCase = (exit: ExitCase) => {
    setDetailCase(exit);
    setSettleSalary(exit.settlementDetails?.pendingSalary?.toString() || "35000");
    setSettleLeave(exit.settlementDetails?.leaveEncashment?.toString() || "8000");
    setSettleBonus(exit.settlementDetails?.bonus?.toString() || "0");
    setSettleIncentive(exit.settlementDetails?.incentives?.toString() || "0");
    setSettleDeduction(exit.settlementDetails?.deductions?.toString() || "0");
    setSettleRecovery(exit.settlementDetails?.assetRecovery?.toString() || "0");

    setIntRating(exit.interviewDetails?.rating || 4);
    setIntReason(exit.interviewDetails?.reason || exit.reason || "");
    setIntMgrFeedback(exit.interviewDetails?.managerFeedback || "");
    setIntCompFeedback(exit.interviewDetails?.companyFeedback || "");
    setIntSuggestions(exit.interviewDetails?.suggestions || "");
  };

  return {
    detailCase,
    setDetailCase,
    createOpen,
    setCreateOpen,
    rejectOpen,
    setRejectOpen,
    deactivateOpen,
    setDeactivateOpen,
    previewDocText,
    setPreviewDocText,
    targetCase,
    setTargetCase,
    rejectionReason,
    setRejectionReason,
    empName,
    setEmpName,
    noticeDays,
    setNoticeDays,
    resignDate,
    setResignDate,
    resignReason,
    setResignReason,
    settleSalary,
    setSettleSalary,
    settleLeave,
    setSettleLeave,
    settleBonus,
    setSettleBonus,
    settleIncentive,
    setSettleIncentive,
    settleDeduction,
    setSettleDeduction,
    settleRecovery,
    setSettleRecovery,
    intRating,
    setIntRating,
    intReason,
    setIntReason,
    intMgrFeedback,
    setIntMgrFeedback,
    intCompFeedback,
    setIntCompFeedback,
    intSuggestions,
    setIntSuggestions,
    openDetailCase,
  };
}
