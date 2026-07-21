import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const Page = lazyFeaturePage(
  () => import("@/features/admin/recruitment/pages/RecruitmentImportExportPage"),
  "RecruitmentImportExportPage",
);

export const Route = createFileRoute("/dashboard/recruitment/import-export")({
  head: () => ({ meta: [{ title: "Import / Export — Recruitment" }] }),
  component: Page,
});
