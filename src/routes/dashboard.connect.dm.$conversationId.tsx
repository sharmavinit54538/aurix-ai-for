import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ConnectDmPage = lazyFeaturePage(
  () => import("@/features/connect/pages/ConnectDmPage"),
  "ConnectDmPage"
);

export const Route = createFileRoute("/dashboard/connect/dm/$conversationId")({
  head: () => ({ meta: [{ title: "Direct Message — OFC360 Connect" }] }),
  component: ConnectDmPage,
});
