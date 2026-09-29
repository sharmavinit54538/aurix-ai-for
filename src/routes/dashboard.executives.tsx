import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ExecutivesPage = lazyFeaturePage(
  () => import("@/features/admin/executives/pages/ExecutivesPage"),
  "ExecutivesPage",
);

export const Route = createFileRoute("/dashboard/executives")({
  head: () => ({ meta: [{ title: "Executive Leadership — OFC360" }] }),
  component: ExecutivesPage,
});
