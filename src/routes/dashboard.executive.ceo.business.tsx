import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoBusinessPage"));

export const Route = createFileRoute("/dashboard/executive/ceo/business")({
  head: () => ({ meta: [{ title: "CEO Business — OFC360" }] }),
  component: PageComponent,
});
