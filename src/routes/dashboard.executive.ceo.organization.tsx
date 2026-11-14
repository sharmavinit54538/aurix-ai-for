import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoOrganizationPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/organization")({
  head: () => ({ meta: [{ title: "CEO Organization — OFC360" }] }),
  component: PageComponent,
});
