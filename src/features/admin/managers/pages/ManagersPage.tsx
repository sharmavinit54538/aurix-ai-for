import { Upload, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { ManagerStatsCards } from "../components/ManagerStatsCards";
import { ManagersListContent } from "../components/ManagersListContent";
import { ManagerFormDialog } from "../components/ManagerFormDialog";
import { ManagerProfileDrawer } from "../components/ManagerProfileDrawer";
import { ImportDialog } from "../components/ImportDialog";
import { ManagersToolbar } from "../components/ManagersToolbar";
import { ManagersAdvancedFilters } from "../components/ManagersAdvancedFilters";
import { ManagersPagination } from "../components/ManagersPagination";
import { ManagersDeleteDialogs } from "../components/ManagersDeleteDialogs";
import { useManagersPage } from "../hooks/useManagersPage";

export function ManagersPage() {
  const page = useManagersPage();

  return (
    <div className="min-w-0 max-w-full overflow-x-hidden">
      <PageHeader
        title="Managers Directory"
        description="View, manage, and coordinate your corporate department heads, product leads, and hierarchy rules."
        actions={
          <>
            <Button onClick={() => page.setImportOpen(true)} variant="outline" className="rounded-xl">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button onClick={page.handleAddClick} className="rounded-xl">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Manager
            </Button>
          </>
        }
      />

      {!page.loading ? <ManagerStatsCards managers={page.managers} /> : null}

      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <ManagersToolbar
          searchQuery={page.searchQuery}
          filters={page.filters}
          showAdvancedFilters={page.showAdvancedFilters}
          selectedCount={page.selectedIds.length}
          onSearchChange={page.handleSearchChange}
          onToggleFilters={() => page.setShowAdvancedFilters((open) => !open)}
          onClearFilters={page.handleClearFilters}
          onBulkStatusChange={page.handleBulkStatusChange}
          onBulkDelete={() => page.setBulkDeleteAlertOpen(true)}
          onExportCSV={page.handleExportCSV}
          onExportExcel={page.handleExportExcel}
          onExportPDF={page.handleExportPDF}
        />
        {/* {page.showAdvancedFilters ? (
          <ManagersAdvancedFilters filters={page.filters} onChange={page.handleFiltersChange} />
        ) : null} */}
        <ManagersListContent
          loading={page.loading}
          submitting={page.submitting}
          error={page.error}
          managers={page.managers}
          paginatedManagers={page.paginatedManagers}
          filteredCount={page.total}
          selectedIds={page.selectedIds}
          sortField={page.sortField}
          sortDir={page.sortDir}
          onRetry={page.refetch}
          onAdd={page.handleAddClick}
          onClearFilters={page.handleClearFilters}
          onSelectAll={page.handleSelectAll}
          onSelectRow={page.handleSelectRow}
          onView={page.handleViewClick}
          onEdit={page.handleEditClick}
          onDelete={page.handleDeleteClick}
          onSort={page.handleSort}
          pagination={
            <ManagersPagination
              totalItems={page.total}
              currentPage={page.currentPage}
              perPage={page.perPage}
              totalPages={page.totalPages}
              visiblePages={page.visiblePages}
              onPageChange={page.setCurrentPage}
              onPerPageChange={page.handlePerPageChange}
            />
          }
        />
      </div>

      <ManagerFormDialog
        open={page.formOpen}
        onOpenChange={page.handleFormOpenChange}
        isEdit={page.isEditMode}
        manager={page.selectedManager}
        detailLoading={page.selectedManagerLoading}
        detailError={page.selectedManagerError}
        existingManagers={page.managers}
        onSubmit={page.handleSaveManager}
      />

      <ManagerProfileDrawer
        open={page.profileOpen}
        onOpenChange={page.handleProfileOpenChange}
        manager={page.selectedManager}
        loading={page.selectedManagerLoading}
        error={page.selectedManagerError}
      />

      <ImportDialog
        open={page.importOpen}
        onOpenChange={page.setImportOpen}
        existingManagers={page.managers}
        submitting={page.submitting}
        onImport={page.handleImportManagers}
      />

      <ManagersDeleteDialogs
        deleteOpen={page.deleteAlertOpen}
        managerToDelete={page.managerToDelete}
        bulkDeleteOpen={page.bulkDeleteAlertOpen}
        selectedCount={page.selectedIds.length}
        onDeleteOpenChange={page.setDeleteAlertOpen}
        onBulkDeleteOpenChange={page.setBulkDeleteAlertOpen}
        onConfirmDelete={page.handleConfirmDelete}
        onConfirmBulkDelete={page.handleConfirmBulkDelete}
      />
    </div>
  );
}
