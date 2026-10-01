import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const NotificationsPage = lazyFeaturePage(() => import("@/pages/NotificationsPage"));

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — OFC360" }] }),
  component: NotificationsPage,
});
