import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AnnouncementDetailPage = lazyFeaturePage(
  () => import("@/features/announcements/pages/AnnouncementDetailPage"),
);

export const Route = createFileRoute("/dashboard/announcements/$id")({
  head: () => ({ meta: [{ title: "Announcement Detail — OFC360" }] }),
  component: AnnouncementDetailPage,
});
