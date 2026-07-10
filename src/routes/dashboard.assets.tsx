import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Package, Search, Plus, Upload, Download, CheckCircle2, Clock, XCircle, Wrench,
  QrCode, Trash2, Edit, Printer, FileSpreadsheet, RefreshCw, Info, Calendar,
  User, Building2, MapPin, Tag, ShieldCheck, DollarSign, ExternalLink, QrCode as QrIcon,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import { useAurix } from "@/lib/aurix-store";
import type { Asset, AssetCategory, AssetStatus, AssetAssignmentHistory, AssetMaintenanceRecord, AssetTimelineEvent } from "@/lib/hrms/types";
import { QrTile } from "@/components/hrms/Shared";
import { toast } from "sonner";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Pie, PieChart, Cell
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

// ----------------------------------------------------
// ROUTE DEFINITION
// ----------------------------------------------------
export const Route = createFileRoute("/dashboard/assets")({
  head: () => ({ meta: [{ title: "Asset Management — Aurix" }] }),
  component: AssetsPage,
});

// ----------------------------------------------------
// CONSTANTS
// ----------------------------------------------------
const CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "laptop", label: "Laptops" },
  { value: "desktop", label: "Desktops" },
  { value: "monitor", label: "Monitors" },
  { value: "phone", label: "Phones" },
  { value: "accessory", label: "Accessories" },
  { value: "vehicle", label: "Vehicles" },
  { value: "other", label: "Other Equipment" },
];

