import type { ExitCase } from "./types";

export function filterExitsForEmployee(
  exits: ExitCase[],
  employeeName?: string | null,
  employeeId?: string | null,
): ExitCase[] {
  const normalizedName = String(employeeName || "").trim().toLowerCase();
  const normalizedId = String(employeeId || "").trim().toLowerCase();
  if (!normalizedName && !normalizedId) return [];

  return exits.filter((item) => {
    const itemName = String(item.employee || "").trim().toLowerCase();
    const itemEmpId = String(item.employeeId || "").trim().toLowerCase();
    return (
      (normalizedName && itemName === normalizedName) ||
      (normalizedId && itemEmpId !== "" && itemEmpId === normalizedId)
    );
  });
}

export function calculateExitClearanceSummary(exitCase: ExitCase | null | undefined): {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
} {
  if (!exitCase) {
    return { completedSteps: 0, totalSteps: 0, percentage: 0 };
  }

  const assetItems = Array.isArray(exitCase.assetsToReturn) ? exitCase.assetsToReturn : [];
  const deptItems = Array.isArray(exitCase.clearances) ? exitCase.clearances : [];

  const assetTotal = assetItems.length;
  const assetDone = assetItems.filter((a) => a.status === "Returned").length;

  const deptTotal = deptItems.length;
  const deptDone = deptItems.filter((d) => d.status === "Cleared").length;

  const totalSteps = assetTotal + deptTotal;
  const completedSteps = assetDone + deptDone;
  const percentage = totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100);

  return { completedSteps, totalSteps, percentage };
}

export function computeLastWorkingDay(resignDate: string, noticeDays: number): string {
  const base = new Date(resignDate);
  if (Number.isNaN(base.getTime())) {
    return new Date(Date.now() + noticeDays * 86400000).toISOString().slice(0, 10);
  }
  base.setDate(base.getDate() + Math.max(0, Number(noticeDays) || 0));
  return base.toISOString().slice(0, 10);
}
