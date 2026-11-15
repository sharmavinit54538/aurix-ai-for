import React from "react";
import { Minus, Plus, Users, AlertCircle, Info } from "lucide-react";
import {
  DEFAULT_INCLUDED_EMPLOYEES,
  calculatePlanEstimate,
  formatINR,
} from "../utils/pricingCalculator";
import type { EmployeeCountValidationResult } from "../types/billingTypes";

const HEADCOUNT_PRESETS = [50, 60, 75, 80, 100, 150, 250] as const;

export interface EmployeeCountSelectorProps {
  rawEmployeeInput: string;
  validation: EmployeeCountValidationResult;
  onInputChange: (nextRaw: string) => void;
  onStepChange: (delta: number) => void;
  onSelectPreset: (count: number) => void;
  disabled?: boolean;
}

export const EmployeeCountSelector: React.FC<EmployeeCountSelectorProps> = ({
  rawEmployeeInput,
  validation,
  onInputChange,
  onStepChange,
  onSelectPreset,
  disabled = false,
}) => {
  const effectiveCount = validation.valid
    ? validation.employeeCount
    : DEFAULT_INCLUDED_EMPLOYEES;

  const starterEstimate = calculatePlanEstimate("starter_hr", effectiveCount);
  const businessEstimate = calculatePlanEstimate("business_hr", effectiveCount);

  return (
    <section
      aria-labelledby="employee-calculator-heading"
      className="rounded-xl border border-slate-800/90 bg-[#111520] p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Heading & Explanation */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Dynamic Workforce Pricing Calculator</span>
          </div>
          <h2
            id="employee-calculator-heading"
            className="text-lg sm:text-xl font-semibold text-slate-100 tracking-tight"
          >
            How many employees are in your organization?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Both self-serve plans include up to{" "}
            <span className="font-semibold text-slate-200 tabular-nums">
              50 employees
            </span>{" "}
            in the base monthly subscription. Additional employees are billed transparently per seat.
          </p>
        </div>

        {/* Right: Stepper Input & Quick Presets */}
        <div className="flex flex-col sm:items-end gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="employee-count-input" className="sr-only">
              Number of employees
            </label>
            <button
              type="button"
              onClick={() => onStepChange(-5)}
              disabled={disabled || (validation.valid && validation.employeeCount <= 1)}
              aria-label="Decrease employee count"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="relative">
              <input
                id="employee-count-input"
                data-testid="employee-count-input"
                type="text"
                inputMode="numeric"
                value={rawEmployeeInput}
                disabled={disabled}
                onChange={(e) => onInputChange(e.target.value)}
                aria-invalid={!validation.valid}
                aria-describedby={
                  !validation.valid
                    ? "employee-count-error"
                    : validation.belowIncludedMinimum
                      ? "employee-count-min-note"
                      : undefined
                }
                className={`h-11 w-32 sm:w-36 rounded-lg border bg-slate-950 px-3 text-center text-lg font-bold tabular-nums text-slate-100 outline-none transition ${
                  !validation.valid
                    ? "border-rose-500/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              />
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-500">
                seats
              </span>
            </div>

            <button
              type="button"
              onClick={() => onStepChange(5)}
              disabled={disabled}
              aria-label="Increase employee count"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Preset Quick Selectors */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Quick employee count presets">
            <span className="mr-1 text-xs text-slate-500">Presets:</span>
            {HEADCOUNT_PRESETS.map((preset) => {
              const isSelected = validation.valid && validation.employeeCount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectPreset(preset)}
                  data-testid={`preset-employees-${preset}`}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium tabular-nums transition whitespace-nowrap ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation Error or Below-50 Minimum Note */}
      {!validation.valid && validation.error && (
        <div
          id="employee-count-error"
          role="alert"
          data-testid="employee-count-error"
          className="mt-4 flex items-center gap-2.5 rounded-lg border border-rose-500/40 bg-rose-950/30 px-3.5 py-2.5 text-xs font-medium text-rose-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
          <span>{validation.error}</span>
        </div>
      )}

      {validation.valid && validation.belowIncludedMinimum && (
        <div
          id="employee-count-min-note"
          data-testid="employee-count-min-note"
          className="mt-4 flex items-center gap-2.5 rounded-lg border border-indigo-500/30 bg-indigo-950/25 px-3.5 py-2 text-xs text-indigo-200"
        >
          <Info className="h-4 w-4 shrink-0 text-indigo-400" aria-hidden="true" />
          <span>
            Your selection of{" "}
            <strong className="font-semibold tabular-nums">{validation.employeeCount}</strong>{" "}
            employees is covered by the base 50-employee allowance (0 additional employee charges).
          </span>
        </div>
      )}

      {/* Live Instant Comparison Strip */}
      <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-800/80 pt-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3.5 py-2.5">
          <div>
            <p className="text-xs font-medium text-slate-400">Starter HR Estimate</p>
            <p className="text-[11px] text-slate-500 tabular-nums">
              Base ₹2,499 + {starterEstimate.extraEmployees} extra × ₹39
            </p>
          </div>
          <span
            data-testid="live-strip-starter-total"
            className="text-base font-bold text-slate-100 tabular-nums"
          >
            {formatINR(starterEstimate.monthlySubtotal)}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-indigo-500/30 bg-indigo-950/20 px-3.5 py-2.5">
          <div>
            <p className="text-xs font-medium text-indigo-300">Business HR Estimate</p>
            <p className="text-[11px] text-indigo-300/70 tabular-nums">
              Base ₹4,999 + {businessEstimate.extraEmployees} extra × ₹69
            </p>
          </div>
          <span
            data-testid="live-strip-business-total"
            className="text-base font-bold text-white tabular-nums"
          >
            {formatINR(businessEstimate.monthlySubtotal)}
            <span className="text-xs font-normal text-indigo-300">/mo</span>
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/50 px-3.5 py-2.5">
          <div>
            <p className="text-xs font-medium text-slate-400">Enterprise Contract</p>
            <p className="text-[11px] text-slate-500">Custom SLA & volume seats</p>
          </div>
          <span className="text-base font-bold text-slate-200 tabular-nums">
            ₹9,999+<span className="text-xs font-normal text-slate-400">/mo</span>
          </span>
        </div>
      </div>
    </section>
  );
};
