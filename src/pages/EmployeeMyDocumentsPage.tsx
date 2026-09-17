import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useAurix } from "@/lib/aurix-store";
import { payrollApi, type PayslipHistoryItem } from "@/services/payrollApi";
import {
  myDocumentsApi,
  type DocumentCategory,
  type EmployeeDocument,
  type ProvisionSlip,
} from "@/services/myDocumentsApi";
import { apiInstance } from "@/api";

type DocumentTab =
  | "all"
  | "employment"
  | "salary-slips"
  | "provision-slips"
  | "pending"
  | "verified"
  | "rejected";

type DocumentCategoryLabel = "Identity" | "Address" | "Education" | "Bank" | "Tax" | "Employment" | "Other";

const CATEGORY_OPTIONS: DocumentCategoryLabel[] = [
  "Identity",
  "Address",
  "Education",
  "Bank",
  "Tax",
  "Employment",
  "Other",
];

const TABS: Array<{ id: DocumentTab; label: string }> = [
  { id: "all", label: "All My Documents" },
  { id: "employment", label: "Employment" },
  { id: "salary-slips", label: "Salary Slips" },
  { id: "provision-slips", label: "Provision Slips" },
  { id: "pending", label: "Pending" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
];

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function errorMessage(error: unknown, fallback: string) {
  const source = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
  if (source.response?.status === 403) return "Permission denied. You can only access your own documents.";
  return source.response?.data?.message || source.message || fallback;
}

function isExpiringSoon(expiryDate: string | null) {
  if (!expiryDate) return false;
  const end = new Date(expiryDate);
  if (Number.isNaN(end.getTime())) return false;
  const remainingDays = (end.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return remainingDays >= 0 && remainingDays <= 30;
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("verified") || normalized.includes("approved")) {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
  }
  if (normalized.includes("rejected")) return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
  return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
}

function statusLabel(status: string) {
  return status ? status.replace(/[_-]/g, " ") : "Not available";
}

function categoryMatches(categoryName: string, requested: DocumentCategoryLabel) {
  const category = categoryName.toLowerCase();
  const mappings: Record<DocumentCategoryLabel, string[]> = {
    Identity: ["identity", "employee document", "personal"],
    Address: ["address", "residence"],
    Education: ["education", "academic"],
    Bank: ["bank", "financial"],
    Tax: ["tax", "pan"],
    Employment: ["employment", "offer", "experience"],
    Other: ["other", "general"],
  };
  return mappings[requested].some((term) => category.includes(term));
}

function documentCategory(document: EmployeeDocument, categories: DocumentCategory[]) {
  return categories.find((category) => category.id === document.categoryId)?.name || document.category || "Uncategorised";
}

function downloadBlob(blob: Blob, filename: string, openInNewTab = false) {
  const url = URL.createObjectURL(blob);
  if (openInNewTab) {
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } else {
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function EmployeeMyDocumentsPage() {
  const workspace = useAurix();
  // Authentication is the only source for the employee scope; this never comes from the URL or UI selection.
  const employeeId = String((workspace.user as { employeeId?: string } | null)?.employeeId || workspace.user?.id || "");
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [payslips, setPayslips] = useState<PayslipHistoryItem[]>([]);
  const [provisionSlips, setProvisionSlips] = useState<ProvisionSlip[]>([]);
  const [activeTab, setActiveTab] = useState<DocumentTab>("all");
  const [search, setSearch] = useState("");
  const searchQuery = useDebounce(search, 300);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(true);
  const [isLoadingProvision, setIsLoadingProvision] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [payslipsError, setPayslipsError] = useState<string | null>(null);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reuploadTarget, setReuploadTarget] = useState<EmployeeDocument | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [busyDocumentId, setBusyDocumentId] = useState<string | null>(null);
  const [busyPayslipId, setBusyPayslipId] = useState<string | null>(null);
  const [busyProvisionId, setBusyProvisionId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!employeeId) {
      setDocuments([]);
      setDocumentsError("Unable to identify the authenticated employee.");
      setIsLoadingDocuments(false);
      return;
    }

    setIsLoadingDocuments(true);
    setDocumentsError(null);
    try {
      const items = await myDocumentsApi.listMyDocuments(employeeId, searchQuery);
      setDocuments(items);
    } catch (error) {
      setDocuments([]);
      setDocumentsError(errorMessage(error, "Unable to load your documents. Please try again."));
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [employeeId, searchQuery]);

  const loadCategories = useCallback(async () => {
    try {
      setCategories(await myDocumentsApi.listCategories());
    } catch (error) {
      // Documents remain accessible; the error is surfaced if the user opens the upload form.
      setCategories([]);
      console.error("Unable to load document categories", error);
    }
  }, []);

  const loadPayrollDocuments = useCallback(async () => {
    setIsLoadingPayroll(true);
    setPayslipsError(null);
    try {
      const result = await payrollApi.getMyPayslips({ limit: 100 });
      setPayslips(result.items);
    } catch (error) {
      setPayslips([]);
      setPayslipsError(errorMessage(error, "Unable to load your salary slips. Please try again."));
    } finally {
      setIsLoadingPayroll(false);
    }
  }, []);

  const loadProvisionSlips = useCallback(async () => {
    setIsLoadingProvision(true);
    setProvisionError(null);
    try {
      setProvisionSlips(await myDocumentsApi.listMyProvisionSlips());
    } catch (error) {
      setProvisionSlips([]);
      setProvisionError(errorMessage(error, "Unable to load your provision slips. Please try again."));
    } finally {
      setIsLoadingProvision(false);
    }
  }, []);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  useEffect(() => {
    void loadCategories();
    void loadPayrollDocuments();
    void loadProvisionSlips();
  }, [loadCategories, loadPayrollDocuments, loadProvisionSlips]);

  const refreshAll = async () => {
    await Promise.all([loadDocuments(), loadCategories(), loadPayrollDocuments(), loadProvisionSlips()]);
  };

  const stats = useMemo(() => ({
    total: documents.length,
    verified: documents.filter((document) => document.status === "VERIFIED").length,
    pending: documents.filter((document) => document.status === "PENDING").length,
    rejected: documents.filter((document) => document.status === "REJECTED").length,
    expiring: documents.filter((document) => isExpiringSoon(document.expiryDate)).length,
  }), [documents]);

  const visibleDocuments = useMemo(() => {
    return documents.filter((document) => {
      const category = documentCategory(document, categories);
      const normalisedStatus = document.status.toLowerCase();
      if (activeTab === "employment" && !category.toLowerCase().includes("employment")) return false;
      if (activeTab === "pending" && !normalisedStatus.includes("pending")) return false;
      if (activeTab === "verified" && !normalisedStatus.includes("verified")) return false;
      if (activeTab === "rejected" && !normalisedStatus.includes("rejected")) return false;

      const query = search.trim().toLowerCase();
      return !query || [document.title, category, document.type].some((value) => value?.toLowerCase().includes(query));
    });
  }, [activeTab, categories, documents, search]);

  const availableCategoryId = (category: DocumentCategoryLabel) => {
    return categories.find((entry) => categoryMatches(entry.name, category))?.id || "";
  };

  const handleDocumentFile = async (document: EmployeeDocument, action: "view" | "download") => {
    setBusyDocumentId(document.id);
    try {
      const blob = await myDocumentsApi.downloadMyDocument(document.id);
      downloadBlob(blob, document.fileName || document.title || "document", action === "view");
    } catch (error) {
      toast.error(errorMessage(error, `Unable to ${action} this document. Please try again.`));
    } finally {
      setBusyDocumentId(null);
    }
  };

  const handleDelete = async (document: EmployeeDocument) => {
    if (!window.confirm(`Delete “${document.title || document.fileName || "this document"}”?`)) return;
    setBusyDocumentId(document.id);
    try {
      await myDocumentsApi.deleteMyDocument(document.id);
      toast.success("Document deleted.");
      await loadDocuments();
    } catch (error) {
      toast.error(errorMessage(error, "You do not have permission to delete this document."));
    } finally {
      setBusyDocumentId(null);
    }
  };

  const handlePayslipFile = async (payslip: PayslipHistoryItem, action: "view" | "download") => {
    setBusyPayslipId(payslip.id);
    try {
      const response = await apiInstance.get(`/api/v2/payroll/payslips/${payslip.id}/pdf`, {
        responseType: "blob",
      });
      downloadBlob(
        response.data as Blob,
        `payslip_${payslip.payslipNumber || payslip.id}.pdf`,
        action === "view",
      );
    } catch (error) {
      toast.error(errorMessage(error, `Unable to ${action} this salary slip. Please try again.`));
    } finally {
      setBusyPayslipId(null);
    }
  };

  const handleProvisionFile = async (slip: ProvisionSlip, action: "view" | "download") => {
    setBusyProvisionId(slip.id);
    try {
      const blob = await myDocumentsApi.downloadMyProvisionSlip(slip);
      downloadBlob(blob, `provision-slip_${slip.slipNumber || slip.id}.pdf`, action === "view");
    } catch (error) {
      toast.error(errorMessage(error, `Unable to ${action} this provision slip. Please try again.`));
    } finally {
      setBusyProvisionId(null);
    }
  };

  const handleUpload = async (values: UploadValues, isReupload: boolean) => {
    if (!employeeId) {
      toast.error("Unable to identify the authenticated employee.");
      return;
    }
    if (!values.file) {
      toast.error("Choose a file to upload.");
      return;
    }

    const categoryId = availableCategoryId(values.category) || values.category.toLowerCase();

    setIsSaving(true);
    try {
      if (isReupload && reuploadTarget) {
        await myDocumentsApi.reuploadMyDocument(reuploadTarget.id, {
          name: values.name,
          type: values.type,
          description: values.description,
          expiryDate: values.expiryDate,
          file: values.file,
        });
        toast.success("Document re-uploaded for verification.");
        setReuploadTarget(null);
      } else {
        await myDocumentsApi.uploadMyDocument({
          employeeId,
          categoryId,
          name: values.name,
          type: values.type,
          description: values.description,
          expiryDate: values.expiryDate,
          file: values.file,
        });
        toast.success("Document uploaded and sent for verification.");
        setUploadOpen(false);
      }
      await loadDocuments();
    } catch (error) {
      toast.error(errorMessage(error, "Unable to upload your document. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  const isDocumentTab = activeTab !== "salary-slips" && activeTab !== "provision-slips";

  return (
    <div className="mx-auto max-w-7xl space-y-6 py-2">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total Documents" value={stats.total} icon={FileText} tone="blue" />
        <SummaryCard label="Verified Documents" value={stats.verified} icon={CheckCircle2} tone="emerald" />
        <SummaryCard label="Pending Verification" value={stats.pending} icon={Clock3} tone="amber" />
        <SummaryCard label="Rejected Documents" value={stats.rejected} icon={XCircle} tone="rose" />
        <SummaryCard label="Expiring Soon" value={stats.expiring} icon={CalendarClock} tone="violet" />
      </div>

      <div className="overflow-x-auto border-b border-border">
        <div className="flex min-w-max gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isDocumentTab ? (
        <>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by document name, category, or type"
              className="pl-9"
            />
          </div>
          <DocumentsTable
            documents={visibleDocuments}
            categories={categories}
            isLoading={isLoadingDocuments}
            error={documentsError}
            filtered={activeTab !== "all" || Boolean(search.trim())}
            busyDocumentId={busyDocumentId}
            onRetry={() => void loadDocuments()}
            onView={(document) => void handleDocumentFile(document, "view")}
            onDownload={(document) => void handleDocumentFile(document, "download")}
            onReupload={setReuploadTarget}
            onDelete={(document) => void handleDelete(document)}
          />
        </>
      ) : null}

      {activeTab === "salary-slips" ? (
        <SalarySlipsTable
          items={payslips}
          isLoading={isLoadingPayroll}
          error={payslipsError}
          busyId={busyPayslipId}
          onRetry={() => void loadPayrollDocuments()}
          onFile={handlePayslipFile}
        />
      ) : null}

      {activeTab === "provision-slips" ? (
        <ProvisionSlipsTable
          items={provisionSlips}
          isLoading={isLoadingProvision}
          error={provisionError}
          busyId={busyProvisionId}
          onRetry={() => void loadProvisionSlips()}
          onFile={handleProvisionFile}
        />
      ) : null}

      <UploadDocumentDialog
        open={uploadOpen || Boolean(reuploadTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setUploadOpen(false);
            setReuploadTarget(null);
          }
        }}
        categories={categories}
        reuploadTarget={reuploadTarget}
        saving={isSaving}
        onSubmit={handleUpload}
      />
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof FileText; tone: string }) {
  const tones: Record<string, string> = {
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  };
  return (
    <Card className="bg-card/70">
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${tones[tone]}`}><Icon className="h-4 w-4" /></div>
      </CardContent>
    </Card>
  );
}

function DocumentsTable({
  documents,
  categories,
  isLoading,
  error,
  filtered,
  busyDocumentId,
  onRetry,
  onView,
  onDownload,
  onReupload,
  onDelete,
}: {
  documents: EmployeeDocument[];
  categories: DocumentCategory[];
  isLoading: boolean;
  error: string | null;
  filtered: boolean;
  busyDocumentId: string | null;
  onRetry: () => void;
  onView: (document: EmployeeDocument) => void;
  onDownload: (document: EmployeeDocument) => void;
  onReupload: (document: EmployeeDocument) => void;
  onDelete: (document: EmployeeDocument) => void;
}) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!documents.length) {
    return <EmptyState
      title={filtered ? "No documents found" : "No documents yet"}
      description={filtered ? "No documents match this filter." : "Upload your employment documents to keep your records up to date."}
    />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/60">
      <Table>
        <TableHeader><TableRow>
          <TableHead>Document</TableHead><TableHead>Category</TableHead><TableHead>Type</TableHead>
          <TableHead>Uploaded Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {documents.map((document) => {
            const isRejected = document.status.toLowerCase().includes("rejected");
            const isBusy = busyDocumentId === document.id;
            return <TableRow key={document.id}>
              <TableCell className="min-w-48">
                <div className="font-medium">{document.title || document.fileName || "Untitled document"}</div>
                {document.expiryDate ? <div className={`mt-1 text-xs ${isExpiringSoon(document.expiryDate) ? "text-amber-600 dark:text-amber-300" : "text-muted-foreground"}`}>
                  Expires: {formatDate(document.expiryDate)}{isExpiringSoon(document.expiryDate) ? " · Expiring soon" : ""}
                </div> : null}
              </TableCell>
              <TableCell>{documentCategory(document, categories)}</TableCell>
              <TableCell>{document.type || "—"}</TableCell>
              <TableCell>{formatDate(document.uploadedAt)}</TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(document.status)}`}>{statusLabel(document.status)}</span>
                {isRejected && document.rejectionReason ? <p className="mt-1 max-w-56 text-xs text-rose-700 dark:text-rose-300">Reason: {document.rejectionReason}</p> : null}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" title="View" disabled={isBusy} onClick={() => onView(document)}><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" title="Download" disabled={isBusy} onClick={() => onDownload(document)}>{isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}</Button>
                  {isRejected ? <Button size="sm" variant="outline" disabled={isBusy} onClick={() => onReupload(document)}>Re-upload</Button> : null}
                  <Button size="icon" variant="ghost" title="Delete (subject to your document policy)" disabled={isBusy} onClick={() => onDelete(document)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function SalarySlipsTable({ items, isLoading, error, busyId, onRetry, onFile }: {
  items: PayslipHistoryItem[]; isLoading: boolean; error: string | null; busyId: string | null; onRetry: () => void;
  onFile: (payslip: PayslipHistoryItem, action: "view" | "download") => void;
}) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!items.length) return <EmptyState title="No Salary Slips Available" description="Your salary slips will appear here once they are generated." />;
  return <div className="overflow-hidden rounded-xl border border-border bg-card/60"><Table><TableHeader><TableRow>
    <TableHead>Pay Period / Month</TableHead><TableHead>Payslip Number</TableHead><TableHead>Gross Salary</TableHead><TableHead>Deductions</TableHead><TableHead>Net Salary</TableHead><TableHead>Generated Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
  </TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.id}>
    <TableCell className="font-medium">{item.periodName || "—"}</TableCell><TableCell>{item.payslipNumber || "—"}</TableCell><TableCell>{formatCurrency(item.grossEarnings)}</TableCell><TableCell>{formatCurrency(item.totalDeductions)}</TableCell><TableCell className="font-medium">{formatCurrency(item.netPay)}</TableCell><TableCell>{formatDate(item.finalizedAt)}</TableCell><TableCell><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(item.status || "")}`}>{statusLabel(item.status || "")}</span></TableCell>
    <TableCell><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" title="View" disabled={busyId === item.id} onClick={() => onFile(item, "view")}><Eye className="h-4 w-4" /></Button><Button size="icon" variant="ghost" title="Download" disabled={busyId === item.id} onClick={() => onFile(item, "download")}>{busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}</Button></div></TableCell>
  </TableRow>)}</TableBody></Table></div>;
}

function ProvisionSlipsTable({ items, isLoading, error, busyId, onRetry, onFile }: {
  items: ProvisionSlip[]; isLoading: boolean; error: string | null; busyId: string | null; onRetry: () => void;
  onFile: (slip: ProvisionSlip, action: "view" | "download") => void;
}) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!items.length) return <EmptyState title="No Provision Slips Available" description="Your provision slips will appear here once they are generated." />;
  return <div className="overflow-hidden rounded-xl border border-border bg-card/60"><Table><TableHeader><TableRow>
    <TableHead>Provision Slip Number</TableHead><TableHead>Pay Period / Month</TableHead><TableHead>Employee Name</TableHead><TableHead>Provisioned Amount</TableHead><TableHead>Generated Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
  </TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.id}>
    <TableCell className="font-medium">{item.slipNumber || "—"}</TableCell><TableCell>{item.periodName || "—"}</TableCell><TableCell>{item.employeeName || "—"}</TableCell><TableCell>{formatCurrency(item.provisionedAmount)}</TableCell><TableCell>{formatDate(item.generatedAt)}</TableCell><TableCell><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(item.status || "")}`}>{statusLabel(item.status || "")}</span></TableCell>
    <TableCell><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" title="View" disabled={busyId === item.id} onClick={() => onFile(item, "view")}><Eye className="h-4 w-4" /></Button><Button size="icon" variant="ghost" title="Download" disabled={busyId === item.id} onClick={() => onFile(item, "download")}>{busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}</Button></div></TableCell>
  </TableRow>)}</TableBody></Table></div>;
}

