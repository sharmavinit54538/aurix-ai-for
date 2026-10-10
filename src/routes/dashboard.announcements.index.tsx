import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const AnnouncementsFeedPage = lazyFeaturePage(
  () => import("@/features/announcements/pages/AnnouncementsFeedPage"),
);

export const Route = createFileRoute("/dashboard/announcements/")({
  head: () => ({ meta: [{ title: "Company Announcements — OFC360" }] }),
  component: AnnouncementsFeedPage,
});
