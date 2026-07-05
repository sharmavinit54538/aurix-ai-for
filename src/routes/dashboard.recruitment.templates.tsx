import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Mail, Plus, Sparkles, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/recruitment/templates")({
  head: () => ({ meta: [{ title: "Email Templates — Recruitment" }] }),
  component: Templates,
});

interface Template {
  id: string;
  name: string;
  category: "Outreach" | "Interview" | "Offer" | "Rejection" | "Onboarding";
  subject: string;
  body: string;
  usage: number;
}

const seed: Template[] = [];

const CAT_TONE: Record<Template["category"], string> = {
  Outreach: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  Interview: "bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300",
  Offer: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  Rejection: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
  Onboarding: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
};

function Templates() {
  const [items, setItems] = useState<Template[]>(seed);
  const [active, setActive] = useState<string>("");
  const current = items.find((t) => t.id === active) ?? items[0] ?? null;

  const update = (patch: Partial<Template>) => {
    if (!current) return;
    setItems((arr) => arr.map((t) => (t.id === current.id ? { ...t, ...patch } : t)));
  };

  function createTemplate() {
    const newId = `t_${Date.now()}`;
    const newT: Template = {
      id: newId,
      name: "New Email Template",
      category: "Outreach",
      subject: "Greetings {{candidate.first_name}}",
      body: "Hi {{candidate.first_name}},\n\n",
      usage: 0
    };
    setItems((arr) => [...arr, newT]);
    setActive(newId);
  }

  return (
    <>
      <PageHeader
        title="Email Templates"
        description="Reusable, branded messages used across the hiring pipeline."
        actions={
          <>
            <Button variant="outline"><Sparkles className="mr-2 h-4 w-4" />AI Draft</Button>
            <Button onClick={createTemplate}><Plus className="mr-2 h-4 w-4" />New Template</Button>
          </>
        }
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <p className="font-medium">No email templates available</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create standard message templates for outreach, interviews, and offers.
          </p>
          <Button onClick={createTemplate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {items.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all backdrop-blur-xl ${
                  current && current.id === t.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"
                }`}
              >
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">{t.name}</div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ring-1 ${CAT_TONE[t.category]}`}>{t.category}</span>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">{t.subject}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Used {t.usage} times</div>
                </div>
              </button>
            ))}
          </div>

          {current && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <Input value={current.name} onChange={(e) => update({ name: e.target.value })} className="max-w-md text-base font-semibold" />
                <div className="flex gap-1">
                  <Button size="sm" variant="outline"><Copy className="mr-1 h-3.5 w-3.5" />Duplicate</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setItems((arr) => arr.filter((t) => t.id !== current.id));
                      setActive("");
                    }}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />Delete
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Subject</label>
                  <Input value={current.subject} onChange={(e) => update({ subject: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Body</label>
                  <Textarea value={current.body} onChange={(e) => update({ body: e.target.value })} className="mt-1 min-h-[250px]" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
