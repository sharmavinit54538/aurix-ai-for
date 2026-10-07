import { Skeleton } from "@/components/hrms/Shared";
import { TableRow, TableCell } from "@/components/ui/table";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValidationLoadingStateProps {
  pageSize: number;
}

export function ValidationLoadingState({ pageSize }: ValidationLoadingStateProps) {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={7} className="py-3">
            <Skeleton className="h-5 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

interface ValidationErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ValidationErrorState({ error, onRetry }: ValidationErrorStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-12 text-center">
        <div className="mx-auto max-w-sm space-y-3">
          <FileSpreadsheet className="mx-auto h-8 w-8 text-destructive" />
          <div className="font-display text-sm font-semibold text-destructive">
            Failed to load validation issues
          </div>
          <p className="text-xs text-muted-foreground">{error}</p>
          {onRetry ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="h-8 text-xs rounded-xl"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Retry
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}