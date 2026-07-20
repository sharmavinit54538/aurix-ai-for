import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/talent")({
  head: () => ({ meta: [{ title: "Talent Management — Aurix" }] }),
  component: TalentLayout,
});

function TalentLayout() {
  return <Outlet />;
}
