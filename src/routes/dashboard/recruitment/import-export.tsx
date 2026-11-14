import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/RecruitmentImportExportPage"));

export const Route = createFileRoute("/dashboard/recruitment/import-export")({
  head: () => ({ meta: [{ title: "Import & Export — OFC360" }] }),
  component: PageComponent,
});
