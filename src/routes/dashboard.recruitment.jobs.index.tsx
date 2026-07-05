import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Briefcase, Filter, LayoutGrid, List, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/recruitment/Bits";
import { useRecruitment } from "@/lib/recruitment/store";
import { fmtDate, fmtMoney } from "@/components/recruitment/Bits";
import { EmptyState } from "@/components/hrms/Shared";
import type { JobStatus } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/jobs/")({
  head: () => ({ meta: [{ title: "All Jobs — Recruitment" }] }),
  component: AllJobs,
});

const STATUSES: ("all" | JobStatus)[] = ["all", "active", "draft", "closed", "archived"];

function AllJobs() {
  const jobs = useRecruitment((s) => s.jobs);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | JobStatus>("all");
  const [dept, setDept] = useState<string>("all");

  const departments = useMemo(() => Array.from(new Set(jobs.map((j) => j.department))), [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (status !== "all" && j.status !== status) return false;
      if (dept !== "all" && j.department !== dept) return false;
      if (q && !`${j.title} ${j.department} ${j.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [jobs, q, status, dept]);

  return (
    <>
      <PageHeader
        title="All Jobs"
        description={`${filtered.length} of ${jobs.length} roles`}
        actions={
          <Button asChild><Link to="/dashboard/recruitment/jobs/new"><Plus className="mr-2 h-4 w-4" />New job</Link></Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs, skills…" className="h-9 pl-9" />
        </div>
        <Pill label="Status" options={STATUSES.map((s) => ({ value: s, label: s }))} value={status} onChange={(v) => setStatus(v as any)} />
        <Pill label="Department" options={[{ value: "all", label: "all" }, ...departments.map((d) => ({ value: d, label: d }))]} value={dept} onChange={setDept} />
        <div className="ml-auto inline-flex rounded-md border border-border bg-card/60 p-1">
          <button onClick={() => setView("grid")} className={`grid h-7 w-7 place-items-center rounded ${view === "grid" ? "bg-accent" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView("table")} className={`grid h-7 w-7 place-items-center rounded ${view === "table" ? "bg-accent" : ""}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No jobs match those filters" description="Try clearing filters or post a new role." icon={Briefcase} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Department</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium">Salary</th>
                <th className="px-4 py-2.5 font-medium">Applicants</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Closes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link to="/dashboard/recruitment/jobs/$jobId" params={{ jobId: j.id }} className="font-medium hover:underline">{j.title}</Link>
                    <div className="text-xs text-muted-foreground">{j.employmentType} · {j.workMode}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{j.department}</td>
                  <td className="px-4 py-3 text-muted-foreground">{j.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtMoney(j.salaryMin, j.currency)}–{fmtMoney(j.salaryMax, j.currency)}</td>
                  <td className="px-4 py-3">{j.applicants}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{j.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(j.closingAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Pill({ label, options, value, onChange }: { label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2 py-1">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-xs capitalize outline-none">
        {options.map((o) => <option key={o.value} value={o.value} className="bg-background capitalize">{o.label}</option>)}
      </select>
    </div>
  );
}
