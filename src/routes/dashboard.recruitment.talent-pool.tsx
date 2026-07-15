import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, Download, Filter, Search, Sparkles, Star, Tag, UserPlus, Upload } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRecruitment, recruitment, newId, refreshAll } from "@/lib/recruitment/store";
import { CandidateAvatar, ScoreRing, StageBadge } from "@/components/recruitment/Bits";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiInstance } from "@/api";

export const Route = createFileRoute("/dashboard/recruitment/talent-pool")({
  head: () => ({ meta: [{ title: "Talent Pool — Recruitment" }] }),
  component: TalentPool,
});

function TalentPool() {
  const candidates = useRecruitment((s) => s.candidates);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentCompany: "",
    currentRole: "",
    yearsExperience: "0",
    expectedSalary: "0",
    noticeDays: "0",
    skills: "",
    tags: "",
    summary: "",
  });

  // Calculate dynamic counts for saved searches based on the current candidates list
  const computedSavedSearches = useMemo(() => {
    return [
      { id: "ss1", name: "Senior React Engineers", query: "react senior" },
      { id: "ss2", name: "Product Designers — Remote", query: "design remote" },
      { id: "ss3", name: "Data Scientists — Python", query: "python data" },
      { id: "ss4", name: "Sales Leaders — EMEA", query: "sales emea" },
    ].map((s) => {
      const ql = s.query.toLowerCase().split(" ");
      const count = candidates.filter((c) => {
        const text = `${c.name} ${c.appliedPosition} ${c.currentRole} ${c.location} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase();
        return ql.every((term) => text.includes(term));
      }).length;
      return { ...s, count };
    });
  }, [candidates]);

  const allTags = useMemo(() => Array.from(new Set(candidates.flatMap((c) => [...c.skills, ...c.tags]))).slice(0, 24), [candidates]);

  const results = useMemo(() => {
    const ql = q.toLowerCase();
    return candidates.filter((c) => {
      if (minScore && (c.atsScore ?? 0) < minScore) return false;
      if (tag && ![...c.skills, ...c.tags].includes(tag)) return false;
      if (!ql) return true;
      return (
        c.name.toLowerCase().includes(ql) ||
        c.appliedPosition.toLowerCase().includes(ql) ||
        c.location.toLowerCase().includes(ql) ||
        c.skills.join(" ").toLowerCase().includes(ql)
      );
    });
  }, [candidates, q, tag, minScore]);

  const handleExportCSV = async () => {
    try {
      const response = await apiInstance.get("/candidates/export/csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "candidates_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV export downloaded successfully!");
    } catch (err) {
      toast.error("Failed to export candidates.");
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("file", file);

    try {
      const response = await apiInstance.post("/candidates/import", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.success) {
        toast.success(response.data?.message || "Successfully imported candidates!");
        await refreshAll();
      } else {
        toast.error("Import failed");
      }
    } catch (err) {
      toast.error("Failed to import candidates. Make sure the file format is correct.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      await recruitment.upsertCandidate({
        id: newId("cand"),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        jobId: "",
        applicationId: "",
        appliedPosition: formData.currentRole || "Candidate",
        stage: "screening",
        atsScore: null,
        jobMatch: null,
        source: "DIRECT",
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        yearsExperience: Number(formData.yearsExperience) || 0,
        currentCompany: formData.currentCompany,
        currentRole: formData.currentRole,
        expectedSalary: Number(formData.expectedSalary) || 0,
        noticeDays: Number(formData.noticeDays) || 0,
        resumeName: "resume.pdf",
        summary: formData.summary,
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        languages: [],
        feedback: [],
        notes: [],
        documents: [],
        timeline: [],
        appliedAt: new Date().toISOString(),
      });
      toast.success("Candidate added to Talent Pool successfully!");
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        currentCompany: "",
        currentRole: "",
        yearsExperience: "0",
        expectedSalary: "0",
        noticeDays: "0",
        skills: "",
        tags: "",
        summary: "",
      });
    } catch (err) {
      toast.error("Failed to add candidate.");
    }
  };

  return (
    <>
      <input
        type="file"
        id="csv-import-input"
        accept=".csv"
        className="hidden"
        onChange={handleImportCSV}
      />

      <PageHeader
        title="Talent Pool"
        description={`Searchable database of ${candidates.length} candidates across every requisition.`}
        actions={
          <>
            <Button variant="outline" onClick={() => document.getElementById("csv-import-input")?.click()}><Upload className="mr-2 h-4 w-4" />Import CSV</Button>
            <Button variant="outline" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
            <Button onClick={() => setShowAddModal(true)}><UserPlus className="mr-2 h-4 w-4" />Add to Pool</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <aside className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Bookmark className="h-4 w-4" />Saved Searches</div>
            <ul className="space-y-1.5">
              {computedSavedSearches.map((s) => (
                <li key={s.id}>
                  <button onClick={() => setQ(s.query)} className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-accent/40 text-left">
                    <span className="truncate">{s.name}</span>
                    <Badge variant="secondary" className="ml-2">{s.count}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Tag className="h-4 w-4" />Skills & Tags</div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setTag(null)} className={`rounded-full px-2 py-0.5 text-xs ring-1 ${!tag ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-accent/40"}`}>All</button>
              {allTags.map((t) => (
                <button key={t} onClick={() => setTag(t)} className={`rounded-full px-2 py-0.5 text-xs ring-1 ${tag === t ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-accent/40"}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Filter className="h-4 w-4" />Min ATS Score</div>
            <input type="range" min={0} max={95} step={5} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-full" />
            <div className="mt-1 text-xs text-muted-foreground">≥ {minScore}</div>
          </div>
        </aside>

        <section className="space-y-3 lg:col-span-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-xl">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Boolean search: skills, role, location…" className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
            <Badge variant="outline"><Sparkles className="mr-1 h-3 w-3" />AI Match</Badge>
          </div>

          <div className="text-xs text-muted-foreground">{results.length} matching candidates</div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {results.map((c) => (
              <Link
                key={c.id}
                to="/dashboard/recruitment/candidates/$candidateId"
                params={{ candidateId: c.id }}
                className="group block rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="flex items-start gap-3">
                  <CandidateAvatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="truncate font-semibold group-hover:text-primary transition-colors">{c.name}</div>
                      <StageBadge stage={c.stage} />
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{c.currentRole || c.appliedPosition} · {c.location}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.skills.slice(0, 5).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3" />{c.yearsExperience}y · {c.source}</div>
                      <ScoreRing value={c.atsScore} size={44} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {!results.length && (
              <div className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No candidates match your filters.</div>
            )}
          </div>
        </section>
      </div>

      {/* Add Candidate Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Candidate to Pool</DialogTitle>
            <DialogDescription>Create a new candidate profile to include in the talent pool database.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cand-name">Full Name *</Label>
                <Input
                  id="cand-name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cand-email">Email Address *</Label>
                <Input
                  id="cand-email"
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cand-phone">Phone Number</Label>
                <Input
                  id="cand-phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cand-location">Location</Label>
                <Input
                  id="cand-location"
                  placeholder="e.g. Bengaluru, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cand-company">Current Company</Label>
                <Input
                  id="cand-company"
                  placeholder="e.g. Acme Corp"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cand-role">Current Role</Label>
                <Input
                  id="cand-role"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cand-exp">Experience (Years)</Label>
                <Input
                  id="cand-exp"
                  type="number"
                  min="0"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cand-salary">Expected CTC (INR)</Label>
                <Input
                  id="cand-salary"
                  type="number"
                  min="0"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cand-notice">Notice Period (Days)</Label>
                <Input
                  id="cand-notice"
                  type="number"
                  min="0"
                  value={formData.noticeDays}
                  onChange={(e) => setFormData({ ...formData, noticeDays: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="cand-skills">Skills (Comma-separated)</Label>
              <Input
                id="cand-skills"
                placeholder="e.g. React, TypeScript, Node.js"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cand-tags">Tags (Comma-separated)</Label>
              <Input
                id="cand-tags"
                placeholder="e.g. Remote, Immediate Joiner, Referral"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cand-summary">Candidate Summary</Label>
              <Textarea
                id="cand-summary"
                placeholder="Brief summary of candidate's profile and background..."
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button type="submit">Add Candidate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
