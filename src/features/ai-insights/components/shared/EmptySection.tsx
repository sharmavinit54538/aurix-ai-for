import { memo } from "react";
import { Inbox } from "lucide-react";

export const EmptySection = memo(function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-6 text-center text-muted-foreground">
      <Inbox className="mb-2 h-6 w-6 stroke-1 text-muted-foreground/60" />
      <div className="text-xs font-medium">{message}</div>
    </div>
  );
});
