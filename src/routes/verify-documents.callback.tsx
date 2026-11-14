import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VerifyDocumentsCallbackPage = lazyFeaturePage(
  () => import("@/features/document-verification/pages/VerifyDocumentsCallbackPage"),
  "VerifyDocumentsCallbackPage",
);

export const Route = createFileRoute("/verify-documents/callback")({
  head: () => ({ meta: [{ title: "Verifying Documents — OFC360" }] }),
  component: VerifyDocumentsCallbackPage,
});
