import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Megaphone,
  PlusCircle,
  Search,
  ArrowLeft,
  RefreshCw,
  Send,
  Archive,
  Trash2,
  Edit,
  Pin,
  Calendar,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCurrentRole } from "@/lib/roles";
import type { Announcement } from "@/services/announcementsApi";
import {
  useAnnouncements,
  usePublishAnnouncement,
  useArchiveAnnouncement,
  useDeleteAnnouncement,
} from "../hooks/useAnnouncements";
import { AnnouncementFormDialog } from "../components/AnnouncementFormDialog";

export default function AnnouncementManagePage() {
  const currentRole = useCurrentRole();
  const isAuthorized = currentRole === "hr_admin" || currentRole === "super_admin";

  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Delete confirmation dialog state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useAnnouncements();

  const publishMutation = usePublishAnnouncement();
  const archiveMutation = useArchiveAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const allItems = data?.items ?? [];

  const filteredItems = useMemo(() => {
    let list = [...allItems];

    if (activeTab !== "all") {
      list = list.filter((a) => (a.status ?? "draft").toLowerCase() === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.content && a.content.toLowerCase().includes(q)) ||
          (a.targetAudience && a.targetAudience.toLowerCase().includes(q)),
      );
    }

    // Sort: pinned first, then newest
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allItems, activeTab, search]);

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success("Announcement published successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish announcement.";
      toast.error(msg);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveMutation.mutateAsync(id);
      toast.success("Announcement archived successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to archive announcement.";
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      toast.success("Announcement deleted successfully");
      setDeleteTargetId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete announcement.";
      toast.error(msg);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="p-4 bg-destructive/10 text-destructive rounded-full w-fit mx-auto">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground">
          You lack permission to manage organization announcements. This area is reserved for HR Administrators.
        </p>
        <Button asChild variant="outline">
          <Link to="/dashboard/announcements">View Public Feed</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2 text-muted-foreground">
              <Link to="/dashboard/announcements">
                <ArrowLeft className="h-4 w-4" />
                <span>Feed</span>
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Megaphone className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Manage Announcements
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Author, publish, edit, and archive company broadcasts and departmental alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setEditingAnnouncement(null);
              setFormDialogOpen(true);
            }}
            className="gap-1.5 shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Announcement</span>
          </Button>
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-lg p-3 shadow-xs">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-[380px]">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="published" className="text-xs">Published</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Drafts</TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manage queue..."
            className="pl-9 bg-background border-border/80"
          />
        </div>
      </div>

      {/* Manage Table/List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-card flex justify-between items-center">
              <div className="space-y-2 w-2/3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="border border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-3">
          <h3 className="text-base font-semibold text-destructive">Failed to Load Announcements</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {error?.message ?? "An error occurred while loading the announcements list."}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center space-y-3 bg-card/50">
          <p className="text-sm font-semibold text-foreground">No announcements in this view</p>
          <p className="text-xs text-muted-foreground">
            Create an announcement or select another status filter tab.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg bg-card overflow-hidden divide-y divide-border">
          {filteredItems.map((item) => {
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.isPinned && (
                      <Badge variant="default" className="text-[10px] gap-1 py-0 bg-primary/90">
                        <Pin className="h-2.5 w-2.5 fill-current rotate-45" />
                        <span>Pinned</span>
                      </Badge>
                    )}

                    <Badge
                      variant="outline"
                      className={`text-[10px] capitalize ${
                        item.status === "published"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : item.status === "archived"
                          ? "bg-muted text-muted-foreground"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}
                    >
                      {item.status ?? "draft"}
                    </Badge>

                    {item.priority && (
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {item.priority}
                      </Badge>
                    )}

                    {item.targetAudience && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{item.targetAudience}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-foreground truncate">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formattedDate}</span>
                    </span>
                    <span>•</span>
                    <span>By: {item.authorName ?? "HR Admin"}</span>
                  </div>
                </div>

                {/* Row Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status !== "published" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-emerald-500/30"
                      onClick={() => handlePublish(item.id)}
                      disabled={publishMutation.isPending}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Publish</span>
                    </Button>
                  )}

                  {item.status !== "archived" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleArchive(item.id)}
                      disabled={archiveMutation.isPending}
                      title="Archive"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => {
                      setEditingAnnouncement(item);
                      setFormDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTargetId(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <AnnouncementFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        announcement={editingAnnouncement}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The announcement will be permanently removed from the organization feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
