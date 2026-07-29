import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoOrganizationPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoOrganizationPage"),
  "CeoOrganizationPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/organization")({
  head: () => ({ meta: [{ title: "Organization & Headcount — CEO Portal" }] }),
  component: CeoOrganizationPage,
});
