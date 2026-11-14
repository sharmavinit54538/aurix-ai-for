import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cto/pages/CtoDatabasePage"));

export const Route = createFileRoute("/dashboard/executive/cto/database")({
  head: () => ({ meta: [{ title: "Database Hub — OFC360" }] }),
  component: PageComponent,
});
