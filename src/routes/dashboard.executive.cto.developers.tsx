import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoDevelopersPage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoDevelopersPage"),
  "CtoDevelopersPage"
);

export const Route = createFileRoute("/dashboard/executive/cto/developers")({
  head: () => ({ meta: [{ title: "Developers Directory — Aurix CTO" }] }),
  component: CtoDevelopersPage,
});
