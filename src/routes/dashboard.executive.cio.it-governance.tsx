import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioItGovernancePage"));

export const Route = createFileRoute("/dashboard/executive/cio/it-governance")({
  head: () => ({ meta: [{ title: "IT Governance — OFC360" }] }),
  component: PageComponent,
});
