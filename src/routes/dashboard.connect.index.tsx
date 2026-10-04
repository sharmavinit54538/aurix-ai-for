import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ConnectRootPage = lazyFeaturePage(
  () => import("@/features/connect/pages/ConnectRootPage"),
  "ConnectRootPage"
);

export const Route = createFileRoute("/dashboard/connect/")({
  head: () => ({ meta: [{ title: "Connect / Team Chat — OFC360" }] }),
  component: ConnectRootPage,
});
