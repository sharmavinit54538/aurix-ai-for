import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValidationPaginationProps {
  currentPage: number;
  totalPages: number;
  filteredIssuesCount: number;
  onPageChange: (page: number) => void;
}

export function ValidationPagination({
  currentPage,
  totalPages,
  filteredIssuesCount,
  onPageChange,
}: ValidationPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
      <div>
        Page <strong className="text-foreground">{currentPage}</strong> of{" "}
        <strong className="text-foreground">{totalPages}</strong> ({filteredIssuesCount}{" "}
        total issues)
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="h-8 px-2 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="h-8 px-2 text-xs"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}