import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useExitManagement,
  exportExitReportCsv,
  ExitHeaderActions,
  ExitStatsCards,
  ExitRequestsPipeline,
  ExitAttritionAnalytics,
  CreateExitModal,
  RejectExitModal,
  DeactivateEmployeeModal,
  DocumentPreviewModal,
  ExitDetailSheet,
} from "@/features/exit-management";

export function ExitManagementPage() {
  const m = useExitManagement();

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <ExitHeaderActions
        onExport={() => exportExitReportCsv(m.exits)}
        onCreateClick={() => m.setCreateOpen(true)}
      />

      {/* 2. STATS CARDS */}
      <ExitStatsCards stats={m.stats} />

      {/* 3. TABS CONTAINER */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-muted border border-border p-1 rounded-xl h-10 w-fit shrink-0">
          <TabsTrigger
            value="requests"
            className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer"
          >
            Exit Requests Pipeline
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer"
          >
            Attrition Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <ExitRequestsPipeline
            q={m.q}
            setQ={m.setQ}
            activeFilter={m.activeFilter}
            setActiveFilter={m.setActiveFilter}
            currentPage={m.currentPage}
            setCurrentPage={m.setCurrentPage}
            totalPages={m.totalPages}
            paginatedExits={m.paginatedExits}
            onRowClick={m.openDetailCase}
            onApprove={m.handleApproval}
            onReject={m.handleRejectPrompt}
            onStartClearance={m.handleStartClearance}
            onDeactivatePrompt={m.handleDeactivatePrompt}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExitAttritionAnalytics
            attritionChartData={m.attritionChartData}
            monthlyExitTrends={m.monthlyExitTrends}
          />
        </TabsContent>
      </Tabs>

      {/* Modals & Detail Sheet */}
      <CreateExitModal
        open={m.createOpen}
        onOpenChange={m.setCreateOpen}
        empName={m.empName}
        setEmpName={m.setEmpName}
        employees={m.authWs.employees}
        resignDate={m.resignDate}
        setResignDate={m.setResignDate}
        noticeDays={m.noticeDays}
        setNoticeDays={m.setNoticeDays}
        resignReason={m.resignReason}
        setResignReason={m.setResignReason}
        onSubmit={m.handleCreateSubmit}
      />

      <RejectExitModal
        open={m.rejectOpen}
        onOpenChange={m.setRejectOpen}
        rejectionReason={m.rejectionReason}
        setRejectionReason={m.setRejectionReason}
        onConfirm={m.handleRejectSubmit}
      />

      <DeactivateEmployeeModal
        open={m.deactivateOpen}
        onOpenChange={m.setDeactivateOpen}
        employeeName={m.targetCase?.employee}
        onConfirm={m.handleDeactivateConfirm}
      />

      <DocumentPreviewModal
        text={m.previewDocText}
        onClose={() => m.setPreviewDocText(null)}
      />

      <ExitDetailSheet
        detailCase={m.detailCase}
        onClose={() => m.setDetailCase(null)}
        onApproval={m.handleApproval}
        onAssetReturnStatus={m.handleAssetReturnStatus}
        onDeptClearanceStatus={m.handleDeptClearanceStatus}
        settleSalary={m.settleSalary}
        setSettleSalary={m.setSettleSalary}
        settleLeave={m.settleLeave}
        setSettleLeave={m.setSettleLeave}
        settleBonus={m.settleBonus}
        setSettleBonus={m.setSettleBonus}
        settleIncentive={m.settleIncentive}
        setSettleIncentive={m.setSettleIncentive}
        settleDeduction={m.settleDeduction}
        setSettleDeduction={m.setSettleDeduction}
        settleRecovery={m.settleRecovery}
        setSettleRecovery={m.setSettleRecovery}
        onUpdateSettlement={m.handleUpdateSettlement}
        onPaySettlement={m.handlePaySettlement}
        onPreviewLetter={m.handlePreviewLetter}
        onGenerateDoc={m.handleGenerateDoc}
        intReason={m.intReason}
        setIntReason={m.setIntReason}
        intRating={m.intRating}
        setIntRating={m.setIntRating}
        intMgrFeedback={m.intMgrFeedback}
        setIntMgrFeedback={m.setIntMgrFeedback}
        intCompFeedback={m.intCompFeedback}
        setIntCompFeedback={m.setIntCompFeedback}
        intSuggestions={m.intSuggestions}
        setIntSuggestions={m.setIntSuggestions}
        onSaveInterview={m.handleSaveInterview}
        onDeactivatePrompt={m.handleDeactivatePrompt}
      />
    </div>
  );
}

export default ExitManagementPage;
