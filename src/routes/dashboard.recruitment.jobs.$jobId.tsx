import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Archive, ArrowLeft, Briefcase, Copy, MapPin, Pencil, Save, Trash2, Users, X,
  Globe, Share2, ExternalLink, QrCode, Download, Search, Filter, ArrowRight,
  Lock, Wand2, Pause, Play, AlertCircle, Building, Award, BookOpen, Heart,
  Calendar, DollarSign, CheckCircle2, XCircle, CalendarClock, FileCheck2, Clock,
  ArrowUpRight, Sparkles, TrendingUp, UserCheck, UserPlus, Plus, ChevronRight,
  MoreHorizontal, MessageSquare, ShieldAlert, Printer
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { recruitment, useRecruitment } from "@/lib/recruitment/store";
import { CandidateAvatar, fmtDate, fmtMoney } from "@/components/recruitment/Bits";
import { EmptyState } from "@/components/hrms/Shared";
import type { Job, Candidate, OfferStatus, JobStatus } from "@/lib/recruitment/types";
import { useAurix } from "@/lib/aurix-store";
import { api } from "@/api/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/recruitment/jobs/$jobId")({
  head: () => ({ meta: [{ title: "Job Details & Distribution — Aurix" }] }),
  component: JobDetail,
});

const CHART_COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)"];

const INITIAL_DISTRIBUTION = [
  { key: "linkedin", label: "LinkedIn Jobs", desc: "Reach active professionals worldwide", status: "Connected", sync: "2 hours ago", active: true, url: "https://www.linkedin.com/jobs" },
  { key: "indeed", label: "Indeed", desc: "The world's #1 job site", status: "Connected", sync: "4 hours ago", active: true, url: "https://www.indeed.com" },
  { key: "naukri", label: "Naukri", desc: "India's largest employment platform", status: "Not Connected", sync: "Never", active: false, url: "https://www.naukri.com" },
  { key: "foundit", label: "Foundit", desc: "Monster India newly upgraded board", status: "Not Connected", sync: "Never", active: false, url: "https://www.foundit.in" },
  { key: "glassdoor", label: "Glassdoor", desc: "Employer branding & job distribution", status: "Connected", sync: "1 day ago", active: true, url: "https://www.glassdoor.com" },
  { key: "wellfound", label: "Wellfound", desc: "Reach top startup talent", status: "Not Connected", sync: "Never", active: false, url: "https://wellfound.com" },
  { key: "monster", label: "Monster Jobs", desc: "Global premium candidate database", status: "Not Connected", sync: "Never", active: false, url: "https://www.monster.com" },
  { key: "ziprecruiter", label: "ZipRecruiter", desc: "Direct distribution to 100+ job boards", status: "Not Connected", sync: "Never", active: false, url: "https://www.ziprecruiter.com" },
  { key: "google", label: "Google Jobs", desc: "Index directly in Google Search index", status: "Connected", sync: "1 hour ago", active: true, url: "https://google.com/search?q=jobs" },
  { key: "shine", label: "Shine", desc: "India's premium resume database search", status: "Not Connected", sync: "Never", active: false, url: "https://www.shine.com" },
  { key: "career_page", label: "Company Career Page", desc: "Host on your custom career website", status: "Connected", sync: "Real-time", active: true, url: "/careers" },
  { key: "referral", label: "Employee Referral Portal", desc: "Internal employee sourcing portal", status: "Connected", sync: "Real-time", active: true, url: "/referrals" },
];

