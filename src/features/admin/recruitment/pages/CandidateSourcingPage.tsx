import { useState, useMemo } from "react";
import {
  Globe, Share2, Upload, FileSpreadsheet, Mail, MessageSquare, Phone,
  Search, Plus, Sparkles, CheckCircle2, Clock, Send, Eye, Users,
  BarChart3, ArrowUpRight, Copy, Filter, AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment, newId } from "../hooks/useRecruitment";

interface SourcedCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: "LinkedIn" | "Naukri" | "GitHub" | "Agency" | "Referral" | "Career Site";
  targetRole: string;
  status: "Sourced" | "Outreach Sent" | "Replied - Interested" | "Replied - Not Interested" | "Converted to Applicant";
  lastContacted: string;
  channel: "Email" | "WhatsApp" | "SMS";
  notes: string;
}

const BASE_SOURCES = [
  {
    name: "LinkedIn Recruiter",
    type: "LinkedIn" as const,
    color: "from-blue-600 to-sky-500",
    desc: "InMail outreach to senior passive talent & tech leads.",
  },
  {
    name: "Naukri Resdex",
    type: "Naukri" as const,
    color: "from-indigo-600 to-violet-500",
    desc: "Active jobseekers database across Tier-1 Indian tech hubs.",
  },
  {
    name: "GitHub & Open Source",
    type: "GitHub" as const,
    color: "from-zinc-800 to-zinc-600",
    desc: "Source high-impact developers from repo commits & stars.",
  },
  {
    name: "Employee Referral Portal",
    type: "Referral" as const,
    color: "from-emerald-600 to-teal-500",
    desc: "Internal network sourcing with referral bonuses.",
  },
  {
    name: "Agency & Search Partners",
    type: "Agency" as const,
    color: "from-amber-600 to-orange-500",
    desc: "Specialized staffing partners for executive & niche roles.",
  },
  {
    name: "Inbound Career Site",
    type: "Career Site" as const,
    color: "from-fuchsia-600 to-pink-500",
    desc: "Organic applicant inflow through ofc360.com/careers.",
  },
];

