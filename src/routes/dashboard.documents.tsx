import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Folder, Search, Upload, Wand2, Download, CheckCircle, Clock, XCircle, AlertTriangle,
  FileText, Shield, Trash2, Eye, FileSpreadsheet, RefreshCw, Info, Calendar,
  ShieldCheck, User, AlertCircle
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
import { aurix, uid, useAurix, type HRDocument, type HRDocumentActivity } from "@/lib/aurix-store";
import { toast } from "sonner";

// ----------------------------------------------------
// ROUTE DEFINITION
// ----------------------------------------------------
export const Route = createFileRoute("/dashboard/documents")({
  head: () => ({ meta: [{ title: "Documents — Aurix" }] }),
  component: DocumentsPage,
});

// ----------------------------------------------------
// DOCUMENT CONSTANTS
// ----------------------------------------------------
const CATEGORIES = [
  "Employee Documents",
  "Education",
  "Employment",
  "Company Documents",
] as const;

const CATEGORY_TYPES: Record<string, string[]> = {
  "Employee Documents": ["Aadhaar Card", "PAN Card", "Passport", "Driving Licence", "Voter ID", "Resume", "Photograph"],
  "Education": ["10th Certificate", "12th Certificate", "Graduation", "Post Graduation", "Certifications"],
  "Employment": ["Offer Letter", "Appointment Letter", "Experience Letter", "Relieving Letter", "Salary Slip"],
  "Company Documents": ["HR Policy", "NDA", "Employment Agreement", "Code of Conduct", "Company Handbook"],
};

const STATS_CARDS = [
  { key: "total", title: "Total Documents", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "verified", title: "Verified Documents", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "pending", title: "Pending Verification", color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "rejected", title: "Rejected Documents", color: "text-rose-500", bg: "bg-rose-500/10" },
  { key: "expiring", title: "Expiring Soon", color: "text-purple-500", bg: "bg-purple-500/10" },
];

const DOCUMENT_TEMPLATES = [
  { id: "offer", title: "Offer Letter", category: "Employment", fields: ["Role", "Salary (LPA)", "Start Date"] },
  { id: "nda", title: "Non-Disclosure Agreement (NDA)", category: "Company Documents", fields: ["Witness Name", "Duration (Years)"] },
  { id: "relieving", title: "Relieving Letter", category: "Employment", fields: ["Last Working Day", "Reason for Leaving"] },
  { id: "handbook", title: "Company Handbook Acknowledgment", category: "Company Documents", fields: ["Version Date", "Signee Designation"] },
];

