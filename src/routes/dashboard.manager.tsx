import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const ManagerPage = lazyFeaturePage(
  () => import("@/features/portal/manager/pages/ManagerPage"),
  "ManagerPage",
);

export const Route = createFileRoute("/dashboard/manager")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurix HR" },
      {
        name: "description",
        content:
          "Aurix HR Dashboard — manage your team's attendance, leave, performance, assets, recruitment and more from one place.",
      },
    ],
  }),
  component: ManagerPage,
});
