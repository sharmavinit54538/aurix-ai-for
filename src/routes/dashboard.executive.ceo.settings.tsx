import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoSettingsPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoSettingsPage"),
  "CeoSettingsPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/settings")({
  head: () => ({ meta: [{ title: "CEO Corporate Settings — CEO Portal" }] }),
  component: CeoSettingsPage,
});
