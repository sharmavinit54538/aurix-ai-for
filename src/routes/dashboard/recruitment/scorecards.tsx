import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/ScorecardsPage"),
  "ScorecardsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/scorecards")({
  head: () => ({ meta: [{ title: "Scorecards — Recruitment" }] }),
  component: Page,
});
