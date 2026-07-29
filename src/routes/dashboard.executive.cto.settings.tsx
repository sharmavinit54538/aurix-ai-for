import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoSettingsPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoSettingsPage"),
  "CtoSettingsPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/settings")({
  head: () => ({ meta: [{ title: "CTO Settings — Aurix CTO" }] }),
  component: CtoSettingsPage,
});
