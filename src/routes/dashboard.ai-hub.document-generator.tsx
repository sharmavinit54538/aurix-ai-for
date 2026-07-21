import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const DocumentGeneratorPage = lazyFeaturePage(() => import("@/pages/DocumentGeneratorPage"));

export const Route = createFileRoute("/dashboard/ai-hub/document-generator")({
  head: () => ({ meta: [{ title: "Document Generator — Aurix" }] }),
  component: DocumentGeneratorPage,
});