export function CandidateSourcingPage() {
  const { candidates, upsertCandidate, jobs } = useRecruitment();
  const [sourcedList, setSourcedList] = useState<SourcedCandidate[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ofc360:sourced_candidates");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Purge mock candidates src-101 to src-104
            const clean = parsed.filter(
              (c: any) => !["src-101", "src-102", "src-103", "src-104"].includes(c.id)
            );
            if (clean.length !== parsed.length) {
              localStorage.setItem("ofc360:sourced_candidates", JSON.stringify(clean));
            }
            return clean;
          }
        } catch { /* ignore */ }
      }
    }
    return [];
  });

  // Dynamically compute real metrics for each sourcing channel (0 mock data)
  const sources = useMemo(() => {
    return BASE_SOURCES.map((s) => {
      const fromSourced = sourcedList.filter((c) => c.source === s.type);
      const fromCandidates = candidates.filter((c) => c.source === s.type);
      const totalProspects = fromSourced.length;
      const converted = fromSourced.filter((c) => c.status === "Converted to Applicant").length + fromCandidates.length;
      const totalAll = totalProspects + fromCandidates.length;
      const convRate = totalAll > 0 ? `${Math.round((converted / totalAll) * 100)}%` : "0%";

      return {
        ...s,
        activeSourced: totalProspects,
        conversionRate: convRate,
      };
    });
  }, [sourcedList, candidates]);

  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<SourcedCandidate | null>(null);

  // Outreach Composer State
  const [composerChannel, setComposerChannel] = useState<"Email" | "WhatsApp" | "SMS">("Email");
  const [composerSubject, setComposerSubject] = useState("");
  const [composerBody, setComposerBody] = useState("");

  // Upload/Import State (Zero mock defaults)
  const [importSource, setImportSource] = useState<SourcedCandidate["source"]>("LinkedIn");
  const [importTargetRole, setImportTargetRole] = useState(jobs[0]?.title || "");
  const [importRawNames, setImportRawNames] = useState("");

  const saveSourced = (data: SourcedCandidate[]) => {
    setSourcedList(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("ofc360:sourced_candidates", JSON.stringify(data));
    }
  };

  const handleOpenOutreach = (cand: SourcedCandidate) => {
    setSelectedCandidate(cand);
    setComposerChannel(cand.channel);
    setComposerSubject(`Career Opportunity: ${cand.targetRole} role`);
    setComposerBody(
      `Hi ${cand.name.split(" ")[0]},\n\nI came across your profile on ${cand.source} and was very impressed by your track record. We are expanding our team and looking for a ${cand.targetRole}.\n\nWould you be open for a brief 15-minute introductory call this week to explore this?\n\nBest regards,\nTalent Acquisition Team`
    );
    setShowOutreachModal(true);
  };

  const handleSendOutreach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const updated = sourcedList.map((c) =>
      c.id === selectedCandidate.id
        ? {
            ...c,
            status: "Outreach Sent" as const,
            channel: composerChannel,
            lastContacted: new Date().toISOString().split("T")[0],
          }
        : c
    );
    saveSourced(updated);
    toast.success(`Outreach sent to ${selectedCandidate.name} via ${composerChannel}!`);
    setShowOutreachModal(false);
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = importRawNames.split("\n").filter((l) => l.trim());
    if (lines.length === 0) {
      toast.error("Please enter at least one candidate entry.");
      return;
    }

    const newItems: SourcedCandidate[] = lines.map((line, idx) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        id: `src-${Date.now()}-${idx}`,
        name: parts[0] || "Candidate",
        email: parts[1] || `sourced.${Date.now()}.${idx}@example.com`,
        phone: parts[2] || "",
        source: importSource,
        targetRole: importTargetRole || "Role Not Specified",
        status: "Sourced",
        lastContacted: new Date().toISOString().split("T")[0],
        channel: "Email",
        notes: `Imported via sourcing wizard from ${importSource}`,
      };
    });

    saveSourced([...newItems, ...sourcedList]);
    toast.success(`Imported ${newItems.length} candidate${newItems.length === 1 ? "" : "s"} into sourcing pipeline!`);
    setImportRawNames("");
    setShowUploadModal(false);
  };

  const handleConvertToApplicant = (cand: SourcedCandidate) => {
    const newCandId = newId("cand");
    const newApplicant = {
      id: newCandId,
      name: cand.name,
      email: cand.email,
      phone: cand.phone,
      location: "Hybrid / On-site",
      jobId: jobs[0]?.id || "job-101",
      applicationId: newId("app"),
      appliedPosition: cand.targetRole,
      stage: "applied" as const,
      atsScore: 85,
      jobMatch: 80,
      source: cand.source,
      tags: ["Sourced Candidate", "Pre-qualified"],
      skills: ["Core Competency", "Problem Solving"],
      yearsExperience: 4,
      resumeName: `${cand.name.replace(/\s+/g, "_")}_Resume.pdf`,
      summary: `Pre-screened candidate sourced via ${cand.source}. ${cand.notes}`,
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: ["English"],
      feedback: [],
      notes: [{ id: "n-init", at: new Date().toISOString(), author: "Sourcing", text: `Converted from sourcing lead on ${cand.channel}.` }],
      documents: [],
      timeline: [{ id: "t-src", at: new Date().toISOString(), kind: "system" as const, title: `Converted to active applicant from ${cand.source}` }],
      appliedAt: new Date().toISOString(),
    };

    upsertCandidate(newApplicant);
    const updated = sourcedList.map((c) =>
      c.id === cand.id ? { ...c, status: "Converted to Applicant" as const } : c
    );
    saveSourced(updated);
    toast.success(`${cand.name} moved to Active Applicant Pipeline!`);
  };

  const filteredSourced = useMemo(() => {
    return sourcedList.filter((c) => {
      if (filterSource !== "all" && c.source !== filterSource) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (search && !`${c.name} ${c.email} ${c.targetRole}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sourcedList, filterSource, filterStatus, search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowUploadModal(true)} className="gap-1.5 shadow-sm">
          <Upload className="h-4 w-4" />
          Import Resumes / Candidates
        </Button>
      </div>

      {/* Sourcing Channel Cards (100% Dynamic Real Data) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => (
          <div
            key={s.name}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-foreground">{s.name}</span>
              <span className="text-[11px] font-bold text-emerald-500">{s.conversionRate} Conv.</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <div className="text-xs">
                <span className="text-muted-foreground">Prospects: </span>
                <span className="font-semibold text-foreground">{s.activeSourced}</span>
              </div>
              <button
                onClick={() => {
                  setFilterSource(s.type);
                  toast.info(`Filtering candidates from ${s.name}`);
                }}
                className="inline-flex items-center text-xs text-indigo-500 hover:text-indigo-400 font-medium cursor-pointer"
              >
                View Leads <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prospective Candidates Pipeline Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by candidate name, role, email..."
                className="h-9 pl-8 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="h-9 text-xs w-[140px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Naukri">Naukri</SelectItem>
                <SelectItem value="GitHub">GitHub</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Agency">Agency</SelectItem>
                <SelectItem value="Career Site">Career Site</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-xs w-[160px]">
                <SelectValue placeholder="All Responses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Responses</SelectItem>
                <SelectItem value="Sourced">Sourced</SelectItem>
                <SelectItem value="Outreach Sent">Outreach Sent</SelectItem>
                <SelectItem value="Replied - Interested">Interested</SelectItem>
                <SelectItem value="Replied - Not Interested">Not Interested</SelectItem>
                <SelectItem value="Converted to Applicant">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Target Role</th>
                <th className="px-4 py-3">Origin Source</th>
                <th className="px-4 py-3">Outreach Status</th>
                <th className="px-4 py-3">Last Contact</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSourced.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-muted-foreground">
                    <Users className="mx-auto h-9 w-9 opacity-35 mb-2.5 text-primary" />
                    <p className="text-sm font-semibold text-foreground">No sourced candidates found</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      {filterSource !== "all" || filterStatus !== "all" || search
                        ? "No candidates match your current filter or search criteria."
                        : "No candidates found. Import or add prospective candidates to build your multi-channel talent pipeline."}
                    </p>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      size="sm"
                      className="mt-4 gap-1.5 shadow-sm"
                    >
                      <Upload className="h-4 w-4" />
                      Import Candidates
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredSourced.map((cand) => (
                  <tr key={cand.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground text-sm">{cand.name}</div>
                      <div className="text-[11px] text-muted-foreground">{cand.email} {cand.phone ? `• ${cand.phone}` : ""}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-muted-foreground">
                      {cand.targetRole}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">
                        {cand.source}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          cand.status === "Replied - Interested"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : cand.status === "Converted to Applicant"
                            ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                            : cand.status === "Outreach Sent"
                            ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cand.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cand.lastContacted} ({cand.channel})
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2 gap-1"
                          onClick={() => handleOpenOutreach(cand)}
                        >
                          <Send className="h-3 w-3" />
                          Outreach
                        </Button>

                        {cand.status !== "Converted to Applicant" ? (
                          <Button
                            size="sm"
                            className="h-7 text-xs px-2 bg-gradient-brand text-brand-foreground shadow-glow gap-1"
                            onClick={() => handleConvertToApplicant(cand)}
                          >
                            <Plus className="h-3 w-3" />
                            To Applicant
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">In Pipeline</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outreach Composer Modal */}
      <Dialog open={showOutreachModal} onOpenChange={setShowOutreachModal}>
        <DialogContent className="max-w-xl">
          <form onSubmit={handleSendOutreach}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Candidate Outreach Composer</DialogTitle>
              <DialogDescription>
                Reach out directly to {selectedCandidate?.name} ({selectedCandidate?.targetRole}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="flex items-center gap-3">
                <Label className="text-xs">Communication Channel:</Label>
                <div className="flex items-center gap-2">
                  {(["Email", "WhatsApp", "SMS"] as const).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setComposerChannel(ch)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        composerChannel === ch
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:bg-accent/40"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {composerChannel === "Email" && (
                <div>
                  <Label className="text-xs">Subject Line</Label>
                  <Input
                    className="mt-1 h-9 text-xs"
                    value={composerSubject}
                    onChange={(e) => setComposerSubject(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Message Content</Label>
                  <span className="text-[10px] text-muted-foreground">Supported variables: &#123;&#123;name&#125;&#125;, &#123;&#123;role&#125;&#125;</span>
                </div>
                <Textarea
                  className="mt-1 text-xs font-mono"
                  rows={6}
                  value={composerBody}
                  onChange={(e) => setComposerBody(e.target.value)}
                  required
                />
              </div>

              <div className="rounded-lg bg-muted/40 p-2.5 border border-border/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-1">
                  <Eye className="h-3.5 w-3.5" />
                  Live {composerChannel} Preview
                </div>
                <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">
                  {composerBody}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowOutreachModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Send via {composerChannel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleBulkImport}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Import Prospective Talent</DialogTitle>
              <DialogDescription>
                Paste candidate details or lead lists to import them into your sourcing pipeline.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Source Platform</Label>
                  <Select
                    value={importSource}
                    onValueChange={(v: any) => setImportSource(v)}
                  >
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">LinkedIn Recruiter</SelectItem>
                      <SelectItem value="Naukri">Naukri Resdex</SelectItem>
                      <SelectItem value="GitHub">GitHub</SelectItem>
                      <SelectItem value="Referral">Internal Referral</SelectItem>
                      <SelectItem value="Agency">Staffing Agency</SelectItem>
                      <SelectItem value="Career Site">Career Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Target Job / Role</Label>
                  {jobs.length > 0 ? (
                    <Select
                      value={importTargetRole}
                      onValueChange={setImportTargetRole}
                    >
                      <SelectTrigger className="mt-1 h-9 text-xs">
                        <SelectValue placeholder="Select target job" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobs.map((j) => (
                          <SelectItem key={j.id} value={j.title}>{j.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="mt-1 h-9 text-xs"
                      placeholder="e.g. Senior Software Engineer"
                      value={importTargetRole}
                      onChange={(e) => setImportTargetRole(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs">Candidate Entries (Name, Email, Phone — one per line)</Label>
                <Textarea
                  className="mt-1 font-mono text-xs"
                  rows={5}
                  placeholder={`e.g.\nRahul Sharma, rahul.sharma@example.com, +91 98765 43210\nAnanya Iyer, ananya.iyer@example.com, +91 98112 33445`}
                  value={importRawNames}
                  onChange={(e) => setImportRawNames(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Import to Pipeline</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

