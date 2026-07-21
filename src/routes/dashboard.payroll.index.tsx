import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  CreditCard, Sparkles, PlayCircle, LayoutGrid, FileText,
  Receipt, Gift, MinusCircle, HandCoins, Timer, Percent, CheckCircle2,
  BarChart3, Banknote, ShieldCheck, Settings, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/payroll/")({
  head: () => ({ meta: [{ title: "Payroll Dashboard — Aurix" }] }),
  component: PayrollDashboardPage,
});

interface PayrollModuleDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  to: string;
  color: string;
}

const PAYROLL_MODULES_LIST: PayrollModuleDef[] = [
  {
    id: "copilot",
    title: "AI Payroll Copilot",
    description: "Consult your AI assistant for payroll processing, tax advice, and data validations.",
    icon: Sparkles,
    to: "/dashboard/payroll/copilot",
    color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "salary-processing",
    title: "Salary Processing",
    description: "Run monthly salary calculations, verify timesheets, and execute payouts.",
    icon: PlayCircle,
    to: "/dashboard/payroll/salary-processing",
    color: "from-blue-500/20 to-sky-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "salary-structure",
    title: "Salary Structure",
    description: "Define base pay, allowances, provident funds, and custom salary slabs.",
    icon: LayoutGrid,
    to: "/dashboard/payroll/salary-structure",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  {
    id: "payslips",
    title: "Payslips",
    description: "Generate, review, and distribute monthly payslips to your workforce.",
    icon: FileText,
    to: "/dashboard/payroll/payslips",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "reimbursements",
    title: "Reimbursements",
    description: "Audit travel, fuel, internet, and office expenses filed by employees.",
    icon: Receipt,
    to: "/dashboard/payroll/reimbursements",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "bonuses",
    title: "Bonuses & Incentives",
    description: "Track performance bonuses, festival incentives, and one-off rewards.",
    icon: Gift,
    to: "/dashboard/payroll/bonuses",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "deductions",
    title: "Deductions",
    description: "Manage professional tax, insurance, provident fund, and custom deductions.",
    icon: MinusCircle,
    to: "/dashboard/payroll/deductions",
    color: "from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30",
  },
  {
    id: "advances",
    title: "Advances & Loans",
    description: "Track employee salary advances, loan applications, and EMIs.",
    icon: HandCoins,
    to: "/dashboard/payroll/advances",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30",
  },
  {
    id: "overtime",
    title: "Overtime Payments",
    description: "Calculate hourly overtime rates based on validated weekly timesheets.",
    icon: Timer,
    to: "/dashboard/payroll/overtime",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "tax",
    title: "Tax Management",
    description: "Manage income tax slabs, TDS, and financial year declaration audits.",
    icon: Percent,
    to: "/dashboard/payroll/tax",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
  },
  {
    id: "approvals",
    title: "Payroll Approvals",
    description: "Audit and sign off pending monthly runs before final bank disbursement.",
    icon: CheckCircle2,
    to: "/dashboard/payroll/approvals",
    color: "from-green-500/20 to-teal-500/20 text-green-400 border-green-500/30",
  },
  {
    id: "reports",
    title: "Payroll Reports",
    description: "Generate gross-to-net registers, tax summaries, and cost-to-company metrics.",
    icon: BarChart3,
    to: "/dashboard/payroll/reports",
    color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "bank-transfers",
    title: "Bank Transfers",
    description: "Export bank-compliant salary advice files and manage accounts.",
    icon: Banknote,
    to: "/dashboard/payroll/bank-transfers",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "compliance",
    title: "Compliance",
    description: "Monitor PF, ESI, PT compliance status and prepare statutory filings.",
    icon: ShieldCheck,
    to: "/dashboard/payroll/compliance",
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "settings",
    title: "Payroll Settings",
    description: "Configure fiscal years, pay cycles, lock dates, and currency defaults.",
    icon: Settings,
    to: "/dashboard/payroll/settings",
    color: "from-slate-500/20 to-zinc-500/20 text-slate-400 border-slate-500/30",
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

type ViewMode = "modules" | "analytics";


function PayrollDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("modules");
  const ws = useAurix();
  const navigate = useNavigate();

  useEffect(() => {
    if (ws.user?.role === "employee") {
      navigate({ to: "/dashboard/payroll/payslips" as any });
    }
  }, [ws.user?.role, navigate]);

  if (ws.user?.role === "employee") {
    return null;
  }

  const total = ws.employees.reduce((s, e) => s + 4500 + ((e.id.length * 137) % 6000), 0);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <CreditCard className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Payroll Hub</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            Run payroll, manage compensation, audit tax compliance, and distribute employee payslips.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg">
            <Button
              variant={viewMode === "modules" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("modules")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Payroll Hub
            </Button>
            <Button
              variant={viewMode === "analytics" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("analytics")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Payroll Dashboard
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Payroll data refreshed")}
            className="h-8 gap-1.5 cursor-pointer text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {viewMode === "modules" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PAYROLL_MODULES_LIST.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.to as any}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                        {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card label="Current cycle" value="Jul 2026" />
            <Card label="Total payout" value={fmt(total)} />
            <Card label="Payslips ready" value={`${ws.employees.length} / ${ws.employees.length}`} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <div className="border-b border-border px-4 py-3 text-left">
              <h3 className="font-medium">Compensation Overview</h3>
            </div>
            {ws.employees.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">Add employees to view their compensation.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Gross</th>
                      <th className="px-4 py-3">Net</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ws.employees.map((e) => {
                      const gross = 4500 + ((e.id.length * 137) % 6000);
                      const net = Math.round(gross * 0.78);
                      return (
                        <tr key={e.id} className="border-t border-border">
                          <td className="px-4 py-3 font-medium">{e.fullName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                          <td className="px-4 py-3">{fmt(gross)}</td>
                          <td className="px-4 py-3">{fmt(net)}</td>
                          <td className="px-4 py-3"><Badge variant="secondary">Ready</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl text-left">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