const STATUSES: { value: AssetStatus; label: string; color: string; bg: string }[] = [
  { value: "available", label: "Available", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "assigned", label: "Assigned", color: "text-blue-500", bg: "bg-blue-500/10" },
  { value: "under-repair", label: "Under Repair", color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "lost", label: "Lost", color: "text-rose-500", bg: "bg-rose-500/10" },
  { value: "expired", label: "Expired/Retired", color: "text-neutral-500", bg: "bg-neutral-500/10" },
  { value: "retired", label: "Retired", color: "text-purple-500", bg: "bg-purple-500/10" },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#6b7280"];

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
function AssetsPage() {
  const authWs = useAurix(); // For employees list
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Search & Filter state
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals / Details Sheet
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [repairOpen, setRepairOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  // Targets / Form states
  const [targetAsset, setTargetAsset] = useState<Asset | null>(null);
  const [scannedAssetTag, setScannedAssetTag] = useState("");

  // Add/Edit Form State
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState<AssetCategory>("laptop");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [purchaseCost, setPurchaseCost] = useState("1200");
  const [vendor, setVendor] = useState("");
  const [warrantyUntil, setWarrantyUntil] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Assignment Form State
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignReturnDate, setAssignReturnDate] = useState("");
  const [assignNotes, setAssignNotes] = useState("");

  // Transfer Form State
  const [transferEmpId, setTransferEmpId] = useState("");
  const [transferNotes, setTransferNotes] = useState("");

  // Repair Form State
  const [repairVendor, setRepairVendor] = useState("");
  const [repairCost, setRepairCost] = useState("150");
  const [repairNotes, setRepairNotes] = useState("");

  // Queries
  const { data: listData, isLoading } = useQuery({
    queryKey: ["assets", q, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      params.set("limit", "100");
      return api.get(`assets?${params.toString()}`);
    }
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["assets-analytics"],
    queryFn: () => api.get("assets/analytics")
  });

  const assets: Asset[] = listData?.data?.items || [];
  const apiStats = analyticsData?.data || {
    total_assets: 0,
    available_assets: 0,
    assigned_assets: 0,
    under_repair_assets: 0,
    lost_assets: 0,
    expiring_warranty_assets: 0
  };

  // ----------------------------------------------------
  // PARSE DEEP LINK QR SCAN
  // ----------------------------------------------------
  const searchParams = useRouterState({ select: (s) => s.location.search }) as Record<string, string>;
  useEffect(() => {
    if (searchParams && searchParams.scan && assets.length > 0) {
      const matched = assets.find(a => a.id === searchParams.scan || a.tag === searchParams.scan);
      if (matched) {
        setDetailAsset(matched);
        toast.success(`Scanned QR Code for asset: ${matched.tag} (${matched.name})`);
        // Clean URL params
        navigate({ to: "/dashboard/assets", search: {} as any, replace: true });
      }
    }
  }, [searchParams, assets, navigate]);

  const showApiError = (err: any, fallback: string) => {
    let msg = err.message || fallback;
    if (err.data && err.data.detail && Array.isArray(err.data.detail)) {
      const details = err.data.detail.map((d: any) => `${d.loc.slice(1).join(".")} : ${d.msg}`).join(", ");
      msg = `Validation error: ${details}`;
    } else if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
      msg = err.data.errors.map((e: any) => e.message).join(", ");
    }
    toast.error(msg);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newAsset: any) => api.post("assets", newAsset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success("Asset created successfully!");
      setAddOpen(false);
      // Reset form states
      setAssetName("");
      setBrand("");
      setModel("");
      setSerial("");
      setPurchaseCost("1200");
      setVendor("");
      setNotes("");
      setLocation("");
    },
    onError: (err: any) => {
      showApiError(err, "Failed to create asset");
    }
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.put(`assets/${id}`, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success("Asset specifications updated successfully.");
      setEditOpen(false);
      if (detailAsset?.id === res.data.id) {
        setDetailAsset(res.data);
      }
    },
    onError: (err: any) => {
      showApiError(err, "Failed to update asset specifications");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`assets/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.error("Asset record deleted successfully.");
      setDeleteOpen(false);
      if (detailAsset?.id === targetAsset?.id) setDetailAsset(null);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to delete asset");
    }
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/assign`, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Asset assigned successfully!`);
      setAssignOpen(false);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to assign asset");
    }
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/return`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Asset returned and checked back in.`);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to return asset");
    }
  });

  const transferMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/transfer`, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Transferred asset successfully!`);
      setTransferOpen(false);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to transfer asset");
    }
  });

  const lostMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/lost`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.warning(`Asset has been flagged as lost.`);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to mark asset as lost");
    }
  });

  const retiredMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/retired`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.info(`Asset decommissioned and retired.`);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to retire asset");
    }
  });

  const repairMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/maintenance`, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.info(`Asset status set to Under Repair`);
      setRepairOpen(false);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to send asset for repair");
    }
  });

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------

  // 1. Create Asset
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !serial || !brand) {
      toast.error("Please fill in Asset Name, Brand, and Serial Number.");
      return;
    }

    const tagPrefix = {
      laptop: "LAP",
      desktop: "DKT",
      monitor: "MON",
      phone: "PHN",
      accessory: "ACC",
      vehicle: "VEH",
      other: "AST"
    }[assetCategory] || "AST";
    const assetTag = `${tagPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const costNum = parseFloat(purchaseCost) || 0;

    createMutation.mutate({
      tag: assetTag,
      name: assetName,
      category: assetCategory,
      serial: serial,
      vendor: vendor || "Unknown Vendor",
      purchase_date: purchaseDate,
      warranty_until: warrantyUntil || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      brand: brand,
      model: model,
      purchase_cost: costNum,
      location: location || "HQ IT Desk",
      notes: notes
    });
  };

  // 2. Edit Asset Open
  const handleEditOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setAssetName(asset.name);
    setAssetCategory(asset.category);
    setBrand(asset.brand || "");
    setModel(asset.model || "");
    setSerial(asset.serial);
    setPurchaseDate(asset.purchaseDate);
    setPurchaseCost(asset.purchaseCost?.toString() || "");
    setVendor(asset.vendor);
    setWarrantyUntil(asset.warrantyUntil);
    setLocation(asset.location || "");
    setNotes(asset.notes || "");
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset) return;

    editMutation.mutate({
      id: targetAsset.id,
      payload: {
        name: assetName,
        category: assetCategory,
        brand,
        model,
        serial,
        purchase_date: purchaseDate,
        purchase_cost: parseFloat(purchaseCost) || 0,
        vendor,
        warranty_until: warrantyUntil,
        location,
        notes
      }
    });
  };

  // 3. Delete Asset
  const handleDeleteSubmit = () => {
    if (!targetAsset) return;
    deleteMutation.mutate(targetAsset.id);
  };

  // 4. Assign Asset
  const handleAssignOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setAssignNotes("");
    setAssignReturnDate("");
    if (authWs.employees.length > 0) setAssignEmpId(authWs.employees[0].fullName);
    setAssignOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset || !assignEmpId) return;

    const emp = authWs.employees.find(x => x.fullName === assignEmpId) || { fullName: assignEmpId, department: "General Operations" };

    assignMutation.mutate({
      id: targetAsset.id,
      payload: {
        employee_name: emp.fullName,
        department: emp.department,
        expected_return_date: assignReturnDate || null,
        notes: assignNotes
      }
    });
  };

  // 5. Return Asset
  const handleReturnAsset = (asset: Asset) => {
    returnMutation.mutate(asset.id);
  };

  // 6. Transfer Asset
  const handleTransferOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setTransferNotes("");
    if (authWs.employees.length > 0) setTransferEmpId(authWs.employees[0].fullName);
    setTransferOpen(true);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset || !transferEmpId) return;

    const emp = authWs.employees.find(x => x.fullName === transferEmpId) || { fullName: transferEmpId, department: "Operations" };

    transferMutation.mutate({
      id: targetAsset.id,
      payload: {
        employee_name: emp.fullName,
        department: emp.department,
        notes: transferNotes
      }
    });
  };

  // 7. Mark Lost
  const handleMarkLost = (asset: Asset) => {
    lostMutation.mutate(asset.id);
  };

  // 8. Mark Retired
  const handleMarkRetired = (asset: Asset) => {
    retiredMutation.mutate(asset.id);
  };

  // 9. Maintenance / Repairs
  const handleRepairOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setRepairVendor("");
    setRepairCost("150");
    setRepairNotes("");
    setRepairOpen(true);
  };

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset) return;

    repairMutation.mutate({
      id: targetAsset.id,
      payload: {
        vendor: repairVendor || "Authorized Service Partner",
        cost: parseFloat(repairCost) || 0,
        notes: repairNotes
      }
    });
  };

  // Scan simulation URL trigger
  const handleScanSimulation = () => {
    if (!scannedAssetTag) return;
    const matched = assets.find(a => a.tag === scannedAssetTag || a.id === scannedAssetTag);
    if (matched) {
      setDetailAsset(matched);
      setScanOpen(false);
      toast.success(`Scanned QR tag: ${matched.tag}`);
    } else {
      toast.error("No asset matching this scanned tag found.");
    }
  };

  // ----------------------------------------------------
  // METRICS & REPORT CALCULATIONS
  // ----------------------------------------------------

  const stats = useMemo(() => {
    return {
      total: apiStats.total_assets ?? 0,
      available: apiStats.available_assets ?? 0,
      assigned: apiStats.assigned_assets ?? 0,
      repair: apiStats.under_repair_assets ?? 0,
      lost: apiStats.lost_assets ?? 0,
      expiring: apiStats.expiring_warranty_assets ?? 0
    };
  }, [apiStats]);

  const notifications = useMemo(() => {
    const alerts: { id: string; type: "warning" | "error" | "info"; message: string; asset?: Asset }[] = [];

    // Warranty expiring
    const mockNow = new Date("2026-06-28").getTime();
    const thirtyDaysLimit = mockNow + 30 * 24 * 60 * 60 * 1000;
    assets.forEach(a => {
      if (a.warrantyUntil) {
        const wTime = new Date(a.warrantyUntil).getTime();
        if (wTime > 0 && wTime < mockNow) {
          alerts.push({ id: `war_exp_${a.id}`, type: "error", message: `Warranty expired for ${a.tag} (${a.name}) on ${a.warrantyUntil}.`, asset: a });
        } else if (wTime >= mockNow && wTime <= thirtyDaysLimit) {
          alerts.push({ id: `war_soon_${a.id}`, type: "warning", message: `Warranty expiring soon for ${a.tag} on ${a.warrantyUntil}.`, asset: a });
        }
      }
      if (a.status === "lost") {
        alerts.push({ id: `lost_${a.id}`, type: "error", message: `Audit flagged: Asset ${a.tag} is lost. Pending replacement.`, asset: a });
      }
      if (a.status === "under-repair") {
        alerts.push({ id: `rep_${a.id}`, type: "info", message: `${a.tag} is currently in repair at vendor.`, asset: a });
      }
    });

    return alerts;
  }, [assets]);

  // Search & Status filters
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchQ = !q ||
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

  // Paginated assets
  const paginatedAssets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAssets.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAssets, currentPage]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  // Recharts Category Allocation
  const categoryChartData = useMemo(() => {
    return apiStats.category_distribution || [];
  }, [apiStats]);

  // Repair Cost analysis per category
  const repairCostChartData = useMemo(() => {
    return apiStats.repair_costs_by_category || [];
  }, [apiStats]);

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Asset Management"
        description="Monitor configurations, assignments, QR codes, and maintenance records of company hardware."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setScanOpen(true)}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <QrIcon className="h-4 w-4" />
              Scan QR Code
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const headers = ["Asset Tag", "Asset Name", "Category", "Brand", "Model", "Serial", "Purchase Cost", "Purchase Date", "Status", "Assigned Employee"];
                const rows = assets.map(a => [
                  a.tag, a.name, a.category, a.brand || "", a.model || "", a.serial, (a.purchaseCost || 0).toString(), a.purchaseDate, a.status, a.assignedTo || "Unassigned"
                ].map(v => `"${v.replace(/"/g, '""')}"`).join(","));
                const csv = [headers.join(","), ...rows].join("\n");
                const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                const link = document.createElement("a");
                link.href = url;
                link.download = `Aurix_Assets_Inventory_${new Date().toISOString().split("T")[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
                toast.success("Inventory exported as CSV");
              }}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => setAddOpen(true)}
              className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        }
      />

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { key: "total", title: "Total Assets", count: stats.total, color: "text-blue-500", bg: "bg-blue-500/10" },
          { key: "available", title: "Available Assets", count: stats.available, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { key: "assigned", title: "Assigned Assets", count: stats.assigned, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { key: "repair", title: "Under Repair", count: stats.repair, color: "text-amber-500", bg: "bg-amber-500/10" },
          { key: "lost", title: "Lost Assets", count: stats.lost, color: "text-rose-500", bg: "bg-rose-500/10" },
          { key: "expiring", title: "Expiring Warranty", count: stats.expiring, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map(card => (
          <Card key={card.key} className="border-border bg-card/40 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground truncate leading-none">{card.title}</span>
                <span className={`grid h-7 w-7 place-items-center rounded-lg ${card.bg}`}>
                  <Package className={`h-3.5 w-3.5 ${card.color}`} />
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-display tracking-tight leading-none">{card.count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. TABS CONTAINER: INVENTORY TABLE OR ANALYTICS REPORTS */}
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
            {/* INVENTORY TABLE PANEL */}
            <div className="space-y-4 lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
                {/* Search / Filter pill row */}
                <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative max-w-sm flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={q}
                      onChange={e => { setQ(e.target.value); setCurrentPage(1); }}
                      placeholder="Search by ID, name, brand, employee..."
                      className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    {[
                      { id: "all", label: "All Assets" },
                      { id: "available", label: "Available" },
                      { id: "assigned", label: "Assigned" },
                      { id: "under-repair", label: "In Repair" },
                      { id: "lost", label: "Lost" },
                      { id: "retired", label: "Decommissioned" },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => { setStatusFilter(tab.id); setCurrentPage(1); }}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                          statusFilter === tab.id
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Content */}
                {paginatedAssets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
                      <Package className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-foreground">No assets found</p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      No records match the current filters. Adjust your search or register a new asset.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[1000px] border-collapse">
                      <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="px-4 py-3 w-[80px] text-center">QR Code</TableHead>
                          <TableHead className="px-4 py-3">Asset ID / Tag</TableHead>
                          <TableHead className="px-4 py-3">Asset Name</TableHead>
                          <TableHead className="px-4 py-3">Category</TableHead>
                          <TableHead className="px-4 py-3">Brand & Model</TableHead>
                          <TableHead className="px-4 py-3">Serial Number</TableHead>
                          <TableHead className="px-4 py-3">Assigned To</TableHead>
                          <TableHead className="px-4 py-3">Department</TableHead>
                          <TableHead className="px-4 py-3">Warranty Expiry</TableHead>
                          <TableHead className="px-4 py-3 text-center">Status</TableHead>
                          <TableHead className="px-4 py-3 text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAssets.map(asset => {
                          const statusInfo = STATUSES.find(s => s.value === asset.status) || STATUSES[0];
                          const isWSoon = asset.warrantyUntil && new Date(asset.warrantyUntil).getTime() <= new Date("2026-06-28").getTime() + 30 * 24 * 60 * 60 * 1000;

                          return (
                            <TableRow
                              key={asset.id}
                              className="group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer"
                              onClick={() => setDetailAsset(asset)}
                            >
                              {/* QR Code Col */}
                              <TableCell className="px-4 py-2 text-center" onClick={e => { e.stopPropagation(); setTargetAsset(asset); setQrOpen(true); }}>
                                <div className="grid place-items-center h-8 w-8 rounded border border-border bg-white cursor-pointer hover:scale-105 transition-transform" title="Click to view full sticker">
                                  <QrCode className="h-5 w-5 text-slate-800" />
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 font-semibold font-mono text-xs text-foreground/90">
                                {asset.tag}
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <div className="font-semibold text-foreground truncate max-w-[150px]">{asset.name}</div>
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <span className="text-xs text-muted-foreground capitalize">{asset.category}</span>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs text-foreground/80">
                                {asset.brand} <span className="text-muted-foreground">({asset.model || "—"})</span>
                              </TableCell>
                              <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                {asset.serial}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs font-semibold text-foreground/90">
                                {asset.assignedTo || <span className="text-muted-foreground/40 font-normal italic">Unassigned</span>}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                                {asset.assignedTo ? (authWs.employees.find(x => x.fullName === asset.assignedTo)?.department || "Operations") : "—"}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs">
                                <span className={isWSoon ? "text-purple-500 font-semibold" : "text-muted-foreground"}>
                                  {asset.warrantyUntil || "—"}
                                </span>
                              </TableCell>
                              {/* Status Badge */}
                              <TableCell className="px-4 py-3 text-center">
                                <Badge className={`${statusInfo.bg} ${statusInfo.color} border-none shadow-none text-xs font-semibold capitalize`}>
                                  {statusInfo.label}
                                </Badge>
                              </TableCell>
                              {/* Action Row */}
                              <TableCell className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100">
                                  {asset.status === "available" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAssignOpen(asset)}
                                      className="h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/65"
                                    >
                                      Assign
                                    </Button>
                                  )}
                                  {asset.status === "assigned" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReturnAsset(asset)}
                                        className="h-7 text-[10px] px-2 text-emerald-600 border-border cursor-pointer hover:bg-emerald-500/10"
                                      >
                                        Return
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleTransferOpen(asset)}
                                        className="h-7 text-[10px] px-2 text-indigo-500 border-border cursor-pointer hover:bg-indigo-500/10"
                                      >
                                        Transfer
                                      </Button>
                                    </>
                                  )}
                                  {asset.status !== "under-repair" && asset.status !== "retired" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRepairOpen(asset)}
                                      className="h-7 text-[10px] px-2 text-amber-600 border-border cursor-pointer hover:bg-amber-500/10"
                                    >
                                      Repair
                                    </Button>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleEditOpen(asset)}
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => { setTargetAsset(asset); setDeleteOpen(true); }}
                                    className="h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination footer */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      Showing Page <strong className="font-semibold text-foreground">{currentPage}</strong> of <strong className="font-semibold text-foreground">{totalPages}</strong>
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                        className="h-8 border-border hover:bg-accent/60 cursor-pointer"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                        className="h-8 border-border hover:bg-accent/60 cursor-pointer"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: NOTIFICATION ALERTS & SIMULATED SCANNER */}
            <div className="space-y-6 lg:col-span-1">
              {/* Scan simulation Widget */}
              <Card className="border-border bg-card/40 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-indigo-500" />
                    Mobile QR Scanner
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Simulate scanning asset labels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Type or select an asset ID/Tag, then simulate scanning using a mobile device layout.
                  </p>
                  <div className="flex gap-2">
                    <Select value={scannedAssetTag} onValueChange={setScannedAssetTag}>
                      <SelectTrigger className="h-8 text-xs bg-background/50 border-border">
                        <SelectValue placeholder="Select Asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map(a => (
                          <SelectItem key={a.id} value={a.tag}>{a.tag} ({a.brand})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleScanSimulation}
                      disabled={!scannedAssetTag}
                      className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    >
                      Scan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Box */}
              <Card className="border-border bg-card/40 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                    Alerts & Notifications
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Asset events needing attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4 italic">
                      All assets compliant with warranty and returns!
                    </div>
                  ) : (
                    notifications.slice(0, 4).map(alert => (
                      <div
                        key={alert.id}
                        className={`flex gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${
                          alert.type === "error"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                            : alert.type === "warning"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold leading-relaxed">{alert.message}</p>
                          {alert.asset && (
                            <button
                              onClick={() => setDetailAsset(alert.asset!)}
                              className="mt-1 text-[10px] underline font-bold uppercase cursor-pointer"
                            >
                              View Asset Details
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Chart 1: Category Allocation */}
            <Card className="border-border bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Category Allocation</CardTitle>
                <CardDescription className="text-xs">Count of assets by category classification</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Chart 2: Repair Costs per Category */}
            <Card className="border-border bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Maintenance Repair Costs ($)</CardTitle>
                <CardDescription className="text-xs">Accumulated service and parts expenditure by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repairCostChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="category" style={{ fontSize: 9 }} />
                    <YAxis style={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Total Repair Cost ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost and inventory summary lists */}
            <Card className="border-border bg-card/40 backdrop-blur-xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Asset Financial Summary</CardTitle>
                <CardDescription className="text-xs">Capital expenditures and maintenance records per asset item</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table className="text-xs border-collapse">
                  <TableHeader className="bg-muted/10 border-b border-border">
                    <TableRow>
                      <TableHead className="px-4 py-2.5">Asset</TableHead>
                      <TableHead className="px-4 py-2.5">Category</TableHead>
                      <TableHead className="px-4 py-2.5">Owner</TableHead>
                      <TableHead className="px-4 py-2.5">Purchase Date</TableHead>
                      <TableHead className="px-4 py-2.5 text-right">Purchase Cost</TableHead>
                      <TableHead className="px-4 py-2.5 text-right">Repair Cost</TableHead>
                      <TableHead className="px-4 py-2.5 text-right">Total Lifetime Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map(a => {
                      const repCost = (a.maintenanceHistory || []).reduce((sum, r) => sum + r.cost, 0);
                      const lifeCost = (a.purchaseCost || 0) + repCost;
                      return (
                        <TableRow key={a.id} className="border-t border-border hover:bg-accent/15">
                          <TableCell className="px-4 py-2 font-medium">{a.tag} &bull; {a.name}</TableCell>
                          <TableCell className="px-4 py-2 capitalize text-muted-foreground">{a.category}</TableCell>
                          <TableCell className="px-4 py-2">{a.assignedTo || "Available"}</TableCell>
                          <TableCell className="px-4 py-2 text-muted-foreground">{a.purchaseDate}</TableCell>
                          <TableCell className="px-4 py-2 text-right">${a.purchaseCost || 0}</TableCell>
                          <TableCell className="px-4 py-2 text-right text-amber-500">${repCost}</TableCell>
                          <TableCell className="px-4 py-2 text-right font-semibold">${lifeCost}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ----------------------------------------------------
          ADD ASSET MODAL
         ---------------------------------------------------- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg">Register New Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Asset Name</Label>
                <Input value={assetName} onChange={e => setAssetName(e.target.value)} placeholder="e.g. MacBook Pro M3" className="bg-background/50 border-border" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={assetCategory} onValueChange={(val: AssetCategory) => setAssetCategory(val)}>
                  <SelectTrigger className="bg-background/50 border-border text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Serial Number</Label>
                <Input value={serial} onChange={e => setSerial(e.target.value)} placeholder="C02XJ192" className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Brand</Label>
                <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Apple" className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Model Specification</Label>
                <Input value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. Pro 14 M3 16GB" className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Vendor</Label>
                <Input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="e.g. Apple Authorized Reseller" className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Purchase Cost ($)</Label>
                <Input type="number" value={purchaseCost} onChange={e => setPurchaseCost(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Purchase Date</Label>
                <Input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Warranty Expiry</Label>
                <Input type="date" value={warrantyUntil} onChange={e => setWarrantyUntil(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Current Location / Room</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Bangalore Floor 3 Store Room" className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Description Notes</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Condition, initial checks, setup requirements..." className="min-h-[60px] bg-background/50 border-border text-xs" />
              </div>

              {/* Mock Asset Image upload */}
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Asset Image Upload</Label>
                <div className="flex items-center justify-center border border-dashed border-border bg-background/30 rounded-xl p-4 text-center text-[10px] text-muted-foreground">
                  Click or Drag mockup photograph to upload (Optional)
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer">
                Generate ID & Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          EDIT ASSET MODAL
         ---------------------------------------------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-autobg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg">Edit Asset Specifications</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Asset Name</Label>
                <Input value={assetName} onChange={e => setAssetName(e.target.value)} className="bg-background/50 border-border" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={assetCategory} onValueChange={(val: AssetCategory) => setAssetCategory(val)}>
                  <SelectTrigger className="bg-background/50 border-border text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Serial Number</Label>
                <Input value={serial} onChange={e => setSerial(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Brand</Label>
                <Input value={brand} onChange={e => setBrand(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Model Specification</Label>
                <Input value={model} onChange={e => setModel(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Vendor</Label>
                <Input value={vendor} onChange={e => setVendor(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Purchase Cost ($)</Label>
                <Input type="number" value={purchaseCost} onChange={e => setPurchaseCost(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Purchase Date</Label>
                <Input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Warranty Expiry</Label>
                <Input type="date" value={warrantyUntil} onChange={e => setWarrantyUntil(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Current Location / Room</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Description Notes</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[60px] bg-background/50 border-border text-xs" />
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          ASSIGN ASSET DIALOG
         ---------------------------------------------------- */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">Assign Asset: {targetAsset?.tag}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Employee Assignee</Label>
              <Select value={assignEmpId} onValueChange={setAssignEmpId}>
                <SelectTrigger className="w-full bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authWs.employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.fullName}>{emp.fullName} ({emp.employeeId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Expected Return Date (Optional)</Label>
              <Input type="date" value={assignReturnDate} onChange={e => setAssignReturnDate(e.target.value)} className="bg-background/50 border-border text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Assignment Notes</Label>
              <Textarea value={assignNotes} onChange={e => setAssignNotes(e.target.value)} placeholder="State check-in parameters, initial hardware checklist checks..." className="min-h-[70px] bg-background/50 border-border text-xs" />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setAssignOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer">
                Assign Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          TRANSFER ASSET DIALOG
         ---------------------------------------------------- */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">Transfer Asset: {targetAsset?.tag}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3 text-xs text-indigo-600 dark:text-indigo-400">
              Transferring asset currently assigned to: <strong>{targetAsset?.assignedTo}</strong>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">New Employee Assignee</Label>
              <Select value={transferEmpId} onValueChange={setTransferEmpId}>
                <SelectTrigger className="w-full bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authWs.employees.filter(emp => emp.fullName !== targetAsset?.assignedTo).map(emp => (
                    <SelectItem key={emp.id} value={emp.fullName}>{emp.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Transfer Reason / Notes</Label>
              <Textarea value={transferNotes} onChange={e => setTransferNotes(e.target.value)} placeholder="State justification or ticket reference..." className="min-h-[70px] bg-background/50 border-border text-xs" />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setTransferOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer">
                Transfer Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          MAINTENANCE / REPAIR LOG DIALOG
         ---------------------------------------------------- */}
      <Dialog open={repairOpen} onOpenChange={setRepairOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">Log Repair Request: {targetAsset?.tag}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRepairSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Service Vendor / Shop Name</Label>
              <Input value={repairVendor} onChange={e => setRepairVendor(e.target.value)} placeholder="e.g. Dell Authorized Service Center" className="bg-background/50 border-border text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Estimated Repair Cost ($)</Label>
              <Input type="number" value={repairCost} onChange={e => setRepairCost(e.target.value)} className="bg-background/50 border-border text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Fault Description / Service Notes</Label>
              <Textarea value={repairNotes} onChange={e => setRepairNotes(e.target.value)} placeholder="e.g. Sticky keyboard keys, battery swelling, screen flickering..." className="min-h-[80px] bg-background/50 border-border text-xs" />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setRepairOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">
                Log to Maintenance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          DELETE CONFIRMATION DIALOG
         ---------------------------------------------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500">Delete Asset Record</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently erase the record for asset <strong className="font-semibold text-foreground">{targetAsset?.tag} ({targetAsset?.name})</strong>? This will clear all historical timelines.
          </p>
          <DialogFooter className="pt-2 border-t border-border gap-1">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleDeleteSubmit} className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          QR STICKER PRINT MODAL
         ---------------------------------------------------- */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-xs bg-background border-border text-center">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-center">Asset QR Sticker Label</DialogTitle>
          </DialogHeader>
          {targetAsset && (
            <div className="space-y-4 pt-3 flex flex-col items-center">
              {/* Sticker frame */}
              <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-md w-[220px] flex flex-col items-center select-none text-slate-800">
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">AURIX HRMS ASSET</div>
                <div className="font-mono text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-1.5 w-full text-center">
                  {targetAsset.tag}
                </div>
                
                {/* QR Canvas */}
                <div className="my-3 p-1.5 border border-slate-100 bg-white rounded shadow-inner flex flex-col items-center justify-center">
                  {targetAsset.qrCodeData ? (
                    <img src={targetAsset.qrCodeData} width={130} height={130} className="w-[130px] h-[130px]" alt="Asset QR Code" />
                  ) : (
                    <div className="w-[130px] h-[130px] flex items-center justify-center bg-slate-50 text-[10px] text-slate-400">Generating QR...</div>
                  )}
                  <div className="font-mono text-[10px] text-slate-500 mt-1.5">{targetAsset.serial ?? targetAsset.id}</div>
                </div>

                <div className="text-[10px] font-semibold text-slate-700 truncate max-w-full">{targetAsset.name}</div>
                <div className="text-[8px] text-slate-400 italic">Company: Aurix Talent Labs</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Regenerated QR Code successfully.");
                    // Fake update
                    const updated = {
                      ...targetAsset,
                      timeline: [...(targetAsset.timeline || []), { id: newId("tl"), event: "Created" as const, performedBy: authWs.user?.fullName || "HR", timestamp: new Date().toISOString(), notes: "Regenerated unique QR signature check." }]
                    };
                    editMutation.mutate({
                      id: targetAsset.id,
                      payload: {
                        notes: (targetAsset.notes || "") + "\nRegenerated unique QR signature check."
                      }
                    });
                    setQrOpen(false);
                  }}
                  className="flex-1 h-9 text-xs border-border bg-transparent cursor-pointer"
                >
                  Regenerate
                </Button>
                <Button
                  onClick={() => {
                    toast.success(`Sticker sent to printer queue.`);
                    setQrOpen(false);
                  }}
                  className="flex-1 h-9 text-xs bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Label
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          MOCK QR SCANNER INPUT SELECTOR
         ---------------------------------------------------- */}
      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent className="sm:max-w-sm bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">QR / Barcode Scanner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Simulate scanning a physical QR code label on a laptop/device using a mobile phone. Select an asset sticker from the checklist.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Select Sticker to Scan</Label>
              <Select value={scannedAssetTag} onValueChange={setScannedAssetTag}>
                <SelectTrigger className="w-full bg-background/50 border-border">
                  <SelectValue placeholder="Choose asset tag" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map(a => (
                    <SelectItem key={a.id} value={a.tag}>{a.tag} &bull; {a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScanOpen(false)} className="h-9 border-border bg-transparent cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleScanSimulation} disabled={!scannedAssetTag} className="h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer">
              Confirm Mock Scan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          SLIDE-OUT ASSET DETAILS SHEET
         ---------------------------------------------------- */}
      <Sheet open={!!detailAsset} onOpenChange={open => !open && setDetailAsset(null)}>
        <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {detailAsset && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border">
                    {detailAsset.category}
                  </Badge>
                  {STATUSES.map(stat => {
                    if (stat.value !== detailAsset.status) return null;
                    return (
                      <Badge key={stat.value} className={`${stat.bg} ${stat.color} border-none shadow-none text-xs font-bold capitalize`}>
                        {stat.label}
                      </Badge>
                    );
                  })}
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={detailAsset.name}>
                  {detailAsset.tag} &bull; {detailAsset.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                  Serial Number: {detailAsset.serial} &bull; Warranty Expiration: {detailAsset.warrantyUntil || "None"}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable details panel */}
              <ScrollArea className="flex-1 p-5 min-h-0">
                <div className="space-y-6">
                  {/* QR Sticker Widget */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Asset QR Sticker Identification</Label>
                    <div className="rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="rounded bg-white p-2 border border-slate-200 flex flex-col items-center justify-center">
                        {detailAsset.qrCodeData ? (
                          <img src={detailAsset.qrCodeData} width={110} height={110} className="w-[110px] h-[110px]" alt="Asset QR Code" />
                        ) : (
                          <div className="w-[110px] h-[110px] flex items-center justify-center bg-slate-50 text-[10px] text-slate-400">Generating QR...</div>
                        )}
                        <div className="font-mono text-[10px] text-slate-500 mt-1">{detailAsset.serial ?? detailAsset.id}</div>
                      </div>
                      <div className="text-xs text-left space-y-2 flex-1">
                        <p className="font-semibold text-foreground">Scannable QR Label</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Scan this label with any mobile device to open the asset record page.
                        </p>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setTargetAsset(detailAsset); setQrOpen(true); }}
                            className="h-8 text-[10px] border-border bg-transparent cursor-pointer"
                          >
                            Print Sticker
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              toast.success("Regenerating QR parameters...");
                              const updated = {
                                ...detailAsset,
                                timeline: [...(detailAsset.timeline || []), { id: newId("tl"), event: "Created" as const, performedBy: authWs.user?.fullName || "HR", timestamp: new Date().toISOString(), notes: "QR checksum regenerated." }]
                              };
                              editMutation.mutate({
                                id: detailAsset.id,
                                payload: {
                                  notes: (detailAsset.notes || "") + "\nQR checksum regenerated."
                                }
                              });
                              setDetailAsset(updated as any);
                            }}
                            className="h-8 text-[10px] border-border bg-transparent cursor-pointer"
                          >
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SPECIFICATION GRID */}
                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hardware Specifications</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Brand / Manufacturer</span>
                        <strong className="text-foreground mt-0.5 block">{detailAsset.brand || "—"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Model Specification</span>
                        <strong className="text-foreground mt-0.5 block">{detailAsset.model || "—"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Purchase Cost</span>
                        <strong className="text-foreground mt-0.5 block">${detailAsset.purchaseCost || 0}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Current Location Room</span>
                        <strong className="text-foreground mt-0.5 block">{detailAsset.location || "General HQ"}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[10px]">Vendor Info</span>
                        <strong className="text-foreground mt-0.5 block">{detailAsset.vendor}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[10px]">Warranty Status</span>
                        <strong className="text-foreground mt-0.5 block">
                          {detailAsset.warrantyUntil ? (
                            new Date(detailAsset.warrantyUntil).getTime() < new Date("2026-06-28").getTime() ? (
                              <span className="text-rose-500">Warranty Expired ({detailAsset.warrantyUntil})</span>
                            ) : (
                              <span className="text-emerald-500">Warranty Active (Expires: {detailAsset.warrantyUntil})</span>
                            )
                          ) : "No Warranty Data"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE ASSIGNEE WARNING */}
                  {detailAsset.status === "assigned" && (
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold">
                        <User className="h-4 w-4" />
                        Current Assignment:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1">
                        <p><strong>Employee:</strong> {detailAsset.assignedTo}</p>
                        <p><strong>Dept:</strong> {authWs.employees.find(x => x.fullName === detailAsset.assignedTo)?.department || "Operations"}</p>
                        <p className="col-span-2"><strong>Assigned At:</strong> {detailAsset.assignedAt ? new Date(detailAsset.assignedAt).toLocaleDateString() : "—"}</p>
                      </div>
                    </div>
                  )}

                  {/* TIMELINE EVENTS OF ASSET */}
                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Asset Timeline Audit Logs</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3.5">
                      {(detailAsset.timeline || []).length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No timelines logged for this asset.</p>
                      ) : (
                        (detailAsset.timeline || []).map((tl, idx) => (
                          <div key={tl.id} className={`flex gap-3 text-xs relative ${idx < (detailAsset.timeline || []).length - 1 ? 'before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3' : ''}`}>
                            <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${
                              tl.event === 'Created'
                                ? 'bg-blue-500 text-white'
                                : tl.event === 'Assigned'
                                ? 'bg-indigo-500 text-white'
                                : tl.event === 'Returned'
                                ? 'bg-emerald-500 text-white'
                                : tl.event === 'Repaired'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-500 text-white'
                            }`}>
                              <Package className="h-2 w-2" />
                            </span>
                            <div>
                              <p className="font-bold text-foreground capitalize">{tl.event}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                By {tl.performedBy} on {new Date(tl.timestamp).toLocaleString()}
                              </p>
                              {tl.notes && <p className="text-[10px] text-foreground/80 mt-1">{tl.notes}</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* ASSIGNMENT HISTORY LIST */}
                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Assignment History Logs</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
                      <Table className="text-[11px] border-collapse">
                        <TableHeader className="bg-muted/10 border-b border-border">
                          <TableRow>
                            <TableHead className="px-3 py-2 w-[120px]">Employee</TableHead>
                            <TableHead className="px-3 py-2">Department</TableHead>
                            <TableHead className="px-3 py-2">Assign Date</TableHead>
                            <TableHead className="px-3 py-2">Return Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(detailAsset.assignmentHistory || []).length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                                No allocation logs recorded.
                              </TableCell>
                            </TableRow>
                          ) : (
                            (detailAsset.assignmentHistory || []).map(hist => (
                              <TableRow key={hist.id} className="border-t border-border">
                                <TableCell className="px-3 py-2 font-semibold">{hist.employee}</TableCell>
                                <TableCell className="px-3 py-2 text-muted-foreground">{hist.department}</TableCell>
                                <TableCell className="px-3 py-2 text-muted-foreground">{hist.assignDate}</TableCell>
                                <TableCell className="px-3 py-2">
                                  {hist.actualReturnDate ? (
                                    <span className="text-emerald-500">{hist.actualReturnDate}</span>
                                  ) : (
                                    <span className="text-amber-500 font-semibold">Active</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* MAINTENANCE LOGS LIST */}
                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Maintenance Repair logs</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
                      <Table className="text-[11px] border-collapse">
                        <TableHeader className="bg-muted/10 border-b border-border">
                          <TableRow>
                            <TableHead className="px-3 py-2 w-[100px]">Service Date</TableHead>
                            <TableHead className="px-3 py-2">Vendor Partner</TableHead>
                            <TableHead className="px-3 py-2 text-right">Cost</TableHead>
                            <TableHead className="px-3 py-2">Issues / Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(detailAsset.maintenanceHistory || []).length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                                No maintenance history logs found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            (detailAsset.maintenanceHistory || []).map(mr => (
                              <TableRow key={mr.id} className="border-t border-border">
                                <TableCell className="px-3 py-2 font-mono">{mr.serviceDate}</TableCell>
                                <TableCell className="px-3 py-2 text-muted-foreground">{mr.vendor}</TableCell>
                                <TableCell className="px-3 py-2 text-right text-amber-500 font-semibold">${mr.cost}</TableCell>
                                <TableCell className="px-3 py-2 text-muted-foreground truncate max-w-[120px]" title={mr.notes}>
                                  {mr.notes || "—"}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* FUTURE COMPLIANCE PLACEHOLDER */}
                  <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                    <h5 className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                      Decommissioning & Auditing Protocols
                    </h5>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                      Asset tag tracks automatic check-ins linked directly with offboarding exit task structures. Supports mobile barcode scanner simulation natively.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              {/* Sheet Actions footer */}
              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                {detailAsset.status === "available" && (
                  <Button
                    onClick={() => handleAssignOpen(detailAsset)}
                    className="h-9 text-xs bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer"
                  >
                    Assign Asset
                  </Button>
                )}
                {detailAsset.status === "assigned" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReturnAsset(detailAsset)}
                      className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-emerald-600"
                    >
                      Return Asset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleTransferOpen(detailAsset)}
                      className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-indigo-500"
                    >
                      Transfer
                    </Button>
                  </>
                )}
                {detailAsset.status !== "under-repair" && detailAsset.status !== "retired" && (
                  <Button
                    variant="outline"
                    onClick={() => handleRepairOpen(detailAsset)}
                    className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-amber-600"
                  >
                    Log Fault
                  </Button>
                )}
                {detailAsset.status !== "retired" && (
                  <Button
                    variant="outline"
                    onClick={() => handleMarkRetired(detailAsset)}
                    className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-purple-600"
                  >
                    Decommission
                  </Button>
                )}
                {detailAsset.status !== "lost" && (
                  <Button
                    variant="outline"
                    onClick={() => handleMarkLost(detailAsset)}
                    className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer text-rose-500"
                  >
                    Flag Lost
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => { setTargetAsset(detailAsset); setQrOpen(true); }}
                  className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5"
                >
                  <QrIcon className="h-3.5 w-3.5" />
                  QR Sticker
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
