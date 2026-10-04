import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const MeetingRoomPage = lazyFeaturePage(
  () => import("@/features/connect/pages/MeetingRoomPage"),
  "MeetingRoomPage"
);

export const Route = createFileRoute("/dashboard/meetings/$meetingId")({
  head: () => ({ meta: [{ title: "Meeting Room — OFC360" }] }),
  component: MeetingRoomPage,
});
