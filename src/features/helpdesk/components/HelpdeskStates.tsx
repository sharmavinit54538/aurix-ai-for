import React from "react";
import { AlertCircle, Inbox, Loader2, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpdeskLoadingState({ message = "Loading tickets..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground animate-in fade-in duration-300">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function HelpdeskEmptyState({
  title = "No tickets found.",
  description = "No support tickets match the current view or filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-border bg-card/50">
      <div className="h-12 w-12 rounded-full bg-muted/80 flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function HelpdeskErrorState({
  title = "Unable to load tickets. Please try again.",
  error,
  onRetry,
}: {
  title?: string;
  error?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {error && <p className="text-sm text-destructive/80 max-w-md mb-4">{error}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}

export function HelpdeskAccessDeniedState({
  title = "Access Restricted",
  description = "Super Administrators do not have access to Helpdesk. Helpdesk is reserved for organizational users.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
}
