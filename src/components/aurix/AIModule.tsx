import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Download, Sparkles, type LucideIcon } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/aurix/DashboardShell";

export type AIKpi = {
  label: string;
  value: string | number;
  trend?: number;
  hint?: string;
  icon: LucideIcon;
  invert?: boolean;
};

export type AIFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  metric?: string;
  progress?: number;
  tone?: "ok" | "warn" | "crit" | "info";
};

export type AIRow = Record<string, string | number>;

export type AIChart = {
  type: "area" | "bar" | "line";
  title: string;
  description?: string;
  data: AIRow[];
  xKey: string;
  series: { key: string; label: string; color?: string }[];
};

const COLORS = ["oklch(0.68 0.2 290)", "oklch(0.72 0.18 320)", "oklch(0.7 0.16 200)", "oklch(0.78 0.18 70)"];

const toneStyles: Record<NonNullable<AIFeature["tone"]>, string> = {
  ok: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  crit: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
};

export function AIHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  lastAnalysis,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  lastAnalysis?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-brand-foreground shadow-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" /> {eyebrow}
              </Badge>
              {lastAnalysis ? (
                <span className="text-xs text-muted-foreground">Last analysis · {lastAnalysis}</span>
              ) : null}
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" className="gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90">
            <Sparkles className="h-3.5 w-3.5" /> Run AI Analysis
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function KpiGrid({ items }: { items: AIKpi[] }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((k, i) => {
        const Icon = k.icon;
        const up = (k.trend ?? 0) >= 0;
        const positive = k.invert ? !up : up;
        return (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-foreground">
                <Icon className="h-4 w-4" />
              </div>
              {k.trend !== undefined ? (
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                  {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(k.trend)}%
                </span>
              ) : null}
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
            <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
            {k.hint ? <div className="mt-2 text-xs text-muted-foreground/80">{k.hint}</div> : null}
          </motion.div>
        );
      })}
    </div>
  );
}

export function ChartCard({ chart }: { chart: AIChart }) {
  const { type, title, description, data, xKey, series } = chart;
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={s.key} id={`g-${title}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color ?? COLORS[i % COLORS.length]} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={s.color ?? COLORS[i % COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey={xKey} fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((s, i) => (
                <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color ?? COLORS[i % COLORS.length]} fill={`url(#g-${title}-${s.key})`} strokeWidth={2} />
              ))}
            </AreaChart>
          ) : type === "bar" ? (
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey={xKey} fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((s, i) => (
                <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color ?? COLORS[i % COLORS.length]} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey={xKey} fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((s, i) => (
                <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color ?? COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FeatureGrid({ features }: { features: AIFeature[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="group flex flex-col rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-colors hover:border-foreground/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl border ${f.tone ? toneStyles[f.tone] : "border-border bg-accent text-foreground"}`}>
                <Icon className="h-4 w-4" />
              </div>
              {f.metric ? <span className="text-sm font-semibold tracking-tight">{f.metric}</span> : null}
            </div>
            <h4 className="mt-4 font-display text-sm font-semibold tracking-tight">{f.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
            {f.progress !== undefined ? (
              <div className="mt-4">
                <Progress value={f.progress} className="h-1.5" />
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Performance</span><span>{f.progress}%</span>
                </div>
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}

export function SectionTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AIModulePage({
  icon, eyebrow, title, description, lastAnalysis,
  kpis, charts, features,
  children,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  lastAnalysis?: string;
  kpis?: AIKpi[];
  charts?: AIChart[];
  features?: AIFeature[];
  children?: React.ReactNode;
}) {
  return (
    <div>
      <AIHero icon={icon} eyebrow={eyebrow} title={title} description={description} lastAnalysis={lastAnalysis} />
      {kpis && kpis.length ? <KpiGrid items={kpis} /> : null}
      {charts && charts.length ? (
        <div className={`grid grid-cols-1 gap-4 ${charts.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {charts.map((c) => <ChartCard key={c.title} chart={c} />)}
        </div>
      ) : null}
      {features && features.length ? (
        <>
          <SectionTitle title="Capabilities" description="What this AI module can do for you." />
          <FeatureGrid features={features} />
        </>
      ) : null}
      {children}
    </div>
  );
}

// Avoid unused exports warning; PageHeader re-export for module pages
export { PageHeader };
