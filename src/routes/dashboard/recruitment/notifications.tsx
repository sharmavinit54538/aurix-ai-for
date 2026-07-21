import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentNotificationsPage"),
  "RecruitmentNotificationsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Recruitment" }] }),
  component: Page,
});
