import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const DocumentGeneratorPage = lazyFeaturePage(() => import("@/pages/DocumentGeneratorPage"));

export const Route = createFileRoute("/ai/document-generator")({
  head: () => ({ meta: [{ title: "AI Document Generator — Aurix" }] }),
  component: DocumentGeneratorPage,
});
