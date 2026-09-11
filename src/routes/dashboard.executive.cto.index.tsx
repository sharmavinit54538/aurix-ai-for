import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoPortalPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoPortalPage"),
  "CtoPortalPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/")({
  head: () => ({ meta: [{ title: "CTO Executive Control Center — OFC360" }] }),
  component: CtoPortalPage,
});
