import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
      {steps.map((label, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <motion.div
              layout
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-transparent text-brand-foreground shadow-glow"
                  : isDone
                    ? "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-card/40 text-muted-foreground"
              }`}
              style={isActive ? { background: "var(--gradient-brand)" } : undefined}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-white/25 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </motion.div>
            {i < steps.length - 1 ? (
              <span className="hidden h-px w-6 bg-border sm:inline-block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
