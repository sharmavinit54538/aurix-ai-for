import { useState } from "react";
import { AtSign, Bell, CheckCheck, FileText, Mail, MessageSquare, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Kind = "mention" | "interview" | "offer" | "candidate" | "sla" | "email";
interface N { id: string; kind: Kind; title: string; detail: string; at: string; read: boolean }

const ICON: Record<Kind, any> = { mention: AtSign, interview: UserCheck, offer: FileText, candidate: Bell, sla: MessageSquare, email: Mail };

const seed: N[] = [];

export function RecruitmentNotificationsPage() {
  const [items, setItems] = useState<N[]>(seed);
  const [filter, setFilter] = useState<Kind | "all">("all");
  const list = items.filter((n) => filter === "all" || n.kind === filter);
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader title="Notification Center" description="Mentions, SLA alerts, candidate activity, hiring manager updates."
        actions={<Button variant="outline" onClick={() => setItems((a) => a.map((x) => ({ ...x, read: true })))} disabled={items.length === 0}><CheckCheck className="mr-2 h-4 w-4" />Mark all read</Button>} />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{unread} unread</Badge>
        {(["all", "mention", "interview", "offer", "candidate", "sla", "email"] as const).map((k) => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} className="h-7 text-[11px] capitalize" onClick={() => setFilter(k)}>{k}</Button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Bell className="h-5 w-5" />
          </div>
          <p className="font-medium">No notifications</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You're all caught up! Mentions and alert notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((n) => {
            const I = ICON[n.kind];
            return (
              <div key={n.id} onClick={() => setItems((a) => a.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition-colors ${n.read ? "bg-card/40" : "bg-accent/30"}`}>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent"><I className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="text-sm font-medium">{n.title}</span>{!n.read ? <span className="h-1.5 w-1.5 rounded-full bg-violet-500" /> : null}</div>
                  <div className="text-xs text-muted-foreground">{n.detail}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{n.at}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

