import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ConnectChannelPage = lazyFeaturePage(
  () => import("@/features/connect/pages/ConnectChannelPage"),
  "ConnectChannelPage"
);

export const Route = createFileRoute("/dashboard/connect/channels/$channelId")({
  head: () => ({ meta: [{ title: "Channel Chat — OFC360 Connect" }] }),
  component: ConnectChannelPage,
});
