import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — OFC360" }] }),
  component: SettingsLayout,
});

function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div className="w-full min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
