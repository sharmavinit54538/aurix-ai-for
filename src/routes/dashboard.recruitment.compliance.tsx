import { createFileRoute } from "@tanstack/react-router";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, FileLock2, ShieldCheck, UserX } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRecruitment } from "@/lib/recruitment/store";

export const Route = createFileRoute("/dashboard/recruitment/compliance")({
  head: () => ({ meta: [{ title: "Compliance — Recruitment" }] }),
  component: Compliance,
});

const COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)"];

function Compliance() {
  const candidates = useRecruitment((s) => s.candidates);
  const genderSplit = [{ name: "Male", value: 48 }, { name: "Female", value: 41 }, { name: "Non-binary", value: 6 }, { name: "Undisclosed", value: 5 }];
  const ethnicity = [{ name: "Asian", value: 32 }, { name: "White", value: 38 }, { name: "Hispanic", value: 14 }, { name: "Black", value: 11 }, { name: "Other", value: 5 }];

  return (
    <>
      <PageHeader title="Compliance & Diversity" description="GDPR, EEO, OFCCP, consent, retention, and diversity tracking." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { k: "GDPR Consents", v: `${candidates.length}/${candidates.length}`, icon: ShieldCheck, color: "text-emerald-500" },
          { k: "EEO Self-ID Rate", v: "78%", icon: FileLock2, color: "text-sky-500" },
          { k: "Data Retention", v: "365d", icon: FileLock2, color: "text-violet-500" },
          { k: "Right-to-erasure", v: 3, icon: UserX, color: "text-amber-500" },
        ].map((s) => { const I = s.icon; return (
          <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{s.k}</span><I className={`h-4 w-4 ${s.color}`} /></div>
            <div className="mt-2 font-display text-2xl font-semibold">{s.v}</div>
          </div>
        );})}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 font-display text-base font-semibold">Diversity — Gender</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={genderSplit} dataKey="value" innerRadius={50} outerRadius={86} paddingAngle={3}>{genderSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 font-display text-base font-semibold">Diversity — Ethnicity (self-reported)</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ethnicity} dataKey="value" innerRadius={50} outerRadius={86} paddingAngle={3}>{ethnicity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 font-display text-base font-semibold">Privacy Controls</div>
          {[
            { k: "GDPR consent capture on application", v: true },
            { k: "EEO self-identification (US)", v: true },
            { k: "OFCCP veteran & disability questions", v: true },
            { k: "Anonymize candidate data after retention period", v: true },
            { k: "Blind review (hide name/photo for screening)", v: false },
            { k: "Auto-export DSAR (data subject access request)", v: true },
          ].map((s) => (
            <div key={s.k} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
              <span>{s.k}</span>
              <Switch defaultChecked={s.v} />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 font-display text-base font-semibold">Compliance Checklist</div>
          {[
            { k: "EEO-1 report generated (2026 Q1)", ok: true },
            { k: "GDPR DPA signed with vendors", ok: true },
            { k: "Data retention policy published", ok: true },
            { k: "CCPA opt-out link active", ok: true },
            { k: "Penetration test (annual)", ok: false },
            { k: "Background-check vendor SOC 2", ok: true },
          ].map((s) => (
            <div key={s.k} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
              <span className="inline-flex items-center gap-2">{s.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <CheckCircle2 className="h-4 w-4 text-muted-foreground/40" />}{s.k}</span>
              {s.ok ? <Badge variant="secondary" className="text-[10px]">Done</Badge> : <Button size="sm" variant="outline" className="h-7">Action</Button>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
