import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const DocumentsPage = lazyFeaturePage(() => import("@/pages/DocumentsPage"));

export const Route = createFileRoute("/dashboard/resources/documents")({
  head: () => ({ meta: [{ title: "Documents — Aurix" }] }),
  component: DocumentsPage,
});
