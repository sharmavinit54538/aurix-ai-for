import { Link } from "@tanstack/react-router";
import type { PayrollModuleItem } from "../constants/modules";

interface ModuleCardProps {
  module: PayrollModuleItem;
  onClick?: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const Icon = module.icon;

  const content = (
    <div className="flex h-full items-start gap-4">
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color} shadow-xs transition-transform duration-300 group-hover:scale-105`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1 space-y-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
            {module.title}
          </h3>
          {module.badge ? (
            <span className="rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {module.badge}
            </span>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
          {module.description}
        </p>
      </div>
    </div>
  );

  const cardClasses =
    "group relative flex min-h-[116px] h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cardClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={module.to as any}
      className={cardClasses}
    >
      {content}
    </Link>
  );
}
