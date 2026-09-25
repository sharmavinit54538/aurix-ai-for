import React from "react";
import { BarChart3, TrendingUp, Users, Globe, HardDrive, CheckCircle2 } from "lucide-react";

export function SuperAdminAnalyticsPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">Monthly Active Users (MAU)</div>
          <div className="text-3xl font-extrabold text-foreground mt-2">234</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +18.4% from last month
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">Daily Active Users (DAU)</div>
          <div className="text-3xl font-extrabold text-foreground mt-2">188</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            80.3% DAU / MAU ratio
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">Total Clock-Ins Processed</div>
          <div className="text-3xl font-extrabold text-foreground mt-2">14,290</div>
          <div className="text-xs text-muted-foreground mt-1">
            Biometric &amp; Web check-ins
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm">
          <div className="text-xs text-muted-foreground uppercase font-medium">API Requests (24h)</div>
          <div className="text-3xl font-extrabold text-foreground mt-2">248.5K</div>
          <div className="text-xs text-emerald-400 mt-1">
            99.99% success rate
          </div>
        </div>
      </div>

      {/* Feature Adoption Breakdown */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl">
        <h3 className="font-bold text-base text-foreground mb-4">Module Adoption Across Organizations</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">Attendance &amp; Biometrics</span>
              <span className="text-muted-foreground">100% adoption</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">Leaves &amp; Absence Governance</span>
              <span className="text-muted-foreground">96% adoption</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[96%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">Payroll &amp; Statutory Compensation</span>
              <span className="text-muted-foreground">88% adoption</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[88%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">AI HR Copilot &amp; Smart Tools</span>
              <span className="text-muted-foreground">74% adoption</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[74%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
