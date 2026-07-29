import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoOperationsPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoOperationsPage"),
  "CeoOperationsPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/operations")({
  head: () => ({ meta: [{ title: "Business Operations — CEO Portal" }] }),
  component: CeoOperationsPage,
});
