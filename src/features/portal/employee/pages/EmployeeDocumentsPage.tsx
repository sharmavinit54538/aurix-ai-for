import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Upload,
  Search,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Layers,
  FileCheck,
  Shield,
  FileSpreadsheet,
  Receipt,
  X,
  Plus,
  ExternalLink,
  ChevronRight,
  Filter,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";
import { apiInstance } from "@/api";
import {
  myDocumentsApi,
  triggerFileDownload,
  type EmployeeDocument,
  type DocumentCategory,
  type SalarySlipRecord,
  type ProvisionSlip,
} from "@/services/myDocumentsApi";

// ── Standard Categories and Suggested Types ──────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  Identity: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License", "National ID"],
  Address: ["Electricity Bill", "Rent Agreement", "Utility Bill", "Bank Statement", "Ration Card"],
  Education: [
    "10th Certificate",
    "12th Certificate",
    "Graduation Degree",
    "Post Graduation",
    "Diploma / Certification",
  ],
  Bank: ["Cancelled Cheque", "Bank Passbook", "Bank Statement"],
  Tax: ["Form 16", "PAN Verification", "Tax Declaration", "ITR Acknowledgement"],
  Employment: [
    "Offer Letter",
    "Appointment Letter",
    "Relieving Letter",
    "Experience Letter",
    "Previous Payslip",
  ],
  Other: [
    "Medical Certificate",
    "Background Verification",
    "NDA",
    "Policy Acknowledgment",
    "Miscellaneous",
  ],
};

type ActiveTab =
  | "all"
  | "employment"
  | "salary-slips"
  | "provision-slips"
  | "pending"
  | "verified"
  | "rejected";

