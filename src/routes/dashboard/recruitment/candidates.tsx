import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/recruitment/candidates")({
  head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
  component: () => <Outlet />,
});
