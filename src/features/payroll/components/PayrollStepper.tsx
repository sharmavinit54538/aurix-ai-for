/**
 * Reusable 9-Step Payroll Lifecycle Stepper Component.
 *
 * Steps:
 * 1. Period
 * 2. Run
 * 3. Validation
 * 4. Preview
 * 5. Employee Detail
 * 6. Review & Approval
 * 7. Finalization
 * 8. Payslips
 * 9. Payment
 *
 * Supports accessible keyboard navigation, responsive layout, step state calculation,
 * and strict lifecycle transition guards.
 */

import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PAYROLL_LIFECYCLE_STEPS,
  type PayrollStepId,
  type PayrollStepperProps,
  type StepState,
} from "../types/lifecycle";

export function PayrollStepper({
  currentStep,
  runId,
  employeeId,
  batchId,
  runStatus,
  onStepClick,
  className,
}: PayrollStepperProps) {
  const navigate = useNavigate();

  const currentIndex = PAYROLL_LIFECYCLE_STEPS.findIndex(
    (s) => s.id === currentStep
  );

  const normalizedStatus = (runStatus || "").toLowerCase();
  const isFinalizedOrPaid =
    normalizedStatus.includes("final") ||
    normalizedStatus.includes("lock") ||
    normalizedStatus.includes("paid");
  const isApproved =
    isFinalizedOrPaid || normalizedStatus.includes("approv");

  const getStepState = (index: number, stepId: PayrollStepId): StepState => {
    // If step is beyond run lifecycle:
    if (!runId && index > 0) return "disabled";

    if (stepId === "payment" && !isFinalizedOrPaid) {
      return "disabled";
    }

    if (stepId === "finalization" && !isApproved) {
      return "disabled";
    }

    if (index < currentIndex) {
      return "completed";
    }
    if (index === currentIndex) {
      return "active";
    }
    return "upcoming";
  };

  const handleStepClick = (
    stepId: PayrollStepId,
    route: string,
    state: StepState
  ) => {
    // Prevent jumping to disabled or premature steps
    if (state === "disabled") return;

    if (onStepClick) {
      onStepClick(stepId, route);
      return;
    }

    if (route) {
      navigate({ to: route as any });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    stepId: PayrollStepId,
    route: string,
    state: StepState
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleStepClick(stepId, route, state);
    }
  };

  return (
    <nav
      aria-label="Payroll Lifecycle Progress"
      className={cn(
        "w-full rounded-2xl border border-border/60 bg-background/80 p-3 sm:p-4 backdrop-blur-xl shadow-sm",
        className
      )}
    >
      <ol
        role="list"
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-0.5"
      >
        {PAYROLL_LIFECYCLE_STEPS.map((step, idx) => {
          const state = getStepState(idx, step.id);
          const route = step.getPath(runId, employeeId, batchId);
          const isClickable = state === "completed" || state === "active";
          const isCurrent = state === "active";

          return (
            <li
              key={step.id}
              role="listitem"
              className="flex items-center gap-1 sm:gap-2 shrink-0"
            >
              <button
                type="button"
                id={`payroll-stepper-${step.id}`}
                disabled={!isClickable}
                onClick={() => handleStepClick(step.id, route, state)}
                onKeyDown={(e) => handleKeyDown(e, step.id, route, state)}
                aria-current={isCurrent ? "step" : undefined}
                aria-disabled={!isClickable}
                tabIndex={isClickable ? 0 : -1}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isClickable
                    ? "cursor-pointer hover:bg-muted/70 hover:shadow-xs active:scale-[0.98]"
                    : "cursor-not-allowed opacity-55",
                  isCurrent &&
                    "bg-primary/10 text-primary font-medium ring-1 ring-primary/30 shadow-xs"
                )}
              >
                {/* Step indicator circle */}
                <div
                  className={cn(
                    "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors duration-200",
                    state === "completed" &&
                      "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30",
                    state === "active" &&
                      "bg-primary text-primary-foreground shadow-sm shadow-primary/25",
                    state === "upcoming" &&
                      "bg-muted text-muted-foreground ring-1 ring-border/80",
                    state === "disabled" &&
                      "bg-muted/50 text-muted-foreground/60"
                  )}
                >
                  {state === "completed" ? (
                    <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  ) : state === "disabled" ? (
                    <Lock className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                  ) : (
                    <span>{step.stepNumber}</span>
                  )}
                </div>

                {/* Step labels */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xs font-medium tracking-tight whitespace-nowrap",
                      isCurrent
                        ? "text-primary font-semibold"
                        : state === "completed"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="hidden xl:inline text-[10px] text-muted-foreground/75 whitespace-nowrap">
                    {step.description}
                  </span>
                </div>
              </button>

              {/* Step connector chevron */}
              {idx < PAYROLL_LIFECYCLE_STEPS.length - 1 && (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-colors",
                    idx < currentIndex
                      ? "text-emerald-500/60"
                      : "text-muted-foreground/30"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
