import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CtoDatabasePage = lazyFeaturePage(
  () => import("@/features/cto/pages/CtoDatabasePage"),
  "CtoDatabasePage"
);

export const Route = createFileRoute("/dashboard/executive/cto/database")({
  head: () => ({ meta: [{ title: "Database Hub — OFC360 CTO" }] }),
  component: CtoDatabasePage,
});
