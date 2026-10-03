import { useMemo, useState, useEffect, useCallback } from "react";
import { Package, CheckCircle2, AlertTriangle, XCircle, Wrench, Plus, Trash2, Pencil, QrCode, RefreshCw, AlertCircle } from "lucide-react";
import { CsvButton, GlassCard, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { assetsApi } from "@/services/assetsApi";
import type { Asset, AssetCategory, AssetStatus } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";

const CATEGORIES: AssetCategory[] = ["laptop", "desktop", "monitor", "phone", "accessory", "vehicle", "other"];
const STATUSES: AssetStatus[] = ["available", "assigned", "under-repair", "lost", "expired"];

const STATUS_TONE: Record<AssetStatus, "success" | "info" | "warning" | "danger" | "muted"> = {
  available: "success",
  assigned: "info",
  "under-repair": "warning",
  lost: "danger",
  expired: "danger",
  retired: "muted",
};

const PIE_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#6b7280"];

function emptyAsset(): Asset {
  return {
    id: "",
    tag: `LAP-${Math.floor(Math.random() * 9000 + 1000)}`,
    name: "",
    category: "laptop",
    serial: "",
    vendor: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    warrantyUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
    status: "available",
  };
}

export function AssetManagementPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Asset>(emptyAsset());
  const [qrFor, setQrFor] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dialog for assigning an asset
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignAssetId, setAssignAssetId] = useState<string | null>(null);
  const [assignedEmployeeName, setAssignedEmployeeName] = useState("");

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await assetsApi.getAssets();
      setAssets(res.items);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load assets";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const stats = useMemo(() => {
    const by = (s: AssetStatus) => assets.filter((a) => a.status === s).length;
    return {
      total: assets.length,
      assigned: by("assigned"),
      available: by("available"),
      repair: by("under-repair"),
      lost: by("lost"),
      expired: by("expired"),
    };
  }, [assets]);

  const filtered = useMemo(() => {
    return assets
      .filter((a) => (statusFilter === "all" ? true : a.status === statusFilter))
      .filter((a) =>
        query.trim() === ""
          ? true
          : `${a.tag} ${a.name} ${a.serial} ${a.vendor} ${a.assignedTo ?? ""}`.toLowerCase().includes(query.toLowerCase()),
      );
  }, [assets, statusFilter, query]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    assets.forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + 1));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [assets]);

  const statusData = useMemo(
    () => STATUSES.map((s) => ({ name: s, value: assets.filter((a) => a.status === s).length })),
    [assets],
  );

  async function save() {
    if (!draft.name) {
      toast.error("Please enter asset name");
      return;
    }
    setSubmitting(true);
    try {
      if (draft.id) {
        const updated = await assetsApi.updateAsset(draft.id, draft);
        setAssets((prev) => prev.map((a) => (a.id === draft.id ? updated : a)));
        toast.success("Asset updated successfully");
      } else {
        const created = await assetsApi.createAsset(draft);
        setAssets((prev) => [created, ...prev]);
        toast.success("Asset added successfully");
      }
      setOpen(false);
      setDraft(emptyAsset());
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save asset");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await assetsApi.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("Asset deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete asset");
    }
  }

  async function handleReturn(id: string) {
    try {
      const updated = await assetsApi.returnAsset(id);
      setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success("Asset returned to inventory");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to return asset");
    }
  }

  async function submitAssignment() {
    if (!assignAssetId || !assignedEmployeeName.trim()) {
      toast.error("Please enter employee name");
      return;
    }
    try {
      const updated = await assetsApi.assignAsset(assignAssetId, assignedEmployeeName.trim());
      setAssets((prev) => prev.map((a) => (a.id === assignAssetId ? updated : a)));
      setAssignOpen(false);
      setAssignAssetId(null);
      setAssignedEmployeeName("");
      toast.success("Asset assigned successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to assign asset");
    }
  }

  if (error && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load assets</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadAssets} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-2 mb-6">
        <CsvButton rows={assets} filename="assets.csv" />
        <Button size="sm" onClick={() => { setDraft(emptyAsset()); setOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add asset
        </Button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard label="Total" value={stats.total} icon={Package} />
        <StatCard label="Assigned" value={stats.assigned} icon={CheckCircle2} accent="success" />
        <StatCard label="Available" value={stats.available} icon={Package} accent="muted" />
        <StatCard label="Under Repair" value={stats.repair} icon={Wrench} accent="warning" />
        <StatCard label="Lost" value={stats.lost} icon={XCircle} accent="danger" />
        <StatCard label="Expired" value={stats.expired} icon={AlertTriangle} accent="danger" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-2 font-medium">By category</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="mb-2 font-medium">By status</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search by tag, name, serial, employee…" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Warranty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned to</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Loading assets...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No assets found.
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const warrantyDate = new Date(a.warrantyUntil);
                const warningWarranty = warrantyDate.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 60;
                return (
                  <tr key={a.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{a.tag}</td>
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3 capitalize">{a.category}</td>
                    <td className="px-4 py-3">{a.vendor}</td>
                    <td className="px-4 py-3">
                      <span className={warningWarranty ? "text-amber-600 font-medium" : ""}>{warrantyDate.toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} tone={STATUS_TONE[a.status]} /></td>
                    <td className="px-4 py-3">
                      {a.assignedTo ?? <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setQrFor(a)} aria-label="QR"><QrCode className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDraft(a); setOpen(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                        {a.assignedTo ? (
                          <Button variant="outline" size="sm" onClick={() => handleReturn(a.id)}>Return</Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAssignAssetId(a.id);
                              setAssignedEmployeeName("");
                              setAssignOpen(true);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </GlassCard>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{draft.id ? "Edit" : "Add"} asset</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Tag</Label><Input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} /></div>
            <div><Label>Name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div>
              <Label>Category</Label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as AssetCategory })}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as AssetStatus })}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><Label>Serial</Label><Input value={draft.serial} onChange={(e) => setDraft({ ...draft, serial: e.target.value })} /></div>
            <div><Label>Vendor</Label><Input value={draft.vendor} onChange={(e) => setDraft({ ...draft, vendor: e.target.value })} /></div>
            <div><Label>Purchase date</Label><Input type="date" value={draft.purchaseDate.slice(0, 10)} onChange={(e) => setDraft({ ...draft, purchaseDate: e.target.value })} /></div>
            <div><Label>Warranty until</Label><Input type="date" value={draft.warrantyUntil.slice(0, 10)} onChange={(e) => setDraft({ ...draft, warrantyUntil: e.target.value })} /></div>
            <div className="col-span-2"><Label>Assigned to</Label><Input value={draft.assignedTo ?? ""} onChange={(e) => setDraft({ ...draft, assignedTo: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Asset Dialog (Replaces window.prompt) */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Employee Name</Label>
            <Input
              placeholder="Enter employee name or ID"
              value={assignedEmployeeName}
              onChange={(e) => setAssignedEmployeeName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancel</Button>
            <Button onClick={submitAssignment}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!qrFor} onOpenChange={(o) => !o && setQrFor(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Asset QR / Barcode</DialogTitle></DialogHeader>
          {qrFor ? (
            <div className="flex flex-col items-center gap-3">
              <div className="font-mono text-base font-semibold">{qrFor.tag}</div>
              <div className="text-xs text-muted-foreground">{qrFor.name} · {qrFor.category}</div>
              <div className="text-xs text-muted-foreground">Scan tag at asset check-in desk.</div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AssetManagementPage;
