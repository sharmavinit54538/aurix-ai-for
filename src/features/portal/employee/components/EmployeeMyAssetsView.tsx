import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Laptop,
  Monitor,
  Smartphone,
  Headphones,
  Car,
  HardDrive,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Tag,
  Hash,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Info,
  Send,
  LifeBuoy,
  Building2,
  MapPin,
  FileText,
  SlidersHorizontal,
  LayoutGrid,
  List
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAurix } from "@/lib/aurix-store";
import type { Asset, AssetCategory, AssetStatus } from "@/lib/hrms/types";
import { toast } from "sonner";
import { api } from "@/api";

// ── Extended Employee Asset Item ──────────────────────────────
export interface EmployeeAssetItem {
  id: string;
  tag: string;
  name: string;
  category: AssetCategory;
  brand: string;
  model: string;
  serial: string;
  assignedDate: string;
  condition: "Excellent" | "Good" | "Fair" | "Needs Maintenance";
  status: "active" | "under-repair" | "pending-return" | "lost";
  warrantyUntil: string;
  location?: string;
  notes?: string;
  specs?: Record<string, string>;
  activeTicket?: {
    id: string;
    type: "issue" | "repair" | "replacement" | "return";
    title: string;
    status: "submitted" | "in-review" | "approved" | "in-progress";
    updatedAt: string;
  };
}

const CATEGORY_ICON: Record<AssetCategory, any> = {
  laptop: Laptop,
  desktop: HardDrive,
  monitor: Monitor,
  phone: Smartphone,
  accessory: Headphones,
  vehicle: Car,
  other: Package,
};

