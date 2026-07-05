import type { PerformanceReview, PerformanceFilters, SortField, SortDir } from "../types";

// ─── Validators ───────────────────────────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validatePerformanceReviewForm(
  draft: Partial<PerformanceReview>,
  existingReviews: PerformanceReview[],
  isEdit: boolean
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!draft.employeeId) errors.employeeId = "Employee selection is required";
  if (!draft.managerName?.trim()) errors.managerName = "Manager name is required";
  
  if (draft.overallRating === undefined || draft.overallRating < 1 || draft.overallRating > 5) {
    errors.overallRating = "Overall rating must be between 1 and 5";
  }

  if (draft.kpiScore === undefined || draft.kpiScore < 0 || draft.kpiScore > 100) {
    errors.kpiScore = "KPI score must be between 0 and 100";
  }

  if (draft.goalProgress === undefined || draft.goalProgress < 0 || draft.goalProgress > 100) {
    errors.goalProgress = "Goal progress percentage must be between 0 and 100";
  }

  if (!draft.reviewDate) {
    errors.reviewDate = "Review date is required";
  } else {
    const rDate = new Date(draft.reviewDate);
    const today = new Date("2026-06-26"); // Static current date to avoid hydration issues
    if (rDate > today) {
      errors.reviewDate = "Future review dates are not allowed";
    }
  }

  // Duplicate checks (same employee and same review date)
  if (draft.employeeId && draft.reviewDate) {
    const dup = existingReviews.find(
      (r) =>
        r.employeeId === draft.employeeId &&
        r.reviewDate === draft.reviewDate &&
        (!isEdit || r.id !== draft.id)
    );
    if (dup) {
      errors.reviewDate = "A review for this employee on this date already exists";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Filtering & Sorting ──────────────────────────────────────────────────────
export function applyFilters(
  reviews: PerformanceReview[],
  query: string,
  filters: PerformanceFilters
): PerformanceReview[] {
  const q = query.toLowerCase().trim();

  return reviews.filter((r) => {
    // Search
    if (q) {
      const match =
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeIdCode.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.managerName.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Department filter
    if (filters.department !== "all" && r.department !== filters.department) return false;

    // Manager filter
    if (filters.manager !== "all" && r.managerName !== filters.manager) return false;

    // Review Status filter
    if (filters.reviewStatus !== "all" && r.reviewStatus !== filters.reviewStatus) return false;

    // Promotion Eligible filter
    if (filters.promotionEligible !== "all") {
      const eligible = filters.promotionEligible === "true";
      if (r.promotionEligible !== eligible) return false;
    }

    // Rating category check
    if (filters.rating !== "all") {
      const rating = r.overallRating;
      if (filters.rating === "excellent" && rating !== 5) return false;
      if (filters.rating === "good" && rating !== 4) return false;
      if (filters.rating === "average" && rating !== 3) return false;
      if (filters.rating === "needs_improvement" && rating !== 2) return false;
      if (filters.rating === "poor" && rating !== 1) return false;
    }

    // Score Range
    if (filters.scoreMin) {
      const val = parseFloat(filters.scoreMin);
      if (r.overallRating < val) return false;
    }
    if (filters.scoreMax) {
      const val = parseFloat(filters.scoreMax);
      if (r.overallRating > val) return false;
    }

    // Review Date Range
    if (filters.reviewDateFrom && r.reviewDate < filters.reviewDateFrom) return false;
    if (filters.reviewDateTo && r.reviewDate > filters.reviewDateTo) return false;

    return true;
  });
}

export function applySorting(
  reviews: PerformanceReview[],
  field: SortField,
  dir: SortDir
): PerformanceReview[] {
  return [...reviews].sort((a, b) => {
    let va: string | number;
    let vb: string | number;

    switch (field) {
      case "employeeName": va = a.employeeName; vb = b.employeeName; break;
      case "employeeIdCode": va = a.employeeIdCode; vb = b.employeeIdCode; break;
      case "department": va = a.department; vb = b.department; break;
      case "overallRating": va = a.overallRating; vb = b.overallRating; break;
      case "goalProgress": va = a.goalProgress; vb = b.goalProgress; break;
      case "kpiScore": va = a.kpiScore; vb = b.kpiScore; break;
      case "reviewStatus": va = a.reviewStatus; vb = b.reviewStatus; break;
      case "lastReview": va = a.lastReview; vb = b.lastReview; break;
      default: va = a.employeeName; vb = b.employeeName;
    }

    if (typeof va === "number" && typeof vb === "number") {
      return dir === "asc" ? va - vb : vb - va;
    }
    const cmp = String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

// ─── CSV Builder ──────────────────────────────────────────────────────────────
export function buildCSV(reviews: PerformanceReview[]): string {
  const headers = [
    "Employee Name", "Employee ID", "Department", "Designation", "Manager",
    "Overall Rating", "KPI Score", "Goal Completion %", "Status",
    "Review Date", "Last Review", "Promotion Status", "Increment %",
  ];
  const rows = reviews.map((r) =>
    [
      r.employeeName, r.employeeIdCode, r.department, r.designation, r.managerName,
      r.overallRating, r.kpiScore, r.goalProgress, r.reviewStatus,
      r.reviewDate, r.lastReview, r.promotionStatus, r.salaryIncrement,
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// ─── Display Helpers ──────────────────────────────────────────────────────────
export function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("T")[0].split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}
