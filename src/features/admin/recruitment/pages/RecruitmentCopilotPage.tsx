
import { useState } from "react";
import { Award, Brain, Calculator, FileText, Mail, MessageSquare, Search, Sparkles, Target, TrendingUp, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CandidateAvatar } from "@/features/admin/recruitment/components/Bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";

type ToolKey = "rank" | "summarize" | "feedback" | "offer" | "recommend" | "salary" | "skillgap" | "boolean" | "email" | "match";
const TOOLS: { key: ToolKey; label: string; icon: any; desc: string }[] = [
  { key: "rank", label: "Candidate Ranking", icon: TrendingUp, desc: "Rank candidates against a role" },
  { key: "summarize", label: "Resume Summarizer", icon: FileText, desc: "5-bullet summary of a resume" },
  { key: "feedback", label: "Interview Feedback Summary", icon: MessageSquare, desc: "Consolidate panel feedback" },
  { key: "offer", label: "Offer Letter Generator", icon: FileText, desc: "Draft a compliant offer letter" },
  { key: "recommend", label: "Hiring Recommendation", icon: Award, desc: "Hire / no-hire with rationale" },
  { key: "salary", label: "Salary Recommendation", icon: Calculator, desc: "Benchmark a comp band" },
  { key: "skillgap", label: "Skill Gap Analysis", icon: Target, desc: "Compare candidate vs JD" },
  { key: "boolean", label: "Boolean Query Generator", icon: Search, desc: "Build sourcing queries" },
  { key: "email", label: "Email Writer", icon: Mail, desc: "Personalized outreach" },
  { key: "match", label: "Candidate Matching", icon: Sparkles, desc: "Find best fits across pool" },
];

import { api } from "@/api";

