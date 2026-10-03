import type {
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "@/services/announcementsApi";

export type {
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
};

export type AnnouncementFilterTab = "all" | "published" | "draft" | "archived";

export interface AnnouncementFeedFilters {
  tab: AnnouncementFilterTab;
  search: string;
  department: string;
}
