import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const DocumentsPage = lazyFeaturePage(() => import("@/pages/DocumentsPage"));

export const Route = createFileRoute("/dashboard/documents")({
  head: () => ({ meta: [{ title: "Document Management — Aurix" }] }),
  component: DocumentsPage,
});
