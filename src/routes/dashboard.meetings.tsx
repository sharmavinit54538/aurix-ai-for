import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/connect/pages/MeetingsPage"));

export const Route = createFileRoute("/dashboard/meetings")({
  head: () => ({ meta: [{ title: "Meetings — OFC360" }] }),
  component: PageComponent,
});