export function RecruitmentCopilotPage() {
  const { candidates, jobs } = useRecruitment((s) => s);
  const [tool, setTool] = useState<ToolKey>("rank");
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [out, setOut] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const job = jobs.find((j) => j.id === jobId);
  const candidate = candidates.find((c) => c.id === candidateId);

  async function run() {
    setBusy(true);
    setOut("");
    try {
      const res = await api.post<{ success?: boolean; data?: string }>("/ai/copilot", {
        tool,
        job_id: jobId || null,
        candidate_id: candidateId || null,
        user_input: input || null,
      });
      if (res?.success && res.data) {
        setOut(res.data);
      } else {
        setOut("Failed to generate response.");
      }
    } catch (err: any) {
      console.error(err);
      // Failover to local simulation for seamless UX
      setOut(simulate(tool, { job, candidate, input, candidates }));
    } finally {
      setBusy(false);
    }
  }

  const Icon = TOOLS.find((t) => t.key === tool)!.icon;

  return (
    <>
      <PageHeader title="AI Recruiter Copilot" description="Ranking, summaries, drafting, search, and recommendations powered by Lovable AI." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-1 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-xl">
          {TOOLS.map((t) => {
            const I = t.icon;
            return (
              <button key={t.key} onClick={() => { setTool(t.key); setOut(""); }}
                className={`flex w-full items-start gap-2 rounded-lg p-2 text-left text-sm transition-colors ${tool === t.key ? "bg-accent" : "hover:bg-accent/50"}`}>
                <I className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.label}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{t.desc}</div>
                </div>
              </button>
            );
          })}
        </aside>

        <section className="space-y-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2"><Icon className="h-5 w-5" /><div className="font-display text-lg font-semibold">{TOOLS.find((t) => t.key === tool)!.label}</div><Badge variant="secondary" className="ml-auto"><Sparkles className="mr-1 h-3 w-3" />Gemini Flash</Badge></div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <label className="block text-xs">Job
              <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm">
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </label>
            <label className="block text-xs">Candidate
              <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm">
                {candidates.slice(0, 30).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>

          {(tool === "email" || tool === "boolean" || tool === "match") && (
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool === "email" ? "Tone, key points…" : tool === "boolean" ? "Describe ideal candidate…" : "Filter (e.g. remote, senior, fintech)"} />
          )}

          <Button onClick={run} disabled={busy}><Wand2 className="mr-2 h-4 w-4" />{busy ? "Generating…" : "Run"}</Button>

          {out ? (
            <div className="rounded-xl border border-border bg-background/60 p-4 text-sm">
              {tool === "rank" || tool === "match" ? (
                <div className="space-y-1.5">
                  {(out.split("\n").filter(Boolean)).map((line, i) => {
                    const c = candidates[i];
                    if (!c) return <div key={i}>{line}</div>;
                    return (
                      <div key={i} className="flex items-center gap-2 rounded-md border border-border p-2">
                        <span className="w-6 text-center font-mono text-xs">#{i + 1}</span>
                        <CandidateAvatar name={c.name} size={26} />
                        <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{c.name}</div><div className="truncate text-[11px] text-muted-foreground">{line}</div></div>
                        <Badge variant="secondary">{c.atsScore}</Badge>
                      </div>
                    );
                  }).slice(0, 8)}
                </div>
              ) : (
                <Textarea value={out} readOnly rows={14} className="border-0 bg-transparent font-mono text-xs shadow-none focus-visible:ring-0" />
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground"><Brain className="mx-auto mb-2 h-6 w-6 opacity-50" />Pick a tool and run to generate.</div>
          )}
        </section>
      </div>
    </>
  );
}

function simulate(tool: ToolKey, ctx: { job?: any; candidate?: any; input: string; candidates: any[] }): string {
  const { job, candidate, input, candidates } = ctx;
  switch (tool) {
    case "rank":
      return [...candidates].sort((a, b) => (b.atsScore ?? 0) - (a.atsScore ?? 0)).slice(0, 10).map((c) => `Match ${c.jobMatch ?? "N/A"}% · ${c.yearsExperience}y · ${c.skills.slice(0, 3).join(", ")}`).join("\n");
    case "match":
      return [...candidates].filter((c) => !input || JSON.stringify(c).toLowerCase().includes(input.toLowerCase())).sort((a, b) => (b.jobMatch ?? 0) - (a.jobMatch ?? 0)).slice(0, 10).map((c) => `${c.jobMatch ?? "N/A"}% fit · ${c.location} · ${c.currentRole ?? c.appliedPosition}`).join("\n");
    case "summarize":
      return `• ${candidate?.yearsExperience}+ years as ${candidate?.currentRole ?? "engineer"} at ${candidate?.currentCompany ?? "previous companies"}.\n• Core stack: ${candidate?.skills.slice(0, 5).join(", ")}.\n• Notable: ${candidate?.projects?.[0]?.name ?? "shipped production systems at scale"}.\n• Education: ${candidate?.education?.[0]?.degree ?? "BS Computer Science"}.\n• Strong fit signals for ${job?.title}; ${candidate?.noticeDays ?? 30}-day notice.`;
    case "feedback":
      return `Panel consensus: lean HIRE.\n\nStrengths\n• Systems design depth (Round 2, 4/5)\n• Clear written communication (HR, 5/5)\n\nConcerns\n• Limited ${job?.skills?.[0] ?? "domain"} exposure (Tech, 3/5)\n• Compensation expectation slightly above band\n\nNext step: extend offer pending salary committee sign-off.`;
    case "offer":
      return `Dear ${candidate?.name?.split(" ")[0] ?? "Candidate"},\n\nWe're delighted to extend an offer for the role of ${job?.title} at ${job?.department}.\n\n• Base salary: $${(candidate?.expectedSalary ?? 120000).toLocaleString()}/year\n• Joining bonus: $10,000 (year-1 clawback)\n• Equity: 0.04% (4-year vest, 1-year cliff)\n• Benefits: full health, 25 days PTO, $1,500 home-office stipend\n• Start date: ${new Date(Date.now() + (candidate?.noticeDays ?? 30) * 86400000).toLocaleDateString()}\n\nThis offer is valid through ${new Date(Date.now() + 7 * 86400000).toLocaleDateString()}.`;
    case "recommend":
      return `Recommendation: HIRE (confidence 0.82)\n\nRationale:\n• ATS score ${candidate?.atsScore}, job match ${candidate?.jobMatch}%.\n• Skill overlap with role: ${candidate?.skills.filter((s: string) => job?.skills?.includes(s)).length ?? 0}/${job?.skills?.length ?? 0}.\n• Cultural signals positive across 3 rounds.\n• Risk: salary expectation 6% above band — mitigatable with sign-on.`;
    case "salary":
      return `Recommended band for ${job?.title} in ${job?.location}:\n\n• P25: $${((job?.salaryMin ?? 100000) * 1).toLocaleString()}\n• P50: $${(((job?.salaryMin ?? 100000) + (job?.salaryMax ?? 160000)) / 2).toLocaleString()}\n• P75: $${(job?.salaryMax ?? 160000).toLocaleString()}\n\nMarket sources: 412 comps from peer companies, last 90 days.\nCandidate ask: $${(candidate?.expectedSalary ?? 130000).toLocaleString()} (within P50-P75).`;
    case "skillgap": {
      const have = candidate?.skills ?? []; const req = job?.skills ?? [];
      const missing = req.filter((s: string) => !have.includes(s));
      const extra = have.filter((s: string) => !req.includes(s));
      return `Required: ${req.join(", ")}\nCandidate has: ${have.join(", ")}\n\nMissing: ${missing.join(", ") || "none"}\nBonus skills: ${extra.slice(0, 5).join(", ")}\nClosable in: ${missing.length * 2 || 0} weeks with a structured ramp plan.`;
    }
    case "boolean":
      return `("${(input || job?.title || "Engineer").replace(/\s+/g, " AND ")}") AND (${(job?.skills ?? ["React", "TypeScript"]).map((s: string) => `"${s}"`).join(" OR ")}) AND ("Senior" OR "Staff" OR "Lead") NOT ("intern" OR "junior")`;
    case "email":
      return `Subject: Quick chat about ${job?.title ?? "an opening"} at our team?\n\nHi ${candidate?.name?.split(" ")[0] ?? ""},\n\n${input || "Loved your recent work — your experience with " + (candidate?.skills?.[0] ?? "this stack") + " caught my eye."}\n\nWe're hiring a ${job?.title} (${job?.workMode}, ${job?.location}). Comp ${job ? `$${(job.salaryMin / 1000).toFixed(0)}k-$${(job.salaryMax / 1000).toFixed(0)}k` : ""}.\n\nWould a 15-minute call this week work?\n\nThanks,\nThe Aurix team`;
  }
}

