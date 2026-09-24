import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/format";
import { compensationApi } from "../api/compensationApi";
import type {
  PayComponent,
  SalaryStructureTemplate,
  ComponentType,
  CalculationMethod,
} from "../types/compensation";
import { toast } from "sonner";

export default function SalaryStructurePage() {
  const [activeTab, setActiveTab] = useState<"components" | "structures">("components");
  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  // Components Data
  const [components, setComponents] = useState<PayComponent[]>([]);
  const [structures, setStructures] = useState<SalaryStructureTemplate[]>([]);

  // Create Component Modal
  const [componentModalOpen, setComponentModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [compType, setCompType] = useState<ComponentType>("earning");
  const [calcMethod, setCalcMethod] = useState<CalculationMethod>("flat");
  const [isTaxable, setIsTaxable] = useState(true);
  const [isStatutory, setIsStatutory] = useState(false);
  const [creatingComponent, setCreatingComponent] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setBackendUnavailable(false);
    try {
      const [compRes, structRes] = await Promise.all([
        compensationApi.getPayComponents().catch((err) => {
          if (err?.response?.status === 404 || err?.response?.status === 501) {
            setBackendUnavailable(true);
          }
          return [];
        }),
        compensationApi.getSalaryStructures().catch((err) => {
          if (err?.response?.status === 404 || err?.response?.status === 501) {
            setBackendUnavailable(true);
          }
          return [];
        }),
      ]);
      setComponents(compRes);
      setStructures(structRes);
    } catch {
      toast.error("Failed to load salary structure details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateComponent = async () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Component code and name are required.");
      return;
    }
    setCreatingComponent(true);
    try {
      await compensationApi.createPayComponent({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        type: compType,
        calculationMethod: calcMethod,
        taxable: isTaxable,
        statutory: isStatutory,
        effectiveDate: new Date().toISOString(),
      });
      toast.success(`Pay component ${code} created.`);
      setComponentModalOpen(false);
      setCode("");
      setName("");
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create pay component");
    } finally {
      setCreatingComponent(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Salary Structures & Component Master
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              Compensation Architecture
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure pay components, define statutory eligibility formulas, and maintain corporate CTC templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setComponentModalOpen(true)}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Pay Component</span>
          </Button>
        </div>
      </div>

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              The Pay Component Master and Salary Structure API endpoints are awaiting backend deployment.
              Component schemas and calculation method definitions are operational.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="space-y-4"
      >
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/60">
          <TabsTrigger value="components" className="rounded-xl text-xs">
            Pay Component Master ({components.length})
          </TabsTrigger>
          <TabsTrigger value="structures" className="rounded-xl text-xs">
            Salary Structure Templates ({structures.length})
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: PAY COMPONENTS ─────────────────────────────────── */}
        <TabsContent value="components">
          <GlassCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Component Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Calculation Method</th>
                    <th className="px-4 py-3">Taxable</th>
                    <th className="px-4 py-3">Statutory</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Effective Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {components.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                        <Layers className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                        <p className="font-semibold text-foreground text-sm">No Pay Components Found</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {backendUnavailable
                            ? "Component master API pending backend deployment."
                            : "Click 'New Pay Component' to create your first earning or deduction."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    components.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-foreground">{c.code}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                        <td className="px-4 py-3 capitalize">
                          <Badge variant="outline" className="text-[10px]">
                            {c.type.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px]">
                          {c.calculationMethod.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-3">{c.taxable ? "Yes" : "Exempt"}</td>
                        <td className="px-4 py-3">{c.statutory ? "Statutory" : "Standard"}</td>
                        <td className="px-4 py-3">
                          {c.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(c.effectiveDate)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* ── TAB 2: SALARY STRUCTURE TEMPLATES ──────────────────────── */}
        <TabsContent value="structures">
          <GlassCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Template Code</th>
                    <th className="px-4 py-3">Structure Name</th>
                    <th className="px-4 py-3">Components Configured</th>
                    <th className="px-4 py-3">Assigned Employees</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {structures.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                        <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                        <p className="font-semibold text-foreground text-sm">No Salary Structures Defined</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {backendUnavailable
                            ? "Salary structures API pending backend deployment."
                            : "Define salary structure templates to assign standard compensation packages to employees."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    structures.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-foreground">{s.code}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                        <td className="px-4 py-3 font-mono">{s.components?.length || 0}</td>
                        <td className="px-4 py-3 font-mono">{s.assignedEmployeesCount || 0}</td>
                        <td className="px-4 py-3">
                          {s.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* ── Create Component Modal ──────────────────────────────────── */}
      <Dialog open={componentModalOpen} onOpenChange={setComponentModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create Pay Component</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a new earning, deduction, or statutory contribution component for salary structures.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Component Code *</label>
              <Input
                id="comp-code-input"
                placeholder="e.g. BASIC, HRA, SPECIAL_ALLOW"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="mt-1 h-8 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Component Name *</label>
              <Input
                id="comp-name-input"
                placeholder="e.g. Basic Salary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Component Type</label>
              <select
                value={compType}
                onChange={(e) => setCompType(e.target.value as ComponentType)}
                className="mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs"
              >
                <option value="earning">Earning</option>
                <option value="deduction">Deduction</option>
                <option value="employer_contribution">Employer Contribution</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Calculation Method</label>
              <select
                value={calcMethod}
                onChange={(e) => setCalcMethod(e.target.value as CalculationMethod)}
                className="mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs"
              >
                <option value="flat">Flat Fixed Amount</option>
                <option value="percentage_of_basic">% of Basic</option>
                <option value="percentage_of_ctc">% of CTC</option>
                <option value="formula">Custom Rule Formula</option>
              </select>
            </div>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTaxable}
                  onChange={(e) => setIsTaxable(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Taxable Income</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStatutory}
                  onChange={(e) => setIsStatutory(e.target.checked)}
                  className="rounded border-input"
                />
                <span>Statutory Component</span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComponentModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={creatingComponent}
              onClick={handleCreateComponent}
              className="rounded-xl text-xs"
            >
              {creatingComponent ? "Creating..." : "Save Component"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
