import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Plus, QrCode as QrIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees } from "@/hooks/useEmployees";
import type { Asset } from "@/lib/hrms/types";

import { AssetAlerts } from "../features/dashboard/assets/components/AssetAlterts";
import { AssetDetailsSheet } from "@/features/dashboard/assets/components/AssetDetailsSheet";
import { AssetReports } from "@/features/dashboard/assets/components/AssetReports";
import { AssetStatCards } from "@/features/dashboard/assets/components/AssetStatCards";
import { AssetsTable } from "../features/dashboard/assets/components/AssetTable";
import { QrScannerWidget } from "@/features/dashboard/assets/components/QrScannerWidget";
import { AddAssetDialog } from "@/features/dashboard/assets/components/dialogs/AddAssetDialog";
import { DeleteAssetDialog } from "@/features/dashboard/assets/components/dialogs/DeleteAssetDialog";
import { EditAssetDialog } from "@/features/dashboard/assets/components/dialogs/EditAssetDialog";
import { AssignAssetDialog } from "@/features/dashboard/assets/components/dialogs/AssignAssetDialog";
import { QrStickerDialog } from "../features/dashboard/assets/components/dialogs/QrStickerdialog";
import { RepairAssetDialog } from "@/features/dashboard/assets/components/dialogs/RepairAssetDialog";
import { ScanQrDialog } from "@/features/dashboard/assets/components/dialogs/ScanQrDialog";
import { TransferAssetDialog } from "../features/dashboard/assets/components/dialogs/TransferAssetDoalog";

import { ITEMS_PER_PAGE } from "@/features/dashboard/assets/constants";
import { useAssetMutations } from "../features/dashboard/assets/hooks/useAssetsMutations";
import { useAssetNotifications } from "@/features/dashboard/assets/hooks/useAssetNotifications";
import { extractAnalytics, extractAssets, useAssetsAnalytics, useAssetsList } from "@/features/dashboard/assets/hooks/useAssetsQueries";
import { exportAssetsToCsv } from "@/features/dashboard/assets/utils";

export const Route = createFileRoute("/dashboard/assets")({
  head: () => ({ meta: [{ title: "Asset Management — Aurix" }] }),
  component: AssetsPage,
});

type DialogKey = "add" | "edit" | "assign" | "transfer" | "repair" | "delete" | "qr" | "scan";

