import { Link } from "@tanstack/react-router";

import { useMemo, useState } from "react";
import { Bookmark, Download, Filter, Search, Sparkles, Star, Tag, UserPlus, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddCandidateDialog } from "@/features/admin/recruitment/components/AddCandidateDialog";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { CandidateAvatar, StageBadge } from "@/features/admin/recruitment/components/Bits";
import { apiInstance } from "@/api";

export function TalentPoolPage() {
  const { candidates, refreshAll } = useRecruitment();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

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
                      {/* <ScoreRing value={c.atsScore} size={44} /> */}
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

      <AddCandidateDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Add Candidate to Pool"
        description="Create a new candidate profile to include in the talent pool database."
        successMessage="Candidate added to Talent Pool successfully."
        stage="screening"
        appliedPositionFallback="Candidate"
      />
    </>
  );
}

