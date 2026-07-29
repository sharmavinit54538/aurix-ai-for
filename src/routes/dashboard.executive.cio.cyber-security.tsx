import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioCyberSecurityPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioCyberSecurityPage"),
  "CioCyberSecurityPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/cyber-security")({
  head: () => ({ meta: [{ title: "Cyber Security — CIO Portal" }] }),
  component: CioCyberSecurityPage,
});
