import { Link } from "@tanstack/react-router";

import { useEffect, useMemo, useState } from "react";
import {
  Bell, Bookmark, BookmarkCheck, Calendar, ChevronRight,
  Clock, Inbox, Link2, Mail, MessageSquare, Phone,
  Plus, Search, StickyNote, Users, X,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CandidateAvatar, StageBadge } from "@/features/admin/recruitment/components/Bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { api } from "@/api";
import { toast } from "sonner";

type Channel = "email" | "call" | "sms" | "linkedin" | "note";

interface CrmNote {
  id: string;
  candidate_id: string;
  author_id: string;
  channel: string;
  subject: string | null;
  note_text: string;
  follow_up_date: string | null;
  created_at: string;
}

const CH: Record<Channel, { label: string; Icon: any; color: string; bg: string }> = {
  email:    { label: "Email",    Icon: Mail,          color: "text-sky-500",     bg: "bg-sky-500/10" },
  call:     { label: "Call",     Icon: Phone,         color: "text-emerald-500", bg: "bg-emerald-500/10" },
  sms:      { label: "SMS",      Icon: MessageSquare, color: "text-violet-500",  bg: "bg-violet-500/10" },
  linkedin: { label: "LinkedIn", Icon: Link2,         color: "text-blue-500",    bg: "bg-blue-500/10" },
  note:     { label: "Note",     Icon: StickyNote,    color: "text-amber-500",   bg: "bg-amber-500/10" },
};

