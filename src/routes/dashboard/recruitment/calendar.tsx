import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentCalendarPage"),
  "RecruitmentCalendarPage",
);

export const Route = createFileRoute("/dashboard/recruitment/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Recruitment" }] }),
  component: Page,
});
