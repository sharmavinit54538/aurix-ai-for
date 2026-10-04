import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Megaphone,
  Search,
  SlidersHorizontal,
  RefreshCw,
  PlusCircle,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentRole } from "@/lib/roles";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { AnnouncementCard } from "../components/AnnouncementCard";
import { AnnouncementFormDialog } from "../components/AnnouncementFormDialog";

export default function AnnouncementsFeedPage() {
  const currentRole = useCurrentRole();
  const canManage = currentRole === "hr_admin" || currentRole === "super_admin";

  const [search, setSearch] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useAnnouncements();

  const allItems = data?.items ?? [];

  // Extract distinct audiences for filter dropdown
  const audienceOptions = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((a) => {
      if (a.targetAudience) set.add(a.targetAudience);
    });
    return Array.from(set);
  }, [allItems]);

  // Client-side filtering & sorting (pinned upar)
  const filteredAnnouncements = useMemo(() => {
    let list = [...allItems];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.content && a.content.toLowerCase().includes(q)) ||
          (a.summary && a.summary.toLowerCase().includes(q)),
      );
    }

    if (selectedAudience !== "all") {
      list = list.filter((a) => a.targetAudience === selectedAudience);
    }

    // Sort: Pinned first, then newest createdAt
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allItems, search, selectedAudience]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {canManage && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5"
          >
            <Link to="/dashboard/announcements/manage">
              <Settings className="h-4 w-4" />
              <span>Manage</span>
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="gap-1.5 shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Announcement</span>
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border rounded-lg p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements by title or content..."
            className="pl-9 bg-background border-border/80"
          />
        </div>

        {audienceOptions.length > 0 && (
          <div className="w-full sm:w-[220px]">
            <Select value={selectedAudience} onValueChange={setSelectedAudience}>
              <SelectTrigger className="w-full bg-background border-border/80">
                <div className="flex items-center gap-2 truncate">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Audiences" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                {audienceOptions.map((aud) => (
                  <SelectItem key={aud} value={aud}>
                    {aud}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Announcements Feed Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-5 space-y-3 bg-card">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <div className="pt-2 border-t flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="border border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-3 max-w-xl mx-auto">
          <div className="p-3 bg-destructive/10 text-destructive rounded-full w-fit mx-auto">
            <Megaphone className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-destructive">
            Failed to Load Announcements
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {error?.message ?? "An unexpected error occurred while contacting the server."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center space-y-3 bg-card/50">
          <div className="p-3 bg-muted rounded-full w-fit mx-auto text-muted-foreground">
            <Megaphone className="h-8 w-8" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No Announcements Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || selectedAudience !== "all"
              ? "No announcements matched your search or audience filters."
              : "There are currently no announcements broadcast to your team."}
          </p>
          {(search || selectedAudience !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedAudience("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      )}

      {/* Create Announcement Dialog for HR Admins */}
      {canManage && (
        <AnnouncementFormDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      )}
    </div>
  );
}
