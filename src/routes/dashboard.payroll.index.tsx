import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/payroll/")({
  head: () => ({ meta: [{ title: "Payroll Dashboard — Aurix" }] }),
  component: PayrollDashboardPage,
});

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function PayrollDashboardPage() {
  const ws = useAurix();
  const total = ws.employees.reduce((s, e) => s + 4500 + ((e.id.length * 137) % 6000), 0);
  return (
    <>
      <PageHeader
        title="Payroll Dashboard"
        description="Run payroll, manage compensation, and download payslips."
        actions={
          <>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button><CreditCard className="mr-2 h-4 w-4" />Run payroll</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card label="Current cycle" value="Jul 2026" />
        <Card label="Total payout" value={fmt(total)} />
        <Card label="Payslips ready" value={`${ws.employees.length} / ${ws.employees.length}`} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <div className="border-b border-border px-4 py-3"><h3 className="font-medium">Compensation</h3></div>
        {ws.employees.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Add employees to view their compensation.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Gross</th><th className="px-4 py-3">Net</th><th className="px-4 py-3">Status</th></tr>
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
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
