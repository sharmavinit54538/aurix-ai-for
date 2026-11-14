import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/ScorecardsPage"));

export const Route = createFileRoute("/dashboard/recruitment/scorecards")({
  head: () => ({ meta: [{ title: "Interview Scorecards — OFC360" }] }),
  component: PageComponent,
});
