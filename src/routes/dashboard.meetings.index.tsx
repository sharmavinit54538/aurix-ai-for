import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const MeetingsPage = lazyFeaturePage(
  () => import("@/features/connect/pages/MeetingsPage"),
  "MeetingsPage"
);

export const Route = createFileRoute("/dashboard/meetings/")({
  head: () => ({ meta: [{ title: "Meetings & Rooms — OFC360" }] }),
  component: MeetingsPage,
});
