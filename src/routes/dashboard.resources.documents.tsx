import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const DocumentsPage = lazyFeaturePage(
  () => import("./dashboard.documents") as any,
  "DocumentsPage"
);

export const Route = createFileRoute("/dashboard/resources/documents")({
  head: () => ({ meta: [{ title: "Documents — Aurix" }] }),
  component: DocumentsPage,
});
