import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Building2, Mail, Phone, Plus, Star, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruitment, refreshAll } from "@/lib/recruitment/store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiInstance } from "@/api";

export const Route = createFileRoute("/dashboard/recruitment/vendors")({
  head: () => ({ meta: [{ title: "Vendors & Agencies — Recruitment" }] }),
  component: Vendors,
});

const STATUS_TONE: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  paused: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  terminated: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
};

function Vendors() {
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidates from recruitment store
  const candidates = useRecruitment((s) => s.candidates);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    commissionRate: "20.00",
    status: "ACTIVE",
  });

  const loadVendors = async () => {
    try {
      setLoading(true);
      const res = await apiInstance.get("/vendors?limit=100");
      setVendorsList(res.data?.data?.items || []);
    } catch (err) {
      toast.error("Failed to load recruitment vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  // Compute metrics and resolve stats for each vendor dynamically
  const resolvedVendors = useMemo(() => {
    return vendorsList.map((v) => {
      // Find candidate associations
      const vendorCandidates = candidates.filter((c) => c.vendorId === v.id);
      
      const activeReqs = vendorCandidates.filter(
        (c) => c.stage !== "hired" && c.stage !== "rejected"
      ).length;

      const hires = vendorCandidates.filter((c) => c.stage === "hired").length;

      const spend = vendorCandidates
        .filter((c) => c.stage === "hired")
        .reduce((sum, c) => {
          const salary = c.expectedSalary || 1000000; // fallback to 1M INR base salary
          const commission = Number(v.commission_rate || 20) / 100;
          return sum + (salary * commission);
        }, 0);

      // Map mock ratings and specialty tags dynamically or default them
      const rating = v.name.length % 2 === 0 ? 4.7 : 4.4;
      const specialties = v.name.includes("Talent") || v.name.includes("Executive")
        ? ["Engineering", "AI/ML"]
        : ["Sales", "Product"];

      return {
        ...v,
        contact: v.contact_name,
        activeReqs,
        hires,
        spend,
        rating,
        specialties,
        feeModel: `${v.commission_rate}% of base`,
      };
    });
  }, [vendorsList, candidates]);

  const totalSpend = useMemo(() => resolvedVendors.reduce((a, v) => a + v.spend, 0), [resolvedVendors]);
  const totalHires = useMemo(() => resolvedVendors.reduce((a, v) => a + v.hires, 0), [resolvedVendors]);
  const totalOpen = useMemo(() => resolvedVendors.reduce((a, v) => a + v.activeReqs, 0), [resolvedVendors]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contactName || !form.email || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await apiInstance.post("/vendors", {
        name: form.name,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        commission_rate: Number(form.commissionRate) || 0,
        status: form.status,
      });

      toast.success("Vendor agency registered successfully!");
      setShowAddModal(false);
      // Reset form
      setForm({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        commissionRate: "20.00",
        status: "ACTIVE",
      });
      loadVendors();
    } catch (err) {
      toast.error("Failed to register vendor agency.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (v: any) => {
    setSelectedVendor(v);
    setForm({
      name: v.name,
      contactName: v.contact_name,
      email: v.email,
      phone: v.phone,
      commissionRate: String(v.commission_rate),
      status: v.status,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    setSubmitting(true);
    try {
      await apiInstance.put(`/vendors/${selectedVendor.id}`, {
        name: form.name,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        commission_rate: Number(form.commissionRate) || 0,
        status: form.status,
      });

      toast.success("Vendor details updated successfully!");
      setShowEditModal(false);
      loadVendors();
    } catch (err) {
      toast.error("Failed to update vendor agency details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recruitment vendor agency?")) return;
    try {
      await apiInstance.delete(`/vendors/${id}`);
      toast.success("Vendor agency deleted successfully!");
      loadVendors();
    } catch (err) {
      toast.error("Failed to delete vendor agency.");
    }
  };

  return (
    <>
      <PageHeader
        title="Vendors & Agencies"
        description="External recruiting partners, performance & spend."
        actions={<Button onClick={() => setShowAddModal(true)}><Plus className="mr-2 h-4 w-4" />Add Vendor</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Active Vendors" value={resolvedVendors.filter((v) => v.status === "ACTIVE").length} />
        <Kpi label="Open Reqs (vendor)" value={totalOpen} />
        <Kpi label="Vendor Hires (YTD)" value={totalHires} />
        <Kpi label="Spend (YTD)" value={`$${(totalSpend / 1000).toFixed(0)}k`} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading recruitment vendors database...</div>
      ) : resolvedVendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40 mt-4">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="font-medium text-foreground">No recruiting vendors registered</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add external placement agencies and headhunters to start tracking spend.
          </p>
          <Button onClick={() => setShowAddModal(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {resolvedVendors.map((v) => (
            <div key={v.id} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/40"><Building2 className="h-4 w-4" /></div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground text-sm">{v.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{v.contact}</div>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wide ring-1 ${STATUS_TONE[v.status.toLowerCase()] || STATUS_TONE["active"]}`}>{v.status}</span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{v.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{v.phone}</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {v.specialties.map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
                  <div><div className="font-semibold text-foreground text-sm">{v.activeReqs}</div><div className="text-[10px] text-muted-foreground">Open</div></div>
                  <div><div className="font-semibold text-foreground text-sm">{v.hires}</div><div className="text-[10px] text-muted-foreground">Hires</div></div>
                  <div><div className="font-semibold text-foreground text-sm">${(v.spend / 1000).toFixed(0)}k</div><div className="text-[10px] text-muted-foreground">Spend</div></div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1 text-xs text-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold">{v.rating}</span>
                  <span className="text-muted-foreground">· {v.feeModel}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(v)}><Edit className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteClick(v.id)} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vendor Dialog Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Recruiting Vendor</DialogTitle>
            <DialogDescription>Register an external recruitment agency to manage placements.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="add-name">Agency Name *</Label>
              <Input
                id="add-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Northwind Talent Partners"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="add-contact">Primary Contact Name *</Label>
              <Input
                id="add-contact"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="e.g. Olivia Reed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-email">Contact Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@agency.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="add-phone">Contact Phone *</Label>
                <Input
                  id="add-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. +1 (415) 555-0199"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-commission">Commission Rate (%) *</Label>
                <Input
                  id="add-commission"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.commissionRate}
                  onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="add-status">Status *</Label>
                <select
                  id="add-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground bg-background"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Registering..." : "Add Vendor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vendor Agency</DialogTitle>
            <DialogDescription>Update agency details or manage partnership status.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="edit-name">Agency Name *</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-contact">Primary Contact Name *</Label>
              <Input
                id="edit-contact"
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-email">Contact Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-phone">Contact Phone *</Label>
                <Input
                  id="edit-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-commission">Commission Rate (%) *</Label>
                <Input
                  id="edit-commission"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={form.commissionRate}
                  onChange={(e) => setForm({ ...form, commissionRate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-status">Status *</Label>
                <select
                  id="edit-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground bg-background"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}
