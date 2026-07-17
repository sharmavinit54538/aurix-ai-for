import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RequisitionsPage"),
  "RequisitionsPage",
);

export const Route = createFileRoute("/dashboard/recruitment/requisitions")({
  head: () => ({ meta: [{ title: "Requisitions — Recruitment" }] }),
  component: Page,
});
