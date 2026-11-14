import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/DocumentsPage"));

export const Route = createFileRoute("/dashboard/resources/documents")({
  head: () => ({ meta: [{ title: "Documents — OFC360" }] }),
  component: PageComponent,
});
