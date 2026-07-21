import { Skeleton } from "@/components/ui/skeleton";

export function OnboardingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Progress Bar Skeleton */}
        <div className="rounded-2xl border border-border/40 bg-card/40 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-8 w-24 align-right" />
          </div>
          <Skeleton className="mt-4 h-2 w-full rounded-full" />
        </div>

        {/* Content Card Skeleton */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-8 backdrop-blur-xl shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-4 w-96" />
            </div>
            <hr className="border-border/40" />
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
