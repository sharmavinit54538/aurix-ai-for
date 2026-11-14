import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VerifyDocumentsPage = lazyFeaturePage(
  () => import("@/features/document-verification/pages/VerifyDocumentsPage"),
  "VerifyDocumentsPage",
);

export const Route = createFileRoute("/verify-documents/")({
  head: () => ({ meta: [{ title: "Document Verification — OFC360" }] }),
  component: VerifyDocumentsPage,
});
