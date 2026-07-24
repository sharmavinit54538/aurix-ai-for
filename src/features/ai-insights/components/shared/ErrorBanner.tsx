import { memo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorBanner = memo(function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-500">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold">Failed to load AI Insights</div>
          <div className="text-xs opacity-90">{message}</div>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="border-rose-500/30 hover:bg-rose-500/20">
        <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );
});
