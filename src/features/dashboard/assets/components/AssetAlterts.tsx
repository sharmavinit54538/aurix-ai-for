import { AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssetAlert } from "../hooks/useAssetNotifications";

interface AssetAlertsProps {
  alerts: AssetAlert[];
  onViewAsset: (asset: NonNullable<AssetAlert["asset"]>) => void;
}

const ALERT_STYLES: Record<AssetAlert["type"], string> = {
  error: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
};

export function AssetAlerts({ alerts, onViewAsset }: AssetAlertsProps) {
  return (
    <Card className="border-border bg-card/40 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
          Alerts & Notifications
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Asset events needing attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4 italic">
            All assets compliant with warranty and returns!
          </div>
        ) : (
          alerts.slice(0, 4).map((alert) => (
            <div key={alert.id} className={`flex gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${ALERT_STYLES[alert.type]}`}>
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold leading-relaxed">{alert.message}</p>
                {alert.asset && (
                  <button
                    onClick={() => onViewAsset(alert.asset!)}
                    className="mt-1 text-[10px] underline font-bold uppercase cursor-pointer"
                  >
                    View Asset Details
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
