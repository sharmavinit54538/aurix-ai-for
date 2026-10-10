import React, { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  User,
  Globe,
  Pin,
  Edit,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentRole } from "@/lib/use-current-role";
import { useAnnouncement } from "../hooks/useAnnouncements";
import { AnnouncementFormDialog } from "../components/AnnouncementFormDialog";

export default function AnnouncementDetailPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const currentRole = useCurrentRole();
  const canManage = currentRole === "hr_admin" || currentRole === "super_admin";

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: announcement, isLoading, isError, error, refetch } = useAnnouncement(id);

  const formattedDate = announcement?.createdAt
    ? new Date(announcement.createdAt).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const formattedTime = announcement?.createdAt
    ? new Date(announcement.createdAt).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/dashboard/announcements">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Announcements</span>
          </Link>
        </Button>

        {canManage && announcement && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
            className="gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Announcement</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card className="p-8 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="pt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </Card>
      ) : isError ? (
        <Card className="border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <h2 className="text-lg font-semibold text-destructive">Announcement Not Available</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {error?.message ?? "Unable to load the requested announcement details."}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
            <Button size="sm" asChild variant="secondary">
              <Link to="/dashboard/announcements">Return to Feed</Link>
            </Button>
          </div>
        </Card>
      ) : !announcement ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p className="text-sm">Announcement not found.</p>
        </Card>
      ) : (
        <article className="space-y-6">
          <Card className="overflow-hidden border border-border/70 shadow-xs">
            <div className="p-6 sm:p-8 space-y-4">
              {/* Badges / Metadata */}
              <div className="flex flex-wrap items-center gap-2">
                {announcement.isPinned && (
                  <Badge variant="default" className="text-xs gap-1 bg-primary text-primary-foreground">
                    <Pin className="h-3 w-3 fill-current rotate-45" />
                    <span>PINNED</span>
                  </Badge>
                )}

                {announcement.status && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {announcement.status}
                  </Badge>
                )}

                {announcement.priority && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    Priority: {announcement.priority}
                  </Badge>
                )}

                {announcement.targetAudience && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Globe className="h-3 w-3" />
                    <span>{announcement.targetAudience}</span>
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {announcement.title}
              </h1>

              {/* Author & Timestamp */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-y border-border/40 py-3">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>{announcement.authorName ?? "Organization Executive Office"}</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                </span>

                {formattedTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formattedTime}</span>
                  </span>
                )}
              </div>

              {/* Summary / Description Lead if present */}
              {(announcement.description || announcement.summary) && (
                <div className="p-4 rounded-lg bg-muted/40 border-l-4 border-primary text-sm font-medium text-foreground leading-relaxed">
                  {announcement.description ?? announcement.summary}
                </div>
              )}

              {/* Main Content */}
              <CardContent className="px-0 pt-4 pb-2">
                {announcement.content ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90 font-normal">
                    {announcement.content}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No detailed content provided.</p>
                )}
              </CardContent>
            </div>
          </Card>
        </article>
      )}

      {/* Edit Dialog */}
      {canManage && announcement && (
        <AnnouncementFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          announcement={announcement}
        />
      )}
    </div>
  );
}
