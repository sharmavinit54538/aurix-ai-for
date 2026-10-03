import React from "react";
import { Link } from "@tanstack/react-router";
import { Megaphone, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnnouncements } from "../hooks/useAnnouncements";

export function LatestAnnouncementsWidget() {
  const { data, isLoading, isError, error, refetch } = useAnnouncements({ limit: 4 });

  const items = data?.items ?? [];

  return (
    <Card className="h-full border border-border/60 shadow-xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
            <Megaphone className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-semibold tracking-tight">
            Latest Announcements
          </CardTitle>
        </div>

        <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary gap-1 px-2">
          <Link to="/dashboard/announcements">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3 py-1">
            <div className="space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-center my-1">
            <AlertCircle className="h-4 w-4 text-destructive mx-auto mb-1.5" />
            <p className="text-xs text-destructive font-medium line-clamp-2">
              {error?.message ?? "Unable to load announcements"}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 h-7 text-xs gap-1"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-xs">No active announcements</p>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              Official company updates will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {items.slice(0, 4).map((ann) => {
              const dateStr = ann.createdAt
                ? new Date(ann.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "—";

              return (
                <Link
                  key={ann.id}
                  to="/dashboard/announcements/$id"
                  params={{ id: ann.id }}
                  className="block py-2.5 group transition-colors hover:bg-muted/40 rounded-sm -mx-1 px-1"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {ann.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground shrink-0">{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ann.isPinned && (
                      <Badge variant="outline" className="text-[9px] py-0 px-1 bg-primary/10 text-primary border-primary/20">
                        Pinned
                      </Badge>
                    )}
                    {ann.targetAudience && (
                      <span className="text-[10px] text-muted-foreground line-clamp-1">
                        {ann.targetAudience}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
