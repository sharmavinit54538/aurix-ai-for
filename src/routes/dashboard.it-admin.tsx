import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ItAdminPage = lazyFeaturePage(
  () => import("@/features/admin/itAdmin/pages/ItAdminPage"),
  "ItAdminPage",
);

export const Route = createFileRoute("/dashboard/it-admin")({
  head: () => ({ meta: [{ title: "IT Administrators — OFC360" }] }),
  component: ItAdminPage,
});
