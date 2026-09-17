import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const EmployeeMyDocumentsPage = lazyFeaturePage(() => import("@/pages/EmployeeMyDocumentsPage"));

export const Route = createFileRoute("/dashboard/documents")({
  head: () => ({ meta: [{ title: "My Documents — OFC360 HR" }] }),
  component: EmployeeMyDocumentsPage,
});
