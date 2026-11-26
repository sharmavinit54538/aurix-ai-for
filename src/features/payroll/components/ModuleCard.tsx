import { Link } from "@tanstack/react-router";
import type { PayrollModuleItem } from "../constants/modules";

interface ModuleCardProps {
  module: PayrollModuleItem;
  onClick?: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  const Icon = module.icon;

  const content = (
    <div className="flex items-start gap-3.5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {module.title}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {module.description}
        </p>
      </div>
    </div>
  );

  const cardClasses =
    "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left cursor-pointer";

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
