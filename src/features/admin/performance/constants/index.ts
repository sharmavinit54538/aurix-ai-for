import type {
  PerformanceReview,
  Goal,
  Feedback360,
  Reward,
  TrainingCourse,
  PerformanceFilters,
} from "../types";

export const REVIEW_STATUS_OPTIONS = [
  { value: "draft", label: "Draft", color: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
  { value: "in_review", label: "In Review", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { value: "approved", label: "Approved", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { value: "completed", label: "Completed", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
];

export const RATING_BADGES: Record<number, { label: string; color: string }> = {
  5: { label: "Excellent", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  4: { label: "Good", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  3: { label: "Average", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  2: { label: "Needs Improvement", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  1: { label: "Poor", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
};

export const PROMOTION_STATUS_OPTIONS = [
  { value: "not_recommended", label: "Not Recommended" },
  { value: "eligible", label: "Eligible" },
  { value: "recommended", label: "Recommended" },
  { value: "promoted", label: "Promoted" },
];

export const GOAL_STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started", color: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
  { value: "in_progress", label: "In Progress", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { value: "completed", label: "Completed", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { value: "delayed", label: "Delayed", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
];

export const GOAL_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const DEFAULT_FILTERS: PerformanceFilters = {
  department: "all",
  manager: "all",
  rating: "all",
  reviewStatus: "all",
  promotionEligible: "all",
  scoreMin: "",
  scoreMax: "",
  reviewDateFrom: "",
  reviewDateTo: "",
};

// Seed Data
export const SEED_REVIEWS: PerformanceReview[] = [];
export const SEED_GOALS: Goal[] = [];
export const SEED_FEEDBACK: Feedback360[] = [];
export const SEED_REWARDS: Reward[] = [];
export const SEED_COURSES: TrainingCourse[] = [];