type UploadValues = { name: string; category: DocumentCategoryLabel; type: string; description: string; expiryDate: string; file: File | null };

function UploadDocumentDialog({ open, onOpenChange, categories, reuploadTarget, saving, onSubmit }: {
  open: boolean; onOpenChange: (open: boolean) => void; categories: DocumentCategory[]; reuploadTarget: EmployeeDocument | null; saving: boolean;
  onSubmit: (values: UploadValues, isReupload: boolean) => void;
}) {
  const [values, setValues] = useState<UploadValues>({ name: "", category: "Identity", type: "", description: "", expiryDate: "", file: null });
  useEffect(() => {
    if (!open) return;
    const targetCategory = reuploadTarget ? documentCategory(reuploadTarget, categories) : "Identity";
    const selectedCategory = CATEGORY_OPTIONS.find((category) => categoryMatches(targetCategory, category)) || "Identity";
    setValues({
      name: reuploadTarget?.title || reuploadTarget?.fileName || "",
      category: selectedCategory,
      type: reuploadTarget?.type || "",
      description: reuploadTarget?.description || "",
      expiryDate: reuploadTarget?.expiryDate || "",
      file: null,
    });
  }, [open, reuploadTarget, categories]);

  const categoryAvailable = (category: DocumentCategoryLabel) => categories.some((entry) => categoryMatches(entry.name, category));
  const reupload = Boolean(reuploadTarget);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl"><DialogHeader>
    <DialogTitle>{reupload ? "Re-upload Document" : "Upload Document"}</DialogTitle>
    <DialogDescription>{reupload ? "Replace the rejected file. It will be sent for verification again." : "Upload a personal employment document for verification."}</DialogDescription>
  </DialogHeader><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(values, reupload); }}>
    <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="document-name">Document Name</Label><Input id="document-name" value={values.name} required onChange={(event) => setValues({ ...values, name: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="document-type">Document Type</Label><Input id="document-type" value={values.type} required placeholder="e.g. Passport" onChange={(event) => setValues({ ...values, type: event.target.value })} /></div></div>
    {!reupload ? <div className="space-y-2"><Label>Document Category</Label><Select value={values.category} onValueChange={(category: DocumentCategoryLabel) => setValues({ ...values, category })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORY_OPTIONS.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select></div> : null}
    <div className="space-y-2"><Label htmlFor="document-file">File Upload</Label><Input id="document-file" type="file" required onChange={(event) => setValues({ ...values, file: event.target.files?.[0] || null })} />{values.file ? <p className="text-xs text-muted-foreground">Selected: {values.file.name}</p> : null}</div>
    <div className="space-y-2"><Label htmlFor="document-description">Description <span className="text-muted-foreground">(optional)</span></Label><Textarea id="document-description" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} /></div>
    <div className="space-y-2"><Label htmlFor="expiry-date">Expiry Date <span className="text-muted-foreground">(where applicable)</span></Label><Input id="expiry-date" type="date" value={values.expiryDate} onChange={(event) => setValues({ ...values, expiryDate: event.target.value })} /></div>
    <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}{reupload ? "Re-upload" : "Upload Document"}</Button></DialogFooter>
  </form></DialogContent></Dialog>;
}

function LoadingState() {
  return <div className="flex min-h-52 items-center justify-center rounded-xl border border-border bg-card/60 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your documents…</div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-destructive" /><h2 className="mt-3 font-semibold">Unable to load your documents</h2><p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">{message}</p><Button className="mt-4" variant="outline" size="sm" onClick={onRetry}><RefreshCw className="mr-2 h-4 w-4" />Try again</Button></div>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center"><FileCheck2 className="mx-auto h-9 w-9 text-muted-foreground" /><h2 className="mt-3 font-semibold">{title}</h2><p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p></div>;
}

export default EmployeeMyDocumentsPage;
