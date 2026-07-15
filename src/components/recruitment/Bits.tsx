import { Link } from "@tanstack/react-router";
import { Briefcase, MapPin, Users, Clock, Star, Sparkles } from "lucide-react";
import type { Candidate, Job, Stage } from "@/lib/recruitment/types";
import { STAGE_LABEL } from "@/lib/recruitment/types";
import { Badge } from "@/components/ui/badge";

const STAGE_TONE: Record<Stage, string> = {
  applied: "bg-slate-500/15 text-slate-600 ring-slate-500/20 dark:text-slate-300",
  screening: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  assessment: "bg-indigo-500/15 text-indigo-600 ring-indigo-500/20 dark:text-indigo-300",
  interview: "bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300",
  technical: "bg-fuchsia-500/15 text-fuchsia-600 ring-fuchsia-500/20 dark:text-fuchsia-300",
  hr: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  offer: "bg-orange-500/15 text-orange-600 ring-orange-500/20 dark:text-orange-300",
  hired: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${STAGE_TONE[stage]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STAGE_LABEL[stage]}
    </span>
  );
}

export function ScoreRing({ value, label = "ATS", size = 56 }: { value: number | null | undefined; label?: string; size?: number }) {
  const hasScore = value !== null && value !== undefined;
  const safeValue = hasScore ? value! : 0;
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (safeValue / 100) * c;
  const color = !hasScore
    ? "oklch(0.55 0.03 240)"
    : safeValue >= 85 ? "oklch(0.7 0.18 150)" : safeValue >= 70 ? "oklch(0.74 0.16 80)" : "oklch(0.65 0.18 25)";
  const textSize = size < 50 ? "text-xs" : "text-sm";
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-muted/40" strokeWidth={4} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 600ms ease" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className={`font-display font-semibold ${textSize}`}>
            {hasScore ? safeValue : "—"}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}


export function JobCard({ job }: { job: Job }) {
  const tone = job.status === "active" ? "success" : job.status === "draft" ? "muted" : job.status === "closed" ? "danger" : "warning";
  const toneCls = {
    success: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
    muted: "bg-muted text-muted-foreground ring-border",
    danger: "bg-rose-500/15 text-rose-600 ring-rose-500/20",
    warning: "bg-amber-500/15 text-amber-700 ring-amber-500/20",
  }[tone];
  return (
    <Link
      to="/dashboard/recruitment/jobs/$jobId"
      params={{ jobId: job.id }}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
          <Briefcase className="h-4 w-4" />
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${toneCls}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{job.status}
        </span>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold tracking-tight">{job.title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{job.department} • {job.employmentType}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 3).map((s) => (
          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
        ))}
        {job.skills.length > 3 ? <span className="text-[10px] text-muted-foreground">+{job.skills.length - 3}</span> : null}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.workMode} · {job.location.split(",")[0]}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{job.applicants}</span>
      </div>
    </Link>
  );
}

export function CandidateAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const hue = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full text-xs font-semibold text-white shadow-inner"
      style={{ width: size, height: size, background: `linear-gradient(135deg, oklch(0.62 0.18 ${hue}), oklch(0.5 0.2 ${(hue + 60) % 360}))` }}
    >
      {initials}
    </div>
  );
}

export function CandidateRow({ c, onClick }: { c: Candidate; onClick?: () => void }) {
  return (
    <Link
      to="/dashboard/recruitment/candidates/$candidateId"
      params={{ candidateId: c.id }}
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-3 backdrop-blur-xl transition-colors hover:bg-accent/40"
    >
      <CandidateAvatar name={c.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium">{c.name}</span>
          <StageBadge stage={c.stage} />
        </div>
        <div className="mt-0.5 truncate text-xs text-muted-foreground">{c.appliedPosition} · {c.location} · {c.yearsExperience}y</div>
      </div>
      <div className="hidden flex-wrap gap-1 sm:flex">
        {c.skills.slice(0, 3).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
      </div>
      <ScoreRing value={c.atsScore} />
    </Link>
  );
}

export function KanbanCard({ c, onDragStart }: { c: Candidate; onDragStart: (e: React.DragEvent, id: string) => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, c.id)}
      className="cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-elegant active:cursor-grabbing hover:bg-accent/20"
    >
      <div className="flex items-center gap-2">
        <CandidateAvatar name={c.name} size={28} />
        <div className="min-w-0 flex-1">
          <Link
            to="/dashboard/recruitment/candidates/$candidateId"
            params={{ candidateId: c.id }}
            className="truncate text-sm font-medium hover:underline block font-semibold text-foreground cursor-pointer"
          >
            {c.name}
          </Link>
          <div className="truncate text-[10px] text-muted-foreground">{c.appliedPosition}</div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {c.skills.slice(0, 2).map((s) => <Badge key={s} variant="outline" className="text-[9px]">{s}</Badge>)}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> {c.jobMatch != null ? `${c.jobMatch}% match` : "—"}</span>
        <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" /> {c.atsScore ?? "—"}</span>
      </div>
    </div>
  );
}

export function fmtMoney(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}
export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
export function fmtRel(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  const days = Math.round(ms / 86400000);
  if (Math.abs(days) < 1) return "today";
  if (days < 0) return `${-days}d ago`;
  return `in ${days}d`;
}
