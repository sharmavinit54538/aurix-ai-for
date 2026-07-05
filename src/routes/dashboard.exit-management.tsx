import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  LogOut, FileText, ShieldCheck, CheckCircle2, Plus, Search, RefreshCw, Download,
  XCircle, Clock, AlertTriangle, Info, Calendar, User, Building2, HelpCircle,
  FileSignature, ChevronRight, Check, X, AlertCircle, FileSpreadsheet, Star,
  PowerOff, Archive, Mail, Eye
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
import type { ExitCase, ExitStage, ExitAssetReturn, ExitDepartmentClearance, ExitSettlementDetails, ExitInterviewDetails, ExitTimelineEvent } from "@/lib/hrms/types";
import { toast } from "sonner";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Pie, PieChart, Cell
} from "recharts";

// ----------------------------------------------------
// ROUTE DEFINITION
// ----------------------------------------------------
export const Route = createFileRoute("/dashboard/exit-management")({
  head: () => ({ meta: [{ title: "Exit Management — Aurix" }] }),
  component: ExitManagementPage,
});

// ----------------------------------------------------
// CONSTANTS
// ----------------------------------------------------
const STAGE_FILTERS = [
  { id: "all", label: "All Requests" },
  { id: "requested", label: "Requested" },
  { id: "under-review", label: "Under Review" },
  { id: "approved", label: "Approved" },
  { id: "notice", label: "Notice Period" },
  { id: "clearance", label: "Clearance Pending" },
  { id: "settlement", label: "Settlement Pending" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const STAGE_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  requested: { label: "Requested", color: "text-blue-500", bg: "bg-blue-500/10" },
  "under-review": { label: "Under Review", color: "text-amber-500", bg: "bg-amber-500/10" },
  approved: { label: "Approved", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  notice: { label: "Notice Period", color: "text-purple-500", bg: "bg-purple-500/10" },
  clearance: { label: "Clearance", color: "text-orange-500", bg: "bg-orange-500/10" },
  settlement: { label: "Settlement", color: "text-pink-500", bg: "bg-pink-500/10" },
  completed: { label: "Completed", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  cancelled: { label: "Cancelled", color: "text-neutral-500", bg: "bg-neutral-500/10" },
  // Map older hrms exitStages
  resignation: { label: "Resignation", color: "text-blue-500", bg: "bg-blue-500/10" },
  interview: { label: "Interview Scheduled", color: "text-violet-500", bg: "bg-violet-500/10" },
  assets: { label: "Assets Verification", color: "text-orange-500", bg: "bg-orange-500/10" },
  hr: { label: "HR Clearance", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  manager: { label: "Manager Clearance", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  it: { label: "IT Clearance", color: "text-rose-500", bg: "bg-rose-500/10" },
  finance: { label: "Finance Clearance", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  settled: { label: "Settled", color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

const STATS_CARDS = [
  { key: "total", title: "Total Requests", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "approvals", title: "Pending Approvals", color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "notice", title: "Notice Period", color: "text-purple-500", bg: "bg-purple-500/10" },
  { key: "clearance", title: "Clearance Pending", color: "text-orange-500", bg: "bg-orange-500/10" },
  { key: "settlement", title: "Settlement Pending", color: "text-pink-500", bg: "bg-pink-500/10" },
  { key: "completed", title: "Completed Exits", color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// ----------------------------------------------------
// MAIN MODULE COMPONENT
// ----------------------------------------------------
function ExitManagementPage() {
  const exits = useHrms((s) => s.exits);
  const authWs = useAurix(); // Fetch active employees and HR profiles

  // Filters & Page Navigation
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Panels
  const [detailCase, setDetailCase] = useState<ExitCase | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [previewDocText, setPreviewDocText] = useState<string | null>(null);

  // Targets
  const [targetCase, setTargetCase] = useState<ExitCase | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Create Request Form State
  const [empName, setEmpName] = useState("");
  const [noticeDays, setNoticeDays] = useState(30);
  const [resignDate, setResignDate] = useState(new Date().toISOString().split("T")[0]);
  const [resignReason, setResignReason] = useState("");

  // Settlement Form Editing State
  const [settleSalary, setSettleSalary] = useState("0");
  const [settleLeave, setSettleLeave] = useState("0");
  const [settleBonus, setSettleBonus] = useState("0");
  const [settleIncentive, setSettleIncentive] = useState("0");
  const [settleDeduction, setSettleDeduction] = useState("0");
  const [settleRecovery, setSettleRecovery] = useState("0");

  // Interview Form State
  const [intRating, setIntRating] = useState(4);
  const [intReason, setIntReason] = useState("");
  const [intMgrFeedback, setIntMgrFeedback] = useState("");
  const [intCompFeedback, setIntCompFeedback] = useState("");
  const [intSuggestions, setIntSuggestions] = useState("");

  // ----------------------------------------------------
  // RESIGNATION LIFE WORKFLOW OPERATIONS
  // ----------------------------------------------------

  // 1. Create Resignation Case
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) {
      toast.error("Please select an employee.");
      return;
    }

    const selectedEmp = authWs.employees.find(x => x.fullName === empName) || {
      id: newId("emp"),
      fullName: empName,
      employeeId: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      department: "Platform Operations",
      designation: "Associate Member",
      joiningDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      managerName: "Maya Chen"
    };

    // Auto calculate LWD (resignedAt + noticeDays)
    const lwd = new Date(new Date(resignDate).getTime() + noticeDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const newCaseId = newId("ex");
    const newCase: ExitCase = {
      id: newCaseId,
      employee: selectedEmp.fullName,
      role: selectedEmp.designation,
      resignedAt: resignDate,
      noticeDays: noticeDays,
      lastWorkingDay: lwd,
      reason: resignReason,
      stage: "requested",
      checklist: [
        { key: "assets", label: "Asset return checklist", done: false },
        { key: "kt", label: "Knowledge transfer", done: false },
        { key: "manager", label: "Manager approval", done: false },
        { key: "hr", label: "HR approval", done: false },
        { key: "it", label: "IT clearance", done: false },
        { key: "finance", label: "Finance clearance", done: false }
      ],
      documents: [
        { name: "Experience Letter", issued: false },
        { name: "Relieving Letter", issued: false },
        { name: "Final Settlement Letter", issued: false },
        { name: "No Dues Certificate", issued: false }
      ],
      employeeId: selectedEmp.employeeId,
      department: selectedEmp.department,
      designation: selectedEmp.designation,
      joiningDate: selectedEmp.joiningDate,
      managerName: selectedEmp.managerName || "Maya Chen",
      remainingDays: noticeDays,
      managerApprovalStatus: "pending",
      hrApprovalStatus: "pending",
      assignedAssets: [
        // Populate standard mock assets for clearance simulation
        { id: newId("ret"), assetId: "a1", assetName: "MacBook Pro 14 M3", category: "laptop", serial: "C02XJ1", status: "pending" },
        { id: newId("ret"), assetId: "a3", assetName: "LG UltraFine 27", category: "monitor", serial: "LG2701", status: "pending" },
        { id: newId("ret"), assetId: "a10", assetName: "Aurix access ID Card", category: "accessory", serial: "AC-19401", status: "pending" }
      ],
      clearanceWorkflow: [
        { department: "HR", status: "pending" },
        { department: "IT", status: "pending" },
        { department: "Finance", status: "pending" },
        { department: "Admin", status: "pending" },
        { department: "Manager", status: "pending" }
      ],
      settlementDetails: {
        pendingSalary: 35000,
        leaveEncashment: 8000,
        bonus: 0,
        incentives: 0,
        deductions: 0,
        assetRecovery: 0,
        totalAmount: 43000,
        status: "pending"
      },
      timeline: [
        { id: newId("tl"), event: "Exit Requested", performedBy: selectedEmp.fullName, timestamp: new Date().toISOString(), notes: "Submitted resignation request." }
      ]
    };

    hrms.upsertExit(newCase);
    toast.success("Exit Request created successfully. Sent to Manager for approval.");
    setCreateOpen(false);
    setResignReason("");
  };

  // 2. Approve Resignation Request (Manager or HR)
  const handleApproval = (exit: ExitCase, stageType: "manager" | "hr") => {
    let updated: ExitCase = { ...exit };

    const author = authWs.user?.fullName || "HR Admin";

    if (stageType === "manager") {
      updated.managerApprovalStatus = "approved";
      updated.managerComments = "KT plan discussed. Transition approved.";
    } else {
      updated.hrApprovalStatus = "approved";
      updated.hrComments = "Notice period parameters approved.";
    }

    // If both approve, transition stage to Notice Period
    if (
      (updated.managerApprovalStatus === "approved" || updated.managerComments) &&
      (updated.hrApprovalStatus === "approved" || updated.hrComments)
    ) {
      updated.stage = "notice";
    } else {
      updated.stage = "under-review";
    }

    // Timeline event
    const newTimeline: ExitTimelineEvent = {
      id: newId("tl"),
      event: stageType === "manager" ? "Manager Approved" : "HR Approved",
      performedBy: author,
      timestamp: new Date().toISOString(),
      notes: stageType === "manager" ? "Manager signed off resignation approval." : "HR approved compliance check."
    };

    updated.timeline = [...(updated.timeline || []), newTimeline];

    // Update clearance checklists
    updated.checklist = updated.checklist.map(chk => {
      if (chk.key === stageType) return { ...chk, done: true, doneAt: new Date().toISOString() };
      return chk;
    });

    updated.clearanceWorkflow = updated.clearanceWorkflow?.map(c => {
      if (c.department.toLowerCase() === stageType) {
        return { ...c, status: "approved", approvedBy: author, approvedAt: new Date().toISOString(), comments: "Approved resignation." };
      }
      return c;
    });

    hrms.upsertExit(updated);
    toast.success(`Approved exit request for: ${exit.employee}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 3. Reject Resignation Request
  const handleRejectPrompt = (exit: ExitCase) => {
    setTargetCase(exit);
    setRejectionReason("");
    setRejectOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!targetCase || !rejectionReason.trim()) {
      toast.error("Please supply a rejection reason.");
      return;
    }

    const author = authWs.user?.fullName || "HR Admin";

    const updated: ExitCase = {
      ...targetCase,
      stage: "cancelled",
      rejectionReason: rejectionReason,
      managerApprovalStatus: "rejected",
      hrApprovalStatus: "rejected",
      timeline: [
        ...(targetCase.timeline || []),
        {
          id: newId("tl"),
          event: "Rejected",
          performedBy: author,
          timestamp: new Date().toISOString(),
          notes: `Resignation request cancelled: ${rejectionReason}`
        }
      ]
    };

    hrms.upsertExit(updated);
    toast.error(`Resignation request rejected for ${targetCase.employee}`);
    setRejectOpen(false);
    setTargetCase(null);
    if (detailCase?.id === targetCase.id) setDetailCase(updated);
  };

  // 4. Start Clearance Stage
  const handleStartClearance = (exit: ExitCase) => {
    const updated: ExitCase = {
      ...exit,
      stage: "clearance",
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Notice Started",
          performedBy: authWs.user?.fullName || "HR Admin",
          timestamp: new Date().toISOString(),
          notes: "Initiated department clearances checklist."
        }
      ]
    };
    hrms.upsertExit(updated);
    toast.info("Clearance process started.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 5. Asset Clearances
  const handleAssetReturnStatus = (exit: ExitCase, recordId: string, status: "returned" | "damaged" | "missing", remarks: string) => {
    const assetsCopy = exit.assignedAssets || [];
    const updatedAssets = assetsCopy.map(ast => {
      if (ast.id === recordId) {
        return {
          ...ast,
          status,
          remarks,
          returnDate: status === "returned" ? new Date().toISOString().split("T")[0] : undefined
        };
      }
      return ast;
    });

    const allReturned = updatedAssets.every(a => a.status === "returned");

    let updatedChecklist = exit.checklist.map(c => {
      if (c.key === "assets") return { ...c, done: allReturned, doneAt: allReturned ? new Date().toISOString() : undefined };
      return c;
    });

    let updatedTimeline = exit.timeline || [];
    if (allReturned && !exit.checklist.find(c => c.key === "assets")?.done) {
      updatedTimeline = [
        ...updatedTimeline,
        {
          id: newId("tl"),
          event: "Asset Returned",
          performedBy: authWs.user?.fullName || "IT Admin",
          timestamp: new Date().toISOString(),
          notes: "All 3 assigned hardware devices returned to vault."
        }
      ];
    }

    // Auto-approve IT clearance department when assets are fully returned
    let updatedClearance = exit.clearanceWorkflow || [];
    if (allReturned) {
      updatedClearance = updatedClearance.map(c => {
        if (c.department === "IT") {
          return { ...c, status: "approved" as const, approvedBy: "IT Support", approvedAt: new Date().toISOString(), comments: "Assets returned clean." };
        }
        return c;
      });
      // Toggle IT checklist
      updatedChecklist = updatedChecklist.map(chk => {
        if (chk.key === "it") return { ...chk, done: true, doneAt: new Date().toISOString() };
        return chk;
      });
    }

    const updated: ExitCase = {
      ...exit,
      assignedAssets: updatedAssets,
      checklist: updatedChecklist,
      clearanceWorkflow: updatedClearance,
      timeline: updatedTimeline
    };

    hrms.upsertExit(updated);
    toast.success(`Asset status updated: ${status}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 6. Department Clearance Action (HR, Finance, Admin, Manager, IT)
  const handleDeptClearanceStatus = (exit: ExitCase, dept: "HR" | "IT" | "Finance" | "Admin" | "Manager", status: "approved" | "rejected", comments: string) => {
    const clearanceCopy = exit.clearanceWorkflow || [];
    const updatedClearance = clearanceCopy.map(c => {
      if (c.department === dept) {
        return {
          ...c,
          status,
          approvedBy: authWs.user?.fullName || "HR Admin",
          approvedAt: new Date().toISOString(),
          comments
        };
      }
      return c;
    });

    const chkKey = dept.toLowerCase() as any;
    const updatedChecklist = exit.checklist.map(c => {
      if (c.key === chkKey) return { ...c, done: status === "approved", doneAt: status === "approved" ? new Date().toISOString() : undefined };
      return c;
    });

    // Check if ALL department clearance are approved
    const allApproved = updatedClearance.every(c => c.status === "approved");

    let updatedTimeline = exit.timeline || [];
    let nextStage = exit.stage;

    if (allApproved && exit.stage === "clearance") {
      nextStage = "settlement";
      updatedTimeline = [
        ...updatedTimeline,
        {
          id: newId("tl"),
          event: "Clearance Completed",
          performedBy: authWs.user?.fullName || "HR Admin",
          timestamp: new Date().toISOString(),
          notes: "All 5 departments signed off clearance certifications."
        }
      ];
    }

    const updated: ExitCase = {
      ...exit,
      stage: nextStage,
      clearanceWorkflow: updatedClearance,
      checklist: updatedChecklist,
      timeline: updatedTimeline
    };

    hrms.upsertExit(updated);
    toast.success(`${dept} Clearance status set to: ${status}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 7. Settlement Calculations Upsert
  const handleUpdateSettlement = (exit: ExitCase) => {
    const salaryVal = parseFloat(settleSalary) || 0;
    const leaveVal = parseFloat(settleLeave) || 0;
    const bonusVal = parseFloat(settleBonus) || 0;
    const incentiveVal = parseFloat(settleIncentive) || 0;
    const deductionVal = parseFloat(settleDeduction) || 0;
    const recoveryVal = parseFloat(settleRecovery) || 0;

    const total = salaryVal + leaveVal + bonusVal + incentiveVal - deductionVal - recoveryVal;

    const settlement: ExitSettlementDetails = {
      pendingSalary: salaryVal,
      leaveEncashment: leaveVal,
      bonus: bonusVal,
      incentives: incentiveVal,
      deductions: deductionVal,
      assetRecovery: recoveryVal,
      totalAmount: total,
      status: "approved"
    };

    const updatedChecklist = exit.checklist.map(c => {
      if (c.key === "finance") return { ...c, done: true, doneAt: new Date().toISOString() };
      return c;
    });

    const updated: ExitCase = {
      ...exit,
      settlementDetails: settlement,
      checklist: updatedChecklist,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Settlement Completed",
          performedBy: authWs.user?.fullName || "Finance Ops",
          timestamp: new Date().toISOString(),
          notes: `Settlement values audited: total $${total} calculated.`
        }
      ]
    };

    hrms.upsertExit(updated);
    toast.success("Final settlement calculations saved.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 8. Pay Final Settlement
  const handlePaySettlement = (exit: ExitCase) => {
    if (!exit.settlementDetails) return;

    const updatedSettlement: ExitSettlementDetails = {
      ...exit.settlementDetails,
      status: "paid"
    };

    const updated: ExitCase = {
      ...exit,
      settlementDetails: updatedSettlement,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Settlement Completed",
          performedBy: authWs.user?.fullName || "Finance Partner",
          timestamp: new Date().toISOString(),
          notes: "Wire transfer processed. Final dues paid."
        }
      ]
    };

    hrms.upsertExit(updated);
    toast.success("Final settlement paid out to employee's bank account.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // 9. Generate Document
  const handleGenerateDoc = (exit: ExitCase, docName: string) => {
    const updatedDocs = exit.documents.map(d => {
      if (d.name === docName) return { ...d, issued: true };
      return d;
    });

    const updated: ExitCase = {
      ...exit,
      documents: updatedDocs,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Documents Generated",
          performedBy: authWs.user?.fullName || "HR Partner",
          timestamp: new Date().toISOString(),
          notes: `Generated document: ${docName}`
        }
      ]
    };

    hrms.upsertExit(updated);
    toast.success(`Generated official document: ${docName}`);
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  const handlePreviewLetter = (exit: ExitCase, docName: string) => {
    let text = `AURIX TALENT LABS
To whom it may concern,

This is to certify that ${exit.employee} (Employee ID: ${exit.employeeId || "AUR-1048"})
was employed with Aurix Talent Labs from ${exit.joiningDate || "2024-01-01"} to ${exit.lastWorkingDay}.
During their tenure, they held the designation of ${exit.designation || exit.role} under Platform Engineering department.

We verify that all clearances have been successfully compiled.

Sincerely,
Priya Nair
Head of People Operations`;

    if (docName.includes("Settlement")) {
      text = `AURIX TALENT LABS — FINAL SETTLEMENT SHEET
Employee: ${exit.employee}
Designation: ${exit.designation}

Pending Salary: $${exit.settlementDetails?.pendingSalary || 0}
Leave Encashment: $${exit.settlementDetails?.leaveEncashment || 0}
Bonus & Incentives: $${(exit.settlementDetails?.bonus || 0) + (exit.settlementDetails?.incentives || 0)}
Deductions: -$${(exit.settlementDetails?.deductions || 0) + (exit.settlementDetails?.assetRecovery || 0)}

Final Settlement Wire Payout: $${exit.settlementDetails?.totalAmount || 0}
Status: ${exit.settlementDetails?.status || "Pending"}

Signed,
Finance Operations Partner`;
    }

    setPreviewDocText(text);
  };

  // 10. Deactivate Employee on Exit Completion
  const handleDeactivatePrompt = (exit: ExitCase) => {
    setTargetCase(exit);
    setDeactivateOpen(true);
  };

  const handleDeactivateConfirm = () => {
    if (!targetCase) return;

    const updated: ExitCase = {
      ...targetCase,
      stage: "completed",
      remainingDays: 0,
      timeline: [
        ...(targetCase.timeline || []),
        {
          id: newId("tl"),
          event: "Employee Deactivated",
          performedBy: authWs.user?.fullName || "HR Admin",
          timestamp: new Date().toISOString(),
          notes: "Revoked SSO login, de-activated credentials, archived profile."
        }
      ]
    };

    hrms.upsertExit(updated);
    toast.success("Employee de-activated. Login credentials revoked and profile archived.");
    setDeactivateOpen(false);
    setTargetCase(null);
    if (detailCase?.id === targetCase.id) setDetailCase(updated);
  };

  // 11. Exit Interview
  const handleSaveInterview = (exit: ExitCase) => {
    const interview: ExitInterviewDetails = {
      reason: intReason || exit.reason,
      rating: intRating,
      managerFeedback: intMgrFeedback,
      companyFeedback: intCompFeedback,
      suggestions: intSuggestions
    };

    const updated: ExitCase = {
      ...exit,
      interviewDetails: interview,
      timeline: [
        ...(exit.timeline || []),
        {
          id: newId("tl"),
          event: "Notice Started", // map interviews to timeline
          performedBy: authWs.user?.fullName || "HR Partner",
          timestamp: new Date().toISOString(),
          notes: "Recorded exit interview questionnaire responses."
        }
      ]
    };

    hrms.upsertExit(updated);
    toast.success("Exit interview answers saved.");
    if (detailCase?.id === exit.id) setDetailCase(updated);
  };

  // ----------------------------------------------------
  // COMPUTED CALCULATIONS
  // ----------------------------------------------------

  // Metrics
  const stats = useMemo(() => {
    const total = exits.length;
    const approvals = exits.filter(e => e.stage === "requested" || e.stage === "under-review").length;
    const notice = exits.filter(e => e.stage === "notice" || e.stage === "clearance").length;
    
    // Check clearance pending
    const clearance = exits.filter(e => {
      if (e.stage !== "clearance") return false;
      const allDone = e.checklist.every(c => c.done);
      return !allDone;
    }).length;

    // Settlement Pending
    const settlement = exits.filter(e => {
      return e.stage === "settlement" || (e.settlementDetails && e.settlementDetails.status !== "paid");
    }).length;

    const completed = exits.filter(e => e.stage === "completed" || e.stage === "settled").length;

    return { total, approvals, notice, clearance, settlement, completed };
  }, [exits]);

  // Notifications
  const alertsList = useMemo(() => {
    const alerts: { id: string; type: "warning" | "error" | "info"; message: string; exitCase?: ExitCase }[] = [];

    exits.forEach(e => {
      if (e.stage === "requested") {
        alerts.push({ id: `app_${e.id}`, type: "warning", message: `Approval required: ${e.employee} submitted resignation request.`, exitCase: e });
      }
      if (e.stage === "clearance") {
        const missingAssets = (e.assignedAssets || []).filter(a => a.status === "pending").length;
        if (missingAssets > 0) {
          alerts.push({ id: `ast_${e.id}`, type: "error", message: `Asset return pending: ${e.employee} has ${missingAssets} hardware devices un-returned.`, exitCase: e });
        }
      }
      if (e.stage === "notice" && e.remainingDays && e.remainingDays <= 15) {
        alerts.push({ id: `not_${e.id}`, type: "warning", message: `Notice period ending soon for ${e.employee} (${e.remainingDays} days left).`, exitCase: e });
      }
    });

    return alerts;
  }, [exits]);

  // Filter Table
  const filteredExits = useMemo(() => {
    return exits.filter(e => {
      const matchQ = !q ||
        e.employee.toLowerCase().includes(q.toLowerCase()) ||
        (e.employeeId && e.employeeId.toLowerCase().includes(q.toLowerCase())) ||
        e.role.toLowerCase().includes(q.toLowerCase()) ||
        (e.department && e.department.toLowerCase().includes(q.toLowerCase()));

      let matchStage = true;
      if (activeFilter !== "all") {
        if (activeFilter === "requested") {
          matchStage = e.stage === "requested";
        } else if (activeFilter === "under-review") {
          matchStage = e.stage === "under-review" || e.stage === "manager" || e.stage === "hr";
        } else if (activeFilter === "approved") {
          matchStage = e.stage === "approved";
        } else if (activeFilter === "notice") {
          matchStage = e.stage === "notice";
        } else if (activeFilter === "clearance") {
          matchStage = e.stage === "clearance" || e.stage === "assets" || e.stage === "it";
        } else if (activeFilter === "settlement") {
          matchStage = e.stage === "settlement" || e.stage === "finance";
        } else if (activeFilter === "completed") {
          matchStage = e.stage === "completed" || e.stage === "settled";
        } else if (activeFilter === "cancelled") {
          matchStage = e.stage === "cancelled";
        }
      }

      return matchQ && matchStage;
    });
  }, [exits, q, activeFilter]);

  // Paginated items
  const paginatedExits = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredExits.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredExits, currentPage]);

  const totalPages = Math.ceil(filteredExits.length / itemsPerPage);

  // Recharts Department-wise attrition counts
  const attritionChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    exits.forEach(e => {
      const dept = e.department || "Operations";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.keys(counts).map(k => ({
      department: k,
      "Exit Count": counts[k]
    }));
  }, [exits]);

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Exit Management"
        description="Oversee exit notice periods, clearance checklists, final pay settlements, and de-activations."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const headers = ["Employee ID", "Employee Name", "Department", "Role", "Resignation Date", "Last Working Day", "Exit Stage"];
                const rows = exits.map(e => [
                  e.employeeId || "", e.employee, e.department || "", e.role, e.resignedAt, e.lastWorkingDay, e.stage
                ].map(v => `"${v.replace(/"/g, '""')}"`).join(","));
                const csv = [headers.join(","), ...rows].join("\n");
                const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                const link = document.createElement("a");
                link.href = url;
                link.download = "HR_Exit_Management_Report.csv";
                link.click();
                URL.revokeObjectURL(url);
                toast.success("Exit report exported as CSV");
              }}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setCreateOpen(true)}
              className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Exit Request
            </Button>
          </div>
        }
      />

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {STATS_CARDS.map(card => {
          const count = stats[card.key as keyof typeof stats];
          return (
            <Card key={card.key} className="border-border bg-card/40 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground truncate leading-none">{card.title}</span>
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${card.bg}`}>
                    <LogOut className={`h-3.5 w-3.5 ${card.color}`} />
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-display tracking-tight leading-none">{count}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. TABS CONTAINER */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-card/60 border border-border p-1 rounded-xl h-10 w-fit shrink-0">
          <TabsTrigger value="requests" className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer">
            Exit Requests Pipeline
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs h-8 px-4 font-medium rounded-lg cursor-pointer">
            Attrition Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* PIPELINE TABLE */}
            <div className="space-y-4 lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
                {/* Filter / Search bars */}
                <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative max-w-sm flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={q}
                      onChange={e => { setQ(e.target.value); setCurrentPage(1); }}
                      placeholder="Search employee, ID, designation..."
                      className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    {STAGE_FILTERS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveFilter(tab.id); setCurrentPage(1); }}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                          activeFilter === tab.id
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table list */}
                {paginatedExits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
                      <LogOut className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-foreground">No exits found</p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      Adjust your filters or submit a resignation exit request.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[1000px] border-collapse">
                      <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="px-4 py-3">Employee</TableHead>
                          <TableHead className="px-4 py-3">Employee ID</TableHead>
                          <TableHead className="px-4 py-3">Department</TableHead>
                          <TableHead className="px-4 py-3">Reporting Manager</TableHead>
                          <TableHead className="px-4 py-3">Resignation Date</TableHead>
                          <TableHead className="px-4 py-3">Last Working Day</TableHead>
                          <TableHead className="px-4 py-3 text-center">Notice Days</TableHead>
                          <TableHead className="px-4 py-3 text-center">Remaining Days</TableHead>
                          <TableHead className="px-4 py-3 text-center">Status</TableHead>
                          <TableHead className="px-4 py-3 text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedExits.map(exit => {
                          const badge = STAGE_BADGES[exit.stage] || { label: exit.stage, color: "text-muted-foreground", bg: "bg-muted" };
                          return (
                            <TableRow
                              key={exit.id}
                              className="group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer"
                              onClick={() => {
                                setDetailCase(exit);
                                // Prepopulate settlement costs
                                setSettleSalary(exit.settlementDetails?.pendingSalary?.toString() || "35000");
                                setSettleLeave(exit.settlementDetails?.leaveEncashment?.toString() || "8000");
                                setSettleBonus(exit.settlementDetails?.bonus?.toString() || "0");
                                setSettleIncentive(exit.settlementDetails?.incentives?.toString() || "0");
                                setSettleDeduction(exit.settlementDetails?.deductions?.toString() || "0");
                                setSettleRecovery(exit.settlementDetails?.assetRecovery?.toString() || "0");
                                // Prepopulate interview
                                setIntRating(exit.interviewDetails?.rating || 4);
                                setIntReason(exit.interviewDetails?.reason || exit.reason || "");
                                setIntMgrFeedback(exit.interviewDetails?.managerFeedback || "");
                                setIntCompFeedback(exit.interviewDetails?.companyFeedback || "");
                                setIntSuggestions(exit.interviewDetails?.suggestions || "");
                              }}
                            >
                              <TableCell className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-bold text-xs">
                                    {exit.employee.split(" ").map(n => n[0]).slice(0,2).join("")}
                                  </span>
                                  <div className="font-semibold text-foreground truncate max-w-[150px]">{exit.employee}</div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 font-mono text-xs text-foreground/80">
                                {exit.employeeId || "AUR-1048"}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                                {exit.department || "Operations"}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs text-foreground/80">
                                {exit.managerName || "Maya Chen"}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                                {exit.resignedAt}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-xs font-semibold text-foreground/95">
                                {exit.lastWorkingDay}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center text-xs text-muted-foreground">
                                {exit.noticeDays}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center text-xs font-semibold">
                                {exit.remainingDays !== undefined ? (
                                  <span className={exit.remainingDays <= 15 && exit.remainingDays > 0 ? "text-purple-500 font-bold" : "text-foreground"}>
                                    {exit.remainingDays} days
                                  </span>
                                ) : "—"}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center">
                                <Badge className={`${badge.bg} ${badge.color} border-none shadow-none text-[11px] font-semibold`}>
                                  {badge.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDetailCase(exit)}
                                    className="h-7 text-[10px] border-border cursor-pointer hover:bg-accent/65"
                                  >
                                    View
                                  </Button>
                                  {exit.stage === "requested" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApproval(exit, "hr")}
                                        className="h-7 text-[10px] text-emerald-600 border-border cursor-pointer hover:bg-emerald-500/10"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRejectPrompt(exit)}
                                        className="h-7 text-[10px] text-rose-500 border-border cursor-pointer hover:bg-rose-500/10"
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  {exit.stage === "notice" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStartClearance(exit)}
                                      className="h-7 text-[10px] text-indigo-500 border-border cursor-pointer hover:bg-indigo-500/10"
                                    >
                                      Clearance
                                    </Button>
                                  )}
                                  {exit.stage === "settlement" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeactivatePrompt(exit)}
                                      className="h-7 text-[10px] text-purple-600 border-border cursor-pointer hover:bg-purple-500/10"
                                      title="Mark Completed & Archive"
                                    >
                                      Archive
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination */}
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

            {/* RIGHT COLUMN: ACTIONABLE NOTIFICATIONS */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-border bg-card/40 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                    Alerts & Notifications
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Offboarding workflows needing action</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alertsList.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4 italic">
                      All clearances and approvals are caught up!
                    </div>
                  ) : (
                    alertsList.map(alert => (
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
                          {alert.exitCase && (
                            <button
                              onClick={() => setDetailCase(alert.exitCase!)}
                              className="mt-1 text-[10px] underline font-bold uppercase cursor-pointer"
                            >
                              Review Pipeline
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Chart 1: Attrition by Department */}
            <Card className="border-border bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Department-wise Exits</CardTitle>
                <CardDescription className="text-xs">Count of offboardings logged per department</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attritionChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="department" style={{ fontSize: 9 }} />
                    <YAxis style={{ fontSize: 9 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Exit Count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Chart 2: General Attrition trends mock */}
            <Card className="border-border bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Monthly Exit Trends</CardTitle>
                <CardDescription className="text-xs">Timeline attrition count over the last 5 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Feb 2026", value: 1 },
                        { name: "Mar 2026", value: 3 },
                        { name: "Apr 2026", value: 2 },
                        { name: "May 2026", value: 1 },
                        { name: "Jun 2026 (Current)", value: exits.length }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {[
                        { name: "Feb 2026", value: 1 },
                        { name: "Mar 2026", value: 3 },
                        { name: "Apr 2026", value: 2 },
                        { name: "May 2026", value: 1 },
                        { name: "Jun 2026 (Current)", value: exits.length }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ----------------------------------------------------
          CREATE EXIT REQUEST DIALOG
         ---------------------------------------------------- */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg">Submit Resignation Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Select Employee</Label>
              <Select value={empName} onValueChange={setEmpName}>
                <SelectTrigger className="w-full bg-background/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authWs.employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.fullName}>{emp.fullName} ({emp.employeeId})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Resignation Date</Label>
                <Input type="date" value={resignDate} onChange={e => setResignDate(e.target.value)} className="bg-background/50 border-border text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Notice Period (Days)</Label>
                <Input type="number" value={noticeDays} onChange={e => setNoticeDays(parseInt(e.target.value) || 30)} className="bg-background/50 border-border text-xs" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Reason for Leaving</Label>
              <Textarea
                value={resignReason}
                onChange={e => setResignReason(e.target.value)}
                placeholder="State resignation reasons..."
                className="min-h-[100px] bg-background/50 border-border text-xs"
              />
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer">
                Create Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          REJECT EXIT DIALOG
         ---------------------------------------------------- */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500">Cancel/Reject Resignation</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              Please state the reason for rejecting or cancelling this exit request.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Agreement signed, key personnel retention, resignation withdrawn..."
              className="min-h-[100px] border-border text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} className="h-9 border-border bg-transparent cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleRejectSubmit} className="h-9 bg-rose-600 text-white hover:bg-rose-750 cursor-pointer">
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          EMPLOYEE ACCOUNT DEACTIVATION DIALOG
         ---------------------------------------------------- */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border text-center">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500 flex items-center justify-center gap-1.5">
              <PowerOff className="h-5 w-5 animate-pulse" />
              Revoke Employee SSO Credentials
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-2 text-xs text-muted-foreground text-left">
            <p>
              Confirming final offboarding completion for <strong>{targetCase?.employee}</strong> will automatically trigger:
            </p>
            <ul className="list-disc pl-5 space-y-1 bg-muted/30 p-2.5 rounded-lg border border-border">
              <li>Revoking SSO credentials & workspace account access.</li>
              <li>Revoking GitHub/Figma repository permissions.</li>
              <li>Closing active sessions.</li>
              <li>Deactivating employee profile and archiving data history.</li>
            </ul>
          </div>
          <DialogFooter className="pt-2 border-t border-border">
            <Button variant="outline" onClick={() => setDeactivateOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleDeactivateConfirm} className="h-9 bg-rose-600 text-white hover:bg-rose-750 cursor-pointer gap-1.5">
              <Archive className="h-4 w-4" />
              Deactivate & Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          DOCUMENT PREVIEW MODAL
         ---------------------------------------------------- */}
      <Dialog open={!!previewDocText} onOpenChange={open => !open && setPreviewDocText(null)}>
        <DialogContent className="sm:max-w-lg bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              Official Documentation Preview
            </DialogTitle>
          </DialogHeader>
          <div className="bg-muted/30 rounded-xl border border-border p-5 text-slate-800 dark:text-slate-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-none min-h-[300px]">
            {previewDocText}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDocText(null)} className="h-9 border-border bg-transparent cursor-pointer">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          SLIDE-OUT EXIT DETAILS SHEET
         ---------------------------------------------------- */}
      <Sheet open={!!detailCase} onOpenChange={open => !open && setDetailCase(null)}>
        <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {detailCase && (
            <>
              {/* Header */}
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border">
                    {detailCase.department || "Operations"}
                  </Badge>
                  {(() => {
                    const badge = STAGE_BADGES[detailCase.stage] || { label: detailCase.stage, color: "text-muted", bg: "bg-muted" };
                    return (
                      <Badge className={`${badge.bg} ${badge.color} border-none shadow-none text-xs font-bold`}>
                        {badge.label}
                      </Badge>
                    );
                  })()}
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={detailCase.employee}>
                  {detailCase.employee} ({detailCase.employeeId})
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                  Resigned Date: {detailCase.resignedAt} &bull; LWD: {detailCase.lastWorkingDay}
                </SheetDescription>
              </SheetHeader>

              {/* Body */}
              <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                <div className="px-5 border-b border-border bg-muted/5 shrink-0">
                  <TabsList className="bg-transparent border-none p-0 flex gap-2 h-10">
                    <TabsTrigger value="overview" className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer">Overview</TabsTrigger>
                    <TabsTrigger value="clearance" className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer">Clearance</TabsTrigger>
                    <TabsTrigger value="settlement" className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer">Settlement</TabsTrigger>
                    <TabsTrigger value="interview" className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer">Interview</TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1 p-5 min-h-0">
                  {/* OVERVIEW TAB */}
                  <TabsContent value="overview" className="space-y-5 mt-0">
                    {/* Progress tracker */}
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span>Notice Period Progress</span>
                        <span>{detailCase.remainingDays || 0} days remaining</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all bg-gradient-brand"
                          style={{ width: `${Math.max(0, Math.min(100, ((detailCase.noticeDays - (detailCase.remainingDays || 0)) / detailCase.noticeDays) * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Start: {detailCase.resignedAt}</span>
                        <span>End: {detailCase.lastWorkingDay}</span>
                      </div>
                    </div>

                    {/* Employee specifications */}
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Employee Profile</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Joining Date</span>
                          <strong className="text-foreground mt-0.5 block">{detailCase.joiningDate || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Designation Designation</span>
                          <strong className="text-foreground mt-0.5 block">{detailCase.designation || detailCase.role}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Reporting Manager</span>
                          <strong className="text-foreground mt-0.5 block">{detailCase.managerName || "Maya Chen"}</strong>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground block text-[10px]">Statement Reason for leaving</span>
                          <p className="text-foreground mt-0.5 leading-relaxed italic">"{detailCase.reason || "No reason specified."}"</p>
                        </div>
                      </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="space-y-2 text-left">
                      <Label className="text-xs font-semibold text-muted-foreground">Resignation timeline logs</Label>
                      <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3.5">
                        {(detailCase.timeline || []).length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">No timelines logged for this exit.</p>
                        ) : (
                          (detailCase.timeline || []).map((tl, idx) => (
                            <div key={tl.id} className={`flex gap-3 text-xs relative ${idx < (detailCase.timeline || []).length - 1 ? 'before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3' : ''}`}>
                              <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-500 text-white shrink-0">
                                <Check className="h-2 w-2" />
                              </span>
                              <div className="text-left">
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
                  </TabsContent>

                  {/* CLEARANCE & ASSETS TAB */}
                  <TabsContent value="clearance" className="space-y-6 mt-0">
                    {/* Manager & HR Resignation Approval Status */}
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resignation Signoff Approvals</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs pt-1.5">
                        {/* Manager approval box */}
                        <div className="rounded-lg border border-border p-3 space-y-1">
                          <span className="text-muted-foreground block text-[10px]">Reporting Manager</span>
                          <strong className="text-foreground block">{detailCase.managerName || "Maya Chen"}</strong>
                          <div className="pt-2 flex items-center justify-between">
                            {detailCase.managerApprovalStatus === "approved" ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Approved</Badge>
                            ) : detailCase.managerApprovalStatus === "rejected" ? (
                              <Badge className="bg-rose-500/10 text-rose-500 border-none text-[10px]">Rejected</Badge>
                            ) : (
                              <Badge className="bg-amber-500/10 text-amber-500 border-none text-[10px]">Pending Approval</Badge>
                            )}
                            {detailCase.managerApprovalStatus === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproval(detailCase, "manager")}
                                className="h-6 text-[10px] px-2 cursor-pointer"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* HR approval box */}
                        <div className="rounded-lg border border-border p-3 space-y-1">
                          <span className="text-muted-foreground block text-[10px]">HR Business Partner</span>
                          <strong className="text-foreground block">Priya Nair</strong>
                          <div className="pt-2 flex items-center justify-between">
                            {detailCase.hrApprovalStatus === "approved" ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px]">Approved</Badge>
                            ) : detailCase.hrApprovalStatus === "rejected" ? (
                              <Badge className="bg-rose-500/10 text-rose-500 border-none text-[10px]">Rejected</Badge>
                            ) : (
                              <Badge className="bg-amber-500/10 text-amber-500 border-none text-[10px]">Pending Approval</Badge>
                            )}
                            {detailCase.hrApprovalStatus === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproval(detailCase, "hr")}
                                className="h-6 text-[10px] px-2 cursor-pointer"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ASSIGNED ASSETS LIST */}
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-semibold text-muted-foreground">Assigned hardware inventory clearance</Label>
                        {(detailCase.assignedAssets || []).every(a => a.status === "returned") && (
                          <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Asset Clearance Completed
                          </span>
                        )}
                      </div>
                      <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
                        <Table className="text-xs border-collapse">
                          <TableHeader className="bg-muted/10 border-b border-border">
                            <TableRow>
                              <TableHead className="px-3 py-2 w-[160px]">Hardware Asset</TableHead>
                              <TableHead className="px-3 py-2">Serial</TableHead>
                              <TableHead className="px-3 py-2 text-center">Status</TableHead>
                              <TableHead className="px-3 py-2 text-right"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(detailCase.assignedAssets || []).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                                  No assets registered under checkout.
                                </TableCell>
                              </TableRow>
                            ) : (
                              (detailCase.assignedAssets || []).map(ast => (
                                <TableRow key={ast.id} className="border-t border-border">
                                  <TableCell className="px-3 py-2">
                                    <div className="font-semibold">{ast.assetName}</div>
                                    <span className="text-[10px] text-muted-foreground capitalize">{ast.category}</span>
                                  </TableCell>
                                  <TableCell className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{ast.serial}</TableCell>
                                  <TableCell className="px-3 py-2 text-center">
                                    {ast.status === "returned" ? (
                                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-semibold text-[10px]">Returned</Badge>
                                    ) : ast.status === "damaged" ? (
                                      <Badge className="bg-rose-500/10 text-rose-500 border-none font-semibold text-[10px]">Damaged</Badge>
                                    ) : ast.status === "missing" ? (
                                      <Badge className="bg-rose-500/10 text-rose-500 border-none font-semibold text-[10px]">Missing</Badge>
                                    ) : (
                                      <Badge className="bg-amber-500/10 text-amber-500 border-none font-semibold text-[10px]">Pending Return</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="px-3 py-2 text-right">
                                    {ast.status === "pending" && (
                                      <div className="flex justify-end gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleAssetReturnStatus(detailCase, ast.id, "returned", "Good condition.")}
                                          className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-emerald-500/15"
                                        >
                                          Return
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleAssetReturnStatus(detailCase, ast.id, "damaged", "Screen scratch")}
                                          className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-rose-500/15 text-rose-500"
                                        >
                                          Damage
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Department clearance logs */}
                    <div className="space-y-2 text-left">
                      <Label className="text-xs font-semibold text-muted-foreground">Department-wise clearance sign-offs</Label>
                      <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
                        <Table className="text-xs border-collapse">
                          <TableHeader className="bg-muted/10 border-b border-border">
                            <TableRow>
                              <TableHead className="px-3 py-2 w-[120px]">Department</TableHead>
                              <TableHead className="px-3 py-2">Clearance Status</TableHead>
                              <TableHead className="px-3 py-2">Approver Comments</TableHead>
                              <TableHead className="px-3 py-2 text-right"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(detailCase.clearanceWorkflow || []).map(clear => (
                              <TableRow key={clear.department} className="border-t border-border">
                                <TableCell className="px-3 py-2 font-bold">{clear.department}</TableCell>
                                <TableCell className="px-3 py-2">
                                  {clear.status === "approved" ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-semibold text-[10px]">Cleared</Badge>
                                  ) : clear.status === "rejected" ? (
                                    <Badge className="bg-rose-500/10 text-rose-500 border-none font-semibold text-[10px]">Flagged</Badge>
                                  ) : (
                                    <Badge className="bg-amber-500/10 text-amber-500 border-none font-semibold text-[10px]">Clearance Pending</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="px-3 py-2 text-muted-foreground text-[11px] truncate max-w-[150px]" title={clear.comments}>
                                  {clear.comments || "—"}
                                </TableCell>
                                <TableCell className="px-3 py-2 text-right">
                                  {clear.status === "pending" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeptClearanceStatus(detailCase, clear.department, "approved", "Dues checks compiled.")}
                                      className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-emerald-500/10"
                                    >
                                      Approve
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* SETTLEMENT & DOCS TAB */}
                  <TabsContent value="settlement" className="space-y-6 mt-0">
                    {/* Calculations Form */}
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Final Settlement Calculations</h4>
                        {detailCase.settlementDetails?.status === "paid" && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold">PAID OUT</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Pending Salary ($)</Label>
                          <Input type="number" value={settleSalary} onChange={e => setSettleSalary(e.target.value)} className="h-8 bg-background border-border text-xs" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Leave Encashment ($)</Label>
                          <Input type="number" value={settleLeave} onChange={e => setSettleLeave(e.target.value)} className="h-8 bg-background border-border text-xs" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Bonus ($)</Label>
                          <Input type="number" value={settleBonus} onChange={e => setSettleBonus(e.target.value)} className="h-8 bg-background border-border text-xs" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Incentives ($)</Label>
                          <Input type="number" value={settleIncentive} onChange={e => setSettleIncentive(e.target.value)} className="h-8 bg-background border-border text-xs" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Deductions ($)</Label>
                          <Input type="number" value={settleDeduction} onChange={e => setSettleDeduction(e.target.value)} className="h-8 bg-background border-border text-xs" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Asset Recovery Charges ($)</Label>
                          <Input type="number" value={settleRecovery} onChange={e => setSettleRecovery(e.target.value)} className="h-8 bg-background border-border text-xs" />
                        </div>

                        <div className="col-span-2 pt-2 border-t border-border flex justify-between items-center text-xs">
                          <div>
                            <span className="text-muted-foreground text-[10px] block">Calculated Settlement Payout</span>
                            <strong className="text-lg text-foreground font-display font-semibold">
                              ${detailCase.settlementDetails?.totalAmount || 0}
                            </strong>
                          </div>
                          <div className="flex gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleUpdateSettlement(detailCase)}
                              className="h-8 text-xs border-border bg-transparent cursor-pointer"
                            >
                              Update calculations
                            </Button>
                            {detailCase.settlementDetails && detailCase.settlementDetails.status === "approved" && (
                              <Button
                                type="button"
                                onClick={() => handlePaySettlement(detailCase)}
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              >
                                Pay Out Wire
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exit Documents Generation */}
                    <div className="space-y-2 text-left">
                      <Label className="text-xs font-semibold text-muted-foreground">Auto-generated offboarding certificates</Label>
                      <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
                        <Table className="text-xs border-collapse">
                          <TableHeader className="bg-muted/10 border-b border-border">
                            <TableRow>
                              <TableHead className="px-3 py-2 w-[220px]">Certificate Title</TableHead>
                              <TableHead className="px-3 py-2">Generation Status</TableHead>
                              <TableHead className="px-3 py-2 text-right"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {detailCase.documents.map(doc => (
                              <TableRow key={doc.name} className="border-t border-border">
                                <TableCell className="px-3 py-2 font-bold">{doc.name}</TableCell>
                                <TableCell className="px-3 py-2">
                                  {doc.issued ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-semibold">Issued & Signed</Badge>
                                  ) : (
                                    <Badge className="bg-amber-500/10 text-amber-500 border-none text-[10px] font-semibold">Not Generated</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="px-3 py-2 text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handlePreviewLetter(detailCase, doc.name)}
                                      className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                                      title="Preview template text"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    {!doc.issued ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleGenerateDoc(detailCase, doc.name)}
                                        className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-indigo-500/15"
                                      >
                                        Generate
                                      </Button>
                                    ) : (
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                          toast.success(`Sent PDF document to ${detailCase.employee}'s personal email.`);
                                        }}
                                        className="h-6 w-6 text-indigo-500 hover:bg-indigo-500/10 cursor-pointer"
                                        title="Email PDF to employee"
                                      >
                                        <Mail className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* INTERVIEW TAB */}
                  <TabsContent value="interview" className="space-y-4 mt-0 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exit Interview Feedback Report</h4>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Reason for departure</Label>
                      <Input value={intReason} onChange={e => setIntReason(e.target.value)} className="bg-background/50 border-border text-xs h-8" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Work Experience Rating (1-5)</Label>
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => setIntRating(star)} className="cursor-pointer">
                            <Star className={`h-5 w-5 ${star <= intRating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Reporting Manager Feedback</Label>
                      <Textarea value={intMgrFeedback} onChange={e => setIntMgrFeedback(e.target.value)} placeholder="Review management and transitions..." className="min-h-[50px] bg-background/50 border-border text-xs" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Company Work Environment Feedback</Label>
                      <Textarea value={intCompFeedback} onChange={e => setIntCompFeedback(e.target.value)} placeholder="Review culture, growth opportunities..." className="min-h-[50px] bg-background/50 border-border text-xs" />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Suggestions for Improvement</Label>
                      <Textarea value={intSuggestions} onChange={e => setIntSuggestions(e.target.value)} placeholder="How can Aurix HR retain talent better?" className="min-h-[50px] bg-background/50 border-border text-xs" />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => handleSaveInterview(detailCase)}
                        className="h-8 text-xs bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer"
                      >
                        Save Interview Responses
                      </Button>
                    </div>
                  </TabsContent>
                </ScrollArea>

                {/* Footer buttons */}
                <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                  {detailCase.stage !== "completed" && detailCase.stage !== "cancelled" && (
                    <Button
                      variant="outline"
                      onClick={() => handleDeactivatePrompt(detailCase)}
                      className="h-9 text-xs border-border bg-transparent hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer gap-1.5"
                    >
                      <PowerOff className="h-3.5 w-3.5" />
                      Deactivate Login
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.success("Exit report exported as PDF.");
                    }}
                    className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Print PDF Summary
                  </Button>
                </div>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
