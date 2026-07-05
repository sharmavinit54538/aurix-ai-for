import { useEffect, useRef, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { Search, Download, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StatCard({
  label, value, hint, icon: Icon, accent = "brand",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: any;
  accent?: "brand" | "success" | "warning" | "danger" | "muted";
}) {
  const accentClass = {
    brand: "from-violet-500/15 to-fuchsia-500/10 text-foreground",
    success: "from-emerald-500/15 to-teal-500/10 text-foreground",
    warning: "from-amber-500/15 to-orange-500/10 text-foreground",
    danger: "from-rose-500/15 to-red-500/10 text-foreground",
    muted: "from-muted to-muted/40 text-foreground",
  }[accent];
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${accentClass} p-4 backdrop-blur-xl shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
          {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
        </div>
        {Icon ? (
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-background/60 text-foreground/80 shadow-sm">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function StatusBadge({ status, tone }: { status: string; tone?: "success" | "warning" | "danger" | "info" | "muted" }) {
  const t = tone ?? "muted";
  const cls = {
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/20",
    danger: "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/20",
    info: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/20",
    muted: "bg-muted text-muted-foreground ring-border",
  }[t];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status.replace(/-/g, " ")}
    </span>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? "Search…"} className="h-9 pl-9" />
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-sm ${className}`}>{children}</div>;
}

export function EmptyState({ title, description, icon: Icon }: { title: string; description?: string; icon?: any }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      {Icon ? (
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
          <Icon className="h-4 w-4" />
        </div>
      ) : null}
      <h3 className="font-display text-base font-semibold">{title}</h3>
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function PrintButton({ label = "Export PDF" }: { label?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
      <Printer className="h-4 w-4" /> {label}
    </Button>
  );
}

export function CsvButton<T extends Record<string, any>>({ rows, filename, label = "Export CSV" }: { rows: T[]; filename: string; label?: string }) {
  function onClick() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="gap-2">
      <Download className="h-4 w-4" /> {label}
    </Button>
  );
}

export function QrTile({ value, size = 128, label }: { value: string; size?: number; label?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (ref.current) QRCode.toCanvas(ref.current, value, { width: size, margin: 1 }, () => {});
  }, [value, size]);
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3">
      <canvas ref={ref} />
      <div className="font-mono text-[11px] text-muted-foreground">{label ?? value}</div>
    </div>
  );
}

export function Progress({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gradient-brand)" }} />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function useDelayedReady(ms = 250) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}
