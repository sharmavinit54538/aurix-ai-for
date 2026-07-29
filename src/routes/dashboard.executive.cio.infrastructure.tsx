import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioInfrastructurePage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioInfrastructurePage"),
  "CioInfrastructurePage"
);

export const Route = createFileRoute("/dashboard/executive/cio/infrastructure")({
  head: () => ({ meta: [{ title: "Infrastructure — CIO Portal" }] }),
  component: CioInfrastructurePage,
});
