import React from "react";
import { Check, Circle, ChevronRight } from "lucide-react";

export type PayrollStageId =
  | "draft"
  | "calculated"
  | "validated"
  | "finance_review"
  | "approval"
  | "payslips"
  | "bank_transfer"
  | "completed";

interface StageItem {
  id: PayrollStageId;
  label: string;
  subtext: string;
}

const STAGES: StageItem[] = [
  { id: "draft", label: "Draft", subtext: "Input Gathering" },
  { id: "calculated", label: "Calculated", subtext: "Gross & Taxes" },
  { id: "validated", label: "Validated", subtext: "Audit & Exception" },
  { id: "finance_review", label: "Finance Review", subtext: "CFO Sign-off" },
  { id: "approval", label: "Approval", subtext: "Executive Lock" },
  { id: "payslips", label: "Payslips", subtext: "Generation" },
  { id: "bank_transfer", label: "Bank Transfer", subtext: "NEFT Advice" },
  { id: "completed", label: "Completed", subtext: "Disbursed" },
];

interface ProcessingTimelineProps {
  currentStageId: PayrollStageId;
  onSelectStage?: (id: PayrollStageId) => void;
}

export const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({
  currentStageId,
  onSelectStage,
}) => {
  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStageId);

  return (
    <div className="sp-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Payroll Processing Pipeline
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            8-Stage Lifecycle Automation Stepper
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            Active: <strong className="text-indigo-400">{STAGES[currentStageIndex]?.label}</strong>
          </span>
          <span className="sp-badge-indigo rounded-full px-2 py-0.5 text-[10px] font-bold">
            Stage {currentStageIndex + 1} of {STAGES.length}
          </span>
        </div>
      </div>

      {/* Stepper Container */}
      <div className="relative overflow-x-auto py-2">
        <div className="flex min-w-[800px] items-center justify-between gap-1">
          {STAGES.map((stage, index) => {
            const isPassed = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isUpcoming = index > currentStageIndex;

            return (
              <React.Fragment key={stage.id}>
                {/* Step Item */}
                <button
                  type="button"
                  onClick={() => onSelectStage?.(stage.id)}
                  className={`group flex flex-1 flex-col items-center text-center transition-all duration-200 focus:outline-none ${
                    isCurrent ? "scale-105" : "hover:opacity-80"
                  }`}
                >
                  {/* Step Icon Indicator */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                      isPassed
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/20"
                        : isCurrent
                        ? "sp-pulse-active border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                        : "border-white/10 bg-white/[0.03] text-slate-500"
                    }`}
                  >
                    {isPassed ? (
                      <Check className="h-4 w-4 stroke-[3]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step Labels */}
                  <div className="mt-2 space-y-0.5">
                    <div
                      className={`text-xs font-bold ${
                        isCurrent
                          ? "text-indigo-400"
                          : isPassed
                          ? "text-slate-200"
                          : "text-slate-500"
                      }`}
                    >
                      {stage.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {stage.subtext}
                    </div>
                  </div>
                </button>

                {/* Arrow Connector Line between steps */}
                {index < STAGES.length - 1 && (
                  <div className="flex items-center px-1">
                    <div
                      className={`h-0.5 w-6 rounded transition-colors duration-300 ${
                        index < currentStageIndex
                          ? "bg-emerald-500/60"
                          : "bg-white/10"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
