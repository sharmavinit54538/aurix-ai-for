import { memo } from "react";
import type { LucideIcon } from "lucide-react";

export const SectionTitle = memo(function SectionTitle({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mb-3 mt-2 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
        <div className="font-display text-base font-semibold tracking-tight">{title}</div>
      </div>
    </div>
  );
});
