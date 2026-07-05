import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, Bookmark, CalendarClock, Mail, MessageSquare, Phone, Plus, Send, Star, StickyNote, Users } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CandidateAvatar } from "@/components/recruitment/Bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRecruitment, recruitment } from "@/lib/recruitment/store";

export const Route = createFileRoute("/dashboard/recruitment/crm")({
  head: () => ({ meta: [{ title: "Candidate CRM — Recruitment" }] }),
  component: CRM,
});

type Channel = "email" | "call" | "sms" | "linkedin" | "note";
interface Touch { id: string; at: string; channel: Channel; subject: string; body: string; by: string }
interface FollowUp { id: string; candidateId: string; dueAt: string; note: string; done: boolean }

const seedTouches: Record<string, Touch[]> = {};
const seedFollowUps: FollowUp[] = [];
const seedWatch = new Set<string>();

function CRM() {
  const candidates = useRecruitment((s) => s.candidates) || [];
  const [activeId, setActiveId] = useState(candidates[0]?.id ?? "");
  const [touches, setTouches] = useState<Record<string, Touch[]>>(seedTouches);
  const [followUps, setFollowUps] = useState<FollowUp[]>(seedFollowUps);
  const [watch, setWatch] = useState<Set<string>>(seedWatch);
  const [channel, setChannel] = useState<Channel>("email");
  const [subj, setSubj] = useState("");
  const [body, setBody] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderNote, setReminderNote] = useState("");

  const active = candidates.find((c) => c.id === activeId);
  const list = useMemo(() => (active ? touches[active.id] ?? [] : []), [touches, active]);

  function log() {
    if (!active || !subj.trim()) return;
    const t: Touch = { id: `tch-${Date.now()}`, at: new Date().toISOString(), channel, subject: subj, body, by: "You" };
    setTouches((m) => ({ ...m, [active.id]: [t, ...(m[active.id] ?? [])] }));
    setSubj(""); setBody("");
  }
  function addFollow() {
    if (!active || !reminderDate) return;
    setFollowUps((arr) => [...arr, { id: `fu-${Date.now()}`, candidateId: active.id, dueAt: reminderDate, note: reminderNote, done: false }]);
    setReminderDate(""); setReminderNote("");
  }
  function toggleWatch(id: string) {
    setWatch((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function quickNote(text: string) {
    if (!active || !text.trim()) return;
    recruitment.addNote(active.id, text);
  }

  const ChannelIcon = { email: Mail, call: Phone, sms: MessageSquare, linkedin: Send, note: StickyNote }[channel];

  return (
    <>
      <PageHeader title="Candidate CRM" description="Communication timeline, notes, follow-ups, reminders, and watchlist." />
      
      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Users className="h-5 w-5" />
          </div>
          <p className="font-medium">No candidates available</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Register or import candidates to enable CRM outreach and follow-up tools.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_300px]">
          <aside className="space-y-1 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-xl">
            {candidates.slice(0, 40).map((c) => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-colors ${activeId === c.id ? "bg-accent" : "hover:bg-accent/50"}`}>
                <CandidateAvatar name={c.name} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{c.name}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{c.appliedPosition}</div>
                </div>
                <Bookmark className={`h-3.5 w-3.5 ${watch.has(c.id) ? "fill-foreground text-foreground" : "text-muted-foreground"}`} />
              </button>
            ))}
          </aside>

          <section className="space-y-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            {active ? (
              <>
                <div className="flex items-center gap-3">
                  <CandidateAvatar name={active.name} size={42} />
                  <div className="flex-1">
                    <div className="font-display text-lg font-semibold">{active.name}</div>
                    <div className="text-xs text-muted-foreground">{active.appliedPosition} · {active.email}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toggleWatch(active.id)}>
                    <Star className={`mr-1 h-3.5 w-3.5 ${watch.has(active.id) ? "fill-foreground" : ""}`} />
                    {watch.has(active.id) ? "Watching" : "Watch"}
                  </Button>
                </div>

                <div className="rounded-xl border border-border p-3">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {(["email", "call", "sms", "linkedin", "note"] as Channel[]).map((ch) => (
                      <Button key={ch} size="sm" variant={channel === ch ? "default" : "outline"} onClick={() => setChannel(ch)} className="h-7 text-[11px] capitalize">{ch}</Button>
                    ))}
                  </div>
                  <Input placeholder="Subject / summary" value={subj} onChange={(e) => setSubj(e.target.value)} className="mb-2" />
                  <Textarea placeholder="Message or notes…" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><ChannelIcon className="h-3 w-3" /> {channel}</span>
                    <Button size="sm" onClick={log}><Plus className="mr-1 h-3.5 w-3.5" />Log activity</Button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Communication Timeline</div>
                  <div className="space-y-2">
                    {list.length === 0 ? <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">No activities yet.</div> : list.map((t) => {
                      const Ic = { email: Mail, call: Phone, sms: MessageSquare, linkedin: Send, note: StickyNote }[t.channel];
                      return (
                        <div key={t.id} className="flex gap-3 rounded-lg border border-border bg-card/40 p-3">
                          <Ic className="h-4 w-4 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2"><span className="text-sm font-medium">{t.subject}</span><Badge variant="outline" className="text-[9px] capitalize">{t.channel}</Badge></div>
                            {t.body ? <div className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{t.body}</div> : null}
                            <div className="mt-1 text-[10px] text-muted-foreground">{new Date(t.at).toLocaleString()} · {t.by}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</div>
                  <div className="flex gap-2">
                    <Input placeholder="Add a quick note…" id="qn" onKeyDown={(e) => { if (e.key === "Enter") { quickNote((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }} />
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {active.notes && active.notes.slice(0, 5).map((n) => (
                      <div key={n.id} className="rounded-md border border-border bg-card/40 p-2 text-xs"><span className="font-medium">{n.author}</span> · <span className="text-muted-foreground">{new Date(n.at).toLocaleDateString()}</span><div>{n.text}</div></div>
                    ))}
                  </div>
                </div>
              </>
            ) : <div className="p-8 text-center text-sm text-muted-foreground">Select a candidate.</div>}
          </section>

          <aside className="space-y-3 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><CalendarClock className="h-3.5 w-3.5" /> Follow-ups</div>
              <Input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="mb-1.5" />
              <Input placeholder="Reminder note" value={reminderNote} onChange={(e) => setReminderNote(e.target.value)} className="mb-1.5" />
              <Button size="sm" className="w-full" onClick={addFollow}><Bell className="mr-1 h-3.5 w-3.5" />Schedule</Button>
              <div className="mt-3 space-y-1.5">
                {followUps.filter((f) => f.candidateId === activeId).map((f) => (
                  <label key={f.id} className="flex items-start gap-2 rounded-md border border-border p-2 text-xs">
                    <input type="checkbox" checked={f.done} onChange={() => setFollowUps((a) => a.map((x) => x.id === f.id ? { ...x, done: !x.done } : x))} />
                    <div className={`flex-1 ${f.done ? "line-through opacity-60" : ""}`}>
                      <div className="font-medium">{new Date(f.dueAt).toLocaleString()}</div>
                      <div className="text-muted-foreground">{f.note}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Star className="h-3.5 w-3.5" /> Watchlist</div>
              <div className="space-y-1.5">
                {[...watch].map((id) => {
                  const c = candidates.find((x) => x.id === id); if (!c) return null;
                  return <button key={id} onClick={() => setActiveId(id)} className="flex w-full items-center gap-2 rounded-md border border-border p-2 text-left text-xs hover:bg-accent/50"><CandidateAvatar name={c.name} size={24} /><span className="truncate">{c.name}</span></button>;
                })}
                {watch.size === 0 ? <div className="text-[11px] text-muted-foreground">Watch a candidate to pin them here.</div> : null}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
