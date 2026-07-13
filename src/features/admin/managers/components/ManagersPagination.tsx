import { Fragment } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManagersPaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  visiblePages: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function ManagersPagination({
  totalItems,
  currentPage,
  perPage,
  totalPages,
  visiblePages,
  onPageChange,
  onPerPageChange,
}: ManagersPaginationProps) {
  const rangeStart = Math.min(totalItems, (currentPage - 1) * perPage + 1);
  const rangeEnd = Math.min(totalItems, currentPage * perPage);

  return (
    <div className="flex flex-col gap-4 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Showing {rangeStart} to {rangeEnd} of {totalItems} entries
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Per Page:</span>
          <Select value={String(perPage)} onValueChange={(val) => onPerPageChange(Number(val))}>
            <SelectTrigger className="h-8 w-[68px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {visiblePages.map((pageNum, index) => {
          const prev = visiblePages[index - 1];
          const showEllipsis = prev != null && pageNum - prev > 1;

          return (
            <Fragment key={pageNum}>
              {showEllipsis ? <span className="px-1 text-xs text-muted-foreground">...</span> : null}
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNum)}
                className="h-8 w-8 text-xs"
              >
                {pageNum}
              </Button>
            </Fragment>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