function JobDetail() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allCandidates = useRecruitment((s) => s.candidates);
  const applicants = useMemo(() => allCandidates.filter((c) => c.jobId === jobId), [allCandidates, jobId]);

  // Tab State
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Edit Form States
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Job | null>(null);

  // Applicants Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  // Comments feed state
  const [commentText, setCommentText] = useState("");
  const [notesList, setNotesList] = useState<{ author: string; at: string; text: string }[]>([
    { author: "Hiring Manager", at: "2026-06-29T10:00:00Z", text: "Approved budget allocation for hiring this quarter." },
    { author: "HR Recruiter", at: "2026-06-29T14:30:00Z", text: "Synced job posting details across LinkedIn and Glassdoor." },
  ]);

  // Distribution settings list local state
  const [channels, setChannels] = useState(INITIAL_DISTRIBUTION);

  const userRole = (useAurix().user?.role || "employee") as string;

  // Modal show/hide states
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // Publish Channels state
  const [publishChannels, setPublishChannels] = useState<any[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);

  // QR Modal state
  const [qrData, setQrData] = useState<any>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  // Export Applicants state
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [exportFilter, setExportFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  // Duplicate Role states
  const [dupTitle, setDupTitle] = useState("");
  const [dupLocation, setDupLocation] = useState("");
  const [dupVacancies, setDupVacancies] = useState(1);
  const [dupMinSalary, setDupMinSalary] = useState("0");
  const [dupMaxSalary, setDupMaxSalary] = useState("0");
  const [duplicating, setDuplicating] = useState(false);

  // Close Position state
  const [closing, setClosing] = useState(false);
  const [isCopyingLink, setIsCopyingLink] = useState(false);

  const fetchPublishChannels = async () => {
    setLoadingChannels(true);
    try {
      const res = await api.get<any>(`/jobs/${jobId}/publish`);
      if (res.success && res.data) {
        setPublishChannels(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load publish channels.");
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleFetchQr = async () => {
    setLoadingQr(true);
    try {
      const res = await api.get<any>(`/jobs/${jobId}/qr`);
      if (res) {
        setQrData(res);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load QR code.");
    } finally {
      setLoadingQr(false);
    }
  };

  useEffect(() => {
    if (showPublishModal) {
      fetchPublishChannels();
    }
  }, [showPublishModal]);

  useEffect(() => {
    if (showQrModal) {
      handleFetchQr();
    }
  }, [showQrModal]);

  useEffect(() => {
    if (showDuplicateModal && job) {
      setDupTitle(job.title + " (Copy)");
      setDupLocation(job.location);
      setDupVacancies(job.vacancies || 1);
      setDupMinSalary(job.salaryMin ? String(job.salaryMin) : "0");
      setDupMaxSalary(job.salaryMax ? String(job.salaryMax) : "0");
    }
  }, [showDuplicateModal, job]);

  useEffect(() => {
    let active = true;
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const data = await recruitment.getJob(jobId);
        if (active) {
          setJob(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load job details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchJob();
    return () => {
      active = false;
    };
  }, [jobId]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.stage.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [applicants, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-2 text-sm text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h3 className="text-lg font-semibold">Job Posting Not Found</h3>
        <p className="text-sm text-muted-foreground mt-1">{error || "The requested job posting could not be found."}</p>
        <Button className="mt-4" asChild>
          <Link to="/dashboard/recruitment/jobs">Back to Jobs List</Link>
        </Button>
      </div>
    );
  }

  function startEdit() { setDraft({ ...job! }); setEditing(true); }
  function cancelEdit() { setDraft(null); setEditing(false); }
  
  async function save() {
    if (draft) {
      try {
        await recruitment.upsertJob(draft);
        setJob(draft);
        setEditing(false);
      } catch (err: any) {
        alert("Failed to save job changes: " + (err.message || err));
      }
    }
  }



  const handleToggleChannel = async (channelName: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const res = await api.post<any>(`/jobs/${jobId}/publish`, {
        channel_name: channelName,
        is_active: newStatus
      });
      if (res.success && res.data) {
        setPublishChannels(prev => {
          const updated = prev.map(c => c.channel_name === channelName ? res.data : c);
          // check if at least one channel is active in the updated array
          const anyActive = updated.some(c => c.is_active);
          if (job) {
            setJob({ ...job, status: (anyActive ? "published" : "draft") as JobStatus });
          }
          return updated;
        });
        toast.success(`${channelName.replace("_", " ").toUpperCase()} ${newStatus ? "published" : "unpublished"} successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update channel status.");
    }
  };

  const handleCopySourcingLink = async () => {
    setIsCopyingLink(true);
    try {
      const res = await api.get<any>(`/jobs/${jobId}/sourcing-link`);
      if (res && res.url) {
        await navigator.clipboard.writeText(res.url);
        toast.success("Sourcing link copied successfully!");
      } else {
        throw new Error("No link found.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to retrieve sourcing link.");
    } finally {
      setIsCopyingLink(false);
    }
  };



  const handlePrintQr = () => {
    if (!qrData) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${job?.title}</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
              img { width: 300px; height: 300px; }
              h1 { margin-bottom: 5px; }
              p { color: #666; margin-top: 5px; }
            </style>
          </head>
          <body>
            <h1>${job?.title}</h1>
            <img src="http://localhost:8001${qrData.qr_png_url}" onload="window.print(); window.close();" />
            <p>Scan to apply</p>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleExportApplicants = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("access_token") || "";
      const url = `http://localhost:8001/api/v1/jobs/${jobId}/applicants/export?format=${exportFormat}&filter=${exportFilter}`;
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Export failed.");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      
      const ext = exportFormat === "excel" ? "xlsx" : exportFormat;
      link.setAttribute("download", `job_${jobId}_applicants_${exportFilter}.${ext}`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success("Applicants exported successfully!");
      setShowExportModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to export applicants.");
    } finally {
      setExporting(false);
    }
  };



  const handleCreateDuplicate = async () => {
    setDuplicating(true);
    try {
      const res = await api.post<any>(`/jobs/${jobId}/duplicate`, {
        title: dupTitle,
        location: dupLocation,
        vacancies: dupVacancies,
        min_salary: parseFloat(dupMinSalary) || 0,
        max_salary: parseFloat(dupMaxSalary) || 0
      });
      if (res.success && res.data) {
        toast.success("Job duplicated successfully!");
        setShowDuplicateModal(false);
        navigate({ to: `/dashboard/recruitment/jobs/${res.data.id}` });
      } else {
        throw new Error(res.message || "Duplication failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to duplicate job.");
    } finally {
      setDuplicating(false);
    }
  };

  const handleSync = (key: string) => {
    setChannels(prev => prev.map(c => c.key === key ? { ...c, sync: "Just now" } : c));
  };

  const handleTogglePlatform = (key: string) => {
    setChannels(prev => prev.map(c => c.key === key ? { ...c, active: !c.active, status: c.active ? "Not Connected" : "Connected", sync: c.active ? "Never" : "Just now" } : c));
  };

  const handleConfirmCloseJob = async () => {
    setClosing(true);
    try {
      const res = await api.post<any>(`/jobs/${jobId}/close`);
      if (res.success) {
        setJob(prev => prev ? { ...prev, status: "closed" as JobStatus } : null);
        toast.success("Job closed successfully!");
        setShowCloseDialog(false);
      } else {
        throw new Error(res.message || "Failed to close job.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to close job.");
    } finally {
      setClosing(false);
    }
  };

  const togglePause = async () => {
    if (!job) return;
    const isPublished = job.status.toLowerCase() === "published";
    try {
      if (isPublished) {
        const res = await api.post<any>(`/jobs/${jobId}/draft`);
        if (res.success && res.data) {
          setJob(res.data);
          toast.success("Job paused and set to Draft.");
        }
      } else {
        const res = await api.post<any>(`/jobs/${jobId}/publish`, {
          channel_name: "career_site",
          is_active: true
        });
        if (res.success) {
          const data = await recruitment.getJob(jobId);
          setJob(data);
          toast.success("Job published on Career Site.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update job status.");
    }
  };

  const remove = async () => {
    if (!job) return;
    if (confirm("Delete this job? This cannot be undone.")) {
      try {
        const res = await api.delete<any>(`/jobs/${jobId}`);
        if (res.success) {
          toast.success("Job deleted successfully!");
          navigate({ to: "/dashboard/recruitment/jobs" });
        } else {
          throw new Error(res.message || "Delete failed.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to delete job.");
      }
    }
  };


  // Copy helper
  function copyToClipboard(txt: string, label: string) {
    navigator.clipboard.writeText(txt);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  // Add notes
  function handleAddNote() {
    if (!commentText.trim()) return;
    setNotesList([{ author: "You", at: new Date().toISOString(), text: commentText.trim() }, ...notesList]);
    setCommentText("");
  }

  // KPI calculations
  const totalViews = 384;
  const shortlistedCount = applicants.filter(c => ["assessment", "interview", "technical", "hr"].includes(c.stage)).length;
  const interviewedCount = applicants.filter(c => ["interview", "technical"].includes(c.stage)).length;
  const offersSent = 2;
  const hiredCount = applicants.filter(c => c.stage === "hired").length;
  const rejectedCount = applicants.filter(c => c.stage === "rejected").length;
  const conversionRate = applicants.length ? ((hiredCount / applicants.length) * 100).toFixed(0) : "0";

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/recruitment/jobs"><ArrowLeft className="mr-2 h-4 w-4" />All Jobs</Link>
        </Button>
      </div>

      {/* Greenhouse Enterprise Header */}
      <div className="relative mb-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {editing ? "Editing Details" : job.title}
              </h1>
              <Badge variant="outline" className={`capitalize font-semibold border ${
                job.status === "active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                job.status === "draft" ? "border-sky-500/30 bg-sky-500/10 text-sky-500" :
                "border-muted bg-muted/40 text-muted-foreground"
              }`}>
                {job.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
              <span className="flex items-center"><Building className="mr-1.5 h-3.5 w-3.5" />{job.department}</span>
              <span className="flex items-center"><MapPin className="mr-1.5 h-3.5 w-3.5" />{job.location} ({job.workMode})</span>
              <span className="flex items-center"><Calendar className="mr-1.5 h-3.5 w-3.5" />{job.employmentType}</span>
              <span className="flex items-center"><DollarSign className="mr-1.5 h-3.5 w-3.5" />{fmtMoney(job.salaryMin, "INR")} – {fmtMoney(job.salaryMax, "INR")}</span>
            </div>
            {!editing && (
              <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-4">
                <div className="rounded-lg bg-background/50 p-2.5">
                  <span className="text-[10px] text-muted-foreground block uppercase">Hiring Manager</span>
                  <span className="text-xs font-semibold text-foreground">{job.hiringManager || "HM Team"}</span>
                </div>
                <div className="rounded-lg bg-background/50 p-2.5">
                  <span className="text-[10px] text-muted-foreground block uppercase">Recruiter</span>
                  <span className="text-xs font-semibold text-foreground">{job.recruiter || "Talent Team"}</span>
                </div>
                <div className="rounded-lg bg-background/50 p-2.5">
                  <span className="text-[10px] text-muted-foreground block uppercase">Open Positions</span>
                  <span className="text-xs font-semibold text-foreground">{job.vacancies}</span>
                </div>
                <div className="rounded-lg bg-background/50 p-2.5">
                  <span className="text-[10px] text-muted-foreground block uppercase">Total Applicants</span>
                  <span className="text-xs font-semibold text-foreground">{applicants.length}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:self-start">
            {editing ? (
              <>
                <Button variant="outline" size="sm" onClick={cancelEdit}><X className="mr-1.5 h-4 w-4" />Cancel</Button>
                <Button size="sm" onClick={save}><Save className="mr-1.5 h-4 w-4" />Save Details</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={startEdit}><Pencil className="mr-1.5 h-4 w-4" />Edit</Button>
                <Button variant="outline" size="sm" onClick={() => setShowDuplicateModal(true)}><Copy className="mr-1.5 h-4 w-4" />Duplicate</Button>
                <Button variant="outline" size="sm" onClick={togglePause}>
                  {job.status.toLowerCase() === "published" ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}
                  {job.status.toLowerCase() === "published" ? "Pause" : "Activate"}
                </Button>
                {job.status.toLowerCase() !== "closed" && userRole !== "recruiter" && (
                  <Button variant="outline" size="sm" onClick={() => setShowCloseDialog(true)}><Archive className="mr-1.5 h-4 w-4" />Close Job</Button>
                )}
                {userRole === "admin" && (
                  <Button variant="outline" size="sm" onClick={remove} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="mr-1.5 h-4 w-4" />Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="mb-6 flex border-b border-border">
        {[
          { key: "overview", label: "Overview" },
          { key: "applicants", label: `Applicants (${applicants.length})` },
          { key: "publish", label: "Publish Channels" },
          { key: "links", label: "Job Links" },
          { key: "analytics", label: "Analytics" },
          { key: "activity", label: "Activity Logs" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === t.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left Side Tab Contents */}
        <div className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {editing ? (
                <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <FieldRow label="Title"><Input value={draft!.title} onChange={(e) => setDraft({ ...draft!, title: e.target.value })} /></FieldRow>
                    <FieldRow label="Department"><Input value={draft!.department} onChange={(e) => setDraft({ ...draft!, department: e.target.value })} /></FieldRow>
                  </div>
                  <FieldRow label="Description"><Textarea rows={6} value={draft!.description} onChange={(e) => setDraft({ ...draft!, description: e.target.value })} /></FieldRow>
                  <div className="grid grid-cols-3 gap-4">
                    <FieldRow label="Min Salary"><Input type="number" value={draft!.salaryMin} onChange={(e) => setDraft({ ...draft!, salaryMin: Number(e.target.value) })} /></FieldRow>
                    <FieldRow label="Max Salary"><Input type="number" value={draft!.salaryMax} onChange={(e) => setDraft({ ...draft!, salaryMax: Number(e.target.value) })} /></FieldRow>
                    <FieldRow label="Vacancies"><Input type="number" value={draft!.vacancies} onChange={(e) => setDraft({ ...draft!, vacancies: Number(e.target.value) })} /></FieldRow>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Section title="Company Info" icon={Building}>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Aurix Inc. is a high-growth HR Technology platforms enterprise. This job role resides in our main operations product division.
                      </p>
                    </Section>

                    <Section title="Expectations & Joining" icon={Calendar}>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span>Joining Date:</span><span className="font-semibold">Immediate / Within 30 days</span></div>
                        <div className="flex justify-between"><span>Required Docs:</span><span className="font-semibold">Resume, Portfolio, Degree Certificate</span></div>
                      </div>
                    </Section>
                  </div>

                  <Section title="Job Description" icon={Briefcase}>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </Section>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Section title="Key Responsibilities" icon={Award}>
                      <Bullets items={job.responsibilities || [
                        "Architect, develop, and maintain clean scalable web applications.",
                        "Coordinate closely with product designers and business units.",
                        "Perform thorough peer reviews and integration tests."
                      ]} />
                    </Section>

                    <Section title="Qualifications & Requirements" icon={BookOpen}>
                      <Bullets items={job.requirements || [
                        "3+ years experience with React, TypeScript, and modern frameworks.",
                        "Strong experience building and testing responsive user interfaces.",
                        "Excellent problem solving and communication skills."
                      ]} />
                    </Section>
                  </div>

                  <Section title="Interview Stages & Pipeline" icon={CalendarClock}>
                    <div className="flex flex-col gap-3">
                      {[
                        { step: 1, name: "Screening", desc: "CV shortlisting & initial HR screening" },
                        { step: 2, name: "Technical Assessment", desc: "Take-home coding task or algorithmic challenge" },
                        { step: 3, name: "Technical Interview", desc: "Live coding and system architecture review" },
                        { step: 4, name: "HR & Culture Round", desc: "Value alignment and comp band negotiation" },
                      ].map((stage) => (
                        <div key={stage.step} className="flex items-start gap-3 rounded-lg bg-background/40 p-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-primary/10 text-xs font-semibold text-primary">
                            {stage.step}
                          </span>
                          <div>
                            <span className="text-xs font-semibold block">{stage.name}</span>
                            <span className="text-[10px] text-muted-foreground">{stage.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </>
              )}
            </div>
          )}

          {/* TAB 2: APPLICANTS */}
          {activeTab === "applicants" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/25 p-3 backdrop-blur-xl">
                <div className="flex flex-1 items-center gap-2 max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search candidate by name or email..."
                    className="h-8 border-border text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs"
                  >
                    <option value="all">All Stages</option>
                    <option value="applied">Applied</option>
                    <option value="screening">Screening</option>
                    <option value="assessment">Assessment</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={() => { setExportFormat("csv"); setShowExportModal(true); }} className="h-8 text-xs">
                    <Download className="mr-1.5 h-3.5 w-3.5" />Export CSV
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-xl">
                {filteredApplicants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Users className="mb-4 h-12 w-12 text-muted-foreground/30 animate-pulse" />
                    <h4 className="font-semibold text-sm">No Applicants Found</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mt-1">
                      No applications match the active filters or search criteria.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <th className="p-3 w-8">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.length === filteredApplicants.length}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedCandidates(filteredApplicants.map(c => c.id));
                                else setSelectedCandidates([]);
                              }}
                              className="rounded border-border"
                            />
                          </th>
                          <th className="p-3">Candidate</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Experience</th>
                          <th className="p-3">Current Company</th>
                          <th className="p-3">Applied</th>
                          <th className="p-3">Stage</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants.map((c) => (
                          <tr key={c.id} className="border-b border-border/60 hover:bg-accent/20">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.includes(c.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedCandidates([...selectedCandidates, c.id]);
                                  else setSelectedCandidates(selectedCandidates.filter(id => id !== c.id));
                                }}
                                className="rounded border-border"
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <CandidateAvatar name={c.name} size={30} />
                                <div>
                                  <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: c.id }} className="font-semibold text-foreground hover:underline">
                                    {c.name}
                                  </Link>
                                  <span className="text-[10px] text-muted-foreground block mt-0.5">ATS: {c.atsScore}/100</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 space-y-0.5">
                              <span className="block">{c.email}</span>
                              <span className="text-muted-foreground block">{c.phone}</span>
                            </td>
                            <td className="p-3">{c.yearsExperience} yrs</td>
                            <td className="p-3">{c.currentCompany || "—"}</td>
                            <td className="p-3">{fmtDate(c.appliedAt)}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="capitalize text-[10px]">
                                {c.stage}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                  <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: c.id }} title="View Profile">
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PUBLISH CHANNELS */}
          {activeTab === "publish" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-sm font-semibold">Job Distribution Center</h3>
                <p className="text-xs text-muted-foreground">Distribute and synchronize this role across international boards.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {channels.map((chan) => (
                  <div key={chan.key} className="flex flex-col justify-between rounded-xl border border-border bg-card/50 p-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <a 
                          href={chan.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-semibold text-sm hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {chan.label}
                          <ExternalLink className="h-3 w-3 opacity-60 hover:opacity-100 transition-opacity" />
                        </a>
                        <Badge variant="outline" className={`text-[10px] ${
                          chan.active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground"
                        }`}>
                          {chan.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {chan.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-4 text-[10px] text-muted-foreground">
                      <span>Sync: {chan.sync}</span>
                      <div className="flex gap-2">
                        {chan.active ? (
                          <>
                            <Button variant="outline" size="sm" asChild className="h-7 px-2 text-[10px]">
                              <a href={chan.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" /> Visit
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleSync(chan.key)} className="h-7 px-2 text-[10px]">
                              Sync
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleTogglePlatform(chan.key)} className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" asChild className="h-7 px-3 text-[10px]">
                            <Link to="/dashboard/recruitment/jobs/$jobId/publish" params={{ jobId: job.id }}>
                              Publish Channel
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: JOB LINKS */}
          {activeTab === "links" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-sm font-semibold">Promotional & Sourcing Links</h3>
                <p className="text-xs text-muted-foreground">Copy pre-configured referral, outreach, or public board URLs.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Public Career Site URL", url: `https://careers.aurix.com/jobs/${jobId}` },
                  { label: "Internal Employee Referral Link", url: `https://aurix.com/portal/referrals?job=${jobId}` },
                  { label: "Campus Sourcing URL", url: `https://careers.aurix.com/campus/sourcing?tag=uni-${jobId}` },
                ].map((linkItem) => (
                  <div key={linkItem.label} className="rounded-xl border border-border bg-card/40 p-4">
                    <span className="text-xs font-semibold block mb-2">{linkItem.label}</span>
                    <div className="flex gap-2">
                      <Input value={linkItem.url} readOnly className="h-9 text-xs bg-background/50 border-border" />
                      <Button size="sm" variant="outline" className="h-9 px-3 shrink-0" onClick={() => copyToClipboard(linkItem.url, linkItem.label)}>
                        {copiedLink === linkItem.label ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold block">QR Code Sourcing Asset</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">Generate printable asset for campus or office placement.</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowQr(!showQr)}>
                      <QrCode className="mr-1.5 h-4 w-4" />{showQr ? "Hide Asset" : "Generate QR"}
                    </Button>
                  </div>
                  {showQr && (
                    <div className="flex flex-col items-center justify-center p-6 bg-background/40 mt-4 rounded-xl border border-border">
                      <div className="grid h-36 w-36 place-items-center bg-white p-2.5 rounded-lg shadow-lg border border-border">
                        {/* Styled SVG QR Code mock */}
                        <svg className="h-full w-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M0 0h30v30H0zm40 0h20v20H40zm30 0h30v30H70zm-70 40h20v20H0zm30 0h40v40H30zm50 0h20v20H80zm-80 30h30v30H0zm80 10h20v20H80z" />
                          <path d="M10 10h10v10H10zm60 0h10v10H70zm-60 60h10v10H10z" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-3">Scan to apply directly via mobile.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Small telemetry counters */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Job Views", value: totalViews, suffix: "", icon: Globe },
                  { label: "Applications", value: applicants.length, suffix: "", icon: Users },
                  { label: "Interviewed", value: interviewedCount, suffix: "", icon: CalendarClock },
                  { label: "Hired Rate", value: conversionRate, suffix: "%", icon: UserPlus },
                ].map((k) => {
                  const I = k.icon;
                  return (
                    <div key={k.label} className="rounded-xl border border-border bg-card/60 p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</span>
                        <I className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                      <div className="text-xl font-bold text-foreground">
                        {k.value}{k.suffix}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Funnel chart and per day area chart */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card/60 p-4">
                  <span className="text-xs font-semibold block mb-4">Daily Application Flow</span>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: "Mon", apps: 3 },
                        { name: "Tue", apps: 7 },
                        { name: "Wed", apps: 5 },
                        { name: "Thu", apps: applicants.length },
                        { name: "Fri", apps: 4 },
                        { name: "Sat", apps: 2 },
                        { name: "Sun", apps: 1 },
                      ]}>
                        <defs>
                          <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary, oklch(0.65 0.22 285))" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-primary, oklch(0.65 0.22 285))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0.05 240 / 0.3)" />
                        <XAxis dataKey="name" stroke="oklch(0.5 0.05 240)" fontSize={10} />
                        <YAxis stroke="oklch(0.5 0.05 240)" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="apps" stroke="var(--color-primary, oklch(0.65 0.22 285))" fillOpacity={1} fill="url(#colorApps)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card/60 p-4">
                  <span className="text-xs font-semibold block mb-4">Sourcing Channels Breakdown</span>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "LinkedIn", value: 45 },
                            { name: "Indeed", value: 30 },
                            { name: "Glassdoor", value: 15 },
                            { name: "Direct Referral", value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {CHART_COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconSize={10} fontSize={10} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY LOGS */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              {/* Notes submission box */}
              <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
                <span className="text-xs font-semibold block">Add Notes / Comments</span>
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type an internal update, tag recruiter..."
                  rows={3}
                  className="text-xs bg-background/50 border-border"
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleAddNote} className="h-8 text-xs">
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />Submit Comment
                  </Button>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {notesList.map((n, idx) => (
                  <div key={idx} className="flex gap-3 rounded-xl border border-border bg-card/40 p-4 text-xs">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                      {n.author.charAt(0)}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{n.author}</span>
                        <span className="text-[10px] text-muted-foreground">{fmtDate(n.at)}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {n.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar Quick Actions */}
        <aside className="space-y-4 lg:sticky lg:top-4">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block">Quick Actions</span>
            
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" className="w-full text-xs justify-start" onClick={() => setShowPublishModal(true)}>
                <Globe className="mr-2 h-4 w-4" />Publish Channels
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs justify-start" onClick={handleCopySourcingLink} disabled={isCopyingLink}>
                <Copy className="mr-2 h-4 w-4" />
                {isCopyingLink ? "Fetching..." : "Copy Sourcing Link"}
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs justify-start" onClick={() => setShowQrModal(true)}>
                <QrCode className="mr-2 h-4 w-4" />Generate Job QR Code
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs justify-start" onClick={() => setShowExportModal(true)}>
                <Download className="mr-2 h-4 w-4" />Export Applicants
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs justify-start" onClick={() => setShowDuplicateModal(true)}>
                <Copy className="mr-2 h-4 w-4" />Duplicate Role
              </Button>
              {userRole !== "recruiter" && (
                <Button size="sm" variant="outline" className="w-full text-xs justify-start text-destructive hover:bg-destructive/15" onClick={() => setShowCloseDialog(true)}>
                  <Archive className="mr-2 h-4 w-4" />Close Position
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-3">Pipeline Health</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span>Shortlisted</span><span className="font-semibold">{shortlistedCount}</span></div>
              <div className="flex justify-between"><span>Interviewed</span><span className="font-semibold">{interviewedCount}</span></div>
              <div className="flex justify-between"><span>Offers Sent</span><span className="font-semibold">{offersSent}</span></div>
              <div className="flex justify-between"><span>Hires Count</span><span className="font-semibold">{hiredCount}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Publish Channels Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-md bg-card/90 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary animate-pulse" />
              Publish Channels
            </DialogTitle>
            <DialogDescription>
              Control where your job posting is active. Generating a channel automatically registers a unique applicant-facing link.
            </DialogDescription>
          </DialogHeader>

          {loadingChannels ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Fetching publish channels...</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {["career_site", "public_link", "internal_portal"].map((chanName) => {
                const chanObj = publishChannels.find(c => c.channel_name === chanName) || {
                  channel_name: chanName,
                  is_active: false,
                  published_at: null,
                  last_updated: null,
                  url: ""
                };
                
                const label = chanName === "career_site" ? "Company Career Site" :
                             chanName === "public_link" ? "Public Apply Link" :
                             "Internal Hiring Portal";
                             
                const desc = chanName === "career_site" ? "Publish to public careers directory." :
                             chanName === "public_link" ? "Create a shareable url for job boards." :
                             "Internal portal for employee referrals.";

                return (
                  <div key={chanName} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-foreground block">{label}</span>
                        <span className="text-[11px] text-muted-foreground block">{desc}</span>
                      </div>
                      <Switch 
                        checked={chanObj.is_active} 
                        onCheckedChange={() => handleToggleChannel(chanName, chanObj.is_active)}
                      />
                    </div>
                    {chanObj.is_active && (
                      <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-semibold text-emerald-500 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Active
                          </span>
                        </div>
                        {chanObj.published_at && (
                          <div className="flex justify-between">
                            <span>Published At:</span>
                            <span>{new Date(chanObj.published_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        {chanObj.url && (
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="truncate max-w-[200px] text-primary underline text-[10px]">
                              {chanObj.url}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6 text-muted-foreground" 
                                onClick={() => {
                                  navigator.clipboard.writeText(chanObj.url);
                                  toast.success("Link copied!");
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 text-[10px] px-2"
                                asChild
                              >
                                <a href={chanObj.url} target="_blank" rel="noreferrer">Visit</a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <DialogFooter>
            <Button size="sm" onClick={() => setShowPublishModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-sm bg-card/90 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Generate Job QR Code
            </DialogTitle>
            <DialogDescription>
              Generate printable and shareable QR codes linking directly to the job apply page.
            </DialogDescription>
          </DialogHeader>

          {loadingQr ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">Generating QR assets...</p>
            </div>
          ) : qrData ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="rounded-2xl border border-border bg-white p-3 shadow-inner">
                <img 
                  src={`http://localhost:8001${qrData.qr_png_url}`} 
                  alt="Job Apply QR Code" 
                  className="w-48 h-48 rounded-lg"
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs" 
                    onClick={() => window.open(`http://localhost:8001${qrData.qr_png_url}`, "_blank")}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />PNG
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs" 
                    onClick={() => window.open(`http://localhost:8001${qrData.qr_svg_url}`, "_blank")}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />SVG
                  </Button>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs" 
                  onClick={() => {
                    navigator.clipboard.writeText(qrData.apply_url);
                    toast.success("Apply URL copied!");
                  }}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />Copy Apply Link
                </Button>

                <Button 
                  size="sm" 
                  variant="default" 
                  className="w-full text-xs" 
                  onClick={handlePrintQr}
                >
                  <Printer className="mr-1.5 h-3.5 w-3.5" />Print QR Code
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 text-xs text-muted-foreground">
              Failed to load QR asset.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Applicants Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-sm bg-card/90 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Applicants
            </DialogTitle>
            <DialogDescription>
              Export candidate applications. Select your desired format and filtering criteria.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Format</Label>
              <Select value={exportFormat} onValueChange={(val: any) => setExportFormat(val)}>
                <SelectTrigger className="w-full bg-background/50">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV Spreadsheet (.csv)</SelectItem>
                  <SelectItem value="excel">Excel Document (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pipeline Stage Filter</Label>
              <Select value={exportFilter} onValueChange={(val: any) => setExportFilter(val)}>
                <SelectTrigger className="w-full bg-background/50">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applicants</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted Candidates</SelectItem>
                  <SelectItem value="interviewed">Interviewed Candidates</SelectItem>
                  <SelectItem value="rejected">Rejected Candidates</SelectItem>
                  <SelectItem value="selected">Selected/Hired Candidates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowExportModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleExportApplicants} disabled={exporting}>
              {exporting ? "Exporting..." : "Download Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Role Modal */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent className="max-w-md bg-card/90 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-primary" />
              Duplicate Role
            </DialogTitle>
            <DialogDescription>
              Copy settings and fields of this role to a new job posting. Edit fields to customize.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Job Title</Label>
              <Input value={dupTitle} onChange={(e) => setDupTitle(e.target.value)} placeholder="e.g. Frontend Developer" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Location</Label>
              <Input value={dupLocation} onChange={(e) => setDupLocation(e.target.value)} placeholder="e.g. Bangalore, Jaipur, Remote" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1">
                <Label className="text-xs font-semibold">Openings</Label>
                <Input type="number" min={1} value={dupVacancies} onChange={(e) => setDupVacancies(parseInt(e.target.value) || 1)} />
              </div>
              <div className="col-span-1 space-y-1">
                <Label className="text-xs font-semibold">Min Salary</Label>
                <Input type="number" value={dupMinSalary} onChange={(e) => setDupMinSalary(e.target.value)} />
              </div>
              <div className="col-span-1 space-y-1">
                <Label className="text-xs font-semibold">Max Salary</Label>
                <Input type="number" value={dupMaxSalary} onChange={(e) => setDupMaxSalary(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowDuplicateModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateDuplicate} disabled={duplicating}>
              {duplicating ? "Duplicating..." : "Create Duplicate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Position Confirmation Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="max-w-sm bg-card/90 backdrop-blur-xl border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Archive className="h-5 w-5" />
              Close Position?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to close this position? This will deactivate all active publish channels and prevent any new applications.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button size="sm" variant="outline" onClick={() => setShowCloseDialog(false)}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={handleConfirmCloseJob} disabled={closing}>
              {closing ? "Closing..." : "Close Position"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: any }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
      <h3 className="mb-3 font-display text-sm font-semibold flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />{title}
      </h3>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-xs text-muted-foreground">—</p>;
  return (
    <ul className="space-y-1.5 text-xs text-muted-foreground">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
