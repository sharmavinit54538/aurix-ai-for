import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioCyberSecurityPage"));

export const Route = createFileRoute("/dashboard/executive/cio/cyber-security")({
  head: () => ({ meta: [{ title: "Cyber Security — OFC360" }] }),
  component: PageComponent,
});