export function EmployeeDocumentsPage() {
  const ws = useAurix();
  const currentUserId = ws.user?.id || (ws.user as any)?.employeeId || "";
  const currentUserName = ws.user?.fullName || "Employee";

  // Data State
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [salarySlips, setSalarySlips] = useState<SalarySlipRecord[]>([]);
  const [provisionSlips, setProvisionSlips] = useState<ProvisionSlip[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [employeeId, setEmployeeId] = useState<string>(currentUserId);

  // Loading and Error State
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);
  const [isLoadingSalary, setIsLoadingSalary] = useState<boolean>(false);
  const [isLoadingProvision, setIsLoadingProvision] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filter & Search State
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reuploadOpen, setReuploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<EmployeeDocument | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

  // Salary Slip Preview State
  const [selectedSlip, setSelectedSlip] = useState<SalarySlipRecord | null>(null);
  const [slipModalOpen, setSlipModalOpen] = useState<boolean>(false);

  // Provision Slip Preview State
  const [selectedProvision, setSelectedProvision] = useState<ProvisionSlip | null>(null);
  const [provisionModalOpen, setProvisionModalOpen] = useState<boolean>(false);

  // Upload Form State
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Identity");
  const [uploadType, setUploadType] = useState("Aadhaar Card");
  const [uploadCustomType, setUploadCustomType] = useState("");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Re-upload Form State
  const [reuploadFile, setReuploadFile] = useState<File | null>(null);
  const [isSubmittingReupload, setIsSubmittingReupload] = useState(false);
  const reuploadInputRef = useRef<HTMLInputElement | null>(null);

  // ── Resolve Employee ID ──────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function resolveEmployee() {
      // If we already have a UUID in currentUserId, use it
      if (
        currentUserId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUserId)
      ) {
        setEmployeeId(currentUserId);
        return;
      }
      try {
        // Query employees endpoint to find matching employee record for the authenticated user
        const res = await apiInstance.get("/employees", {
          params: { search: ws.user?.email || ws.user?.fullName || undefined, limit: 10 },
        });
        const data = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
        if (Array.isArray(data) && data.length > 0) {
          const match = data.find(
            (e: any) =>
              e.user_id === currentUserId ||
              e.company_email === ws.user?.email ||
              e.personal_email === ws.user?.email ||
              e.id === currentUserId,
          );
          if (match && isMounted) {
            setEmployeeId(match.id);
            return;
          }
        }
      } catch {
        // Fallback to currentUserId
      }
      if (isMounted && currentUserId) {
        setEmployeeId(currentUserId);
      }
    }
    resolveEmployee();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, ws.user?.email, ws.user?.fullName]);

  // ── Fetch Categories ─────────────────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await myDocumentsApi.listCategories();
        setCategories(cats);
      } catch {
        // Handled in api
      }
    }
    loadCategories();
  }, []);

  // ── Fetch Documents from Real Backend ────────────────────────────
  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    setLoadError(null);
    try {
      if (!employeeId) {
        setDocuments([]);
        setLoadError("Unable to identify the authenticated employee.");
        return;
      }
      const data = await myDocumentsApi.listMyDocuments(employeeId);
      setDocuments(data);
    } catch (err: any) {
      console.error("Failed to fetch employee documents:", err);
      setLoadError("Unable to load your documents. Please try again.");
    } finally {
      setIsLoadingDocs(false);
    }
  }, [employeeId]);

  // ── Fetch Salary Slips from Real Backend ─────────────────────────
  const fetchSalarySlips = useCallback(async () => {
    setIsLoadingSalary(true);
    try {
      const data = await myDocumentsApi.listMySalarySlips();
      setSalarySlips(data);
    } catch (err) {
      console.error("Failed to fetch salary slips:", err);
    } finally {
      setIsLoadingSalary(false);
    }
  }, [employeeId]);

  // ── Fetch Provision Slips from Real Backend ──────────────────────
  const fetchProvisionSlips = useCallback(async () => {
    setIsLoadingProvision(true);
    try {
      const data = await myDocumentsApi.listMyProvisionSlips(employeeId || undefined);
      setProvisionSlips(data);
    } catch (err) {
      console.error("Failed to fetch provision slips:", err);
    } finally {
      setIsLoadingProvision(false);
    }
  }, [employeeId]);

  // Initial load
  useEffect(() => {
    fetchDocuments();
    fetchSalarySlips();
    fetchProvisionSlips();
  }, [fetchDocuments, fetchSalarySlips, fetchProvisionSlips]);

  // ── Summary Cards Calculations (Strictly Real Data) ──────────────
  const summaryMetrics = useMemo(() => {
    const total = documents.length;
    let verified = 0;
    let pending = 0;
    let rejected = 0;
    let expiring = 0;

    const now = new Date();
    const in90Days = new Date();
    in90Days.setDate(now.getDate() + 90);

    for (const doc of documents) {
      const s = doc.status.toUpperCase();
      if (s === "VERIFIED" || s === "APPROVED") {
        verified++;
      } else if (s === "PENDING" || s === "IN_REVIEW" || s === "SUBMITTED") {
        pending++;
      } else if (s === "REJECTED") {
        rejected++;
      }

      if (doc.expiryDate) {
        const exp = new Date(doc.expiryDate);
        if (!isNaN(exp.getTime()) && exp >= now && exp <= in90Days) {
          expiring++;
        }
      }
    }

    return { total, verified, pending, rejected, expiring };
  }, [documents]);

  // ── Filtered Documents by Tab and Search ─────────────────────────
  const filteredDocuments = useMemo(() => {
    let list = documents;

    // Filter by tab
    if (activeTab === "employment") {
      list = list.filter((doc) => {
        const cat = (doc.category || "").toLowerCase();
        const typ = (doc.type || "").toLowerCase();
        return (
          cat.includes("employment") ||
          typ.includes("offer") ||
          typ.includes("appointment") ||
          typ.includes("relieving") ||
          typ.includes("experience") ||
          typ.includes("contract")
        );
      });
    } else if (activeTab === "pending") {
      list = list.filter((doc) => {
        const s = doc.status.toUpperCase();
        return s === "PENDING" || s === "IN_REVIEW" || s === "SUBMITTED";
      });
    } else if (activeTab === "verified") {
      list = list.filter((doc) => {
        const s = doc.status.toUpperCase();
        return s === "VERIFIED" || s === "APPROVED";
      });
    } else if (activeTab === "rejected") {
      list = list.filter((doc) => doc.status.toUpperCase() === "REJECTED");
    }

    // Filter by search query (Document Name, Category, Type)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((doc) => {
        const name = (doc.title || doc.fileName || "").toLowerCase();
        const cat = (doc.category || "").toLowerCase();
        const typ = (doc.type || "").toLowerCase();
        return name.includes(q) || cat.includes(q) || typ.includes(q);
      });
    }

    return list;
  }, [documents, activeTab, searchQuery]);

  // Filtered Salary Slips by Search
  const filteredSalarySlips = useMemo(() => {
    if (!searchQuery.trim()) return salarySlips;
    const q = searchQuery.toLowerCase().trim();
    return salarySlips.filter((s) => {
      const period = (s.periodName || "").toLowerCase();
      const num = (s.payslipNumber || "").toLowerCase();
      return period.includes(q) || num.includes(q);
    });
  }, [salarySlips, searchQuery]);

  // Filtered Provision Slips by Search
  const filteredProvisionSlips = useMemo(() => {
    if (!searchQuery.trim()) return provisionSlips;
    const q = searchQuery.toLowerCase().trim();
    return provisionSlips.filter((p) => {
      const period = (p.periodName || "").toLowerCase();
      const num = (p.slipNumber || "").toLowerCase();
      return period.includes(q) || num.includes(q);
    });
  }, [provisionSlips, searchQuery]);

  // ── Upload Handler ───────────────────────────────────────────────
  const handleOpenUploadModal = () => {
    setUploadName("");
    setUploadCategory("Identity");
    setUploadType(CATEGORY_MAP["Identity"]?.[0] || "Aadhaar Card");
    setUploadCustomType("");
    setUploadExpiry("");
    setUploadDesc("");
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadOpen(true);
  };

  const handleCategoryChange = (catName: string) => {
    setUploadCategory(catName);
    const types = CATEGORY_MAP[catName] || [];
    setUploadType(types[0] || "Other");
    setUploadCustomType("");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!uploadName.trim()) {
      toast.error("Please enter a document name.");
      return;
    }

    // Resolve category ID from categories list or fallback
    const resolvedCat = categories.find(
      (c) => c.name.toLowerCase() === uploadCategory.toLowerCase(),
    );
    const categoryId = resolvedCat ? resolvedCat.id : uploadCategory.toLowerCase();
    const finalType =
      uploadType === "Other" && uploadCustomType.trim() ? uploadCustomType.trim() : uploadType;

    setIsSubmittingUpload(true);
    try {
      await myDocumentsApi.uploadMyDocument({
        employeeId,
        categoryId,
        name: uploadName.trim(),
        type: finalType,
        description: uploadDesc.trim() || undefined,
        expiryDate: uploadExpiry || undefined,
        file: uploadFile,
      });

      toast.success("Document uploaded successfully. Status: Pending Verification.");
      setUploadOpen(false);
      await fetchDocuments();
    } catch (err: any) {
      console.error("Upload error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to upload document. Please verify file format and size.";
      toast.error(errMsg);
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // ── Re-upload Handler (for Rejected Documents) ───────────────────
  const handleOpenReupload = (doc: EmployeeDocument) => {
    setSelectedDoc(doc);
    setReuploadFile(null);
    if (reuploadInputRef.current) reuploadInputRef.current.value = "";
    setReuploadOpen(true);
  };

  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    if (!reuploadFile) {
      toast.error("Please select a revised file to upload.");
      return;
    }

    setIsSubmittingReupload(true);
    try {
      await myDocumentsApi.reuploadMyDocument(selectedDoc.id, {
        name: selectedDoc.title || selectedDoc.fileName || "Revised Document",
        type: selectedDoc.type || "Document",
        description: selectedDoc.description || undefined,
        expiryDate: selectedDoc.expiryDate || undefined,
        file: reuploadFile,
      });

      toast.success("Revised document re-uploaded successfully. Status: Pending Verification.");
      setReuploadOpen(false);
      await fetchDocuments();
    } catch (err: any) {
      console.error("Re-upload error:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to re-upload document. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmittingReupload(false);
    }
  };

  // ── View / Preview Document ──────────────────────────────────────
  const handleViewDocument = async (doc: EmployeeDocument) => {
    setSelectedDoc(doc);
    setPreviewOpen(true);
    setIsPreviewLoading(true);

    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }

    try {
      const blob = await myDocumentsApi.downloadMyDocument(doc.id);
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
    } catch (err) {
      console.error("Failed to load document preview:", err);
      // If direct blob download fails, fallback to doc.fileUrl if accessible
      if (doc.fileUrl) {
        setPreviewBlobUrl(doc.fileUrl);
      } else {
        toast.error("Unable to load document preview stream.");
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setSelectedDoc(null);
  };

  // ── Download Document ────────────────────────────────────────────
  const handleDownloadDocument = async (doc: EmployeeDocument) => {
    const toastId = toast.loading(`Downloading ${doc.title || "document"}...`);
    try {
      const blob = await myDocumentsApi.downloadMyDocument(doc.id);
      const ext = (doc.fileName || "").split(".").pop() || "pdf";
      const downloadName = (doc.fileName || `${doc.title || "document"}.${ext}`).replace(
        /[/\\?%*:|"<>]/g,
        "-",
      );
      triggerFileDownload(blob, downloadName);
      toast.success("Document downloaded successfully.", { id: toastId });
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download document from backend storage.", { id: toastId });
    }
  };

  // ── Delete Document ──────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    const toastId = toast.loading("Deleting document...");
    try {
      await myDocumentsApi.deleteMyDocument(selectedDoc.id);
      toast.success("Document deleted successfully.", { id: toastId });
      setDeleteOpen(false);
      setSelectedDoc(null);
      await fetchDocuments();
    } catch (err: any) {
      console.error("Delete failed:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to delete document. You may not have permission to delete this record.";
      toast.error(errMsg, { id: toastId });
    }
  };

  // ── Download Salary Slip ─────────────────────────────────────────
  const handleDownloadSalarySlip = async (slip: SalarySlipRecord) => {
    const toastId = toast.loading(`Downloading payslip for ${slip.periodName}...`);
    try {
      const blob = await myDocumentsApi.downloadMySalarySlip(
        slip.runId || "",
        slip.employeeId || employeeId,
      );
      const filename = `Payslip_${slip.periodName?.replace(/\s+/g, "_") || "slip"}_${slip.payslipNumber || ""}.pdf`;
      triggerFileDownload(blob, filename);
      toast.success("Salary slip downloaded successfully.", { id: toastId });
    } catch (err) {
      console.error("Payslip download failed:", err);
      toast.error("Unable to download salary slip PDF.", { id: toastId });
    }
  };

  // ── Download Provision Slip ──────────────────────────────────────
  const handleDownloadProvisionSlip = async (slip: ProvisionSlip) => {
    const toastId = toast.loading(`Downloading provision slip for ${slip.periodName}...`);
    try {
      const blob = await myDocumentsApi.downloadMyProvisionSlip(slip);
      const filename = `ProvisionSlip_${slip.periodName?.replace(/\s+/g, "_") || "slip"}_${slip.slipNumber || ""}.pdf`;
      triggerFileDownload(blob, filename);
      toast.success("Provision slip downloaded successfully.", { id: toastId });
    } catch (err) {
      console.error("Provision slip download failed:", err);
      toast.error("Unable to download provision slip.", { id: toastId });
    }
  };

  // ── Status Badge Renderer ────────────────────────────────────────
  const renderStatusBadge = (status: string, expiryDate?: string | null) => {
    const s = status.toUpperCase();
    const now = new Date();
    const in90Days = new Date();
    in90Days.setDate(now.getDate() + 90);
    const isExpiring = expiryDate
      ? (() => {
          const exp = new Date(expiryDate);
          return !isNaN(exp.getTime()) && exp >= now && exp <= in90Days;
        })()
      : false;

    if (s === "VERIFIED" || s === "APPROVED") {
      return (
        <div className="flex flex-col gap-1 items-start">
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </Badge>
          {isExpiring && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
              <Clock className="h-2.5 w-2.5" /> Expiring Soon
            </span>
          )}
        </div>
      );
    }

    if (s === "REJECTED") {
      return (
        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-medium inline-flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending Verification
        </Badge>
        {isExpiring && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
            <Clock className="h-2.5 w-2.5" /> Expiring Soon
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and view your personal employment documents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenUploadModal}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────── */}
      {loadError && (
        <Card className="border-rose-500/30 bg-rose-500/10">
          <CardContent className="flex items-center justify-between p-4 text-sm text-rose-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{loadError}</span>
            </div>
            <Button
              onClick={fetchDocuments}
              variant="outline"
              size="sm"
              className="border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-muted-foreground">
              Total Documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-blue-500">{summaryMetrics.total}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">All uploaded files</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-muted-foreground">
              Verified Documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-500">{summaryMetrics.verified}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">HR approved & verified</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-muted-foreground">
              Pending Verification
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-500">{summaryMetrics.pending}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Under review by HR</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-muted-foreground">
              Rejected Documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-rose-500">{summaryMetrics.rejected}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Requires re-upload</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1 border-border bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium text-muted-foreground">
              Expiring Soon
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-purple-500">{summaryMetrics.expiring}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Expiring in 90 days</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        {/* Navigation Tabs Header */}
        <div className="border-b border-border px-4 pt-3 pb-0">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              All My Documents ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab("employment")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "employment"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              Employment
            </button>
            <button
              onClick={() => setActiveTab("salary-slips")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "salary-slips"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              Salary Slips ({salarySlips.length})
            </button>
            <button
              onClick={() => setActiveTab("provision-slips")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "provision-slips"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              Provision Slips ({provisionSlips.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "pending"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              Pending ({summaryMetrics.pending})
            </button>
            <button
              onClick={() => setActiveTab("verified")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "verified"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              Verified ({summaryMetrics.verified})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`rounded-t-lg px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                activeTab === "rejected"
                  ? "border-b-2 border-primary bg-background/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              Rejected ({summaryMetrics.rejected})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "salary-slips"
                  ? "Search salary slips by month or number..."
                  : activeTab === "provision-slips"
                    ? "Search provision slips by month or number..."
                    : "Search document name, category, type..."
              }
              className="pl-9 text-xs bg-background/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="text-xs text-muted-foreground self-end sm:self-center">
            {activeTab === "salary-slips" ? (
              <span>Showing {filteredSalarySlips.length} salary slips</span>
            ) : activeTab === "provision-slips" ? (
              <span>Showing {filteredProvisionSlips.length} provision slips</span>
            ) : (
              <span>Showing {filteredDocuments.length} personal documents</span>
            )}
          </div>
        </div>

        {/* ── Tab Views ──────────────────────────────────────────────── */}
        <CardContent className="p-0">
          {/* 1. Salary Slips Tab */}
          {activeTab === "salary-slips" ? (
            isLoadingSalary ? (
              <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                Loading salary slips from payroll backend...
              </div>
            ) : filteredSalarySlips.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <h3 className="font-semibold text-base">No Salary Slips Available</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Your salary slips will appear here once official payroll runs are finalized and
                  disbursed.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-xs font-semibold">Pay Period / Month</TableHead>
                      <TableHead className="text-xs font-semibold">Payslip Number</TableHead>
                      <TableHead className="text-xs font-semibold text-right">
                        Gross Salary
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-right">Deductions</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Net Salary</TableHead>
                      <TableHead className="text-xs font-semibold">Generated Date</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalarySlips.map((slip) => (
                      <TableRow key={slip.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium text-xs">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{slip.periodName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {slip.payslipNumber || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-right font-medium">
                          {slip.grossSalary != null
                            ? `₹${slip.grossSalary.toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-right font-medium text-rose-500">
                          {slip.deductions != null
                            ? `₹${slip.deductions.toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-emerald-500">
                          {slip.netSalary != null
                            ? `₹${slip.netSalary.toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {slip.generatedDate
                            ? new Date(slip.generatedDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] capitalize">
                            {slip.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              onClick={() => {
                                setSelectedSlip(slip);
                                setSlipModalOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                            <Button
                              onClick={() => handleDownloadSalarySlip(slip)}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                              title="Download Payslip PDF"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" /> Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : activeTab === "provision-slips" ? (
            /* 2. Provision Slips Tab */
            isLoadingProvision ? (
              <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                Loading provision slips from backend...
              </div>
            ) : filteredProvisionSlips.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <h3 className="font-semibold text-base">No Provision Slips Available</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Your provision slips will appear here once they are generated.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="text-xs font-semibold">Provision Slip Number</TableHead>
                      <TableHead className="text-xs font-semibold">Pay Period / Month</TableHead>
                      <TableHead className="text-xs font-semibold">Employee Name</TableHead>
                      <TableHead className="text-xs font-semibold text-right">
                        Provisioned Amount
                      </TableHead>
                      <TableHead className="text-xs font-semibold">Generated Date</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProvisionSlips.map((slip) => (
                      <TableRow key={slip.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-xs font-medium">
                          {slip.slipNumber || `PRV-${slip.id.slice(0, 8).toUpperCase()}`}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {slip.periodName || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {slip.employeeName || currentUserName}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-amber-500">
                          {slip.provisionedAmount != null
                            ? `₹${slip.provisionedAmount.toLocaleString("en-IN")}`
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {slip.generatedAt
                            ? new Date(slip.generatedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[11px] capitalize">
                            {slip.status || "Provisional"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              onClick={() => {
                                setSelectedProvision(slip);
                                setProvisionModalOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                            <Button
                              onClick={() => handleDownloadProvisionSlip(slip)}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" /> Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : /* 3. Personal Documents Table (All, Employment, Pending, Verified, Rejected) */
          isLoadingDocs ? (
            <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              Loading your documents from the backend...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              {documents.length === 0 ? (
                <>
                  <h3 className="font-semibold text-base">No documents yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Upload your employment documents to keep your records up to date.
                  </p>
                  <div className="pt-2">
                    <Button
                      onClick={handleOpenUploadModal}
                      size="sm"
                      className="gap-1.5 bg-primary text-primary-foreground"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload Document
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-base">No documents found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    No documents match this filter or search query.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Document</TableHead>
                    <TableHead className="text-xs font-semibold">Category</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Uploaded Date</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => {
                    const isRejected = doc.status.toUpperCase() === "REJECTED";
                    return (
                      <TableRow key={doc.id} className="hover:bg-muted/20">
                        {/* Document Name & Description */}
                        <TableCell className="font-medium text-xs max-w-xs">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 rounded-lg bg-blue-500/10 p-2 text-blue-500 shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate">
                                {doc.title || doc.fileName || "Employment Document"}
                              </div>
                              {doc.fileName && (
                                <div className="text-[11px] text-muted-foreground truncate">
                                  {doc.fileName}{" "}
                                  {doc.fileSize
                                    ? `(${((doc.fileSize || 0) / 1024).toFixed(0)} KB)`
                                    : ""}
                                </div>
                              )}
                              {doc.expiryDate && (
                                <div className="mt-0.5 text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Expires:{" "}
                                  {new Date(doc.expiryDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              )}
                              {isRejected && doc.rejectionReason && (
                                <div className="mt-1 text-[11px] text-rose-400 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                                  <span className="font-semibold">Reason:</span>{" "}
                                  {doc.rejectionReason}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-xs">
                          <Badge
                            variant="outline"
                            className="text-[11px] capitalize bg-background/50"
                          >
                            {doc.category || "General"}
                          </Badge>
                        </TableCell>

                        {/* Type */}
                        <TableCell className="text-xs text-muted-foreground">
                          {doc.type || "Document"}
                        </TableCell>

                        {/* Uploaded Date */}
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {doc.uploadedAt
                            ? new Date(doc.uploadedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="text-xs whitespace-nowrap">
                          {renderStatusBadge(doc.status, doc.expiryDate)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              onClick={() => handleViewDocument(doc)}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                              title="View Document"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>

                            <Button
                              onClick={() => handleDownloadDocument(doc)}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                              title="Download File"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" /> Download
                            </Button>

                            {isRejected && (
                              <Button
                                onClick={() => handleOpenReupload(doc)}
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                title="Re-upload Revised Document"
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Re-upload
                              </Button>
                            )}

                            <Button
                              onClick={() => {
                                setSelectedDoc(doc);
                                setDeleteOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400"
                              title="Delete Document"
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
        </CardContent>
      </Card>

      {/* ── Modal: Upload Document ─────────────────────────────────── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload your personal employment document. Once submitted, it will be marked as Pending
              Verification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document Name *</Label>
              <Input
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                placeholder="e.g., Aadhaar Card Front & Back"
                className="mt-1 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Category *</Label>
                <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="mt-1 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORY_MAP).map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Document Type *</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="mt-1 text-xs">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(CATEGORY_MAP[uploadCategory] || ["Other"]).map((typ) => (
                      <SelectItem key={typ} value={typ} className="text-xs">
                        {typ}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other" className="text-xs">
                      Other Custom Type
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploadType === "Other" && (
              <div>
                <Label className="text-xs font-semibold">Specify Custom Type *</Label>
                <Input
                  value={uploadCustomType}
                  onChange={(e) => setUploadCustomType(e.target.value)}
                  placeholder="e.g., Driver Certificate, Patent Copy"
                  className="mt-1 text-xs"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Expiry Date (where applicable)</Label>
                <Input
                  type="date"
                  value={uploadExpiry}
                  onChange={(e) => setUploadExpiry(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">File (PDF, PNG, JPG, JPEG) *</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setUploadFile(f);
                    if (f && !uploadName) {
                      setUploadName(f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
                    }
                  }}
                  className="mt-1 text-xs cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Optional Description / Notes</Label>
              <Textarea
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Provide any additional details for HR verification..."
                rows={2}
                className="mt-1 text-xs"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUploadOpen(false)}
                disabled={isSubmittingUpload}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground gap-1.5"
                disabled={isSubmittingUpload}
              >
                {isSubmittingUpload ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" /> Upload Document
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Re-upload Document (When Rejected) ──────────────── */}
      <Dialog open={reuploadOpen} onOpenChange={setReuploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Re-upload Document</DialogTitle>
            <DialogDescription>
              This document was rejected by HR. Please review the reason below and upload a
              corrected file.
            </DialogDescription>
          </DialogHeader>

          {selectedDoc?.rejectionReason && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <AlertCircle className="h-3.5 w-3.5" /> Rejection Reason from HR:
              </div>
              <p className="leading-relaxed">{selectedDoc.rejectionReason}</p>
            </div>
          )}

          <form onSubmit={handleReuploadSubmit} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Document</Label>
              <div className="mt-1 text-xs font-medium text-foreground">
                {selectedDoc?.title || selectedDoc?.fileName}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Category: {selectedDoc?.category || "General"} · Type:{" "}
                {selectedDoc?.type || "Document"}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Select Clear / Corrected File *</Label>
              <Input
                ref={reuploadInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={(e) => setReuploadFile(e.target.files?.[0] || null)}
                className="mt-1 text-xs cursor-pointer"
                required
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Supported formats: PDF, PNG, JPG, DOCX (Max 10MB)
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setReuploadOpen(false)}
                disabled={isSubmittingReupload}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground gap-1.5"
                disabled={isSubmittingReupload}
              >
                {isSubmittingReupload ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" /> Submit Re-upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Document Preview ────────────────────────────────── */}
      <Dialog open={previewOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-6">
              <span className="truncate">{selectedDoc?.title || "Document Preview"}</span>
              {selectedDoc && (
                <Button
                  onClick={() => handleDownloadDocument(selectedDoc)}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs h-8"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              Category: {selectedDoc?.category || "General"} · Type:{" "}
              {selectedDoc?.type || "Document"}
              {selectedDoc?.uploadedAt &&
                ` · Uploaded: ${new Date(selectedDoc.uploadedAt).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-[400px] max-h-[650px] overflow-auto rounded-lg border border-border bg-muted/20 p-2 flex items-center justify-center">
            {isPreviewLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                <span>Loading document stream from backend storage...</span>
              </div>
            ) : previewBlobUrl ? (
              selectedDoc?.fileName?.toLowerCase().endsWith(".pdf") ||
              selectedDoc?.fileUrl?.toLowerCase().endsWith(".pdf") ||
              !selectedDoc?.fileName?.match(/\.(png|jpe?g|webp|gif)$/i) ? (
                <iframe
                  src={previewBlobUrl}
                  title="Document Preview"
                  className="w-full h-[550px] rounded border-0"
                />
              ) : (
                <img
                  src={previewBlobUrl}
                  alt={selectedDoc?.title || "Document"}
                  className="max-h-[550px] max-w-full object-contain rounded"
                />
              )
            ) : (
              <div className="text-center py-12 space-y-2">
                <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Preview not directly displayable in browser.
                </p>
                {selectedDoc && (
                  <Button
                    onClick={() => handleDownloadDocument(selectedDoc)}
                    size="sm"
                    className="gap-1.5 mt-2"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Stored File
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 flex justify-between items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Status: <span className="font-semibold text-foreground">{selectedDoc?.status}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClosePreview}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Salary Slip Details ─────────────────────────────── */}
      <Dialog open={slipModalOpen} onOpenChange={setSlipModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Salary Slip — {selectedSlip?.periodName}</DialogTitle>
            <DialogDescription>
              Official payslip summary from the OFC360 Payroll Engine.
            </DialogDescription>
          </DialogHeader>

          {selectedSlip && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Payslip Number:</span>
                  <span className="font-mono font-medium">{selectedSlip.payslipNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Pay Period:</span>
                  <span className="font-medium">{selectedSlip.periodName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Generated Date:</span>
                  <span>
                    {selectedSlip.generatedDate
                      ? new Date(selectedSlip.generatedDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px]">
                    {selectedSlip.status}
                  </Badge>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Gross Earnings:</span>
                    <span className="font-semibold">
                      {selectedSlip.grossSalary != null
                        ? `₹${selectedSlip.grossSalary.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Total Deductions:</span>
                    <span className="font-semibold text-rose-400">
                      {selectedSlip.deductions != null
                        ? `₹${selectedSlip.deductions.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-t border-border/50 pt-2">
                    <span>Net Disbursed Salary:</span>
                    <span className="text-emerald-500">
                      {selectedSlip.netSalary != null
                        ? `₹${selectedSlip.netSalary.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" size="sm" onClick={() => setSlipModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => handleDownloadSalarySlip(selectedSlip)}
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground"
                >
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Modal: Provision Slip Details ──────────────────────────── */}
      <Dialog open={provisionModalOpen} onOpenChange={setProvisionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Provision Slip</DialogTitle>
            <DialogDescription>
              Provisional statement generated for audit and pre-disbursement verification.
            </DialogDescription>
          </DialogHeader>

          {selectedProvision && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Provision Slip Number:</span>
                  <span className="font-mono font-medium">
                    {selectedProvision.slipNumber ||
                      `PRV-${selectedProvision.id.slice(0, 8).toUpperCase()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Pay Period:</span>
                  <span className="font-medium">{selectedProvision.periodName || "—"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Employee Name:</span>
                  <span>{selectedProvision.employeeName || currentUserName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Generated Date:</span>
                  <span>
                    {selectedProvision.generatedAt
                      ? new Date(selectedProvision.generatedAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-amber-500/10 text-amber-500 text-[10px]">
                    {selectedProvision.status || "Provisional"}
                  </Badge>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Provisioned Amount:</span>
                    <span className="text-amber-500">
                      {selectedProvision.provisionedAmount != null
                        ? `₹${selectedProvision.provisionedAmount.toLocaleString("en-IN")}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" size="sm" onClick={() => setProvisionModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => handleDownloadProvisionSlip(selectedProvision)}
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground"
                >
                  <Download className="h-3.5 w-3.5" /> Download Slip
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Modal: Delete Confirmation ─────────────────────────────── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-500">
              <AlertTriangle className="h-5 w-5" /> Confirm Document Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{selectedDoc?.title || selectedDoc?.fileName}"
              </span>
              ? This will remove the document permanently from your employee records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeDocumentsPage;
