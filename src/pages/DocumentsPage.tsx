import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aurix, uid, useAurix, type HRDocument, type HRDocumentActivity } from "@/lib/aurix-store";
import { toast } from "sonner";
import { apiInstance } from "@/api";

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
export function DocumentsPage() {
  const ws = useAurix();
  const [liveDocs, setLiveDocs] = useState<HRDocument[]>([]);
  const docs = liveDocs.length > 0 ? liveDocs : (ws.documents || []);
  const activities = ws.documentActivities || [];

  const [loadingLive, setLoadingLive] = useState(false);
  const [employeesList, setEmployeesList] = useState<Array<{
    id: string;
    fullName: string;
    employeeId: string;
    department: string;
    designation: string;
    location: string;
    joiningDate: string;
    email: string;
    phone: string;
    panNumber: string;
    fatherName: string;
  }>>([]);

  // Generator Form State
  const [genTemplateId, setGenTemplateId] = useState("offer");
  const [genEmployee, setGenEmployee] = useState<string>("general");
  const [genFields, setGenFields] = useState<Record<string, string>>({});

  const fetchLiveDocumentsData = useCallback(async () => {
    setLoadingLive(true);
    try {
      const [docsRes, empsRes] = await Promise.allSettled([
        apiInstance.get("/documents/employees", { params: { limit: 100 } }),
        apiInstance.get("/employees", { params: { limit: 100 } }),
      ]);

      let liveEmps: Array<{
        id: string;
        fullName: string;
        employeeId: string;
        department: string;
        designation: string;
        location: string;
        joiningDate: string;
        email: string;
        phone: string;
        panNumber: string;
        fatherName: string;
      }> = [];
      if (empsRes.status === "fulfilled" && empsRes.value.data?.data) {
        const empItems = empsRes.value.data.data.items ?? empsRes.value.data.data ?? [];
        liveEmps = empItems.map((e: any) => ({
          id: e.id,
          fullName: [e.first_name, e.last_name].filter(Boolean).join(" ").trim() || e.full_name || e.employee_id || "Vinit Sharma",
          employeeId: e.employee_id || "EMP-190996",
          department: e.department || "Developer",
          designation: e.designation || "Senior Software Architect",
          location: e.work_location || "Hyderabad, Telangana",
          joiningDate: e.joining_date || "2026-08-01",
          email: e.company_email || e.personal_email || "aurix@gmail.com",
          phone: e.phone || "8976499879",
          panNumber: e.pan_number || "QYPPS7378N",
          fatherName: e.father_name || "Dinesh Kumar Sharma",
        }));
        setEmployeesList(liveEmps);
      }

      if (docsRes.status === "fulfilled" && docsRes.value.data?.data) {
        const rawDocs = docsRes.value.data.data;
        if (Array.isArray(rawDocs) && rawDocs.length > 0) {
          const mapped: HRDocument[] = rawDocs.map((d: any) => {
            const empName = d.employee
              ? [d.employee.first_name, d.employee.last_name].filter(Boolean).join(" ").trim()
              : (liveEmps.find((e) => e.id === d.employee_id)?.fullName || "Vinit Sharma");

            const rawCategory = d.category?.name || d.document_type || "Employee Documents";
            let category: HRDocument["category"] = "Employee Documents";
            if (rawCategory.includes("Education") || rawCategory.includes("EDU") || rawCategory.includes("DEGREE") || rawCategory.includes("MARKSHEET")) {
              category = "Education";
            } else if (rawCategory.includes("Employment") || rawCategory.includes("OFFER") || rawCategory.includes("EXP") || rawCategory.includes("SALARY") || rawCategory.includes("RELIEVING")) {
              category = "Employment";
            } else if (rawCategory.includes("Company") || rawCategory.includes("POLICY") || rawCategory.includes("NDA")) {
              category = "Company Documents";
            }

            const rawType = d.document_type || d.title || "General Document";
            const cleanType = rawType.replace(/^Onboarding Document:\s*/i, "").replace(/_/g, " ");

            return {
              id: d.id,
              name: d.title || cleanType || "Employee Document",
              employeeId: d.employee_id,
              employeeName: empName,
              category,
              type: cleanType,
              uploadedBy: "HR Admin",
              uploadDate: d.created_at ? d.created_at.split("T")[0] : "2026-07-21",
              expiryDate: d.expiry_date || undefined,
              status: d.is_verified ? "Verified" : (d.status === "REJECTED" ? "Rejected" : "Pending"),
              fileSize: d.file_size ? `${(d.file_size / 1024).toFixed(1)} KB` : "1.2 MB",
              fileType: ((d.document_url || d.file_path || "pdf").split(".").pop() || "pdf").toLowerCase() as any,
              description: d.description || `Uploaded ${cleanType} for ${empName}`,
              fileUrl: d.document_url || d.file_path,
            };
          });

          setLiveDocs(mapped);
          aurix.set({ documents: mapped });
        }
      }

      if (liveEmps.length > 0 && !genEmployee) {
        setGenEmployee(liveEmps[0].id);
      }
    } catch (err) {
      console.error("Failed to load live employee documents:", err);
    } finally {
      setLoadingLive(false);
    }
  }, [genEmployee]);

  useEffect(() => {
    fetchLiveDocumentsData();
  }, [fetchLiveDocumentsData]);

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

  const autoFillTemplateFields = (templateId: string, targetEmpId?: string) => {
    const activeEmps = employeesList.length > 0 ? employeesList : ws.employees;
    const selectedEmpObj = activeEmps.find(x => x.id === (targetEmpId || genEmployee));
    const empName = selectedEmpObj ? selectedEmpObj.fullName : "Vinit Sharma";

    if (templateId === "offer") {
      setGenFields({
        "Role": "Senior Software Architect",
        "Salary (LPA)": "18.5",
        "Start Date": new Date(Date.now() + 14*24*3600*1000).toISOString().split("T")[0],
      });
    } else if (templateId === "nda") {
      setGenFields({
        "Witness Name": "Priya Nair (Legal Ops)",
        "Duration (Years)": "3",
      });
    } else if (templateId === "relieving") {
      setGenFields({
        "Last Working Day": new Date(Date.now() + 30*24*3600*1000).toISOString().split("T")[0],
        "Reason for Leaving": "Career Advancement & Higher Education",
      });
    } else {
      setGenFields({
        "Version Date": "2026-01-01",
        "Signee Designation": "Lead Architect",
      });
    }
  };

  // 2. Generate Handler
  const handleGenerateAI = () => {
    setIsGenerating(true);
    setGeneratedDraft(null);

    setTimeout(() => {
      const template = DOCUMENT_TEMPLATES.find(x => x.id === genTemplateId);
      const activeEmps = employeesList.length > 0 ? employeesList : ws.employees;
      const emp = activeEmps.find(x => x.id === genEmployee);
      const recipient = emp ? emp.fullName : (genEmployee === "general" ? "Vinit Sharma" : (activeEmps[0]?.fullName || "Vinit Sharma"));

      let text = `AURIX TALENT LABS — OFFICIAL HR LETTER
Date: ${new Date().toISOString().split("T")[0]}
Recipient: ${recipient}
Ref No: ATL-DOC-${Math.floor(100000 + Math.random() * 900000)}

`;
      if (genTemplateId === "offer") {
        text += `Dear ${recipient},

We are pleased to offer you the position of ${genFields["Role"] || "Senior Software Architect"} at Aurix Talent Labs.
Your initial annual compensation package will be INR ${genFields["Salary (LPA)"] || "18.5"} Lakhs per annum, subject to standard statutory deductions.
Your employment will commence on ${genFields["Start Date"] || "2026-08-01"}.

This offer is contingent upon successful verification of your educational certifications, background check, and previous employment documents.

Best Regards,
People Ops & HR Executive Team
Aurix Talent Labs`;
      } else if (genTemplateId === "nda") {
        text += `NON-DISCLOSURE AGREEMENT (NDA)

This Confidentiality Agreement is entered into by and between Aurix Talent Labs and ${recipient}, with witness ${genFields["Witness Name"] || "Priya Nair (Legal Lead)"}.
Both parties agree to hold all proprietary corporate information in strict confidence for a duration of ${genFields["Duration (Years)"] || "3"} years from signing.
Information covered includes software source code, corporate financials, client records, and AI models.

Signed by:
Aurix Corporate Legal Representative
And Recipient: ${recipient}`;
      } else if (genTemplateId === "relieving") {
        text += `RELIEVING & EXPERIENCE CERTIFICATE

This is to certify that ${recipient} was employed with Aurix Talent Labs.
Their last working day was ${genFields["Last Working Day"] || "2026-08-31"}.
Reason for release: ${genFields["Reason for Leaving"] || "Resignation (Career Advancement)"}.

During their tenure, they demonstrated professional competence, leadership, and sincere dedication. We wish them grand success in their future endeavors.

Signed,
Priya Nair, People Ops Lead Partner`;
      } else {
        text += `COMPANY HANDBOOK ACKNOWLEDGMENT
Version: ${genFields["Version Date"] || "2026-01-01"}

I, ${recipient}, holding the designation of ${genFields["Signee Designation"] || "Lead Architect"},
acknowledge that I have received, read, and understood all policies stated in the Aurix Corporate Handbook v4.0.

Acknowledged and Signed electronically.`;
      }

      setGeneratedDraft(text);
      setIsGenerating(false);
      toast.success("Document draft generated with AI!");
    }, 1200);
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

  // Download & View File Handler
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

    if (doc.fileUrl) {
      const targetUrl = doc.fileUrl.startsWith("http") ? doc.fileUrl : `http://127.0.0.1:8001${doc.fileUrl}`;
      window.open(targetUrl, "_blank");
      return;
    }

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isEmployee = ws.user?.role === "employee" || pathname.startsWith("/dashboard/employee");

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

    // Pending review alert for admin
    if (!isEmployee) {
      const pendingDocs = docs.filter(d => d.status === "Pending");
      if (pendingDocs.length > 0) {
        alerts.push({
          id: "alert_pending",
          type: "info",
          message: `You have ${pendingDocs.length} documents awaiting review and verification.`,
        });
      }
    }

    return alerts;
  }, [docs, isEmployee]);

  // Table Filtering & Searching
  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      if (isEmployee) {
        const userFullName = (ws.user?.fullName || "").toLowerCase();
        const userId = (ws.user?.id || "").toLowerCase();
        const isMyDoc =
          d.category === "Company Documents" ||
          (d.employeeName && d.employeeName.toLowerCase().includes(userFullName)) ||
          d.employeeId === userId;
        if (!isMyDoc) return false;
      }

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
  }, [docs, q, activeFilter, isEmployee, ws.user]);

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
        title={isEmployee ? "My Documents & Vault" : "Documents"}
        description={
          isEmployee
            ? "View your personal verification documents, certificates, and company policies."
            : "Securely store, verify, and generate employee records and company templates."
        }
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
            {!isEmployee && (
              <Button
                onClick={() => setGenerateOpen(true)}
                className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
              >
                <Wand2 className="h-4 w-4" />
                AI Document Generator
              </Button>
            )}
          </div>
        }
      />

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATS_CARDS.map(card => {
          const value = stats[card.key as keyof typeof stats];
          return (
            <Card key={card.key} className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Folder className={`h-4 w-4 ${card.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. NOTIFICATION ALERTS */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.slice(0, 3).map(alert => (
            <div key={alert.id} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs ${
              alert.type === "warning" ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400" :
              alert.type === "error" ? "border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400" :
              "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
            }`}>
              {alert.type === "warning" ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> :
               alert.type === "error" ? <XCircle className="h-3.5 w-3.5 shrink-0" /> :
               <Info className="h-3.5 w-3.5 shrink-0" />}
              <span className="flex-1">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. FILTER TABS + SEARCH */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["all", "Employee Documents", "Company Documents", "HR Templates", "Pending", "Verified", "Rejected"].map(tab => (
            <Button
              key={tab}
              variant={activeFilter === tab ? "default" : "outline"}
              size="sm"
              onClick={() => { setActiveFilter(tab); setCurrentPage(1); }}
              className={`h-8 text-xs cursor-pointer ${activeFilter === tab ? "bg-gradient-brand text-brand-foreground" : "border-border bg-card/60 hover:bg-accent/60"}`}
            >
              {tab === "all" ? "All Documents" : tab}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={q}
            onChange={e => { setQ(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-9 bg-card/60 border-border text-xs"
          />
        </div>
      </div>

      {/* 5. DATA TABLE */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { key: "name", label: "Document" },
                { key: "employeeName", label: "Employee" },
                { key: "category", label: "Category" },
                { key: "type", label: "Type" },
                { key: "uploadDate", label: "Uploaded" },
                { key: "status", label: "Status" },
              ].map(col => (
                <TableHead
                  key={col.key}
                  onClick={() => handleSort(col.key as keyof HRDocument)}
                  className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none"
                >
                  {col.label}
                  {sortField === col.key && (sortOrder === "asc" ? " â†‘" : " â†“")}
                </TableHead>
              ))}
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  No documents found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocs.map(doc => (
                <TableRow key={doc.id} className="border-border hover:bg-accent/30 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                  <TableCell className="text-xs font-medium text-foreground max-w-[180px] truncate">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.employeeName || "Company"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.type}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.uploadDate}</TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] font-medium border-none shadow-none ${
                      doc.status === "Verified" ? "bg-emerald-500/10 text-emerald-500" :
                      doc.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                      doc.status === "Rejected" ? "bg-rose-500/10 text-rose-500" :
                      "bg-neutral-500/10 text-neutral-500"
                    }`}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc)} className="h-7 w-7 p-0 cursor-pointer"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} className="h-7 w-7 p-0 cursor-pointer"><Download className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      {!isEmployee && (<Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(doc)} className="h-7 w-7 p-0 cursor-pointer"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-[11px] text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1}â€“{Math.min(currentPage * itemsPerPage, sortedDocs.length)} of {sortedDocs.length}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 text-xs cursor-pointer">Prev</Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-7 text-xs cursor-pointer">Next</Button>
            </div>
          </div>
        )}
      </Card>

      {/* 6. RECENT ACTIVITY LOG */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-bold flex items-center gap-1.5"><FileSpreadsheet className="h-4 w-4 text-indigo-500" />Recent Document Activity</CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">Live audit trail of document events across the organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {activities.slice(0, 6).map(act => (
              <div key={act.id} className="flex items-start gap-3 text-xs border-b border-border/40 pb-2.5 last:border-b-0">
                <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full shrink-0 ${
                  act.action === "Uploaded" ? "bg-blue-500/10 text-blue-500" :
                  act.action === "Verified" ? "bg-emerald-500/10 text-emerald-500" :
                  act.action === "Rejected" ? "bg-rose-500/10 text-rose-500" :
                  act.action === "Downloaded" ? "bg-purple-500/10 text-purple-500" :
                  "bg-amber-500/10 text-amber-500"
                }`}>
                  {act.action === "Uploaded" ? <Upload className="h-2.5 w-2.5" /> :
                   act.action === "Verified" ? <CheckCircle className="h-2.5 w-2.5" /> :
                   act.action === "Rejected" ? <XCircle className="h-2.5 w-2.5" /> :
                   act.action === "Downloaded" ? <Download className="h-2.5 w-2.5" /> :
                   <RefreshCw className="h-2.5 w-2.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground"><strong className="font-semibold">{act.performedBy}</strong> {act.action.toLowerCase()} <strong className="font-semibold truncate">{act.documentName}</strong></p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{act.details}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
            {activities.length === 0 && (<p className="text-xs text-muted-foreground text-center py-4">No recent document activity.</p>)}
          </div>
        </CardContent>
      </Card>

      {/* UPLOAD DOCUMENT MODAL */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2"><Upload className="h-5 w-5 text-primary" />Upload New Document</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Add employee verification documents, statutory certificates, or company policies.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-3">
            {!isEmployee && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Target Employee</Label>
                <Select value={uploadEmployee} onValueChange={setUploadEmployee}>
                  <SelectTrigger className="w-full bg-background/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="company">Company-wide (No specific employee)</SelectItem>
                    {employeesList.length > 0
                      ? employeesList.map(emp => (<SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>))
                      : ws.employees.map(emp => (<SelectItem key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeId})</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-background/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Document Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="bg-background/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{(CATEGORY_TYPES[uploadCategory] || []).map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" value={uploadExpiry} onChange={e => setUploadExpiry(e.target.value)} className="pl-9 bg-background/50 border-border text-xs" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Description / Notes</Label>
              <Textarea placeholder="Specify file details or compliance requirements" value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} className="min-h-[60px] bg-background/50 border-border text-xs" />
            </div>
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
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setUploadFileName(""); setUploadFileSize(""); }} className="h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer">Change File</Button>
                </div>
              ) : (
                <div onClick={handleMockFileDrop} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer">
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">Click to simulate dragging & dropping a file</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Supports PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={isUploading} className="h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer">{isUploading ? "Uploading..." : "Upload File"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI DOCUMENT GENERATOR MODAL */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-4xl bg-background border-border shadow-2xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 h-[680px] divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="md:col-span-2 p-5 flex flex-col justify-between h-full bg-card/40">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold flex items-center gap-1.5"><Wand2 className="h-4 w-4 text-indigo-500 animate-pulse" />AI Letter Generator</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Generate compliant contracts & HR documents.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Document Template</Label>
                  <Select value={genTemplateId} onValueChange={val => { setGenTemplateId(val); autoFillTemplateFields(val); setGeneratedDraft(null); }}>
                    <SelectTrigger className="h-8 bg-background border-border text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{DOCUMENT_TEMPLATES.map(t => (<SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">For Employee</Label>
                  <Select value={genEmployee || "general"} onValueChange={val => { setGenEmployee(val); autoFillTemplateFields(genTemplateId, val); }}>
                    <SelectTrigger className="h-8 bg-background border-border text-xs"><SelectValue placeholder="Select Employee" /></SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="general">Vinit Sharma (General Employee)</SelectItem>
                      {(employeesList.length > 0 ? employeesList : ws.employees).map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Parameters</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => autoFillTemplateFields(genTemplateId)}
                      className="h-6 text-[10px] text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 px-2 cursor-pointer"
                    >
                      ✨ Auto-Fill Defaults
                    </Button>
                  </div>
                  {DOCUMENT_TEMPLATES.find(x => x.id === genTemplateId)?.fields.map(field => (
                    <div key={field} className="space-y-1">
                      <Label className="text-[11px] text-foreground/80">{field}</Label>
                      <Input
                        value={genFields[field] || ""}
                        onChange={e => setGenFields({ ...genFields, [field]: e.target.value })}
                        placeholder={`e.g. Enter ${field.toLowerCase()}`}
                        className="h-8 bg-background border-border text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Button onClick={handleGenerateAI} disabled={isGenerating} className="w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer"><Wand2 className="h-3.5 w-3.5" />{isGenerating ? "Drafting with AI..." : "Generate Enterprise Document"}</Button>
                <Button variant="ghost" onClick={() => setGenerateOpen(false)} className="h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer">Cancel</Button>
              </div>
            </div>
            <div className="md:col-span-3 p-5 flex flex-col justify-between h-full bg-background overflow-hidden">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-primary" />Official HR Document Preview</span>
                  <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5">Fortune 500 Layout</Badge>
                </div>
                <div className="flex-1 overflow-auto p-1 mt-3">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 bg-muted/20 border border-border rounded-xl p-8">
                      <RefreshCw className="h-7 w-7 animate-spin text-indigo-500 mb-1" />
                      <p className="font-semibold text-foreground text-xs">AI Assistant drafting official contract...</p>
                      <p className="text-[10px] text-muted-foreground">Injecting clauses, candidate parameters & legal formatting</p>
                    </div>
                  ) : generatedDraft ? (
                    genTemplateId === "relieving" ? (
                      <div className="bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
                        {/* WATERMARK */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
                          <span className="text-5xl font-extrabold uppercase tracking-widest text-slate-900">OFFICIAL RELIEVING CERTIFICATE</span>
                        </div>

                        {/* 1. CORPORATE HEADER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white font-bold text-sm">A</div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase">AURIX TALENT LABS PRIVATE LIMITED</h2>
                                <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">AI-Powered HR Technology Company</p>
                              </div>
                            </div>
                            <div className="text-[9px] text-slate-600 leading-relaxed pt-1 space-y-0.5">
                              <p><strong>Registered Office:</strong> Plot No. 42, HITEC City, Hyderabad, Telangana - 500081, India</p>
                              <p>www.aurixtalentlabs.com &bull; hr@aurixtalentlabs.com &bull; +91-40-69201100</p>
                              <p className="text-[8px] text-slate-400">CIN: U72900TG2024PTC184910 &bull; GSTIN: 36AAACA0000A1Z5</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <span className="inline-block bg-indigo-950 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">RELIEVING LETTER</span>
                            <p className="text-[10px] font-mono font-bold text-slate-800 pt-0.5">Ref No: RL-2026-000001</p>
                            <p className="text-[9px] text-slate-500">Issue Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            <span className="inline-block text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded uppercase">OFFICIAL & VERIFIED</span>
                          </div>
                        </div>

                        {/* 2. EMPLOYEE DETAILS GRID */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">EMPLOYEE SEPARATION RECORD</h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Employee Name</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.fullName || "Vinit Sharma"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Employee ID</span>
                                  <strong className="text-slate-900 font-mono font-bold">{selEmp?.employeeId || "EMP-190996"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Designation</span>
                                  <strong className="text-indigo-950 font-bold">{genFields["Role"] || selEmp?.designation || "Senior Software Architect"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Department</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.department || "Developer"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Reporting Manager</span>
                                  <strong className="text-slate-900 font-bold">Director of Engineering</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Office Location</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.location || "Hyderabad, Telangana"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Date of Joining</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.joiningDate || "2026-07-21"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Last Working Day</span>
                                  <strong className="text-rose-700 font-bold">{genFields["Last Working Day"] || "2026-08-31"}</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 3. LETTER BODY */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          const empFirstName = (selEmp?.fullName || "Vinit Sharma").split(' ')[0];
                          return (
                            <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-800">
                              <p className="font-bold text-slate-900">Dear Mr. {empFirstName},</p>
                              <p>
                                This is to certify that you were employed with <strong>Aurix Talent Labs Private Limited</strong> as a <strong>{genFields["Role"] || selEmp?.designation || "Senior Software Architect"}</strong> in the <strong>{selEmp?.department || "Developer"}</strong> department from <strong>{selEmp?.joiningDate || "2026-07-21"}</strong> to <strong>{genFields["Last Working Day"] || "2026-08-31"}</strong>.
                              </p>
                              <p>
                                During your tenure, you successfully fulfilled your assigned responsibilities and contributed to various engineering initiatives with high professionalism, technical competence, and dedication.
                              </p>
                              <p>
                                We confirm that all company assets assigned to you have been returned and all applicable exit formalities have been completed successfully. Reason for separation: <em>{genFields["Reason for Leaving"] || "Resignation (Career Advancement)"}</em>.
                              </p>
                              <p>
                                Accordingly, you are hereby formally relieved from your duties and services at Aurix Talent Labs Private Limited effective from the close of business hours on <strong>{genFields["Last Working Day"] || "2026-08-31"}</strong>.
                              </p>
                              <p>
                                We sincerely appreciate your valuable contributions during your employment with us and extend our best wishes for your continued success, professional growth, and prosperity in all future endeavors.
                              </p>
                            </div>
                          );
                        })()}

                        {/* 4. EXIT CLEARANCE STATUS */}
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3 space-y-1.5">
                          <h4 className="text-[9px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">✔ ORGANIZATIONAL EXIT CLEARANCE STATUS</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[9px] text-slate-700">
                            <p>• HR Clearance Completed</p>
                            <p>• IT & Hardware Clearance Completed</p>
                            <p>• Finance & Payroll Clearance Completed</p>
                            <p>• Asset Return Verified</p>
                            <p>• Knowledge Transfer Completed</p>
                            <p>• Exit Documentation Verified</p>
                          </div>
                        </div>

                        {/* 5. CERTIFICATION CLAUSE */}
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic leading-relaxed">
                          "This letter is issued upon completion of all organizational exit formalities and serves as an official confirmation that the employee has been formally relieved from the services of the Company."
                        </div>

                        {/* 6. AUTHORIZED SIGNATORY & HR SEAL */}
                        <div className="border-t-2 border-slate-200 pt-3 flex justify-between items-end">
                          <div className="space-y-2">
                            <p className="text-[9px] font-bold text-slate-900 uppercase">HUMAN RESOURCES DEPARTMENT</p>
                            <p className="text-[9px] text-slate-500">Aurix Talent Labs Private Limited</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="inline-block rounded-lg border border-indigo-200 bg-indigo-50/60 p-2.5 text-right">
                              <p className="text-[8px] font-bold text-indigo-900 uppercase tracking-wider">OFFICIALLY SIGNED & E-ISSUED</p>
                              <p className="text-[9px] font-semibold text-slate-800">Priya Nair</p>
                              <p className="text-[8px] text-slate-500">Lead People Operations Partner</p>
                              <p className="text-[7px] text-slate-400 font-mono">Aurix Talent Labs Pvt Ltd</p>
                            </div>
                          </div>
                        </div>

                        {/* 7. FOOTER */}
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[8px] text-slate-400">
                          <span>AURIX TALENT LABS PRIVATE LIMITED</span>
                          <span className="italic">Confidential &bull; Official HR Document &bull; Document ID: RL-2026-000001</span>
                          <span>Page 1 of 1</span>
                        </div>
                      </div>
                    ) : genTemplateId === "nda" ? (
                      <div className="bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
                        {/* WATERMARK */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
                          <span className="text-5xl font-extrabold uppercase tracking-widest text-slate-900">CONFIDENTIAL & PROPRIETARY</span>
                        </div>

                        {/* 1. CORPORATE HEADER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white font-bold text-sm">A</div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase">AURIX TALENT LABS PRIVATE LIMITED</h2>
                                <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">AI-Powered HR Technology Company</p>
                              </div>
                            </div>
                            <div className="text-[9px] text-slate-600 leading-relaxed pt-1 space-y-0.5">
                              <p><strong>Registered Office:</strong> Plot No. 42, HITEC City, Hyderabad, Telangana - 500081, India</p>
                              <p>www.aurixtalentlabs.com &bull; legal@aurixtalentlabs.com &bull; +91-40-69201100</p>
                              <p className="text-[8px] text-slate-400">CIN: U72900TG2024PTC184910 &bull; GSTIN: 36AAACA0000A1Z5</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <span className="inline-block bg-indigo-950 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">NON-DISCLOSURE AGREEMENT (NDA)</span>
                            <p className="text-[10px] font-mono font-bold text-slate-800 pt-0.5">Doc No: NDA-2026-000001</p>
                            <p className="text-[9px] text-slate-500">Effective Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            <span className="inline-block text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded uppercase">LEGALLY BINDING</span>
                          </div>
                        </div>

                        {/* 2. AGREEMENT PARTIES & EMPLOYEE DETAILS */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">PARTIES TO THIS AGREEMENT</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                                  <span className="text-[9px] font-bold text-indigo-950 uppercase tracking-wider">DISCLOSING PARTY</span>
                                  <p className="font-bold text-slate-900">Aurix Talent Labs Private Limited</p>
                                  <p className="text-[10px] text-slate-500">Corporate HQ: HITEC City, Hyderabad, Telangana</p>
                                </div>
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                                  <span className="text-[9px] font-bold text-indigo-950 uppercase tracking-wider">RECEIVING PARTY (EMPLOYEE)</span>
                                  <p className="font-bold text-slate-900">{selEmp?.fullName || "Vinit Sharma"}</p>
                                  <p className="text-[10px] text-slate-500">ID: {selEmp?.employeeId || "EMP-190996"} &bull; {genFields["Role"] || selEmp?.designation || "Senior Software Architect"}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1">
                                <div><span className="text-slate-400 block">Department</span><strong className="text-slate-800">{selEmp?.department || "Developer"}</strong></div>
                                <div><span className="text-slate-400 block">Work Location</span><strong className="text-slate-800">{selEmp?.location || "Hyderabad, Telangana"}</strong></div>
                                <div><span className="text-slate-400 block">Email Address</span><strong className="text-slate-800">{selEmp?.email || "aurix@gmail.com"}</strong></div>
                                <div><span className="text-slate-400 block">Legal Witness</span><strong className="text-slate-800">{genFields["Witness Name"] || "Priya Nair (Legal Lead)"}</strong></div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 3. PURPOSE */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          return (
                            <div className="space-y-1 text-[11px] leading-relaxed text-slate-800">
                              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">1. PURPOSE & INTENT</h4>
                              <p>
                                This Proprietary Non-Disclosure Agreement ("Agreement") is executed between <strong>Aurix Talent Labs Private Limited</strong> ("Disclosing Party") and <strong>{selEmp?.fullName || "Vinit Sharma"}</strong> ("Receiving Party") to safeguard confidential, proprietary, and technical assets accessed during employment, research, product engineering, customer interaction, and corporate operations.
                              </p>
                            </div>
                          );
                        })()}

                        {/* 4. DEFINITION OF CONFIDENTIAL INFORMATION */}
                        <div className="space-y-1.5 text-[11px]">
                          <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">2. SCOPE OF CONFIDENTIAL INFORMATION</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-700">
                            <p>• Source Code & Repositories</p>
                            <p>• AI & ML Model Architectures</p>
                            <p>• APIs & Cloud Token Secrets</p>
                            <p>• Customer & Candidate Databases</p>
                            <p>• Financial Records & Pricing</p>
                            <p>• Product Roadmaps & Research</p>
                            <p>• Infrastructure & Security Credentials</p>
                            <p>• Trade Secrets & Algorithms</p>
                            <p>• Internal Corporate Workflows</p>
                          </div>
                        </div>

                        {/* 5. EMPLOYEE OBLIGATIONS & RESTRICTIONS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-2.5 space-y-1">
                            <h4 className="font-bold text-emerald-900 uppercase tracking-wider">✔ MANDATORY OBLIGATIONS</h4>
                            <div className="space-y-0.5 text-slate-700">
                              <p>• Maintain absolute confidentiality of corporate IP.</p>
                              <p>• Use confidential materials solely for authorized duties.</p>
                              <p>• Secure access credentials, passwords & MFA keys.</p>
                              <p>• Promptly report any security breach or data loss.</p>
                            </div>
                          </div>
                          <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-2.5 space-y-1">
                            <h4 className="font-bold text-rose-900 uppercase tracking-wider">🚫 PROHIBITED RESTRICTIONS</h4>
                            <div className="space-y-0.5 text-slate-700">
                              <p>• No external or unauthorized data sharing.</p>
                              <p>• No uploading code to personal cloud storage.</p>
                              <p>• No reverse engineering or code replication.</p>
                              <p>• No public disclosure of unannounced products.</p>
                            </div>
                          </div>
                        </div>

                        {/* 6. INTELLECTUAL PROPERTY & ASSET RETURN */}
                        <div className="space-y-1 text-[10px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <p><strong>3. INTELLECTUAL PROPERTY RIGHTS:</strong> All inventions, software source code, algorithms, designs, AI models, and documentation created during employment remain the sole and exclusive property of Aurix Talent Labs Private Limited under the Work-For-Hire doctrine.</p>
                          <p><strong>4. RETURN OF COMPANY ASSETS:</strong> Upon termination or resignation, the employee shall immediately return all laptops, storage drives, security access badges, digital keys, and source code repositories.</p>
                          <p><strong>5. TERM & ENFORCEABILITY:</strong> This NDA is effective immediately and remains binding during employment and for a period of <strong>{genFields["Duration (Years)"] || "3"} years</strong> post-offboarding.</p>
                        </div>

                        {/* 7. GOVERNING LAW & JURISDICTION */}
                        <div className="text-[9px] text-slate-500 border-t border-slate-200 pt-2 flex justify-between items-center">
                          <span>Governing Law: Republic of India (IT Act, 2000 & Contract Act, 1872)</span>
                          <span>Jurisdiction: Courts of Hyderabad, Telangana</span>
                        </div>

                        {/* 8. ACCEPTANCE & SIGNATURE BLOCK */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          return (
                            <div className="border-t-2 border-slate-200 pt-3 grid grid-cols-2 gap-4 items-end">
                              <div className="space-y-3">
                                <div className="border-b border-slate-400 pb-0.5 max-w-[180px]">
                                  <p className="font-serif italic text-slate-400 text-[10px]">{selEmp?.fullName || "Vinit Sharma"}</p>
                                </div>
                                <div className="text-[9px] text-slate-600">
                                  <p className="font-bold text-slate-900">Receiving Party Acceptance Signature</p>
                                  <p>Date: _____ / _____ / 2026</p>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <div className="inline-block rounded-lg border border-indigo-200 bg-indigo-50/60 p-2 text-right">
                                  <p className="text-[8px] font-bold text-indigo-900 uppercase tracking-wider">OFFICIALLY SIGNED & EXECUTED</p>
                                  <p className="text-[9px] font-semibold text-slate-800">{genFields["Witness Name"] || "Priya Nair (Legal Lead)"}</p>
                                  <p className="text-[8px] text-slate-500">Corporate Legal Counsel</p>
                                  <p className="text-[7px] text-slate-400 font-mono">Aurix Talent Labs Pvt Ltd</p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 9. FOOTER */}
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[8px] text-slate-400">
                          <span>AURIX TALENT LABS PRIVATE LIMITED</span>
                          <span className="italic">Electronically generated & legally valid under Information Technology Act, 2000 (India).</span>
                          <span>Page 1 of 1</span>
                        </div>
                      </div>
                    ) : genTemplateId === "handbook" ? (
                      <div className="bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
                        {/* WATERMARK */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
                          <span className="text-5xl font-extrabold uppercase tracking-widest text-slate-900">OFFICIAL HR POLICY ACKNOWLEDGMENT</span>
                        </div>

                        {/* 1. CORPORATE HEADER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white font-bold text-sm">A</div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase">AURIX TALENT LABS PRIVATE LIMITED</h2>
                                <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">AI-Powered HR Technology Company</p>
                              </div>
                            </div>
                            <div className="text-[9px] text-slate-600 leading-relaxed pt-1 space-y-0.5">
                              <p><strong>Registered Office:</strong> Plot No. 42, HITEC City, Hyderabad, Telangana - 500081, India</p>
                              <p>www.aurixtalentlabs.com &bull; hr@aurixtalentlabs.com &bull; +91-40-69201100</p>
                              <p className="text-[8px] text-slate-400">CIN: U72900TG2024PTC184910 &bull; GSTIN: 36AAACA0000A1Z5</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <span className="inline-block bg-indigo-950 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">COMPANY HANDBOOK ACKNOWLEDGMENT</span>
                            <p className="text-[10px] font-mono font-bold text-slate-800 pt-0.5">Doc No: CHA-2026-000001</p>
                            <p className="text-[9px] text-slate-500">Issue Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            <span className="inline-block text-[8px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase">OFFICIAL & COMPLIANT</span>
                          </div>
                        </div>

                        {/* 2. EMPLOYEE INFORMATION GRID */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">EMPLOYEE COMPLIANCE PROFILE</h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Employee Name</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.fullName || "Vinit Sharma"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Employee ID</span>
                                  <strong className="text-slate-900 font-mono font-bold">{selEmp?.employeeId || "EMP-190996"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Designation</span>
                                  <strong className="text-indigo-950 font-bold">{genFields["Signee Designation"] || selEmp?.designation || "Senior Software Architect"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Department</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.department || "Developer"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Business Unit</span>
                                  <strong className="text-slate-900 font-bold">Engineering & Product</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Office Location</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.location || "Hyderabad, Telangana"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Joining Date</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.joiningDate || "2026-07-21"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Policy Version</span>
                                  <strong className="text-emerald-700 font-bold">v4.0 ({genFields["Version Date"] || "2026-01-01"})</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 3. ACKNOWLEDGMENT DECLARATIONS */}
                        <div className="space-y-2 text-[11px] leading-relaxed text-slate-800">
                          <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">1. ACKNOWLEDGMENT & AGREEMENT</h4>
                          <p>
                            I acknowledge that I have received, accessed, and thoroughly reviewed the official <strong>Company Handbook v4.0</strong> issued by <strong>Aurix Talent Labs Private Limited</strong>.
                          </p>
                          <p>
                            I understand that the handbook contains vital policies regarding code of conduct, acceptable asset usage, workplace ethics, information security, leave rules, anti-harassment standards, and employment guidelines. I agree to comply with all current and future corporate policies throughout my tenure.
                          </p>
                        </div>

                        {/* 4. CONFIRMED POLICY CHECKLIST GRID */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">2. CONFIRMED POLICY MODULES & COMPLIANCE CHECKLIST</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-800">
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Code of Conduct & Ethics</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Information Security Policy</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Data Privacy & Asset Usage</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Anti-Harassment (POSH)</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Attendance & Leave Rules</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Remote Work & IT Security</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ IP & Invention Ownership</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Password & Access Control</p>
                            <p className="flex items-center gap-1 font-semibold text-emerald-800">☑ Disciplinary & Exit Policy</p>
                          </div>
                        </div>

                        {/* 5. EMPLOYEE DECLARATION */}
                        <div className="text-[10px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed space-y-1">
                          <p><strong>EMPLOYEE DECLARATION:</strong> I understand that this Handbook serves as a guide to corporate standards and does not constitute a guaranteed employment contract. I acknowledge my responsibility to stay updated as policies evolve.</p>
                        </div>

                        {/* 6. AUTHORIZED SIGNATORY & HR SEAL */}
                        <div className="border-t-2 border-slate-200 pt-3 grid grid-cols-2 gap-4 items-end">
                          <div className="space-y-3">
                            <div className="border-b border-slate-400 pb-0.5 max-w-[180px]">
                              <p className="font-serif italic text-slate-400 text-[10px]">{((employeesList.length > 0 ? employeesList : ws.employees).find(x => x.id === genEmployee)?.fullName) || "Vinit Sharma"}</p>
                            </div>
                            <div className="text-[9px] text-slate-600">
                              <p className="font-bold text-slate-900">Employee Electronic Signature</p>
                              <p>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="inline-block rounded-lg border border-indigo-200 bg-indigo-50/60 p-2.5 text-right">
                              <p className="text-[8px] font-bold text-indigo-900 uppercase tracking-wider">OFFICIALLY REGISTERED & VERIFIED</p>
                              <p className="text-[9px] font-semibold text-slate-800">Priya Nair</p>
                              <p className="text-[8px] text-slate-500">Lead People Operations Partner</p>
                              <p className="text-[7px] text-slate-400 font-mono">Aurix Talent Labs Pvt Ltd</p>
                            </div>
                          </div>
                        </div>

                        {/* 7. FOOTER */}
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[8px] text-slate-400">
                          <span>AURIX TALENT LABS PRIVATE LIMITED</span>
                          <span className="italic">Confidential &bull; Official HR Policy Document &bull; Document ID: CHA-2026-000001</span>
                          <span>Page 1 of 1</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white text-slate-900 shadow-2xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-6 select-none">
                        {/* WATERMARK */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
                          <span className="text-5xl font-extrabold uppercase tracking-widest text-slate-900">AURIX TALENT LABS</span>
                        </div>

                        {/* 1. CORPORATE HEADER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white font-bold text-sm">A</div>
                              <div>
                                <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase">AURIX TALENT LABS PRIVATE LIMITED</h2>
                                <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">AI-Powered HR Technology Company</p>
                              </div>
                            </div>
                            <div className="text-[9px] text-slate-600 leading-relaxed pt-1 space-y-0.5">
                              <p><strong>Registered Office:</strong> Plot No. 42, HITEC City, Hyderabad, Telangana - 500081, India</p>
                              <p>www.aurixtalentlabs.com &bull; careers@aurixtalentlabs.com &bull; +91-40-69201100</p>
                              <p className="text-[8px] text-slate-400">CIN: U72900TG2024PTC184910 &bull; GSTIN: 36AAACA0000A1Z5</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1 shrink-0">
                            <span className="inline-block bg-indigo-950 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">EMPLOYMENT OFFER LETTER</span>
                            <p className="text-[10px] font-mono font-bold text-slate-800 pt-0.5">Ref: ATL-2026-000128</p>
                            <p className="text-[9px] text-slate-500">Issue Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            <span className="inline-block text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded uppercase">STRICTLY CONFIDENTIAL</span>
                          </div>
                        </div>

                        {/* 2. RECIPIENT DETAILS GRID */}
                        {(() => {
                          const selEmp = employeesList.find(x => x.id === genEmployee);
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
                              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">CANDIDATE & APPOINTMENT DETAILS</h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Candidate Name</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.fullName || "Vinit Sharma"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Candidate ID</span>
                                  <strong className="text-slate-900 font-mono font-bold">{selEmp?.employeeId || "EMP-190996"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Position Offered</span>
                                  <strong className="text-indigo-950 font-bold">{genFields["Role"] || selEmp?.designation || "Senior Software Architect"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Department</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.department || "Developer"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Reporting Manager</span>
                                  <strong className="text-slate-900 font-bold">Director of Engineering</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Work Location</span>
                                  <strong className="text-slate-900 font-bold">{selEmp?.location || "Hyderabad, Telangana"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Employment Type</span>
                                  <strong className="text-slate-900 font-bold">Full-Time</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-500 block">Joining Date</span>
                                  <strong className="text-emerald-700 font-bold">{genFields["Start Date"] || selEmp?.joiningDate || "2026-08-01"}</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 3. SALUTATION & BODY */}
                        <div className="space-y-2 text-[11px] leading-relaxed text-slate-800">
                          <p className="font-bold text-slate-900">Dear Mr. {(((employeesList.length > 0 ? employeesList : ws.employees).find(x => x.id === genEmployee)?.fullName) || "Vinit Sharma").split(' ')[0]},</p>
                          <p>
                            We are delighted to formally offer you the position of <strong>{genFields["Role"] || "Senior Software Architect"}</strong> at <strong>Aurix Talent Labs Private Limited</strong>. After evaluating your technical accomplishments and leadership profile, we are confident that your experience will play a crucial role in building our next-generation enterprise AI HR platform.
                          </p>
                          <p>
                            Your appointment is subject to the terms and conditions outlined in this offer letter and corporate governance policies.
                          </p>
                        </div>

                        {/* 4. COMPENSATION STRUCTURE TABLE */}
                        <div className="space-y-1.5">
                          <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">COMPENSATION STRUCTURE (ANNUAL BREAKDOWN)</h3>
                          <div className="border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-900 text-white text-[9px] uppercase tracking-wider font-bold">
                                  <th className="p-2 pl-3">Component</th>
                                  <th className="p-2 text-right">Monthly (INR)</th>
                                  <th className="p-2 text-right pr-3">Annual (INR)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                <tr className="bg-slate-50/50">
                                  <td className="p-1.5 pl-3 font-semibold">Basic Salary</td>
                                  <td className="p-1.5 text-right">₹ 61,666</td>
                                  <td className="p-1.5 text-right pr-3 font-semibold">₹ 7,40,000</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5 pl-3 font-semibold">House Rent Allowance (HRA)</td>
                                  <td className="p-1.5 text-right">₹ 30,833</td>
                                  <td className="p-1.5 text-right pr-3 font-semibold">₹ 3,70,000</td>
                                </tr>
                                <tr className="bg-slate-50/50">
                                  <td className="p-1.5 pl-3 font-semibold">Special & Performance Allowance</td>
                                  <td className="p-1.5 text-right">₹ 35,000</td>
                                  <td className="p-1.5 text-right pr-3 font-semibold">₹ 4,20,000</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5 pl-3 font-semibold">Annual Performance Bonus</td>
                                  <td className="p-1.5 text-right">₹ 15,416</td>
                                  <td className="p-1.5 text-right pr-3 font-semibold">₹ 1,85,000</td>
                                </tr>
                                <tr className="bg-slate-50/50">
                                  <td className="p-1.5 pl-3 font-semibold">Employer PF Contribution</td>
                                  <td className="p-1.5 text-right">₹ 7,083</td>
                                  <td className="p-1.5 text-right pr-3 font-semibold">₹ 85,000</td>
                                </tr>
                                <tr>
                                  <td className="p-1.5 pl-3 font-semibold">Medical Insurance & Benefits</td>
                                  <td className="p-1.5 text-right">₹ 4,166</td>
                                  <td className="p-1.5 text-right pr-3 font-semibold">₹ 50,000</td>
                                </tr>
                                <tr className="bg-slate-900 text-white font-bold text-[11px]">
                                  <td className="p-2 pl-3">Total Annual CTC (Cost to Company)</td>
                                  <td className="p-2 text-right">₹ 1,54,166 / mo</td>
                                  <td className="p-2 text-right pr-3 text-emerald-400">₹ {genFields["Salary (LPA)"] || "18.5"} Lakhs (INR 18,50,000)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 5. BENEFITS GRID & CONDITIONS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-2.5 space-y-1">
                            <h4 className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">✔ Employee Benefits & Perks</h4>
                            <div className="grid grid-cols-2 gap-0.5 text-[9px] text-slate-700">
                              <p>• Medical Insurance (₹5L)</p>
                              <p>• 24 Annual Paid Leaves</p>
                              <p>• Flexible Hybrid Work</p>
                              <p>• L&D Allowance</p>
                              <p>• Wellness Perks</p>
                              <p>• ESOP Eligibility</p>
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-1">
                            <h4 className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">📌 Pre-Employment Conditions</h4>
                            <div className="text-[9px] text-slate-600 space-y-0.5">
                              <p>• Background Verification & References Check</p>
                              <p>• Educational Degree & Certification Validation</p>
                              <p>• Identity Verification (Aadhaar & PAN)</p>
                              <p>• Signed IP & Confidentiality Agreement</p>
                            </div>
                          </div>
                        </div>

                        {/* 6. ACCEPTANCE & SIGNATORY BLOCK */}
                        <div className="border-t-2 border-slate-200 pt-3 grid grid-cols-2 gap-4 items-end">
                          <div className="space-y-3">
                            <div className="border-b border-slate-400 pb-0.5 max-w-[180px]">
                              <p className="font-serif italic text-slate-400 text-[10px]">{((employeesList.length > 0 ? employeesList : ws.employees).find(x => x.id === genEmployee)?.fullName) || "Vinit Sharma"}</p>
                            </div>
                            <div className="text-[9px] text-slate-600">
                              <p className="font-bold text-slate-900">Candidate Acceptance Signature</p>
                              <p>Date: _____ / _____ / 2026</p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="inline-block rounded-lg border border-indigo-200 bg-indigo-50/60 p-2 text-right">
                              <p className="text-[8px] font-bold text-indigo-900 uppercase tracking-wider">OFFICIALLY VERIFIED & E-SIGNED</p>
                              <p className="text-[9px] font-semibold text-slate-800">Priya Nair</p>
                              <p className="text-[8px] text-slate-500">Lead Talent Acquisition Partner</p>
                              <p className="text-[7px] text-slate-400 font-mono">Aurix Talent Labs Pvt Ltd</p>
                            </div>
                          </div>
                        </div>

                        {/* 7. FOOTER */}
                        <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[8px] text-slate-400">
                          <span>AURIX TALENT LABS PRIVATE LIMITED</span>
                          <span className="italic">This document is system-generated and legally binding upon electronic acceptance.</span>
                          <span>Page 1 of 1</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10 bg-card/20 rounded-xl border border-border">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                        <Wand2 className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-foreground text-xs">No Draft Generated Yet</p>
                      <p className="text-[10px] text-muted-foreground max-w-xs mt-1">Select an employee or template, fill parameters, and click <strong>Generate Enterprise Document</strong>.</p>
                      <Button
                        onClick={() => { autoFillTemplateFields(genTemplateId); handleGenerateAI(); }}
                        className="mt-4 h-8 bg-gradient-brand text-brand-foreground text-xs gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="h-3 w-3" /> Quick Demo Generate
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {generatedDraft && (
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { navigator.clipboard.writeText(generatedDraft); toast.success("Draft text copied to clipboard!"); }}
                    className="h-8 text-xs border-border cursor-pointer"
                  >
                    Copy Draft Text
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setGeneratedDraft(null)} className="h-8 text-xs border-border bg-transparent cursor-pointer">Clear</Button>
                    <Button onClick={handleSaveGenerated} className="h-8 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"><CheckCircle className="h-3.5 w-3.5" />Save & Save to Vault</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* REJECT DOCUMENT REASON DIALOG */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500 flex items-center gap-1.5"><AlertTriangle className="h-5 w-5" />Reject Document Compliance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">Please state the reason for rejecting <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>. The employee will see this feedback.</p>
            <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="e.g. Signature cut off, document blur, expired date, wrong employee ID..." className="min-h-[100px] border-border text-xs" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectOpen(false); setTargetDoc(null); }} className="h-9 border-border bg-transparent cursor-pointer">Cancel</Button>
            <Button onClick={handleRejectSubmit} className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DOCUMENT CONFIRMATION DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground">Delete Document</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground">Are you sure you want to permanently delete <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>? This action will wipe the file and remove it from audit history.</div>
          <DialogFooter className="gap-1.5">
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setTargetDoc(null); }} className="h-9 border-border bg-transparent cursor-pointer">Cancel</Button>
            <Button onClick={handleDeleteSubmit} className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">Delete File</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SLIDE-OUT PREVIEW PANEL SHEET */}
      <Sheet open={!!previewDoc} onOpenChange={open => !open && setPreviewDoc(null)}>
        <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {previewDoc && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide border-border">{previewDoc.category}</Badge>
                  {previewDoc.status === "Verified" && (<Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border-none shadow-none font-medium text-xs">Verified</Badge>)}
                  {previewDoc.status === "Pending" && (<Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 border-none shadow-none font-medium text-xs">Pending Review</Badge>)}
                  {previewDoc.status === "Rejected" && (<Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border-none shadow-none font-medium text-xs">Rejected</Badge>)}
                  {previewDoc.status === "Expired" && (<Badge className="bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 border-none shadow-none font-medium text-xs">Expired</Badge>)}
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={previewDoc.name}>{previewDoc.name}</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">Type: {previewDoc.type} &bull; Uploaded by {previewDoc.uploadedBy} on {previewDoc.uploadDate}</SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1 p-5 min-h-0">
                <div className="space-y-6">
                  {/* CANVAS GRAPHICAL VISUAL MOCKUP PREVIEW */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Inline Verification View</Label>
                    <div className="overflow-hidden rounded-2xl border border-border bg-card/60 min-h-[440px] relative flex flex-col items-center justify-center p-1">
                      {previewDoc.fileUrl ? (
                        ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes((previewDoc.fileType || "").toLowerCase()) ? (
                          <div className="w-full h-full min-h-[420px] relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black/40 p-2">
                            <img
                              src={previewDoc.fileUrl}
                              alt={previewDoc.name}
                              className="w-full max-h-[480px] object-contain rounded-lg shadow-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `http://127.0.0.1:8001${previewDoc.fileUrl}`;
                              }}
                            />
                            <div className="mt-2 flex items-center gap-2">
                              <a
                                href={previewDoc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-background/80 hover:bg-accent text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border border-border cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" /> Fullscreen View
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-[520px] relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-background border border-border shadow-inner">
                            <object
                              data={previewDoc.fileUrl}
                              type="application/pdf"
                              className="w-full h-full rounded-xl"
                            >
                              <iframe
                                src={previewDoc.fileUrl}
                                className="w-full h-full rounded-xl border-0"
                                title={previewDoc.name}
                              >
                                <embed
                                  src={previewDoc.fileUrl}
                                  type="application/pdf"
                                  className="w-full h-full rounded-xl"
                                />
                              </iframe>
                            </object>
                            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-background/90 backdrop-blur-md border border-border p-1 rounded-lg shadow-md z-10">
                              <a
                                href={previewDoc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground px-2 py-1 hover:bg-accent rounded cursor-pointer"
                              >
                                <Eye className="h-3 w-3" /> Pop-out
                              </a>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-[400px] flex flex-col items-center justify-center p-6 bg-card/90 text-center gap-3">
                          <FileText className="h-12 w-12 text-primary" />
                          <p className="text-sm font-bold text-foreground">{previewDoc.name}</p>
                          <p className="text-xs text-muted-foreground">{previewDoc.type} &bull; {previewDoc.fileSize}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {previewDoc.status === "Rejected" && previewDoc.rejectionReason && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold"><AlertCircle className="h-4 w-4 shrink-0" />Rejection Compliance Remarks:</div>
                      <p className="leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left">"{previewDoc.rejectionReason}"</p>
                    </div>
                  )}

                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Document Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div><span className="text-muted-foreground block text-[10px]">Employee Owner</span><strong className="text-foreground mt-0.5 block">{previewDoc.employeeName || "Company-wide"}</strong></div>
                      <div><span className="text-muted-foreground block text-[10px]">Verification Type</span><strong className="text-foreground mt-0.5 block">{previewDoc.type}</strong></div>
                      <div><span className="text-muted-foreground block text-[10px]">File Size</span><strong className="text-foreground mt-0.5 block">{previewDoc.fileSize}</strong></div>
                      <div><span className="text-muted-foreground block text-[10px]">Expiry Date</span><strong className="text-foreground mt-0.5 block">{previewDoc.expiryDate || "No expiration date"}</strong></div>
                      <div className="col-span-2"><span className="text-muted-foreground block text-[10px]">Internal Description</span><p className="text-foreground mt-0.5 leading-relaxed">{previewDoc.description || "No description provided."}</p></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Verification Audit Timeline</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0"><CheckCircle className="h-2.5 w-2.5 animate-bounce" /></span>
                        <div><p className="font-bold text-foreground">Uploaded & Saved</p><p className="text-[10px] text-muted-foreground mt-0.5">By {previewDoc.uploadedBy} on {previewDoc.uploadDate}</p></div>
                      </div>
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"}`}>
                          {previewDoc.status === "Pending" ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                        </span>
                        <div><p className="font-bold text-foreground">Compliance Review</p><p className="text-[10px] text-muted-foreground mt-0.5">{previewDoc.status === "Pending" ? "Awaiting review from Human Resources" : "Reviewed by People Ops Officer"}</p></div>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "border border-border text-muted-foreground bg-muted" : previewDoc.status === "Verified" ? "bg-emerald-500 text-white" : previewDoc.status === "Rejected" ? "bg-rose-500 text-white" : "bg-slate-500 text-white"}`}>
                          {previewDoc.status === "Verified" ? (<CheckCircle className="h-2.5 w-2.5" />) : previewDoc.status === "Rejected" ? (<XCircle className="h-2.5 w-2.5" />) : (<Clock className="h-2.5 w-2.5" />)}
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

                  <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                    <h5 className="font-bold flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-indigo-500" />Smart Verification Gateways</h5>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">This component is modularized to support direct APIs for DigiLocker, Aadhaar ID checks, PAN Tax validations, and E-Signatures.</p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                {previewDoc.status === "Pending" && (
                  <>
                    <Button variant="outline" onClick={() => handleRequestReupload(previewDoc)} className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"><RefreshCw className="h-3.5 w-3.5 text-amber-500" />Request Re-upload</Button>
                    <Button onClick={() => handleRejectPrompt(previewDoc)} className="h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 gap-1.5 cursor-pointer"><XCircle className="h-3.5 w-3.5" />Reject Document</Button>
                    <Button onClick={() => handleVerify(previewDoc)} className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"><CheckCircle className="h-3.5 w-3.5" />Verify & Approve</Button>
                  </>
                )}
                {previewDoc.status !== "Pending" && (
                  <Button variant="outline" onClick={() => { const updatedDocs = docs.map(d => { if (d.id === previewDoc.id) return { ...d, status: "Pending" as const, rejectionReason: undefined }; return d; }); aurix.set({ documents: updatedDocs }); setPreviewDoc({ ...previewDoc, status: "Pending" as const, rejectionReason: undefined }); toast.info("Document reset to Pending review state"); }} className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer">Reset Status to Review</Button>
                )}
                <Button variant="outline" onClick={() => handleDownload(previewDoc)} className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"><Download className="h-3.5 w-3.5" />Download</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default DocumentsPage;
