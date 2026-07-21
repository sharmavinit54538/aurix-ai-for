import { Plus, Upload, Building, BarChart, Network, Link, ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentFormDialog } from "../components/DepartmentFormDialog";
import { DepartmentProfileDrawer } from "../components/DepartmentProfileDrawer";
import { DepartmentHierarchy } from "../components/DepartmentHierarchy";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { ImportDialog } from "../components/ImportDialog";
import { DepartmentsDirectoryTab } from "../components/DepartmentsDirectoryTab";
// import { DepartmentsBulkDialogs } from "../components/DepartmentsBulkDialogs";
import { DepartmentsDeleteDialogs } from "../components/DepartmentsDeleteDialogs";
import { useDepartmentsPage } from "../hooks/useDepartmentsPage";
import { Link as TanstackLink } from "@tanstack/react-router";


export function DepartmentsPage() {
  const page = useDepartmentsPage();

  return (
    <div className="space-y-6">
      <TanstackLink
        to="/dashboard/workforce"
        className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer group/back"
      >
        <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
        Back to Workforce Hub
      </TanstackLink>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Departments Manager"
          description="Design division frameworks, allocate corporate budgets, configure hierarchy trees, and balance employee capacities."
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => page.setImportOpen(true)}
            variant="outline"
            className="rounded-xl border-border bg-card/60 hover:bg-muted text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            onClick={page.handleAddClick}
            className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      <Tabs value={page.activeTab} onValueChange={page.setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <TabsList className="bg-muted/40 p-1 rounded-xl h-10">
            <TabsTrigger value="directory" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5" />
              List Directory
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Network className="h-3.5 w-3.5" />
              Reporting Hierarchy
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <BarChart className="h-3.5 w-3.5" />
              Charts & Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="directory" className="space-y-6 mt-0">
          <DepartmentsDirectoryTab
            allDeptsForStats={page.allDeptsForStats}
            loading={page.loading}
            departments={page.departments}
            processedDepartments={page.processedDepartments}
            paginatedDepartments={page.paginatedDepartments}
            searchQuery={page.searchQuery}
            filters={page.filters}
            showAdvancedFilters={page.showAdvancedFilters}
            sortField={page.sortField}
            sortDir={page.sortDir}
            currentPage={page.currentPage}
            perPage={page.perPage}
            totalPages={page.totalPages}
            managers={page.managers}
            onSearchChange={page.handleSearchChange}
            onToggleAdvancedFilters={() => page.setShowAdvancedFilters((open) => !open)}
            onClearFilters={page.handleClearFilters}
            onFiltersChange={page.handleFiltersChange}
            onExportCSV={page.handleExportCSV}
            onExportExcel={page.handleExportExcel}
            onExportPDF={page.handleExportPDF}
            onView={page.handleViewClick}
            onEdit={page.handleEditClick}
            onDelete={page.handleDeleteClick}
            onSort={page.handleSort}
            onPerPageChange={page.handlePerPageChange}
            onPageChange={page.setCurrentPage}
            onAddClick={page.handleAddClick}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-0 space-y-6">
          <DepartmentHierarchy departments={page.departments} onView={page.handleViewClick} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0 space-y-6">
          <DepartmentAnalytics departments={page.departments} />
        </TabsContent>
      </Tabs>

      <DepartmentFormDialog
        open={page.formOpen}
        onOpenChange={page.handleFormOpenChange}
        department={page.selectedDepartment}
        isEditMode={page.isEditMode}
        isLoading={page.selectedDepartmentLoading}
        existingDepartments={page.existingDepartments}
        onSave={page.handleSaveDepartment}
        isSaving={page.isSaving}
      />

      <DepartmentProfileDrawer
        open={page.profileOpen}
        onOpenChange={page.setProfileOpen}
        department={page.profileDept}
        departments={page.departments}
        onAddEmployee={page.addEmployeeToDept}
        onRemoveEmployee={page.removeEmployeeFromDept}
        onTransferEmployee={page.onTransferEmployee}
        onPromoteEmployee={page.handlePromoteEmployee}
        onUpdateDepartment={page.handleSaveDepartment}
      />

      <ImportDialog
        open={page.importOpen}
        onOpenChange={page.setImportOpen}
        existingDepartments={page.existingDepartments}
        onImport={page.handleImportDepartments}
      />

      {/* Bulk dialogs disabled */}
      {/* <DepartmentsBulkDialogs
        bulkAssignManagerOpen={page.bulkAssignManagerOpen}
        onBulkAssignManagerOpenChange={page.setBulkAssignManagerOpen}
        bulkManagerId={page.bulkManagerId}
        onBulkManagerIdChange={page.setBulkManagerId}
        managers={page.managers}
        selectedCount={page.selectedIds.length}
        onConfirmBulkAssignManager={page.handleConfirmBulkAssignManager}
        bulkTransferOpen={page.bulkTransferOpen}
        onBulkTransferOpenChange={page.setBulkTransferOpen}
        bulkTransferTargetDeptId={page.bulkTransferTargetDeptId}
        onBulkTransferTargetDeptIdChange={page.setBulkTransferTargetDeptId}
        departments={page.departments}
        selectedIds={page.selectedIds}
        onConfirmBulkTransfer={page.handleConfirmBulkTransfer}
      /> */}

      <DepartmentsDeleteDialogs
        deleteAlertOpen={page.deleteAlertOpen}
        onDeleteAlertOpenChange={page.setDeleteAlertOpen}
        deptToDelete={page.deptToDelete}
        onConfirmDelete={page.handleConfirmDelete}
        cannotDeleteAlertOpen={page.cannotDeleteAlertOpen}
        onCannotDeleteAlertOpenChange={page.setCannotDeleteAlertOpen}
      />
    </div>
  );
}
