import React from "react";
import { FileSpreadsheet, Upload, CheckCircle, XCircle, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentActivity } from "../hooks/useDocumentActivity";

export const ActivityLog: React.FC = () => {
  const { activities, isLoading, isError } = useDocumentActivity(1, 6);

  // If there's an error or no activity endpoint, show clean fallback rather than fabricated log
  if (isError) {
    return (
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-bold flex items-center gap-1.5">
            <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
            Recent Document Activity
          </CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">
            Audit trail of document events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-4">
            Activity audit log is not available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-sm font-bold flex items-center gap-1.5">
          <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
          Recent Document Activity
        </CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          Live audit trail of document events across the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted/30 rounded animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No recent document activity.
          </p>
        ) : (
          <div className="space-y-2.5">
            {activities.map((act) => {
              const isUpload = act.action.toLowerCase().includes("upload");
              const isVerify = act.action.toLowerCase().includes("verif");
              const isReject = act.action.toLowerCase().includes("reject");
              const isDownload = act.action.toLowerCase().includes("download");

              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 text-xs border-b border-border/40 pb-2.5 last:border-b-0"
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full shrink-0 ${
                      isUpload
                        ? "bg-blue-500/10 text-blue-500"
                        : isVerify
                        ? "bg-emerald-500/10 text-emerald-500"
                        : isReject
                        ? "bg-rose-500/10 text-rose-500"
                        : isDownload
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {isUpload ? (
                      <Upload className="h-2.5 w-2.5" />
                    ) : isVerify ? (
                      <CheckCircle className="h-2.5 w-2.5" />
                    ) : isReject ? (
                      <XCircle className="h-2.5 w-2.5" />
                    ) : isDownload ? (
                      <Download className="h-2.5 w-2.5" />
                    ) : (
                      <RefreshCw className="h-2.5 w-2.5" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">
                      <strong className="font-semibold">{act.performedBy}</strong>{" "}
                      {act.action.toLowerCase()}{" "}
                      <strong className="font-semibold truncate">{act.documentName}</strong>
                    </p>
                    {act.details && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{act.details}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(act.timestamp).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
