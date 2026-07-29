import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioSettingsPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioSettingsPage"),
  "CioSettingsPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/settings")({
  head: () => ({ meta: [{ title: "Enterprise IT Settings — CIO Portal" }] }),
  component: CioSettingsPage,
});
