import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, AlertCircle } from "lucide-react";
import type { LeaveBalance } from "../types";
import { getLeaveTypeDot } from "../mappers";
import { cn } from "@/lib/utils";

interface BalanceCardsProps {
  balances: LeaveBalance[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function BalanceCards({
  balances,
  loading = false,
  error = false,
  onRetry,
}: BalanceCardsProps) {
  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center space-y-3">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Failed to load leave balances</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unable to retrieve current balance records from the server.
          </p>
        </div>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (loading && balances.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-border bg-card animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-8 w-28 bg-muted rounded mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-3 w-36 bg-muted rounded mb-2" />
              <div className="h-1.5 w-full bg-muted rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {balances.map((b) => {
        const total = Number(b.total_days) || 0;
        const used = Number(b.used_days) || 0;
        const remaining = Number(b.remaining_days) || 0;
        const percentage = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;
        const dotColor = getLeaveTypeDot(b.leave_type);

        return (
          <Card
            key={b.leave_type}
            className="border border-border bg-card transition-all duration-300 hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
                <CardDescription className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  {b.leave_type}
                </CardDescription>
              </div>
              <CardTitle className="text-3xl font-display font-bold text-foreground mt-1 tabular-nums">
                {remaining} <span className="text-sm font-normal text-muted-foreground">days left</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Used: {used} / Total: {total} days
              </p>
              {/* Progress bar of used / total using primary token */}
              <Progress
                value={percentage}
                className="h-1.5 w-full bg-primary/20"
                aria-label={`${b.leave_type} usage`}
              />
            </CardContent>
          </Card>
        );
      })}

      {balances.length === 0 && !loading && (
        <div className="col-span-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
          No leave policies or balances allocated yet.
        </div>
      )}
    </div>
  );
}
