import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color?: string;
  badge?: string;
}

export interface ModuleHubViewProps {
  eyebrow?: string;
  title: string;
  description: string;
  headerIcon?: LucideIcon;
  modules: ModuleItem[];
}

export function ModuleHubView({
  eyebrow,
  title,
  description,
  headerIcon: HeaderIcon,
  modules,
}: ModuleHubViewProps) {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {eyebrow && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-0.5 text-xs font-semibold text-brand-foreground">
                {HeaderIcon && <HeaderIcon className="h-3.5 w-3.5" />}
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Grid of Module Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const Icon = m.icon;
          const gradient =
            m.color ||
            "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30";
          return (
            <Link
              key={m.id}
              to={m.to as any}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:bg-accent/40"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${gradient} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {m.title}
                    </h3>
                    {m.badge && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
