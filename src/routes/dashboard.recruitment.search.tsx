import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bookmark, Briefcase, Calendar, FileText, Gift, Save, Search as SearchIcon, Sparkles, Users } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CandidateAvatar } from "@/components/recruitment/Bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecruitment } from "@/lib/recruitment/store";

export const Route = createFileRoute("/dashboard/recruitment/search")({
  head: () => ({ meta: [{ title: "Global Search — Recruitment" }] }),
  component: GlobalSearch,
});

function matchBoolean(text: string, query: string): boolean {
  if (!query.trim()) return true;
  try {
    const t = text.toLowerCase();
    const expr = query
      .replace(/\bAND\b/g, "&&").replace(/\bOR\b/g, "||").replace(/\bNOT\b/g, "!")
      .replace(/"([^"]+)"/g, (_, w) => `t.includes(${JSON.stringify(w.toLowerCase())})`)
      .replace(/([A-Za-z0-9_+#.-]+)/g, (m) => /^(\&\&|\|\||!|true|false|t|includes)$/.test(m) ? m : `t.includes(${JSON.stringify(m.toLowerCase())})`);
    return new Function("t", `return ${expr};`)(t);
  } catch { return text.toLowerCase().includes(query.toLowerCase()); }
}

function GlobalSearch() {
  const { candidates, jobs, interviews, offers } = useRecruitment((s) => s);
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<string[]>(["React AND (Senior OR Lead) NOT Manager", "TypeScript AND remote", "Designer AND Figma"]);

  const cs = useMemo(() => candidates.filter((c) => matchBoolean(`${c.name} ${c.email} ${c.skills.join(" ")} ${c.appliedPosition} ${c.location} ${c.tags.join(" ")}`, q)).slice(0, 12), [candidates, q]);
  const js = useMemo(() => jobs.filter((j) => matchBoolean(`${j.title} ${j.department} ${j.skills.join(" ")} ${j.location}`, q)).slice(0, 8), [jobs, q]);
  const is = useMemo(() => interviews.filter((i) => matchBoolean(`${i.candidateName} ${i.jobTitle} ${i.interviewer} ${i.round}`, q)).slice(0, 6), [interviews, q]);
  const os = useMemo(() => offers.filter((o) => matchBoolean(`${o.candidateName} ${o.jobTitle}`, q)).slice(0, 6), [offers, q]);

  return (
    <>
      <PageHeader title="Enterprise Search" description="Boolean queries across candidates, jobs, interviews, offers, referrals, vendors." />

      <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input placeholder='Try: React AND (Senior OR Lead) NOT Manager' value={q} onChange={(e) => setQ(e.target.value)} className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0" />
          <Button size="sm" variant="outline" onClick={() => q && setSaved((a) => [q, ...a.filter((x) => x !== q)].slice(0, 8))}><Save className="mr-1 h-3.5 w-3.5" />Save</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[11px] text-muted-foreground">Saved:</span>
          {saved.map((s) => (
            <button key={s} onClick={() => setQ(s)} className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-0.5 text-[11px] hover:bg-accent"><Bookmark className="h-3 w-3" />{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> Candidates <Badge variant="secondary">{cs.length}</Badge></div>
          <div className="space-y-1.5">
            {cs.map((c) => (
              <Link key={c.id} to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: c.id }} className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent/50">
                <CandidateAvatar name={c.name} size={26} />
                <div className="min-w-0 flex-1"><div className="truncate font-medium">{c.name}</div><div className="truncate text-[11px] text-muted-foreground">{c.appliedPosition} · {c.skills.slice(0, 3).join(", ")}</div></div>
                <Sparkles className="h-3 w-3 text-muted-foreground" /><span className="text-xs">{c.atsScore}</span>
              </Link>
            ))}
            {cs.length === 0 ? <div className="p-3 text-xs text-muted-foreground">No matches.</div> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><Briefcase className="h-4 w-4" /> Jobs <Badge variant="secondary">{js.length}</Badge></div>
          <div className="space-y-1.5">
            {js.map((j) => (
              <Link key={j.id} to="/dashboard/recruitment/jobs/$jobId" params={{ jobId: j.id }} className="block rounded-md p-2 text-sm hover:bg-accent/50">
                <div className="font-medium">{j.title}</div>
                <div className="text-[11px] text-muted-foreground">{j.department} · {j.workMode} · {j.skills.slice(0, 3).join(", ")}</div>
              </Link>
            ))}
            {js.length === 0 ? <div className="p-3 text-xs text-muted-foreground">No matches.</div> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><Calendar className="h-4 w-4" /> Interviews <Badge variant="secondary">{is.length}</Badge></div>
          <div className="space-y-1.5">
            {is.map((i) => (
              <div key={i.id} className="rounded-md p-2 text-sm hover:bg-accent/50">
                <div className="font-medium">{i.candidateName} — {i.round}</div>
                <div className="text-[11px] text-muted-foreground">{new Date(i.date).toLocaleString()} · {i.interviewer}</div>
              </div>
            ))}
            {is.length === 0 ? <div className="p-3 text-xs text-muted-foreground">No matches.</div> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4" /> Offers / <Gift className="h-4 w-4" /> Referrals <Badge variant="secondary">{os.length}</Badge></div>
          <div className="space-y-1.5">
            {os.map((o) => (
              <div key={o.id} className="rounded-md p-2 text-sm hover:bg-accent/50">
                <div className="font-medium">{o.candidateName}</div>
                <div className="text-[11px] text-muted-foreground">{o.jobTitle} · {o.status} · {new Intl.NumberFormat("en-US", { style: "currency", currency: o.currency, maximumFractionDigits: 0 }).format(o.salary)}</div>
              </div>
            ))}
            {os.length === 0 ? <div className="p-3 text-xs text-muted-foreground">No matches.</div> : null}
          </div>
        </section>
      </div>
    </>
  );
}
