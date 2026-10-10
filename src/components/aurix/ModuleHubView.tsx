import { Link } from "@tanstack/react-router";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { useCurrentRole } from "@/lib/use-current-role";
import type { LucideIcon } from "lucide-react";

export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color?: string;
  badge?: string;
  permission?: string;
}

export interface ModuleHubViewProps {
  eyebrow?: string;
  title?: string;
  description?: string;
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
  const authReady = useAuthReady();
  const currentRole = useCurrentRole();
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (!authReady) return false;
    // For now, we rely on the sidebar permission check which filters before rendering
    // This is a fallback for direct access
    return true;
  };

  const visibleModules = modules.filter((m) => hasPermission(m.permission));

  const hasHeader = Boolean(eyebrow || title || description || HeaderIcon);

  return (
    <div className="space-y-6">
      {hasHeader ? (
        <div className="mb-6 flex flex-col min-w-0 gap-2 text-left">
          {eyebrow ? (
            <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {eyebrow}
            </div>
          ) : null}
          <div className="flex min-w-0 items-center gap-3">
            {HeaderIcon ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <HeaderIcon className="h-5 w-5" />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              {title ? (
                <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Grid of Module Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleModules.map((m) => {
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
