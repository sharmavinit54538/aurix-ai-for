import React from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const PFComplianceView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Employees' Provident Fund (EPF) Compliance</h3>
              <p className="text-xs text-muted-foreground">
                Manage UAN verification, ECR Electronic Challan Returns, and monthly PF remittances.
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            Download ECR File
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border/50 bg-background/40">
            <div className="text-muted-foreground">Establishment Code</div>
            <div className="text-sm font-bold text-foreground font-mono mt-1">APHYD0012345000</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-background/40">
            <div className="text-muted-foreground">Active UAN Enrolled</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">140 / 142 Employees</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-background/40">
            <div className="text-muted-foreground">Monthly PF Remittance</div>
            <div className="text-sm font-bold text-foreground mt-1">₹4,28,500.00</div>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-background/40">
            <div className="text-muted-foreground">ECR Return Status</div>
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] mt-1">
              READY FOR GENERATION
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