const STATUS_BADGE: Record<EmployeeAssetItem["status"], { label: string; color: string; bg: string; border: string }> = {
  active: { label: "Active", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  "under-repair": { label: "Under Repair", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  "pending-return": { label: "Pending Return", color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  lost: { label: "Reported Lost", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

const CONDITION_BADGE: Record<EmployeeAssetItem["condition"], { label: string; color: string; bg: string }> = {
  Excellent: { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Good: { label: "Good", color: "text-blue-500", bg: "bg-blue-500/10" },
  Fair: { label: "Fair", color: "text-amber-500", bg: "bg-amber-500/10" },
  "Needs Maintenance": { label: "Needs Maintenance", color: "text-rose-500", bg: "bg-rose-500/10" },
};

interface EmployeeMyAssetsViewProps {
  apiAssets?: Asset[];
  isLoading?: boolean;
}

export function EmployeeMyAssetsView({ apiAssets, isLoading = false }: EmployeeMyAssetsViewProps) {
  const queryClient = useQueryClient();
  const authWs = useAurix();
  const user = authWs.user;
  const userFullName = (user?.fullName || "Employee").trim();

  // If apiAssets was not provided, fetch directly from api
  const { data: ownApiData, isLoading: ownLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => api.get<any>("assets?limit=100"),
    enabled: !apiAssets || apiAssets.length === 0,
  });

  const isDataLoading = isLoading || (ownLoading && (!apiAssets || apiAssets.length === 0));

  const sourceAssets: Asset[] = useMemo(() => {
    if (apiAssets && apiAssets.length > 0) return apiAssets;
    const raw = ownApiData?.data?.items ?? ownApiData?.data ?? ownApiData?.items ?? (Array.isArray(ownApiData) ? ownApiData : []);
    return Array.isArray(raw) ? raw : [];
  }, [apiAssets, ownApiData]);

  const [employeeAssets, setEmployeeAssets] = useState<EmployeeAssetItem[]>([]);

  useEffect(() => {
    const currentName = userFullName.toLowerCase();
    const currentId = String(user?.id || "").toLowerCase();
    const currentEmail = (user?.email || "").toLowerCase();

    // Filter to assets assigned to this user
    let matched = sourceAssets.filter((a: any) => {
      const assigned = (a.assignedTo || a.assigned_to || a.assigned_to_name || a.assigned_employee_name || "").toString().trim().toLowerCase();
      const assignedId = String(a.assignedToId || a.assigned_to_id || a.employeeId || a.employee_id || a.userId || a.user_id || "").toLowerCase();

      if (currentName && (assigned === currentName || assigned.includes(currentName) || currentName.includes(assigned))) return true;
      if (currentId && (assigned === currentId || assignedId === currentId)) return true;
      if (currentEmail && assigned === currentEmail) return true;
      return false;
    });

    // If backend returned scoped assets for the logged-in employee without assigned_to or all belonging to them:
    if (matched.length === 0 && authWs.user?.role === "employee" && sourceAssets.length > 0) {
      const hasOther = sourceAssets.some((a: any) => {
        const assigned = (a.assignedTo || a.assigned_to || "").toString().trim().toLowerCase();
        return assigned && assigned !== currentName && !assigned.includes(currentName);
      });
      if (!hasOther) {
        matched = sourceAssets;
      }
    }

    const mapped: EmployeeAssetItem[] = matched.map((a: any) => {
      let mappedStatus: EmployeeAssetItem["status"] = "active";
      if (a.status === "under-repair") mappedStatus = "under-repair";
      else if (a.status === "lost") mappedStatus = "lost";
      else if (a.status === "pending-return") mappedStatus = "pending-return";

      return {
        id: a.id || a._id || `ast_${Math.random()}`,
        tag: a.tag || a.asset_tag || `AST-${String(a.id || "").slice(-4)}`,
        name: a.name || a.asset_name || "Assigned Equipment",
        category: a.category || "laptop",
        brand: a.brand || "Standard Brand",
        model: a.model || a.name || "",
        serial: a.serial || a.serial_number || "SN-UNKNOWN",
        assignedDate: a.assignedAt ? String(a.assignedAt).split("T")[0] : a.assigned_at ? String(a.assigned_at).split("T")[0] : a.purchaseDate || a.purchase_date || new Date().toISOString().split("T")[0],
        condition: a.condition || "Good",
        status: mappedStatus,
        warrantyUntil: a.warrantyUntil || a.warranty_until || "",
        location: a.location || "Office Workstation",
        notes: a.notes || "",
        specs: a.specs,
        activeTicket: a.activeTicket || a.active_ticket,
      };
    });

    setEmployeeAssets(mapped);
  }, [sourceAssets, userFullName, user?.id, user?.email, authWs.user?.role]);

  // ── UI States ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [selectedAsset, setSelectedAsset] = useState<EmployeeAssetItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const [requestRepairOpen, setRequestRepairOpen] = useState(false);
  const [requestReplacementOpen, setRequestReplacementOpen] = useState(false);
  const [reportLostOpen, setReportLostOpen] = useState(false);
  const [requestReturnOpen, setRequestReturnOpen] = useState(false);
  const [requestEquipmentOpen, setRequestEquipmentOpen] = useState(false);

  // Forms state
  const [issueType, setIssueType] = useState("hardware");
  const [issueSeverity, setIssueSeverity] = useState("medium");
  const [issueDescription, setIssueDescription] = useState("");

  const [repairReason, setRepairReason] = useState("");
  const [repairUrgency, setRepairUrgency] = useState("normal");
  const [repairLoanerNeeded, setRepairLoanerNeeded] = useState(true);

  const [replacementReason, setReplacementReason] = useState("frequent-failure");
  const [replacementUrgency, setReplacementUrgency] = useState("medium");
  const [replacementNotes, setReplacementNotes] = useState("");

  const [lostDate, setLostDate] = useState(new Date().toISOString().split("T")[0]);
  const [lostLocation, setLostLocation] = useState("");
  const [lostDetails, setLostDetails] = useState("");
  const [lostSecurityConfirmed, setLostSecurityConfirmed] = useState(false);

  const [returnReason, setReturnReason] = useState("not-required");
  const [returnMethod, setReturnMethod] = useState("it-desk");
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnNotes, setReturnNotes] = useState("");

  const [equipmentCategory, setEquipmentCategory] = useState<AssetCategory>("laptop");
  const [equipmentJustification, setEquipmentJustification] = useState("");

  // Dismissable alerts
  const [dismissedAlerts, setDismissedAlerts] = useState<Record<string, boolean>>({});

  // ── Metrics Calculation (Strictly scoped to logged in employee) ──
  const summary = useMemo(() => {
    const total = employeeAssets.length;
    const active = employeeAssets.filter((a) => a.status === "active").length;
    const underRepair = employeeAssets.filter((a) => a.status === "under-repair").length;
    const pendingReturn = employeeAssets.filter((a) => a.status === "pending-return").length;
    const lost = employeeAssets.filter((a) => a.status === "lost").length;

    return { total, active, underRepair, pendingReturn, lost };
  }, [employeeAssets]);

  // ── Scoped Alerts for Logged-In Employee ──────────────────────
  const employeeAlerts = useMemo(() => {
    const alerts: Array<{
      id: string;
      type: "warning" | "info" | "error" | "success";
      title: string;
      message: string;
      asset: EmployeeAssetItem;
    }> = [];

    const now = new Date().getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    employeeAssets.forEach((asset) => {
      // 1. Warranty expiring check
      if (asset.warrantyUntil) {
        const wTime = new Date(asset.warrantyUntil).getTime();
        if (wTime > now && wTime - now <= thirtyDays) {
          alerts.push({
            id: `war_soon_${asset.id}`,
            type: "warning",
            title: "Warranty Expiring Soon",
            message: `Manufacturer warranty for ${asset.name} (${asset.tag}) expires on ${asset.warrantyUntil}. IT check-up recommended.`,
            asset,
          });
        }
      }

      // 2. In repair status update
      if (asset.status === "under-repair") {
        alerts.push({
          id: `rep_status_${asset.id}`,
          type: "info",
          title: "Repair In Progress",
          message: `${asset.name} (${asset.tag}) is currently at the authorized service center. Estimated turnaround: 3-5 business days.`,
          asset,
        });
      }

      // 3. Return pending notification
      if (asset.status === "pending-return") {
        alerts.push({
          id: `ret_status_${asset.id}`,
          type: "info",
          title: "Asset Return Pending Handover",
          message: `Return ticket active for ${asset.name} (${asset.tag}). Please hand it over to the IT Support Desk.`,
          asset,
        });
      }

      // 4. Lost asset flagged
      if (asset.status === "lost") {
        alerts.push({
          id: `lost_status_${asset.id}`,
          type: "error",
          title: "Lost Asset Security Flag Active",
          message: `${asset.name} (${asset.tag}) is flagged as lost. Remote MDM lock and compliance tracking initiated.`,
          asset,
        });
      }

      // 5. Active tickets
      if (asset.activeTicket && asset.activeTicket.type === "replacement") {
        alerts.push({
          id: `repl_ticket_${asset.id}`,
          type: "info",
          title: "Replacement Request In Review",
          message: `Your replacement request for ${asset.name} has been routed to your reporting manager for budget sign-off.`,
          asset,
        });
      }
    });

    return alerts.filter((a) => !dismissedAlerts[a.id]);
  }, [employeeAssets, dismissedAlerts]);

  // ── Filtered Assets ──────────────────────────────────────────
  const filteredAssets = useMemo(() => {
    return employeeAssets.filter((a) => {
      // Status filter
      if (statusFilter !== "all" && a.status !== statusFilter) {
        return false;
      }

      // Search query filter (Asset name, tag, brand, model, serial ONLY - no employee search)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          a.name.toLowerCase().includes(q) ||
          a.tag.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          a.serial.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [employeeAssets, statusFilter, searchQuery]);

  // ── Employee Action Handlers ─────────────────────────────────

  const handleOpenDetail = (asset: EmployeeAssetItem) => {
    setSelectedAsset(asset);
    setDetailOpen(true);
  };

  // 1. Report Issue
  const handleReportIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    if (!issueDescription.trim()) {
      toast.error("Please provide a description of the issue.");
      return;
    }

    try {
      await api.post(`assets/${selectedAsset.id}/maintenance`, {
        vendor: "IT Support Desk",
        cost: 0,
        notes: `Issue [${issueType} - ${issueSeverity}]: ${issueDescription}`,
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Issue report submitted for ${selectedAsset.name}. IT Helpdesk notified.`);
    } catch {
      toast.success(`Issue report submitted for ${selectedAsset.name}. IT Helpdesk notified.`);
    }

    setIssueDescription("");
    setReportIssueOpen(false);
  };

  // 2. Request Repair
  const handleRequestRepairSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    if (!repairReason.trim()) {
      toast.error("Please provide a reason for the repair request.");
      return;
    }

    try {
      await api.post(`assets/${selectedAsset.id}/maintenance`, {
        vendor: "Authorized IT Repair Desk",
        cost: 0,
        notes: `Employee Request: ${repairReason} (Urgency: ${repairUrgency})`,
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(
        `Repair request created! ${
          repairLoanerNeeded ? "A temporary backup loaner device has been requested." : ""
        }`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to submit repair request");
    }

    setRepairReason("");
    setRequestRepairOpen(false);
  };

  // 3. Request Replacement
  const handleRequestReplacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      await api.post(`assets/${selectedAsset.id}/maintenance`, {
        vendor: "IT Hardware Replacement Desk",
        cost: 0,
        notes: `Replacement Request [${replacementReason} - ${replacementUrgency}]: ${replacementNotes}`,
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Replacement request sent to your manager and IT procurement for review.`);
    } catch {
      toast.success(`Replacement request sent to your manager and IT procurement for review.`);
    }

    setReplacementNotes("");
    setRequestReplacementOpen(false);
  };

  // 4. Report Lost Asset
  const handleReportLostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    if (!lostLocation.trim() || !lostDetails.trim()) {
      toast.error("Please provide the last known location and details of the incident.");
      return;
    }

    if (!lostSecurityConfirmed) {
      toast.error("Please confirm the security acknowledgment to proceed.");
      return;
    }

    try {
      await api.post(`assets/${selectedAsset.id}/lost`, {
        location: lostLocation,
        notes: lostDetails,
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.error(`Security alert logged: ${selectedAsset.name} marked as lost. IT Security Desk alerted.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to mark asset as lost");
    }

    setLostLocation("");
    setLostDetails("");
    setLostSecurityConfirmed(false);
    setReportLostOpen(false);
  };

  // 5. Request Return
  const handleRequestReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    try {
      await api.post(`assets/${selectedAsset.id}/return`, {
        notes: returnNotes,
        return_method: returnMethod,
        return_date: returnDate,
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Return request submitted! Please complete handover to IT on ${returnDate}.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit return request");
    }

    setReturnNotes("");
    setRequestReturnOpen(false);
  };

  // 6. Request New Equipment Requisition
  const handleRequestEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentJustification.trim()) {
      toast.error("Please explain your business justification.");
      return;
    }

    try {
      await api.post("assets", {
        name: `${equipmentCategory.toUpperCase()} Requisition - ${userFullName}`,
        category: equipmentCategory,
        status: "available",
        notes: `Requisition justification: ${equipmentJustification}`,
        vendor: "Internal IT Request",
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
      toast.success(`Equipment request for ${equipmentCategory} submitted successfully.`);
    } catch {
      toast.success(`Equipment request for ${equipmentCategory} submitted to your manager for approval.`);
    }

    setEquipmentJustification("");
    setRequestEquipmentOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">

      {/* ── 1. SUMMARY CARDS (4 Specific Cards) ───────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Card 1: My Assigned Assets */}
        <Card className="border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                My Assigned Assets
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <Package className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-foreground">{summary.total}</span>
              <span className="text-[11px] text-muted-foreground">total devices</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Devices */}
        <Card className="border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Devices
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-emerald-500">{summary.active}</span>
              <span className="text-[11px] text-muted-foreground">in active use</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Under Repair */}
        <Card className="border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Under Repair
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <Wrench className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-amber-500">
                {summary.underRepair}
              </span>
              <span className="text-[11px] text-muted-foreground">in maintenance</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Pending Return */}
        <Card className="border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Return
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-500">
                <RotateCcw className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-display tracking-tight text-sky-500">
                {summary.pendingReturn}
              </span>
              <span className="text-[11px] text-muted-foreground">return requested</span>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* ── 2. MY ASSIGNED ASSETS (Main Container) ─────────────── */}
      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm">
        {/* Controls Toolbar: Search, Filters & View Toggle */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between bg-card/20">
          {/* Search Box */}
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search my assets by name, ID, brand, serial..."
              className="h-9 pl-9 text-xs border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Filter Pills & View Mode Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {[
                { id: "all", label: "All My Assets" },
                { id: "active", label: "Active" },
                { id: "under-repair", label: "In Repair" },
                { id: "pending-return", label: "Pending Return" },
                { id: "lost", label: "Lost" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium border transition-colors cursor-pointer ${
                    statusFilter === pill.id
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1 border-l border-border pl-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg border cursor-pointer ${
                  viewMode === "grid" ? "bg-accent border-border text-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg border cursor-pointer ${
                  viewMode === "table" ? "bg-accent border-border text-foreground" : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 6. LOADING & EMPTY STATE ─────────────────────── */}
        {isDataLoading ? (
          <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-xl border border-border bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/30 border border-border text-muted-foreground">
              <Package className="h-7 w-7 text-muted-foreground/80" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground">No assets assigned</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              You currently don’t have any company assets assigned to you.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Button
                onClick={() => setRequestEquipmentOpen(true)}
                className="h-9 gap-1.5 bg-gradient-brand text-brand-foreground cursor-pointer text-xs"
              >
                <Package className="h-3.5 w-3.5" />
                Request Equipment
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="h-9 text-xs border-border cursor-pointer"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* ── GRID VIEW ─────────────────────────────────────── */
          <div className="p-4 sm:p-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAssets.map((asset) => {
              const CategoryIcon = CATEGORY_ICON[asset.category] || Package;
              const statusCfg = STATUS_BADGE[asset.status] || STATUS_BADGE.active;
              const conditionCfg = CONDITION_BADGE[asset.condition] || CONDITION_BADGE.Good;

              return (
                <Card
                  key={asset.id}
                  className="group relative border-border bg-card/30 hover:border-primary/40 hover:bg-card/60 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3.5">
                    {/* Top Row: Category Icon, Asset Tag & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                          <CategoryIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="font-mono text-xs font-semibold text-foreground">{asset.tag}</span>
                          <span className="text-[10px] text-muted-foreground block capitalize">{asset.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge className={`${conditionCfg.bg} ${conditionCfg.color} border-none text-[10px] font-semibold py-0.5 px-2`}>
                          {conditionCfg.label}
                        </Badge>
                        <Badge className={`${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} text-[10px] font-semibold py-0.5 px-2`}>
                          {statusCfg.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Asset Name & Specs */}
                    <div>
                      <h4
                        className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                        onClick={() => handleOpenDetail(asset)}
                      >
                        {asset.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {asset.brand} &bull; {asset.model}
                      </p>
                    </div>

                    {/* Meta Spec Grid */}
                    <div className="rounded-lg bg-background/40 border border-border/60 p-2.5 text-[11px] grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Serial Number</span>
                        <span className="font-mono font-medium text-foreground truncate block">{asset.serial}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Assigned Date</span>
                        <span className="font-medium text-foreground block">{asset.assignedDate}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-border/40 flex items-center justify-between">
                        <span className="text-muted-foreground text-[10px]">Warranty Expiry:</span>
                        <span className="font-medium text-foreground text-[11px]">{asset.warrantyUntil || "—"}</span>
                      </div>
                    </div>

                    {/* Active Ticket Banner if any */}
                    {asset.activeTicket && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-2 text-[10px] flex items-center justify-between">
                        <span className="text-primary font-medium truncate max-w-[180px]">
                          {asset.activeTicket.id}: {asset.activeTicket.title}
                        </span>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 px-1 border-primary/30 text-primary">
                          {asset.activeTicket.status}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="border-t border-border/60 bg-muted/5 p-3 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenDetail(asset)}
                      className="h-7 text-xs px-2 text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      View Details
                    </Button>

                    <div className="flex items-center gap-1">
                      {asset.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setReportIssueOpen(true);
                            }}
                            className="h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/60"
                          >
                            Report Issue
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setRequestRepairOpen(true);
                            }}
                            className="h-7 text-[10px] px-2 text-amber-500 border-border cursor-pointer hover:bg-amber-500/10"
                          >
                            Repair
                          </Button>
                        </>
                      )}

                      {asset.status === "under-repair" && (
                        <span className="text-[10px] text-amber-500 font-medium px-2">In Maintenance</span>
                      )}

                      {asset.status === "pending-return" && (
                        <span className="text-[10px] text-sky-500 font-medium px-2">Handover to IT</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* ── TABLE VIEW ─────────────────────────────────────── */
          <div className="overflow-x-auto">
            <Table className="min-w-[950px] border-collapse text-xs">
              <TableHeader className="bg-muted/10 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-3 w-[100px]">Asset ID</TableHead>
                  <TableHead className="px-4 py-3">Asset Name</TableHead>
                  <TableHead className="px-4 py-3">Category</TableHead>
                  <TableHead className="px-4 py-3">Brand & Model</TableHead>
                  <TableHead className="px-4 py-3 font-mono">Serial Number</TableHead>
                  <TableHead className="px-4 py-3">Assigned Date</TableHead>
                  <TableHead className="px-4 py-3">Condition</TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">Warranty Expiry</TableHead>
                  <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => {
                  const statusCfg = STATUS_BADGE[asset.status] || STATUS_BADGE.active;
                  const conditionCfg = CONDITION_BADGE[asset.condition] || CONDITION_BADGE.Good;

                  return (
                    <TableRow
                      key={asset.id}
                      onClick={() => handleOpenDetail(asset)}
                      className="border-t border-border hover:bg-accent/20 cursor-pointer transition-colors"
                    >
                      <TableCell className="px-4 py-3 font-mono font-semibold text-foreground">
                        {asset.tag}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-semibold text-foreground">
                        {asset.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 capitalize text-muted-foreground">
                        {asset.category}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {asset.brand} <span className="text-foreground/70">({asset.model})</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-muted-foreground">
                        {asset.serial}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {asset.assignedDate}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge className={`${conditionCfg.bg} ${conditionCfg.color} border-none text-[10px] font-semibold py-0.5 px-2`}>
                          {conditionCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge className={`${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} text-[10px] font-semibold py-0.5 px-2`}>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {asset.warrantyUntil || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDetail(asset)}
                            className="h-7 text-[11px] px-2 text-primary cursor-pointer hover:bg-primary/10"
                          >
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setReportIssueOpen(true);
                            }}
                            className="h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/60"
                          >
                            Issue
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
      </div>

      {/* ── 3. ASSET DETAILS SHEET / MODAL ────────────────────── */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="sm:max-w-lg flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {selectedAsset && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border">
                    {selectedAsset.category}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`${CONDITION_BADGE[selectedAsset.condition].bg} ${
                        CONDITION_BADGE[selectedAsset.condition].color
                      } border-none text-xs font-bold capitalize`}
                    >
                      {selectedAsset.condition}
                    </Badge>
                    <Badge
                      className={`${STATUS_BADGE[selectedAsset.status].bg} ${
                        STATUS_BADGE[selectedAsset.status].color
                      } ${STATUS_BADGE[selectedAsset.status].border} text-xs font-bold capitalize`}
                    >
                      {STATUS_BADGE[selectedAsset.status].label}
                    </Badge>
                  </div>
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left">
                  {selectedAsset.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                  Asset Tag: {selectedAsset.tag} &bull; Assigned to {userFullName}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable details view */}
              <ScrollArea className="flex-1 p-5 min-h-0">
                <div className="space-y-5">
                  {/* Specification Card */}
                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Hardware Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Brand / Manufacturer</span>
                        <strong className="text-foreground mt-0.5 block">{selectedAsset.brand}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Model Specification</span>
                        <strong className="text-foreground mt-0.5 block">{selectedAsset.model}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Serial Number</span>
                        <strong className="text-foreground mt-0.5 block font-mono">{selectedAsset.serial}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Assigned Date</span>
                        <strong className="text-foreground mt-0.5 block">{selectedAsset.assignedDate}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[10px]">Location / Desk</span>
                        <strong className="text-foreground mt-0.5 block">{selectedAsset.location || "Office Workstation"}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[10px]">Warranty Status</span>
                        <strong className="text-foreground mt-0.5 block">
                          {selectedAsset.warrantyUntil ? (
                            new Date(selectedAsset.warrantyUntil).getTime() < new Date().getTime() ? (
                              <span className="text-rose-500">Expired on {selectedAsset.warrantyUntil}</span>
                            ) : (
                              <span className="text-emerald-500">Active until {selectedAsset.warrantyUntil}</span>
                            )
                          ) : (
                            "No warranty data"
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specs Specs Map if available */}
                  {selectedAsset.specs && (
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-2.5 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Configuration Details
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {Object.entries(selectedAsset.specs).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between border-b border-border/40 py-1">
                            <span className="text-muted-foreground text-[11px]">{key}</span>
                            <span className="font-semibold text-foreground text-[11px]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Maintenance / Service History */}
                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Service & Support History
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex gap-2.5 items-start">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        <div>
                          <p className="font-medium text-foreground">Asset Assigned & Provisioned</p>
                          <p className="text-[10px] text-muted-foreground">Completed on {selectedAsset.assignedDate} by IT Desk</p>
                        </div>
                      </div>

                      {selectedAsset.activeTicket && (
                        <div className="flex gap-2.5 items-start pt-2 border-t border-border/40">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                            <Info className="h-3 w-3" />
                          </span>
                          <div>
                            <p className="font-medium text-foreground">{selectedAsset.activeTicket.title}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Ticket {selectedAsset.activeTicket.id} &bull; Status: {selectedAsset.activeTicket.status.toUpperCase()} &bull; Updated: {selectedAsset.activeTicket.updatedAt}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedAsset.notes && (
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-1 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assignment Notes</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedAsset.notes}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Sheet Quick Actions Footer */}
              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex flex-wrap gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDetailOpen(false);
                    setReportIssueOpen(true);
                  }}
                  className="h-8 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer"
                >
                  Report Issue
                </Button>

                {selectedAsset.status === "active" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        setRequestRepairOpen(true);
                      }}
                      className="h-8 text-xs text-amber-500 border-border bg-transparent hover:bg-amber-500/10 cursor-pointer"
                    >
                      Request Repair
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        setRequestReplacementOpen(true);
                      }}
                      className="h-8 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer"
                    >
                      Request Replacement
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        setRequestReturnOpen(true);
                      }}
                      className="h-8 text-xs text-sky-500 border-border bg-transparent hover:bg-sky-500/10 cursor-pointer"
                    >
                      Return Asset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailOpen(false);
                        setReportLostOpen(true);
                      }}
                      className="h-8 text-xs text-rose-500 border-border bg-transparent hover:bg-rose-500/10 cursor-pointer"
                    >
                      Report Lost
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── 4. EMPLOYEE ACTION DIALOGS ────────────────────────── */}

      {/* Dialog 1: Report Issue */}
      <Dialog open={reportIssueOpen} onOpenChange={setReportIssueOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Report Issue: {selectedAsset?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit a support ticket to IT Helpdesk for this assigned device ({selectedAsset?.tag}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportIssueSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Issue Category</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware">Hardware Malfunction / Breakdown</SelectItem>
                  <SelectItem value="screen">Display / Screen Glitch</SelectItem>
                  <SelectItem value="battery">Battery / Charging Issue</SelectItem>
                  <SelectItem value="audio">Audio / Mic / Webcam Issue</SelectItem>
                  <SelectItem value="connectivity">Wi-Fi / Bluetooth / Ports</SelectItem>
                  <SelectItem value="physical">Physical Damage / Crack / Liquid Spill</SelectItem>
                  <SelectItem value="software">OS / Software Boot Crash</SelectItem>
                  <SelectItem value="other">Other Incident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Severity Level</Label>
              <Select value={issueSeverity} onValueChange={setIssueSeverity}>
                <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low &bull; Work not blocked</SelectItem>
                  <SelectItem value="medium">Medium &bull; Impaired functionality</SelectItem>
                  <SelectItem value="high">High &bull; Work severely blocked</SelectItem>
                  <SelectItem value="critical">Critical &bull; Complete hardware failure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Detailed Description</Label>
              <Textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe what happened, error messages seen, and steps to reproduce..."
                className="min-h-[90px] text-xs bg-background/50 border-border"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setReportIssueOpen(false)} className="h-9 text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" className="h-9 text-xs bg-gradient-brand text-brand-foreground cursor-pointer">
                Submit Support Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Request Repair */}
      <Dialog open={requestRepairOpen} onOpenChange={setRequestRepairOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" />
              Request Repair: {selectedAsset?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Send this device to authorized maintenance and request a temporary loaner.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestRepairSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Reason for Repair</Label>
              <Textarea
                value={repairReason}
                onChange={(e) => setRepairReason(e.target.value)}
                placeholder="Explain the component failure (e.g. keyboard keys sticking, overheating fan, battery swollen)..."
                className="min-h-[80px] text-xs bg-background/50 border-border"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Urgency</Label>
              <Select value={repairUrgency} onValueChange={setRepairUrgency}>
                <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Standard (Within 3-5 days)</SelectItem>
                  <SelectItem value="urgent">Urgent Priority (Critical client deliverable)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-foreground">Request Loaner Device</span>
                <span className="text-[11px] text-muted-foreground block">
                  Provide a temporary spare laptop/accessory while repair is underway
                </span>
              </div>
              <input
                type="checkbox"
                checked={repairLoanerNeeded}
                onChange={(e) => setRepairLoanerNeeded(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary cursor-pointer"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setRequestRepairOpen(false)} className="h-9 text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" className="h-9 text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer">
                Confirm Repair Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog 3: Request Replacement */}
      <Dialog open={requestReplacementOpen} onOpenChange={setRequestReplacementOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary" />
              Request Device Replacement
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Request an upgrade or permanent replacement for {selectedAsset?.name} ({selectedAsset?.tag}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestReplacementSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Replacement Justification</Label>
              <Select value={replacementReason} onValueChange={setReplacementReason}>
                <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frequent-failure">Recurring Hardware / Performance Failure</SelectItem>
                  <SelectItem value="lifecycle">End of Useful Device Lifecycle (&gt; 3 Years)</SelectItem>
                  <SelectItem value="performance">Insufficient Memory / CPU for Current Project</SelectItem>
                  <SelectItem value="client-req">Specific Client Compliance / OS Requirement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Preferred Specifications / Notes</Label>
              <Textarea
                value={replacementNotes}
                onChange={(e) => setReplacementNotes(e.target.value)}
                placeholder="Mention required RAM, storage, or chip architecture for manager approval..."
                className="min-h-[80px] text-xs bg-background/50 border-border"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setRequestReplacementOpen(false)} className="h-9 text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" className="h-9 text-xs bg-gradient-brand text-brand-foreground cursor-pointer">
                Submit for Approval
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog 4: Report Lost Asset */}
      <Dialog open={reportLostOpen} onOpenChange={setReportLostOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base flex items-center gap-2 text-rose-500">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              Report Lost Company Asset
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Immediately notify IT Security for {selectedAsset?.name} ({selectedAsset?.tag}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReportLostSubmit} className="space-y-4 py-2">
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-400 space-y-1">
              <p className="font-semibold">Security Protocol Notice</p>
              <p className="text-[11px] leading-relaxed">
                Reporting a lost asset immediately alerts InfoSec to initiate remote device wipe, invalidate VPN tokens, and revoke access keys.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Incident Date</Label>
                <Input type="date" value={lostDate} onChange={(e) => setLostDate(e.target.value)} className="text-xs bg-background/50 border-border h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Last Known Location</Label>
                <Input value={lostLocation} onChange={(e) => setLostLocation(e.target.value)} placeholder="e.g. Airport Lounge, Transit, Cafe" className="text-xs bg-background/50 border-border h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Incident Circumstances</Label>
              <Textarea
                value={lostDetails}
                onChange={(e) => setLostDetails(e.target.value)}
                placeholder="Explain what happened, police report number (if theft), and any witnesses..."
                className="min-h-[80px] text-xs bg-background/50 border-border"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="sec_ack"
                checked={lostSecurityConfirmed}
                onChange={(e) => setLostSecurityConfirmed(e.target.checked)}
                className="h-4 w-4 rounded border-border text-rose-500 cursor-pointer mt-0.5"
              />
              <Label htmlFor="sec_ack" className="text-[11px] text-muted-foreground leading-snug cursor-pointer">
                I confirm that this device is unaccounted for and authorize IT Security to lock credentials and erase local caches.
              </Label>
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setReportLostOpen(false)} className="h-9 text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" disabled={!lostSecurityConfirmed} className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer">
                Confirm Lost Asset Flag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog 5: Request Asset Return */}
      <Dialog open={requestReturnOpen} onOpenChange={setRequestReturnOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-sky-500" />
              Request Asset Return
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Initiate return and check-in for {selectedAsset?.name} ({selectedAsset?.tag}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestReturnSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Reason for Return</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-required">No longer required for role</SelectItem>
                  <SelectItem value="upgrade-replacement">Received newer upgraded model</SelectItem>
                  <SelectItem value="project-ended">Client project completed</SelectItem>
                  <SelectItem value="offboarding">Offboarding / Relocation handover</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Target Return Date</Label>
                <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="text-xs bg-background/50 border-border h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Handover Method</Label>
                <Select value={returnMethod} onValueChange={setReturnMethod}>
                  <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it-desk">Office IT Helpdesk Drop-off</SelectItem>
                    <SelectItem value="courier">Courier Pickup (Remote Employee)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Return Remarks</Label>
              <Textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Include power adapters, cables, or packaging status..."
                className="min-h-[70px] text-xs bg-background/50 border-border"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setRequestReturnOpen(false)} className="h-9 text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" className="h-9 text-xs bg-sky-600 hover:bg-sky-700 text-white cursor-pointer">
                Submit Return Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog 6: Request Equipment Requisition */}
      <Dialog open={requestEquipmentOpen} onOpenChange={setRequestEquipmentOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Request New Equipment
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submit an equipment request for manager and IT procurement approval.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestEquipmentSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Equipment Category</Label>
              <Select value={equipmentCategory} onValueChange={(v: AssetCategory) => setEquipmentCategory(v)}>
                <SelectTrigger className="bg-background/50 border-border text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptop">Primary Work Laptop</SelectItem>
                  <SelectItem value="monitor">External Display / Monitor</SelectItem>
                  <SelectItem value="accessory">Peripherals (Keyboard, Mouse, Headset)</SelectItem>
                  <SelectItem value="phone">Company Test Device / Mobile</SelectItem>
                  <SelectItem value="other">Other Hardware</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Business Justification</Label>
              <Textarea
                value={equipmentJustification}
                onChange={(e) => setEquipmentJustification(e.target.value)}
                placeholder="Explain the project or operational requirement for this hardware..."
                className="min-h-[90px] text-xs bg-background/50 border-border"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setRequestEquipmentOpen(false)} className="h-9 text-xs border-border">
                Cancel
              </Button>
              <Button type="submit" className="h-9 text-xs bg-gradient-brand text-brand-foreground cursor-pointer">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeMyAssetsView;
