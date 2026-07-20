import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const DocumentGeneratorPage = lazyFeaturePage(
  () => import("./ai.document-generator") as any,
  "DocumentGeneratorPage"
);

export const Route = createFileRoute("/dashboard/ai-hub/document-generator")({
  head: () => ({ meta: [{ title: "AI Document Generator — Aurix" }] }),
  component: DocumentGeneratorPage,
});