// ----------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------
function DocumentsPage() {
  const ws = useAurix();
  const docs = ws.documents || [];
  const activities = ws.documentActivities || [];

  // Table Filters & Search
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof HRDocument>("uploadDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected document for Preview
  const [previewDoc, setPreviewDoc] = useState<HRDocument | null>(null);

  // Modals state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Edit / Action state
  const [targetDoc, setTargetDoc] = useState<HRDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Upload Form State
  const [uploadEmployee, setUploadEmployee] = useState<string>("company");
  const [uploadCategory, setUploadCategory] = useState<string>("Employee Documents");
  const [uploadType, setUploadType] = useState<string>("Aadhaar Card");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileSize, setUploadFileSize] = useState("");

  // Generator Form State
  const [genTemplateId, setGenTemplateId] = useState("offer");
  const [genEmployee, setGenEmployee] = useState<string>("");
  const [genFields, setGenFields] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  // Sync types dropdown when category changes in Upload modal
  const handleCategoryChange = (val: string) => {
    setUploadCategory(val);
    const types = CATEGORY_TYPES[val] || [];
    if (types.length > 0) setUploadType(types[0]);
  };

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------

  // 1. Upload Handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) {
      toast.error("Please drag or select a mock file to upload.");
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      let empName = "Company-wide";
      if (uploadEmployee !== "company") {
        const emp = ws.employees.find(x => x.id === uploadEmployee);
        if (emp) empName = emp.fullName;
      }

      const newDocId = uid("doc");
      const newDoc: HRDocument = {
        id: newDocId,
        name: uploadFileName,
        employeeId: uploadEmployee === "company" ? undefined : uploadEmployee,
        employeeName: empName,
        category: uploadCategory as any,
        type: uploadType,
        uploadedBy: ws.user?.fullName || "HR Admin",
        uploadDate: new Date().toISOString().split("T")[0],
        expiryDate: uploadExpiry || undefined,
        status: "Pending",
        fileSize: uploadFileSize || "1.2 MB",
        fileType: uploadFileName.split(".").pop() as any || "pdf",
        description: uploadDesc,
      };

      const newActivity: HRDocumentActivity = {
        id: uid("act"),
        documentId: newDocId,
        documentName: uploadFileName,
        action: "Uploaded",
        performedBy: ws.user?.fullName || "HR Admin",
        timestamp: new Date().toISOString(),
        details: `Uploaded ${uploadType} for ${empName}.`
      };

      aurix.set({
        documents: [newDoc, ...docs],
        documentActivities: [newActivity, ...activities]
      });

      toast.success("Document uploaded successfully!");
      setIsUploading(false);
      setUploadOpen(false);

      // Reset fields
      setUploadFileName("");
      setUploadFileSize("");
      setUploadDesc("");
      setUploadExpiry("");
    }, 1200);
  };

  // Drag and drop mock handler
  const handleMockFileDrop = () => {
    const randomNames = ["Aadhaar_Front_Back.jpg", "Degree_Certificate.pdf", "Payslip_May_2026.pdf", "NDA_Final_Signed.pdf"];
    const randomSizes = ["950 KB", "2.4 MB", "420 KB", "1.1 MB"];
    const randIndex = Math.floor(Math.random() * randomNames.length);

    setUploadFileName(randomNames[randIndex]);
    setUploadFileSize(randomSizes[randIndex]);
    toast.info(`Mock file selected: ${randomNames[randIndex]}`);
  };

  // 2. Generate Handler
  const handleGenerateAI = () => {
    setIsGenerating(true);
    setGeneratedDraft(null);

    setTimeout(() => {
      const template = DOCUMENT_TEMPLATES.find(x => x.id === genTemplateId);
      const emp = ws.employees.find(x => x.id === genEmployee);
      const recipient = emp ? emp.fullName : "Valued Professional";

      let text = `AURIX TALENT LABS — OFFICIAL LETTER
Date: ${new Date().toISOString().split("T")[0]}
Recipient: ${recipient}

`;
      if (genTemplateId === "offer") {
        text += `Dear ${recipient},

We are pleased to offer you the position of ${genFields["Role"] || "Frontend Architect"} at Aurix Talent Labs.
Your initial annual compensation package will be INR ${genFields["Salary (LPA)"] || "12.5"} Lakhs per annum, subject to standard deductions.
Your employment will commence on ${genFields["Start Date"] || "2026-07-15"}.

This offer is contingent upon successful verification of your educational certifications and previous employment documents.

Best Regards,
People Ops Team
Aurix Talent Labs`;
      } else if (genTemplateId === "nda") {
        text += `NON-DISCLOSURE AGREEMENT (NDA)

This Agreement is entered into by and between Aurix Talent Labs and ${recipient}, with witness ${genFields["Witness Name"] || "Priya Nair"}.
Both parties agree to hold confidential information in strict confidence for a duration of ${genFields["Duration (Years)"] || "3"} years from signing.
Information shared includes all software source code, corporate records, and recruiting workflows.

Signed by:
Aurix Representative
And Recipient: ${recipient}`;
      } else if (genTemplateId === "relieving") {
        text += `RELIEVING & EXPERIENCE CERTIFICATE

This is to certify that ${recipient} was employed with Aurix Talent Labs.
Their last working day was ${genFields["Last Working Day"] || "2026-06-15"}.
Reason for release: ${genFields["Reason for Leaving"] || "Resignation (Personal growth)"}.

During their tenure, they demonstrated professional competence and sincere dedication. We wish them success in their future endeavors.

Signed,
Priya Nair, People Ops Partner`;
      } else {
        text += `COMPANY HANDBOOK ACKNOWLEDGMENT
Version: ${genFields["Version Date"] || "2026-01-01"}

I, ${recipient}, holding the designation of ${genFields["Signee Designation"] || "Team Lead"},
acknowledge that I have received, read, and understood the policies stated in the Aurix Company Handbook v4.0.

Acknowledged and Signed electronically.`;
      }

      setGeneratedDraft(text);
      setIsGenerating(false);
      toast.success("Document draft generated with AI!");
    }, 1500);
  };

  const handleSaveGenerated = () => {
    if (!generatedDraft) return;

    const template = DOCUMENT_TEMPLATES.find(x => x.id === genTemplateId)!;
    const emp = ws.employees.find(x => x.id === genEmployee);
    const empName = emp ? emp.fullName : "Company-wide";

    const fileName = `${template.title.replace(/\s+/g, "_")}_${empName.replace(/\s+/g, "_")}.pdf`;

    const newDocId = uid("doc");
    const newDoc: HRDocument = {
      id: newDocId,
      name: fileName,
      employeeId: genEmployee || undefined,
      employeeName: empName,
      category: template.category as any,
      type: template.title.split(" (")[0],
      uploadedBy: "AI Generator",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Verified", // AI templates generated by HR are verified instantly
      fileSize: "140 KB",
      fileType: "pdf",
      description: `Generated AI Template for ${empName}`,
    };

    const newActivity: HRDocumentActivity = {
      id: uid("act"),
      documentId: newDocId,
      documentName: fileName,
      action: "Uploaded",
      performedBy: ws.user?.fullName || "HR Admin",
      timestamp: new Date().toISOString(),
      details: `Generated AI ${template.title} for ${empName}.`
    };

    aurix.set({
      documents: [newDoc, ...docs],
      documentActivities: [newActivity, ...activities]
    });

    toast.success("Generated document saved to Vault!");
    setGenerateOpen(false);
    setGeneratedDraft(null);
  };

  // 3. Verification Workflow Actions
  const handleVerify = (doc: HRDocument) => {
    const updatedDocs = docs.map(d => {
      if (d.id === doc.id) return { ...d, status: "Verified" as const, rejectionReason: undefined };
      return d;
    });

    const newActivity: HRDocumentActivity = {
      id: uid("act"),
      documentId: doc.id,
      documentName: doc.name,
      action: "Verified",
      performedBy: ws.user?.fullName || "HR Admin",
      timestamp: new Date().toISOString(),
      details: `Verified ${doc.type} for ${doc.employeeName || "Company"}.`
    };

    aurix.set({
      documents: updatedDocs,
      documentActivities: [newActivity, ...activities]
    });

    // Update preview doc if open
    if (previewDoc?.id === doc.id) {
      setPreviewDoc({ ...doc, status: "Verified" as const, rejectionReason: undefined });
    }

    toast.success(`Verified document: ${doc.name}`);
  };

  const handleRejectPrompt = (doc: HRDocument) => {
    setTargetDoc(doc);
    setRejectionReason("");
    setRejectOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!targetDoc) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    const updatedDocs = docs.map(d => {
      if (d.id === targetDoc.id) return { ...d, status: "Rejected" as const, rejectionReason };
      return d;
    });

    const newActivity: HRDocumentActivity = {
      id: uid("act"),
      documentId: targetDoc.id,
      documentName: targetDoc.name,
      action: "Rejected",
      performedBy: ws.user?.fullName || "HR Admin",
      timestamp: new Date().toISOString(),
      details: `Rejected ${targetDoc.type}: ${rejectionReason}`
    };

    aurix.set({
      documents: updatedDocs,
      documentActivities: [newActivity, ...activities]
    });

    // Update preview doc if open
    if (previewDoc?.id === targetDoc.id) {
      setPreviewDoc({ ...targetDoc, status: "Rejected" as const, rejectionReason });
    }

    toast.warning(`Document rejected: ${targetDoc.name}`);
    setRejectOpen(false);
    setTargetDoc(null);
  };

  const handleRequestReupload = (doc: HRDocument) => {
    const updatedDocs = docs.map(d => {
      if (d.id === doc.id) return { ...d, status: "Pending" as const, rejectionReason: "Re-upload requested. Please supply a clear copy." };
      return d;
    });

    const newActivity: HRDocumentActivity = {
      id: uid("act"),
      documentId: doc.id,
      documentName: doc.name,
      action: "Updated",
      performedBy: ws.user?.fullName || "HR Admin",
      timestamp: new Date().toISOString(),
      details: `Requested re-upload for ${doc.type}`
    };

    aurix.set({
      documents: updatedDocs,
      documentActivities: [newActivity, ...activities]
    });

    if (previewDoc?.id === doc.id) {
      setPreviewDoc({ ...doc, status: "Pending" as const, rejectionReason: "Re-upload requested. Please supply a clear copy." });
    }

    toast.info(`Requested re-upload for: ${doc.name}`);
  };

  // 4. Delete Handler
  const handleDeletePrompt = (doc: HRDocument) => {
    setTargetDoc(doc);
    setDeleteOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (!targetDoc) return;

    const filteredDocs = docs.filter(d => d.id !== targetDoc.id);

    const newActivity: HRDocumentActivity = {
      id: uid("act"),
      documentId: targetDoc.id,
      documentName: targetDoc.name,
      action: "Updated",
      performedBy: ws.user?.fullName || "HR Admin",
      timestamp: new Date().toISOString(),
      details: `Deleted document: ${targetDoc.name}`
    };

    aurix.set({
      documents: filteredDocs,
      documentActivities: [newActivity, ...activities]
    });

    if (previewDoc?.id === targetDoc.id) {
      setPreviewDoc(null);
    }

    toast.error(`Deleted document: ${targetDoc.name}`);
    setDeleteOpen(false);
    setTargetDoc(null);
  };

  // Mock Download
  const handleDownload = (doc: HRDocument) => {
    toast.success(`Downloading ${doc.name}...`);
    const newActivity: HRDocumentActivity = {
      id: uid("act"),
      documentId: doc.id,
      documentName: doc.name,
      action: "Downloaded",
      performedBy: ws.user?.fullName || "HR Admin",
      timestamp: new Date().toISOString(),
      details: `Downloaded document ${doc.name}`
    };
    aurix.set({ documentActivities: [newActivity, ...activities] });

    const element = document.createElement("a");
    const file = new Blob([`Aurix HR Vault. Document ID: ${doc.id}\nCategory: ${doc.category}\nName: ${doc.name}\nStatus: ${doc.status}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // ----------------------------------------------------
  // COMPUTED CALCULATIONS (STATS / FILTERS)
  // ----------------------------------------------------

  // Stats Card data
  const stats = useMemo(() => {
    const total = docs.length;
    const verified = docs.filter(d => d.status === "Verified").length;
    const pending = docs.filter(d => d.status === "Pending").length;
    const rejected = docs.filter(d => d.status === "Rejected").length;

    // Check expiring (expiry within 30 days of 2026-06-28)
    const mockNow = new Date("2026-06-28").getTime();
    const thirtyDaysLimit = mockNow + 30 * 24 * 60 * 60 * 1000;
    const expiring = docs.filter(d => {
      if (!d.expiryDate) return false;
      const t = new Date(d.expiryDate).getTime();
      return t >= mockNow && t <= thirtyDaysLimit;
    }).length;

    return { total, verified, pending, rejected, expiring };
  }, [docs]);

  // System Notifications Alerts
  const notifications = useMemo(() => {
    const alerts: { id: string; type: "warning" | "info" | "error"; message: string; doc?: HRDocument }[] = [];

    // Expiring soon alert
    const mockNow = new Date("2026-06-28").getTime();
    const thirtyDaysLimit = mockNow + 30 * 24 * 60 * 60 * 1000;
    docs.forEach(d => {
      if (d.expiryDate) {
        const t = new Date(d.expiryDate).getTime();
        if (t >= mockNow && t <= thirtyDaysLimit) {
          alerts.push({
            id: `exp_${d.id}`,
            type: "warning",
            message: `${d.employeeName || "Company"}'s ${d.type} is expiring soon on ${d.expiryDate}.`,
            doc: d,
          });
        }
      }
    });

    // Pending review alert
    const pendingDocs = docs.filter(d => d.status === "Pending");
    if (pendingDocs.length > 0) {
      alerts.push({
        id: "alert_pending",
        type: "info",
        message: `You have ${pendingDocs.length} documents awaiting review and verification.`,
      });
    }

    // Missing critical document checks (Aadhaar & PAN are mandatory for all employees)
    ws.employees.forEach(emp => {
      const empDocs = docs.filter(d => d.employeeId === emp.id);
      const hasAadhaar = empDocs.some(d => d.type === "Aadhaar Card");
      const hasPAN = empDocs.some(d => d.type === "PAN Card");

      if (!hasAadhaar) {
        alerts.push({
          id: `miss_aadhaar_${emp.id}`,
          type: "error",
          message: `Mandatory document: Aadhaar Card is missing for ${emp.fullName}.`,
        });
      }
      if (!hasPAN) {
        alerts.push({
          id: `miss_pan_${emp.id}`,
          type: "error",
          message: `Mandatory document: PAN Card is missing for ${emp.fullName}.`,
        });
      }
    });

    return alerts;
  }, [docs, ws.employees]);

  // Table Filtering & Searching
  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        (d.employeeName && d.employeeName.toLowerCase().includes(q.toLowerCase())) ||
        d.category.toLowerCase().includes(q.toLowerCase()) ||
        d.type.toLowerCase().includes(q.toLowerCase());

      let matchesTab = true;
      if (activeFilter === "Employee Documents") {
        matchesTab = d.category === "Employee Documents" || d.category === "Education" || d.category === "Employment";
      } else if (activeFilter === "Company Documents") {
        matchesTab = d.category === "Company Documents";
      } else if (activeFilter === "HR Templates") {
        matchesTab = d.category === "Company Documents" && (d.type === "NDA" || d.type === "HR Policy" || d.type === "Company Handbook");
      } else if (activeFilter === "Pending") {
        matchesTab = d.status === "Pending";
      } else if (activeFilter === "Verified") {
        matchesTab = d.status === "Verified";
      } else if (activeFilter === "Rejected") {
        matchesTab = d.status === "Rejected";
      }

      return matchesQ && matchesTab;
    });
  }, [docs, q, activeFilter]);

  // Table Sorting
  const sortedDocs = useMemo(() => {
    const sorted = [...filteredDocs];
    sorted.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDocs, sortField, sortOrder]);

  // Paginated elements
  const paginatedDocs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDocs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDocs, currentPage]);

  const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);

  const handleSort = (field: keyof HRDocument) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Documents"
        description="Securely store, verify, and generate employee records and company templates."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setUploadOpen(true)}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button
              onClick={() => {
                setGenerateOpen(true);
                if (ws.employees.length > 0) setGenEmployee(ws.employees[0].id);
              }}
              className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Wand2 className="h-4 w-4" />
              Generate Document
            </Button>
          </div>
        }
      />

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS_CARDS.map(card => {
          const val = stats[card.key as keyof typeof stats];
          return (
            <Card key={card.key} className="border-border bg-card/40 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${card.bg}`}>
                    <Folder className={`h-3.5 w-3.5 ${card.color}`} />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display tracking-tight">{val}</span>
                  {card.key === "verified" && docs.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      ({Math.round((val / docs.length) * 100)}%)
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. MAIN CONTENTS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* LEFT COLUMN: FILTERS, TABLE, AND PAGINATION */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
            {/* Search & Filter pills */}
            <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={e => {
                    setQ(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, employee, category..."
                  className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* CSV Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const headers = ["ID", "Name", "Employee", "Category", "Type", "Uploaded By", "Date", "Expiry", "Status", "Size"];
                  const rows = docs.map(d => [
                    d.id,
                    d.name,
                    d.employeeName || "Company-wide",
                    d.category,
                    d.type,
                    d.uploadedBy,
                    d.uploadDate,
                    d.expiryDate || "",
                    d.status,
                    d.fileSize
                  ].map(v => `"${v.replace(/"/g, '""')}"`).join(","));
                  const csv = [headers.join(","), ...rows].join("\n");
                  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "documents_vault.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Exported documents catalog CSV");
                }}
                className="h-9 gap-1.5 border-border bg-background/40 hover:bg-accent/60 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                Export CSV
              </Button>
            </div>

            {/* Scrollable Filters row */}
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-border bg-muted/10 scrollbar-none">
              {[
                { id: "all", label: "All Vault" },
                { id: "Employee Documents", label: "Employee Files" },
                { id: "Company Documents", label: "Company Documents" },
                { id: "HR Templates", label: "HR Templates" },
                { id: "Pending", label: "Pending Verification" },
                { id: "Verified", label: "Verified" },
                { id: "Rejected", label: "Rejected" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TABLE LIST */}
            {paginatedDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
                  <Folder className="h-6 w-6" />
                </div>
                <p className="font-semibold text-foreground">No documents found</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your search criteria, clearing the filters, or upload a new record.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px] border-collapse">
                  <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("name")}>
                        Document Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("employeeName")}>
                        Employee {sortField === "employeeName" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("category")}>
                        Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 text-muted-foreground">Uploaded By</TableHead>
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("uploadDate")}>
                        Upload Date {sortField === "uploadDate" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 text-muted-foreground">Expiry Date</TableHead>
                      <TableHead className="px-4 py-3 text-center text-muted-foreground">Status</TableHead>
                      <TableHead className="px-4 py-3 text-muted-foreground">File Size</TableHead>
                      <TableHead className="px-4 py-3 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDocs.map(doc => {
                      const isExpiring = doc.expiryDate && new Date(doc.expiryDate).getTime() <= new Date("2026-06-28").getTime() + 30 * 24 * 60 * 60 * 1000;
                      return (
                        <TableRow
                          key={doc.id}
                          className="group border-t border-border transition-colors hover:bg-accent/25 cursor-pointer"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
                                <FileText className="h-4 w-4" />
                              </span>
                              <div className="font-medium text-foreground max-w-[200px] truncate" title={doc.name}>
                                {doc.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 font-medium text-foreground/80">
                            {doc.employeeName || (
                              <span className="text-xs text-muted-foreground italic">Company-wide</span>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="text-xs text-muted-foreground">{doc.category}</div>
                            <div className="text-xs font-semibold text-foreground/75 mt-0.5">{doc.type}</div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                            {doc.uploadedBy}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                            {doc.uploadDate}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs">
                            {doc.expiryDate ? (
                              <span className={isExpiring ? "text-purple-500 font-medium" : "text-muted-foreground"}>
                                {doc.expiryDate}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40 italic">—</span>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            {doc.status === "Verified" && (
                              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 gap-1 border-none shadow-none font-medium">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </Badge>
                            )}
                            {doc.status === "Pending" && (
                              <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 gap-1 border-none shadow-none font-medium">
                                <Clock className="h-3 w-3" /> Pending
                              </Badge>
                            )}
                            {doc.status === "Rejected" && (
                              <Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 gap-1 border-none shadow-none font-medium">
                                <XCircle className="h-3 w-3" /> Rejected
                              </Badge>
                            )}
                            {doc.status === "Expired" && (
                              <Badge className="bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 gap-1 border-none shadow-none font-medium">
                                <AlertTriangle className="h-3 w-3" /> Expired
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                            {doc.fileSize}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                                title="View inline mockup"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                                title="Download Document"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              {doc.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleVerify(doc)}
                                    className="rounded p-1.5 text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                    title="Verify & Approve"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectPrompt(doc)}
                                    className="rounded p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Reject Document"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeletePrompt(doc)}
                                className="rounded p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Showing Page <strong className="font-semibold text-foreground">{currentPage}</strong> of <strong className="font-semibold text-foreground">{totalPages}</strong>
                </span>
                <div className="flex gap-1.5">
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

        {/* RIGHT COLUMN: NOTIFICATIONS ALERTS & ACTIVITY TIMELINE */}
        <div className="space-y-6 lg:col-span-1">
          {/* Alerts Widget */}
          <Card className="border-border bg-card/40 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                Alerts & Notifications
              </CardTitle>
              <CardDescription className="text-xs">Document events needing attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-4 italic">
                  All employee compliance files up to date!
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
                      <p className="font-medium leading-relaxed">{alert.message}</p>
                      {alert.doc && (
                        <button
                          onClick={() => setPreviewDoc(alert.doc!)}
                          className="mt-1 text-[10px] underline font-bold uppercase cursor-pointer"
                        >
                          Review File
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-border bg-card/40 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                Recent Activities
              </CardTitle>
              <CardDescription className="text-xs">Audit log of system events</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative pl-6 pr-4 pb-4 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                {activities.slice(0, 5).map(act => (
                  <div key={act.id} className="relative text-xs">
                    <span className={`absolute -left-[19px] top-1 grid h-2 w-2 place-items-center rounded-full border bg-background ${
                      act.action === "Verified"
                        ? "border-emerald-500 bg-emerald-500"
                        : act.action === "Rejected"
                        ? "border-rose-500 bg-rose-500"
                        : "border-muted-foreground"
                    }`} />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{act.performedBy}</span>
                      <span>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-0.5 font-medium text-foreground/80">{act.details || act.action}</p>
                    <span className="text-[10px] text-muted-foreground/80 block mt-0.5 italic truncate max-w-full">
                      File: {act.documentName}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ----------------------------------------------------
          UPLOAD DOCUMENT MODAL
         ---------------------------------------------------- */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Upload New Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Employee dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Employee Association</Label>
              <Select value={uploadEmployee} onValueChange={setUploadEmployee}>
                <SelectTrigger className="w-full bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="company">Company-wide (No specific employee)</SelectItem>
                  {ws.employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grid for Category & Document Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Document Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(CATEGORY_TYPES[uploadCategory] || []).map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={uploadExpiry}
                  onChange={e => setUploadExpiry(e.target.value)}
                  className="pl-9 bg-background/50 border-border text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Description / Notes</Label>
              <Textarea
                placeholder="Specify file details or compliance requirements"
                value={uploadDesc}
                onChange={e => setUploadDesc(e.target.value)}
                className="min-h-[60px] bg-background/50 border-border text-xs"
              />
            </div>

            {/* Mock Drag & Drop Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Upload File (PDF, JPG, PNG, DOCX)</Label>
              {uploadFileName ? (
                <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[200px]">{uploadFileName}</p>
                      <p className="text-[10px] text-muted-foreground">{uploadFileSize}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setUploadFileName(""); setUploadFileSize(""); }}
                    className="h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer"
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div
                  onClick={handleMockFileDrop}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer"
                >
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">Click to simulate dragging & dropping a file</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Supports PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadOpen(false)}
                className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          AI DOCUMENT GENERATOR MODAL
         ---------------------------------------------------- */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-2xl bg-background border-border shadow-2xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 h-[580px] divide-y md:divide-y-0 md:divide-x divide-border">
            {/* LEFT 2 PANELS: FORM SELECTORS */}
            <div className="md:col-span-2 p-5 flex flex-col justify-between h-full bg-muted/10">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold flex items-center gap-1.5">
                    <Wand2 className="h-4 w-4 text-indigo-500 animate-pulse" />
                    AI Letter Generator
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Generate compliant contracts and documents.</p>
                </div>

                {/* Template choice */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Document Template</Label>
                  <Select
                    value={genTemplateId}
                    onValueChange={val => {
                      setGenTemplateId(val);
                      setGenFields({});
                      setGeneratedDraft(null);
                    }}
                  >
                    <SelectTrigger className="h-8 bg-background/70 border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Employee */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">For Employee</Label>
                  <Select value={genEmployee} onValueChange={setGenEmployee}>
                    <SelectTrigger className="h-8 bg-background/70 border-border text-xs">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {ws.employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Template fields */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Template Parameters</div>
                  {DOCUMENT_TEMPLATES.find(x => x.id === genTemplateId)?.fields.map(field => (
                    <div key={field} className="space-y-1">
                      <Label className="text-[11px] text-foreground/80">{field}</Label>
                      <Input
                        value={genFields[field] || ""}
                        onChange={e => setGenFields({ ...genFields, [field]: e.target.value })}
                        className="h-8 bg-background/50 border-border text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !genEmployee}
                  className="w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  {isGenerating ? "Drafting with AI..." : "Generate Draft"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setGenerateOpen(false)}
                  className="h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* RIGHT 3 PANELS: AI PREVIEW */}
            <div className="md:col-span-3 p-5 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-foreground">Document Draft Preview</span>
                  <Badge variant="outline" className="text-[9px] border-indigo-500/20 text-indigo-500 bg-indigo-500/5">
                    Ready to Save
                  </Badge>
                </div>

                <div className="flex-1 overflow-auto bg-muted/20 border border-border rounded-xl p-4 mt-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                      <p className="font-semibold">AI Assistant drafting letter...</p>
                      <p className="text-[10px] text-muted-foreground/85">Formatting with official templates & clauses</p>
                    </div>
                  ) : generatedDraft ? (
                    generatedDraft
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Wand2 className="h-6 w-6 text-muted-foreground/50 mb-2" />
                      <p className="font-semibold">No Draft Available</p>
                      <p className="text-[10px]">Select an employee, configure parameters, and generate the contract.</p>
                    </div>
                  )}
                </div>
              </div>

              {generatedDraft && (
                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedDraft(null)}
                    className="h-9 text-xs border-border bg-transparent cursor-pointer"
                  >
                    Clear Draft
                  </Button>
                  <Button
                    onClick={handleSaveGenerated}
                    className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Save & Verify Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          REJECT DOCUMENT REASON DIALOG
         ---------------------------------------------------- */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500 flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5" />
              Reject Document Compliance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              Please state the reason for rejecting <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>. The employee will see this feedback.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Signature cut off, document blur, expired date, wrong employee ID..."
              className="min-h-[100px] border-border text-xs"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setRejectOpen(false); setTargetDoc(null); }}
              className="h-9 border-border bg-transparent cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          DELETE DOCUMENT CONFIRMATION DIALOG
         ---------------------------------------------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground">Delete Document</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground">
            Are you sure you want to permanently delete <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>? This action will wipe the file and remove it from audit history.
          </div>
          <DialogFooter className="gap-1.5">
            <Button
              variant="outline"
              onClick={() => { setDeleteOpen(false); setTargetDoc(null); }}
              className="h-9 border-border bg-transparent cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Delete File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          SLIDE-OUT PREVIEW PANEL SHEET
         ---------------------------------------------------- */}
      <Sheet open={!!previewDoc} onOpenChange={open => !open && setPreviewDoc(null)}>
        <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {previewDoc && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide border-border">
                    {previewDoc.category}
                  </Badge>
                  {previewDoc.status === "Verified" && (
                    <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border-none shadow-none font-medium text-xs">
                      Verified
                    </Badge>
                  )}
                  {previewDoc.status === "Pending" && (
                    <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 border-none shadow-none font-medium text-xs">
                      Pending Review
                    </Badge>
                  )}
                  {previewDoc.status === "Rejected" && (
                    <Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border-none shadow-none font-medium text-xs">
                      Rejected
                    </Badge>
                  )}
                  {previewDoc.status === "Expired" && (
                    <Badge className="bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 border-none shadow-none font-medium text-xs">
                      Expired
                    </Badge>
                  )}
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={previewDoc.name}>
                  {previewDoc.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                  Type: {previewDoc.type} &bull; Uploaded by {previewDoc.uploadedBy} on {previewDoc.uploadDate}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable sheet body */}
              <ScrollArea className="flex-1 p-5 min-h-0">
                <div className="space-y-6">
                  {/* CANVAS GRAPHICAL VISUAL MOCKUP PREVIEW */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Inline Verification View</Label>
                    <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 aspect-[4/3] relative flex items-center justify-center p-4">
                      {/* Sub-components representing specific document lookups */}
                      {previewDoc.type === "Aadhaar Card" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-sky-50 dark:bg-sky-950/20 border border-sky-300/40 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[7px] font-bold text-sky-800 dark:text-sky-400 uppercase leading-none">Government of India</p>
                              <p className="text-[5px] text-sky-600/80 leading-none">Unique Identification Authority of India</p>
                            </div>
                            <span className="h-5 w-5 bg-sky-200 dark:bg-sky-800 rounded-full opacity-60" />
                          </div>

                          <div className="flex gap-2.5 my-2">
                            {/* photo */}
                            <div className="w-12 h-14 bg-sky-200 dark:bg-sky-900 border border-sky-400/20 rounded flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div className="text-[6px] space-y-1 text-sky-900 dark:text-sky-200 text-left">
                              <p><strong className="font-semibold text-[8px]">{previewDoc.employeeName || "Jordan Lee"}</strong></p>
                              <p>DOB: 12/04/1996</p>
                              <p>Gender: Male</p>
                              <p className="mt-1 leading-relaxed text-[5px] opacity-75 text-left">Address: 12th Cross Rd, Indiranagar, Bangalore, 560038</p>
                            </div>
                          </div>

                          <div className="border-t border-sky-400/20 pt-1.5 flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-sky-900 dark:text-sky-100 tracking-wider">
                              1984 0122 1042
                            </span>
                            <span className="text-[5px] uppercase font-bold text-sky-800 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-1 py-0.5 rounded">
                              Mera Aadhaar
                            </span>
                          </div>
                        </div>
                      ) : previewDoc.type === "PAN Card" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-emerald-400/30 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-center border-b border-emerald-500/20 pb-1.5">
                            <span className="text-[6px] uppercase font-bold text-emerald-800 dark:text-emerald-400 leading-none">Income Tax Department</span>
                            <span className="text-[6px] text-emerald-600 font-medium leading-none">GOVT OF INDIA</span>
                          </div>

                          <div className="flex gap-3 my-2.5">
                            <div className="w-10 h-12 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-500/20 rounded flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="text-[6px] space-y-1 text-emerald-900 dark:text-emerald-100 text-left">
                              <p>Name: <strong className="font-semibold">{previewDoc.employeeName || "Jordan Lee"}</strong></p>
                              <p>Father's Name: K. M. Lee</p>
                              <p>Date of Birth: 12/04/1996</p>
                              <p className="mt-1 font-mono text-[9px] font-bold text-emerald-900 dark:text-emerald-100 tracking-wide">
                                ABCDE1042F
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[5px]">
                            <span className="italic border-b border-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-mono">
                              {previewDoc.employeeName?.split(" ")[0] || "Jordan"}
                            </span>
                            <span className="h-4 w-4 bg-yellow-400/40 dark:bg-yellow-500/20 rounded-full" />
                          </div>
                        </div>
                      ) : previewDoc.type === "Passport" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-start border-b border-slate-700 pb-1">
                            <span className="text-[6px] uppercase font-bold tracking-widest text-slate-400">Republic of India</span>
                            <span className="text-[6px] uppercase font-bold text-slate-400">PASSPORT</span>
                          </div>

                          <div className="flex gap-3.5 my-2">
                            <div className="w-12 h-14 bg-slate-800 border border-slate-700 rounded flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="text-[6px] space-y-0.5 text-slate-300 text-left">
                              <p>Surname: <strong className="font-semibold text-slate-100 uppercase">{previewDoc.employeeName?.split(" ").pop() || "LEE"}</strong></p>
                              <p>Given Names: <strong className="font-semibold text-slate-100">{previewDoc.employeeName?.split(" ")[0] || "JORDAN"}</strong></p>
                              <p>Nationality: Indian</p>
                              <p>Passport No: <span className="font-mono font-bold text-yellow-400">Z3210452</span></p>
                              <p>Expiry: {previewDoc.expiryDate || "2030-01-01"}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[4px] font-mono text-slate-500 tracking-wider">
                            P&lt;IND&lt;&lt;JORDAN&lt;LEE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                          </div>
                        </div>
                      ) : (previewDoc.category === "Company Documents" || previewDoc.type === "Resume" || previewDoc.type === "Offer Letter" || previewDoc.type === "Relieving Letter") ? (
                        <div className="w-[300px] h-[200px] bg-white text-slate-800 border border-slate-300 rounded shadow-md p-4 relative flex flex-col justify-between overflow-hidden select-none">
                          <div className="border-b border-slate-300 pb-2">
                            <p className="text-[7px] font-bold text-slate-900 tracking-wide flex items-center gap-1">
                              <ShieldCheck className="h-2.5 w-2.5 text-indigo-600" />
                              AURIX TALENT LABS
                            </p>
                            <p className="text-[5px] text-slate-400 leading-none">Internal Compliance & Human Resources Vault</p>
                          </div>

                          <div className="my-2 text-left space-y-1.5">
                            <p className="text-[8px] font-bold text-slate-900 underline truncate">{previewDoc.name}</p>
                            <p className="text-[5px] text-slate-500 leading-relaxed max-w-full">
                              This document stands as an official record of Aurix HR Talent Labs. Details contained herein are confidential under corporate NDAs and data processing regulations.
                            </p>
                            <p className="text-[5px] text-slate-600 italic">
                              Category: {previewDoc.category} &bull; Type: {previewDoc.type}
                            </p>
                          </div>

                          <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[5px] text-slate-400">
                            <span>Verification Hash: SHA-256</span>
                            <span className="h-3 w-10 bg-indigo-500/10 rounded flex items-center justify-center font-bold text-indigo-600 text-[4px]">
                              SECURE DOC
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[300px] aspect-[4/3] bg-card border border-border rounded flex flex-col items-center justify-center p-4">
                          <FileText className="h-10 w-10 text-muted-foreground/60 mb-2" />
                          <p className="text-xs font-semibold text-foreground text-center truncate w-full">{previewDoc.name}</p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1">Generic binary layout view</p>
                        </div>
                      )}

                      {/* PDF Overlay symbol */}
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        {previewDoc.fileType}
                      </span>
                    </div>
                  </div>

                  {/* REJECTION WARNING CALLOUT */}
                  {previewDoc.status === "Rejected" && previewDoc.rejectionReason && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Rejection Compliance Remarks:
                      </div>
                      <p className="leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left">
                        "{previewDoc.rejectionReason}"
                      </p>
                    </div>
                  )}

                  {/* METADATA DETAILS */}
                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Document Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Employee Owner</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.employeeName || "Company-wide"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Verification Type</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.type}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">File Size</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.fileSize}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Expiry Date</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.expiryDate || "No expiration date"}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[10px]">Internal Description</span>
                        <p className="text-foreground mt-0.5 leading-relaxed">{previewDoc.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>

                  {/* TIMELINE OF WORKFLOW */}
                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Verification Audit Timeline</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
                      {/* Step 1: Uploaded */}
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0">
                          <CheckCircle className="h-2.5 w-2.5 animate-bounce" />
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Uploaded & Saved</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            By {previewDoc.uploadedBy} on {previewDoc.uploadDate}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Under Review */}
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${
                          previewDoc.status === "Pending" ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                        }`}>
                          {previewDoc.status === "Pending" ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Compliance Review</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {previewDoc.status === "Pending" ? "Awaiting review from Human Resources" : "Reviewed by People Ops Officer"}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Verified or Rejected */}
                      <div className="flex gap-3 text-xs">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${
                          previewDoc.status === "Pending"
                            ? "border border-border text-muted-foreground bg-muted"
                            : previewDoc.status === "Verified"
                            ? "bg-emerald-500 text-white"
                            : previewDoc.status === "Rejected"
                            ? "bg-rose-500 text-white"
                            : "bg-slate-500 text-white"
                        }`}>
                          {previewDoc.status === "Verified" ? (
                            <CheckCircle className="h-2.5 w-2.5" />
                          ) : previewDoc.status === "Rejected" ? (
                            <XCircle className="h-2.5 w-2.5" />
                          ) : (
                            <Clock className="h-2.5 w-2.5" />
                          )}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Final Compliance Status</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {previewDoc.status === "Verified" && `Verified & Approved`}
                            {previewDoc.status === "Rejected" && `Rejected: ${previewDoc.rejectionReason}`}
                            {previewDoc.status === "Pending" && `Decision pending`}
                            {previewDoc.status === "Expired" && `Expired`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FUTURE-READY PLACEHOLDER NOTICE */}
                  <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                    <h5 className="font-bold flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-indigo-500" />
                      Smart Verification Gateways
                    </h5>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                      This component is modularized to support direct APIs for DigiLocker, Aadhaar ID checks, PAN Tax validations, and E-Signatures.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              {/* Sheet footer buttons */}
              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                {previewDoc.status === "Pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRequestReupload(previewDoc)}
                      className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
                      Request Re-upload
                    </Button>
                    <Button
                      onClick={() => handleRejectPrompt(previewDoc)}
                      className="h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 gap-1.5 cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject Document
                    </Button>
                    <Button
                      onClick={() => handleVerify(previewDoc)}
                      className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verify & Approve
                    </Button>
                  </>
                )}
                {previewDoc.status !== "Pending" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedDocs = docs.map(d => {
                        if (d.id === previewDoc.id) return { ...d, status: "Pending" as const, rejectionReason: undefined };
                        return d;
                      });
                      aurix.set({ documents: updatedDocs });
                      setPreviewDoc({ ...previewDoc, status: "Pending" as const, rejectionReason: undefined });
                      toast.info("Document reset to Pending review state");
                    }}
                    className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer"
                  >
                    Reset Status to Review
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDownload(previewDoc)}
                  className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
