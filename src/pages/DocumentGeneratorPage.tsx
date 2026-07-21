import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FilePlus2, FileText, Download, Wand2, Briefcase, Award, AlertTriangle, LogOut, XCircle } from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const TEMPLATES = [
  { id: "offer", title: "Offer Letter", icon: FileText, tone: "from-sky-500/20 to-cyan-500/10" },
  { id: "appointment", title: "Appointment Letter", icon: Briefcase, tone: "from-violet-500/20 to-purple-500/10" },
  { id: "experience", title: "Experience Letter", icon: FileText, tone: "from-emerald-500/20 to-teal-500/10" },
  { id: "promotion", title: "Promotion Letter", icon: Award, tone: "from-amber-500/20 to-orange-500/10" },
  { id: "warning", title: "Warning Letter", icon: AlertTriangle, tone: "from-rose-500/20 to-red-500/10" },
  { id: "relieving", title: "Relieving Letter", icon: LogOut, tone: "from-indigo-500/20 to-blue-500/10" },
  { id: "termination", title: "Termination Letter", icon: XCircle, tone: "from-rose-500/20 to-red-500/10" },
];

export default function DocumentGeneratorPage() {
  const [selected, setSelected] = useState("offer");
  const [name, setName] = useState("Aanya Sharma");
  const [role, setRole] = useState("Senior Engineer");
  const [draft, setDraft] = useState<string | null>(null);
  function generate() {
    const t = TEMPLATES.find((x) => x.id === selected)!;
    setDraft(
`${t.title}

Dear ${name},

We are pleased to inform you regarding your ${t.title.toLowerCase()} as ${role} at Aurix Inc.
This letter confirms the terms and conditions of your engagement, effective from the joining date discussed.

Sincerely,
HR Team — Aurix Inc.`
    );
  }
  return (
    <div>
      <AIHero icon={FilePlus2} eyebrow="AI Document Generator" title="Draft HR documents in seconds" description="Generate offers, appointment, experience, promotion, warning, relieving and termination letters." lastAnalysis="30 min ago" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 text-sm font-semibold">Select template</div>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                const active = selected === t.id;
                return (
                  <button key={t.id} onClick={() => setSelected(t.id)} className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left text-sm transition-colors ${active ? "border-foreground/30 bg-accent" : "border-border bg-background/40 hover:bg-accent/60"}`}>
                    <span className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${t.tone} blur-2xl`} />
                    <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-accent"><Icon className="h-4 w-4" /></span>
                    <span className="relative font-medium">{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 text-sm font-semibold">Recipient</div>
            <div className="space-y-3">
              <div><Label className="text-xs">Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label className="text-xs">Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} /></div>
              <Button onClick={generate} className="w-full gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90"><Wand2 className="h-4 w-4" /> Generate with AI</Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex h-[560px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="text-sm font-semibold">Preview</div>
              <Button variant="outline" size="sm" disabled={!draft} className="gap-1.5"><Download className="h-3.5 w-3.5" /> Download</Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {draft ? (
                <pre className="whitespace-pre-wrap font-display text-sm leading-relaxed">{draft}</pre>
              ) : (
                <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                  <div>
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-accent"><FileText className="h-5 w-5" /></div>
                    Select a template and click <span className="font-medium text-foreground">Generate with AI</span> to draft a document.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


