import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import type { SummaryMetrics } from "../types";

interface EmployeeDocumentsStatsProps {
  metrics: SummaryMetrics;
}

export function EmployeeDocumentsStats({ metrics }: EmployeeDocumentsStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <CardDescription className="text-xs font-medium text-muted-foreground">
            Total Documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-blue-500">{metrics.total}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">All uploaded files</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <CardDescription className="text-xs font-medium text-muted-foreground">
            Verified Documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-emerald-500">{metrics.verified}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">HR approved & verified</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <CardDescription className="text-xs font-medium text-muted-foreground">
            Pending Verification
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-amber-500">{metrics.pending}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Under review by HR</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <CardDescription className="text-xs font-medium text-muted-foreground">
            Rejected Documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-rose-500">{metrics.rejected}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Requires re-upload</p>
        </CardContent>
      </Card>

      <Card className="col-span-2 sm:col-span-1 border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <CardDescription className="text-xs font-medium text-muted-foreground">
            Expiring Soon
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold text-purple-500">{metrics.expiring}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Expiring in 90 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
