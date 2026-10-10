import React from "react";
import { Link } from "@tanstack/react-router";
import { Pin, Calendar, User, Eye, Edit, Trash2, Send, Archive, Globe } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Announcement } from "@/services/announcementsApi";

interface AnnouncementCardProps {
  announcement: Announcement;
  isManageMode?: boolean;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function AnnouncementCard({
  announcement,
  isManageMode = false,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
}: AnnouncementCardProps) {
  const formattedDate = announcement.createdAt
    ? new Date(announcement.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const statusColor: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    draft: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    archived: "bg-muted text-muted-foreground border-border",
  };

  const priorityColor: Record<string, string> = {
    urgent: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    high: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    normal: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    low: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-md border ${
        announcement.isPinned
          ? "border-primary/40 bg-gradient-to-br from-primary/[0.03] to-transparent shadow-sm"
          : "border-border/60 hover:border-border"
      }`}
    >
      {announcement.isPinned && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary/90 text-primary-foreground text-[10px] font-semibold px-2.5 py-0.5 rounded-bl-md flex items-center gap-1 shadow-sm">
            <Pin className="h-3 w-3 fill-current rotate-45" />
            <span>PINNED</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        <div className="flex flex-wrap items-center gap-2 pr-16 mb-2">
          {announcement.status && (
            <Badge
              variant="outline"
              className={`text-[11px] capitalize ${statusColor[announcement.status.toLowerCase()] ?? ""}`}
            >
              {announcement.status}
            </Badge>
          )}

          {announcement.priority && (
            <Badge
              variant="outline"
              className={`text-[11px] capitalize ${priorityColor[announcement.priority.toLowerCase()] ?? ""}`}
            >
              {announcement.priority}
            </Badge>
          )}

          {announcement.targetAudience && (
            <Badge variant="secondary" className="text-[11px] flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{announcement.targetAudience}</span>
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-foreground line-clamp-2">
          {announcement.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-4">
        {announcement.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {announcement.description}
          </p>
        ) : announcement.summary ? (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {announcement.summary}
          </p>
        ) : announcement.content ? (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">No description provided.</p>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{announcement.authorName ?? "Organization"}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isManageMode ? (
            <>
              {announcement.status !== "published" && onPublish && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  onClick={() => onPublish(announcement.id)}
                  title="Publish Announcement"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publish</span>
                </Button>
              )}

              {announcement.status !== "archived" && onArchive && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onArchive(announcement.id)}
                  title="Archive Announcement"
                >
                  <Archive className="h-3.5 w-3.5" />
                </Button>
              )}

              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1"
                  onClick={() => onEdit(announcement)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
              )}

              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(announcement.id)}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          ) : (
            <Button size="sm" variant="ghost" asChild className="h-8 text-xs gap-1 text-primary">
              <Link to="/dashboard/announcements/$id" params={{ id: announcement.id }}>
                <span>Read More</span>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
