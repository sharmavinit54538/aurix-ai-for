import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CeoBusinessPage = lazyFeaturePage(
  () => import("@/features/ceo/pages/CeoBusinessPage"),
  "CeoBusinessPage"
);

export const Route = createFileRoute("/dashboard/executive/ceo/business")({
  head: () => ({ meta: [{ title: "Business Strategy — CEO Portal" }] }),
  component: CeoBusinessPage,
});
