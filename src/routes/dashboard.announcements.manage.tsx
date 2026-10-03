import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AnnouncementManagePage = lazyFeaturePage(
  () => import("@/features/announcements/pages/AnnouncementManagePage"),
);

export const Route = createFileRoute("/dashboard/announcements/manage")({
  head: () => ({ meta: [{ title: "Manage Announcements — OFC360" }] }),
  component: AnnouncementManagePage,
});