function AssetsPage() {
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const navigate = useNavigate();

  // Search / filter / pagination
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Selection + dialog visibility
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [targetAsset, setTargetAsset] = useState<Asset | null>(null);
  const [openDialog, setOpenDialog] = useState<DialogKey | null>(null);
  const [scannedAssetTag, setScannedAssetTag] = useState("");

  const isOpen = (key: DialogKey) => openDialog === key;
  const openWith = (key: DialogKey, asset?: Asset) => {
    if (asset) setTargetAsset(asset);
    setOpenDialog(key);
  };
  const closeDialog = () => setOpenDialog(null);

  // Data
  const { data: listData } = useAssetsList(q, statusFilter);
  const { data: analyticsData } = useAssetsAnalytics();
  const assets = extractAssets(listData);
  const stats = extractAnalytics(analyticsData);
  const mutations = useAssetMutations();
  const notifications = useAssetNotifications(assets);

  // Deep-link QR scan (e.g. ?scan=LAP-1234)
  const searchParams = useRouterState({ select: (s) => s.location.search }) as Record<string, string>;
  useEffect(() => {
    if (searchParams?.scan && assets.length > 0) {
      const matched = assets.find((a) => a.id === searchParams.scan || a.tag === searchParams.scan);
      if (matched) {
        setDetailAsset(matched);
        toast.success(`Scanned QR Code for asset: ${matched.tag} (${matched.name})`);
        navigate({ to: "/dashboard/assets", search: {} as any, replace: true });
      }
    }
  }, [searchParams, assets, navigate]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchQ =
        !q ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.tag.toLowerCase().includes(q.toLowerCase()) ||
        a.serial.toLowerCase().includes(q.toLowerCase()) ||
        (a.brand && a.brand.toLowerCase().includes(q.toLowerCase())) ||
        (a.assignedTo && a.assignedTo.toLowerCase().includes(q.toLowerCase()));

      let matchStatus = true;
      if (statusFilter !== "all") {
        matchStatus = statusFilter === "retired" ? a.status === "retired" || a.status === "expired" : a.status === statusFilter;
      }
      return matchQ && matchStatus;
    });
  }, [assets, q, statusFilter]);

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAssets, currentPage]);

  const handleReturnAsset = (asset: Asset) => mutations.returnMutation.mutate(asset.id);
  const handleMarkLost = (asset: Asset) => mutations.lostMutation.mutate(asset.id);
  const handleMarkRetired = (asset: Asset) => mutations.retiredMutation.mutate(asset.id);

  const handleScanSimulation = () => {
    if (!scannedAssetTag) return;
    const matched = assets.find((a) => a.tag === scannedAssetTag || a.id === scannedAssetTag);
    if (matched) {
      setDetailAsset(matched);
      closeDialog();
      toast.success(`Scanned QR tag: ${matched.tag}`);
    } else {
      toast.error("No asset matching this scanned tag found.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Management"
        description="Monitor configurations, assignments, QR codes, and maintenance records of company hardware."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDialog("scan")}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <QrIcon className="h-4 w-4" />
              Scan QR Code
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                exportAssetsToCsv(assets);
                toast.success("Inventory exported as CSV");
              }}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => setOpenDialog("add")}
              className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        }
      />

      <AssetStatCards stats={stats} />

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-card/60 border border-border p-1 rounded-xl h-10 w-fit shrink-0">
          <TabsTrigger value="inventory" className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer">
            Assets Inventory
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer">
            Analytics & Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="space-y-4 lg:col-span-3">
              <AssetsTable
                assets={paginatedAssets}
                employees={employees}
                query={q}
                onQueryChange={(v) => {
                  setQ(v);
                  setCurrentPage(1);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onRowClick={setDetailAsset}
                onQrClick={(a) => openWith("qr", a)}
                onAssign={(a) => openWith("assign", a)}
                onReturn={handleReturnAsset}
                onTransfer={(a) => openWith("transfer", a)}
                onRepair={(a) => openWith("repair", a)}
                onEdit={(a) => openWith("edit", a)}
                onDeleteRequest={(a) => openWith("delete", a)}
              />
            </div>

            <div className="space-y-6 lg:col-span-1">
              <QrScannerWidget
                assets={assets}
                scannedAssetTag={scannedAssetTag}
                onScannedAssetTagChange={setScannedAssetTag}
                onScan={handleScanSimulation}
              />
              <AssetAlerts alerts={notifications} onViewAsset={setDetailAsset} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AssetReports
            assets={assets}
            categoryChartData={stats.category_distribution || []}
            repairCostChartData={stats.repair_costs_by_category || []}
          />
        </TabsContent>
      </Tabs>

      <AddAssetDialog
        open={isOpen("add")}
        onOpenChange={(o) => (o ? setOpenDialog("add") : closeDialog())}
        mutations={mutations}
        onCreated={(newAsset) => openWith("qr", newAsset)}
      />
      <EditAssetDialog
        open={isOpen("edit")}
        onOpenChange={(o) => (o ? setOpenDialog("edit") : closeDialog())}
        asset={targetAsset}
        mutations={mutations}
      />
      <AssignAssetDialog
        open={isOpen("assign")}
        onOpenChange={(o) => (o ? setOpenDialog("assign") : closeDialog())}
        asset={targetAsset}
        employees={employees}
        employeesLoading={employeesLoading}
        mutations={mutations}
        onAssigned={(updatedAsset) => openWith("qr", updatedAsset)}
      />
      <TransferAssetDialog
        open={isOpen("transfer")}
        onOpenChange={(o) => (o ? setOpenDialog("transfer") : closeDialog())}
        asset={targetAsset}
        employees={employees}
        mutations={mutations}
      />
      <RepairAssetDialog
        open={isOpen("repair")}
        onOpenChange={(o) => (o ? setOpenDialog("repair") : closeDialog())}
        asset={targetAsset}
        mutations={mutations}
      />
      <DeleteAssetDialog
        open={isOpen("delete")}
        onOpenChange={(o) => (o ? setOpenDialog("delete") : closeDialog())}
        asset={targetAsset}
        mutations={mutations}
      />
      <QrStickerDialog
        open={isOpen("qr")}
        onOpenChange={(o) => (o ? setOpenDialog("qr") : closeDialog())}
        asset={targetAsset}
        mutations={mutations}
      />
      <ScanQrDialog
        open={isOpen("scan")}
        onOpenChange={(o) => (o ? setOpenDialog("scan") : closeDialog())}
        assets={assets}
        scannedAssetTag={scannedAssetTag}
        onScannedAssetTagChange={setScannedAssetTag}
        onConfirmScan={handleScanSimulation}
      />

      <AssetDetailsSheet
        asset={detailAsset}
        onClose={() => setDetailAsset(null)}
        employees={employees}
        mutations={mutations}
        onAssign={(a) => openWith("assign", a)}
        onReturn={handleReturnAsset}
        onTransfer={(a) => openWith("transfer", a)}
        onRepair={(a) => openWith("repair", a)}
        onRetire={handleMarkRetired}
        onMarkLost={handleMarkLost}
        onQr={(a) => openWith("qr", a)}
        onPrintSticker={(a) => openWith("qr", a)}
      />
    </div>
  );
}
