import type {
  Announcement,
  AnnouncementDetail,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementPriority,
  AnnouncementStatus,
  AnnouncementVisibility,
} from "@/services/announcementsApi";

export type {
  Announcement,
  AnnouncementDetail,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementPriority,
  AnnouncementStatus,
  AnnouncementVisibility,
};

export type AnnouncementFilterTab = "all" | "published" | "draft" | "archived";

export interface AnnouncementFeedFilters {
  tab: AnnouncementFilterTab;
  search: string;
  department: string;
}