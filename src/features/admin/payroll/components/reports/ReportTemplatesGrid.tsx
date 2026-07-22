import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Building2,
  Receipt,
  ShieldCheck,
  HeartPulse,
  Banknote,
  Gift,
  Clock,
  CreditCard,
  FileSpreadsheet,
  Scale,
  Users,
  MapPin,
  Briefcase,
  ArrowUpRight,
  BarChart3,
  Layers,
  CalendarDays,
  BookOpen,
  Landmark,
  Wallet,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportTemplatesGridProps {
  onGenerate: (templateId: string) => void;
}

export const ReportTemplatesGrid: React.FC<ReportTemplatesGridProps> = ({ onGenerate }) => {
  const templates = [
    { id: "tmpl_salary_register", name: "Salary Register", desc: "Itemized earnings & deductions per employee", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
    { id: "tmpl_payroll_summary", name: "Payroll Summary", desc: "Monthly payroll summary with totals", icon: FileSpreadsheet, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    { id: "tmpl_cost_analysis", name: "Salary Cost Analysis", desc: "CTC breakdown and cost-to-company analytics", icon: BarChart3, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
    { id: "tmpl_dept_payroll", name: "Department-wise Payroll", desc: "Cost breakdown grouped by department", icon: Building2, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
    { id: "tmpl_location_payroll", name: "Location-wise Payroll", desc: "Payroll cost distribution by office location", icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    { id: "tmpl_designation_payroll", name: "Designation-wise Payroll", desc: "Salary analysis by role designation", icon: Briefcase, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
    { id: "tmpl_employee_salary", name: "Employee Salary Report", desc: "Individual employee salary history", icon: Users, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30" },
    { id: "tmpl_tax", name: "Income Tax (TDS) Report", desc: "Monthly TDS deductions & Form 24Q data", icon: Receipt, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
    { id: "tmpl_pf", name: "EPF / ECR Return", desc: "PF contribution breakdown by UAN", icon: ShieldCheck, color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/30" },
    { id: "tmpl_esi", name: "ESIC Monthly Report", desc: "ESI contribution register for covered staff", icon: HeartPulse, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30" },
    { id: "tmpl_professional_tax", name: "Professional Tax Report", desc: "State-wise professional tax register", icon: Scale, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
    { id: "tmpl_bonus", name: "Bonus Report", desc: "Performance and statutory bonus disbursements", icon: Gift, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
    { id: "tmpl_overtime", name: "Overtime Report", desc: "Overtime hours and pay analysis", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
    { id: "tmpl_allowance", name: "Allowance Report", desc: "HRA, conveyance, medical and special allowances", icon: Wallet, color: "text-lime-400", bg: "bg-lime-500/10 border-lime-500/30" },
    { id: "tmpl_deduction", name: "Deduction Report", desc: "All statutory and voluntary deductions", icon: CreditCard, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" },
    { id: "tmpl_loan_advance", name: "Loan & Advance Report", desc: "Employee loan and salary advance tracker", icon: Landmark, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
    { id: "tmpl_reimbursement", name: "Reimbursement Report", desc: "Expense reimbursement claims & disbursements", icon: ScrollText, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
    { id: "tmpl_bank_transfer", name: "Bank Transfer Report", desc: "NEFT/ACH bank advice payout summary", icon: Banknote, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
    { id: "tmpl_payslip", name: "Payslip Report", desc: "Payslip generation and distribution log", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
    { id: "tmpl_compliance", name: "Compliance Report", desc: "Regulatory compliance filing status", icon: ShieldCheck, color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/30" },
    { id: "tmpl_audit", name: "Audit Report", desc: "Payroll audit trail and change history", icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
    { id: "tmpl_year_end", name: "Year-End Report", desc: "Annual salary statement & Form 16 readiness", icon: CalendarDays, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
    { id: "tmpl_custom", name: "Custom Reports", desc: "Build your own report with drag-and-drop fields", icon: Sparkles, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/30" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <Layers className="h-4 w-4 text-violet-400" />
        Report Templates ({templates.length} Categories)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {templates.map((t, idx) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="group p-4 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md shadow-md hover:border-border/80 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onGenerate(t.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${t.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${t.color}`} />
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
              </div>
              <div className="text-xs font-bold text-foreground">{t.name}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{t.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
