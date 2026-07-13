import { FolderOpen, Users } from "lucide-react";
import { Loader } from "@/components/aurix/Loader";
import { Button } from "@/components/ui/button";
import type { Manager, SortDir, SortField } from "../types";
import { ManagersTable } from "./ManagersTable";

interface ManagersListContentProps {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  managers: Manager[];
  paginatedManagers: Manager[];
  filteredCount: number;
  selectedIds: string[];
  sortField: SortField;
  sortDir: SortDir;
  onRetry: () => void;
  onAdd: () => void;
  onClearFilters: () => void;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (manager: Manager) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
  onSort: (field: SortField) => void;
  pagination: React.ReactNode;
}

export function ManagersListContent({
  loading,
  submitting,
  error,
  managers,
  paginatedManagers,
  filteredCount,
  selectedIds,
  sortField,
  sortDir,
  onRetry,
  onAdd,
  onClearFilters,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  onSort,
  pagination,
}: ManagersListContentProps) {
  if (loading) {
    return <Loader variant="panel" label="Loading managers..." skeletonRows={6} />;
  }

  if (error) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center p-12 text-center">
        <p className="font-medium text-destructive">Failed to load managers</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{error}</p>
        <Button onClick={onRetry} className="mt-5">
          Retry
        </Button>
      </div>
    );
  }

  if (filteredCount === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center p-12 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm">
          {managers.length === 0 ? <Users className="h-6 w-6" /> : <FolderOpen className="h-6 w-6" />}
        </div>
        <h4 className="text-lg font-semibold text-foreground">No Managers Found</h4>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {managers.length === 0
            ? "Start by creating your first manager to seed the directory tree."
            : "No listings match your search criteria. Try modifying your filters."}
        </p>
        <Button onClick={managers.length === 0 ? onAdd : onClearFilters} className="mt-5">
          {managers.length === 0 ? "Add Manager" : "Clear Filters"}
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {submitting ? <Loader variant="overlay" label="Saving changes..." /> : null}
      <ManagersTable
        managers={paginatedManagers}
        selectedIds={selectedIds}
        onSelectAll={onSelectAll}
        onSelectRow={onSelectRow}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        sortField={sortField}
        sortDir={sortDir}
        onSort={onSort}
      />
      {pagination}
    </div>
  );
}
