import { CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyValidationStateProps {
  onReturnToPreview?: () => void;
}

export function EmptyValidationState({ onReturnToPreview }: EmptyValidationStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-14 text-center">
        <div className="mx-auto max-w-sm space-y-3">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              All Payroll Validations Passed
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Zero validation issues were detected by the backend payroll engine for
              this run. All salary, statutory, and attendance checks conform to
              policy rules.
            </p>
          </div>
          {onReturnToPreview ? (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReturnToPreview}
                className="text-xs"
              >
                Return to Payroll Preview
              </Button>
            </div>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface FilteredEmptyStateProps {
  onClearFilters?: () => void;
}

export function FilteredEmptyState({ onClearFilters }: FilteredEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-12 text-center">
        <div className="mx-auto max-w-sm">
          <Filter className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <div className="mt-2 font-display text-sm font-semibold text-foreground">
            No matching validation issues
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            No issues matched your current search and filter criteria. Try resetting
            your filters.
          </p>
          {onClearFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="mt-3 text-xs text-primary"
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}