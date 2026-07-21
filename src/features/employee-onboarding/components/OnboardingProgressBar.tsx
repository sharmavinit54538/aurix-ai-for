import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  percentage: number;
}

export function OnboardingProgressBar({ currentStep, totalSteps, percentage }: ProgressBarProps) {
  return (
    <div className="w-full rounded-2xl bg-card/40 p-6 backdrop-blur-xl border border-border/40 shadow-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Onboarding Progress
          </span>
          <h2 className="text-lg font-bold text-foreground">
            Step {currentStep} of {totalSteps}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-brand-foreground shadow-glow bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            {Math.round(percentage)}% Completed
          </span>
        </div>
      </div>
      <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