function fmtTs(d: string) {
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function RecruitmentCRMPage() {
  const candidates = useRecruitment((s) => s.candidates);
  const [search, setSearch]   = useState("");
  const [activeId, setActiveId] = useState(candidates[0]?.id ?? "");
  const [watchSet, setWatchSet] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("crm.watch") ?? "[]")); }
    catch { return new Set(); }
  });
  const [filterWatch, setFilterWatch] = useState(false);

  // Form state
  const [channel, setChannel] = useState<Channel>("note");
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [followDate, setFollowDate] = useState("");
  const [saving, setSaving]   = useState(false);

  // Notes cache: candidateId -> CrmNote[]
  const [notes, setNotes]     = useState<Record<string, CrmNote[]>>({});
  const [loading, setLoading] = useState(false);

  const active = useMemo(() => candidates.find((c) => c.id === activeId), [candidates, activeId]);

  const filtered = useMemo(() => {
    let list = candidates;
    if (filterWatch) list = list.filter((c) => watchSet.has(c.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.appliedPosition.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 60);
  }, [candidates, search, filterWatch, watchSet]);

  // Load notes on candidate change
  useEffect(() => {
    if (!activeId || notes[activeId] !== undefined) return;
    setLoading(true);
    api.get<any>(`/crm/notes/${activeId}`)
      .then((res: any) => {
        const list: CrmNote[] = res?.data ?? [];
        setNotes((n) => ({ ...n, [activeId]: list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) }));
      })
      .catch(() => setNotes((n) => ({ ...n, [activeId]: [] })))
      .finally(() => setLoading(false));
  }, [activeId]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem("crm.watch", JSON.stringify([...watchSet]));
  }, [watchSet]);

  function toggleWatch(id: string) {
    setWatchSet((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function logActivity() {
    if (!active || !body.trim()) return;
    setSaving(true);
    try {
      const res: any = await api.post<any>("/crm/notes", {
        candidate_id: active.id,
        channel,
        subject: subject.trim() || null,
        note_text: body.trim(),
        follow_up_date: followDate || null,
      });
      const n: CrmNote = res?.data;
      if (n) setNotes((m) => ({ ...m, [active.id]: [n, ...(m[active.id] ?? [])] }));
      setSubject(""); setBody(""); setFollowDate("");
      toast.success("Activity logged");
    } catch {
      toast.error("Failed to log activity");
    } finally {
      setSaving(false);
    }
  }

  // Group notes by date
  const grouped = useMemo(() => {
    const list = notes[activeId] ?? [];
    const g: Record<string, CrmNote[]> = {};
    for (const n of list) {
      const day = new Date(n.created_at).toDateString();
      (g[day] ??= []).push(n);
    }
    return Object.entries(g);
  }, [notes, activeId]);

  // Upcoming follow-ups across all loaded candidates
  const followUps = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return Object.entries(notes).flatMap(([cid, arr]) => {
      const cand = candidates.find((c) => c.id === cid);
      if (!cand) return [];
      return arr
        .filter((n) => n.follow_up_date)
        .map((n) => ({ n, cand }));
    }).sort((a, b) => (a.n.follow_up_date ?? "").localeCompare(b.n.follow_up_date ?? ""));
  }, [notes, candidates]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader
        title="Candidate CRM"
        description="Track every touchpoint, log outreach activities, and manage follow-ups."
      />

      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center">
          <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-semibold">No candidates yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">Add candidates to your pipeline to start tracking CRM outreach.</p>
          <Button asChild className="mt-4" size="sm"><Link to="/dashboard/recruitment/candidates">Go to Candidates</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_280px]">

          {/* ── LEFT: candidate list ── */}
          <aside className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
              </div>
              <Button size="sm" variant={filterWatch ? "default" : "outline"} className="h-9 px-3" onClick={() => setFilterWatch((v) => !v)} title="Watchlist">
                <Bookmark className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-border bg-card/60 py-2 px-3">
                <div className="font-semibold">{candidates.length}</div>
                <div className="text-[10px] text-muted-foreground">Candidates</div>
              </div>
              <div className="rounded-xl border border-border bg-card/60 py-2 px-3">
                <div className="font-semibold">{watchSet.size}</div>
                <div className="text-[10px] text-muted-foreground">Watching</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden">
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto divide-y divide-border/40">
                {filtered.length === 0
                  ? <div className="p-4 text-center text-xs text-muted-foreground">No results.</div>
                  : filtered.map((c) => {
                    const isActive = c.id === activeId;
                    const watched  = watchSet.has(c.id);
                    const cnt      = notes[c.id]?.length ?? 0;
                    return (
                      <button key={c.id} onClick={() => setActiveId(c.id)}
                        className={`group flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/40"}`}>
                        <CandidateAvatar name={c.name} size={30} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-medium">{c.name}</span>
                            {watched && <Bookmark className="h-2.5 w-2.5 fill-foreground shrink-0" />}
                          </div>
                          <div className="truncate text-[10px] text-muted-foreground">{c.appliedPosition}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StageBadge stage={c.stage} />
                          {cnt > 0 && <span className="text-[9px] text-muted-foreground">{cnt} notes</span>}
                        </div>
                      </button>
                    );
                  })
                }
              </div>
            </div>
          </aside>

          {/* ── CENTER: activity feed ── */}
          <section className="flex flex-col gap-4 min-w-0">
            {active ? (
              <>
                {/* Candidate card */}
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-4 backdrop-blur-xl">
                  <CandidateAvatar name={active.name} size={52} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg font-semibold">{active.name}</div>
                    <div className="text-xs text-muted-foreground">{active.appliedPosition} · {active.email}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <StageBadge stage={active.stage} />
                      {active.skills.slice(0, 4).map((s) => <Badge key={s} variant="outline" className="text-[9px]">{s}</Badge>)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <Button size="sm" variant={watchSet.has(active.id) ? "default" : "outline"} onClick={() => toggleWatch(active.id)} className="h-8 gap-1.5">
                      {watchSet.has(active.id)
                        ? <><BookmarkCheck className="h-3.5 w-3.5" />Watching</>
                        : <><Bookmark className="h-3.5 w-3.5" />Watch</>}
                    </Button>
                    <Button size="sm" variant="outline" asChild className="h-8 gap-1">
                      <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: active.id }}>
                        Profile <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Log form */}
                <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
                  <div className="mb-3 text-sm font-semibold">Log Activity</div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {(Object.keys(CH) as Channel[]).map((ch) => {
                      const { label, Icon, color } = CH[ch];
                      const sel = channel === ch;
                      return (
                        <button key={ch} onClick={() => setChannel(ch)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${sel ? "border-transparent bg-foreground text-background shadow" : "border-border bg-background/40 hover:bg-accent/60"}`}>
                          <Icon className={`h-3.5 w-3.5 ${sel ? "" : color}`} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <Input placeholder="Subject / summary (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} className="mb-2 h-9 text-sm" />
                  <Textarea placeholder={`${CH[channel].label} notes…`} rows={3} value={body} onChange={(e) => setBody(e.target.value)} className="text-sm resize-none" />
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 flex-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <Input type="date" value={followDate} onChange={(e) => setFollowDate(e.target.value)} className="h-8 text-xs flex-1" title="Follow-up date (optional)" />
                    </div>
                    <Button size="sm" onClick={logActivity} disabled={!body.trim() || saving} className="h-8 gap-1.5">
                      {saving
                        ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        : <Plus className="h-3.5 w-3.5" />}
                      Log
                    </Button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold">Communication Timeline</div>
                    <span className="text-[10px] text-muted-foreground">{notes[activeId]?.length ?? 0} activities</span>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading…
                    </div>
                  ) : grouped.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                      <Inbox className="mb-2 h-6 w-6 opacity-40" />
                      No activities yet.
                      <span className="mt-0.5 text-[10px]">Use the form above to log the first touchpoint.</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {grouped.map(([day, dayNotes]) => (
                        <div key={day}>
                          <div className="mb-2 flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {new Date(day).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                          <div className="space-y-2">
                            {dayNotes.map((n) => {
                              const ch = (n.channel in CH ? n.channel : "note") as Channel;
                              const { Icon, color, bg, label } = CH[ch];
                              return (
                                <div key={n.id} className="flex gap-3 rounded-xl border border-border bg-background/40 p-3">
                                  <div className={`mt-0.5 shrink-0 grid h-7 w-7 place-items-center rounded-lg ${bg}`}>
                                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-sm font-medium">{n.subject || label}</span>
                                      <Badge variant="outline" className="text-[9px] capitalize">{label}</Badge>
                                      {n.follow_up_date && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-medium text-amber-600 dark:text-amber-400">
                                          <Bell className="h-2.5 w-2.5" />Follow-up: {fmtDate(n.follow_up_date)}
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{n.note_text}</p>
                                    <div className="mt-1.5 text-[10px] text-muted-foreground/60">
                                      <Clock className="mr-1 inline h-2.5 w-2.5" />{fmtTs(n.created_at)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center text-sm text-muted-foreground">
                <Users className="mb-3 h-8 w-8 opacity-30" />
                Select a candidate to view their CRM timeline.
              </div>
            )}
          </section>

          {/* ── RIGHT: follow-ups + watchlist ── */}
          <aside className="flex flex-col gap-4">
            {/* Follow-ups */}
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">Follow-ups</span>
                {followUps.length > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">{followUps.length}</span>
                )}
              </div>
              {followUps.length === 0 ? (
                <div className="py-4 text-center text-[11px] text-muted-foreground">
                  No follow-ups yet.<br />
                  <span className="text-[10px]">Set a follow-up date when logging an activity.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {followUps.map(({ n, cand }) => {
                    const ch = (n.channel in CH ? n.channel : "note") as Channel;
                    const { Icon, color } = CH[ch];
                    const isToday   = n.follow_up_date === today;
                    const isOverdue = n.follow_up_date! < today;
                    return (
                      <button key={n.id} onClick={() => setActiveId(cand.id)}
                        className="flex w-full items-start gap-2.5 rounded-xl border border-border bg-background/40 p-2.5 text-left hover:bg-accent/50 transition-colors">
                        <CandidateAvatar name={cand.name} size={26} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-medium">{cand.name}</span>
                            <Icon className={`h-3 w-3 shrink-0 ${color}`} />
                          </div>
                          <div className="truncate text-[10px] text-muted-foreground">{n.subject || n.note_text.slice(0, 35)}</div>
                          <div className={`mt-0.5 text-[10px] font-medium ${isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-muted-foreground"}`}>
                            {isOverdue ? "⚠ Overdue · " : isToday ? "📅 Today · " : ""}{fmtDate(n.follow_up_date!)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Watchlist */}
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-semibold">Watchlist</span>
                {watchSet.size > 0 && (
                  <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-500">{watchSet.size}</span>
                )}
              </div>
              {watchSet.size === 0 ? (
                <div className="py-4 text-center text-[11px] text-muted-foreground">
                  No candidates on watchlist.<br />
                  <span className="text-[10px]">Click Watch on a candidate to pin them here.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {[...watchSet].map((id) => {
                    const c = candidates.find((x) => x.id === id);
                    if (!c) return null;
                    const cnt = notes[id]?.length ?? 0;
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <button onClick={() => setActiveId(id)}
                          className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background/40 p-2 text-left text-xs hover:bg-accent/50 transition-colors min-w-0">
                          <CandidateAvatar name={c.name} size={24} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{c.name}</div>
                            <div className="text-[10px] text-muted-foreground">{cnt} activities</div>
                          </div>
                        </button>
                        <button onClick={() => toggleWatch(id)}
                          className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors"
                          title="Remove">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Activity summary for active candidate */}
            {active && (notes[active.id]?.length ?? 0) > 0 && (
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
                <div className="mb-3 text-sm font-semibold">Activity Breakdown</div>
                <div className="space-y-1.5">
                  {(Object.keys(CH) as Channel[]).map((ch) => {
                    const count = (notes[active.id] ?? []).filter((n) => n.channel === ch).length;
                    if (count === 0) return null;
                    const { Icon, color, label } = CH[ch];
                    return (
                      <div key={ch} className="flex items-center justify-between text-xs">
                        <span className={`inline-flex items-center gap-1.5 ${color}`}>
                          <Icon className="h-3.5 w-3.5" />{label}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 font-medium tabular-nums">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}


