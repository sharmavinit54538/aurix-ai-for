import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { aurix } from "@/lib/aurix-store";
import { canAccessDocumentsRoute } from "@/features/documents/lib/permissions";
import { getDefaultDashboardPath } from "@/lib/route-guards";

const DocumentsPage = lazyFeaturePage(() => import("@/pages/DocumentsPage"));

export const Route = createFileRoute("/dashboard/resources/documents")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const user = aurix.get().user;
      if (!canAccessDocumentsRoute(user?.role)) {
        throw redirect({
          to: getDefaultDashboardPath(user?.role) as string as never,
        });
      }
    }
  },
  head: () => ({ meta: [{ title: "Documents — OFC360" }] }),
  component: DocumentsPage,
});
