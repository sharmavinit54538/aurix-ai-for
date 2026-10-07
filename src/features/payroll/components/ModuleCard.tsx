import { Link } from "@tanstack/react-router";
import type { PayrollModuleItem } from "../constants/modules";

interface ModuleCardProps {
  module: PayrollModuleItem;
  onClick?: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const Icon = module.icon;

  const content = (
    <div className="flex items-start gap-4">
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
          {module.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-normal">
          {module.description}
        </p>
      </div>
    </div>
  );

  const cardClasses =
    "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer";

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
