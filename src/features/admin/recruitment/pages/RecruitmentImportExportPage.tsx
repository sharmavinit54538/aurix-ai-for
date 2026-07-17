import { useState } from "react";
import Papa from "papaparse";
import { CheckCircle2, Download, FileSpreadsheet, FileText, Upload } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";

const REQUIRED = ["name", "email", "appliedPosition"];
const OPTIONAL = ["phone", "location", "source", "skills", "yearsExperience"];

export function RecruitmentImportExportPage() {
  const candidates = useRecruitment((s) => s.candidates);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  function onFile(file: File) {
    Papa.parse<Record<string, string>>(file, {
      header: true, skipEmptyLines: true,
      complete: (res) => {
        setRows(res.data);
        const headers = res.meta.fields ?? [];
        const auto: Record<string, string> = {};
        [...REQUIRED, ...OPTIONAL].forEach((f) => {
          const m = headers.find((h) => h.toLowerCase().replace(/[^a-z]/g, "") === f.toLowerCase().replace(/[^a-z]/g, ""));
          if (m) auto[f] = m;
        });
        setMapping(auto);
        setStep(2);
      },
    });
  }

  function exportCsv() {
    const csv = Papa.unparse(candidates.map((c) => ({ id: c.id, name: c.name, email: c.email, phone: c.phone, position: c.appliedPosition, stage: c.stage, ats: c.atsScore, skills: c.skills.join("|"), source: c.source })));
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `candidates-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  function exportJson() {
    const blob = new Blob([JSON.stringify(candidates, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `candidates-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Import & Export" description="Bulk move candidates in and out of Aurix — CSV, Excel, JSON." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 inline-flex items-center gap-2 font-display text-base font-semibold"><Upload className="h-4 w-4" /> Candidate Import Wizard</div>

          <ol className="mb-3 flex items-center gap-2 text-[11px]">
            {["Upload CSV", "Map fields", "Review & import"].map((s, i) => (
              <li key={s} className={`inline-flex items-center gap-1 ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${step >= i + 1 ? "bg-foreground text-background" : "bg-accent"}`}>{i + 1}</span>{s}
                {i < 2 ? <span className="mx-1 text-muted-foreground">›</span> : null}
              </li>
            ))}
          </ol>

          {step === 1 && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-sm text-muted-foreground hover:bg-accent/30">
              <Upload className="mb-2 h-6 w-6" />
              <span>Drop CSV here or click to upload</span>
              <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Parsed {rows.length} rows. Map your columns:</div>
              {[...REQUIRED, ...OPTIONAL].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="w-40 text-xs"><span className="font-medium">{f}</span>{REQUIRED.includes(f) ? <span className="text-rose-500"> *</span> : null}</span>
                  <select className="flex-1 rounded-md border border-border bg-background p-1.5 text-xs" value={mapping[f] ?? ""} onChange={(e) => setMapping((m) => ({ ...m, [f]: e.target.value }))}>
                    <option value="">— Skip —</option>
                    {Object.keys(rows[0] ?? {}).map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
              <div className="mt-3 flex justify-end gap-2"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)} disabled={REQUIRED.some((f) => !mapping[f])}>Continue</Button></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Ready to import {rows.length} candidates.</div>
              <div className="max-h-56 overflow-auto rounded-lg border border-border text-xs">
                <table className="w-full">
                  <thead className="bg-muted/40"><tr>{REQUIRED.map((f) => <th key={f} className="px-2 py-1 text-left">{f}</th>)}</tr></thead>
                  <tbody>{rows.slice(0, 8).map((r, i) => <tr key={i} className="border-t border-border">{REQUIRED.map((f) => <td key={f} className="px-2 py-1">{r[mapping[f]] || "—"}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-end gap-2"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={() => { setStep(1); setRows([]); setMapping({}); }}>Import {rows.length} candidates</Button></div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 inline-flex items-center gap-2 font-display text-base font-semibold"><Download className="h-4 w-4" /> Export</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><div className="inline-flex items-center gap-2 text-sm"><FileSpreadsheet className="h-4 w-4 text-emerald-500" />Candidates CSV<Badge variant="secondary">{candidates.length}</Badge></div><Button size="sm" onClick={exportCsv}>Download</Button></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><div className="inline-flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-sky-500" />Candidates JSON</div><Button size="sm" variant="outline" onClick={exportJson}>Download</Button></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><div className="inline-flex items-center gap-2 text-sm"><FileSpreadsheet className="h-4 w-4 text-violet-500" />Excel report (.xlsx)</div><Button size="sm" variant="outline" disabled>Coming soon</Button></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><div className="inline-flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-rose-500" />Hiring summary PDF</div><Button size="sm" variant="outline" disabled>Coming soon</Button></div>
          </div>

          <div className="mt-4 rounded-xl border border-border p-3">
            <div className="mb-2 text-sm font-semibold">Bulk Actions</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["Bulk Email", "Move Stage", "Add Tags", "Archive", "Reject", "Assign Recruiter"].map((b) => (
                <Button key={b} variant="outline" size="sm" className="justify-start"><span className="truncate">{b}</span></Button>
              ))}
            </div>
            <Input className="mt-2" placeholder="Paste candidate IDs (comma-separated) for bulk action" />
          </div>
        </div>
      </div>
    </>
  );
}

