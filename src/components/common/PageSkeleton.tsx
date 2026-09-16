import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-lg bg-muted/60" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md bg-muted/40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg bg-muted/50" />
          <Skeleton className="h-9 w-32 rounded-lg bg-primary/20" />
        </div>
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28 rounded bg-muted/50" />
              <Skeleton className="h-8 w-8 rounded-lg bg-muted/40" />
            </div>
            <Skeleton className="h-7 w-20 rounded bg-muted/70" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-14 rounded bg-emerald-500/20" />
              <Skeleton className="h-3 w-24 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left main card */}
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card/40 p-6 shadow-sm backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40 rounded bg-muted/60" />
            <Skeleton className="h-8 w-28 rounded-lg bg-muted/40" />
          </div>
          <div className="h-64 w-full rounded-lg bg-muted/20 flex items-end gap-3 p-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-1 bg-muted/40 rounded-t-md animate-pulse"
                style={{ height: `${25 + ((idx * 17) % 65)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-xl border border-border/60 bg-card/40 p-6 shadow-sm backdrop-blur-sm space-y-4">
          <Skeleton className="h-5 w-32 rounded bg-muted/60" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/10">
                <Skeleton className="h-9 w-9 rounded-full bg-muted/40 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <Skeleton className="h-3.5 w-full rounded bg-muted/50" />
                  <Skeleton className="h-2.5 w-20 rounded bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageSkeleton;
