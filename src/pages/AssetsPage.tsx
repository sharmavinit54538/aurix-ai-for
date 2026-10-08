import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAurix } from "@/lib/aurix-store";
import { EmployeeMyAssetsView } from "@/features/portal/employee/components/EmployeeMyAssetsView";
import type { Asset } from "@/features/assets";
import {
  useAssetsData,
  useAssetForms,
  AssetsStatsCards,
  AssetsTopActions,
  AssetsInventoryTable,
  AssetsReportsTab,
  AddAssetModal,
  EditAssetModal,
  AssignAssetModal,
  TransferAssetModal,
  RepairAssetModal,
  DeleteAssetModal,
  QrStickerModal,
  ScanQrModal,
  AssetDetailSheet,
} from "@/features/assets";

export function AssetsPage() {
  const authWs = useAurix();

  // Search & Filter state
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Detail Sheet state
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);

  // Data fetching hook
  const {
    assets,
    isLoading,
    stats,
    notifications,
    categoryChartData,
    repairCostChartData,
    searchParams,
  } = useAssetsData(q, statusFilter, setDetailAsset);

  // Forms and mutations hook
  const forms = useAssetForms(assets, detailAsset, setDetailAsset);

  const isEmployee = authWs.user?.role === "employee" || searchParams?.view === "my";

  // Search & Status filters
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchQ =
        !q ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.tag.toLowerCase().includes(q.toLowerCase()) ||
        a.serial.toLowerCase().includes(q.toLowerCase()) ||
        (a.brand && a.brand.toLowerCase().includes(q.toLowerCase())) ||
        (a.assignedTo && a.assignedTo.toLowerCase().includes(q.toLowerCase()));

      let matchStatus = true;
      if (statusFilter !== "all") {
        if (statusFilter === "retired") {
          matchStatus = a.status === "retired" || a.status === "expired";
        } else {
          matchStatus = a.status === statusFilter;
        }
      }

      return matchQ && matchStatus;
    });
  }, [assets, q, statusFilter]);

  const paginatedAssets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAssets.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAssets, currentPage]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  // If viewing in Employee Portal self-service mode, render dedicated EmployeeMyAssetsView
  if (isEmployee) {
    return <EmployeeMyAssetsView apiAssets={assets} isLoading={isLoading} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP ACTIONS */}
      <AssetsTopActions
        assets={assets}
        onOpenScan={() => forms.setScanOpen(true)}
        onOpenAdd={() => forms.setAddOpen(true)}
      />

      {/* 2. STATS CARDS */}
      <AssetsStatsCards stats={stats} />

      {/* 3. TABS CONTAINER: INVENTORY TABLE OR ANALYTICS REPORTS */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-muted border border-border p-1 rounded-xl h-10 w-fit shrink-0">
          <TabsTrigger value="inventory" className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer">
            Assets Inventory
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer">
            Analytics & Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <AssetsInventoryTable
            q={q}
            setQ={setQ}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            paginatedAssets={paginatedAssets}
            employees={authWs.employees}
            onSelectAsset={setDetailAsset}
            onOpenQr={asset => {
              forms.setTargetAsset(asset);
              forms.setQrOpen(true);
            }}
            onAssignOpen={forms.handleAssignOpen}
            onReturnAsset={forms.handleReturnAsset}
            onTransferOpen={forms.handleTransferOpen}
            onRepairOpen={forms.handleRepairOpen}
            onEditOpen={forms.handleEditOpen}
            onDeleteOpen={asset => {
              forms.setTargetAsset(asset);
              forms.setDeleteOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AssetsReportsTab
            assets={assets}
            categoryChartData={categoryChartData}
            repairCostChartData={repairCostChartData}
          />
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <AddAssetModal
        open={forms.addOpen}
        onOpenChange={forms.setAddOpen}
        onSubmit={forms.handleAddSubmit}
        assetName={forms.assetName}
        setAssetName={forms.setAssetName}
        assetCategory={forms.assetCategory}
        setAssetCategory={forms.setAssetCategory}
        brand={forms.brand}
        setBrand={forms.setBrand}
        model={forms.model}
        setModel={forms.setModel}
        serial={forms.serial}
        setSerial={forms.setSerial}
        purchaseDate={forms.purchaseDate}
        setPurchaseDate={forms.setPurchaseDate}
        purchaseCost={forms.purchaseCost}
        setPurchaseCost={forms.setPurchaseCost}
        vendor={forms.vendor}
        setVendor={forms.setVendor}
        warrantyUntil={forms.warrantyUntil}
        setWarrantyUntil={forms.setWarrantyUntil}
        location={forms.location}
        setLocation={forms.setLocation}
        notes={forms.notes}
        setNotes={forms.setNotes}
        imageUrl={forms.imageUrl}
        setImageUrl={forms.setImageUrl}
      />

      <EditAssetModal
        open={forms.editOpen}
        onOpenChange={forms.setEditOpen}
        onSubmit={forms.handleEditSubmit}
        assetName={forms.assetName}
        setAssetName={forms.setAssetName}
        assetCategory={forms.assetCategory}
        setAssetCategory={forms.setAssetCategory}
        brand={forms.brand}
        setBrand={forms.setBrand}
        model={forms.model}
        setModel={forms.setModel}
        serial={forms.serial}
        setSerial={forms.setSerial}
        purchaseDate={forms.purchaseDate}
        setPurchaseDate={forms.setPurchaseDate}
        purchaseCost={forms.purchaseCost}
        setPurchaseCost={forms.setPurchaseCost}
        vendor={forms.vendor}
        setVendor={forms.setVendor}
        warrantyUntil={forms.warrantyUntil}
        setWarrantyUntil={forms.setWarrantyUntil}
        location={forms.location}
        setLocation={forms.setLocation}
        notes={forms.notes}
        setNotes={forms.setNotes}
      />

      <AssignAssetModal
        open={forms.assignOpen}
        onOpenChange={forms.setAssignOpen}
        onSubmit={forms.handleAssignSubmit}
        targetAsset={forms.targetAsset}
        assignEmpId={forms.assignEmpId}
        setAssignEmpId={forms.setAssignEmpId}
        assignReturnDate={forms.assignReturnDate}
        setAssignReturnDate={forms.setAssignReturnDate}
        assignNotes={forms.assignNotes}
        setAssignNotes={forms.setAssignNotes}
        employees={authWs.employees}
      />

      <TransferAssetModal
        open={forms.transferOpen}
        onOpenChange={forms.setTransferOpen}
        onSubmit={forms.handleTransferSubmit}
        targetAsset={forms.targetAsset}
        transferEmpId={forms.transferEmpId}
        setTransferEmpId={forms.setTransferEmpId}
        transferNotes={forms.transferNotes}
        setTransferNotes={forms.setTransferNotes}
        employees={authWs.employees}
      />

      <RepairAssetModal
        open={forms.repairOpen}
        onOpenChange={forms.setRepairOpen}
        onSubmit={forms.handleRepairSubmit}
        targetAsset={forms.targetAsset}
        repairVendor={forms.repairVendor}
        setRepairVendor={forms.setRepairVendor}
        repairCost={forms.repairCost}
        setRepairCost={forms.setRepairCost}
        repairNotes={forms.repairNotes}
        setRepairNotes={forms.setRepairNotes}
      />

      <DeleteAssetModal
        open={forms.deleteOpen}
        onOpenChange={forms.setDeleteOpen}
        onConfirm={forms.handleDeleteSubmit}
        targetAsset={forms.targetAsset}
      />

      <QrStickerModal
        open={forms.qrOpen}
        onOpenChange={forms.setQrOpen}
        targetAsset={forms.targetAsset}
        currentUserFullName={authWs.user?.fullName}
        onRegenerateQr={(updated, notesAppend) => {
          forms.mutations.editMutation.mutate({
            id: updated.id,
            payload: {
              notes: (forms.targetAsset?.notes || "") + notesAppend,
            },
          });
        }}
      />

      <ScanQrModal
        open={forms.scanOpen}
        onOpenChange={forms.setScanOpen}
        assets={assets}
        scannedAssetTag={forms.scannedAssetTag}
        setScannedAssetTag={forms.setScannedAssetTag}
        onConfirmScan={forms.handleScanSimulation}
      />

      {/* DETAIL SLIDE-OUT SHEET */}
      <AssetDetailSheet
        detailAsset={detailAsset}
        setDetailAsset={setDetailAsset}
        employees={authWs.employees}
        currentUserFullName={authWs.user?.fullName}
        onOpenQr={asset => {
          forms.setTargetAsset(asset);
          forms.setQrOpen(true);
        }}
        onAssignOpen={forms.handleAssignOpen}
        onReturnAsset={forms.handleReturnAsset}
        onTransferOpen={forms.handleTransferOpen}
        onRepairOpen={forms.handleRepairOpen}
        onMarkRetired={forms.handleMarkRetired}
        onMarkLost={forms.handleMarkLost}
        onUpdateNotes={(assetId, notes) => {
          forms.mutations.editMutation.mutate({
            id: assetId,
            payload: { notes },
          });
        }}
      />
    </div>
  );
}

export default AssetsPage;
