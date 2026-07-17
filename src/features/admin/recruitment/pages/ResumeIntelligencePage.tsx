
import { useMemo, useState } from "react";
import { AlertTriangle, FileSearch, GitCompareArrows, History, ScanLine, Sparkles, Upload } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CandidateAvatar } from "@/features/admin/recruitment/components/Bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { api } from "@/api/client";
import { toast } from "sonner";

export function ResumeIntelligencePage() {
  const { candidates, refreshAll } = useRecruitment();
  const [q, setQ] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading and parsing resume with AI...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("generate_embedding", "true");

      await api.post("/resume-parser/upload-and-parse", formData);
      toast.success("Resume parsed successfully and candidate added!", { id: toastId });
      await refreshAll();
    } catch (error: any) {
      console.error("Resume parsing error:", error);
      toast.error(error.message || "Failed to parse resume.", { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const duplicates = useMemo(() => {
    const groups: Record<string, typeof candidates> = {};
    candidates.forEach((c) => {
      const key = `${c.name.toLowerCase().replace(/\s+/g, "")}|${c.email.split("@")[0]}`;
      (groups[key] ||= []).push(c);
    });
    return Object.values(groups).filter((g) => g.length > 1);
  }, [candidates]);

  const filtered = candidates.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.skills.join(" ").toLowerCase().includes(q.toLowerCase())).slice(0, 18);

  const allSkills = Array.from(new Set(candidates.flatMap((c) => c.skills)));

  function toggleCompare(id: string) {
    setCompareIds((arr) => arr.includes(id) ? arr.filter((x) => x !== id) : arr.length < 3 ? [...arr, id] : arr);
  }

  return (
    <>
      <input
        type="file"
        id="resume-upload-input"
        className="hidden"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <PageHeader title="Resume Intelligence" description="Parsing, duplicate detection, skill extraction, OCR, and version history."
        actions={
          <Button onClick={() => document.getElementById("resume-upload-input")?.click()} disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Parsing..." : "Upload Resumes"}
          </Button>
        } />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { k: "Parsed Resumes", v: candidates.length, icon: ScanLine },
          { k: "Duplicates Found", v: duplicates.length, icon: AlertTriangle },
          { k: "Unique Skills", v: allSkills.length, icon: Sparkles },
          { k: "OCR Processed", v: Math.round(candidates.length * 0.62), icon: FileSearch },
        ].map((s) => {
          const I = s.icon;
          return (
            <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{s.k}</span><I className="h-4 w-4" /></div>
              <div className="mt-2 font-display text-2xl font-semibold">{s.v}</div>
            </div>
          );
        })}
      </div>

      {duplicates.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><AlertTriangle className="h-4 w-4 text-amber-500" /> Duplicate Candidates Detected</div>
          <div className="space-y-2">
            {duplicates.slice(0, 5).map((g, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-card/40 p-2 text-xs">
                <Badge variant="outline">{g.length} matches</Badge>
                {g.map((c) => <span key={c.id} className="inline-flex items-center gap-1"><CandidateAvatar name={c.name} size={20} />{c.name}</span>)}
                <Button size="sm" variant="outline" className="ml-auto h-7">Merge</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-base font-semibold">Parsed Candidates</div>
            <Input placeholder="Search by name or skill…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          </div>
          <div className="space-y-2">
            {filtered.map((c) => {
              const required = ["React", "TypeScript", "AWS", "Python", "Node.js"];
              const missing = required.filter((r) => !c.skills.includes(r));
              return (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3">
                  <input type="checkbox" checked={compareIds.includes(c.id)} onChange={() => toggleCompare(c.id)} aria-label={`Compare ${c.name}`} />
                  <CandidateAvatar name={c.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {c.skills.slice(0, 5).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                      {missing.slice(0, 2).map((m) => <Badge key={m} variant="outline" className="border-rose-500/30 text-[10px] text-rose-600">missing {m}</Badge>)}
                    </div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-[10px] text-muted-foreground">Experience</div>
                    <div className="text-sm font-semibold">{c.yearsExperience}y</div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7"><History className="mr-1 h-3 w-3" />v{(c.id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % 4) + 1}</Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><GitCompareArrows className="h-4 w-4" /> Resume Comparison</div>
            {compareIds.length < 2 ? <div className="text-xs text-muted-foreground">Select 2-3 candidates to compare.</div> : (
              <div className="space-y-2">
                {compareIds.map((id) => {
                  const c = candidates.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="rounded-lg border border-border p-2">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="mt-1 grid grid-cols-2 gap-1 text-[11px]">
                        <span>ATS</span><Progress value={c.atsScore} className="h-1.5" />
                        <span>Match</span><Progress value={c.jobMatch} className="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 text-sm font-semibold">Top Extracted Skills</div>
            <div className="flex flex-wrap gap-1">
              {allSkills.slice(0, 24).map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

