import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioItGovernancePage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioItGovernancePage"),
  "CioItGovernancePage"
);

export const Route = createFileRoute("/dashboard/executive/cio/it-governance")({
  head: () => ({ meta: [{ title: "IT Governance — CIO Portal" }] }),
  component: CioItGovernancePage,
});
