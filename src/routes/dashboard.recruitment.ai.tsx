import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, Brain, FileSearch, Lightbulb, ListOrdered, MessageSquare, Sparkles, Target, Wand2,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruitment } from "@/lib/recruitment/store";
import { CandidateAvatar, ScoreRing } from "@/components/recruitment/Bits";
import { Progress } from "@/components/hrms/Shared";

export const Route = createFileRoute("/dashboard/recruitment/ai")({
  head: () => ({ meta: [{ title: "Recruitment AI — Aurix" }] }),
  component: RecruitmentAI,
});

function RecruitmentAI() {
  const candidates = useRecruitment((s) => s.candidates);
  const jobs = useRecruitment((s) => s.jobs);
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");

  const ranked = useMemo(() => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return [];
    const skillSet = new Set(job.skills.map((s) => s.toLowerCase()));
    
    return candidates
      .map((c) => {
        const overlap = c.skills.filter((s) => skillSet.has(s.toLowerCase())).length;
        // Use DB stored score if this candidate applied for the selected job, else compute from skill overlap
        const hasDbScore = c.jobId === jobId && c.atsScore != null;
        const atsMatch = hasDbScore
          ? c.atsScore!
          : job.skills.length > 0
            ? Math.round((overlap / job.skills.length) * 100)
            : 0;
        const skillMatch = hasDbScore && c.jobMatch != null
          ? c.jobMatch
          : job.skills.length > 0
            ? Math.round((overlap / job.skills.length) * 100)
            : 0;
        return { c, overlap, match: skillMatch, atsMatch };
      })
      .sort((a, b) => b.atsMatch - a.atsMatch)
      .slice(0, 8);
  }, [jobs, jobId, candidates]);

  const aiQuestions = useMemo(() => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return [];
    
    return [
      `Design a system or workflow that addresses key challenges in ${job.title}.`,
      `How do you keep your skills up to date with technologies like ${job.skills.slice(0, 3).join(", ") || "modern industry frameworks"}?`,
      `Describe a complex scenario where you successfully applied ${job.skills[0] || "problem solving"} to resolve a block.`,
      `How do you collaborate with managers and team members to ship high-quality results?`
    ];
  }, [jobs, jobId]);

  const recs = useMemo(() => {
    return ranked
      .map(({ c, match }) => {
        let reason = "";
        if (match >= 75) {
          reason = `Excellent fit (${match}% Match). Strong match in core skills: ${c.skills.slice(0, 3).join(", ")}. Highly recommended for fast-track to technical interview.`;
        } else if (match >= 50) {
          reason = `Good potential (${match}% Match). Key skills present: ${c.skills.slice(0, 2).join(", ")}. Recommended for initial screening.`;
        } else {
          reason = `Moderate match (${match}% Match). Review candidate's background on ${c.skills.slice(0, 2).join(", ") || "experience"} before proceeding.`;
        }
        return { c, reason };
      })
      .slice(0, 3);
  }, [ranked]);

  return (
    <>
      <PageHeader
        title="Recruitment AI"
        description="AI-powered screening, ranking, and hiring recommendations."
        actions={<Badge variant="outline" className="gap-1"><Sparkles className="h-3 w-3" />Beta</Badge>}
      />

      {/* Hero AI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AICard icon={FileSearch} title="Resume Screening" desc="Score & summarize incoming resumes against any job spec." cta="Screen now" />
        <AICard icon={Target} title="Skill Matching" desc="Find latent skill overlap beyond keyword matches." cta="Match candidates" />
        <AICard icon={MessageSquare} title="Interview Questions" desc="Generate role-specific question banks calibrated to seniority." cta="Generate set" />
      </div>

      {/* Ranking */}
      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-base font-semibold">Candidate Ranking</div>
            <div className="text-xs text-muted-foreground">AI-ranked shortlist for the selected role.</div>
          </div>
          <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} {j.skills.length > 0 ? `(${j.skills.length} skills)` : "(no skills)"}</option>)}
          </select>
        </div>

        {/* Warn if selected job has no skills */}
        {jobs.find(j => j.id === jobId)?.skills.length === 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-600 dark:text-amber-400">
            <span className="text-base">⚠️</span>
            <span>This job has <strong>no skills defined</strong>. Scores will be 0% for all candidates. Edit the job to add required skills for accurate AI ranking.</span>
          </div>
        )}

        <ol className="space-y-2">
          {ranked.map((r, i) => (
            <li key={r.c.id} className="flex items-center gap-4 rounded-xl border border-border bg-background/40 p-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">{i + 1}</div>
              <CandidateAvatar name={r.c.name} />
              <div className="min-w-0 flex-1">
                <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: r.c.id }} className="text-sm font-medium hover:underline">{r.c.name}</Link>
                <div className="text-xs text-muted-foreground">{r.c.currentRole} · {r.overlap} matching skills</div>
              </div>

              <div className="hidden w-40 sm:block">
                <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground"><span>Job Match</span><span>{r.match}%</span></div>
                <Progress value={r.match} />
              </div>
              <ScoreRing value={r.atsMatch} label="ATS" />
            </li>
          ))}
        </ol>
      </div>

      {/* AI questions */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}><Wand2 className="h-4 w-4" /></div>
            <div>
              <div className="font-display text-sm font-semibold">AI Interview Questions</div>
              <div className="text-xs text-muted-foreground">Calibrated to the selected role.</div>
            </div>
          </div>
          <ul className="space-y-2">
            {aiQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border bg-background/50 p-3 text-sm">
                <span className="text-muted-foreground">{i + 1}.</span><span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}><Lightbulb className="h-4 w-4" /></div>
            <div>
              <div className="font-display text-sm font-semibold">Hiring Recommendations</div>
              <div className="text-xs text-muted-foreground">Suggested next actions for this role.</div>
            </div>
          </div>
          <ul className="space-y-2">
            {recs.map((r, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3 text-sm">
                <CandidateAvatar name={r.c!.name} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{r.c!.name}</div>
                  <div className="text-xs text-muted-foreground">{r.reason}</div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: r.c!.id }}>Open<ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function AICard({ icon: Icon, title, desc, cta }: { icon: any; title: string; desc: string; cta: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50" style={{ background: "var(--gradient-brand)" }} />
      <div className="grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-3 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <Button size="sm" variant="outline" className="mt-4">{cta}<ArrowRight className="ml-2 h-3 w-3" /></Button>
    </div>
  );
}
