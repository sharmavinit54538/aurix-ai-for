import type {
  Feedback360,
  Goal,
  PerformanceReview,
  Reward,
  TrainingCourse,
} from "./types";

export type {
  Feedback360,
  Goal,
  PerformanceReview,
  Reward,
  TrainingCourse,
} from "./types";

export interface PerformanceState {
  reviews: PerformanceReview[];
  goals: Goal[];
  feedback360: Feedback360[];
  rewards: Reward[];
  courses: TrainingCourse[];
  loading: boolean;
  error: string | null;
}

export type PerformanceData = Pick<
  PerformanceState,
  "reviews" | "goals" | "feedback360" | "rewards" | "courses"
>;
