import React from "react";
import { ShieldCheck, AlertTriangle, Clock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComplianceDashboardData } from "@/services/complianceApi";

interface ViewProps {
  data: ComplianceDashboardData;
}

export const OverviewComplianceView: React.FC<ViewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Risk Indicator & Score Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-card to-card border border-emerald-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex flex-col items-center justify-center text-emerald-400 font-bold text-xl shadow-inner">
            <span>{data.overall_score}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Labor & Tax Compliance Rating</h3>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                LOW RISK
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              142 employees audited across EPF, ESIC, Professional Tax, and Income Tax TDS regulations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Audit Certified
          </Button>
        </div>
      </div>

      {/* Statutory Obligations Status Table */}
      <div className="p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground">Active Statutory Obligations</h3>
            <p className="text-xs text-muted-foreground">Monthly & quarterly statutory filings due dates</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Obligation Type</th>
                <th className="p-3">Period</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Amount Due</th>
                <th className="p-3">Status</th>
                <th className="p-3">Challan / TRRN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {data.obligations.map((obl) => (
                <tr key={obl.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-bold text-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {obl.type} Compliance
                  </td>
                  <td className="p-3 text-muted-foreground">{obl.period}</td>
                  <td className="p-3 font-mono text-muted-foreground">{obl.due_date}</td>
                  <td className="p-3 font-bold text-foreground">₹{obl.amount.toLocaleString("en-IN")}</td>
                  <td className="p-3">
                    <Badge
                      className={
                        obl.status === "FILED"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      }
                    >
                      {obl.status}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">
                    {obl.challan_number || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
