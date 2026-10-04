import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ExceptionsInboxPage = lazyFeaturePage(
  () => import("@/features/autopilot/pages/ExceptionsInboxPage"),
);

export const Route = createFileRoute("/dashboard/autopilot/exceptions")({
  head: () => ({
    meta: [
      { title: "Exceptions Inbox — Autopilot HR | OFC360" },
      { name: "description", content: "Review and resolve requests that could not be automated." },
    ],
  }),
  component: ExceptionsInboxPage,
});
