import { Button } from "@/components/ui/button";

interface AssetPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AssetPagination({ currentPage, totalPages, onPageChange }: AssetPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <span className="text-xs text-muted-foreground">
        Showing Page <strong className="font-semibold text-foreground">{currentPage}</strong> of{" "}
        <strong className="font-semibold text-foreground">{totalPages}</strong>
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="h-8 border-border hover:bg-accent/60 cursor-pointer"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="h-8 border-border hover:bg-accent/60 cursor-pointer"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
