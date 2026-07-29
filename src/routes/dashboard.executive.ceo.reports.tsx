import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoReportsPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoReportsPage"),
  "CeoReportsPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/reports")({
  head: () => ({ meta: [{ title: "Executive Reports — CEO Portal" }] }),
  component: CeoReportsPage,
});
