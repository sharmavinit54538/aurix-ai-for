import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import type { Goal, PerformanceReview } from "../types";
import {
  addFeedback,
  addReward,
  assignGoal,
  assignTraining,
  bulkDeleteReviews,
  bulkSetReviewStatus,
  completeGoal,
  createGoal,
  createReview,
  deleteGoal,
  deleteReview,
  fetchPerformance,
  importReviews,
  updateGoal,
  updateReview,
  updateTrainingStatus,
} from "../performanceThunk";
import type { Feedback360, Reward, TrainingCourse } from "../types";

export function usePerformance() {
  const dispatch = useAppDispatch();
  const { reviews, goals, feedback360, rewards, courses, loading, error } = useAppSelector(
    (state) => state.performance,
  );

  useEffect(() => {
    dispatch(fetchPerformance());
  }, [dispatch]);

  return {
    reviews,
    goals,
    feedback360,
    rewards,
    courses,
    loading,
    error,

    createReview: (review: PerformanceReview) => dispatch(createReview(review)),
    updateReview: (review: PerformanceReview) => dispatch(updateReview(review)),
    deleteReview: (id: string) => dispatch(deleteReview(id)),
    bulkDeleteReviews: (ids: string[]) => dispatch(bulkDeleteReviews(ids)),
    bulkSetReviewStatus: (ids: string[], status: PerformanceReview["reviewStatus"]) =>
      dispatch(bulkSetReviewStatus({ ids, status })),
    importReviews: (items: PerformanceReview[]) => dispatch(importReviews(items)),

    createGoal: (goal: Goal) => dispatch(createGoal(goal)),
    updateGoal: (goal: Goal) => dispatch(updateGoal(goal)),
    deleteGoal: (id: string) => dispatch(deleteGoal(id)),
    assignGoal: (
      employeeId: string,
      title: string,
      description: string,
      priority: Goal["priority"],
      dueDate: string,
    ) => dispatch(assignGoal({ employeeId, title, description, priority, dueDate })),
    completeGoal: (id: string) => dispatch(completeGoal(id)),

    addFeedback: (fb: Feedback360) => dispatch(addFeedback(fb)),
    addReward: (reward: Reward) => dispatch(addReward(reward)),

    assignTraining: (employeeId: string, courseName: string) =>
      dispatch(assignTraining({ employeeId, courseName })),
    updateTrainingStatus: (id: string, status: TrainingCourse["status"]) =>
      dispatch(updateTrainingStatus({ id, status })),
  };
}
