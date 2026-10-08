import { newId } from "@/lib/hrms/types";
import type { ExitCase } from "../types";

interface CreateExitCaseParams {
  selectedEmp: {
    id: string;
    fullName: string;
    employeeId: string;
    department?: string;
    designation?: string;
    joiningDate?: string;
    managerName?: string;
  };
  resignDate: string;
  noticeDays: number;
  resignReason: string;
  allAssets: any[];
}

export function createNewExitCase({
  selectedEmp,
  resignDate,
  noticeDays,
  resignReason,
  allAssets,
}: CreateExitCaseParams): ExitCase {
  const lwd = new Date(new Date(resignDate).getTime() + noticeDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const newCaseId = newId("ex");

  return {
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
}
