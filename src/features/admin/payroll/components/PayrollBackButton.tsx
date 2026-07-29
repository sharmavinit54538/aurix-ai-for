import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface PayrollBackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const PayrollBackButton: React.FC<PayrollBackButtonProps> = ({
  to = "/dashboard/payroll",
  label = "Back to Payroll Hub",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: to as any });
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="group/back inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:bg-white/[0.06] hover:text-white cursor-pointer shadow-xs backdrop-blur-md"
        aria-label={label}
      >
        <ArrowLeft className="h-3.5 w-3.5 text-slate-400 group-hover/back:text-indigo-400 group-hover/back:-translate-x-0.5 transition-transform duration-200" />
        <span>{label}</span>
      </button>
    </div>
  );
};
