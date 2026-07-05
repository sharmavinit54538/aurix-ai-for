// ─── Performance Types ────────────────────────────────────────────────────────

export type ReviewStatus = "draft" | "in_review" | "approved" | "completed";
export type PromotionStatus = "not_recommended" | "eligible" | "recommended" | "promoted";
export type GoalStatus = "not_started" | "in_progress" | "completed" | "delayed";
export type GoalPriority = "low" | "medium" | "high";
export type FeedbackRole = "manager" | "hr" | "peer" | "self";
export type TrainingStatus = "assigned" | "pending" | "completed";
export type AwardType = "employee_of_month" | "award" | "achievement" | "certificate";

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeIdCode: string; // e.g. EMP-1001 or AUR-1042
  department: string;
  designation: string;
  managerName: string;
  
  // Rating Scores (1–5)
  overallRating: number;
  kpiScore: number; // 0 - 100
  productivity: number;
  attendance: number;
  communication: number;
  leadership: number;
  teamwork: number;
  innovation: number;
  problemSolving: number;
  technicalSkills: number;
  discipline: number;

  // OKR / Goal items
  goalProgress: number; // Goal Completion % (0 - 100)
  achievements: string;
  challenges: string;
  feedback: string;
  managerComments: string;

  // Promotion suggestions
  promotionEligible: boolean;
  promotionStatus: PromotionStatus;
  salaryIncrement: number; // Percentage, e.g. 10 for 10%
  bonusRecommendation: number; // Percentage

  // Audit Trails
  reviewStatus: ReviewStatus;
  reviewDate: string;
  lastReview: string;
  nextReview: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  progress: number; // 0 - 100
  status: GoalStatus;
  priority: GoalPriority;
  dueDate: string;
  createdAt: string;
}

export interface Feedback360 {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewerName: string;
  role: FeedbackRole;
  rating: number; // 1-5
  feedbackText: string;
  timestamp: string;
}

export interface Reward {
  id: string;
  employeeId: string;
  awardName: string;
  type: AwardType;
  value: string; // cash bonus or citation details
  date: string;
}

export interface TrainingCourse {
  id: string;
  employeeId: string;
  courseName: string;
  status: TrainingStatus;
  assignedDate: string;
  completionDate?: string;
}

export interface PerformanceFilters {
  department: string;
  manager: string;
  rating: string; // 'all' | 'excellent' | 'good' | 'average' | 'needs_improvement' | 'poor'
  reviewStatus: string;
  promotionEligible: string; // 'all' | 'true' | 'false'
  scoreMin: string;
  scoreMax: string;
  reviewDateFrom: string;
  reviewDateTo: string;
}

export type SortField = "employeeName" | "employeeIdCode" | "department" | "overallRating" | "goalProgress" | "kpiScore" | "reviewStatus" | "lastReview";
export type SortDir = "asc" | "desc";

export interface ImportReviewRow {
  employeeIdCode: string;
  employeeName: string;
  department: string;
  designation: string;
  managerName: string;
  overallRating: string;
  kpiScore?: string;
  goalProgress?: string;
  reviewStatus?: string;
  reviewDate?: string;
}
